import type { Moment } from "./types";

/** Before the wedding, the wedding day itself, then the day after: thanks and photos. */
export type SiteMode = "before" | "day" | "after";

export type WeddingDay = {
    /** When the personal link switches to its wedding-day screen (tables revealed, uploads open). */
    readonly startsAt: string;
    /** When the celebrations are over and the site turns to the day after. */
    readonly endsAt: string;
};

export const siteModeAt = (day: WeddingDay, now: Date): SiteMode => {
    if (now.getTime() < new Date(day.startsAt).getTime()) return "before";
    return now.getTime() < new Date(day.endsAt).getTime() ? "day" : "after";
};

/** "2027-06-12T16:00:00+02:00" → "+02:00": the wedding's offset, to write its other hours. */
const offsetOf = (iso: string) => iso.match(/([+-]\d{2}:\d{2}|Z)$/)?.[1] ?? "+02:00";

/** "2027-06-12" → "2027-06-13", read at noon UTC so that no time zone moves it. */
const nextDay = (day: string) =>
    new Date(new Date(`${day}T12:00:00Z`).getTime() + 86_400_000).toISOString().slice(0, 10);

/**
 * When the last moment ends, the next day's brunch included; never before the morning after
 * the wedding, so that the evening is never cut short by a moment without an end.
 */
export const celebrationsEnd = (day: string, moments: readonly Moment[]): string => {
    const hours = moments.flatMap((moment) =>
        moment.slots.map((slot) => slot.endsAt ?? slot.startsAt),
    );
    const morningAfter = `${nextDay(day)}T08:00:00${offsetOf(hours[0] ?? "")}`;
    return [morningAfter, ...hours].reduce((latest, hour) =>
        new Date(hour).getTime() > new Date(latest).getTime() ? hour : latest,
    );
};
