"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
    validateAnswer,
    type AnswerDraft,
    type AnswerIssue,
    type DietChoice,
    type Invitation,
    type Presence,
} from "@/lib/wedding/answer";
import { formatHour } from "@/lib/wedding/format-hour";
import type { GuestQuestion, Moment } from "@/lib/wedding/types";
import { SelectField } from "@/components/shared/select-field";

type AnswerFormProps = {
    householdName: string;
    invitation: Invitation;
    moments: readonly Moment[];
    /** The couple's own questions, answered once for the household. */
    questions: readonly GuestQuestion[];
    presenceLabels: Readonly<Record<string, { readonly yes: string; readonly no: string }>>;
    /** The saved answer when the household edits it, empty otherwise. */
    initialDraft: AnswerDraft;
    answered: boolean;
    onSubmit: (draft: AnswerDraft) => void;
    onEdit: () => void;
};

const dietOptions: readonly { value: DietChoice; label: string }[] = [
    { value: "aucune", label: "Aucune" },
    { value: "vegetarien", label: "Végétarien" },
    { value: "vegan", label: "Végan" },
    { value: "sans-gluten", label: "Sans gluten" },
    { value: "autre", label: "Autre (préciser)" },
];

const issueMessages: Record<AnswerIssue["code"], string> = {
    "attendance-required": "Indiquez si vous serez là.",
    "diet-detail-required": "Précisez la contrainte.",
    "consent-required": "Merci d'accepter que vos contraintes soient transmises au traiteur.",
    "too-long": "C'est un peu long : raccourcissez un peu.",
};

const noDiet = { choice: "aucune", other: "" } as const satisfies {
    choice: DietChoice;
    other: string;
};

const messageAt = (issues: readonly AnswerIssue[], path: string) =>
    issues.find((issue) => issue.path === path)?.code;

