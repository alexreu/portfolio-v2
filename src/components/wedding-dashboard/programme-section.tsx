"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { addDays, daysBetween, weddingCalendar } from "@/lib/wedding-dashboard/calendar";
import type { DraftIssue } from "@/lib/wedding-dashboard/drafts";
import {
    momentKeyFor,
    momentsFromPlans,
    validateMoment,
} from "@/lib/wedding-dashboard/programme-plan";
import type { HouseholdRecord, MomentPlan, SlotPlan } from "@/lib/wedding-dashboard/types";
import { formatHour } from "@/lib/wedding/format-hour";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { cormorant } from "@/app/fonts/wedding";

import { ConfirmPopover } from "./confirm-popover";
import {
    buttonStyles,
    Card,
    FieldError,
    iconButton,
    inputStyles,
    issueMessages,
    plural,
} from "./dashboard-ui";

type ProgrammeSectionProps = {
    moments: readonly MomentPlan[];
    households: readonly HouseholdRecord[];
    weddingDay: string;
    onSave: (moment: MomentPlan, inviteAll: boolean) => void;
    onRemove: (moment: MomentPlan) => void;
};

/** "le jour J", "la veille", "3 jours avant", "le lendemain". */
const relativeDay = (offset: number) => {
    if (offset === 0) return "le jour J";
    if (offset === -1) return "la veille";
    if (offset === 1) return "le lendemain";
    return offset < 0 ? `${-offset} jours avant` : `${offset} jours après`;
};

/** "Samedi 12 juin": moments can be weeks apart, the mairie a week earlier. */
const weekday = (iso: string) => {
    const day = new Date(iso).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Europe/Paris",
    });
    return `${day.charAt(0).toUpperCase()}${day.slice(1)}`;
};

const newSlot = (): SlotPlan => ({
    id: Math.random().toString(36).slice(2, 8),
    title: "",
    place: "",
    dayOffset: 0,
    start: "16:00",
    end: "",
});

const issueAt = (issues: readonly DraftIssue[], path: string) =>
    issues.find((issue) => issue.path === path);

type MomentFormProps = {
    initial: MomentPlan | null;
    takenKeys: readonly string[];
    householdCount: number;
    weddingDay: string;
    onSave: (moment: MomentPlan, inviteAll: boolean) => void;
};

