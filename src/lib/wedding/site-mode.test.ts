import { describe, expect, it } from "vitest";

import { celebrationsEnd, siteModeAt } from "./site-mode";

const weddingDay = {
    startsAt: "2027-06-12T08:00:00+02:00",
    endsAt: "2027-06-13T15:00:00+02:00",
};

describe("siteModeAt", () => {
    it("stays in 'before' mode until the morning of the wedding", () => {
        expect(siteModeAt(weddingDay, new Date("2027-06-12T07:59:00+02:00"))).toBe("before");
    });

    it("switches to 'day' mode once the wedding day has started", () => {
        expect(siteModeAt(weddingDay, new Date("2027-06-12T08:00:00+02:00"))).toBe("day");
    });

    it("turns to the day after once the last moment is over", () => {
        expect(siteModeAt(weddingDay, new Date("2027-06-13T14:59:00+02:00"))).toBe("day");
        expect(siteModeAt(weddingDay, new Date("2027-06-13T15:00:00+02:00"))).toBe("after");
    });
});

describe("celebrationsEnd", () => {
    const slot = (startsAt: string, endsAt?: string) => ({
        title: "",
        place: "",
        startsAt,
        endsAt,
    });

    it("ends with the last moment, the next day's brunch included", () => {
        expect(
            celebrationsEnd("2027-06-12", [
                {
                    key: "diner",
                    title: "Dîner",
                    slots: [slot("2027-06-12T20:00:00+02:00", "2027-06-13T03:00:00+02:00")],
                },
                {
                    key: "brunch",
                    title: "Brunch",
                    slots: [slot("2027-06-13T11:00:00+02:00", "2027-06-13T15:00:00+02:00")],
                },
            ]),
        ).toBe("2027-06-13T15:00:00+02:00");
    });

    it("waits for the next morning when the evening ends earlier", () => {
        expect(
            celebrationsEnd("2027-06-12", [
                {
                    key: "ceremonie",
                    title: "Cérémonie",
                    slots: [slot("2027-06-12T16:00:00+02:00")],
                },
            ]),
        ).toBe("2027-06-13T08:00:00+02:00");
    });
});
