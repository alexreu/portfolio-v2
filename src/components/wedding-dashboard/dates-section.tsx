"use client";

import { useState } from "react";
import {
    automaticDates,
    localDay,
    validateDates,
    weddingCalendar,
    type DateOverrides,
    type DraftIssue,
    type Flag,
    type Opening,
} from "@alexreu/wedding-core";
import { Check, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonStyles, Card, FieldError, inputStyles, PlanBadge } from "./dashboard-ui";

type DatesSectionProps = {
    day: string;
    dates: DateOverrides;
    now: Date;
    /** Where the wedding takes place: "today" is read there. */
    timezone: string;
    onSave: (day: string, dates: DateOverrides) => void;
};

type DayField = "answerDeadline" | "reminder";
type OpeningField = "galleryOpens" | "tablesReveal";

type FieldSpec<Key> = {
    readonly key: Key;
    readonly label: string;
    readonly rule: string;
    readonly error: string;
    /** The formula it comes with, when not every one has it. */
    readonly plan?: Flag;
};

const dayFields: readonly FieldSpec<DayField>[] = [
    {
        key: "answerDeadline",
        label: "Date limite des réponses",
        rule: "Automatique : six semaines avant",
        error: "Entre aujourd'hui et la veille du mariage.",
    },
    {
        key: "reminder",
        label: "Relance automatique",
        plan: "reminders",
        rule: "Automatique : quinze jours avant la date limite",
        error: "Entre aujourd'hui et la date limite.",
    },
];

const openingFields: readonly FieldSpec<OpeningField>[] = [
    {
        key: "galleryOpens",
        label: "Ouverture de la galerie",
        plan: "gallery",
        rule: "Automatique : la veille, à 10 h",
        error: "Dans la semaine qui précède le mariage, ou le jour même, à une heure valide.",
    },
    {
        key: "tablesReveal",
        label: "Affichage des tables",
        plan: "seating",
        rule: "Automatique : le jour J, à 10 h",
        error: "Dans la semaine qui précède le mariage, ou le jour même, à une heure valide.",
    },
];

const dayMessages: Partial<Record<DraftIssue["code"], string>> = {
    "date-invalid": "Date invalide.",
    "date-past": "Choisissez une date à venir.",
};

const sameOpening = (a: Opening | null, b: Opening | null) =>
    a === b || (a !== null && b !== null && a.day === b.day && a.time === b.time);

/** The label, its formula, and « Auto » while it follows the wedding day. */
const FieldHead = ({
    htmlFor,
    spec,
    automatic,
}: {
    htmlFor: string;
    spec: FieldSpec<string>;
    automatic: boolean;
}) => (
    <span className="flex items-center justify-between gap-2">
        <span className="flex flex-wrap items-center gap-2">
            <label htmlFor={htmlFor} className="text-wed-ink-soft">
                {spec.label}
            </label>
            {spec.plan && <PlanBadge flag={spec.plan} />}
        </span>
        {automatic && (
            <span
                aria-hidden="true"
                className="bg-wed-line-soft text-wed-muted rounded-full px-2 py-0.5 text-[0.7rem]"
            >
                Auto
            </span>
        )}
    </span>
);

/** Back to the automatic date, or the rule that sets it. */
const FieldHelp = ({
    id,
    spec,
    set,
    onReset,
}: {
    id: string;
    spec: FieldSpec<string>;
    set: boolean;
    onReset: () => void;
}) =>
    set ? (
        <button
            id={id}
            type="button"
            onClick={onReset}
            className="text-wed-ink-soft hover:text-wed-ink inline-flex min-h-8 cursor-pointer items-center gap-1.5 justify-self-start text-xs underline-offset-4 hover:underline"
        >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            Revenir à l&apos;automatique
        </button>
    ) : (
        <span id={id} className="text-wed-muted text-xs">
            {spec.rule}
        </span>
    );

/**
 * The wedding day and the dates that follow from it, each one adjustable. The gallery and the
 * tables open at a day and an hour, where the wedding takes place.
 */
