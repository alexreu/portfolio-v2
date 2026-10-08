import { seatingPlan } from "./seating";
import type { HouseholdRecord, SeatTable } from "./types";

export type BoardGuest = {
    readonly guestId: string;
    readonly firstName: string;
    readonly householdName: string;
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

const byFirstName = (a: BoardGuest, b: BoardGuest) => a.firstName.localeCompare(b.firstName, "fr");

/**
 * The room as guests read it on the day: every table in order, with who sits there. Guests who
 * said they will not come to dinner are left out; the others are expected.
 */
export const seatingBoard = (
    households: readonly HouseholdRecord[],
    tables: readonly SeatTable[],
    seats: Readonly<Record<string, string>>,
): readonly BoardTable[] =>
    seatingPlan(households, tables, seats).tables.map(({ table, guests }) => ({
        table,
        guests: guests
            .filter((guest) => guest.presence !== "no")
            .map(({ guestId, firstName, householdName }) => ({
                guestId,
                firstName,
                householdName,
            }))
            .sort(byFirstName),
    }));

/** "Famille Moreau" → ["famille", "moreau"]: the words someone may start typing. */
const words = (text: string) =>
    folded(text)
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean);

/**
 * What a guest can be found by: their first name, and their last name as their household
 * carries it. A household named after first names, "Marie & Thomas", adds nothing: Thomas is
 * not found by typing "Marie".
 */
const searchWords = (guest: BoardGuest, board: readonly BoardTable[]) => {
    const housemates = new Set(
        board
            .flatMap(({ guests }) => guests)
            .filter((other) => other.householdName === guest.householdName)
            .flatMap((other) => words(other.firstName)),
    );
    return [
        ...words(guest.firstName),
        ...words(guest.householdName).filter((word) => !housemates.has(word)),
    ];
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
        .filter((guest) => {
            const known = searchWords(guest, board);
            return typed.every((word) => known.some((name) => name.startsWith(word)));
        })
        .sort(byFirstName);
};
