"use client";

import { DEMO_GUEST_HOUSEHOLD } from "@/content/wedding-dashboard-demo";
import { weddingDemo } from "@/content/wedding-demo";

import { householdStatus } from "@/lib/wedding-dashboard/households";

import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";
import { FollowUpSection } from "../follow-up-section";

export const FollowUpPage = () => {
    const { state, calendar, now, remind, openHousehold } = useDashboard();
    /** The reminder is shown as one household still to answer would get it. */
    const sampleGuest =
        state.households.find((household) => householdStatus(household) !== "answered")?.name ??
        state.households.find((household) => household.id === DEMO_GUEST_HOUSEHOLD)?.name ??
        weddingDemo.household.name;
    return (
        <>
            <PageHeader page="relances" />
            <FollowUpSection
                state={state}
                calendar={calendar}
                now={now}
                sampleGuest={sampleGuest}
                onRemind={remind}
                onOpenHousehold={openHousehold}
            />
        </>
    );
};
