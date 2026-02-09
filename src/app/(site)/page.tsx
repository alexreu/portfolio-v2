import { getHomepageDataV2 } from "@/lib/sanity/sanity.query";
import { BentoGrid } from "@/components/home/bento-grid";
import { HeroSection } from "@/components/home/hero-section";

export default async function Home() {
    const data = await getHomepageDataV2();

    return (
        <>
            <HeroSection data={data.settings?.hero} />
            <BentoGrid
                aboutData={data.settings?.about}
                contactData={data.settings?.contact}
                services={data.services}
                pricingPlans={data.pricingPlans}
                skillCategories={data.skillCategories}
            />
        </>
    );
}
