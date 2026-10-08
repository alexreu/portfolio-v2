import type { Metadata } from "next";

import { AccessPage } from "@/components/wedding-dashboard/pages/access-page";

import { dashboardPageMetadata } from "../page-metadata";

export const metadata: Metadata = dashboardPageMetadata("acces");

export default function DashboardAccessPage() {
    return <AccessPage />;
}
