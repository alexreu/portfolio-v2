import { describe, expect, it } from "vitest";

import { noGrant, templateGrant, type Collaborator } from "./access";
import { weddingCalendar } from "./calendar";
import { pageSummaries } from "./pages";
import type { DemoState, HouseholdRecord } from "./types";

const household = (id: string, answered: boolean): HouseholdRecord => ({
    id,
    name: id,
    group: "amis",
    email: "",
    guests: [{ id: `${id}-1`, firstName: "Léa", child: false }],
    momentKeys: ["diner"],
    lastSeenAt: null,
    attendance: answered ? { [`${id}-1`]: { diner: "yes" } } : {},
    diets: {},
    answeredAt: answered ? "2026-09-01T10:00:00Z" : null,
    answeredBy: answered ? "invite" : null,
    createdAt: "2026-08-01T10:00:00Z",
    questions: {},
    message: "",
});

const collaborator = (id: string, joinedAt: string | null): Collaborator => ({
    id,
    firstName: id,
    email: `${id}@exemple.fr`,
    role: "",
    grant: templateGrant("temoin"),
    invitedAt: "2026-10-06T10:00:00Z",
    joinedAt,
});

const state: DemoState = {
    version: 1,
    design: {
        first: "Camille",
        second: "Hugo",
        date: "2027-06-12",
        place: "Luberon",
        welcome: "",
        tone: "olive",
    },
    households: [household("a", true), household("b", true), household("c", false)],
    activity: [],
    photos: [
        { id: "p1", src: "/p1.jpg", alt: "", author: "Léa", removed: false },
        { id: "p2", src: "/p2.jpg", alt: "", author: "Léa", removed: true },
    ],
    lastReminder: null,
    moments: [
        { key: "ceremonie", title: "Cérémonie", slots: [] },
        { key: "diner", title: "Dîner", slots: [] },
    ],
    questions: [{ id: "chanson", label: "Une chanson" }],
    tables: [{ id: "t1", number: 1, name: "Les Lavandes", capacity: 8, x: 20, y: 40 }],
    seats: { "a-1": "t1" },
    room: {
        name: "L'orangerie",
        size: "s",
        revealAt: "10:00",
        head: { x: 50, y: 11, rotation: 0 },
        entrance: { x: 50, y: 96, rotation: 0 },
    },
    dates: { answerDeadline: null, reminder: null, galleryOpens: null },
    collaborators: [collaborator("elsa", "2026-10-06T12:00:00Z"), collaborator("malik", null)],
};

const now = new Date("2026-10-07T12:00:00Z");
const summaries = (next: DemoState = state) =>
    pageSummaries(next, weddingCalendar(next.design.date, next.dates), now);

describe("pageSummaries", () => {
    it("counts the households still to answer", () => {
        expect(summaries().invites).toBe("3 foyers · 1 sans réponse");
        expect(summaries({ ...state, households: state.households.slice(0, 2) }).invites).toBe(
            "2 foyers · tous ont répondu",
        );
    });

    it("gives the programme's moments and the answer deadline", () => {
        expect(summaries().programme).toBe("2 moments · réponses avant le 1er mai 2027");
    });

    it("counts the guests coming to dinner who still have no table", () => {
        expect(summaries()["plan-de-table"]).toBe("1 table · 1 invité sans table");
        expect(summaries({ ...state, seats: { "a-1": "t1", "b-1": "t1" } })["plan-de-table"]).toBe(
            "1 table · tout le monde est placé",
        );
    });

    it("counts the couple's questions", () => {
        expect(summaries()["faire-part"]).toBe("1 question aux invités");
        expect(summaries({ ...state, questions: [] })["faire-part"]).toBe("Sans question");
    });

    it("announces the next automatic reminder, then the last one once it has passed", () => {
        expect(summaries().relances).toBe("Prochaine le vendredi 16 avril");
        expect(
            summaries({
                ...state,
                dates: { ...state.dates, reminder: "2026-10-01" },
                lastReminder: { at: "2026-10-06T12:00:00Z", count: 4 },
            }).relances,
        ).toBe("Dernière hier, à 4 foyers");
    });

    it("counts the photos guests can see", () => {
        expect(summaries().galerie).toBe("1 photo visible · ouverture le vendredi 11 juin");
    });

    it("counts the people sharing the dashboard and the invitations not yet accepted", () => {
        expect(summaries().acces).toBe("2 personnes · 1 invitation en attente");
        expect(summaries({ ...state, collaborators: [] }).acces).toBe("Vous deux seulement");
        expect(
            summaries({
                ...state,
                collaborators: [{ ...collaborator("elsa", "x"), grant: noGrant }],
            }).acces,
        ).toBe("1 personne");
    });

    it("tells an expired invitation from one still waiting", () => {
        const late = { ...collaborator("elsa", null), invitedAt: "2026-10-01T10:00:00Z" };

        expect(summaries({ ...state, collaborators: [late] }).acces).toBe(
            "1 personne · 1 invitation expirée",
        );
    });

    it("says there is nothing yet rather than « tous ont répondu » or « tout le monde est placé »", () => {
        expect(summaries({ ...state, households: [] }).invites).toBe("Aucun foyer pour l'instant");
        expect(summaries({ ...state, tables: [] })["plan-de-table"]).toBe(
            "Aucune table pour l'instant",
        );
    });
});
