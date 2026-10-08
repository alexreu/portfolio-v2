import { describe, expect, it } from "vitest";

import {
    answerDraftOf,
    filterHouseholds,
    groupLabel,
    guestAnswers,
    householdStatus,
    householdSummary,
    householdTimeline,
    momentCell,
    statusCounts,
} from "./households";
import type { HouseholdRecord } from "./types";

const household = (overrides: Partial<HouseholdRecord>): HouseholdRecord => ({
    id: "moreau",
    name: "Famille Moreau",
    group: "famille-2",
    email: "",
    guests: [
        { id: "claire", firstName: "Claire", child: false },
        { id: "antoine", firstName: "Antoine", child: false },
        { id: "leo", firstName: "Léo", child: true },
    ],
    momentKeys: ["ceremonie", "diner"],
    lastSeenAt: null,
    attendance: {},
    diets: {},
    answeredAt: null,
    answeredBy: null,
    createdAt: "2026-09-01T10:00:00+02:00",
    questions: {},
    message: "",
    ...overrides,
});

const answered = household({
    lastSeenAt: "2026-10-01T10:00:00+02:00",
    answeredAt: "2026-10-01T10:05:00+02:00",
    answeredBy: "invite",
    attendance: {
        claire: { ceremonie: "yes", diner: "yes" },
        antoine: { ceremonie: "yes", diner: "no" },
        leo: { ceremonie: "yes", diner: "yes" },
    },
    diets: { claire: { choice: "vegetarien", other: "" } },
});

describe("householdSummary", () => {
    it("leaves the diets out for whoever may not read them", () => {
        expect(householdSummary(answered)).toBe("2 adultes · 1 enfant · végétarien (1)");
        expect(householdSummary(answered, { diets: false })).toBe("2 adultes · 1 enfant");
    });
});

describe("householdStatus", () => {
    it("tells answered, opened and never-opened links apart", () => {
        expect(householdStatus(household({}))).toBe("never-opened");
        expect(householdStatus(household({ lastSeenAt: "2026-10-01T10:00:00+02:00" }))).toBe(
            "opened",
        );
        expect(householdStatus(answered)).toBe("answered");
    });

    it("asks to complete an answer when a moment or a guest was added since", () => {
        expect(
            householdStatus({ ...answered, momentKeys: [...answered.momentKeys, "brunch"] }),
        ).toBe("incomplete");
        expect(
            householdStatus({
                ...answered,
                guests: [...answered.guests, { id: "jade", firstName: "Jade", child: true }],
            }),
        ).toBe("incomplete");
    });
});

describe("momentCell", () => {
    it("says a moment added after the answer is still to be answered", () => {
        const widened = { ...answered, momentKeys: [...answered.momentKeys, "brunch"] };

        expect(momentCell(widened, "brunch")).toEqual({ tone: "wait", label: "À compléter" });
        expect(momentCell(widened, "diner")).toEqual({ tone: "yes", label: "2 sur 3" });
    });

    it("counts who comes to a moment once the household has answered", () => {
        expect(momentCell(answered, "ceremonie")).toEqual({ tone: "yes", label: "3 présents" });
        expect(momentCell(answered, "diner")).toEqual({ tone: "yes", label: "2 sur 3" });
    });

    it("says the household is absent when nobody comes", () => {
        const absent = household({
            ...answered,
            attendance: {
                claire: { ceremonie: "no", diner: "no" },
                antoine: { ceremonie: "no", diner: "no" },
                leo: { ceremonie: "no", diner: "no" },
            },
        });
        expect(momentCell(absent, "diner")).toEqual({ tone: "no", label: "Absents" });
    });

    it("uses the guest's own agreement when they come alone", () => {
        const jeanne = household({
            ...answered,
            guests: [
                {
                    id: "jeanne",
                    firstName: "Jeanne",
                    child: false,
                    labels: { yes: "Présente", no: "Absente" },
                },
            ],
            attendance: { jeanne: { ceremonie: "yes", diner: "no" } },
        });
        expect(momentCell(jeanne, "ceremonie")).toEqual({ tone: "yes", label: "Présente" });
        expect(momentCell(jeanne, "diner")).toEqual({ tone: "no", label: "Absente" });
    });

    it("shows where the household stands before it answers", () => {
        expect(momentCell(household({}), "diner")).toEqual({
            tone: "closed",
            label: "Jamais ouvert",
        });
        expect(momentCell(household({ lastSeenAt: "2026-10-01T10:00:00+02:00" }), "diner")).toEqual(
            { tone: "wait", label: "Lien ouvert" },
        );
    });

    it("marks the moments the household is not invited to", () => {
        expect(momentCell(answered, "brunch")).toEqual({ tone: "none", label: "Non invités" });
    });
});

describe("householdSummary", () => {
    it("sums up who is in the household and their dietary needs", () => {
        expect(householdSummary(answered)).toBe("2 adultes · 1 enfant · végétarien (1)");
        expect(householdSummary(household({ guests: [household({}).guests[0]] }))).toBe("1 adulte");
    });
});

describe("groupLabel", () => {
    it("names the family groups after the couple", () => {
        expect(groupLabel("famille-1", { first: "Camille", second: "Hugo" })).toBe(
            "Famille Camille",
        );
        expect(groupLabel("collegues", { first: "Camille", second: "Hugo" })).toBe("Collègues");
    });
});

