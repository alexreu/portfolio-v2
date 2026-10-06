/** One timed line of the programme, inside a moment. */
export type Slot = {
    readonly title: string;
    readonly place: string;
    /** ISO 8601 with the wedding's UTC offset, e.g. "2027-06-12T16:00:00+02:00". */
    readonly startsAt: string;
    /** Defaults to the next slot's start. */
    readonly endsAt?: string;
};

/** A question of the couple's own, answered once per household. */
export type GuestQuestion = {
    readonly id: string;
    readonly label: string;
    readonly placeholder?: string;
};

/** One invitation, hence one answer: may hold several slots. */
export type Moment = {
    readonly key: string;
    readonly title: string;
    readonly slots: readonly Slot[];
};
