import type { Metadata } from "next";

import { SeatingPage } from "@/components/wedding-dashboard/pages/seating-page";

import { dashboardPageMetadata } from "../page-metadata";

export const metadata: Metadata = dashboardPageMetadata("plan-de-table");

export default function DashboardSeatingPage() {
    return <SeatingPage />;
}
