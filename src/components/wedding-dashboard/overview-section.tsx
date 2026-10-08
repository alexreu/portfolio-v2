"use client";

import { Clock, Download, Plus, Send } from "lucide-react";

import { daysUntil, sinceLabel, type WeddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { catererSummary, momentTallies, overview } from "@/lib/wedding-dashboard/stats";
import type { DemoState } from "@/lib/wedding-dashboard/types";
import { formatHour } from "@/lib/wedding/format-hour";
import type { Moment } from "@/lib/wedding/types";

import { buttonStyles, Card, PlanBadge, plural } from "./dashboard-ui";
import { PdfButton } from "./pdf-button";

type OverviewSectionProps = {
    state: DemoState;
    moments: readonly Moment[];
    calendar: WeddingCalendar;
    now: Date;
    /** Each action is left out for whoever may not do it, and its button with it. */
    onAddHousehold?: () => void;
    onExport?: () => void;
    /** Builds the caterer's PDF and downloads it; out with the diets it holds. */
    onExportCaterer?: () => Promise<void>;
    onRemind?: () => void;
};

const DINNER = "diner";

const todayLabel = (now: Date) => {
    const label = now.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Paris",
    });
    return `${label.charAt(0).toUpperCase()}${label.slice(1)}`;
};

const countdownLabel = (days: number) => {
    if (days > 0) return `J-${days} avant le mariage`;
    return days === 0 ? "C'est aujourd'hui !" : "Le mariage a eu lieu";
};