const MomentForm = ({
    initial,
    takenKeys,
    householdCount,
    weddingDay,
    onSave,
}: MomentFormProps) => {
    const [draft, setDraft] = useState<MomentPlan>(
        initial ?? { key: "", title: "", slots: [newSlot()] },
    );
    const [inviteAll, setInviteAll] = useState(true);
    const [issues, setIssues] = useState<readonly DraftIssue[]>([]);

    useScrollLock();

    const setSlot = (index: number, change: Partial<SlotPlan>) =>
        setDraft((current) => ({
            ...current,
            slots: current.slots.map((slot, at) => (at === index ? { ...slot, ...change } : slot)),
        }));

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = validateMoment(draft);
        if (!result.ok) return setIssues(result.error);
        onSave(
            { ...result.value, key: initial?.key ?? momentKeyFor(result.value.title, takenKeys) },
            initial === null && inviteAll,
        );
    };

    const titleIssue = issueAt(issues, "title");

    return (
        <form noValidate onSubmit={submit} aria-label="Moment" className="grid gap-5">
            {issues.length > 0 && (
                <p
                    role="alert"
                    className="border-wed-no/40 text-wed-no rounded-xl border p-3 text-sm"
                >
                    Il reste {plural(issues.length, "point", "points")} à corriger.
                </p>
            )}
            <label className="grid gap-1.5 text-sm">
                <span className="text-wed-ink-soft">Nom du moment</span>
                <input
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    placeholder="Mairie, Cérémonie, Dîner & soirée…"
                    aria-invalid={Boolean(titleIssue)}
                    aria-describedby={titleIssue ? "moment-titre-erreur" : undefined}
                    className={inputStyles}
                />
                <FieldError
                    id="moment-titre-erreur"
                    message={titleIssue && issueMessages[titleIssue.code]}
                />
            </label>

            <fieldset className="grid gap-3">
                <legend className="text-wed-ink-soft mb-1.5 text-sm">Horaires</legend>
                {draft.slots.map((slot, index) => {
                    const field = (name: keyof SlotPlan) => {
                        const issue = issueAt(issues, `slots.${index}.${name}`);
                        return {
                            invalid: Boolean(issue),
                            describedBy: issue ? `horaire-${index}-${name}-erreur` : undefined,
                            error: (
                                <FieldError
                                    id={`horaire-${index}-${name}-erreur`}
                                    message={issue && issueMessages[issue.code]}
                                />
                            ),
                        };
                    };
                    const title = field("title");
                    const start = field("start");
                    const end = field("end");
                    return (
                        <div
                            key={slot.id}
                            className="border-wed-line-soft bg-wed-ivory/60 grid gap-3 rounded-2xl border p-3.5 sm:grid-cols-2"
                        >
                            <label className="grid content-start gap-1 text-sm">
                                <span className="text-wed-muted">Intitulé</span>
                                <input
                                    value={slot.title}
                                    onChange={(event) =>
                                        setSlot(index, { title: event.target.value })
                                    }
                                    placeholder="Cérémonie laïque"
                                    aria-invalid={title.invalid}
                                    aria-describedby={title.describedBy}
                                    className={inputStyles}
                                />
                                {title.error}
                            </label>
                            <label className="grid content-start gap-1 text-sm">
                                <span className="text-wed-muted">Lieu</span>
                                <input
                                    value={slot.place}
                                    onChange={(event) =>
                                        setSlot(index, { place: event.target.value })
                                    }
                                    placeholder="Sous les platanes"
                                    className={inputStyles}
                                />
                            </label>
                            <div className="grid content-start gap-1 text-sm sm:col-span-2">
                                <label htmlFor={`horaire-${index}-date`} className="text-wed-muted">
                                    Date
                                </label>

                                <input
                                    id={`horaire-${index}-date`}
                                    type="date"
                                    value={addDays(weddingDay, slot.dayOffset)}
                                    onChange={(event) =>
                                        event.target.value &&
                                        setSlot(index, {
                                            dayOffset: daysBetween(weddingDay, event.target.value),
                                        })
                                    }
                                    aria-describedby={`horaire-${index}-jour`}
                                    className={inputStyles}
                                />
                                <span
                                    id={`horaire-${index}-jour`}
                                    className="text-wed-muted text-xs"
                                >
                                    {relativeDay(slot.dayOffset)}
                                </span>
                            </div>
                            <label className="grid content-start gap-1 text-sm">
                                <span className="text-wed-muted">Début</span>
                                <input
                                    type="time"
                                    value={slot.start}
                                    onChange={(event) =>
                                        setSlot(index, { start: event.target.value })
                                    }
                                    aria-invalid={start.invalid}
                                    aria-describedby={start.describedBy}
                                    className={inputStyles}
                                />
                                {start.error}
                            </label>
                            <label className="grid content-start gap-1 text-sm">
                                <span className="text-wed-muted">
                                    Fin <small>(facultative)</small>
                                </span>
                                <input
                                    type="time"
                                    value={slot.end}
                                    onChange={(event) =>
                                        setSlot(index, { end: event.target.value })
                                    }
                                    aria-invalid={end.invalid}
                                    aria-describedby={end.describedBy}
                                    className={inputStyles}
                                />
                                {end.error}
                            </label>
                            {draft.slots.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDraft({
                                            ...draft,
                                            slots: draft.slots.filter((_, at) => at !== index),
                                        })
                                    }
                                    className={cn(
                                        buttonStyles.quiet,
                                        "justify-self-start sm:col-span-2",
                                    )}
                                >
                                    <Trash2 aria-hidden="true" />
                                    Retirer cet horaire
                                </button>
                            )}
                        </div>
                    );
                })}
                <button
                    type="button"
                    onClick={() => setDraft({ ...draft, slots: [...draft.slots, newSlot()] })}
                    className={cn(buttonStyles.quiet, "justify-self-start")}
                >
                    <Plus aria-hidden="true" />
                    Ajouter un horaire
                </button>
            </fieldset>

            {initial === null && householdCount > 0 && (
                <label className="text-wed-ink-soft flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={inviteAll}
                        onChange={(event) => setInviteAll(event.target.checked)}
                        className="accent-wed-ink size-4.5"
                    />
                    Inviter les {householdCount} foyers déjà sur la liste
                </label>
            )}

            <button type="submit" className={cn(buttonStyles.primary, "min-h-12 w-full")}>
                {initial ? "Enregistrer le moment" : "Ajouter le moment"}
            </button>
        </form>
    );
};

