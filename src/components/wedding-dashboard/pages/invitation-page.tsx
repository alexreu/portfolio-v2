"use client";

import { DEMO_GUEST_HOUSEHOLD } from "@/content/wedding-dashboard-demo";
import { weddingDemo } from "@/content/wedding-demo";

import { useDashboard } from "../dashboard-context";
import { PageHeader, ReadOnly } from "../dashboard-ui";
import { InvitationEditor } from "../invitation-editor";
import { InvitationPrintSection } from "../invitation-print-section";
import { QuestionsSection } from "../questions-section";

export const InvitationPage = () => {
    const {
        state,
        dispatch,
        now,
        siteUrl,
        linkFor,
        downloadSharedInvitation,
        downloadHouseholdInvitations,
        can,
    } = useDashboard();
    const sampleHousehold =
        state.households.find((household) => household.id === DEMO_GUEST_HOUSEHOLD) ??
        state.households[0];
    const sampleGuest = sampleHousehold?.name ?? weddingDemo.household.name;
    return (
        <>
            <PageHeader page="invitation" />
            {can("invitation.read") && (
                <ReadOnly locked={!can("invitation.write")}>
                    <InvitationEditor
                        design={state.design}
                        sampleGuest={sampleGuest}
                        now={now}
                        timezone={state.timezone}
                        onSave={(design) => dispatch({ type: "invitation.save", design })}
                    />
                </ReadOnly>
            )}
            {(can("invitation.print") || can("household.print")) && (
                <InvitationPrintSection
                    siteUrl={siteUrl}
                    sample={{
                        name: sampleGuest,
                        link: sampleHousehold ? linkFor(sampleHousehold) : siteUrl,
                    }}
                    householdCount={state.households.length}
                    onDownloadShared={
                        can("invitation.print") ? downloadSharedInvitation : undefined
                    }
                    onDownloadHouseholds={
                        can("household.print") ? () => downloadHouseholdInvitations() : undefined
                    }
                />
            )}
            {can("questions.read") && (
                <ReadOnly locked={!can("questions.write")}>
                    <QuestionsSection
                        questions={state.questions}
                        onSave={(questions) => dispatch({ type: "questions.save", questions })}
                    />
                </ReadOnly>
            )}
        </>
    );
};
