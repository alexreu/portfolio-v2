import { describe, expect, it } from "vitest";

import { validateAnswer, type AnswerDraft, type Invitation } from "./answer";

const invitation: Invitation = {
    guests: [
        { id: "marie", firstName: "Marie" },
        { id: "thomas", firstName: "Thomas" },
    ],
    momentKeys: ["ceremonie", "diner"],
};

const complete: AnswerDraft = {
    attendance: {
        marie: { ceremonie: "yes", diner: "yes" },
        thomas: { ceremonie: "yes", diner: "no" },
    },
    diets: {},
    consent: false,
    questions: {},
    message: "",
};

const issues = (draft: AnswerDraft) => {
    const result = validateAnswer(invitation, draft);
    return result.ok ? [] : result.error;
};

describe("validateAnswer", () => {
    it("asks every guest to answer for each moment they are invited to", () => {
        const draft: AnswerDraft = {
            ...complete,
            attendance: { ...complete.attendance, thomas: { ceremonie: "yes" } },
        };

        expect(issues(draft)).toEqual([
            { path: "attendance.thomas.diner", code: "attendance-required" },
        ]);
    });

    it("needs a description when a dietary constraint is 'Autre'", () => {
        const draft: AnswerDraft = {
            ...complete,
            diets: { marie: { choice: "autre", other: "  " } },
            consent: true,
        };

        expect(issues(draft)).toEqual([
            { path: "diets.marie.other", code: "diet-detail-required" },
        ]);
    });

    it("requires consent as soon as a dietary constraint is shared, since it may be health data", () => {
        const draft: AnswerDraft = {
            ...complete,
            diets: { marie: { choice: "vegetarien", other: "" } },
            consent: false,
        };

        expect(issues(draft)).toEqual([{ path: "consent", code: "consent-required" }]);
    });

    it("accepts a complete answer without dietary constraints and without consent", () => {
        expect(
            validateAnswer(invitation, {
                ...complete,
                diets: { marie: { choice: "aucune", other: "" } },
            }).ok,
        ).toBe(true);
    });

    it("keeps the answers to the couple's questions and the note short enough to read", () => {
        const draft: AnswerDraft = {
            ...complete,
            questions: { chanson: "a".repeat(201) },
            message: "b".repeat(601),
        };

        expect(issues(draft)).toEqual([
            { path: "questions.chanson", code: "too-long" },
            { path: "message", code: "too-long" },
        ]);
    });

    it("ignores the diet of a guest no longer in the household", () => {
        const draft: AnswerDraft = {
            ...complete,
            diets: { paul: { choice: "autre", other: "" } },
        };

        expect(issues(draft)).toEqual([]);
    });
});
