"use client";

import { useState } from "react";
import {
    answerDraftOf,
    validateAnswer,
    type AnswerDraft,
    type AnswerIssue,
    type DietChoice,
    type GuestQuestion,
    type HouseholdRecord,
    type Moment,
    type Presence,
} from "@alexreu/wedding-core";

import { cn } from "@/lib/utils";

import { buttonStyles, FieldError, inputStyles, Select } from "./dashboard-ui";

type PaperAnswerFormProps = {
    household: HouseholdRecord;
    /** The moments this household is invited to. */
    moments: readonly Moment[];
    questions: readonly GuestQuestion[];
    onSubmit: (draft: AnswerDraft) => void;
    onCancel: () => void;
};

const dietOptions: readonly { value: DietChoice; label: string }[] = [
    { value: "none", label: "Aucune" },
    { value: "vegetarian", label: "Végétarien" },
    { value: "vegan", label: "Végan" },
    { value: "gluten-free", label: "Sans gluten" },
    { value: "other", label: "Autre (préciser)" },
];

const messages: Record<AnswerIssue["code"], string> = {
    "attendance-required": "Oui ou non ?",
    "diet-detail-required": "Précisez la contrainte.",
    "consent-required": "Cochez si le foyer est d'accord.",
    "too-long": "Un peu long : raccourcissez.",
};

const noDiet = { choice: "none" as const, other: "" };

const issueAt = (issues: readonly AnswerIssue[], path: string) =>
    issues.find((issue) => issue.path === path);

const choice =
    "border-wed-line text-wed-ink-soft has-checked:border-wed-ink has-checked:bg-wed-ink has-checked:text-wed-paper has-focus-visible:outline-primary relative inline-flex min-h-10 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2";

/**
 * A household's answer typed in by the couple: a reply card received by post, a phone call.
 * Same rules as on the site, and credited to the couple in the history.
 */
