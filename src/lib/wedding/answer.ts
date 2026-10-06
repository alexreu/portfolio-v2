import { failure, success, type Result } from "./result";

export type Presence = "yes" | "no";

export type DietChoice = "aucune" | "vegetarien" | "vegan" | "sans-gluten" | "autre";

export type Invitation = {
    readonly guests: readonly { readonly id: string; readonly firstName: string }[];
    /** The moments this household is invited to. */
    readonly momentKeys: readonly string[];
};

export type AnswerDraft = {
    readonly attendance: Readonly<Record<string, Readonly<Record<string, Presence | undefined>>>>;
    readonly diets: Readonly<
        Record<string, { readonly choice: DietChoice; readonly other: string }>
    >;
    readonly consent: boolean;
    /** Answers to the couple's own questions, by question id ("chanson"). */
    readonly questions: Readonly<Record<string, string>>;
    /** "Un mot pour nous". */
    readonly message: string;
};

export type AnswerIssue = {
    readonly path: string;
    readonly code: "attendance-required" | "diet-detail-required" | "consent-required" | "too-long";
};

const QUESTION_MAX = 200;
const MESSAGE_MAX = 600;

const missingAttendance = (invitation: Invitation, draft: AnswerDraft): readonly AnswerIssue[] =>
    invitation.guests.flatMap((guest) =>
        invitation.momentKeys
            .filter((key) => !draft.attendance[guest.id]?.[key])
            .map((key) => ({
                path: `attendance.${guest.id}.${key}`,
                code: "attendance-required" as const,
            })),
    );

const missingDietDetails = (draft: AnswerDraft): readonly AnswerIssue[] =>
    Object.entries(draft.diets)
        .filter(([, diet]) => diet.choice === "autre" && diet.other.trim() === "")
        .map(([guestId]) => ({
            path: `diets.${guestId}.other`,
            code: "diet-detail-required" as const,
        }));

const sharesDietaryConstraint = (draft: AnswerDraft) =>
    Object.values(draft.diets).some((diet) => diet.choice !== "aucune");

/** Dietary constraints may reveal health data (GDPR art. 9): explicit consent. */
const missingConsent = (draft: AnswerDraft): readonly AnswerIssue[] =>
    sharesDietaryConstraint(draft) && !draft.consent
        ? [{ path: "consent", code: "consent-required" }]
        : [];

const tooLong = (draft: AnswerDraft): readonly AnswerIssue[] => [
    ...Object.entries(draft.questions)
        .filter(([, answer]) => answer.trim().length > QUESTION_MAX)
        .map(([id]) => ({ path: `questions.${id}`, code: "too-long" as const })),
    ...(draft.message.trim().length > MESSAGE_MAX
        ? [{ path: "message", code: "too-long" as const }]
        : []),
];

export const validateAnswer = (
    invitation: Invitation,
    draft: AnswerDraft,
): Result<AnswerDraft, readonly AnswerIssue[]> => {
    const issues = [
        ...missingAttendance(invitation, draft),
        ...missingDietDetails(draft),
        ...missingConsent(draft),
        ...tooLong(draft),
    ];
    return issues.length === 0 ? success(draft) : failure(issues);
};
