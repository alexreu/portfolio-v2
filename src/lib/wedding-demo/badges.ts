import { availabilityNote, PLANS, type DashboardPage, type Flag } from "@alexreu/wedding-core";

/** Beside a function of the demo, which plays Signature: the formula it comes with. */
export type PlanBadge = {
    /** The first formula that includes it: "Essentiel", "Signature". */
    readonly from: string;
    /** "Dès Essentiel · option Intime". */
    readonly note: string;
};

/** Nothing for a function every formula has; computed from the catalogue, never by hand. */
export const planBadge = (flag: Flag): PlanBadge | undefined => {
    const note = availabilityNote(flag);
    if (!note) return undefined;
    return { from: PLANS.find((plan) => plan.flags.includes(flag))?.name ?? "Option", note };
};

/** The function behind each page that not every formula has. */
const PAGE_FLAGS: Partial<Readonly<Record<DashboardPage, Flag>>> = {
    seating: "seating",
    reminders: "reminders",
    gallery: "gallery",
    access: "collaborators",
};

export const pageBadge = (page: DashboardPage | null) => {
    const flag = page ? PAGE_FLAGS[page] : undefined;
    return flag ? planBadge(flag) : undefined;
};
