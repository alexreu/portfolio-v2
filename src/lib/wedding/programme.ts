import type { Moment, Slot } from "./types";

export type SlotStatus = "past" | "now" | "upcoming";

export type TimedSlot = Slot & { readonly status: SlotStatus };

export type TimedMoment = Omit<Moment, "slots"> & { readonly slots: readonly TimedSlot[] };

export type Programme = {
    readonly moments: readonly TimedMoment[];
    /** The slot running right now ("En ce moment"). */
    readonly current: TimedSlot | null;
    /** The first slot still to come ("Ensuite"). */
    readonly next: TimedSlot | null;
};

const time = (iso: string) => new Date(iso).getTime();

/** A slot runs until its own end, else until the next slot of the programme starts. */
const endOf = (slot: Slot, next: Slot | undefined) =>
    slot.endsAt ? time(slot.endsAt) : next ? time(next.startsAt) : Number.POSITIVE_INFINITY;

const statusOf = (slot: Slot, next: Slot | undefined, now: number): SlotStatus =>
    now < time(slot.startsAt) ? "upcoming" : now < endOf(slot, next) ? "now" : "past";

/** Index of each moment's first slot in the flattened programme. */
const slotOffsets = (moments: readonly Moment[]) =>
    moments.map((_, index) =>
        moments.slice(0, index).reduce((count, moment) => count + moment.slots.length, 0),
    );

export const programmeAt = (moments: readonly Moment[], now: Date): Programme => {
    const allSlots = moments.flatMap((moment) => moment.slots);
    const timed: readonly TimedSlot[] = allSlots.map((slot, index) => ({
        ...slot,
        status: statusOf(slot, allSlots[index + 1], now.getTime()),
    }));
    const offsets = slotOffsets(moments);

    return {
        moments: moments.map((moment, momentIndex) => ({
            ...moment,
            slots: timed.slice(offsets[momentIndex], offsets[momentIndex] + moment.slots.length),
        })),
        current: timed.find((slot) => slot.status === "now") ?? null,
        next: timed.find((slot) => slot.status === "upcoming") ?? null,
    };
};
