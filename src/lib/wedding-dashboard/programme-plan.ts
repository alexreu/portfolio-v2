import { failure, success, type Result } from "@/lib/wedding/result";
import type { Moment, Slot } from "@/lib/wedding/types";

import { addDays, daysBetween, parisOffset } from "./calendar";
import type { DraftIssue } from "./drafts";
import type { MomentPlan, SlotPlan } from "./types";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

const at = (day: string, time: string) => `${day}T${time}:00${parisOffset(day)}`;

const datedSlot = (slot: SlotPlan, weddingDay: string): Slot => {
    const day = addDays(weddingDay, slot.dayOffset);
    const startsAt = at(day, slot.start);
    if (!slot.end) return { title: slot.title, place: slot.place, startsAt };
    /** An end before the start, like a ball until 4 a.m., falls the next day. */
    const endDay = slot.end <= slot.start ? addDays(day, 1) : day;
    return { title: slot.title, place: slot.place, startsAt, endsAt: at(endDay, slot.end) };
};

const firstStart = (moment: Moment) => new Date(moment.slots[0]?.startsAt ?? 0).getTime();

/** The couple's plan, dated on their wedding day: what the guest site displays. */
export const momentsFromPlans = (
    plans: readonly MomentPlan[],
    weddingDay: string,
): readonly Moment[] =>
    plans
        .map((plan) => ({
            key: plan.key,
            title: plan.title,
            slots: plan.slots
                .map((slot) => datedSlot(slot, weddingDay))
                .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
        }))
        .sort((a, b) => firstStart(a) - firstStart(b));

/** A dated programme back into hours around the day, to be edited. */
export const plansFromMoments = (
    moments: readonly Moment[],
    weddingDay: string,
): readonly MomentPlan[] =>
    moments.map((moment) => ({
        key: moment.key,
        title: moment.title,
        slots: moment.slots.map((slot, index) => ({
            id: `${moment.key}-${index + 1}`,
            title: slot.title,
            place: slot.place,
            dayOffset: daysBetween(weddingDay, slot.startsAt.slice(0, 10)),
            start: slot.startsAt.slice(11, 16),
            end: slot.endsAt?.slice(11, 16) ?? "",
        })),
    }));

const required = (path: string, value: string, max: number): readonly DraftIssue[] => {
    if (value.trim() === "") return [{ path, code: "required" }];
    return value.trim().length > max ? [{ path, code: "too-long" }] : [];
};

export const validateMoment = (plan: MomentPlan): Result<MomentPlan, readonly DraftIssue[]> => {
    const issues: readonly DraftIssue[] = [
        ...required("title", plan.title, 60),
        ...(plan.slots.length === 0 ? [{ path: "slots", code: "slot-required" as const }] : []),
        ...plan.slots.flatMap((slot, index) => [
            ...required(`slots.${index}.title`, slot.title, 60),
            ...(slot.place.trim().length > 80
                ? [{ path: `slots.${index}.place`, code: "too-long" as const }]
                : []),
            ...(TIME.test(slot.start)
                ? []
                : [{ path: `slots.${index}.start`, code: "time-invalid" as const }]),
            ...(slot.end === "" || TIME.test(slot.end)
                ? []
                : [{ path: `slots.${index}.end`, code: "time-invalid" as const }]),
        ]),
    ];
    return issues.length > 0
        ? failure(issues)
        : success({
              ...plan,
              title: plan.title.trim(),
              slots: plan.slots.map((slot) => ({
                  ...slot,
                  title: slot.title.trim(),
                  place: slot.place.trim(),
              })),
          });
};

const slug = (text: string) =>
    text
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 32);

/** "vin-d-honneur", or "vin-d-honneur-2" when the first is taken. */
export const uniqueSlug = (text: string, taken: readonly string[], fallback: string) => {
    const base = slug(text) || fallback;
    const free = (candidate: string) => !taken.includes(candidate);
    if (free(base)) return base;
    const index = [...Array(taken.length + 1).keys()]
        .map((n) => n + 2)
        .find((n) => free(`${base}-${n}`));
    return `${base}-${index}`;
};

export const momentKeyFor = (title: string, taken: readonly string[]) =>
    uniqueSlug(title, taken, "moment");