/** "Samedi · 16 h": when the moment starts. */
const momentStart = (moment: Moment) => {
    const start = moment.slots[0]?.startsAt;
    if (!start) return "";
    const day = new Date(start).toLocaleDateString("fr-FR", {
        weekday: "long",
        timeZone: "Europe/Paris",
    });
    return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${formatHour(start)}`;
};

const pendingSentence = (households: number, pending: number, neverOpened: number) => {
    if (households === 0) return "Aucun foyer pour l'instant : créez votre premier faire-part.";
    if (pending === 0) return "Tous les foyers ont répondu.";
    const never =
        neverOpened > 0
            ? `, dont ${neverOpened} qui ${neverOpened > 1 ? "n'ont" : "n'a"} jamais ouvert leur lien`
            : "";
    return `${plural(pending, "foyer n'a", "foyers n'ont")} pas encore répondu${never}.`;
};

const percent = (part: number, whole: number) =>
    whole === 0 ? 0 : Math.round((part / whole) * 100);

const Kpi = ({
    label,
    value,
    of,
    detail,
    progress,
    plan,
}: {
    label: string;
    value: string;
    of?: string;
    detail: string;
    progress?: number;
    /** The section's formula, when not every one has it. */
    plan?: string;
}) => (
    <div className="border-wed-line-soft bg-wed-paper rounded-2xl border px-5 py-4.5">
        <dt className="text-wed-muted flex flex-wrap items-center gap-2 text-[0.8rem]">
            {label}
            {plan && <PlanBadge section={plan} />}
        </dt>
        <dd>
            <span className="font-wed-serif mt-1 block text-[2.6rem] leading-none font-medium lining-nums">
                {value}
                {of && (
                    <small className="font-main text-wed-muted ml-1.5 text-sm font-normal">
                        {of}
                    </small>
                )}
            </span>
            {progress !== undefined && (
                <span
                    aria-hidden="true"
                    className="bg-wed-line-soft mt-3 block h-1.5 overflow-hidden rounded-full"
                >
                    <span
                        className="bg-wed-yes block h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </span>
            )}
            <span className="text-wed-muted mt-2 block text-[0.8rem]">{detail}</span>
        </dd>
    </div>
);

export const OverviewSection = ({
    state,
    moments,
    calendar,
    now,
    onAddHousehold,
    onExport,
    onExportCaterer,
    onRemind,
}: OverviewSectionProps) => {
    const counts = overview(state.households);
    const tallies = momentTallies(state.households, moments);
    const dinner = tallies.find((tally) => tally.key === DINNER);
    const caterer = catererSummary(state.households, DINNER);
    const deadlineIn = daysUntil(calendar.answerDeadline, now);
    const answeredShare = percent(counts.guestsAnswered, counts.guests);

    return (
        <div id="apercu" className="grid grid-cols-[minmax(0,1fr)] gap-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-wed-serif text-[2.6rem] leading-tight font-medium">
                        Bonjour {state.design.first} &amp; {state.design.second}
                    </h1>
                    <p className="text-wed-muted">
                        {todayLabel(now)} · {countdownLabel(daysUntil(calendar.day, now))}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {onExport && (
                        <button type="button" onClick={onExport} className={buttonStyles.secondary}>
                            <Download aria-hidden="true" />
                            Exporter CSV
                        </button>
                    )}
                    {onAddHousehold && (
                        <button
                            type="button"
                            onClick={onAddHousehold}
                            className={buttonStyles.primary}
                        >
                            <Plus aria-hidden="true" />
                            Créer un faire-part
                        </button>
                    )}
                </div>
            </div>

            <div className="border-wed-gold-soft/60 bg-wed-wait-bg text-wed-ink-soft flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border px-5 py-3.5">
                <Clock aria-hidden="true" className="text-wed-wait size-5 shrink-0" />
                <p className="min-w-0 flex-1 basis-80">
                    {deadlineIn >= 0 ? (
                        <>
                            <strong className="font-semibold">
                                Date limite dans {plural(deadlineIn, "jour", "jours")}
                            </strong>{" "}
                            ({calendar.answerDeadlineLabel}).{" "}
                            {pendingSentence(counts.households, counts.pending, counts.neverOpened)}{" "}
                            Relance automatique prévue le {calendar.reminderLabel}{" "}
                            <PlanBadge section="relances" />
                        </>
                    ) : (
                        <strong className="font-semibold">
                            Les réponses sont closes depuis le {calendar.answerDeadlineLabel}.
                        </strong>
                    )}
                    {state.lastReminder && (
                        <span className="text-wed-muted mt-0.5 block text-sm">
                            Dernière relance : {sinceLabel(state.lastReminder.at, now)}, à{" "}
                            {plural(state.lastReminder.count, "foyer", "foyers")}.
                        </span>
                    )}
                </p>
                {onRemind && (
                    <button
                        type="button"
                        onClick={onRemind}
                        disabled={counts.pending === 0}
                        className={buttonStyles.secondary}
                    >
                        <Send aria-hidden="true" />
                        Relancer maintenant
                    </button>
                )}
            </div>

            <dl aria-label="Indicateurs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi
                    label="Réponses reçues"
                    value={String(counts.guestsAnswered)}
                    of={`/ ${counts.guests} invités`}
                    progress={answeredShare}
                    detail={`${answeredShare} % · ${counts.householdsAnswered} foyers sur ${counts.households}`}
                />
                <Kpi
                    label="Présents au dîner"
                    value={String(dinner?.yes ?? 0)}
                    detail={`dont ${plural(caterer.children, "enfant", "enfants")} · ${plural(dinner?.no ?? 0, "absent", "absents")}`}
                />
                <Kpi
                    label="Liens ouverts"
                    value={String(counts.householdsOpened)}
                    of={`/ ${counts.households}`}
                    detail={`${plural(counts.neverOpened, "foyer jamais connecté", "foyers jamais connectés")}`}
                />
                <Kpi
                    label="Galerie photos"
                    plan="galerie"
                    value="—"
                    detail={`Ouverture le ${calendar.galleryOpensLabel}`}
                />
            </dl>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <Card
                    title="Réponses par moment"
                    titleId="moments-titre"
                    aside={<span className="text-wed-muted text-[0.8rem]">Invités concernés</span>}
                >
                    <ul className="grid gap-1 px-5 py-4">
                        {tallies.map((tally) => {
                            const moment = moments.find((candidate) => candidate.key === tally.key);
                            const share = (count: number) => `${percent(count, tally.invited)}%`;
                            return (
                                <li
                                    key={tally.key}
                                    className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 py-2 sm:grid-cols-[11rem_1fr_5rem]"
                                >
                                    <p className="font-medium">
                                        {tally.title}
                                        <span className="text-wed-muted block text-xs font-normal">
                                            {moment && momentStart(moment)}
                                        </span>
                                    </p>
                                    <p className="text-wed-muted text-right text-sm sm:order-last">
                                        <b className="text-wed-ink font-semibold">{tally.yes}</b> /{" "}
                                        {tally.invited}
                                    </p>
                                    <span
                                        role="img"
                                        aria-label={`${tally.title} : ${tally.yes} présents, ${tally.no} absents, ${tally.pending} en attente`}
                                        className="bg-wed-line-soft col-span-2 flex h-5 overflow-hidden rounded-md sm:col-span-1"
                                    >
                                        <span
                                            className="bg-wed-yes transition-[width] duration-700"
                                            style={{ width: share(tally.yes) }}
                                        />
                                        <span
                                            className="bg-wed-no/55 transition-[width] duration-700"
                                            style={{ width: share(tally.no) }}
                                        />
                                        <span
                                            className="bg-wed-gold-soft/55 transition-[width] duration-700"
                                            style={{ width: share(tally.pending) }}
                                        />
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="text-wed-muted flex flex-wrap gap-4 px-5 pb-4 text-[0.8rem]">
                        {[
                            ["bg-wed-yes", "Présents"],
                            ["bg-wed-no/55", "Absents"],
                            ["bg-wed-gold-soft/55", "En attente"],
                        ].map(([swatch, label]) => (
                            <span key={label} className="inline-flex items-center gap-1.5">
                                <span
                                    aria-hidden="true"
                                    className={`size-2.5 rounded-xs ${swatch}`}
                                />
                                {label}
                            </span>
                        ))}
                    </p>
                </Card>

                {onExportCaterer && (
                    <Card
                        id="traiteur"
                        title="Récap traiteur · dîner"
                        titleId="traiteur-titre"
                        aside={
                            <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5">
                                <span className="text-wed-muted text-[0.8rem]">
                                    {plural(caterer.total, "couvert", "couverts")}
                                </span>
                                <PdfButton
                                    onExport={onExportCaterer}
                                    ariaLabel="Exporter le récap traiteur en PDF"
                                    className="min-h-9 px-3.5 text-[0.8rem]"
                                >
                                    PDF
                                </PdfButton>
                            </div>
                        }
                    >
                        <dl className="divide-wed-line-soft grid divide-y divide-dashed px-5 py-2">
                            <div className="flex items-center justify-between py-2.5">
                                <dt>
                                    Menu standard
                                    <span className="text-wed-muted block text-xs">adultes</span>
                                </dt>
                                <dd className="font-wed-serif text-2xl font-medium lining-nums">
                                    {caterer.standard}
                                </dd>
                            </div>
                            {caterer.diets.map((diet) => (
                                <div
                                    key={diet.choice}
                                    className="flex items-center justify-between py-2.5"
                                >
                                    <dt>
                                        {diet.label}
                                        {diet.choice === "autre" && caterer.details.length > 0 && (
                                            <span className="text-wed-muted block text-xs">
                                                {caterer.details.join(", ")}
                                            </span>
                                        )}
                                    </dt>
                                    <dd className="font-wed-serif text-2xl font-medium lining-nums">
                                        {diet.count}
                                    </dd>
                                </div>
                            ))}
                            <div className="flex items-center justify-between py-2.5">
                                <dt>
                                    Menu enfant
                                    {caterer.childrenDiets.length > 0 && (
                                        <span className="text-wed-muted block text-xs">
                                            dont {caterer.childrenDiets.join(", ")}
                                        </span>
                                    )}
                                </dt>
                                <dd className="font-wed-serif text-2xl font-medium lining-nums">
                                    {caterer.children}
                                </dd>
                            </div>
                        </dl>
                    </Card>
                )}
            </div>
        </div>
    );
};
