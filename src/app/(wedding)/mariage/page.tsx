import type { Metadata } from "next";

import { getWeddingService } from "@/lib/sanity/sanity.query";
import { buildPageMetadata, buildWeddingJsonLd, weddingPage } from "@/lib/seo";
import { resolveWeddingService } from "@/lib/wedding-service/content";
import { JsonLd } from "@/components/shared/json-ld";
import { WeddingComparison } from "@/components/wedding/wedding-comparison";
import { WeddingContactSection } from "@/components/wedding/wedding-contact-section";
import { WeddingDashboard } from "@/components/wedding/wedding-dashboard";
import { WeddingDemoBand } from "@/components/wedding/wedding-demo-band";
import { WeddingFaq } from "@/components/wedding/wedding-faq";
import { WeddingFeatures } from "@/components/wedding/wedding-features";
import { WeddingHero } from "@/components/wedding/wedding-hero";
import { WeddingMoments } from "@/components/wedding/wedding-moments";
import { WeddingPricing } from "@/components/wedding/wedding-pricing";
import { WeddingSteps } from "@/components/wedding/wedding-steps";

export const metadata: Metadata = buildPageMetadata(weddingPage);

export default async function WeddingPage() {
    const content = resolveWeddingService(await getWeddingService());

    return (
        <>
            <JsonLd data={buildWeddingJsonLd(content)} />
            <WeddingHero hero={content.hero} />
            <WeddingMoments moments={content.moments} />
            <WeddingDemoBand demo={content.demo} />
            <WeddingFeatures features={content.features} />
            <WeddingDashboard dashboard={content.dashboard} />
            <WeddingSteps steps={content.steps} />
            <WeddingPricing pricing={content.pricing} />
            <WeddingComparison comparison={content.comparison} />
            <WeddingFaq faq={content.faq} />
            <WeddingContactSection />
        </>
    );
}
