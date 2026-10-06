export type Countdown = {
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const countdownTo = (target: string, now: Date): Countdown => {
    const left = Math.max(0, new Date(target).getTime() - now.getTime());
    return {
        days: Math.floor(left / DAY),
        hours: Math.floor((left % DAY) / HOUR),
        minutes: Math.floor((left % HOUR) / MINUTE),
    };
};
