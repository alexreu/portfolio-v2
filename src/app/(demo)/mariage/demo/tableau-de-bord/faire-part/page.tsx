import type { Metadata } from "next";

import { InvitationPage } from "@/components/wedding-dashboard/pages/invitation-page";

import { dashboardPageMetadata } from "../page-metadata";

export const metadata: Metadata = dashboardPageMetadata("invitation");

export default function DashboardInvitationPage() {
    return <InvitationPage />;
}
