"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DraftIssue } from "@/lib/wedding-dashboard/drafts";
import { questionIdFor, validateQuestions } from "@/lib/wedding-dashboard/seating";
import type { GuestQuestion } from "@/lib/wedding/types";

import {
    buttonStyles,
    Card,
    FieldError,
    iconButton,
    inputStyles,
    issueMessages,
} from "./dashboard-ui";

type QuestionsSectionProps = {
    questions: readonly GuestQuestion[];
    onSave: (questions: readonly GuestQuestion[]) => void;
};

const LIMIT = 6;

const same = (a: readonly GuestQuestion[], b: readonly GuestQuestion[]) =>
    JSON.stringify(a) === JSON.stringify(b);

/** The couple's own questions, answered once per household under the answer form. */
export const QuestionsSection = ({ questions, onSave }: QuestionsSectionProps) => {
    const [draft, setDraft] = useState<readonly GuestQuestion[]>(questions);
    /** A reset or another tab changed the saved questions: start again from them. */
    const [base, setBase] = useState(questions);
    if (questions !== base) {
        setBase(questions);
        setDraft(questions);
    }
    const [issues, setIssues] = useState<readonly DraftIssue[]>([]);
    const [saved, setSaved] = useState(false);
    const dirty = !same(draft, questions);

    const change = (next: readonly GuestQuestion[]) => {
        setDraft(next);
        setSaved(false);
    };

    const update = (index: number, patch: Partial<GuestQuestion>) =>
        change(draft.map((question, at) => (at === index ? { ...question, ...patch } : question)));

    const swap = (index: number, other: number) =>
        change(
            draft.map((question, at) => {
                if (at === index) return draft[other];
                if (at === other) return draft[index];
                return question;
            }),
        );

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = validateQuestions(draft);
        if (!result.ok) return setIssues(result.error);
        setIssues([]);
        onSave(result.value);
        setDraft(result.value);
        setSaved(true);
    };

    return (
        <Card
            id="questions"
            title="Questions du faire-part"
            titleId="questions-titre"
            plan="questions"
        >
            <form
                noValidate
                onSubmit={submit}
                aria-label="Questions du faire-part"
                className="grid gap-4 px-5 py-4"
            >
                <p className="text-wed-muted text-sm">
                    Posées une fois par foyer, sous la réponse de présence. Les réponses arrivent
                    dans le détail de chaque foyer.
                </p>
                <ol className="grid gap-3">
                    {draft.map((question, index) => {
                        const issue = issues.find(
                            (candidate) => candidate.path === `questions.${index}.label`,
                        );
                        return (
                            <li
                                key={question.id}
                                className="border-wed-line-soft bg-wed-ivory/60 grid gap-2.5 rounded-2xl border p-3.5 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
                            >
                                <label className="grid content-start gap-1 text-sm">
                                    <span className="text-wed-muted">Question {index + 1}</span>
                                    <input
                                        value={question.label}
                                        onChange={(event) =>
                                            update(index, { label: event.target.value })
                                        }
                                        placeholder="Une chanson qui vous fera danser"
                                        aria-invalid={Boolean(issue)}
                                        aria-describedby={
                                            issue ? `question-${index}-erreur` : undefined
                                        }
                                        className={inputStyles}
                                    />
                                    <FieldError
                                        id={`question-${index}-erreur`}
                                        message={issue && issueMessages[issue.code]}
                                    />
                                </label>
                                <label className="grid content-start gap-1 text-sm">
                                    <span className="text-wed-muted">Exemple de réponse</span>
                                    <input
                                        value={question.placeholder ?? ""}
                                        onChange={(event) =>
                                            update(index, { placeholder: event.target.value })
                                        }
                                        placeholder="Artiste — titre"
                                        className={inputStyles}
                                    />
                                </label>
                                <div className="flex gap-1 sm:pt-5">
                                    <button
                                        type="button"
                                        disabled={index === 0}
                                        onClick={() => swap(index, index - 1)}
                                        aria-label={`Monter la question ${index + 1}`}
                                        className={cn(iconButton, "disabled:opacity-30")}
                                    >
                                        <ArrowUp aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={index === draft.length - 1}
                                        onClick={() => swap(index, index + 1)}
                                        aria-label={`Descendre la question ${index + 1}`}
                                        className={cn(iconButton, "disabled:opacity-30")}
                                    >
                                        <ArrowDown aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            change(draft.filter((_, at) => at !== index))
                                        }
                                        aria-label={`Retirer la question ${index + 1}`}
                                        className={iconButton}
                                    >
                                        <Trash2 aria-hidden="true" />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                    {draft.length === 0 && (
                        <li className="text-wed-muted py-4 text-center text-sm">
                            Pas de question : le formulaire s&apos;arrête au mot pour vous.
                        </li>
                    )}
                </ol>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        disabled={draft.length >= LIMIT}
                        onClick={() =>
                            change([
                                ...draft,
                                {
                                    id: questionIdFor(
                                        "question",
                                        draft.map((question) => question.id),
                                    ),
                                    label: "",
                                    placeholder: "",
                                },
                            ])
                        }
                        className={buttonStyles.secondary}
                    >
                        <Plus aria-hidden="true" />
                        Ajouter une question
                    </button>
                    <button type="submit" disabled={!dirty} className={buttonStyles.primary}>
                        Enregistrer les questions
                    </button>
                    <p role="status" className="text-wed-yes flex items-center gap-1.5 text-sm">
                        {saved && !dirty && (
                            <>
                                <Check aria-hidden="true" className="size-4" />
                                Enregistrées, le formulaire des invités est à jour.
                            </>
                        )}
                    </p>
                </div>
            </form>
        </Card>
    );
};
