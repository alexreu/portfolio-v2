import type { Metadata } from "next";

import { buildPageJsonLd, buildPageMetadata, weddingDashboardDemoPage } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { OverviewPage } from "@/components/wedding-dashboard/pages/overview-page";

export const metadata: Metadata = buildPageMetadata(weddingDashboardDemoPage);

export default function WeddingDashboardDemoPage() {
    return (
        <>
            <JsonLd data={buildPageJsonLd(weddingDashboardDemoPage)} />
            <OverviewPage />
        </>
    );
}
