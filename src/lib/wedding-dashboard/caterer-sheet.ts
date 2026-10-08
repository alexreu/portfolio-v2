import type { WeddingCalendar } from "./calendar";
import { householdIdFor } from "./drafts";
import { dietNames } from "./households";
import { DINNER, seatingPlan, type SeatedGuest } from "./seating";
import { catererSummary, dietRows, momentTallies } from "./stats";
import type { DemoState, HouseholdRecord } from "./types";

export type SheetRow = { readonly label: string; readonly detail: string; readonly count: number };

export type SheetTable = {
    readonly label: string;
    readonly count: number;
    /** "Végétarien : Claire": who at the table eats something else than the standard menu. */
    readonly notes: readonly string[];
};

/** What the caterer receives for the dinner, ready to lay out on a page. */
export type CatererSheet = {
    readonly title: string;
    readonly wedding: string;
    readonly when: string;
    readonly edited: string;
    readonly total: number;
    /** While some guests have not answered, the figures may still move. */
    readonly warning: string | null;
    readonly menus: readonly SheetRow[];
    readonly tables: readonly SheetTable[];
    readonly unseated: string | null;
    readonly filename: string;
};

type Source = Pick<DemoState, "design" | "households" | "moments" | "tables" | "seats">;

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

const dietLabel = Object.fromEntries(dietRows.map((row) => [row.choice, row.label]));

/** The menu a guest eats, as the kitchen reads it; null for the standard adults' menu. */
const menuOf = (households: readonly HouseholdRecord[], guest: SeatedGuest) => {
    const household = households.find((candidate) => candidate.id === guest.householdId);
    const diet = household?.diets[guest.guestId] ?? { choice: "aucune" as const, other: "" };
    if (guest.child) {
        if (diet.choice === "aucune") return "Menu enfant";
        if (diet.choice === "autre") return `Menu enfant (${diet.other.trim()})`;
        return `Menu enfant ${dietNames[diet.choice]}`;
    }
    if (diet.choice === "aucune") return null;
    return diet.choice === "autre" ? `Autre (${diet.other.trim()})` : dietLabel[diet.choice];
};

const notesOf = (households: readonly HouseholdRecord[], guests: readonly SeatedGuest[]) => {
    const menus = guests.flatMap((guest) => {
        const menu = menuOf(households, guest);
        return menu ? [{ menu, firstName: guest.firstName }] : [];
    });
    return [...new Set(menus.map(({ menu }) => menu))].map(
        (menu) =>
            `${menu} : ${menus
                .filter((entry) => entry.menu === menu)
                .map((entry) => entry.firstName)
                .join(", ")}`,
    );
};

const editedOn = (now: Date) =>
    `Édité le ${now.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Paris",
    })}`;

/**
 * The dinner's sheet for the caterer: covers, menus and allergies, then table by table who
 * eats what, counting only the guests who said they come.
 */
export const catererSheet = (
    { design, households, moments, tables, seats }: Source,
    calendar: WeddingCalendar,
    now: Date,
): CatererSheet => {
    const summary = catererSummary(households, DINNER);
    const meal = moments.find((moment) => moment.key === DINNER)?.title ?? "Dîner";
    const pending =
        momentTallies(households, [{ key: DINNER, title: meal, slots: [] }])[0]?.pending ?? 0;
    const plan = seatingPlan(households, tables, seats);
    const menus: readonly SheetRow[] = [
        { label: "Menu standard", detail: "adultes", count: summary.standard },
        ...summary.diets.map((diet) => ({
            label: diet.label,
            detail: diet.choice === "autre" ? summary.details.join(", ") : "",
            count: diet.count,
        })),
        {
            label: "Menu enfant",
            detail:
                summary.childrenDiets.length > 0 ? `dont ${summary.childrenDiets.join(", ")}` : "",
            count: summary.children,
        },
    ];
    return {
        title: `Récapitulatif traiteur · ${meal}`,
        wedding: `Mariage de ${design.first} & ${design.second}`,
        when: `${calendar.dateLabel} · ${design.place}`,
        edited: editedOn(now),
        total: summary.total,
        warning:
            pending > 0
                ? `${plural(pending, "invité n'a", "invités n'ont")} pas encore répondu pour ce repas : chiffres provisoires.`
                : null,
        menus: menus.filter((row) => row.count > 0),
        tables: plan.tables.map(({ table, guests }) => {
            const coming = guests.filter((guest) => guest.confirmed);
            return {
                label: `Table ${table.number} · ${table.name}`,
                count: coming.length,
                notes: notesOf(households, coming),
            };
        }),
        unseated:
            plan.unseated.length > 0
                ? `${plural(plan.unseated.length, "invité confirmé n'a", "invités confirmés n'ont")} pas encore de table.`
                : null,
        filename: `${householdIdFor(`recap traiteur ${design.first} ${design.second}`, "diner")}.pdf`,
    };
};
