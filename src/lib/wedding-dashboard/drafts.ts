import { failure, success, type Result } from "@/lib/wedding/result";

import type { GroupKey, HouseholdRecord, InvitationDesign } from "./types";

export type HouseholdDraft = {
    readonly name: string;
    readonly group: GroupKey;
    readonly email: string;
    readonly guests: readonly { readonly firstName: string; readonly child: boolean }[];
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

/** "famille-helene-zoe-x7": readable in a link; the suffix keeps two Martin families apart. */
export const householdIdFor = (name: string, suffix: string) =>
    `${name
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 32)}-${suffix}`;

const isRealDay = (day: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(day) &&
    !Number.isNaN(Date.parse(`${day}T12:00:00Z`)) &&
    new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) === day;

const dateIssues = (day: string, today: string): readonly DraftIssue[] => {
    if (!isRealDay(day)) return [{ path: "date", code: "date-invalid" }];
    return day < today ? [{ path: "date", code: "date-past" }] : [];
};

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
    ];
    return issues.length > 0
        ? failure(issues)
        : success({
              ...design,
              first: design.first.trim(),
              second: design.second.trim(),
              place: design.place.trim(),
              welcome: design.welcome.trim(),
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
