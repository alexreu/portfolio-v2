import type { DietChoice } from "@/lib/wedding/answer";
import type { Moment } from "@/lib/wedding/types";

import type { GroupKey, HouseholdRecord } from "./types";

const dietLabels: Record<DietChoice, string> = {
    aucune: "Aucun",
    vegetarien: "Végétarien",
    vegan: "Végan",
    "sans-gluten": "Sans gluten",
    autre: "Autre",
};

/** A spreadsheet runs a cell starting with one of these as a formula. */
const FORMULA_START = /^[=+\-@\t\r]/;

const cell = (value: string) => {
    const safe = FORMULA_START.test(value) ? `'${value}` : value;
    return /[;"\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
};

const presence = (household: HouseholdRecord, guestId: string, momentKey: string) => {
    if (!household.momentKeys.includes(momentKey)) return "Non invité";
    const answer = household.attendance[guestId]?.[momentKey];
    if (!answer) return "En attente";
    return answer === "yes" ? "Oui" : "Non";
};

/**
 * One line per guest, for the caterer or a seating plan. Semicolons and a byte order mark:
 * the format Excel opens with accents intact on a French computer.
 */
export const guestListCsv = (
    households: readonly HouseholdRecord[],
    moments: readonly Moment[],
    groupName: (group: GroupKey) => string,
    /** False for whoever may not read the diets, health data: their columns stay out. */
    { diets = true }: { diets?: boolean } = {},
) => {
    const header = [
        "Foyer",
        "Groupe",
        "Prénom",
        "Enfant",
        ...moments.map((moment) => moment.title),
        ...(diets ? ["Régime", "Précision"] : []),
    ];
    const rows = households.flatMap((household) =>
        household.guests.map((guest) => {
            const diet = household.diets[guest.id] ?? { choice: "aucune", other: "" };
            return [
                household.name,
                groupName(household.group),
                guest.firstName,
                guest.child ? "Oui" : "Non",
                ...moments.map((moment) => presence(household, guest.id, moment.key)),
                ...(diets
                    ? [dietLabels[diet.choice], diet.choice === "autre" ? diet.other.trim() : ""]
                    : []),
            ];
        }),
    );
    return `﻿${[header, ...rows].map((row) => row.map(cell).join(";")).join("\r\n")}`;
};
