import { failure, success, type Result } from "@/lib/wedding/result";

import { addDays, automaticDates } from "./calendar";
import type { DraftIssue } from "./drafts";
import type { DateOverrides } from "./types";

export { automaticDates };

export type DatesDraft = { readonly day: string; readonly overrides: DateOverrides };

const isRealDay = (day: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(day) &&
    !Number.isNaN(Date.parse(`${day}T12:00:00Z`)) &&
    new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) === day;

type Field = keyof DateOverrides;

/**
 * The wedding day and the dates around it. A date set to its automatic value is dropped, so
 * it keeps following the wedding day if that moves.
 */
export const validateDates = (
    { day, overrides }: DatesDraft,
    today: string,
    /** The dates saved so far: one already past, a reminder sent, may stay as it is. */
    saved?: DateOverrides,
): Result<DatesDraft, readonly DraftIssue[]> => {
    if (!isRealDay(day)) return failure([{ path: "day", code: "date-invalid" }]);
    if (day < today) return failure([{ path: "day", code: "date-past" }]);
    const automatic = automaticDates(day);
    const effective = (field: Field) => overrides[field] ?? automatic[field];
    const upcoming = (field: Field, date: string) => date >= today || date === saved?.[field];
    const check = (field: Field, inRange: (date: string) => boolean): readonly DraftIssue[] => {
        const value = overrides[field];
        if (value === null) return [];
        if (!isRealDay(value)) return [{ path: field, code: "date-invalid" }];
        return inRange(value) ? [] : [{ path: field, code: "out-of-range" }];
    };
    const issues = [
        ...check("answerDeadline", (date) => upcoming("answerDeadline", date) && date < day),
        ...check(
            "reminder",
            (date) => upcoming("reminder", date) && date < effective("answerDeadline"),
        ),
        ...check("galleryOpens", (date) => date >= addDays(day, -7) && date <= day),
    ];
    if (issues.length > 0) return failure(issues);
    const kept = (field: Field) =>
        overrides[field] === automatic[field] ? null : overrides[field];
    return success({
        day,
        overrides: {
            answerDeadline: kept("answerDeadline"),
            reminder: kept("reminder"),
            galleryOpens: kept("galleryOpens"),
        },
    });
};
