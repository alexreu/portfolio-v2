import type { Metadata } from "next";

import { GuestsPage } from "@/components/wedding-dashboard/pages/guests-page";

import { dashboardPageMetadata } from "../page-metadata";

export const metadata: Metadata = dashboardPageMetadata("invites");

export default function DashboardGuestsPage() {
    return <GuestsPage />;
}
