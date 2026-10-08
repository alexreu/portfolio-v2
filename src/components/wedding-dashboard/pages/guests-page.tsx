"use client";

import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";
import { HouseholdsSection } from "../households-section";

export const GuestsPage = () => {
    const { state, moments, now, highlightId, linkFor, createHousehold, openHousehold } =
        useDashboard();
    return (
        <>
            <PageHeader page="invites" />
            <HouseholdsSection
                households={state.households}
                moments={moments}
                design={state.design}
                now={now}
                highlightId={highlightId}
                linkFor={linkFor}
                onAddHousehold={createHousehold}
                onOpen={(household) => openHousehold(household.id)}
            />
        </>
    );
};
