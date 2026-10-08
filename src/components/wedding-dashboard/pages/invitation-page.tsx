"use client";

import { DEMO_GUEST_HOUSEHOLD } from "@/content/wedding-dashboard-demo";
import { weddingDemo } from "@/content/wedding-demo";

import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";
import { InvitationEditor } from "../invitation-editor";
import { InvitationPrintSection } from "../invitation-print-section";
import { QuestionsSection } from "../questions-section";

export const InvitationPage = () => {
    const {
        state,
        dispatch,
        now,
        at,
        siteUrl,
        linkFor,
        downloadSharedInvitation,
        downloadHouseholdInvitations,
    } = useDashboard();
    const sampleHousehold =
        state.households.find((household) => household.id === DEMO_GUEST_HOUSEHOLD) ??
        state.households[0];
    const sampleGuest = sampleHousehold?.name ?? weddingDemo.household.name;
    return (
        <>
            <PageHeader page="faire-part" />
            <InvitationEditor
                design={state.design}
                sampleGuest={sampleGuest}
                now={now}
                onSave={(design) => dispatch({ type: "design-saved", design, at: at() })}
            />
            <InvitationPrintSection
                siteUrl={siteUrl}
                sample={{
                    name: sampleGuest,
                    link: sampleHousehold ? linkFor(sampleHousehold) : siteUrl,
                }}
                householdCount={state.households.length}
                onDownloadShared={downloadSharedInvitation}
                onDownloadHouseholds={() => downloadHouseholdInvitations()}
            />
            <QuestionsSection
                questions={state.questions}
                onSave={(questions) => dispatch({ type: "questions-saved", questions, at: at() })}
            />
        </>
    );
};
