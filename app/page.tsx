import {
    HomeSection,
    AboutSection,
    ServicesSection,
    PortfolioSection,
    AboutSectionProps,
    ServicesSectionProps,
    PortfolioSectionProps,
} from "../src/components/Sections";
import React, { Suspense } from "react";
import ressourceType from "../src/enums/RessourceType";
import { getDirectoryPath } from "../src/modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../src/modules/getJsonContent/getJsonContent";

const getData = async (): Promise<{
    about: AboutSectionProps;
    projects: PortfolioSectionProps;
    services: ServicesSectionProps;
}> => {
    const { ABOUT, PROJECTS, SERVICES } = ressourceType;
    const jsonDirectory = getDirectoryPath("json");
    const aboutData: AboutSectionProps = await getJsonContent(jsonDirectory, ABOUT);
    const servicesData: ServicesSectionProps = await getJsonContent(jsonDirectory, SERVICES);
    const projectsData: PortfolioSectionProps = await getJsonContent(jsonDirectory, PROJECTS);
    return { about: aboutData, services: servicesData, projects: projectsData };
};

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Index() {
    const { about, projects, services } = await getData();
    console.log({ about, projects, services });
    return (
        <Suspense fallback={"Loading ..."}>
            <main>
                <HomeSection />
                <AboutSection data={about} />
                <ServicesSection services={services} />
                <PortfolioSection projects={projects} />
            </main>
        </Suspense>
    );
}
