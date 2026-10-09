import type { Metadata } from "next";

import { ProgrammePage } from "@/components/wedding-dashboard/pages/programme-page";

import { dashboardPageMetadata } from "../page-metadata";

export const metadata: Metadata = dashboardPageMetadata("programme");

export default function DashboardProgrammePage() {
    return <ProgrammePage />;
}
