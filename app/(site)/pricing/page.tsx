import { Metadata } from "next";

import { getPricingPageData } from "@/lib/sanity/sanity.query";
import { PricingPageContent } from "@/components/pricing-page/pricing-page-content";

export const metadata: Metadata = {
    title: "Tarifs | AlexDevLab",
    description: "Consultez les offres et tarifs de développement web d'AlexDevLab.",
};

export default async function Pricing() {
    const pricingData = await getPricingPageData();
    return <PricingPageContent pricingData={pricingData} />;
}
