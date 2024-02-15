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
import Image from "next/image";
import Link from "next/link";
import { MoveUpRight } from "lucide-react";

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
            <main
                className="max-w-screen relative m-0 min-h-screen overflow-y-auto overflow-x-hidden p-0 before:absolute
                    before:-left-52 before:-top-52 before:z-10 before:h-[500px] before:w-[500px] before:rounded-full
                    before:bg-white before:opacity-20 before:blur-[200px] before:content-[''] after:absolute
                    after:-bottom-52 after:-right-52 after:z-10 after:h-[500px] after:w-[500px] after:rounded-full
                    after:bg-primary after:opacity-20 after:blur-[200px] after:content-['']"
            >
                <ParticlesContainer />
                <MousePointer />
                <section className="relative z-20 h-full w-full">
                    <div className="container p-28">
                        <header role="banner">
                            <nav
                                className="mb-5 flex w-full items-center justify-between rounded-xl bg-card px-8 py-3
                                    opacity-100 backdrop-blur-xl"
                            >
                                <Link href="#" className="font-bold text-primary">
                                    <Image src="/images/logo-text-white.png" alt="" width={110} height={100} />
                                </Link>
                                <ul className="flex h-full gap-5 font-main text-base font-medium leading-3 text-white">
                                    <li className="h-full">
                                        <Link
                                            href="/"
                                            className="transition-all duration-200 ease-in-out hover:text-primary"
                                        >
                                            Accueil
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/about"
                                            className="transition-all duration-200 ease-in-out hover:text-primary"
                                        >
                                            A propos
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/services"
                                            className="transition-all duration-200 ease-in-out hover:text-primary"
                                        >
                                            Services
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/pricing"
                                            className="transition-all duration-200 ease-in-out hover:text-primary"
                                        >
                                            Tarifs
                                        </Link>
                                    </li>
                                </ul>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-between gap-2 rounded-full bg-primary
                                        px-4 py-2 font-medium text-white transition-all duration-200 ease-in-out
                                        hover:bg-white hover:text-primary"
                                >
                                    Let's Talks
                                    <MoveUpRight size={18} strokeWidth={3} />
                                </Link>
                            </nav>
                        </header>
                        <Home />
                    </div>
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
