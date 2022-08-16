import React from "react";
import { AboutSection, HomeSection, PortfolioSection, ServicesSection } from "../components/Sections";
import { getDirectoryPath } from "../modules/getDirectoryPath/getDirectoryPath";
import ressourceType from "../enums/RessourceType";
import { getJsonContent } from "../modules/getJsonContent/getJsonContent";

const Index = ({ about, services, projects }) => {
    return (
        <>
            <HomeSection />
            <AboutSection data={about} />
            <ServicesSection services={services} />
            <PortfolioSection projects={projects} />
        </>
    );
};

export async function getStaticProps() {
    const { ABOUT, PROJECTS, SERVICES } = ressourceType;
    const jsonDirectory = getDirectoryPath("json");
    const aboutData = await getJsonContent(jsonDirectory, ABOUT);
    const servicesData = await getJsonContent(jsonDirectory, SERVICES);
    const projectsData = await getJsonContent(jsonDirectory, PROJECTS);
    return {
        props: { ...aboutData, ...servicesData, ...projectsData },
    };
}

export default Index;
