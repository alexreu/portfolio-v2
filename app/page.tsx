"use client";

import { AboutSection, HomeSection, PortfolioSection, ServicesSection } from "../src/components/Sections";
import about from "../src/pages/api/about";
import React from "react";
import ressourceType from "../src/enums/RessourceType";
import { getDirectoryPath } from "../src/modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../src/modules/getJsonContent/getJsonContent";

// const getData = async () => {
//     const { ABOUT, PROJECTS, SERVICES } = ressourceType;
//     const jsonDirectory = getDirectoryPath("json");
//     const aboutData = await getJsonContent(jsonDirectory, ABOUT);
//     const servicesData = await getJsonContent(jsonDirectory, SERVICES);
//     const projectsData = await getJsonContent(jsonDirectory, PROJECTS);
//     return {
//         data: { ...aboutData, ...servicesData, ...projectsData },
//     };
// };

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Index() {
    // const { data } = await getData();
    console.log("data");
    return (
        <>
            <HomeSection />
            {/*<AboutSection data={about} />*/}
            {/*<ServicesSection services={services} />*/}
            {/*<PortfolioSection projects={projects} />*/}
        </>
    );
}