export const DatesSection = ({ day, dates, now, timezone, onSave }: DatesSectionProps) => {
    const [draft, setDraft] = useState({ day, overrides: dates });
    /** A reset or another tab changed the saved dates: start again from them. */
    const [base, setBase] = useState({ day, dates });
    if (base.day !== day || base.dates !== dates) {
        setBase({ day, dates });
        setDraft({ day, overrides: dates });
    }
    const [issues, setIssues] = useState<readonly DraftIssue[]>([]);
    const [saved, setSaved] = useState(false);
    const today = localDay(now, timezone);
    const automatic = automaticDates(draft.day);
    const dirty =
        draft.day !== day ||
        dayFields.some(({ key }) => draft.overrides[key] !== dates[key]) ||
        openingFields.some(({ key }) => !sameOpening(draft.overrides[key], dates[key]));
    const issueAt = (path: string) =>
        issues.find((issue) => issue.path === path || issue.path.startsWith(`${path}.`));

    const change = (overrides: Partial<DateOverrides>, nextDay = draft.day) => {
        setDraft({ day: nextDay, overrides: { ...draft.overrides, ...overrides } });
        setSaved(false);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = validateDates(draft, today, dates);
        if (!result.ok) return setIssues(result.error);
        setIssues([]);
        setDraft(result.value);
        onSave(result.value.day, result.value.overrides);
        setSaved(true);
    };

    const dayIssue = issueAt("day");
    const calendar = weddingCalendar(day, dates);

    return (
        <Card id="dates" title="Dates clés" titleId="dates-titre">
            <form
                noValidate
                onSubmit={submit}
                aria-label="Dates clés"
                className="grid gap-5 px-5 py-4"
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="grid content-start gap-1.5 text-sm">
                        <label htmlFor="dates-jour" className="text-wed-ink-soft">
                            Date du mariage
                        </label>
                        <input
                            id="dates-jour"
                            type="date"
                            min={today}
                            value={draft.day}
                            onChange={(event) => change({}, event.target.value)}
                            aria-invalid={Boolean(dayIssue)}
                            aria-describedby={
                                dayIssue ? "dates-jour-aide dates-jour-erreur" : "dates-jour-aide"
                            }
                            className={inputStyles}
                        />
                        <span id="dates-jour-aide" className="text-wed-muted text-xs">
                            Le programme suit : chaque horaire garde son heure.
                        </span>
                        <FieldError
                            id="dates-jour-erreur"
                            message={dayIssue && dayMessages[dayIssue.code]}
                        />
                    </div>
                    {dayFields.map((field) => {
                        const set = draft.overrides[field.key] !== null;
                        const issue = issueAt(field.key);
                        const id = `dates-${field.key}`;
                        return (
                            <div key={field.key} className="grid content-start gap-1.5 text-sm">
                                <FieldHead htmlFor={id} spec={field} automatic={!set} />
                                <input
                                    id={id}
                                    type="date"
                                    value={draft.overrides[field.key] ?? automatic[field.key]}
                                    onChange={(event) =>
                                        change({ [field.key]: event.target.value || null })
                                    }
                                    aria-invalid={Boolean(issue)}
                                    aria-describedby={
                                        issue ? `${id}-aide ${id}-erreur` : `${id}-aide`
                                    }
                                    className={inputStyles}
                                />
                                <FieldHelp
                                    id={`${id}-aide`}
                                    spec={field}
                                    set={set}
                                    onReset={() => change({ [field.key]: null })}
                                />
                                <FieldError id={`${id}-erreur`} message={issue && field.error} />
                            </div>
                        );
                    })}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {openingFields.map((field) => {
                        const set = draft.overrides[field.key] !== null;
                        const value = draft.overrides[field.key] ?? automatic[field.key];
                        const issue = issueAt(field.key);
                        const id = `dates-${field.key}`;
                        const described = issue ? `${id}-aide ${id}-erreur` : `${id}-aide`;
                        return (
                            <div key={field.key} className="grid content-start gap-1.5 text-sm">
                                <FieldHead htmlFor={id} spec={field} automatic={!set} />
                                <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2">
                                    <input
                                        id={id}
                                        type="date"
                                        value={value.day}
                                        onChange={(event) =>
                                            event.target.value &&
                                            change({
                                                [field.key]: { ...value, day: event.target.value },
                                            })
                                        }
                                        aria-invalid={Boolean(issue)}
                                        aria-describedby={described}
                                        className={inputStyles}
                                    />
                                    <input
                                        id={`${id}-heure`}
                                        type="time"
                                        step={900}
                                        value={value.time}
                                        aria-label={`${field.label}, heure`}
                                        onChange={(event) =>
                                            event.target.value &&
                                            change({
                                                [field.key]: { ...value, time: event.target.value },
                                            })
                                        }
                                        aria-invalid={Boolean(issue)}
                                        aria-describedby={described}
                                        className={cn(inputStyles, "tabular-nums")}
                                    />
                                </div>
                                <FieldHelp
                                    id={`${id}-aide`}
                                    spec={field}
                                    set={set}
                                    onReset={() => change({ [field.key]: null })}
                                />
                                <FieldError id={`${id}-erreur`} message={issue && field.error} />
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button type="submit" disabled={!dirty} className={buttonStyles.primary}>
                        Enregistrer les dates
                    </button>
                    <p role="status" className="text-wed-yes flex items-center gap-1.5 text-sm">
                        {saved && !dirty && (
                            <>
                                <Check aria-hidden="true" className="size-4" />
                                Enregistrées · {calendar.dateLabel}, réponses avant le{" "}
                                {calendar.answerDeadlineLabel}.
                            </>
                        )}
                    </p>
                </div>
            </form>
        </Card>
    );
};
