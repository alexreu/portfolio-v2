import type { DietChoice, Presence } from "@/lib/wedding/answer";
import type { GuestQuestion } from "@/lib/wedding/types";

/** Who the household belongs with; the family groups take the couple's first names. */
export type GroupKey = "famille-1" | "famille-2" | "amis" | "collegues";

export type GuestRecord = {
    readonly id: string;
    readonly firstName: string;
    readonly child: boolean;
    /** Agreed with the guest, e.g. "Présente" / "Absente"; the site says "Oui" / "Non" otherwise. */
    readonly labels?: { readonly yes: string; readonly no: string };
};

export type Diet = { readonly choice: DietChoice; readonly other: string };

/** One invitation: a couple, a family or a guest on their own, with one personal link. */
export type HouseholdRecord = {
    readonly id: string;
    readonly name: string;
    readonly group: GroupKey;
    readonly email: string;
    readonly guests: readonly GuestRecord[];
    readonly momentKeys: readonly string[];
    /** Last visit through the personal link; null while it has never been opened. */
    readonly lastSeenAt: string | null;
    /** By guest, then by moment. Complete once the household has answered. */
    readonly attendance: Readonly<Record<string, Readonly<Record<string, Presence>>>>;
    readonly diets: Readonly<Record<string, Diet>>;
    readonly answeredAt: string | null;
    /** "maries": a paper answer typed in by the couple. */
    readonly answeredBy: "invite" | "maries" | null;
    readonly createdAt: string;
    /** Answers to the couple's questions, by question id; unanswered ones are left out. */
    readonly questions: Readonly<Record<string, string>>;
    /** The household's note to the couple, empty if none. */
    readonly message: string;
};

/** One timed line of a moment, as the couple types it: a day around the wedding and hours. */
export type SlotPlan = {
    readonly id: string;
    readonly title: string;
    readonly place: string;
    /** 0 the wedding day, -1 the day before, 1 the day after. */
    readonly dayOffset: number;
    /** "16:00" */
    readonly start: string;
    /** "", or "04:00": an end before the start falls the next day. */
    readonly end: string;
};

/** One invitation, hence one answer, as the couple edits it. */
export type MomentPlan = {
    readonly key: string;
    readonly title: string;
    readonly slots: readonly SlotPlan[];
};

/** A table of the dinner, placed on the room plan in percent of its width and height. */
export type SeatTable = {
    readonly id: string;
    readonly number: number;
    readonly name: string;
    readonly capacity: number;
    readonly x: number;
    readonly y: number;
};

/** Dates the couple set themselves; null follows the wedding day automatically. */
export type DateOverrides = {
    readonly answerDeadline: string | null;
    readonly reminder: string | null;
    readonly galleryOpens: string | null;
};

export type RoomSize = "s" | "m" | "l" | "xl";

export type RoomPoint = { readonly x: number; readonly y: number };

/** The dinner room: its name, its size, and where the couple's table and the entrance stand. */
export type RoomLayout = {
    /** "L'orangerie": shown at the entrance. */
    readonly name: string;
    readonly size: RoomSize;
    readonly head: RoomPoint;
    readonly entrance: RoomPoint;
};

export type SealTone = "olive" | "terre" | "encre";

/** What the couple writes on their faire-part. */
export type InvitationDesign = {
    readonly first: string;
    readonly second: string;
    /** "YYYY-MM-DD" */
    readonly date: string;
    /** Short place shown under the date: "Luberon". */
    readonly place: string;
    /** Greeting on the site; `{invités}` becomes the household's name. */
    readonly welcome: string;
    readonly tone: SealTone;
};

export type ActivityKind =
    | "answered"
    | "updated"
    | "opened"
    | "created"
    | "reminded"
    | "design"
    | "photo";

export type Activity = {
    readonly id: string;
    readonly at: string;
    readonly kind: ActivityKind;
    readonly text: string;
    readonly detail: string;
    /** Initials shown in the feed; empty for the platform's own events. */
    readonly badge: string;
    /** The household (or photo) it is about, empty for events about everyone. */
    readonly subject: string;
};

export type GalleryPhoto = {
    readonly id: string;
    readonly src: string;
    readonly alt: string;
    readonly author: string;
    readonly removed: boolean;
};

export type DemoState = {
    readonly version: 1;
    readonly design: InvitationDesign;
    readonly households: readonly HouseholdRecord[];
    readonly activity: readonly Activity[];
    readonly photos: readonly GalleryPhoto[];
    readonly lastReminder: { readonly at: string; readonly count: number } | null;
    readonly moments: readonly MomentPlan[];
    readonly questions: readonly GuestQuestion[];
    readonly tables: readonly SeatTable[];
    /** Table id by guest id. */
    readonly seats: Readonly<Record<string, string>>;
    readonly room: RoomLayout;
    readonly dates: DateOverrides;
};
