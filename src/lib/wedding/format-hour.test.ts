import { describe, expect, it } from "vitest";

import { formatHour } from "./format-hour";

describe("formatHour", () => {
    it("writes whole hours the French way, in the wedding's time zone", () => {
        expect(formatHour("2027-06-12T16:00:00+02:00")).toBe("16 h");
    });

    it("keeps the minutes after the 'h'", () => {
        expect(formatHour("2027-06-12T17:30:00+02:00")).toBe("17 h 30");
    });

    it("reads the time in Paris whatever the offset of the source", () => {
        expect(formatHour("2027-06-12T09:05:00Z")).toBe("11 h 05");
    });
});
