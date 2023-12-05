import React from "react";
import { AboutSection, HomeSection, PortfolioSection, ServicesSection } from "../components/Sections";
import { getDirectoryPath } from "../modules/getDirectoryPath/getDirectoryPath";
import ressourceType from "../enums/RessourceType";
import { getJsonContent } from "../modules/getJsonContent/getJsonContent";
import { Layout } from "../components/Layout";
import { getInitialTheme, ThemeProvider } from "../modules/theme";

type IndexProps = {
    about: { id: string; title: string; content: [{ title: string; description: string }] }[];
    services: { icon: string; title: string; description: string }[];
    projects: { title: string; subtitle: string; picture: string; link: { title: string; url: string } }[];
};

const Index = ({ about, services, projects }: IndexProps) => {
    return (
        <>
            <HomeSection />
            <AboutSection data={about} />
            <ServicesSection services={services} />
            <PortfolioSection projects={projects} />
        </>
    );
};

Index.getLayout = page => (
    <ThemeProvider initialTheme={getInitialTheme()}>
        <Layout title="Developpeur Front-End" className="mt-auto font-main">
            {page}
        </Layout>
    </ThemeProvider>
);

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
