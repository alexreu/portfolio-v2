import { describe, expect, it } from "vitest";

import {
    householdTables,
    nextTableNumber,
    questionIdFor,
    seatingPlan,
    tablesRemoval,
    validateQuestions,
    validateTable,
} from "./seating";
import type { HouseholdRecord, SeatTable } from "./types";

const base = {
    group: "amis",
    email: "",
    diets: {},
    answeredBy: "invite",
    lastSeenAt: null,
    createdAt: "2026-09-01T10:00:00+02:00",
    answeredAt: "2026-10-01T10:00:00+02:00",
    questions: {},
    message: "",
    momentKeys: ["diner"],
} as const;

const moreau: HouseholdRecord = {
    ...base,
    id: "moreau",
    name: "Famille Moreau",
    guests: [
        { id: "claire", firstName: "Claire", child: false },
        { id: "leo", firstName: "Léo", child: true },
    ],
    attendance: { claire: { diner: "yes" }, leo: { diner: "yes" } },
};

const bertrand: HouseholdRecord = {
    ...base,
    id: "bertrand",
    name: "Julien Bertrand",
    guests: [{ id: "julien", firstName: "Julien", child: false }],
    attendance: { julien: { diner: "no" } },
};

const garcia: HouseholdRecord = {
    ...base,
    id: "garcia",
    name: "Sofia Garcia",
    guests: [{ id: "sofia", firstName: "Sofia", child: false }],
    attendance: { sofia: { diner: "yes" } },
};

const tables: readonly SeatTable[] = [
    { id: "t1", number: 1, name: "Les Lavandes", capacity: 2, x: 20, y: 40 },
    { id: "t2", number: 2, name: "Les Cyprès", capacity: 8, x: 60, y: 40 },
];

describe("seatingPlan", () => {
    it("lists who sits at each table and who still has none", () => {
        const plan = seatingPlan([moreau, bertrand, garcia], tables, { claire: "t1", leo: "t1" });

        expect(
            plan.tables.map((table) => [table.table.id, table.guests.map((g) => g.firstName)]),
        ).toEqual([
            ["t1", ["Claire", "Léo"]],
            ["t2", []],
        ]);
        expect(plan.unseated.map((guest) => guest.firstName)).toEqual(["Sofia"]);
    });

    it("only seats the guests who confirmed the dinner", () => {
        const plan = seatingPlan([bertrand], tables, {});
        expect(plan.unseated).toEqual([]);
    });

    it("warns about a full table, a child alone, guests without a table and seats no longer needed", () => {
        const plan = seatingPlan([moreau, bertrand, garcia], tables, {
            claire: "t1",
            sofia: "t1",
            leo: "t2",
            julien: "t2",
        });

        expect(plan.alerts).toEqual([
            { kind: "full", text: "Table 1 · Les Lavandes : 2 places, 2 invités, c'est complet." },
            {
                kind: "child-alone",
                text: "Léo (enfant) est à la table 2 sans un adulte de son foyer.",
            },
            {
                kind: "not-coming",
                text: "Julien a une place à la table 2 mais ne vient pas au dîner.",
            },
        ]);
    });

    it("counts a table over its capacity as a problem, not just full", () => {
        const plan = seatingPlan([moreau, garcia], tables, {
            claire: "t1",
            leo: "t1",
            sofia: "t1",
        });
        expect(plan.alerts[0]).toEqual({
            kind: "over",
            text: "Table 1 · Les Lavandes : 3 invités pour 2 places.",
        });
    });

    it("reminds the couple how many guests still wait for a table", () => {
        const plan = seatingPlan([moreau, garcia], tables, {});
        expect(plan.alerts).toEqual([
            { kind: "unseated", text: "3 invités au dîner n'ont pas encore de table." },
        ]);
    });
});

describe("tablesRemoval", () => {
    const plan = seatingPlan([moreau, garcia], tables, { claire: "t1", leo: "t1", sofia: "t2" });

    it("names the table and says how many guests lose their seat", () => {
        expect(tablesRemoval(plan.tables, ["t1"])).toEqual({
            question: "Retirer la table 1 ?",
            detail: "Ses 2 invités repasseront « sans table ».",
        });
        expect(tablesRemoval(plan.tables, ["t2"]).detail).toBe(
            "Son invité repassera « sans table ».",
        );
    });

    it("counts the tables and their guests when several go at once", () => {
        expect(tablesRemoval(plan.tables, ["t1", "t2"])).toEqual({
            question: "Retirer les 2 tables ?",
            detail: "Leurs 3 invités repasseront « sans table ».",
        });
        expect(
            tablesRemoval(seatingPlan([garcia], tables, { sofia: "t2" }).tables, ["t1", "t2"])
                .detail,
        ).toBe("Un invité repassera « sans table ».");
    });

    it("has nothing to warn about for empty tables", () => {
        expect(tablesRemoval(seatingPlan([], tables, {}).tables, ["t1"]).detail).toBeUndefined();
    });
});

describe("householdTables", () => {
    it("gives the tables of a household, once each, for its personal page", () => {
        expect(householdTables(moreau, tables, { claire: "t2", leo: "t2" })).toEqual([tables[1]]);
        expect(householdTables(moreau, tables, {})).toEqual([]);
    });
});

describe("validateTable", () => {
    it("accepts a named table with a free number and a sensible capacity", () => {
        expect(validateTable({ ...tables[0], id: "t3", number: 3 }, tables).ok).toBe(true);
        expect(validateTable(tables[0], tables).ok).toBe(true);
    });

    it("refuses a number already taken, no name, and an odd capacity", () => {
        const result = validateTable({ ...tables[0], id: "t3", name: " ", capacity: 0 }, tables);
        expect(!result.ok && result.error).toEqual([
            { path: "name", code: "required" },
            { path: "number", code: "number-taken" },
            { path: "capacity", code: "out-of-range" },
        ]);
    });
});

describe("nextTableNumber", () => {
    it("takes the first free number", () => {
        expect(nextTableNumber(tables)).toBe(3);
        expect(nextTableNumber([tables[1]])).toBe(1);
    });
});

describe("validateQuestions", () => {
    it("accepts short labelled questions", () => {
        expect(
            validateQuestions([{ id: "chanson", label: " Une chanson ", placeholder: "" }]).ok,
        ).toBe(true);
    });

    it("needs a label for each, and keeps the list short", () => {
        const many = [...Array(7).keys()].map((n) => ({ id: `q${n}`, label: "Question" }));
        const result = validateQuestions([{ id: "a", label: "" }, ...many.slice(1)]);
        expect(!result.ok && result.error).toEqual([
            { path: "questions.0.label", code: "required" },
            { path: "questions", code: "limit" },
        ]);
    });
});

describe("questionIdFor", () => {
    it("builds an id from the label, unique among the others", () => {
        expect(questionIdFor("Covoiturage ?", ["covoiturage"])).toBe("covoiturage-2");
    });
});
