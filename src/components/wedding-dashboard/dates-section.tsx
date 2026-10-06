"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";

import { parisDay, weddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { automaticDates, validateDates } from "@/lib/wedding-dashboard/dates";
import type { DraftIssue } from "@/lib/wedding-dashboard/drafts";
import type { DateOverrides } from "@/lib/wedding-dashboard/types";

import { buttonStyles, Card, FieldError, inputStyles } from "./dashboard-ui";

type DatesSectionProps = {
    day: string;
    dates: DateOverrides;
    now: Date;
    onSave: (day: string, dates: DateOverrides) => void;
};

type Field = keyof DateOverrides;

const fields: readonly { key: Field; label: string; rule: string; error: string }[] = [
    {
        key: "answerDeadline",
        label: "Date limite des réponses",
        rule: "Automatique : six semaines avant",
        error: "Entre aujourd'hui et la veille du mariage.",
    },
    {
        key: "reminder",
        label: "Relance automatique",
        rule: "Automatique : quinze jours avant la date limite",
        error: "Entre aujourd'hui et la date limite.",
    },
    {
        key: "galleryOpens",
        label: "Ouverture de la galerie",
        rule: "Automatique : la veille",
        error: "Dans la semaine qui précède le mariage, ou le jour même.",
    },
];

const dayMessages: Partial<Record<DraftIssue["code"], string>> = {
    "date-invalid": "Date invalide.",
    "date-past": "Choisissez une date à venir.",
};

/** The wedding day and the dates that follow from it, each one adjustable. */
export const DatesSection = ({ day, dates, now, onSave }: DatesSectionProps) => {
    const [draft, setDraft] = useState({ day, overrides: dates });
    /** A reset or another tab changed the saved dates: start again from them. */
    const [base, setBase] = useState({ day, dates });
    if (base.day !== day || base.dates !== dates) {
        setBase({ day, dates });
        setDraft({ day, overrides: dates });
    }
    const [issues, setIssues] = useState<readonly DraftIssue[]>([]);
    const [saved, setSaved] = useState(false);
    const today = parisDay(now);
    const automatic = automaticDates(draft.day);
    const dirty =
        draft.day !== day ||
        (Object.keys(dates) as Field[]).some((key) => draft.overrides[key] !== dates[key]);
    const issueAt = (path: string) => issues.find((issue) => issue.path === path);

    const change = (next: typeof draft) => {
        setDraft(next);
        setSaved(false);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = validateDates(draft, today);
        if (!result.ok) return setIssues(result.error);
        setIssues([]);
        setDraft(result.value);
        onSave(result.value.day, result.value.overrides);
        setSaved(true);
    };

    const dayIssue = issueAt("day");

    return (
        <Card id="dates" title="Dates clés" titleId="dates-titre">
            <form
                noValidate
                onSubmit={submit}
                aria-label="Dates clés"
                className="grid gap-5 px-5 py-4"
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="grid content-start gap-1.5 text-sm">
                        <label htmlFor="dates-jour" className="text-wed-ink-soft">
                            Date du mariage
                        </label>
                        <input
                            id="dates-jour"
                            type="date"
                            min={today}
                            value={draft.day}
                            onChange={(event) => change({ ...draft, day: event.target.value })}
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
                    {fields.map((field) => {
                        const set = draft.overrides[field.key] !== null;
                        const issue = issueAt(field.key);
                        return (
                            <div key={field.key} className="grid content-start gap-1.5 text-sm">
                                <span className="flex items-center justify-between gap-2">
                                    <label
                                        htmlFor={`dates-${field.key}`}
                                        className="text-wed-ink-soft"
                                    >
                                        {field.label}
                                    </label>
                                    {!set && (
                                        <span
                                            aria-hidden="true"
                                            className="bg-wed-line-soft text-wed-muted rounded-full px-2 py-0.5 text-[0.7rem]"
                                        >
                                            Auto
                                        </span>
                                    )}
                                </span>
                                <input
                                    id={`dates-${field.key}`}
                                    type="date"
                                    value={draft.overrides[field.key] ?? automatic[field.key]}
                                    onChange={(event) =>
                                        change({
                                            ...draft,
                                            overrides: {
                                                ...draft.overrides,
                                                [field.key]: event.target.value || null,
                                            },
                                        })
                                    }
                                    aria-invalid={Boolean(issue)}
                                    aria-describedby={
                                        issue
                                            ? `dates-${field.key}-aide dates-${field.key}-erreur`
                                            : `dates-${field.key}-aide`
                                    }
                                    className={inputStyles}
                                />
                                {set ? (
                                    <button
                                        id={`dates-${field.key}-aide`}
                                        type="button"
                                        onClick={() =>
                                            change({
                                                ...draft,
                                                overrides: {
                                                    ...draft.overrides,
                                                    [field.key]: null,
                                                },
                                            })
                                        }
                                        className="text-wed-ink-soft hover:text-wed-ink inline-flex min-h-8 cursor-pointer items-center gap-1.5 justify-self-start text-xs underline-offset-4 hover:underline"
                                    >
                                        <RotateCcw aria-hidden="true" className="size-3.5" />
                                        Revenir à l&apos;automatique
                                    </button>
                                ) : (
                                    <span
                                        id={`dates-${field.key}-aide`}
                                        className="text-wed-muted text-xs"
                                    >
                                        {field.rule}
                                    </span>
                                )}
                                <FieldError
                                    id={`dates-${field.key}-erreur`}
                                    message={issue && field.error}
                                />
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
                                Enregistrées · {weddingCalendar(day, dates).dateLabel}, réponses
                                avant le {weddingCalendar(day, dates).answerDeadlineLabel}.
                            </>
                        )}
                    </p>
                </div>
            </form>
        </Card>
    );
};