const dayAndHour = (moment: Moment) => {
    const start = moment.slots[0].startsAt;
    const day = new Date(start).toLocaleDateString("fr-FR", {
        weekday: "long",
        timeZone: "Europe/Paris",
    });
    return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${formatHour(start)}`;
};

const ErrorText = ({ id, code }: { id: string; code: AnswerIssue["code"] | undefined }) =>
    code ? (
        <p id={id} className="text-demo-no mt-1.5 text-sm">
            {issueMessages[code]}
        </p>
    ) : null;

export const AnswerForm = ({
    householdName,
    invitation,
    moments,
    questions,
    presenceLabels,
    initialDraft,
    answered,
    onSubmit,
    onEdit,
}: AnswerFormProps) => {
    const [draft, setDraft] = useState<AnswerDraft>(initialDraft);
    const [issues, setIssues] = useState<readonly AnswerIssue[]>([]);
    const invited = moments.filter((moment) => invitation.momentKeys.includes(moment.key));

    const setPresence = (guestId: string, momentKey: string, presence: Presence) =>
        setDraft((current) => ({
            ...current,
            attendance: {
                ...current.attendance,
                [guestId]: { ...current.attendance[guestId], [momentKey]: presence },
            },
        }));

    const setDiet = (guestId: string, change: Partial<{ choice: DietChoice; other: string }>) =>
        setDraft((current) => ({
            ...current,
            diets: {
                ...current.diets,
                [guestId]: { ...(current.diets[guestId] ?? noDiet), ...change },
            },
        }));

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = validateAnswer(invitation, draft);
        setIssues(result.ok ? [] : result.error);
        if (result.ok) onSubmit(result.value);
    };

    if (answered)
        return (
            <div role="status" className="py-8 text-center">
                <p className="font-demo-serif text-5xl italic">Merci !</p>
                <p className="text-demo-ink-2 mt-3 mb-5">
                    Votre réponse est enregistrée. Un récapitulatif part par email.
                </p>
                <button
                    type="button"
                    onClick={onEdit}
                    className="min-h-11 cursor-pointer underline underline-offset-4"
                >
                    Modifier ma réponse
                </button>
            </div>
        );

    return (
        <form aria-label="Votre réponse" noValidate onSubmit={submit}>
            <p className="font-demo-serif text-3xl leading-tight">{householdName}</p>
            <p className="text-demo-muted mb-7 text-[0.95rem]">
                Foyer de {invitation.guests.length} personnes · invités à {invited.length} moments
            </p>
            {issues.length > 0 && (
                <p
                    role="alert"
                    className="border-demo-no/40 text-demo-no mb-5 rounded-xl border p-3.5 text-sm"
                >
                    Il reste {issues.length} {issues.length > 1 ? "points" : "point"} à compléter
                    avant d&apos;envoyer.
                </p>
            )}
            {invitation.guests.map((guest) => {
                const labels = presenceLabels[guest.id];
                const diet = draft.diets[guest.id] ?? noDiet;
                const otherIssue = messageAt(issues, `diets.${guest.id}.other`);
                return (
                    <fieldset key={guest.id} className="border-demo-line border-t py-5.5">
                        <legend className="font-demo-serif float-left mb-3.5 w-full text-2xl">
                            {guest.firstName}
                        </legend>
                        {invited.map((moment) => {
                            const value = draft.attendance[guest.id]?.[moment.key];
                            const issue = messageAt(issues, `attendance.${guest.id}.${moment.key}`);
                            const errorId = `error-${guest.id}-${moment.key}`;
                            return (
                                <div
                                    key={moment.key}
                                    className="clear-both grid gap-2 py-2.5 md:grid-cols-[1fr_auto] md:items-center"
                                >
                                    <p>
                                        {moment.title}
                                        <span className="text-demo-muted block text-sm">
                                            {dayAndHour(moment)}
                                        </span>
                                    </p>
                                    <div
                                        role="group"
                                        aria-label={`${guest.firstName}, ${moment.title}`}
                                        aria-describedby={issue ? errorId : undefined}
                                        className={cn(
                                            "border-demo-line bg-demo-paper relative grid grid-cols-2 gap-1 rounded-full border p-1",
                                            issue && "border-demo-no",
                                        )}
                                    >
                                        {/* One pill under both answers: it slides to the one picked and takes its colour. */}
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                "absolute inset-y-1 left-1 w-[calc(50%-6px)] rounded-full transition-[translate,background-color,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                                                value === "no" && "translate-x-[calc(100%+4px)]",
                                                value === "yes" && "bg-demo-olive-dark",
                                                value === "no" && "bg-demo-no",
                                                value === undefined && "opacity-0",
                                            )}
                                        />
                                        {(["yes", "no"] as const).map((presence) => (
                                            <button
                                                key={presence}
                                                type="button"
                                                aria-pressed={value === presence}
                                                onClick={() =>
                                                    setPresence(guest.id, moment.key, presence)
                                                }
                                                className={cn(
                                                    "text-demo-ink-2 relative min-h-11 cursor-pointer rounded-full px-4.5 transition-colors duration-300 md:min-w-22",
                                                    value === presence
                                                        ? "text-white"
                                                        : "hover:bg-demo-card hover:text-demo-ink",
                                                )}
                                            >
                                                {labels[presence]}
                                            </button>
                                        ))}
                                    </div>
                                    <ErrorText id={errorId} code={issue} />
                                </div>
                            );
                        })}
                        <div className="mt-3.5 flex flex-col gap-1.5">
                            <label htmlFor={`diet-${guest.id}`} className="text-demo-ink-2 text-sm">
                                Contraintes alimentaires <small>(facultatif)</small>
                            </label>
                            <SelectField
                                id={`diet-${guest.id}`}
                                value={diet.choice}
                                onChange={(event) =>
                                    setDiet(guest.id, { choice: event.target.value as DietChoice })
                                }
                                className="bg-demo-paper border-demo-line min-h-12 rounded-xl border px-3.5"
                                chevronClassName="text-demo-muted"
                            >
                                {dietOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </SelectField>
                            {diet.choice === "autre" && (
                                <div className="border-demo-olive mt-2.5 flex flex-col gap-1.5 border-l-2 pl-3.5">
                                    <label
                                        htmlFor={`detail-${guest.id}`}
                                        className="text-demo-ink-2 text-sm"
                                    >
                                        Précisez pour {guest.firstName}
                                    </label>
                                    <input
                                        id={`detail-${guest.id}`}
                                        autoFocus
                                        value={diet.other}
                                        onChange={(event) =>
                                            setDiet(guest.id, { other: event.target.value })
                                        }
                                        placeholder="Ex. allergie aux arachides, sans lactose…"
                                        aria-invalid={Boolean(otherIssue)}
                                        aria-describedby={
                                            otherIssue ? `error-detail-${guest.id}` : undefined
                                        }
                                        className="bg-demo-paper border-demo-line min-h-12 rounded-xl border px-3.5"
                                    />
                                    <ErrorText id={`error-detail-${guest.id}`} code={otherIssue} />
                                </div>
                            )}
                        </div>
                    </fieldset>
                );
            })}
            <div className="border-demo-line grid gap-3.5 border-t py-5.5">
                {questions.map((question) => {
                    const issue = messageAt(issues, `questions.${question.id}`);
                    return (
                        <div key={question.id} className="flex flex-col gap-1.5">
                            <label
                                htmlFor={`question-${question.id}`}
                                className="text-demo-ink-2 text-sm"
                            >
                                {question.label}
                            </label>
                            <input
                                id={`question-${question.id}`}
                                value={draft.questions[question.id] ?? ""}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        questions: {
                                            ...current.questions,
                                            [question.id]: event.target.value,
                                        },
                                    }))
                                }
                                placeholder={question.placeholder}
                                aria-invalid={Boolean(issue)}
                                aria-describedby={
                                    issue ? `error-question-${question.id}` : undefined
                                }
                                className="bg-demo-paper border-demo-line min-h-12 rounded-xl border px-3.5"
                            />
                            <ErrorText id={`error-question-${question.id}`} code={issue} />
                        </div>
                    );
                })}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="note" className="text-demo-ink-2 text-sm">
                        Un mot pour nous
                    </label>
                    <textarea
                        id="note"
                        rows={3}
                        value={draft.message}
                        onChange={(event) =>
                            setDraft((current) => ({ ...current, message: event.target.value }))
                        }
                        aria-invalid={Boolean(messageAt(issues, "message"))}
                        aria-describedby={
                            messageAt(issues, "message") ? "error-message" : undefined
                        }
                        className="bg-demo-paper border-demo-line rounded-xl border px-3.5 py-3"
                    />
                    <ErrorText id="error-message" code={messageAt(issues, "message")} />
                </div>
                <label className="text-demo-muted flex cursor-pointer gap-2.5 py-1.5 text-sm">
                    <input
                        type="checkbox"
                        checked={draft.consent}
                        onChange={(event) =>
                            setDraft((current) => ({ ...current, consent: event.target.checked }))
                        }
                        aria-describedby={
                            messageAt(issues, "consent") ? "error-consent" : undefined
                        }
                        className="accent-demo-olive mt-0.5 size-5 shrink-0"
                    />
                    J&apos;accepte que mes contraintes alimentaires soient transmises au traiteur.
                    Elles sont supprimées un mois après le mariage.
                </label>
                <ErrorText id="error-consent" code={messageAt(issues, "consent")} />
            </div>
            <button
                type="submit"
                className="bg-demo-ink text-demo-card hover:bg-demo-ink-2 min-h-13.5 w-full cursor-pointer rounded-full font-medium transition-[background-color,scale] active:scale-[0.99]"
            >
                Envoyer notre réponse
            </button>
        </form>
    );
};
