import type { Moment } from "./types";

type CalendarFileInput = {
    /** "Camille & Hugo" */
    readonly couple: string;
    /** Only the moments the household is invited to. */
    readonly moments: readonly Moment[];
    /** The household's personal link, to find the details again. */
    readonly url: string;
    /** When the file is made: calendars require it. */
    readonly stamp: Date;
};

const TWO_HOURS = 2 * 3_600_000;

/** "2027-06-12T16:00:00+02:00" → "20270612T140000Z" */
const utc = (date: Date) => `${date.toISOString().slice(0, 19).replace(/[-:]/g, "")}Z`;

/** Commas, semicolons, backslashes and line breaks are the format's own: escaped. */
const text = (value: string) =>
    value
        .replace(/\\/g, "\\\\")
        .replace(/[;,]/g, (char) => `\\${char}`)
        .replace(/\r?\n/g, "\\n");

const event = (couple: string, moment: Moment, url: string, stamp: Date) => {
    const [first] = moment.slots;
    const last = moment.slots.at(-1) ?? first;
    const start = new Date(first.startsAt);
    const end = last.endsAt
        ? new Date(last.endsAt)
        : new Date(new Date(last.startsAt).getTime() + TWO_HOURS);
    const places = [...new Set(moment.slots.map((slot) => slot.place).filter(Boolean))];
    return [
        "BEGIN:VEVENT",
        `UID:${moment.key}-${utc(start)}@mariage`,
        `DTSTAMP:${utc(stamp)}`,
        `DTSTART:${utc(start)}`,
        `DTEND:${utc(end)}`,
        `SUMMARY:${text(`Mariage de ${couple} · ${moment.title}`)}`,
        ...(places.length > 0 ? [`LOCATION:${text(places.join(" puis "))}`] : []),
        `URL:${url}`,
        "END:VEVENT",
    ];
};

/**
 * The moments a household is invited to, as one .ics file every calendar opens: one event per
 * moment, from its first slot to the end of its last, two hours when that end is unknown.
 */
export const calendarFile = ({ couple, moments, url, stamp }: CalendarFileInput) =>
    [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//AlexDevLab//Site de mariage//FR",
        "CALSCALE:GREGORIAN",
        ...moments
            .filter((moment) => moment.slots.length > 0)
            .flatMap((moment) => event(couple, moment, url, stamp)),
        "END:VCALENDAR",
    ].join("\r\n") + "\r\n";
