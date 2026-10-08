import type { WeddingCalendar } from "./calendar";
import { slugOf } from "./drafts";
import type { HouseholdRecord, InvitationDesign, SealTone } from "./types";

/** One printed faire-part: the couple, the day, and a QR code to answer. */
export type InvitationCard = {
    /** "Famille Martin" on a household's own card; null on the card shared by everyone. */
    readonly addressee: string | null;
    readonly couple: string;
    /** "Samedi 12 juin 2027 · Luberon" */
    readonly when: string;
    readonly answerBy: string;
    readonly qrUrl: string;
    /** Above the code: what scanning it opens. */
    readonly qrNote: string;
    /** The site's address without its protocol, for whoever cannot scan. */
    readonly siteLabel: string;
};

/** The faire-part to print, one card per page, in the colour of the seal. */
export type InvitationPrint = {
    readonly title: string;
    readonly tone: SealTone;
    readonly cards: readonly InvitationCard[];
    readonly filename: string;
};

/** A poster to print for the day, its QR code opening one page of the site only. */
export type QrPoster = {
    /** The PDF's title. */
    readonly title: string;
    readonly couple: string;
    readonly when: string;
    readonly welcome: string;
    readonly headline: string;
    readonly detail: string;
    readonly qrUrl: string;
    /** The page's address without its protocol, for whoever cannot scan. */
    readonly addressLabel: string;
    /** A sheet of four cards to cut out and lay on the tables, after the poster. */
    readonly tableCards: boolean;
    readonly tone: SealTone;
    readonly filename: string;
};

const coupleOf = (design: InvitationDesign) => `${design.first} & ${design.second}`;

/** "camille-hugo"; "mariage" for names without a Latin letter, never an empty file name. */
const coupleSlug = (design: InvitationDesign) => slugOf(coupleOf(design)) || "mariage";

const whenOf = (design: InvitationDesign, calendar: WeddingCalendar) =>
    `${calendar.dateLabel} · ${design.place}`;

const siteLabelOf = (siteUrl: string) => siteUrl.replace(/^https?:\/\//, "");

const card = (
    design: InvitationDesign,
    calendar: WeddingCalendar,
    siteUrl: string,
    addressee: string | null,
    qrUrl: string,
): InvitationCard => ({
    addressee,
    couple: coupleOf(design),
    when: whenOf(design, calendar),
    answerBy: `Merci de répondre avant le ${calendar.answerDeadlineLabel}`,
    qrUrl,
    qrNote: addressee ? "Scannez : votre réponse vous attend" : "Scannez pour répondre",
    siteLabel: siteLabelOf(siteUrl),
});

/** The faire-part every guest receives alike: its QR code opens the site. */
export const sharedInvitation = (
    design: InvitationDesign,
    calendar: WeddingCalendar,
    siteUrl: string,
): InvitationPrint => ({
    title: `Faire-part de ${coupleOf(design)}`,
    tone: design.tone,
    cards: [card(design, calendar, siteUrl, null, siteUrl)],
    filename: `faire-part-${coupleSlug(design)}.pdf`,
});

/**
 * One faire-part per household, addressed to it: its QR code opens the household's own page,
 * already knowing who answers. Scanned again on the day, the same page shows its table.
 */
export const householdInvitations = (
    design: InvitationDesign,
    calendar: WeddingCalendar,
    siteUrl: string,
    households: readonly HouseholdRecord[],
    linkFor: (household: HouseholdRecord) => string,
): InvitationPrint => ({
    title: `Faire-part de ${coupleOf(design)}, par foyer`,
    tone: design.tone,
    cards: households.map((household) =>
        card(design, calendar, siteUrl, household.name, linkFor(household)),
    ),
    filename:
        households.length === 1
            ? `faire-part-${slugOf(households[0].name) || "foyer"}.pdf`
            : `faire-part-par-foyer-${coupleSlug(design)}.pdf`,
});

const poster = (
    design: InvitationDesign,
    calendar: WeddingCalendar,
    page: Pick<QrPoster, "welcome" | "headline" | "detail" | "qrUrl" | "tableCards"> & {
        readonly name: string;
        readonly slug: string;
    },
): QrPoster => ({
    title: `${page.name} · ${coupleOf(design)}`,
    couple: coupleOf(design),
    when: whenOf(design, calendar),
    welcome: page.welcome,
    headline: page.headline,
    detail: page.detail,
    qrUrl: page.qrUrl,
    addressLabel: siteLabelOf(page.qrUrl),
    tableCards: page.tableCards,
    tone: design.tone,
    filename: `affiche-${page.slug}-${coupleSlug(design)}.pdf`,
});

/** At the entrance of the dinner: its code opens the room plan, and nothing else. */
export const seatingPoster = (
    design: InvitationDesign,
    calendar: WeddingCalendar,
    roomName: string,
    url: string,
): QrPoster =>
    poster(design, calendar, {
        name: "Plan de table",
        slug: "plan-de-table",
        welcome: roomName.trim() ? `Bienvenue à ${roomName.trim()}` : "Bienvenue",
        headline: "Trouvez votre table",
        detail: "Scannez le code, tapez votre prénom ou votre nom : votre table s'allume sur le plan de la salle.",
        qrUrl: url,
        tableCards: false,
    });

/** At the entrance and on every table: its code opens the guests' gallery, and nothing else. */
export const galleryPoster = (
    design: InvitationDesign,
    calendar: WeddingCalendar,
    url: string,
): QrPoster =>
    poster(design, calendar, {
        name: "Galerie photo",
        slug: "galerie",
        welcome: "Merci d'être là",
        headline: "Partagez vos photos",
        detail: "Scannez le code et donnez votre nom, qui signera vos photos : elles arrivent dans notre galerie, sans application.",
        qrUrl: url,
        tableCards: true,
    });
