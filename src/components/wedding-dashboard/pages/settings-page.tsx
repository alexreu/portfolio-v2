"use client";

import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";
import { DataSection, GroupsSection, OfferSection, PlaceSection } from "../settings-sections";

/** The couple's own page: their groups, where the wedding takes place, their formula and data. */
export const SettingsPage = () => {
    const { state, dispatch, planName, flags, exportData } = useDashboard();
    const refusals = (result: ReturnType<typeof dispatch>) => (result.ok ? [] : result.error);
    return (
        <>
            <PageHeader page="settings" />
            <GroupsSection
                groups={state.groups}
                households={state.households}
                onSave={(groups) => refusals(dispatch({ type: "groups.save", groups }))}
            />
            <PlaceSection
                timezone={state.timezone}
                onSave={(timezone) =>
                    refusals(dispatch({ type: "settings.save", timezone, ...state.settings }))
                }
            />
            <OfferSection plan={planName} flags={flags} />
            <DataSection
                guests={state.households.reduce(
                    (sum, household) => sum + household.guests.length,
                    0,
                )}
                onExport={exportData}
            />
        </>
    );
};
