import type { Metadata } from "next";

import { FollowUpPage } from "@/components/wedding-dashboard/pages/follow-up-page";

import { dashboardPageMetadata } from "../page-metadata";

export const metadata: Metadata = dashboardPageMetadata("reminders");

export default function DashboardFollowUpPage() {
    return <FollowUpPage />;
}
