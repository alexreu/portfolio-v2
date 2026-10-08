import { describe, expect, it } from "vitest";

import { findGuests, seatingBoard } from "./table-finder";
import type { HouseholdRecord, SeatTable } from "./types";

/** Nothing answered yet for the dinner. */
const noAnswer: Readonly<Record<string, "yes" | "no">> = {};

const household = (
    id: string,
    name: string,
    guests: readonly (readonly [string, string, "yes" | "no" | "pending"])[],
    momentKeys: readonly string[] = ["diner"],
): HouseholdRecord => ({
    id,
    name,
    group: "amis",
    email: "",
    guests: guests.map(([guestId, firstName]) => ({ id: guestId, firstName, child: false })),
    momentKeys,
    lastSeenAt: null,
    attendance: Object.fromEntries(
        guests.map(([guestId, , presence]) => [
            guestId,
            presence === "pending" ? noAnswer : { diner: presence },
        ]),
    ),
    diets: {},
    answeredAt: null,
    answeredBy: null,
    createdAt: "2026-09-01T10:00:00+02:00",
    questions: {},
    message: "",
});

const tables: readonly SeatTable[] = [
    { id: "t2", number: 2, name: "Les Oliviers", capacity: 8, x: 60, y: 40 },
    { id: "t1", number: 1, name: "Les Lavandes", capacity: 8, x: 30, y: 40 },
];

const households = [
    household("moreau", "Famille Moreau", [
        ["claire", "Claire", "yes"],
        ["antoine", "Antoine", "no"],
        ["leo", "Léo", "pending"],
    ]),
    household("martin", "Marie & Thomas", [
        ["marie", "Marie", "yes"],
        ["thomas", "Thomas", "yes"],
    ]),
    household("brunch", "Julien Bertrand", [["julien", "Julien", "yes"]], ["brunch"]),
];

const seats = { claire: "t1", antoine: "t1", leo: "t1", marie: "t2", thomas: "t1", julien: "t2" };

describe("seatingBoard", () => {
    it("lists the tables in order, with the guests expected at dinner, by first name", () => {
        const board = seatingBoard(households, tables, seats);

        expect(
            board.map(({ table, guests }) => [
                table.number,
                guests.map((guest) => guest.firstName),
            ]),
        ).toEqual([
            [1, ["Claire", "Léo", "Thomas"]],
            [2, ["Marie"]],
        ]);
    });

    it("says which household each guest comes with", () => {
        const [first] = seatingBoard(households, tables, seats);

        expect(first.guests[0]).toEqual({
            guestId: "claire",
            firstName: "Claire",
            householdName: "Famille Moreau",
        });
    });
});

describe("findGuests", () => {
    const board = seatingBoard(households, tables, seats);

    it("finds guests from the first letters of their first name, accents aside", () => {
        expect(
            findGuests(board, " le").map((match) => [match.firstName, match.table.number]),
        ).toEqual([["Léo", 1]]);
        expect(findGuests(board, "MAR").map((match) => match.firstName)).toEqual(["Marie"]);
    });

    it("finds guests from their last name, carried by their household's", () => {
        expect(findGuests(board, "moreau").map((match) => match.firstName)).toEqual([
            "Claire",
            "Léo",
        ]);
    });

    it("narrows down with a first and a last name, in any order", () => {
        expect(findGuests(board, "Claire Mor").map((match) => match.firstName)).toEqual(["Claire"]);
        expect(findGuests(board, "moreau  léo").map((match) => match.firstName)).toEqual(["Léo"]);
        expect(findGuests(board, "Marie Moreau")).toEqual([]);
    });

    it("finds nobody before a letter is typed, nor someone not expected at dinner", () => {
        expect(findGuests(board, "  ")).toEqual([]);
        expect(findGuests(board, "Antoine")).toEqual([]);
        expect(findGuests(board, "Julien")).toEqual([]);
    });
});
