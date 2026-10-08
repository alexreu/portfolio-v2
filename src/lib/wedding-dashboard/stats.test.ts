import { describe, expect, it } from "vitest";

import { catererSummary, momentTallies, overview } from "./stats";
import type { HouseholdRecord } from "./types";

const base = {
    group: "amis",
    email: "",
    diets: {},
    answeredBy: null,
    createdAt: "2026-09-01T10:00:00+02:00",
    questions: {},
    message: "",
} as const;

const households: readonly HouseholdRecord[] = [
    {
        ...base,
        id: "moreau",
        name: "Famille Moreau",
        guests: [
            { id: "claire", firstName: "Claire", child: false },
            { id: "antoine", firstName: "Antoine", child: false },
            { id: "leo", firstName: "Léo", child: true },
        ],
        momentKeys: ["ceremonie", "diner"],
        lastSeenAt: "2026-10-01T10:00:00+02:00",
        answeredAt: "2026-10-01T10:05:00+02:00",
        answeredBy: "invite",
        attendance: {
            claire: { ceremonie: "yes", diner: "yes" },
            antoine: { ceremonie: "yes", diner: "no" },
            leo: { ceremonie: "yes", diner: "yes" },
        },
        diets: {
            claire: { choice: "vegetarien", other: "" },
            leo: { choice: "sans-gluten", other: "" },
        },
    },
    {
        ...base,
        id: "dupont",
        name: "Maxime Dupont",
        guests: [{ id: "maxime", firstName: "Maxime", child: false }],
        momentKeys: ["ceremonie", "diner"],
        lastSeenAt: "2026-10-02T10:00:00+02:00",
        answeredAt: "2026-10-02T10:05:00+02:00",
        answeredBy: "invite",
        attendance: { maxime: { ceremonie: "yes", diner: "yes" } },
        diets: { maxime: { choice: "autre", other: "allergie aux arachides" } },
    },
    {
        ...base,
        id: "roux",
        name: "Nathalie Roux",
        guests: [{ id: "nathalie", firstName: "Nathalie", child: false }],
        momentKeys: ["ceremonie"],
        lastSeenAt: "2026-10-03T10:00:00+02:00",
        answeredAt: null,
        attendance: {},
    },
    {
        ...base,
        id: "petit",
        name: "Lucas & Emma Petit",
        guests: [
            { id: "lucas", firstName: "Lucas", child: false },
            { id: "emma", firstName: "Emma", child: false },
        ],
        momentKeys: ["ceremonie", "diner"],
        lastSeenAt: null,
        answeredAt: null,
        attendance: {},
    },
];

const moments = [
    { key: "ceremonie", title: "Cérémonie", slots: [] },
    { key: "diner", title: "Dîner", slots: [] },
];

describe("overview", () => {
    it("counts answers by guest and by household, and links never opened", () => {
        expect(overview(households)).toEqual({
            guests: 7,
            guestsAnswered: 4,
            households: 4,
            householdsAnswered: 2,
            householdsOpened: 3,
            neverOpened: 1,
            pending: 2,
        });
    });
});

describe("momentTallies", () => {
    it("splits each moment's invited guests into present, absent and waiting", () => {
        expect(momentTallies(households, moments)).toEqual([
            { key: "ceremonie", title: "Cérémonie", invited: 7, yes: 4, no: 0, pending: 3 },
            { key: "diner", title: "Dîner", invited: 6, yes: 3, no: 1, pending: 2 },
        ]);
    });
});

describe("catererSummary", () => {
    it("gives the caterer the adults' menus, the children and every detail to know", () => {
        expect(catererSummary(households, "diner")).toEqual({
            total: 3,
            standard: 0,
            diets: [
                { choice: "vegetarien", label: "Végétarien", count: 1 },
                { choice: "vegan", label: "Végan", count: 0 },
                { choice: "sans-gluten", label: "Sans gluten", count: 0 },
                { choice: "autre", label: "Autre", count: 1 },
            ],
            details: ["allergie aux arachides"],
            children: 1,
            childrenDiets: ["sans gluten (1)"],
        });
    });

    it("keeps a child's own allergy for the children's menu, never lost with the adults'", () => {
        const child = {
            ...base,
            id: "anne",
            name: "Anne & Léo",
            guests: [
                { id: "anne", firstName: "Anne", child: false },
                { id: "leo", firstName: "Léo", child: true },
            ],
            momentKeys: ["diner"],
            lastSeenAt: null,
            answeredAt: "2026-10-01T10:05:00+02:00",
            answeredBy: "invite" as const,
            attendance: { anne: { diner: "yes" as const }, leo: { diner: "yes" as const } },
            diets: { leo: { choice: "autre" as const, other: "allergie arachides" } },
        };

        const summary = catererSummary([child], "diner");

        expect(summary.details).toEqual([]);
        expect(summary.childrenDiets).toEqual(["autre : allergie arachides"]);
    });
});

describe("overview · an answer to complete", () => {
    it("does not count a household whose answer misses a moment added since", () => {
        const [moreau] = households;
        const widened = { ...moreau, momentKeys: [...moreau.momentKeys, "brunch"] };

        expect(overview([widened])).toMatchObject({ householdsAnswered: 0, pending: 1 });
    });
});