describe("filterHouseholds", () => {
    const list = [
        answered,
        household({
            id: "petit",
            name: "Lucas & Emma Petit",
            group: "amis",
            guests: [
                { id: "lucas", firstName: "Lucas", child: false },
                { id: "emma", firstName: "Emma", child: false },
            ],
        }),
        household({
            id: "roux",
            name: "Nathalie Roux",
            group: "amis",
            guests: [{ id: "nathalie", firstName: "Nathalie", child: false }],
            lastSeenAt: "2026-10-01T10:00:00+02:00",
        }),
    ];

    it("finds a household by its name or a guest's first name, accents aside", () => {
        const names = (query: string) =>
            filterHouseholds(list, { query, status: "all", group: "all" }).map((h) => h.id);
        expect(names("petit")).toEqual(["petit"]);
        expect(names("leo")).toEqual(["moreau"]);
        expect(names("")).toEqual(["moreau", "petit", "roux"]);
    });

    it("combines the status and group filters", () => {
        expect(
            filterHouseholds(list, { query: "", status: "opened", group: "amis" }).map((h) => h.id),
        ).toEqual(["roux"]);
    });

    it("counts households by status for the filter tabs", () => {
        expect(statusCounts(list)).toEqual({
            all: 3,
            answered: 1,
            incomplete: 0,
            opened: 1,
            "never-opened": 1,
        });
    });
});

const moments = [
    { key: "ceremonie", title: "Cérémonie", slots: [] },
    { key: "diner", title: "Dîner", slots: [] },
    { key: "brunch", title: "Brunch", slots: [] },
];

describe("guestAnswers", () => {
    it("says who comes to what, person by person, with their diet", () => {
        const withDetail = household({
            ...answered,
            diets: {
                claire: { choice: "vegetarien", other: "" },
                antoine: { choice: "autre", other: "sans lactose" },
            },
        });

        expect(guestAnswers(withDetail, moments)).toEqual([
            {
                id: "claire",
                firstName: "Claire",
                child: false,
                moments: [
                    { key: "ceremonie", title: "Cérémonie", presence: "yes", label: "Présent" },
                    { key: "diner", title: "Dîner", presence: "yes", label: "Présent" },
                ],
                diet: "Végétarien",
            },
            {
                id: "antoine",
                firstName: "Antoine",
                child: false,
                moments: [
                    { key: "ceremonie", title: "Cérémonie", presence: "yes", label: "Présent" },
                    { key: "diner", title: "Dîner", presence: "no", label: "Absent" },
                ],
                diet: "Autre : sans lactose",
            },
            {
                id: "leo",
                firstName: "Léo",
                child: true,
                moments: [
                    { key: "ceremonie", title: "Cérémonie", presence: "yes", label: "Présent" },
                    { key: "diner", title: "Dîner", presence: "yes", label: "Présent" },
                ],
                diet: null,
            },
        ]);
    });

    it("shows the moments still waiting for an answer", () => {
        const [claire] = guestAnswers(household({}), moments);
        expect(claire.moments.map((moment) => moment.label)).toEqual(["En attente", "En attente"]);
    });
});

describe("householdTimeline", () => {
    it("tells the household's story, latest first, from the faire-part sent onwards", () => {
        const story = household({
            ...answered,
            answeredAt: "2026-10-03T10:00:00+02:00",
        });
        const activity = [
            {
                id: "3",
                at: "2026-10-03T10:00:00+02:00",
                kind: "updated" as const,
                text: "Famille Moreau a modifié sa réponse",
                detail: "",
                badge: "FM",
                subject: "moreau",
            },
            {
                id: "2",
                at: "2026-10-02T09:00:00+02:00",
                kind: "opened" as const,
                text: "Famille Moreau a ouvert son lien",
                detail: "",
                badge: "FM",
                subject: "moreau",
            },
            {
                id: "x",
                at: "2026-10-02T08:00:00+02:00",
                kind: "opened" as const,
                text: "Julien Bertrand a ouvert son lien",
                detail: "",
                badge: "JB",
                subject: "bertrand",
            },
        ];

        expect(householdTimeline(story, activity, "Camille")).toEqual([
            { at: "2026-10-03T10:00:00+02:00", label: "Réponse modifiée" },
            { at: "2026-10-02T09:00:00+02:00", label: "Lien ouvert" },
            { at: "2026-09-01T10:00:00+02:00", label: "Faire-part envoyé" },
        ]);
    });

    it("keeps the answer in the story once the feed has forgotten it", () => {
        expect(householdTimeline(answered, [], "Camille")).toEqual([
            { at: "2026-10-01T10:05:00+02:00", label: "Réponse envoyée" },
            { at: "2026-09-01T10:00:00+02:00", label: "Faire-part envoyé" },
        ]);
    });

    it("credits a paper answer to the one who typed it", () => {
        const paper = household({
            ...answered,
            answeredBy: "maries",
            lastSeenAt: null,
        });
        expect(householdTimeline(paper, [], "Camille")[0].label).toBe("Réponse saisie par Camille");
    });
});

describe("answerDraftOf", () => {
    it("fills the answer form with what the household said, consent given with its diets", () => {
        const answered = household({
            attendance: { marie: { diner: "yes" } },
            diets: { marie: { choice: "vegan", other: "" } },
            questions: { chanson: "Respire" },
            message: "Hâte !",
        });

        expect(answerDraftOf(answered)).toEqual({
            attendance: { marie: { diner: "yes" } },
            diets: { marie: { choice: "vegan", other: "" } },
            consent: true,
            questions: { chanson: "Respire" },
            message: "Hâte !",
        });
    });

    it("asks for consent again when no diet was shared", () => {
        expect(answerDraftOf(household({})).consent).toBe(false);
    });
});
