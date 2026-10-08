import {
    collaboratorStatus,
    householdStatus,
    householdTables,
    overview,
    seatedMomentKey,
    seatingPlan,
} from "@alexreu/wedding-core";
import { describe, expect, it } from "vitest";

import { DEMO_GUEST_HOUSEHOLD, demoSeed } from "./wedding-dashboard-demo";

const now = new Date("2026-10-06T15:00:00+02:00");
const seed = demoSeed(now);

describe("demoSeed", () => {
    it("lets visitors answer as Marie & Thomas: their link is opened, not answered", () => {
        const lefevre = seed.households.find((household) => household.id === DEMO_GUEST_HOUSEHOLD);

        expect(lefevre?.name).toBe("Marie & Thomas");
        expect(lefevre && householdStatus(lefevre)).toBe("opened");
    });

    it("mixes answered, opened and never-opened links, like a real guest list", () => {
        const counts = overview(seed.households);

        expect(counts.householdsAnswered).toBeGreaterThan(counts.pending);
        expect(counts.neverOpened).toBeGreaterThan(0);
        expect(counts.pending - counts.neverOpened).toBeGreaterThan(0);
    });

    it("has a complete answer for every invited guest of an answered household", () => {
        seed.households
            .filter((household) => household.answeredAt)
            .forEach((household) =>
                household.guests.forEach((guest) =>
                    expect(Object.keys(household.attendance[guest.id] ?? {}).sort()).toEqual(
                        [...household.momentKeys].sort(),
                    ),
                ),
            );
    });

    it("dates everything in the past, the latest first in the activity feed", () => {
        const times = seed.activity.map((entry) => new Date(entry.at).getTime());

        expect(times.every((time) => time <= now.getTime())).toBe(true);
        expect([...times].sort((a, b) => b - a)).toEqual(times);
        expect(new Set(seed.activity.map((entry) => entry.id)).size).toBe(seed.activity.length);
    });

    it("shares the dashboard with a witness already in, a lapsed invitation and a pending one", () => {
        expect(
            seed.collaborators.map((collaborator) => [
                collaborator.firstName,
                collaboratorStatus(collaborator, now).kind,
            ]),
        ).toEqual([
            ["Elsa", "active"],
            ["Malik", "expired"],
            ["Agathe", "pending"],
        ]);
    });

    it("shows the couple a few notes and songs to read", () => {
        const answered = seed.households.filter((household) => household.answeredAt);

        expect(answered.filter((household) => household.message).length).toBeGreaterThan(3);
        expect(answered.filter((household) => household.questions.chanson).length).toBeGreaterThan(
            3,
        );
    });

    it("starts the room plan half done: most dinner guests seated, one family waiting", () => {
        const plan = seatingPlan(
            seed.households,
            seed.tables,
            seed.seats,
            seatedMomentKey(seed.moments),
        );

        expect(plan.tables).toHaveLength(8);
        expect(plan.unseated.map((guest) => guest.householdName)).toEqual(
            Array(4).fill("Famille Mercier"),
        );
        expect(householdTables(seed.households[0], seed.tables, seed.seats)[0].name).toBe(
            "Les Oliviers",
        );
    });

    it("keeps the programme of the content, editable", () => {
        expect(seed.moments.map((moment) => moment.key)).toEqual([
            "ceremonie-vin-honneur",
            "diner",
            "brunch",
        ]);
        expect(seed.moments[2].slots[0]).toMatchObject({ dayOffset: 1, start: "11:00" });
        expect(seed.moments.filter((moment) => moment.seated).map((moment) => moment.key)).toEqual([
            "diner",
        ]);
    });

    it("sorts the households into the couple's groups, in Paris time", () => {
        const known = new Set(seed.groups.map((group) => group.id));
        expect(seed.households.every((household) => known.has(household.group))).toBe(true);
        expect(seed.groups.map((group) => group.label)).toEqual([
            "Famille Camille",
            "Famille Hugo",
            "Amis",
            "Collègues",
        ]);
        expect(seed.timezone).toBe("Europe/Paris");
    });

    it("gives every household and guest a unique id", () => {
        const ids = seed.households.flatMap((household) => [
            household.id,
            ...household.guests.map((guest) => guest.id),
        ]);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
