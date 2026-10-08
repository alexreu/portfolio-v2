import { describe, expect, it } from "vitest";

import {
    createHousehold,
    draftOf,
    editHousehold,
    freshHouseholdId,
    householdIdFor,
    personalize,
    sealInitials,
    thanksOf,
    validateDesign,
    validateHouseholdDraft,
    type HouseholdDraft,
} from "./drafts";
import type { HouseholdRecord, InvitationDesign } from "./types";

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
    it("keeps the day-after message short enough to read on a phone", () => {
        const result = validateDesign({ ...design, thanks: "Merci ".repeat(80) }, "2026-10-06");

        expect(!result.ok && result.error).toEqual([{ path: "thanks", code: "too-long" }]);
    });

    it("falls back on a default thank-you when the couple wrote none", () => {
        expect(thanksOf({ ...design, thanks: "  " })).toMatch(/^Merci/);
        expect(thanksOf({ ...design, thanks: " À très vite ! " })).toBe("À très vite !");
    });

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

describe("draftOf and editHousehold", () => {
    const moreau: HouseholdRecord = {
        id: "moreau",
        name: "Famille Moreau",
        group: "famille-2",
        email: "claire@exemple.fr",
        guests: [
            {
                id: "claire",
                firstName: "Claire",
                child: false,
                labels: { yes: "Présente", no: "Absente" },
            },
            { id: "antoine", firstName: "Antoine", child: false },
            { id: "leo", firstName: "Léo", child: true },
        ],
        momentKeys: ["ceremonie", "diner"],
        lastSeenAt: "2026-10-01T10:00:00+02:00",
        attendance: {
            claire: { ceremonie: "yes", diner: "yes" },
            antoine: { ceremonie: "no", diner: "no" },
            leo: { ceremonie: "yes", diner: "yes" },
        },
        diets: {
            claire: { choice: "vegetarien", other: "" },
            leo: { choice: "sans-gluten", other: "" },
        },
        answeredAt: "2026-10-01T10:00:00+02:00",
        answeredBy: "invite",
        createdAt: "2026-09-01T10:00:00+02:00",
        questions: { chanson: "Respire" },
        message: "Hâte !",
    };

    it("fills the form with the household as it stands, each guest with their id", () => {
        expect(draftOf(moreau)).toEqual({
            name: "Famille Moreau",
            group: "famille-2",
            email: "claire@exemple.fr",
            guests: [
                { id: "claire", firstName: "Claire", child: false },
                { id: "antoine", firstName: "Antoine", child: false },
                { id: "leo", firstName: "Léo", child: true },
            ],
            momentKeys: ["ceremonie", "diner"],
        });
    });

    it("renames the household and its guests, keeping their answers and the link", () => {
        const draft = draftOf(moreau);
        const edited = editHousehold(moreau, {
            ...draft,
            name: "Famille Moreau-Petit",
            guests: draft.guests.map((guest) =>
                guest.id === "claire" ? { ...guest, firstName: "Clara" } : guest,
            ),
        });

        expect(edited.id).toBe("moreau");
        expect(edited.name).toBe("Famille Moreau-Petit");
        expect(edited.guests[0]).toEqual({
            id: "claire",
            firstName: "Clara",
            child: false,
            labels: { yes: "Présente", no: "Absente" },
        });
        expect(edited.attendance.claire).toEqual({ ceremonie: "yes", diner: "yes" });
        expect(edited.diets.claire).toEqual({ choice: "vegetarien", other: "" });
        expect(edited.answeredAt).toBe(moreau.answeredAt);
        expect(edited.lastSeenAt).toBe(moreau.lastSeenAt);
    });

    it("forgets a removed guest, and a removed moment's answers", () => {
        const draft = draftOf(moreau);
        const edited = editHousehold(moreau, {
            ...draft,
            guests: draft.guests.filter((guest) => guest.id !== "leo"),
            momentKeys: ["ceremonie"],
        });

        expect(edited.guests.map((guest) => guest.id)).toEqual(["claire", "antoine"]);
        expect(edited.attendance).toEqual({
            claire: { ceremonie: "yes" },
            antoine: { ceremonie: "no" },
        });
        expect(edited.diets).toEqual({ claire: { choice: "vegetarien", other: "" } });
    });

    it("gives a new guest an id of their own, never one already taken", () => {
        const draft = draftOf(moreau);
        const once = editHousehold(moreau, {
            ...draft,
            guests: [...draft.guests, { firstName: "Jade", child: true }],
        });
        const twice = editHousehold(once, {
            ...draftOf(once),
            guests: [...draftOf(once).guests, { firstName: "Noé", child: true }],
        });

        const ids = twice.guests.map((guest) => guest.id);
        expect(ids).toHaveLength(5);
        expect(new Set(ids).size).toBe(5);
        expect(ids.slice(0, 3)).toEqual(["claire", "antoine", "leo"]);
    });
});

describe("household ids", () => {
    it("still makes an id from a name without a Latin letter", () => {
        expect(householdIdFor("李 & 王", "ab12")).toBe("foyer-ab12");
    });

    it("draws another suffix while the id is taken", () => {
        const suffixes = ["ab12", "ab12", "cd34"];
        const id = freshHouseholdId(
            "Famille Martin",
            new Set(["famille-martin-ab12"]),
            () => suffixes.shift() ?? "zz99",
        );

        expect(id).toBe("famille-martin-cd34");
    });
});
