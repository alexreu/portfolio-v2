import { HomeSection, AboutSection, ServicesSection, PortfolioSection } from "../src/components/Sections";
import React, { Suspense } from "react";
import ressourceType from "../src/enums/RessourceType";
import { getDirectoryPath } from "../src/modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../src/modules/getJsonContent/getJsonContent";

const getData = async () => {
    const { ABOUT, PROJECTS, SERVICES } = ressourceType;
    const jsonDirectory = getDirectoryPath("json");
    const aboutData = await getJsonContent(jsonDirectory, ABOUT);
    const servicesData = await getJsonContent(jsonDirectory, SERVICES);
    const projectsData = await getJsonContent(jsonDirectory, PROJECTS);
    return {
        data: { ...aboutData, ...servicesData, ...projectsData },
    };
};

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Index() {
    const { data } = await getData();
    console.log(data);
    return (
        <Suspense fallback={"Loading ..."}>
            <main>
                <HomeSection />
                <AboutSection data={data.about} />
                <ServicesSection services={data.services} />
                <PortfolioSection projects={data.projects} />
            </main>
        </Suspense>
    );
}
