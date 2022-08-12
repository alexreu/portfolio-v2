import React, { useState, useEffect } from "react";
import useSwr from "swr";
import { AboutSection, HomeSection, PortfolioSection, ServicesSection } from "../components/Sections";
import { fetcher } from "../modules/fetcher";
import { Loader } from "../components/Loader";
import { RessourceType } from "../enums";

const Index = () => {
    const { ABOUT, SERVICES, PROJECTS } = RessourceType;
    const [isLoading, setIsLoading] = useState(true);
    const { data: aboutData, error: aboutError, isValidating: aboutValidating } = useSwr(`api/${ABOUT}`, fetcher);
    const {
        data: servicesData,
        error: servicesError,
        isValidating: servicesValidating,
    } = useSwr(`api/${SERVICES}`, fetcher);
    const {
        data: projectsData,
        error: projectsError,
        isValidating: projectsValidating,
    } = useSwr(`api/${PROJECTS}`, fetcher);

    useEffect(() => {
        setIsLoading(aboutValidating && servicesValidating && projectsValidating);
    }, [aboutValidating, servicesValidating, projectsValidating]);

    if (isLoading) return <Loader />;

    return (
        <>
            <HomeSection />
            <AboutSection data={aboutData} />
            <ServicesSection data={servicesData} />
            <PortfolioSection data={projectsData} />
        </>
    );
};

export default Index;
