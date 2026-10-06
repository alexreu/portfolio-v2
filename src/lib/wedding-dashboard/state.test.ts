import { describe, expect, it } from "vitest";

import { demoReducer, parseDemoState } from "./state";
import type { DemoState, HouseholdRecord } from "./types";

const lefevre: HouseholdRecord = {
    id: "lefevre",
    name: "Marie & Thomas",
    group: "amis",
    email: "",
    guests: [
        { id: "marie", firstName: "Marie", child: false },
        { id: "thomas", firstName: "Thomas", child: false },
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
};

const state: DemoState = {
    version: 1,
    design: {
        first: "Camille",
        second: "Hugo",
        date: "2027-06-12",
        place: "Luberon",
        welcome: "Chers {invités}, nous nous marions.",
        tone: "olive",
    },
    households: [lefevre],
    activity: [],
    photos: [{ id: "p1", src: "/p1.jpg", alt: "Une photo", author: "Léa", removed: false }],
    lastReminder: null,
};

const at = "2026-10-06T10:00:00+02:00";

describe("demoReducer", () => {
    it("records the first visit through the personal link", () => {
        const next = demoReducer(state, { type: "household-opened", householdId: "lefevre", at });

        expect(next.households[0].lastSeenAt).toBe(at);
        expect(next.activity[0]).toMatchObject({
            kind: "opened",
            text: "Marie & Thomas a ouvert son lien",
            detail: "pas encore de réponse",
            badge: "MT",
        });
    });

    it("does not flood the activity when the same guest comes back within the hour", () => {
        const once = demoReducer(state, { type: "household-opened", householdId: "lefevre", at });
        const twice = demoReducer(once, {
            type: "household-opened",
            householdId: "lefevre",
            at: "2026-10-06T10:20:00+02:00",
        });

        expect(twice.activity).toHaveLength(1);
        expect(twice.households[0].lastSeenAt).toBe("2026-10-06T10:20:00+02:00");
    });

    it("stores an answer for the household's guests and moments only", () => {
        const next = demoReducer(state, {
            type: "answer-recorded",
            householdId: "lefevre",
            at,
            draft: {
                attendance: {
                    marie: { ceremonie: "yes", diner: "yes", brunch: "yes" },
                    thomas: { ceremonie: "yes", diner: "no" },
                    intrus: { ceremonie: "yes" },
                },
                diets: { marie: { choice: "vegetarien", other: "" } },
                consent: true,
                questions: { chanson: " Daft Punk — One More Time ", covoiturage: "  " },
                message: "  Trop hâte ! ",
            },
        });

        expect(next.households[0]).toMatchObject({
            attendance: {
                marie: { ceremonie: "yes", diner: "yes" },
                thomas: { ceremonie: "yes", diner: "no" },
            },
            diets: { marie: { choice: "vegetarien", other: "" } },
            answeredAt: at,
            answeredBy: "invite",
            lastSeenAt: at,
            questions: { chanson: "Daft Punk — One More Time" },
            message: "Trop hâte !",
        });
        expect(next.activity[0]).toMatchObject({
            kind: "answered",
            text: "Marie & Thomas a répondu",
            detail: "2 présents · végétarien (1) · un mot pour vous",
            subject: "lefevre",
        });
    });

    it("tells a change of answer from a first answer", () => {
        const draft = {
            attendance: {
                marie: { ceremonie: "no", diner: "no" },
                thomas: { ceremonie: "no", diner: "no" },
            },
            diets: {},
            consent: false,
            questions: {},
            message: "",
        } as const;
        const first = demoReducer(state, {
            type: "answer-recorded",
            householdId: "lefevre",
            at,
            draft,
        });
        const second = demoReducer(first, {
            type: "answer-recorded",
            householdId: "lefevre",
            at: "2026-10-07T10:00:00+02:00",
            draft,
        });

        expect(second.activity[0]).toMatchObject({
            kind: "updated",
            text: "Marie & Thomas a modifié sa réponse",
            detail: "ne pourra pas venir",
        });
    });

    it("credits the couple with a paper answer they typed in", () => {
        const next = demoReducer(state, {
            type: "answer-recorded",
            householdId: "lefevre",
            at,
            by: "maries",
            draft: {
                attendance: {
                    marie: { ceremonie: "yes", diner: "yes" },
                    thomas: { ceremonie: "yes", diner: "yes" },
                },
                diets: {},
                consent: false,
                questions: {},
                message: "",
            },
        });

        expect(next.households[0].answeredBy).toBe("maries");
        expect(next.households[0].lastSeenAt).toBeNull();
        expect(next.activity[0].text).toBe("Réponse de Marie & Thomas saisie par Camille");
    });

    it("adds a new household at the top of the list", () => {
        const household = { ...lefevre, id: "martin", name: "Famille Martin" };
        const next = demoReducer(state, { type: "household-added", household, at });

        expect(next.households.map((h) => h.id)).toEqual(["martin", "lefevre"]);
        expect(next.activity[0]).toMatchObject({
            kind: "created",
            text: "Faire-part créé pour Famille Martin",
        });
    });

    it("sends a reminder to every household that has not answered", () => {
        const next = demoReducer(state, { type: "reminder-sent", at });

        expect(next.lastReminder).toEqual({ at, count: 1 });
        expect(next.activity[0]).toMatchObject({
            kind: "reminded",
            text: "Relance envoyée à 1 foyer",
        });
    });

    it("removes a photo from the gallery, and puts it back", () => {
        const removed = demoReducer(state, { type: "photo-toggled", photoId: "p1", at });
        const restored = demoReducer(removed, { type: "photo-toggled", photoId: "p1", at });

        expect(removed.photos[0].removed).toBe(true);
        expect(removed.activity[0].text).toBe("Photo de Léa retirée de la galerie");
        expect(restored.photos[0].removed).toBe(false);
    });

    it("saves the faire-part design", () => {
        const next = demoReducer(state, {
            type: "design-saved",
            at,
            design: { ...state.design, first: "Élise", date: "2027-09-04" },
        });

        expect(next.design.first).toBe("Élise");
        expect(next.activity[0]).toMatchObject({
            kind: "design",
            text: "Faire-part mis à jour",
            detail: "Élise & Hugo · Samedi 4 septembre 2027",
        });
    });
});

describe("parseDemoState", () => {
    it("reads back what was saved", () => {
        expect(parseDemoState(JSON.stringify(state))).toEqual(state);
    });

    it("still reads a copy saved before notes and questions were kept", () => {
        const older = {
            ...state,
            households: state.households.map(({ questions, message, ...rest }) => rest),
            activity: [{ id: "a", at, kind: "opened", text: "t", detail: "d", badge: "" }],
        };

        const parsed = parseDemoState(JSON.stringify(older));

        expect(parsed?.households[0]).toMatchObject({ questions: {}, message: "" });
        expect(parsed?.activity[0].subject).toBe("");
    });

    it("ignores anything it cannot trust, so the demo starts afresh", () => {
        expect(parseDemoState(null)).toBeNull();
        expect(parseDemoState("{oops")).toBeNull();
        expect(parseDemoState(JSON.stringify({ ...state, version: 2 }))).toBeNull();
        expect(parseDemoState(JSON.stringify({ ...state, households: [{ id: 1 }] }))).toBeNull();
    });
});
