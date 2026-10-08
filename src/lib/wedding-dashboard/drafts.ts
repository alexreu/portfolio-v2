import { failure, success, type Result } from "@/lib/wedding/result";

import type { GroupKey, HouseholdRecord, InvitationDesign } from "./types";

export type HouseholdDraft = {
    readonly name: string;
    readonly group: GroupKey;
    readonly email: string;
    readonly guests: readonly {
        /** Set for a guest already in the household, whose answers are kept. */
        readonly id?: string;
        readonly firstName: string;
        readonly child: boolean;
    }[];
    readonly momentKeys: readonly string[];
};

export type DraftIssue = {
    readonly path: string;
    readonly code:
        | "required"
        | "too-long"
        | "guest-required"
        | "moment-required"
        | "email-invalid"
        | "email-taken"
        | "access-required"
        | "date-invalid"
        | "date-past"
        | "slot-required"
        | "time-invalid"
        | "number-taken"
        | "out-of-range"
        | "limit";
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (path: string, value: string, max: number): readonly DraftIssue[] => {
    if (value.trim() === "") return [{ path, code: "required" }];
    return value.trim().length > max ? [{ path, code: "too-long" }] : [];
};

export const validateHouseholdDraft = (
    draft: HouseholdDraft,
): Result<HouseholdDraft, readonly DraftIssue[]> => {
    const issues = [
        ...text("name", draft.name, 60),
        ...(draft.guests.length === 0 ? [{ path: "guests", code: "guest-required" as const }] : []),
        ...draft.guests.flatMap((guest, index) =>
            text(`guests.${index}.firstName`, guest.firstName, 40),
        ),
        ...(draft.momentKeys.length === 0
            ? [{ path: "momentKeys", code: "moment-required" as const }]
            : []),
        ...(draft.email.trim() !== "" && !EMAIL.test(draft.email.trim())
            ? [{ path: "email", code: "email-invalid" as const }]
            : []),
    ];
    return issues.length > 0
        ? failure(issues)
        : success({
              ...draft,
              name: draft.name.trim(),
              email: draft.email.trim(),
              guests: draft.guests.map((guest) => ({
                  ...guest,
                  firstName: guest.firstName.trim(),
              })),
          });
};

/** A household that has just received its faire-part: nothing opened, nothing answered. */
export const createHousehold = (
    draft: HouseholdDraft,
    { id, at }: { id: string; at: string },
): HouseholdRecord => ({
    id,
    name: draft.name,
    group: draft.group,
    email: draft.email,
    guests: draft.guests.map((guest, index) => ({
        id: `${id}-${index + 1}`,
        firstName: guest.firstName,
        child: guest.child,
    })),
    momentKeys: draft.momentKeys,
    lastSeenAt: null,
    attendance: {},
    diets: {},
    answeredAt: null,
    answeredBy: null,
    createdAt: at,
    questions: {},
    message: "",
});

/** The household as its edit form shows it. */
export const draftOf = (household: HouseholdRecord): HouseholdDraft => ({
    name: household.name,
    group: household.group,
    email: household.email,
    guests: household.guests.map(({ id, firstName, child }) => ({ id, firstName, child })),
    momentKeys: household.momentKeys,
});

/** "moreau-4": the first number after the household's id that no guest holds yet. */
const freshGuestIds = (householdId: string, taken: ReadonlySet<string>, count: number) =>
    [...Array(count + taken.size + 1).keys()]
        .map((index) => `${householdId}-${index + 1}`)
        .filter((id) => !taken.has(id))
        .slice(0, count);

const only = <Value>(
    record: Readonly<Record<string, Value>>,
    keys: readonly string[],
): Readonly<Record<string, Value>> =>
    Object.fromEntries(Object.entries(record).filter(([key]) => keys.includes(key)));

/**
 * The household after the couple corrected it: same link, same answers for the guests and
 * moments still there; a guest or a moment taken out takes their answers with them.
 */
export const editHousehold = (
    household: HouseholdRecord,
    draft: HouseholdDraft,
): HouseholdRecord => {
    const known = new Map(household.guests.map((guest) => [guest.id, guest]));
    const kept = new Set(
        draft.guests.flatMap((guest) => (guest.id && known.has(guest.id) ? [guest.id] : [])),
    );
    const fresh = freshGuestIds(
        household.id,
        new Set(known.keys()),
        draft.guests.filter((guest) => !(guest.id && kept.has(guest.id))).length,
    );
    const guests = draft.guests.reduce<{
        readonly list: HouseholdRecord["guests"];
        readonly next: number;
    }>(
        ({ list, next }, guest) => {
            const before = guest.id ? known.get(guest.id) : undefined;
            return before
                ? {
                      list: [
                          ...list,
                          { ...before, firstName: guest.firstName, child: guest.child },
                      ],
                      next,
                  }
                : {
                      list: [
                          ...list,
                          { id: fresh[next], firstName: guest.firstName, child: guest.child },
                      ],
                      next: next + 1,
                  };
        },
        { list: [], next: 0 },
    ).list;
    const ids = guests.map((guest) => guest.id);
    return {
        ...household,
        name: draft.name,
        group: draft.group,
        email: draft.email,
        guests,
        momentKeys: draft.momentKeys,
        attendance: Object.fromEntries(
            Object.entries(only(household.attendance, ids)).map(([id, moments]) => [
                id,
                only(moments, draft.momentKeys),
            ]),
        ),
        diets: only(household.diets, ids),
    };
};

/** "Zoé & Élodie" → "zoe-elodie": readable in a link or a file name. */
export const slugOf = (text: string) =>
    text
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

/** "famille-helene-zoe-x7": readable in a link; the suffix keeps two Martin families apart. */
export const householdIdFor = (name: string, suffix: string) =>
    `${slugOf(name).slice(0, 32) || "foyer"}-${suffix}`;

/** A household id no other household holds: another suffix is drawn while it is taken. */
export const freshHouseholdId = (
    name: string,
    taken: ReadonlySet<string>,
    suffix: () => string,
): string => {
    const id = householdIdFor(name, suffix());
    return taken.has(id) ? freshHouseholdId(name, taken, suffix) : id;
};

const isRealDay = (day: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(day) &&
    !Number.isNaN(Date.parse(`${day}T12:00:00Z`)) &&
    new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) === day;

const dateIssues = (day: string, today: string): readonly DraftIssue[] => {
    if (!isRealDay(day)) return [{ path: "date", code: "date-invalid" }];
    return day < today ? [{ path: "date", code: "date-past" }] : [];
};

export const THANKS_MAX = 300;

const DEFAULT_THANKS =
    "Merci d'avoir été là. Retrouvez ici les photos de la journée, et ajoutez les vôtres.";

/** What guests read the day after: the couple's own words, or a simple thank-you. */
export const thanksOf = (design: InvitationDesign) => design.thanks?.trim() || DEFAULT_THANKS;

/** `today` is Paris's date, "YYYY-MM-DD": a wedding cannot be planned in the past. */
export const validateDesign = (
    design: InvitationDesign,
    today: string,
): Result<InvitationDesign, readonly DraftIssue[]> => {
    const issues = [
        ...text("first", design.first, 30),
        ...text("second", design.second, 30),
        ...dateIssues(design.date, today),
        ...text("place", design.place, 40),
        ...(design.welcome.trim().length > 220
            ? [{ path: "welcome", code: "too-long" as const }]
            : []),
        ...((design.thanks ?? "").trim().length > THANKS_MAX
            ? [{ path: "thanks", code: "too-long" as const }]
            : []),
    ];
    return issues.length > 0
        ? failure(issues)
        : success({
              ...design,
              first: design.first.trim(),
              second: design.second.trim(),
              place: design.place.trim(),
              welcome: design.welcome.trim(),
              thanks: (design.thanks ?? "").trim(),
          });
};

export const personalize = (welcome: string, guestName: string) =>
    welcome.replaceAll("{invités}", guestName);

const initial = (name: string) => name.trim().charAt(0).toUpperCase();

/** "C·H", engraved on the wax seal. */
export const sealInitials = (first: string, second: string) =>
    `${initial(first)}·${initial(second)}`;

/** "C & H", in the site's navigation. */
export const monogram = (first: string, second: string) => `${initial(first)} & ${initial(second)}`;
