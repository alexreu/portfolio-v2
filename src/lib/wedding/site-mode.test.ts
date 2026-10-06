import { describe, expect, it } from "vitest";

import { siteModeAt } from "./site-mode";

const weddingDay = { startsAt: "2027-06-12T08:00:00+02:00" };

describe("siteModeAt", () => {
    it("stays in 'before' mode until the morning of the wedding", () => {
        expect(siteModeAt(weddingDay, new Date("2027-06-12T07:59:00+02:00"))).toBe("before");
    });

    it("switches to 'day' mode once the wedding day has started", () => {
        expect(siteModeAt(weddingDay, new Date("2027-06-12T08:00:00+02:00"))).toBe("day");
    });
});
