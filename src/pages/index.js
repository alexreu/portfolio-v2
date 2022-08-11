import React from "react";
import useSwr from "swr";
import { AboutSection, HomeSection, PortfolioSection, ServicesSection } from "../components/Sections";
import { fetcher } from "../modules/fetcher";
import { Loader } from "../components/Loader";

const Index = () => {
    const { data: aboutData, error: aboutError } = useSwr("/api/about", fetcher);

    if (!aboutData) return <Loader />;
    return (
        <>
            <HomeSection />
            <AboutSection data={aboutData} />
            <ServicesSection />
            <PortfolioSection />
        </>
    );
};

export default Index;
