import ressourceType from "../src/enums/ResourceType";
import { getDirectoryPath } from "../src/modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../src/modules/getJsonContent/getJsonContent";
import { AboutSection, PortfolioSection, ServicesSection, HomeSection } from "../src/components/Sections";
import { Suspense } from "react";

export type AboutResource = { id: string; title: string; content: [{ title: string; description: string }] };
export type ProjectResource = {
    title: string;
    subtitle: string;
    picture: string;
    link: { title: string; url: string };
};
export type ServicesResource = { icon: string; title: string; description: string };

export type AboutData = { about: AboutResource[] };
export type ProjectsData = { projects: ProjectResource[] };
export type ServicesData = { services: ServicesResource[] };

const getData = async () => {
    const { ABOUT, PROJECTS, SERVICES } = ressourceType;
    const jsonDirectory = getDirectoryPath("json");
    const { about } = (await getJsonContent(jsonDirectory, ABOUT)) as { about: AboutResource[] };
    const { services } = (await getJsonContent(jsonDirectory, SERVICES)) as { services: ServicesResource[] };
    const { projects } = (await getJsonContent(jsonDirectory, PROJECTS)) as { projects: ProjectResource[] };

    return { about, services, projects };
};

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Index() {
    const { about, services, projects } = await getData();
    return (
        <Suspense fallback={"Loading ..."}>
            <main>
                <HomeSection />
                <AboutSection data={about} />
                <ServicesSection data={services} />
                <PortfolioSection data={projects} />
            </main>
        </Suspense>
    );
}
