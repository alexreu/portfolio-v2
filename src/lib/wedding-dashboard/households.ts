import type { AnswerDraft, DietChoice, Presence } from "@/lib/wedding/answer";
import type { Moment } from "@/lib/wedding/types";

import type { Activity, GroupKey, HouseholdRecord } from "./types";

/** "incomplete": answered, but a moment or a guest was added since, still unanswered. */
export type HouseholdStatus = "answered" | "incomplete" | "opened" | "never-opened";

/** Whether every guest said yes or no to every moment the household is invited to. */
export const answerComplete = (household: HouseholdRecord) =>
    household.guests.every((guest) =>
        household.momentKeys.every((key) => household.attendance[guest.id]?.[key] !== undefined),
    );

export const householdStatus = (household: HouseholdRecord): HouseholdStatus => {
    if (household.answeredAt) return answerComplete(household) ? "answered" : "incomplete";
    return household.lastSeenAt ? "opened" : "never-opened";
};

export type CellTone = "yes" | "no" | "wait" | "closed" | "none";

export type Cell = { readonly tone: CellTone; readonly label: string };

const plural = (count: number, one: string, many: string) => (count > 1 ? many : one);

/** What the couple reads for one household and one moment. */
export const momentCell = (household: HouseholdRecord, momentKey: string): Cell => {
    const alone = household.guests.length === 1;
    if (!household.momentKeys.includes(momentKey))
        return { tone: "none", label: alone ? "Non invité" : "Non invités" };

    const status = householdStatus(household);
    if (status === "never-opened") return { tone: "closed", label: "Jamais ouvert" };
    if (status === "opened") return { tone: "wait", label: "Lien ouvert" };
    if (household.guests.some((guest) => household.attendance[guest.id]?.[momentKey] === undefined))
        return { tone: "wait", label: "À compléter" };

    const coming = household.guests.filter(
        (guest) => household.attendance[guest.id]?.[momentKey] === "yes",
    ).length;
    const [guest] = household.guests;
    if (alone)
        return coming === 1
            ? { tone: "yes", label: guest.labels?.yes ?? "Présent" }
            : { tone: "no", label: guest.labels?.no ?? "Absent" };
    if (coming === 0) return { tone: "no", label: "Absents" };
    return {
        tone: "yes",
        label:
            coming === household.guests.length
                ? `${coming} présents`
                : `${coming} sur ${household.guests.length}`,
    };
};

export const dietNames: Record<Exclude<DietChoice, "aucune">, string> = {
    vegetarien: "végétarien",
    vegan: "végan",
    "sans-gluten": "sans gluten",
    autre: "autre régime",
};

/** ["végétarien (1)", "sans gluten (2)"] */
export const dietSummary = (household: HouseholdRecord) =>
    Object.entries(dietNames).flatMap(([choice, name]) => {
        const count = Object.values(household.diets).filter(
            (diet) => diet.choice === choice,
        ).length;
        return count > 0 ? [`${name} (${count})`] : [];
    });

/** "2 adultes · 1 enfant · végétarien (1)" */
export const householdSummary = (
    household: HouseholdRecord,
    /** False for whoever may not read the diets: they stay out of the line. */
    { diets: withDiets = true }: { diets?: boolean } = {},
) => {
    const children = household.guests.filter((guest) => guest.child).length;
    const adults = household.guests.length - children;
    const diets = withDiets ? dietSummary(household) : [];
    return [
        adults > 0 && `${adults} ${plural(adults, "adulte", "adultes")}`,
        children > 0 && `${children} ${plural(children, "enfant", "enfants")}`,
        ...diets,
    ]
        .filter(Boolean)
        .join(" · ");
};

export const groupLabel = (group: GroupKey, couple: { first: string; second: string }) =>
    ({
        "famille-1": `Famille ${couple.first}`,
        "famille-2": `Famille ${couple.second}`,
        amis: "Amis",
        collegues: "Collègues",
    })[group];

export type StatusFilter = "all" | HouseholdStatus;

export type HouseholdFilter = {
    readonly query: string;
    readonly status: StatusFilter;
    readonly group: "all" | GroupKey;
};

/** Lower case without accents, so "leo" finds Léo. */
const searchable = (text: string) =>
    text
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

const matches = (household: HouseholdRecord, query: string) =>
    [household.name, ...household.guests.map((guest) => guest.firstName)].some((name) =>
        searchable(name).includes(searchable(query.trim())),
    );

