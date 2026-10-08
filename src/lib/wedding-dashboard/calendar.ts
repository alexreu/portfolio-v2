import { formatHour } from "@/lib/wedding/format-hour";
import type { Moment } from "@/lib/wedding/types";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A day without time ("2027-06-12") read at noon UTC, so no time zone moves it to another day. */
const atNoon = (day: string) => new Date(`${day}T12:00:00Z`);

export const addDays = (day: string, days: number) =>
    new Date(atNoon(day).getTime() + days * DAY).toISOString().slice(0, 10);

export const daysBetween = (from: string, to: string) =>
    Math.round((atNoon(to).getTime() - atNoon(from).getTime()) / DAY);

/** Today's date in Paris, as "YYYY-MM-DD". */
export const parisDay = (now: Date) =>
    now.toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });

const part = (day: string, options: Intl.DateTimeFormatOptions) =>
    atNoon(day).toLocaleDateString("fr-FR", { ...options, timeZone: "UTC" });

/** French writes the first of a month as an ordinal: "1er mai". */
const dayOfMonth = (day: string) => {
    const date = atNoon(day).getUTCDate();
    return date === 1 ? "1er" : String(date);
};

const capitalized = (text: string) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

/** "vendredi 16 avril" */
const weekdayLabel = (day: string) =>
    `${part(day, { weekday: "long" })} ${dayOfMonth(day)} ${part(day, { month: "long" })}`;

export type WeddingCalendar = {
    readonly day: string;
    /** "Samedi 12 juin 2027" */
    readonly dateLabel: string;
    /** "Samedi 12 juin" */
    readonly shortDateLabel: string;
    readonly answerDeadline: string;
    readonly answerDeadlineLabel: string;
    readonly reminderDay: string;
    readonly reminderLabel: string;
    readonly galleryOpens: string;
    readonly galleryOpensLabel: string;
};

/**
 * Answers close six weeks before the day, the reminder goes out fifteen days before the
 * deadline, and the guest gallery opens the day before.
 */
export const automaticDates = (day: string) => {
    const answerDeadline = addDays(day, -42);
    return {
        answerDeadline,
        reminder: addDays(answerDeadline, -15),
        galleryOpens: addDays(day, -1),
    };
};

export const weddingCalendar = (
    day: string,
    overrides: Partial<Record<keyof ReturnType<typeof automaticDates>, string | null>> = {},
): WeddingCalendar => {
    const automatic = automaticDates(day);
    const answerDeadline = overrides.answerDeadline ?? automatic.answerDeadline;
    const reminderDay = overrides.reminder ?? automatic.reminder;
    const galleryOpens = overrides.galleryOpens ?? automatic.galleryOpens;
    return {
        day,
        dateLabel: capitalized(`${weekdayLabel(day)} ${part(day, { year: "numeric" })}`),
        shortDateLabel: capitalized(weekdayLabel(day)),
        answerDeadline,
        answerDeadlineLabel: `${dayOfMonth(answerDeadline)} ${part(answerDeadline, { month: "long", year: "numeric" })}`,
        reminderDay,
        reminderLabel: weekdayLabel(reminderDay),
        galleryOpens,
        galleryOpensLabel: weekdayLabel(galleryOpens),
    };
};

/** Whole days from today in Paris to `day`; negative once it has passed. */
export const daysUntil = (day: string, now: Date) => daysBetween(parisDay(now), day);

/** "à l'instant", "il y a 4 h", "hier", "le 12/03": how the dashboard dates an event. */
export const sinceLabel = (iso: string, now: Date) => {
    const elapsed = now.getTime() - new Date(iso).getTime();
    const days = -daysUntil(parisDay(new Date(iso)), now);
    if (elapsed < MINUTE) return "à l'instant";
    if (elapsed < HOUR) return `il y a ${Math.floor(elapsed / MINUTE)} min`;
    if (days === 0) return `il y a ${Math.floor(elapsed / HOUR)} h`;
    if (days === 1) return "hier";
    if (days < 7) return `il y a ${days} j`;
    return `le ${new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", timeZone: "Europe/Paris" })}`;
};

/** "+02:00" on a summer day in Paris, "+01:00" in winter. */
export const parisOffset = (day: string) => {
    const zone = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Paris",
        timeZoneName: "longOffset",
    })
        .formatToParts(atNoon(day))
        .find((piece) => piece.type === "timeZoneName")?.value;
    return zone?.startsWith("GMT+") || zone?.startsWith("GMT-") ? zone.slice(3) : "+00:00";
};

/**
 * The Paris offset at that very hour of that day: the night the clocks go back, 1:30 is still
 * summer time though noon is not. An hour that does not exist, skipped in spring, takes the day's.
 */
export const parisOffsetAt = (day: string, time: string) => {
    const local = (offset: string) =>
        new Date(`${day}T${time}:00${offset}`).toLocaleString("sv-SE", {
            timeZone: "Europe/Paris",
            hour12: false,
        });
    return (
        ["+02:00", "+01:00"].find((offset) => local(offset).startsWith(`${day} ${time}`)) ??
        parisOffset(day)
    );
};

/** Moves a programme time from one wedding day to another, keeping its local hour. */
export const moveToDay = (iso: string, fromDay: string, toDay: string) => {
    const day = addDays(toDay, daysBetween(fromDay, iso.slice(0, 10)));
    return `${day}T${iso.slice(11, 19)}${parisOffset(day)}`;
};

export const shiftMoments = (
    moments: readonly Moment[],
    fromDay: string,
    toDay: string,
): readonly Moment[] =>
    moments.map((moment) => ({
        ...moment,
        slots: moment.slots.map((slot) => ({
            ...slot,
            startsAt: moveToDay(slot.startsAt, fromDay, toDay),
            ...(slot.endsAt && { endsAt: moveToDay(slot.endsAt, fromDay, toDay) }),
        })),
    }));

/** "lun. 5 oct. · 14 h 02": when exactly a household answered. */
export const dateTimeLabel = (iso: string) =>
    `${new Date(iso).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "Europe/Paris",
    })} · ${formatHour(iso)}`;
