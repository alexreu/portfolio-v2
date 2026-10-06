import { describe, expect, it } from "vitest";

import { automaticDates, validateDates } from "./dates";

const none = { answerDeadline: null, reminder: null, galleryOpens: null };

describe("automaticDates", () => {
    it("derives the deadline, the reminder and the gallery from the wedding day", () => {
        expect(automaticDates("2027-06-12")).toEqual({
            answerDeadline: "2027-05-01",
            reminder: "2027-04-16",
            galleryOpens: "2027-06-11",
        });
    });
});

describe("validateDates", () => {
    const today = "2026-10-06";

    it("accepts a wedding to come with its automatic dates", () => {
        expect(validateDates({ day: "2027-06-12", overrides: none }, today).ok).toBe(true);
    });

    it("refuses a wedding in the past", () => {
        const result = validateDates({ day: "2026-10-01", overrides: none }, today);
        expect(!result.ok && result.error).toEqual([{ path: "day", code: "date-past" }]);
    });

    it("keeps the deadline before the wedding and the reminder before the deadline", () => {
        const result = validateDates(
            {
                day: "2027-06-12",
                overrides: {
                    answerDeadline: "2027-06-20",
                    reminder: "2027-06-25",
                    galleryOpens: null,
                },
            },
            today,
        );
        expect(!result.ok && result.error).toEqual([
            { path: "answerDeadline", code: "out-of-range" },
            { path: "reminder", code: "out-of-range" },
        ]);
    });

    it("opens the gallery in the week before the wedding at the earliest, and on the day at the latest", () => {
        const early = validateDates(
            { day: "2027-06-12", overrides: { ...none, galleryOpens: "2027-06-01" } },
            today,
        );
        const late = validateDates(
            { day: "2027-06-12", overrides: { ...none, galleryOpens: "2027-06-13" } },
            today,
        );
        expect(!early.ok && early.error).toEqual([{ path: "galleryOpens", code: "out-of-range" }]);
        expect(!late.ok && late.error).toEqual([{ path: "galleryOpens", code: "out-of-range" }]);
    });

    it("drops a set date equal to the automatic one, so it follows the wedding day again", () => {
        const result = validateDates(
            { day: "2027-06-12", overrides: { ...none, answerDeadline: "2027-05-01" } },
            today,
        );
        expect(result.ok && result.value.overrides.answerDeadline).toBeNull();
    });
});
