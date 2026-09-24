import type { Metadata } from "next";

import { getHomepageData } from "@/lib/sanity/sanity.query";
import { buildHomeJsonLd } from "@/lib/seo";
import { BentoGrid } from "@/components/home/bento-grid";
import { HeroSection } from "@/components/home/hero-section";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default async function Home() {
    const data = await getHomepageData();
    const projects = data.projectCount > 0 ? data.projects : undefined;

    return (
        <>
            <JsonLd
                data={buildHomeJsonLd({
                    settings: data.settings,
                    services: data.services,
                    projects,
                    pricingPlans: data.pricingPlans,
                })}
            />
            <HeroSection data={data.settings?.hero} />
            <BentoGrid
                projects={projects}
                aboutData={data.settings?.about}
                contactData={data.settings?.contact}
                services={data.services}
                pricingPlans={data.pricingPlans}
                maintenance={data.maintenance}
                skillCategories={data.skillCategories}
            />
        </>
    );
}
