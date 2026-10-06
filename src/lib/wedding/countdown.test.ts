import { describe, expect, it } from "vitest";

import { countdownTo } from "./countdown";

const ceremony = "2027-06-12T16:00:00+02:00";

describe("countdownTo", () => {
    it("splits the time left before the ceremony into days, hours, minutes and seconds", () => {
        expect(countdownTo(ceremony, new Date("2027-06-10T13:29:15+02:00"))).toEqual({
            days: 2,
            hours: 2,
            minutes: 30,
            seconds: 45,
        });
    });

    it("counts a second that has only started as still to come", () => {
        expect(countdownTo(ceremony, new Date("2027-06-12T15:59:59.400+02:00"))).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 1,
        });
    });

    it("stops at zero once the ceremony has started", () => {
        expect(countdownTo(ceremony, new Date("2027-06-12T18:00:00+02:00"))).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        });
    });
});
