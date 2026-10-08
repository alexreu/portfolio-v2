"use client";

import { DEMO_GUEST_HOUSEHOLD } from "@/content/wedding-dashboard-demo";
import { weddingDemo } from "@/content/wedding-demo";

import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";
import { InvitationEditor } from "../invitation-editor";
import { QuestionsSection } from "../questions-section";

export const InvitationPage = () => {
    const { state, dispatch, now, at } = useDashboard();
    const sampleGuest =
        state.households.find((household) => household.id === DEMO_GUEST_HOUSEHOLD)?.name ??
        weddingDemo.household.name;
    return (
        <>
            <PageHeader page="faire-part" />
            <InvitationEditor
                design={state.design}
                sampleGuest={sampleGuest}
                now={now}
                onSave={(design) => dispatch({ type: "design-saved", design, at: at() })}
            />
            <QuestionsSection
                questions={state.questions}
                onSave={(questions) => dispatch({ type: "questions-saved", questions, at: at() })}
            />
        </>
    );
};
