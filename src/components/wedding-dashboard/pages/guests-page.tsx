"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useDashboard } from "../dashboard-context";
import { dashboardHref } from "../dashboard-pages";
import { PageHeader } from "../dashboard-ui";
import { HouseholdsSection } from "../households-section";

/** `openId`: a household to show straight away, then dropped from the address. */
export const GuestsPage = ({ openId }: { openId?: string }) => {
    const { state, moments, now, highlightId, linkFor, createHousehold, openHousehold, can } =
        useDashboard();
    const router = useRouter();

    useEffect(() => {
        if (!openId) return;
        openHousehold(openId);
        router.replace(dashboardHref("invites"), { scroll: false });
    }, [openId, openHousehold, router]);

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
                onAddHousehold={can("household.create") ? createHousehold : undefined}
                showDiets={can("diets.read")}
                onOpen={(household) => openHousehold(household.id)}
            />
        </>
    );
};
