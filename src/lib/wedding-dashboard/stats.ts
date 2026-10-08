import type { DietChoice } from "@/lib/wedding/answer";
import type { Moment } from "@/lib/wedding/types";

import { dietNames, householdStatus } from "./households";
import type { GuestRecord, HouseholdRecord } from "./types";

export const overview = (households: readonly HouseholdRecord[]) => {
    const answered = households.filter((household) => householdStatus(household) === "answered");
    const neverOpened = households.filter(
        (household) => householdStatus(household) === "never-opened",
    ).length;
    return {
        guests: households.reduce((sum, household) => sum + household.guests.length, 0),
        guestsAnswered: answered.reduce((sum, household) => sum + household.guests.length, 0),
        households: households.length,
        householdsAnswered: answered.length,
        householdsOpened: households.length - neverOpened,
        neverOpened,
        pending: households.length - answered.length,
    };
};

export type MomentTally = {
    readonly key: string;
    readonly title: string;
    readonly invited: number;
    readonly yes: number;
    readonly no: number;
    readonly pending: number;
};

const invitedTo = (households: readonly HouseholdRecord[], momentKey: string) =>
    households
        .filter((household) => household.momentKeys.includes(momentKey))
        .flatMap((household) =>
            household.guests.map((guest) => ({
                guest,
                household,
                presence: household.attendance[guest.id]?.[momentKey],
            })),
        );

export const momentTallies = (
    households: readonly HouseholdRecord[],
    moments: readonly Moment[],
): readonly MomentTally[] =>
    moments.map((moment) => {
        const invited = invitedTo(households, moment.key);
        const yes = invited.filter(({ presence }) => presence === "yes").length;
        const no = invited.filter(({ presence }) => presence === "no").length;
        return {
            key: moment.key,
            title: moment.title,
            invited: invited.length,
            yes,
            no,
            pending: invited.length - yes - no,
        };
    });

export const dietRows: readonly { choice: Exclude<DietChoice, "aucune">; label: string }[] = [
    { choice: "vegetarien", label: "Végétarien" },
    { choice: "vegan", label: "Végan" },
    { choice: "sans-gluten", label: "Sans gluten" },
    { choice: "autre", label: "Autre" },
];

const dietOf = (household: HouseholdRecord, guest: GuestRecord) =>
    household.diets[guest.id] ?? { choice: "aucune" as const, other: "" };

/** Adults by menu, then children, with every free-text detail the kitchen must read. */
export const catererSummary = (households: readonly HouseholdRecord[], momentKey: string) => {
    const coming = invitedTo(households, momentKey).filter(({ presence }) => presence === "yes");
    const adults = coming.filter(({ guest }) => !guest.child);
    const children = coming.filter(({ guest }) => guest.child);
    const countBy = (list: typeof coming, choice: DietChoice) =>
        list.filter(({ household, guest }) => dietOf(household, guest).choice === choice).length;

    return {
        total: coming.length,
        standard: countBy(adults, "aucune"),
        diets: dietRows.map((row) => ({ ...row, count: countBy(adults, row.choice) })),
        details: coming.flatMap(({ household, guest }) => {
            const diet = dietOf(household, guest);
            return diet.choice === "autre" && diet.other.trim() ? [diet.other.trim()] : [];
        }),
        children: children.length,
        childrenDiets: dietRows.flatMap(({ choice }) => {
            const count = countBy(children, choice);
            return count > 0 ? [`${dietNames[choice]} (${count})`] : [];
        }),
    };
};
