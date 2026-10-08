import { describe, expect, it } from "vitest";

import { weddingCalendar } from "./calendar";
import { catererSheet } from "./caterer-sheet";
import type { DemoState, HouseholdRecord } from "./types";

const base = {
    group: "amis",
    email: "",
    lastSeenAt: null,
    createdAt: "2026-09-01T10:00:00+02:00",
    questions: {},
    message: "",
    momentKeys: ["ceremonie", "diner"],
} as const;

const answered = {
    ...base,
    answeredAt: "2026-10-01T10:00:00+02:00",
    answeredBy: "invite",
} as const;

const households: readonly HouseholdRecord[] = [
    {
        ...answered,
        id: "moreau",
        name: "Famille Moreau",
        guests: [
            { id: "claire", firstName: "Claire", child: false },
            { id: "antoine", firstName: "Antoine", child: false },
            { id: "leo", firstName: "Léo", child: true },
        ],
        attendance: {
            claire: { diner: "yes" },
            antoine: { diner: "no" },
            leo: { diner: "yes" },
        },
        diets: {
            claire: { choice: "vegetarien", other: "" },
            leo: { choice: "sans-gluten", other: "" },
        },
    },
    {
        ...answered,
        id: "garcia",
        name: "Sofia Garcia",
        guests: [{ id: "sofia", firstName: "Sofia", child: false }],
        attendance: { sofia: { diner: "yes" } },
        diets: { sofia: { choice: "autre", other: "allergie aux arachides" } },
    },
    {
        ...base,
        id: "dupont",
        name: "Paul Dupont",
        guests: [{ id: "paul", firstName: "Paul", child: false }],
        attendance: {},
        diets: {},
        answeredAt: null,
        answeredBy: null,
    },
];

const state = {
    design: {
        first: "Camille",
        second: "Hugo",
        date: "2027-06-12",
        place: "Luberon",
        welcome: "",
        tone: "olive",
    },
    households,
    moments: [
        { key: "ceremonie", title: "Cérémonie", slots: [] },
        { key: "diner", title: "Dîner & soirée", slots: [] },
    ],
    tables: [
        { id: "t2", number: 2, name: "Les Cyprès", capacity: 8, x: 40, y: 40 },
        { id: "t1", number: 1, name: "Les Lavandes", capacity: 8, x: 20, y: 40 },
    ],
    seats: { claire: "t1", leo: "t1", antoine: "t1" },
} satisfies Pick<DemoState, "design" | "households" | "moments" | "tables" | "seats">;

const now = new Date("2026-10-07T12:00:00+02:00");
const sheet = catererSheet(state, weddingCalendar(state.design.date), now);

describe("catererSheet", () => {
    it("names the wedding, the meal and the day the sheet was printed", () => {
        expect(sheet).toMatchObject({
            title: "Récapitulatif traiteur · Dîner & soirée",
            wedding: "Mariage de Camille & Hugo",
            when: "Samedi 12 juin 2027 · Luberon",
            edited: "Édité le 7 octobre 2026",
            filename: "recap-traiteur-camille-hugo-diner.pdf",
        });
    });

    it("counts the covers, and warns while answers are missing", () => {
        expect(sheet.total).toBe(3);
        expect(sheet.warning).toBe(
            "1 invité n'a pas encore répondu pour ce repas : chiffres provisoires.",
        );
    });

    it("lists only the menus someone eats, with the details the kitchen needs", () => {
        expect(sheet.menus).toEqual([
            { label: "Végétarien", detail: "", count: 1 },
            { label: "Autre", detail: "allergie aux arachides", count: 1 },
            { label: "Menu enfant", detail: "dont sans gluten (1)", count: 1 },
        ]);
    });

    it("gives every table its covers and who eats something else, guests coming only", () => {
        expect(sheet.tables).toEqual([
            {
                label: "Table 1 · Les Lavandes",
                count: 2,
                notes: ["Végétarien : Claire", "Menu enfant sans gluten : Léo"],
            },
            { label: "Table 2 · Les Cyprès", count: 0, notes: [] },
        ]);
        expect(sheet.unseated).toBe("1 invité confirmé n'a pas encore de table.");
    });

    it("says nothing is missing once everyone answered and sat down", () => {
        const done = catererSheet(
            {
                ...state,
                households: households.slice(0, 2),
                seats: { ...state.seats, sofia: "t2" },
            },
            weddingCalendar(state.design.date),
            now,
        );

        expect(done.warning).toBeNull();
        expect(done.unseated).toBeNull();
        expect(done.tables[1].notes).toEqual(["Autre (allergie aux arachides) : Sofia"]);
    });

    it("names a child's allergy under the children's menu, even before they sit down", () => {
        const child: HouseholdRecord = {
            ...answered,
            id: "anne",
            name: "Anne & Léo",
            guests: [
                { id: "anne", firstName: "Anne", child: false },
                { id: "leo-a", firstName: "Léo", child: true },
            ],
            momentKeys: ["diner"],
            attendance: { anne: { diner: "yes" }, "leo-a": { diner: "yes" } },
            diets: { "leo-a": { choice: "autre", other: "allergie arachides" } },
        };
        const alone = catererSheet(
            { ...state, households: [child], tables: [], seats: {} },
            weddingCalendar(state.design.date),
            now,
        );

        expect(alone.menus.find((menu) => menu.label === "Menu enfant")?.detail).toContain(
            "allergie arachides",
        );
    });
});
