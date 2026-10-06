export type SiteMode = "before" | "day";

export type WeddingDay = {
    /** When the personal link switches to its wedding-day screen (tables revealed, uploads open). */
    readonly startsAt: string;
};

export const siteModeAt = (day: WeddingDay, now: Date): SiteMode =>
    now.getTime() < new Date(day.startsAt).getTime() ? "before" : "day";
