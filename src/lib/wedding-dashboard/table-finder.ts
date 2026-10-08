import { seatingPlan } from "./seating";
import type { HouseholdRecord, SeatTable } from "./types";

export type BoardGuest = {
    readonly guestId: string;
    readonly firstName: string;
    /** "Famille M.": who they come with, the last name cut to its initial. */
    readonly household: string;
    /** What finds them: their first name, and their household's last name. */
    readonly searchWords: readonly string[];
};

export type BoardTable = { readonly table: SeatTable; readonly guests: readonly BoardGuest[] };

export type GuestMatch = BoardGuest & { readonly table: SeatTable };

/** "Léo " → "leo": what a guest types, compared without accents or capitals. */
const folded = (text: string) =>
    text
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();

/** "Famille Moreau" → ["famille", "moreau"]: the words someone may start typing. */
const words = (text: string) =>
    folded(text)
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean);

/**
 * The household's name as the room plan shows it to everyone: "Julien B.", "Famille M.". A name
 * made of the guests' first names, "Marie & Thomas", "Mamie Jeanne", has no last name to hide.
 */
export const householdLabel = (name: string, firstNames: readonly string[]) => {
    const parts = name.trim().split(/\s+/);
    const last = parts.at(-1) ?? "";
    const known = new Set(firstNames.flatMap(words));
    if (parts.length < 2 || words(last).every((word) => known.has(word))) return name.trim();
    return [...parts.slice(0, -1), `${last.charAt(0).toUpperCase()}.`].join(" ");
};

const byFirstName = (a: BoardGuest, b: BoardGuest) => a.firstName.localeCompare(b.firstName, "fr");

/**
 * The room as guests read it on the day: every table in order, with who sits there. Guests who
 * said they will not come to dinner are left out; the others are expected. A household named
 * after its guests' first names adds nothing to the search: Thomas is not found by "Marie".
 */
export const seatingBoard = (
    households: readonly HouseholdRecord[],
    tables: readonly SeatTable[],
    seats: Readonly<Record<string, string>>,
): readonly BoardTable[] => {
    const byId = new Map(households.map((household) => [household.id, household]));
    return seatingPlan(households, tables, seats).tables.map(({ table, guests }) => ({
        table,
        guests: guests
            .filter((guest) => guest.presence !== "no")
            .map(({ guestId, firstName, householdId, householdName }) => {
                const firstNames = (byId.get(householdId)?.guests ?? []).map(
                    (housemate) => housemate.firstName,
                );
                const housemates = new Set(firstNames.flatMap(words));
                return {
                    guestId,
                    firstName,
                    household: householdLabel(householdName, firstNames),
                    searchWords: [
                        ...words(firstName),
                        ...words(householdName).filter((word) => !housemates.has(word)),
                    ],
                };
            })
            .sort(byFirstName),
    }));
};

/**
 * The guests matching what was typed, each with their table: every typed word starts one of
 * their names, first or last, in any order.
 */
export const findGuests = (board: readonly BoardTable[], query: string): readonly GuestMatch[] => {
    const typed = words(query);
    if (typed.length === 0) return [];
    return board
        .flatMap(({ table, guests }) => guests.map((guest) => ({ ...guest, table })))
        .filter((guest) =>
            typed.every((word) => guest.searchWords.some((name) => name.startsWith(word))),
        )
        .sort(byFirstName);
};