/** The moments of the wedding: each one is one invitation and one answer. */
export const ProgrammeSection = ({
    moments,
    households,
    weddingDay,
    onSave,
    onRemove,
}: ProgrammeSectionProps) => {
    const [editing, setEditing] = useState<MomentPlan | "new" | null>(null);
    const dated = momentsFromPlans(moments, weddingDay);
    const plans = new Map(moments.map((moment) => [moment.key, moment]));
    const invited = (key: string) =>
        households.filter((household) => household.momentKeys.includes(key)).length;
    const calendar = weddingCalendar(weddingDay);

    return (
        <Card
            id="programme"
            title="Programme"
            titleId="programme-titre"
            aside={
                <button
                    type="button"
                    onClick={() => setEditing("new")}
                    className={buttonStyles.secondary}
                >
                    <Plus aria-hidden="true" />
                    Ajouter un moment
                </button>
            }
        >
            <p className="text-wed-muted px-5 pt-4 text-sm">
                Un moment = une invitation et une réponse. Chaque foyer ne voit que les moments
                auxquels il est convié, autour du {calendar.dateLabel.toLowerCase()}.
            </p>
            <ul className="divide-wed-line-soft divide-y px-5 py-2">
                {dated.map((moment) => {
                    const plan = plans.get(moment.key);
                    return (
                        <li
                            key={moment.key}
                            className="grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-start"
                        >
                            <div>
                                <p className="font-wed-serif text-2xl leading-tight font-medium">
                                    {moment.title}
                                </p>
                                <p className="text-wed-muted text-xs">
                                    {plural(invited(moment.key), "foyer invité", "foyers invités")}
                                </p>
                                <ul className="text-wed-ink-soft mt-2 grid gap-1 text-sm">
                                    {moment.slots.map((slot) => (
                                        <li key={slot.startsAt + slot.title}>
                                            <span className="text-wed-ink font-medium">
                                                {weekday(slot.startsAt)} ·{" "}
                                                {formatHour(slot.startsAt)}
                                                {slot.endsAt && ` – ${formatHour(slot.endsAt)}`}
                                            </span>{" "}
                                            {slot.title}
                                            {slot.place && (
                                                <span className="text-wed-muted">
                                                    {" "}
                                                    · {slot.place}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {plan && (
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setEditing(plan)}
                                        aria-label={`Modifier ${moment.title}`}
                                        className={iconButton}
                                    >
                                        <Pencil aria-hidden="true" />
                                    </button>
                                    <ConfirmPopover
                                        question={`Retirer « ${moment.title} » ?`}
                                        detail={`Il disparaît du programme et des invitations de ${plural(invited(moment.key), "foyer", "foyers")}, avec leurs réponses.`}
                                        confirmLabel="Retirer"
                                        align="end"
                                        onConfirm={() => onRemove(plan)}
                                    >
                                        <button
                                            type="button"
                                            aria-label={`Retirer ${moment.title}`}
                                            className={iconButton}
                                        >
                                            <Trash2 aria-hidden="true" />
                                        </button>
                                    </ConfirmPopover>
                                </div>
                            )}
                        </li>
                    );
                })}
                {dated.length === 0 && (
                    <li className="text-wed-muted py-8 text-center text-sm">
                        Aucun moment pour l&apos;instant.
                    </li>
                )}
            </ul>

            <Dialog.Root open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-wed-night/55 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50" />
                    <Dialog.Content
                        data-lenis-prevent
                        className={`${cormorant.variable} bg-wed-paper text-wed-ink font-main data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] motion-reduce:animate-none sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[min(38rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-7`}
                    >
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <Dialog.Title className="font-wed-serif text-3xl leading-tight font-medium">
                                    {editing === "new" ? "Nouveau moment" : "Modifier le moment"}
                                </Dialog.Title>
                                <Dialog.Description className="text-wed-muted mt-1 text-sm">
                                    Les heures s&apos;affichent telles quelles sur le site des
                                    invités.
                                </Dialog.Description>
                            </div>
                            <Dialog.Close aria-label="Fermer" className={iconButton}>
                                <X aria-hidden="true" />
                            </Dialog.Close>
                        </div>
                        {editing !== null && (
                            <MomentForm
                                initial={editing === "new" ? null : editing}
                                takenKeys={moments.map((moment) => moment.key)}
                                householdCount={households.length}
                                weddingDay={weddingDay}
                                onSave={(moment, inviteAll) => {
                                    onSave(moment, inviteAll);
                                    setEditing(null);
                                }}
                            />
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </Card>
    );
};
