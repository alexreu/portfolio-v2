export type Countdown = {
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
};

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A second that has only started still counts, so the display reaches 0 at the ceremony itself. */
export const countdownTo = (target: string, now: Date): Countdown => {
    const left =
        Math.ceil(Math.max(0, new Date(target).getTime() - now.getTime()) / SECOND) * SECOND;
    return {
        days: Math.floor(left / DAY),
        hours: Math.floor((left % DAY) / HOUR),
        minutes: Math.floor((left % HOUR) / MINUTE),
        seconds: Math.floor((left % MINUTE) / SECOND),
    };
};