export const PaperAnswerForm = ({
    household,
    moments,
    questions,
    onSubmit,
    onCancel,
}: PaperAnswerFormProps) => {
    const [draft, setDraft] = useState<AnswerDraft>(() => answerDraftOf(household));
    const [issues, setIssues] = useState<readonly AnswerIssue[]>([]);
    const sharesDiet = Object.values(draft.diets).some((diet) => diet.choice !== "none");

    const setPresence = (guestId: string, key: string, presence: Presence) =>
        setDraft((current) => ({
            ...current,
            attendance: {
                ...current.attendance,
                [guestId]: { ...current.attendance[guestId], [key]: presence },
            },
        }));

    const setDiet = (guestId: string, change: Partial<AnswerDraft["diets"][string]>) =>
        setDraft((current) => ({
            ...current,
            diets: {
                ...current.diets,
                [guestId]: { ...(current.diets[guestId] ?? noDiet), ...change },
            },
        }));

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = validateAnswer(
            { guests: household.guests, momentKeys: household.momentKeys },
            draft,
        );
        if (!result.ok) return setIssues(result.error);
        onSubmit(result.value);
    };

    return (
        <form
            noValidate
            onSubmit={submit}
            aria-label={`Réponse de ${household.name}`}
            className="grid gap-6"
        >
            {issues.length > 0 && (
                <p
                    role="alert"
                    className="border-wed-no/40 text-wed-no rounded-xl border p-3 text-sm"
                >
                    Il reste {issues.length} {issues.length > 1 ? "points" : "point"} à compléter.
                </p>
            )}
            <ul className="divide-wed-line-soft border-wed-line-soft divide-y rounded-2xl border">
                {household.guests.map((guest) => {
                    const diet = draft.diets[guest.id] ?? noDiet;
                    const otherIssue = issueAt(issues, `diets.${guest.id}.other`);
                    return (
                        <li key={guest.id} className="grid gap-3 px-4 py-4">
                            <p className="font-medium">
                                {guest.firstName}
                                {guest.child && (
                                    <span className="text-wed-muted font-normal"> · enfant</span>
                                )}
                            </p>
                            {moments.map((moment) => {
                                const issue = issueAt(
                                    issues,
                                    `attendance.${guest.id}.${moment.key}`,
                                );
                                const errorId = `papier-${guest.id}-${moment.key}-erreur`;
                                return (
                                    <fieldset
                                        key={moment.key}
                                        aria-describedby={issue ? errorId : undefined}
                                        className="grid gap-1.5"
                                    >
                                        <legend className="sr-only">
                                            {guest.firstName}, {moment.title}
                                        </legend>
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span
                                                aria-hidden="true"
                                                className="text-wed-ink-soft text-sm"
                                            >
                                                {moment.title}
                                            </span>
                                            <span className="flex gap-1.5">
                                                {(["yes", "no"] as const).map((presence) => (
                                                    <label key={presence} className={choice}>
                                                        <input
                                                            type="radio"
                                                            name={`papier-${guest.id}-${moment.key}`}
                                                            checked={
                                                                draft.attendance[guest.id]?.[
                                                                    moment.key
                                                                ] === presence
                                                            }
                                                            onChange={() =>
                                                                setPresence(
                                                                    guest.id,
                                                                    moment.key,
                                                                    presence,
                                                                )
                                                            }
                                                            className="sr-only"
                                                        />
                                                        {presence === "yes"
                                                            ? (guest.labels?.yes ?? "Oui")
                                                            : (guest.labels?.no ?? "Non")}
                                                    </label>
                                                ))}
                                            </span>
                                        </div>
                                        <FieldError
                                            id={errorId}
                                            message={issue && messages[issue.code]}
                                        />
                                    </fieldset>
                                );
                            })}
                            <div className="grid gap-1.5 text-sm">
                                <label
                                    htmlFor={`papier-regime-${guest.id}`}
                                    className="text-wed-ink-soft"
                                >
                                    Contrainte alimentaire
                                </label>
                                <Select
                                    id={`papier-regime-${guest.id}`}
                                    value={diet.choice}
                                    onChange={(event) =>
                                        setDiet(guest.id, {
                                            choice: event.target.value as DietChoice,
                                        })
                                    }
                                >
                                    {dietOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                                {diet.choice === "other" && (
                                    <>
                                        <input
                                            value={diet.other}
                                            onChange={(event) =>
                                                setDiet(guest.id, { other: event.target.value })
                                            }
                                            aria-label={`Contrainte de ${guest.firstName}, à préciser`}
                                            aria-invalid={Boolean(otherIssue)}
                                            aria-describedby={
                                                otherIssue
                                                    ? `papier-autre-${guest.id}-erreur`
                                                    : undefined
                                            }
                                            placeholder="Allergie aux arachides…"
                                            className={inputStyles}
                                        />
                                        <FieldError
                                            id={`papier-autre-${guest.id}-erreur`}
                                            message={otherIssue && messages[otherIssue.code]}
                                        />
                                    </>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {sharesDiet && (
                <div className="grid gap-1">
                    <label className="flex cursor-pointer items-start gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={draft.consent}
                            onChange={(event) =>
                                setDraft({ ...draft, consent: event.target.checked })
                            }
                            aria-invalid={Boolean(issueAt(issues, "consent"))}
                            aria-describedby={
                                issueAt(issues, "consent") ? "papier-accord-erreur" : undefined
                            }
                            className="accent-wed-ink mt-0.5 size-4.5 shrink-0"
                        />
                        Le foyer accepte que ses contraintes alimentaires soient transmises au
                        traiteur.
                    </label>
                    <FieldError
                        id="papier-accord-erreur"
                        message={issueAt(issues, "consent") && messages["consent-required"]}
                    />
                </div>
            )}

            {questions.map((question) => (
                <label key={question.id} className="grid gap-1.5 text-sm">
                    <span className="text-wed-ink-soft">{question.label}</span>
                    <input
                        value={draft.questions[question.id] ?? ""}
                        onChange={(event) =>
                            setDraft({
                                ...draft,
                                questions: {
                                    ...draft.questions,
                                    [question.id]: event.target.value,
                                },
                            })
                        }
                        className={inputStyles}
                    />
                </label>
            ))}

            <label className="grid gap-1.5 text-sm">
                <span className="text-wed-ink-soft">Leur mot pour vous</span>
                <textarea
                    rows={3}
                    value={draft.message}
                    onChange={(event) => setDraft({ ...draft, message: event.target.value })}
                    className={cn(inputStyles, "py-3")}
                />
            </label>

            <div className="flex flex-wrap gap-2">
                <button type="submit" className={cn(buttonStyles.primary, "min-h-12 flex-1")}>
                    Enregistrer leur réponse
                </button>
                <button type="button" onClick={onCancel} className={buttonStyles.quiet}>
                    Annuler
                </button>
            </div>
        </form>
    );
};
