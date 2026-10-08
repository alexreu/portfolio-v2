"use client";

import { useState } from "react";
import Link from "next/link";
import {
    localDay,
    personalize,
    previewOf,
    THANKS_MAX,
    thanksOf,
    validateDesign,
    weddingCalendar,
    type DraftIssue,
    type InvitationDesign,
} from "@alexreu/wedding-core";
import { Check, ExternalLink, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { sealToneOf, type SealTone } from "@/lib/wedding-demo/tones";
import { InvitationEnvelope } from "@/components/wedding-demo/invitation-envelope";

import { dashboardHref } from "./dashboard-pages";
import { buttonStyles, FieldError, inputStyles } from "./dashboard-ui";

type InvitationEditorProps = {
    design: InvitationDesign;
    /** The household the preview greets, as the site would. */
    sampleGuest: string;
    now: Date;
    /** Where the wedding takes place: "today" is read there. */
    timezone: string;
    onSave: (design: InvitationDesign) => void;
};

const WELCOME_MAX = 220;

const tones: readonly { value: SealTone; label: string; swatch: string }[] = [
    { value: "olive", label: "Olivier", swatch: "bg-demo-olive" },
    { value: "earth", label: "Terre", swatch: "bg-demo-earth" },
    { value: "ink", label: "Encre", swatch: "bg-demo-ink" },
];

const messages: Partial<Record<DraftIssue["code"], string>> = {
    required: "À renseigner.",
    "too-long": "Un peu long : raccourcissez.",
    "date-invalid": "Date invalide.",
    "date-past": "Choisissez une date à venir.",
};

const issueAt = (issues: readonly DraftIssue[], path: keyof InvitationDesign) =>
    issues.find((issue) => issue.path === path);

/** A message left out reads as an empty one: neither makes the editor think it changed. */
const sameDesign = (a: InvitationDesign, b: InvitationDesign) =>
    ([...new Set([...Object.keys(a), ...Object.keys(b)])] as (keyof InvitationDesign)[])
        .filter((key) => key !== "date")
        .every((key) => (a[key] ?? "") === (b[key] ?? ""));

/** What every guest discovers first: names, date, place, greeting and the colour of the seal. */
export const InvitationEditor = ({
    design,
    sampleGuest,
    now,
    timezone,
    onSave,
}: InvitationEditorProps) => {
    const [draft, setDraft] = useState(design);
    const [issues, setIssues] = useState<readonly DraftIssue[]>([]);
    const [saved, setSaved] = useState(false);
    const [opening, setOpening] = useState(false);
    const [take, setTake] = useState(0);
    const today = localDay(now, timezone);
    /** The date is set in « Dates clés »: the editor always works on the saved one. */
    const check = validateDesign({ ...draft, date: design.date }, today);
    /** The preview keeps the last valid date while one is being typed. */
    const previewDate = design.date;
    const dirty = !sameDesign(draft, design);

    const change = (patch: Partial<InvitationDesign>) => {
        setDraft((current) => ({ ...current, ...patch }));
        setSaved(false);
    };

    const replay = () => {
        setOpening(false);
        setTake((current) => current + 1);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!check.ok) return setIssues(check.error);
        setIssues([]);
        onSave(check.value);
        setDraft(check.value);
        setSaved(true);
    };

    const field = (path: keyof InvitationDesign) => {
        const issue = issueAt(issues, path);
        return {
            "aria-invalid": Boolean(issue),
            "aria-describedby": issue ? `faire-part-${path}-erreur` : undefined,
            error: (
                <FieldError
                    id={`faire-part-${path}-erreur`}
                    message={issue && messages[issue.code]}
                />
            ),
        };
    };
    const first = field("first");
    const second = field("second");
    const place = field("place");
    const welcome = field("welcome");
    const thanks = field("thanks");

    return (
        <section
            id="faire-part"
            aria-labelledby="faire-part-titre-section"
            className="border-wed-line-soft bg-wed-paper grid overflow-hidden rounded-2xl border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
        >
            <form noValidate onSubmit={submit} className="grid content-start gap-5 p-5 md:p-7">
                <div>
                    <h2
                        id="faire-part-titre-section"
                        className="font-wed-serif text-3xl leading-tight font-medium"
                    >
                        Votre faire-part
                    </h2>
                    <p className="text-wed-muted mt-1 text-sm">
                        Ce que chaque invité découvre en ouvrant son lien. Enregistré, il
                        s&apos;applique aussitôt au site.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid content-start gap-1.5 text-sm">
                        <span className="text-wed-ink-soft">Premier prénom</span>
                        <input
                            value={draft.first}
                            onChange={(event) => change({ first: event.target.value })}
                            aria-invalid={first["aria-invalid"]}
                            aria-describedby={first["aria-describedby"]}
                            className={inputStyles}
                        />
                        {first.error}
                    </label>
                    <label className="grid content-start gap-1.5 text-sm">
                        <span className="text-wed-ink-soft">Second prénom</span>
                        <input
                            value={draft.second}
                            onChange={(event) => change({ second: event.target.value })}
                            aria-invalid={second["aria-invalid"]}
                            aria-describedby={second["aria-describedby"]}
                            className={inputStyles}
                        />
                        {second.error}
                    </label>
                    <label className="grid content-start gap-1.5 text-sm">
                        <span className="text-wed-ink-soft">Lieu, sous la date</span>
                        <input
                            value={draft.place}
                            onChange={(event) => change({ place: event.target.value })}
                            placeholder="Luberon, Annecy…"
                            aria-invalid={place["aria-invalid"]}
                            aria-describedby={place["aria-describedby"]}
                            className={inputStyles}
                        />
                        {place.error}
                    </label>
                    <p className="text-wed-muted self-end pb-3 text-xs">
                        La date se règle dans{" "}
                        <Link
                            href={`${dashboardHref("programme")}#dates`}
                            className="text-wed-ink-soft underline underline-offset-4"
                        >
                            Programme et dates
                        </Link>
                        .
                    </p>
                </div>
                <label className="grid gap-1.5 text-sm">
                    <span className="text-wed-ink-soft">Mot d&apos;accueil sur le site</span>
                    <textarea
                        rows={3}
                        value={draft.welcome}
                        onChange={(event) => change({ welcome: event.target.value })}
                        aria-invalid={welcome["aria-invalid"]}
                        aria-describedby={["faire-part-welcome-aide", welcome["aria-describedby"]]
                            .filter(Boolean)
                            .join(" ")}
                        className={cn(inputStyles, "py-3")}
                    />
                    <span
                        id="faire-part-welcome-aide"
                        className="text-wed-muted flex justify-between gap-3 text-xs"
                    >
                        <span>
                            <code className="text-wed-ink-soft">{"{invités}"}</code> devient le nom
                            du foyer
                        </span>
                        <span className={cn(draft.welcome.length > WELCOME_MAX && "text-wed-no")}>
                            {draft.welcome.length} / {WELCOME_MAX}
                        </span>
                    </span>
                    {welcome.error}
                    <span className="font-demo-serif text-wed-ink-soft border-wed-line border-l-2 pl-3 italic">
                        {personalize(draft.welcome.trim() || design.welcome, sampleGuest)}
                    </span>
                </label>
                <label className="grid gap-1.5 text-sm">
                    <span className="text-wed-ink-soft">
                        Message du lendemain{" "}
                        <small className="text-wed-muted">
                            (au-dessus des photos, après le mariage)
                        </small>
                    </span>
                    <textarea
                        rows={2}
                        value={draft.thanks ?? ""}
                        onChange={(event) => change({ thanks: event.target.value })}
                        placeholder={thanksOf({ ...draft, thanks: "" })}
                        aria-invalid={thanks["aria-invalid"]}
                        aria-describedby={["faire-part-thanks-aide", thanks["aria-describedby"]]
                            .filter(Boolean)
                            .join(" ")}
                        className={cn(inputStyles, "py-3")}
                    />
                    <span
                        id="faire-part-thanks-aide"
                        className="text-wed-muted flex justify-between gap-3 text-xs"
                    >
                        <span>
                            Laissé vide, ce message par défaut s&apos;affiche.{" "}
                            <a
                                href={previewOf("/mariage/demo?apres")}
                                target="_blank"
                                rel="noopener"
                                className="text-wed-ink-soft underline underline-offset-4"
                            >
                                Voir le lendemain
                            </a>
                        </span>
                        <span
                            className={cn(
                                (draft.thanks ?? "").length > THANKS_MAX && "text-wed-no",
                            )}
                        >
                            {(draft.thanks ?? "").length} / {THANKS_MAX}
                        </span>
                    </span>
                    {thanks.error}
                </label>
                <fieldset>
                    <legend className="text-wed-ink-soft mb-2 text-sm">Couleur du sceau</legend>
                    <div className="flex flex-wrap gap-2">
                        {tones.map((tone) => (
                            <label
                                key={tone.value}
                                className="border-wed-line has-checked:border-wed-ink has-checked:bg-wed-ivory relative flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border py-1 pr-4 pl-1.5 text-sm transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="ton-du-sceau"
                                    value={tone.value}
                                    checked={draft.tone === tone.value}
                                    onChange={() => change({ tone: tone.value })}
                                    className="absolute inset-0 cursor-pointer appearance-none rounded-full"
                                />
                                <span
                                    aria-hidden="true"
                                    className={cn("size-7 rounded-full", tone.swatch)}
                                />
                                {tone.label}
                            </label>
                        ))}
                    </div>
                </fieldset>
                <div className="flex flex-wrap items-center gap-2">
                    <button type="submit" disabled={!dirty} className={buttonStyles.primary}>
                        Enregistrer le faire-part
                    </button>
                    {dirty && (
                        <button
                            type="button"
                            onClick={() => {
                                setDraft(design);
                                setIssues([]);
                            }}
                            className={buttonStyles.quiet}
                        >
                            Annuler les changements
                        </button>
                    )}
                    <p role="status" className="text-wed-yes flex items-center gap-1.5 text-sm">
                        {saved && !dirty && (
                            <>
                                <Check aria-hidden="true" className="size-4" />
                                Enregistré, le site est à jour.
                            </>
                        )}
                    </p>
                </div>
            </form>

            <div className="bg-demo-paper relative flex min-h-[38rem] flex-col items-center justify-end gap-6 overflow-hidden bg-[radial-gradient(ellipse_at_50%_60%,var(--demo-card),var(--demo-paper)_70%)] px-5 pt-10 pb-7">
                <p className="text-demo-muted absolute top-5 left-5 text-xs">
                    Aperçu · {sampleGuest}
                </p>
                <InvitationEnvelope
                    key={take}
                    first={draft.first.trim() || design.first}
                    second={draft.second.trim() || design.second}
                    dateLabel={`${weddingCalendar(previewDate).dateLabel} · ${draft.place.trim() || design.place}`}
                    tone={sealToneOf(draft.tone)}
                    opening={opening}
                    onSealTouched={() => setOpening(true)}
                    sealLabel="Voir l'ouverture du faire-part"
                    title={{ as: "p" }}
                    className="mb-6 w-[min(100%,24rem)]"
                />
                <div className="flex flex-wrap justify-center gap-2">
                    {opening ? (
                        <button type="button" onClick={replay} className={buttonStyles.secondary}>
                            <RotateCcw aria-hidden="true" />
                            Refermer l&apos;enveloppe
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setOpening(true)}
                            className={buttonStyles.secondary}
                        >
                            Voir l&apos;ouverture
                        </button>
                    )}
                    <a
                        href={previewOf("/mariage/demo")}
                        target="_blank"
                        rel="noopener"
                        className={buttonStyles.quiet}
                    >
                        <ExternalLink aria-hidden="true" />
                        Voir comme un invité
                    </a>
                </div>
            </div>
        </section>
    );
};
