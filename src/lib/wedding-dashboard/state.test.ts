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
    moments: [
        {
            key: "ceremonie",
            title: "Cérémonie",
            slots: [
                { id: "c1", title: "Cérémonie", place: "", dayOffset: 0, start: "16:00", end: "" },
            ],
        },
        {
            key: "diner",
            title: "Dîner",
            slots: [{ id: "d1", title: "Dîner", place: "", dayOffset: 0, start: "20:00", end: "" }],
        },
    ],
    questions: [{ id: "chanson", label: "Une chanson", placeholder: "" }],
    tables: [{ id: "t7", number: 7, name: "Les Oliviers", capacity: 8, x: 64, y: 75 }],
    seats: { marie: "t7" },
    room: { name: "L'orangerie", size: "s", head: { x: 50, y: 11 }, entrance: { x: 50, y: 96 } },
    dates: { answerDeadline: null, reminder: null, galleryOpens: null },
};

const extras = () => ({
    moments: [],
    questions: [],
    tables: [],
    seats: {},
    room: state.room,
    dates: state.dates,
});

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

describe("demoReducer · programme, questions and room plan", () => {
    const answeredLefevre: DemoState = {
        ...state,
        households: [
            {
                ...lefevre,
                answeredAt: at,
                answeredBy: "invite",
                attendance: {
                    marie: { ceremonie: "yes", diner: "yes" },
                    thomas: { ceremonie: "yes", diner: "no" },
                },
            },
        ],
    };

    const brunch = {
        key: "brunch",
        title: "Brunch",
        slots: [{ id: "b1", title: "Brunch", place: "", dayOffset: 1, start: "11:00", end: "" }],
    };

    it("adds a moment, and invites every household when asked", () => {
        const next = demoReducer(state, {
            type: "moment-saved",
            moment: brunch,
            inviteAll: true,
            at,
        });

        expect(next.moments.map((moment) => moment.key)).toEqual(["ceremonie", "diner", "brunch"]);
        expect(next.households[0].momentKeys).toEqual(["ceremonie", "diner", "brunch"]);
        expect(next.activity[0].text).toBe("Moment ajouté : Brunch");
    });

    it("renames a moment in place", () => {
        const next = demoReducer(state, {
            type: "moment-saved",
            moment: { ...state.moments[1], title: "Dîner & soirée" },
            inviteAll: false,
            at,
        });

        expect(next.moments[1].title).toBe("Dîner & soirée");
        expect(next.activity[0].text).toBe("Moment modifié : Dîner & soirée");
    });

    it("removes a moment from the programme and from every invitation and answer", () => {
        const next = demoReducer(answeredLefevre, { type: "moment-removed", key: "diner", at });

        expect(next.moments.map((moment) => moment.key)).toEqual(["ceremonie"]);
        expect(next.households[0].momentKeys).toEqual(["ceremonie"]);
        expect(next.households[0].attendance).toEqual({
            marie: { ceremonie: "yes" },
            thomas: { ceremonie: "yes" },
        });
    });

    it("moves the wedding day and keeps the dates the couple set", () => {
        const next = demoReducer(state, {
            type: "dates-saved",
            day: "2027-09-04",
            dates: { answerDeadline: "2027-08-01", reminder: null, galleryOpens: null },
            at,
        });

        expect(next.design.date).toBe("2027-09-04");
        expect(next.dates.answerDeadline).toBe("2027-08-01");
        expect(next.activity[0]).toMatchObject({
            text: "Dates du mariage mises à jour",
            detail: "Samedi 4 septembre 2027 · réponses avant le 1er août 2027",
        });
    });

    it("saves the faire-part's questions", () => {
        const questions = [{ id: "covoiturage", label: "Covoiturage ?", placeholder: "" }];
        const next = demoReducer(state, { type: "questions-saved", questions, at });

        expect(next.questions).toEqual(questions);
        expect(next.activity[0].text).toBe("Questions du faire-part mises à jour");
    });

    it("adds, moves and removes a table, freeing its seats", () => {
        const table = { id: "t1", number: 1, name: "Les Lavandes", capacity: 6, x: 20, y: 40 };
        const added = demoReducer(state, { type: "table-saved", table });
        const moved = demoReducer(added, { type: "table-moved", tableId: "t1", x: 120, y: -5 });
        const removed = demoReducer(moved, { type: "table-removed", tableId: "t7" });

        expect(moved.tables.find((t) => t.id === "t1")).toMatchObject({ x: 96, y: 4 });
        expect(removed.tables.map((t) => t.id)).toEqual(["t1"]);
        expect(removed.seats).toEqual({});
    });

    it("renames and enlarges the room, and moves the couple's table and the entrance", () => {
        const renamed = demoReducer(state, {
            type: "room-saved",
            name: "La grange",
            size: "l",
        });
        const moved = demoReducer(renamed, { type: "fixture-moved", fixture: "head", x: 20, y: 0 });
        const door = demoReducer(moved, {
            type: "fixture-moved",
            fixture: "entrance",
            x: 101,
            y: 50,
        });

        expect(door.room).toEqual({
            name: "La grange",
            size: "l",
            head: { x: 20, y: 4 },
            entrance: { x: 96, y: 50 },
        });
    });

    it("seats a guest, moves them, and takes the seat back", () => {
        const seated = demoReducer(state, {
            type: "guest-seated",
            guestId: "thomas",
            tableId: "t7",
        });
        const freed = demoReducer(seated, {
            type: "guest-seated",
            guestId: "marie",
            tableId: null,
        });

        expect(seated.seats).toEqual({ marie: "t7", thomas: "t7" });
        expect(freed.seats).toEqual({ thomas: "t7" });
    });

    it("seats a whole household at once, only those coming to dinner", () => {
        const next = demoReducer(
            { ...answeredLefevre, seats: {} },
            { type: "household-seated", householdId: "lefevre", tableId: "t7" },
        );

        expect(next.seats).toEqual({ marie: "t7" });
    });
});

describe("parseDemoState", () => {
    it("reads back what was saved", () => {
        expect(parseDemoState(JSON.stringify(state), extras)).toEqual(state);
    });

    it("still reads a copy saved before notes and questions were kept", () => {
        const older = {
            ...state,
            households: state.households.map(({ questions, message, ...rest }) => rest),
            activity: [{ id: "a", at, kind: "opened", text: "t", detail: "d", badge: "" }],
        };

        const parsed = parseDemoState(JSON.stringify(older), extras);

        expect(parsed?.households[0]).toMatchObject({ questions: {}, message: "" });
        expect(parsed?.activity[0].subject).toBe("");
    });

    it("fills in the programme, questions and room plan missing from an older copy", () => {
        const { moments, questions, tables, seats, room, dates, ...older } = state;
        const parsed = parseDemoState(JSON.stringify(older), () => ({
            moments,
            questions,
            tables,
            seats,
            room,
            dates,
        }));

        expect(parsed).toEqual(state);
    });

    it("ignores anything it cannot trust, so the demo starts afresh", () => {
        expect(parseDemoState(null, extras)).toBeNull();
        expect(parseDemoState("{oops", extras)).toBeNull();
        expect(parseDemoState(JSON.stringify({ ...state, version: 2 }), extras)).toBeNull();
        expect(
            parseDemoState(JSON.stringify({ ...state, households: [{ id: 1 }] }), extras),
        ).toBeNull();
    });
});
