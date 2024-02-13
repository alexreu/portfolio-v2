import ressourceType from "../src/enums/ResourceType";
import { getDirectoryPath } from "../src/modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../src/modules/getJsonContent/getJsonContent";
import { AboutSection, PortfolioSection, ServicesSection, HomeSection } from "../src/components/Sections";
import { Navbar } from "../src/components/Navbar";
import { Footer } from "../src/components/Footer";
import { BackToTop } from "../src/components/BackToTop";
import React from "react";
import { ParticlesContainer } from "@/components/particles-container";
import { MousePointer } from "@/components/mouse-pointer";
import { Home } from "@/components/home";

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
export default async function Page() {
    const { about, projects } = await getData();

    return (
        <>
            {/*<Navbar />*/}
            <main className="h-screen w-screen">
                <ParticlesContainer />
                <MousePointer />
                <section className="container relative z-40 flex h-full w-full items-center justify-center overflow-auto px-32 py-32">
                    <nav></nav>
                    <Home />
                </section>
                {/*<HomeSection />*/}
                {/*<AboutSection data={about} />*/}
                {/*<ServicesSection />*/}
                {/*<PortfolioSection data={projects} />*/}
            </main>
            {/*<Footer />*/}
            {/*<BackToTop />*/}
        </>
    );
}
