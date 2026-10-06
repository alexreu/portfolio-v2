import type { Metadata } from "next";

import { buildPageJsonLd, buildPageMetadata, weddingDashboardDemoPage } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { DashboardApp } from "@/components/wedding-dashboard/dashboard-app";
import { cormorant } from "@/app/fonts/wedding";

export const metadata: Metadata = buildPageMetadata(weddingDashboardDemoPage);

/** The couple's side of the demo, in the platform's ivory and gold rather than the site's. */
export default function WeddingDashboardDemoPage() {
    return (
        <div className={`${cormorant.variable} bg-wed-ivory text-wed-ink font-main min-h-dvh`}>
            <JsonLd data={buildPageJsonLd(weddingDashboardDemoPage)} />
            <DashboardApp />
        </div>
    );
}
