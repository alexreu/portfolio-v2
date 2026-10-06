import { describe, expect, it } from "vitest";

import { programmeAt } from "./programme";
import type { Moment } from "./types";

const moments: readonly Moment[] = [
    {
        key: "ceremonie-vin-honneur",
        title: "Cérémonie & vin d'honneur",
        slots: [
            {
                title: "Cérémonie laïque",
                place: "Sous les platanes",
                startsAt: "2027-06-12T16:00:00+02:00",
            },
            {
                title: "Vin d'honneur",
                place: "La cour en pierre",
                startsAt: "2027-06-12T17:30:00+02:00",
                endsAt: "2027-06-12T19:30:00+02:00",
            },
        ],
    },
    {
        key: "diner",
        title: "Dîner & soirée",
        slots: [{ title: "Dîner", place: "L'orangerie", startsAt: "2027-06-12T20:00:00+02:00" }],
    },
];

describe("programmeAt", () => {
    it("marks each slot as past, now or upcoming at a given time", () => {
        const programme = programmeAt(moments, new Date("2027-06-12T18:10:00+02:00"));

        expect(
            programme.moments.flatMap((moment) => moment.slots.map((slot) => slot.status)),
        ).toEqual(["past", "now", "upcoming"]);
    });

    it("exposes what is happening now and what comes next", () => {
        const programme = programmeAt(moments, new Date("2027-06-12T18:10:00+02:00"));

        expect(programme.current?.title).toBe("Vin d'honneur");
        expect(programme.next?.title).toBe("Dîner");
    });

    it("has nothing current before the first slot, and nothing next after the last one starts", () => {
        expect(programmeAt(moments, new Date("2027-06-12T10:00:00+02:00")).current).toBeNull();
        expect(programmeAt(moments, new Date("2027-06-12T21:00:00+02:00")).next).toBeNull();
    });
});
