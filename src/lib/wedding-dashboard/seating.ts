import { failure, success, type Result } from "@/lib/wedding/result";
import type { GuestQuestion } from "@/lib/wedding/types";

import type { DraftIssue } from "./drafts";
import { uniqueSlug } from "./programme-plan";
import type { HouseholdRecord, SeatTable } from "./types";

/** The moment the room plan is for. */
export const DINNER = "diner";

export type SeatedGuest = {
    readonly guestId: string;
    readonly firstName: string;
    readonly child: boolean;
    readonly householdId: string;
    readonly householdName: string;
    /** Answered yes to the dinner. */
    readonly confirmed: boolean;
    readonly presence: "yes" | "no" | "pending";
};

export type SeatingAlert = {
    readonly kind: "full" | "over" | "child-alone" | "not-coming" | "pending" | "unseated";
    readonly text: string;
};

const guestsOf = (households: readonly HouseholdRecord[]): readonly SeatedGuest[] =>
    households
        .filter((household) => household.momentKeys.includes(DINNER))
        .flatMap((household) =>
            household.guests.map((guest) => {
                const presence = household.attendance[guest.id]?.[DINNER] ?? "pending";
                return {
                    guestId: guest.id,
                    firstName: guest.firstName,
                    child: guest.child,
                    householdId: household.id,
                    householdName: household.name,
                    confirmed: presence === "yes",
                    presence,
                };
            }),
        );

const label = (table: SeatTable) => `Table ${table.number} · ${table.name}`;

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

/**
 * Who sits where, who still has no table among the guests confirmed at dinner, and what the
 * couple should look at: full tables, a child without an adult of their household, seats kept
 * for guests who will not come.
 */
export const seatingPlan = (
    households: readonly HouseholdRecord[],
    tables: readonly SeatTable[],
    seats: Readonly<Record<string, string>>,
) => {
    const guests = guestsOf(households);
    const byTable = [...tables]
        .sort((a, b) => a.number - b.number)
        .map((table) => ({
            table,
            guests: guests.filter((guest) => seats[guest.guestId] === table.id),
        }));
    const seated = new Set(byTable.flatMap((entry) => entry.guests.map((guest) => guest.guestId)));
    const unseated = guests.filter((guest) => guest.confirmed && !seated.has(guest.guestId));

    const capacity = byTable.flatMap(({ table, guests: at }): readonly SeatingAlert[] => {
        if (at.length > table.capacity)
            return [
                {
                    kind: "over",
                    text: `${label(table)} : ${at.length} invités pour ${table.capacity} places.`,
                },
            ];
        if (at.length === table.capacity && at.length > 0)
            return [
                {
                    kind: "full",
                    text: `${label(table)} : ${table.capacity} places, ${at.length} invités, c'est complet.`,
                },
            ];
        return [];
    });
    const childrenAlone = byTable.flatMap(({ table, guests: at }) =>
        at
            .filter(
                (guest) =>
                    guest.child &&
                    !at.some((other) => !other.child && other.householdId === guest.householdId),
            )
            .map(
                (guest): SeatingAlert => ({
                    kind: "child-alone",
                    text: `${guest.firstName} (enfant) est à la table ${table.number} sans un adulte de son foyer.`,
                }),
            ),
    );
    const notExpected = byTable.flatMap(({ table, guests: at }) =>
        at
            .filter((guest) => !guest.confirmed)
            .map(
                (guest): SeatingAlert =>
                    guest.presence === "no"
                        ? {
                              kind: "not-coming",
                              text: `${guest.firstName} a une place à la table ${table.number} mais ne vient pas au dîner.`,
                          }
                        : {
                              kind: "pending",
                              text: `${guest.firstName} a une place à la table ${table.number} sans avoir encore confirmé le dîner.`,
                          },
            ),
    );
    const waiting: readonly SeatingAlert[] =
        unseated.length > 0
            ? [
                  {
                      kind: "unseated",
                      text: `${plural(unseated.length, "invité au dîner n'a", "invités au dîner n'ont")} pas encore de table.`,
                  },
              ]
            : [];

    return {
        tables: byTable,
        unseated,
        alerts: [...capacity, ...childrenAlone, ...notExpected, ...waiting],
    };
};

/** The tables a household sits at, for its page on the wedding day. */
export const householdTables = (
    household: HouseholdRecord,
    tables: readonly SeatTable[],
    seats: Readonly<Record<string, string>>,
): readonly SeatTable[] =>
    tables.filter((table) => household.guests.some((guest) => seats[guest.id] === table.id));

export const validateTable = (
    table: SeatTable,
    tables: readonly SeatTable[],
): Result<SeatTable, readonly DraftIssue[]> => {
    const name = table.name.trim();
    const issues: readonly DraftIssue[] = [
        ...(name === "" ? [{ path: "name", code: "required" as const }] : []),
        ...(name.length > 40 ? [{ path: "name", code: "too-long" as const }] : []),
        ...(!Number.isInteger(table.number) || table.number < 1 || table.number > 99
            ? [{ path: "number", code: "out-of-range" as const }]
            : tables.some((other) => other.id !== table.id && other.number === table.number)
              ? [{ path: "number", code: "number-taken" as const }]
              : []),
        ...(!Number.isInteger(table.capacity) || table.capacity < 1 || table.capacity > 20
            ? [{ path: "capacity", code: "out-of-range" as const }]
            : []),
    ];
    return issues.length > 0 ? failure(issues) : success({ ...table, name });
};

export const nextTableNumber = (tables: readonly SeatTable[]) =>
    [...Array(tables.length + 1).keys()]
        .map((n) => n + 1)
        .find((n) => !tables.some((table) => table.number === n)) ?? tables.length + 1;

const QUESTION_LIMIT = 6;

export const validateQuestions = (
    questions: readonly GuestQuestion[],
): Result<readonly GuestQuestion[], readonly DraftIssue[]> => {
    const issues: readonly DraftIssue[] = [
        ...questions.flatMap((question, index) => [
            ...(question.label.trim() === ""
                ? [{ path: `questions.${index}.label`, code: "required" as const }]
                : []),
            ...(question.label.trim().length > 120
                ? [{ path: `questions.${index}.label`, code: "too-long" as const }]
                : []),
            ...((question.placeholder ?? "").trim().length > 60
                ? [{ path: `questions.${index}.placeholder`, code: "too-long" as const }]
                : []),
        ]),
        ...(questions.length > QUESTION_LIMIT
            ? [{ path: "questions", code: "limit" as const }]
            : []),
    ];
    return issues.length > 0
        ? failure(issues)
        : success(
              questions.map((question) => ({
                  ...question,
                  label: question.label.trim(),
                  placeholder: (question.placeholder ?? "").trim(),
              })),
          );
};

export const questionIdFor = (label: string, taken: readonly string[]) =>
    uniqueSlug(label, taken, "question");
