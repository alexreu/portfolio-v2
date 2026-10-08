import type { Metadata } from "next";

import { GalleryPage } from "@/components/wedding-dashboard/pages/gallery-page";

import { dashboardPageMetadata } from "../page-metadata";

export const metadata: Metadata = dashboardPageMetadata("galerie");

export default function DashboardGalleryPage() {
    return <GalleryPage />;
}
