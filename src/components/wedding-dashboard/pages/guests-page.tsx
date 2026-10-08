"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useDashboard } from "../dashboard-context";
import { dashboardHref } from "../dashboard-pages";
import { PageHeader } from "../dashboard-ui";
import { GuestImportDialog } from "../guest-import-dialog";
import { HouseholdsSection } from "../households-section";

/** `openId`: a household to show straight away, then dropped from the address. */
export const GuestsPage = ({ openId }: { openId?: string }) => {
    const {
        state,
        moments,
        now,
        highlightId,
        linkFor,
        createHousehold,
        openHousehold,
        can,
        dispatch,
    } = useDashboard();
    const [importing, setImporting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!openId) return;
        openHousehold(openId);
        router.replace(dashboardHref("guests"), { scroll: false });
    }, [openId, openHousehold, router]);

    return (
        <>
            <PageHeader page="guests" />
            <HouseholdsSection
                households={state.households}
                moments={moments}
                design={state.design}
                groups={state.groups}
                now={now}
                timezone={state.timezone}
                highlightId={highlightId}
                linkFor={linkFor}
                onAddHousehold={can("guests.write") ? createHousehold : undefined}
                onImport={can("guests.write") ? () => setImporting(true) : undefined}
                showDiets={can("guests.diets.read")}
                onOpen={(household) => openHousehold(household.id)}
            />
            <GuestImportDialog
                open={importing}
                onOpenChange={setImporting}
                moments={state.moments}
                groups={state.groups}
                onImport={(drafts) =>
                    dispatch({ type: "households.import", drafts }).ok ? drafts.length : null
                }
            />
        </>
    );
};