export const filterHouseholds = (
    households: readonly HouseholdRecord[],
    { query, status, group }: HouseholdFilter,
) =>
    households.filter(
        (household) =>
            (status === "all" || householdStatus(household) === status) &&
            (group === "all" || household.group === group) &&
            matches(household, query),
    );

export const statusCounts = (households: readonly HouseholdRecord[]) => ({
    all: households.length,
    answered: households.filter((household) => householdStatus(household) === "answered").length,
    incomplete: households.filter((household) => householdStatus(household) === "incomplete")
        .length,
    opened: households.filter((household) => householdStatus(household) === "opened").length,
    "never-opened": households.filter((household) => householdStatus(household) === "never-opened")
        .length,
});

const dietLabels: Record<Exclude<DietChoice, "aucune">, string> = {
    vegetarien: "Végétarien",
    vegan: "Végan",
    "sans-gluten": "Sans gluten",
    autre: "Autre",
};

export type GuestAnswer = {
    readonly id: string;
    readonly firstName: string;
    readonly child: boolean;
    /** Only the moments the household is invited to. */
    readonly moments: readonly {
        readonly key: string;
        readonly title: string;
        readonly presence: Presence | "pending";
        readonly label: string;
    }[];
    /** "Végétarien", "Autre : sans lactose", or null without constraint. */
    readonly diet: string | null;
};

/** Who comes to what, person by person: the detail behind a household's chips. */
export const guestAnswers = (
    household: HouseholdRecord,
    moments: readonly Moment[],
): readonly GuestAnswer[] =>
    household.guests.map((guest) => {
        const diet = household.diets[guest.id];
        return {
            id: guest.id,
            firstName: guest.firstName,
            child: guest.child,
            moments: moments
                .filter((moment) => household.momentKeys.includes(moment.key))
                .map((moment) => {
                    const presence = household.attendance[guest.id]?.[moment.key] ?? "pending";
                    const label = {
                        yes: guest.labels?.yes ?? "Présent",
                        no: guest.labels?.no ?? "Absent",
                        pending: "En attente",
                    }[presence];
                    return { key: moment.key, title: moment.title, presence, label };
                }),
            diet:
                !diet || diet.choice === "aucune"
                    ? null
                    : diet.choice === "autre"
                      ? `Autre : ${diet.other.trim()}`
                      : dietLabels[diet.choice],
        };
    });

export type TimelineEntry = { readonly at: string; readonly label: string };

const storyLabel = (entry: Activity, household: HouseholdRecord) => {
    switch (entry.kind) {
        case "created":
            return "Faire-part créé";
        case "opened":
            return "Lien ouvert";
        case "edited":
            return "Foyer modifié";
        case "updated":
            return "Réponse modifiée";
        case "answered":
            return entry.text.startsWith("Réponse de")
                ? entry.text.replace(`Réponse de ${household.name} `, "Réponse ")
                : "Réponse envoyée";
        default:
            return entry.text;
    }
};

const latestFirst = (a: TimelineEntry, b: TimelineEntry) =>
    new Date(b.at).getTime() - new Date(a.at).getTime();

/**
 * The household's story, latest first. The feed keeps only recent events, so the answer and
 * the sending of the faire-part are rebuilt from the household itself when it has forgotten them.
 */
export const householdTimeline = (
    household: HouseholdRecord,
    activity: readonly Activity[],
    coupleFirstName: string,
): readonly TimelineEntry[] => {
    const own = activity.filter((entry) => entry.subject === household.id);
    const fromFeed = own.map((entry) => ({ at: entry.at, label: storyLabel(entry, household) }));
    const answer =
        household.answeredAt && !own.some((entry) => entry.at === household.answeredAt)
            ? [
                  {
                      at: household.answeredAt,
                      label:
                          household.answeredBy === "maries"
                              ? `Réponse saisie par ${coupleFirstName}`
                              : "Réponse envoyée",
                  },
              ]
            : [];
    const sent = own.some((entry) => entry.kind === "created")
        ? []
        : [{ at: household.createdAt, label: "Faire-part envoyé" }];
    return [...fromFeed, ...answer, ...sent].sort(latestFirst);
};

/** What the household answered, as the answer form starts from it. */
export const answerDraftOf = (household: HouseholdRecord): AnswerDraft => ({
    attendance: household.attendance,
    diets: household.diets,
    /** Diets shared once were consented to; nothing to share, nothing to agree to yet. */
    consent: Object.values(household.diets).some((diet) => diet.choice !== "aucune"),
    questions: household.questions,
    message: household.message,
});
