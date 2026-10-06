import { describe, expect, it } from "vitest";

import { momentKeyFor, momentsFromPlans, plansFromMoments, validateMoment } from "./programme-plan";
import type { MomentPlan } from "./types";

const diner: MomentPlan = {
    key: "diner",
    title: "Dîner & soirée",
    slots: [
        { id: "a", title: "Dîner", place: "L'orangerie", dayOffset: 0, start: "20:00", end: "" },
        { id: "b", title: "Bal", place: "La cour", dayOffset: 0, start: "23:00", end: "04:00" },
    ],
};

describe("momentsFromPlans", () => {
    it("dates each slot on the wedding day, in Paris time", () => {
        const [moment] = momentsFromPlans([diner], "2027-06-12");

        expect(moment.slots).toEqual([
            { title: "Dîner", place: "L'orangerie", startsAt: "2027-06-12T20:00:00+02:00" },
            {
                title: "Bal",
                place: "La cour",
                startsAt: "2027-06-12T23:00:00+02:00",
                endsAt: "2027-06-13T04:00:00+02:00",
            },
        ]);
    });

    it("puts a slot on the day before or after, and in winter time in December", () => {
        const brunch: MomentPlan = {
            key: "brunch",
            title: "Brunch",
            slots: [
                { id: "c", title: "Brunch", place: "", dayOffset: 1, start: "11:00", end: "15:00" },
            ],
        };

        expect(momentsFromPlans([brunch], "2027-12-18")[0].slots[0]).toMatchObject({
            startsAt: "2027-12-19T11:00:00+01:00",
            endsAt: "2027-12-19T15:00:00+01:00",
        });
    });

    it("sorts the moments and their slots by time, whatever order they were typed in", () => {
        const veille: MomentPlan = {
            key: "mairie",
            title: "Mairie",
            slots: [
                { id: "d", title: "Mairie", place: "", dayOffset: -1, start: "11:00", end: "" },
            ],
        };
        expect(momentsFromPlans([diner, veille], "2027-06-12").map((moment) => moment.key)).toEqual(
            ["mairie", "diner"],
        );
    });
});

describe("plansFromMoments", () => {
    it("turns a dated programme back into an editable plan", () => {
        const [plan] = plansFromMoments(momentsFromPlans([diner], "2027-06-12"), "2027-06-12");

        expect(plan.slots.map(({ id, ...slot }) => slot)).toEqual(
            diner.slots.map(({ id, ...slot }) => slot),
        );
    });
});

describe("validateMoment", () => {
    it("accepts a titled moment with at least one timed slot", () => {
        expect(validateMoment(diner).ok).toBe(true);
    });

    it("points at the missing title, slot names and hours", () => {
        const result = validateMoment({
            ...diner,
            title: " ",
            slots: [{ id: "x", title: "", place: "", dayOffset: 0, start: "25:00", end: "9h" }],
        });

        expect(!result.ok && result.error).toEqual([
            { path: "title", code: "required" },
            { path: "slots.0.title", code: "required" },
            { path: "slots.0.start", code: "time-invalid" },
            { path: "slots.0.end", code: "time-invalid" },
        ]);
    });

    it("needs at least one slot", () => {
        const result = validateMoment({ ...diner, slots: [] });
        expect(!result.ok && result.error).toEqual([{ path: "slots", code: "slot-required" }]);
    });
});

describe("momentKeyFor", () => {
    it("builds a readable key, unique among the existing moments", () => {
        expect(momentKeyFor("Vin d'honneur", ["vin-d-honneur"])).toBe("vin-d-honneur-2");
        expect(momentKeyFor("Mairie", [])).toBe("mairie");
    });
});
