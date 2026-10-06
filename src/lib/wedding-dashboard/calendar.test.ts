import { describe, expect, it } from "vitest";

import {
    dateTimeLabel,
    daysUntil,
    moveToDay,
    shiftMoments,
    sinceLabel,
    weddingCalendar,
} from "./calendar";

describe("weddingCalendar", () => {
    it("derives every date the guests see from the wedding day", () => {
        expect(weddingCalendar("2027-06-12")).toEqual({
            day: "2027-06-12",
            dateLabel: "Samedi 12 juin 2027",
            shortDateLabel: "Samedi 12 juin",
            answerDeadline: "2027-05-01",
            answerDeadlineLabel: "1er mai 2027",
            reminderDay: "2027-04-16",
            reminderLabel: "vendredi 16 avril",
            galleryOpensLabel: "vendredi 11 juin",
        });
    });

    it("writes the first of a month as an ordinal, as French does", () => {
        expect(weddingCalendar("2027-09-02").galleryOpensLabel).toBe("mercredi 1er septembre");
    });
});

describe("daysUntil", () => {
    it("counts whole days from today in Paris, whatever the hour", () => {
        expect(daysUntil("2027-06-12", new Date("2027-06-10T23:30:00+02:00"))).toBe(2);
        expect(daysUntil("2027-06-12", new Date("2027-06-11T00:10:00+02:00"))).toBe(1);
    });

    it("goes negative once the day has passed", () => {
        expect(daysUntil("2027-06-12", new Date("2027-06-14T12:00:00+02:00"))).toBe(-2);
    });
});

describe("sinceLabel", () => {
    const now = new Date("2027-04-07T15:00:00+02:00");

    it.each([
        ["2027-04-07T14:59:40+02:00", "à l'instant"],
        ["2027-04-07T14:35:00+02:00", "il y a 25 min"],
        ["2027-04-07T11:00:00+02:00", "il y a 4 h"],
        ["2027-04-06T09:00:00+02:00", "hier"],
        ["2027-04-03T09:00:00+02:00", "il y a 4 j"],
        ["2027-03-12T09:00:00+01:00", "le 12/03"],
    ])("describes %s as « %s »", (iso, label) => {
        expect(sinceLabel(iso, now)).toBe(label);
    });
});

describe("moveToDay", () => {
    it("keeps the local hour when the wedding moves to another summer day", () => {
        expect(moveToDay("2027-06-13T11:00:00+02:00", "2027-06-12", "2027-07-03")).toBe(
            "2027-07-04T11:00:00+02:00",
        );
    });

    it("switches to winter time when the wedding moves to December", () => {
        expect(moveToDay("2027-06-12T16:00:00+02:00", "2027-06-12", "2027-12-18")).toBe(
            "2027-12-18T16:00:00+01:00",
        );
    });
});

describe("shiftMoments", () => {
    it("moves every slot of the programme, end times included", () => {
        const [moment] = shiftMoments(
            [
                {
                    key: "diner",
                    title: "Dîner",
                    slots: [
                        {
                            title: "Bal",
                            place: "Orangerie",
                            startsAt: "2027-06-12T23:00:00+02:00",
                            endsAt: "2027-06-13T04:00:00+02:00",
                        },
                    ],
                },
            ],
            "2027-06-12",
            "2027-09-04",
        );

        expect(moment.slots[0]).toMatchObject({
            startsAt: "2027-09-04T23:00:00+02:00",
            endsAt: "2027-09-05T04:00:00+02:00",
        });
    });
});

describe("dateTimeLabel", () => {
    it("dates an answer to the minute, in Paris time", () => {
        expect(dateTimeLabel("2026-10-05T12:02:00Z")).toBe("lun. 5 oct. · 14 h 02");
    });
});
