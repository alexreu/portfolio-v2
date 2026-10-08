import { describe, expect, it } from "vitest";

import { calendarFile } from "./calendar-file";

const moments = [
    {
        key: "ceremonie",
        title: "Cérémonie & vin d'honneur",
        slots: [
            {
                title: "Cérémonie",
                place: "Domaine des Oliviers, Lourmarin",
                startsAt: "2027-06-12T16:00:00+02:00",
            },
            {
                title: "Vin d'honneur",
                place: "Terrasse",
                startsAt: "2027-06-12T17:30:00+02:00",
                endsAt: "2027-06-12T19:30:00+02:00",
            },
        ],
    },
    {
        key: "brunch",
        title: "Brunch",
        slots: [
            { title: "Brunch", place: "Le Mas; jardin", startsAt: "2027-06-13T11:00:00+02:00" },
        ],
    },
];

const file = calendarFile({
    couple: "Camille & Hugo",
    moments,
    url: "https://alexdevlab.fr/mariage/demo?foyer=moreau",
    stamp: new Date("2026-10-08T10:00:00Z"),
});

describe("calendarFile", () => {
    it("adds one event per moment the household is invited to, in UTC", () => {
        expect(file.match(/BEGIN:VEVENT/g)).toHaveLength(2);
        expect(file).toContain("DTSTART:20270612T140000Z");
        expect(file).toContain("DTEND:20270612T173000Z");
        expect(file).toContain("SUMMARY:Mariage de Camille & Hugo · Cérémonie & vin d'honneur");
    });

    it("gives a moment without an end two hours, and escapes what the format reserves", () => {
        expect(file).toContain("DTSTART:20270613T090000Z");
        expect(file).toContain("DTEND:20270613T110000Z");
        expect(file).toContain("LOCATION:Le Mas\\; jardin");
    });

    it("is a calendar every phone reads: CRLF lines, a stable id, the personal link", () => {
        expect(file.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n")).toBe(true);
        expect(file.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
        expect(file).toContain("UID:ceremonie-20270612T140000Z@mariage");
        expect(file).toContain("URL:https://alexdevlab.fr/mariage/demo?foyer=moreau");
    });
});
