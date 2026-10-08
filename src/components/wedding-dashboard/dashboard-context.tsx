"use client";

import { createContext, useContext } from "react";

import type { WeddingCalendar } from "@/lib/wedding-dashboard/calendar";
import type { DemoAction } from "@/lib/wedding-dashboard/state";
import type { DemoState, HouseholdRecord } from "@/lib/wedding-dashboard/types";
import type { Moment } from "@/lib/wedding/types";

/** What every page of the dashboard reads, once the browser copy is loaded. */
export type Dashboard = {
    readonly state: DemoState;
    readonly dispatch: (action: DemoAction) => void;
    readonly now: Date;
    readonly calendar: WeddingCalendar;
    readonly moments: readonly Moment[];
    /** The time an action is recorded at. */
    readonly at: () => string;
    readonly linkFor: (household: HouseholdRecord) => string;
    /** The household just created, lit up in the guest list. */
    readonly highlightId: string | null;
    readonly openHousehold: (householdId: string) => void;
    readonly createHousehold: () => void;
    readonly exportCsv: () => void;
    /** The dinner's sheet for the caterer, downloaded as a PDF. */
    readonly exportCatererPdf: () => Promise<void>;
    readonly remind: () => void;
};

const DashboardContext = createContext<Dashboard | null>(null);

export const DashboardProvider = DashboardContext.Provider;

export const useDashboard = () => {
    const dashboard = useContext(DashboardContext);
    if (!dashboard) throw new Error("useDashboard must be used inside the dashboard layout");
    return dashboard;
};
