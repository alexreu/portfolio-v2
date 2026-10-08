import type { AccessFeature, AccessGrant, AccessLevel } from "./access";
import type { DashboardPage } from "./pages";

/** Who looks at the dashboard: the couple, or someone they let in with some functions open. */
export type Viewer =
    | { readonly kind: "couple" }
    | { readonly kind: "collaborator"; readonly grant: AccessGrant };

export const COUPLE: Viewer = { kind: "couple" };

export const viewerOf = (grant: AccessGrant): Viewer => ({ kind: "collaborator", grant });

/** Everything a button of the dashboard does, so that each one asks before showing. */
export type DashboardAction =
    | "household.create"
    | "household.edit"
    | "household.answer"
    | "household.remove"
    | "household.print"
    | "diets.read"
    | "export.csv"
    | "export.caterer"
    | "faire-part.edit"
    | "faire-part.print"
    | "questions.edit"
    | "dates.edit"
    | "programme.edit"
    | "seating.edit"
    | "seating.print"
    | "reminders.send"
    | "gallery.moderate"
    | "gallery.download"
    | "gallery.print"
    | "access.manage";

type Rule = { readonly feature: AccessFeature; readonly level: AccessLevel } | "couple";

const needs = (feature: AccessFeature, level: AccessLevel): Rule => ({ feature, level });

/**
 * The function and the level each action asks for. Printing is reading: a faire-part per
 * household carries its personal link, which the guest list already shows. The caterer's sheet
 * holds the diets, health data, so it asks for them.
 */
const rules: Readonly<Record<DashboardAction, Rule>> = {
    "household.create": needs("invites", "modification"),
    "household.edit": needs("invites", "modification"),
    "household.answer": needs("invites", "modification"),
    "household.remove": needs("invites", "modification"),
    "household.print": needs("invites", "lecture"),
    "diets.read": needs("invites.regimes", "lecture"),
    "export.csv": needs("invites.export", "modification"),
    "export.caterer": needs("invites.regimes", "lecture"),
    "faire-part.edit": needs("faire-part", "modification"),
    "faire-part.print": needs("faire-part", "lecture"),
    "questions.edit": needs("questions-perso", "modification"),
    "dates.edit": needs("dates", "modification"),
    "programme.edit": needs("programme", "modification"),
    "seating.edit": needs("plan-de-table", "modification"),
    "seating.print": needs("plan-de-table", "lecture"),
    "reminders.send": needs("relances", "modification"),
    "gallery.moderate": needs("galerie", "modification"),
    "gallery.download": needs("galerie", "lecture"),
    "gallery.print": needs("galerie", "lecture"),
    "access.manage": "couple",
};

const RANK: Readonly<Record<AccessLevel, number>> = { aucun: 0, lecture: 1, modification: 2 };

const reaches = (grant: AccessGrant, feature: AccessFeature, level: AccessLevel) =>
    RANK[grant[feature]] >= RANK[level];

export const can = (viewer: Viewer, action: DashboardAction) => {
    if (viewer.kind === "couple") return true;
    const rule = rules[action];
    return rule !== "couple" && reaches(viewer.grant, rule.feature, rule.level);
};

/** The functions a page shows; it opens when one of them may at least be read. */
const pageFeatures: Readonly<Record<DashboardPage, readonly AccessFeature[] | "couple">> = {
    invites: ["invites"],
    programme: ["dates", "programme"],
    "plan-de-table": ["plan-de-table"],
    "faire-part": ["faire-part", "questions-perso"],
    relances: ["relances"],
    galerie: ["galerie"],
    acces: "couple",
};

/** Null is the overview, open to anyone let in: each of its parts asks for itself. */
export const canSee = (viewer: Viewer, page: DashboardPage | null) => {
    if (viewer.kind === "couple" || page === null) return true;
    const features = pageFeatures[page];
    return (
        features !== "couple" &&
        features.some((feature) => reaches(viewer.grant, feature, "lecture"))
    );
};

/** Whether a function may be read: a section of a page shows only then. */
export const canRead = (viewer: Viewer, feature: AccessFeature) =>
    viewer.kind === "couple" || reaches(viewer.grant, feature, "lecture");
