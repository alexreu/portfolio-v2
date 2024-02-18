import ressourceType from "../src/enums/ResourceType";
import { getDirectoryPath } from "../src/modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../src/modules/getJsonContent/getJsonContent";
import React from "react";
import { ParticlesContainer } from "@/components/particles-container";
import { MousePointer } from "@/components/mouse-pointer";
import { Home } from "@/components/home";
import { Navbar } from "@/components/navbar";

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
export default function Page() {
    // const { about, projects } = await getData();

    return (
        <>
            <main
                className="relative m-0 flex h-screen w-screen p-0 before:absolute before:-left-52 before:-top-52
                    before:z-10 before:h-[500px] before:w-[500px] before:rounded-full before:bg-white before:opacity-20
                    before:blur-[200px] before:content-[''] after:absolute after:-bottom-52 after:-right-52 after:z-10
                    after:h-[500px] after:w-[500px] after:rounded-full after:bg-primary after:opacity-20
                    after:blur-[200px] after:content-['']"
            >
                <ParticlesContainer />
                <MousePointer />

                <div className="container z-20 h-full py-20">
                    <Navbar />
                    <Home />
                </div>
            </main>
        </>
    );
}
