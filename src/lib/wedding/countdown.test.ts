import { describe, expect, it } from "vitest";

import { countdownTo } from "./countdown";

const ceremony = "2027-06-12T16:00:00+02:00";

describe("countdownTo", () => {
    it("splits the time left before the ceremony into days, hours and minutes", () => {
        expect(countdownTo(ceremony, new Date("2027-06-10T13:30:00+02:00"))).toEqual({
            days: 2,
            hours: 2,
            minutes: 30,
        });
    });

    it("stops at zero once the ceremony has started", () => {
        expect(countdownTo(ceremony, new Date("2027-06-12T18:00:00+02:00"))).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
        });
    });
});
