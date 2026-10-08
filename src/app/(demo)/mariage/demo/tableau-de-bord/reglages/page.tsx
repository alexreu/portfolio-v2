import type { Metadata } from "next";

import { SettingsPage } from "@/components/wedding-dashboard/pages/settings-page";

import { dashboardPageMetadata } from "../page-metadata";

export const metadata: Metadata = dashboardPageMetadata("settings");

export default function DashboardSettingsPage() {
    return <SettingsPage />;
}
