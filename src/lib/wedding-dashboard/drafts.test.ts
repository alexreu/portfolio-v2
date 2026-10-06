import { describe, expect, it } from "vitest";

import {
    createHousehold,
    householdIdFor,
    personalize,
    sealInitials,
    validateDesign,
    validateHouseholdDraft,
    type HouseholdDraft,
} from "./drafts";
import type { InvitationDesign } from "./types";

const draft: HouseholdDraft = {
    name: "  Famille Martin ",
    group: "famille-1",
    email: "",
    guests: [
        { firstName: " Paul ", child: false },
        { firstName: "Zoé", child: true },
    ],
    momentKeys: ["ceremonie", "diner"],
};

describe("validateHouseholdDraft", () => {
    it("accepts a household with a name, its guests and at least one moment, trimmed", () => {
        const result = validateHouseholdDraft(draft);

        expect(result.ok && result.value.name).toBe("Famille Martin");
        expect(result.ok && result.value.guests[0].firstName).toBe("Paul");
    });

    it("points at every missing piece at once", () => {
        const result = validateHouseholdDraft({
            ...draft,
            name: " ",
            guests: [{ firstName: "", child: false }],
            momentKeys: [],
            email: "paul@",
        });

        expect(!result.ok && result.error).toEqual([
            { path: "name", code: "required" },
            { path: "guests.0.firstName", code: "required" },
            { path: "momentKeys", code: "moment-required" },
            { path: "email", code: "email-invalid" },
        ]);
    });

    it("refuses an empty household", () => {
        const result = validateHouseholdDraft({ ...draft, guests: [] });
        expect(!result.ok && result.error).toEqual([{ path: "guests", code: "guest-required" }]);
    });
});

describe("createHousehold", () => {
    it("creates a household that has not opened its link yet", () => {
        const result = validateHouseholdDraft(draft);
        if (!result.ok) throw new Error("draft should be valid");

        expect(
            createHousehold(result.value, { id: "martin-x7", at: "2026-10-06T10:00:00+02:00" }),
        ).toEqual({
            id: "martin-x7",
            name: "Famille Martin",
            group: "famille-1",
            email: "",
            guests: [
                { id: "martin-x7-1", firstName: "Paul", child: false },
                { id: "martin-x7-2", firstName: "Zoé", child: true },
            ],
            momentKeys: ["ceremonie", "diner"],
            lastSeenAt: null,
            attendance: {},
            diets: {},
            answeredAt: null,
            answeredBy: null,
            createdAt: "2026-10-06T10:00:00+02:00",
            questions: {},
            message: "",
        });
    });
});

describe("householdIdFor", () => {
    it("builds a readable id from the name, without accents or spaces", () => {
        expect(householdIdFor("Famille Hélène & Zoé", "x7")).toBe("famille-helene-zoe-x7");
    });
});

const design: InvitationDesign = {
    first: "Camille",
    second: "Hugo",
    date: "2027-06-12",
    place: "Luberon",
    welcome: "Chers {invités}, nous nous marions.",
    tone: "olive",
};

describe("validateDesign", () => {
    it("accepts a faire-part dated today or later", () => {
        expect(validateDesign(design, "2026-10-06").ok).toBe(true);
        expect(validateDesign({ ...design, date: "2026-10-06" }, "2026-10-06").ok).toBe(true);
    });

    it("requires both first names, a place and a real date to come", () => {
        const result = validateDesign(
            { ...design, first: " ", place: "", date: "2026-02-30" },
            "2026-10-06",
        );
        expect(!result.ok && result.error).toEqual([
            { path: "first", code: "required" },
            { path: "date", code: "date-invalid" },
            { path: "place", code: "required" },
        ]);
        const past = validateDesign({ ...design, date: "2026-10-05" }, "2026-10-06");
        expect(!past.ok && past.error).toEqual([{ path: "date", code: "date-past" }]);
    });

    it("keeps the greeting short enough for a phone screen", () => {
        const result = validateDesign({ ...design, welcome: "a".repeat(221) }, "2026-10-06");
        expect(!result.ok && result.error).toEqual([{ path: "welcome", code: "too-long" }]);
    });
});

describe("personalize", () => {
    it("addresses the greeting to the household", () => {
        expect(personalize(design.welcome, "Marie & Thomas")).toBe(
            "Chers Marie & Thomas, nous nous marions.",
        );
    });
});

describe("sealInitials", () => {
    it("engraves the couple's initials on the seal", () => {
        expect(sealInitials(" élise", "hugo")).toBe("É·H");
    });
});
