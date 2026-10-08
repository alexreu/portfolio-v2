import { describe, expect, it } from "vitest";

import { weddingCalendar } from "./calendar";
import { galleryPoster, householdInvitations, seatingPoster, sharedInvitation } from "./prints";
import type { HouseholdRecord, InvitationDesign } from "./types";

const design: InvitationDesign = {
    first: "Camille",
    second: "Hugo",
    date: "2027-06-12",
    place: "Luberon",
    welcome: "Bienvenue {invités}",
    tone: "olive",
};

const calendar = weddingCalendar(design.date);
const SITE = "https://alexdevlab.fr/mariage/demo";

const household = (id: string, name: string): HouseholdRecord => ({
    id,
    name,
    group: "amis",
    email: "",
    guests: [],
    momentKeys: [],
    lastSeenAt: null,
    attendance: {},
    diets: {},
    answeredAt: null,
    answeredBy: null,
    createdAt: "2026-09-01T10:00:00+02:00",
    questions: {},
    message: "",
});

const households = [
    household("famille-martin-demo", "Famille Martin"),
    household("zoe-elodie-demo", "Zoé & Élodie"),
];

const linkFor = (record: HouseholdRecord) => `${SITE}?foyer=${record.id}`;

describe("sharedInvitation", () => {
    it("is one card for everyone, its QR code opening the site", () => {
        const print = sharedInvitation(design, calendar, SITE);

        expect(print.cards).toHaveLength(1);
        expect(print.cards[0]).toMatchObject({
            addressee: null,
            couple: "Camille & Hugo",
            when: "Samedi 12 juin 2027 · Luberon",
            qrUrl: SITE,
            qrNote: "Scannez pour répondre",
            siteLabel: "alexdevlab.fr/mariage/demo",
        });
        expect(print.tone).toBe("olive");
        expect(print.filename).toBe("faire-part-camille-hugo.pdf");
    });

    it("asks for an answer before the deadline", () => {
        const { cards } = sharedInvitation(design, calendar, SITE);

        expect(cards[0].answerBy).toBe("Merci de répondre avant le 1er mai 2027");
    });
});

describe("householdInvitations", () => {
    it("is one card per household, each QR code opening its own answer", () => {
        const print = householdInvitations(design, calendar, SITE, households, linkFor);

        expect(print.cards.map((card) => [card.addressee, card.qrUrl])).toEqual([
            ["Famille Martin", `${SITE}?foyer=famille-martin-demo`],
            ["Zoé & Élodie", `${SITE}?foyer=zoe-elodie-demo`],
        ]);
        expect(print.cards[0].qrNote).toBe("Scannez : votre réponse vous attend");
        expect(print.cards.every((card) => card.siteLabel === "alexdevlab.fr/mariage/demo")).toBe(
            true,
        );
        expect(print.filename).toBe("faire-part-par-foyer-camille-hugo.pdf");
    });

    it("is named after the household when it is printed for one only", () => {
        const print = householdInvitations(design, calendar, SITE, [households[1]], linkFor);

        expect(print.filename).toBe("faire-part-zoe-elodie.pdf");
    });
});

describe("seatingPoster", () => {
    const url = `${SITE}/plan-de-table`;

    it("sends guests to the room plan, and nowhere near the faire-part", () => {
        const poster = seatingPoster(design, calendar, "L'orangerie", url);

        expect(poster).toMatchObject({
            title: "Plan de table · Camille & Hugo",
            couple: "Camille & Hugo",
            when: "Samedi 12 juin 2027 · Luberon",
            welcome: "Bienvenue à L'orangerie",
            headline: "Trouvez votre table",
            qrUrl: url,
            addressLabel: "alexdevlab.fr/mariage/demo/plan-de-table",
            tableCards: false,
            tone: "olive",
            filename: "affiche-plan-de-table-camille-hugo.pdf",
        });
    });

    it("simply welcomes guests when the room has no name", () => {
        expect(seatingPoster(design, calendar, "  ", url).welcome).toBe("Bienvenue");
    });
});

describe("galleryPoster", () => {
    it("sends guests to the gallery, with cards for every table", () => {
        const url = `${SITE}/galerie`;
        const poster = galleryPoster(design, calendar, url);

        expect(poster).toMatchObject({
            title: "Galerie photo · Camille & Hugo",
            headline: "Partagez vos photos",
            qrUrl: url,
            addressLabel: "alexdevlab.fr/mariage/demo/galerie",
            tableCards: true,
            filename: "affiche-galerie-camille-hugo.pdf",
        });
        expect(poster.detail).toContain("votre nom");
    });
});

describe("file names", () => {
    it("never ends up as « faire-part-.pdf » for names without a Latin letter", () => {
        const print = sharedInvitation({ ...design, first: "李", second: "王" }, calendar, SITE);

        expect(print.filename).toBe("faire-part-mariage.pdf");
    });
});
