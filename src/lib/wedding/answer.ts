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

/** Only the household's current guests: a guest taken out meanwhile leaves nothing to fill. */
const currentDiets = (invitation: Invitation, draft: AnswerDraft) =>
    Object.entries(draft.diets).filter(([guestId]) =>
        invitation.guests.some((guest) => guest.id === guestId),
    );

const missingDietDetails = (invitation: Invitation, draft: AnswerDraft): readonly AnswerIssue[] =>
    currentDiets(invitation, draft)
        .filter(([, diet]) => diet.choice === "autre" && diet.other.trim() === "")
        .map(([guestId]) => ({
            path: `diets.${guestId}.other`,
            code: "diet-detail-required" as const,
        }));

const sharesDietaryConstraint = (invitation: Invitation, draft: AnswerDraft) =>
    currentDiets(invitation, draft).some(([, diet]) => diet.choice !== "aucune");

/** Dietary constraints may reveal health data (GDPR art. 9): explicit consent. */
const missingConsent = (invitation: Invitation, draft: AnswerDraft): readonly AnswerIssue[] =>
    sharesDietaryConstraint(invitation, draft) && !draft.consent
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
        ...missingDietDetails(invitation, draft),
        ...missingConsent(invitation, draft),
        ...tooLong(draft),
    ];
    return issues.length === 0 ? success(draft) : failure(issues);
};
