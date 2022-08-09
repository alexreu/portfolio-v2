import React from "react";
import { SectionWrapper } from "../../SectionWrapper";
import { SectionHead } from "../../SectionHead";
import { ProjectCard } from "../../ProjectCard";
import { id } from "../../../modules/idGenerator";

const projectsContent = [
    {
        id: id(),
        title: "Website title",
        subtitle: "Development",
        picture: "/images/projects/project-1.jpeg",
        link: {
            title: "Voir le site",
            url: "#",
        },
    },
    {
        id: id(),
        title: "Website title",
        subtitle: "Development",
        picture: "/images/projects/project-2.jpeg",
        link: {
            title: "Voir le site",
            url: "#",
        },
    },
    {
        id: id(),
        title: "Website title",
        subtitle: "Development",
        picture: "/images/projects/project-3.jpeg",
        link: {
            title: "Voir le site",
            url: "#",
        },
    },
    {
        id: id(),
        title: "Website title",
        subtitle: "Development",
        picture: "/images/projects/project-1.jpeg",
        link: {
            title: "Voir le site",
            url: "#",
        },
    },
    {
        id: id(),
        title: "Website title",
        subtitle: "Development",
        picture: "/images/projects/project-2.jpeg",
        link: {
            title: "Voir le site",
            url: "#",
        },
    },
    {
        id: id(),
        title: "Website title",
        subtitle: "Development",
        picture: "/images/projects/project-3.jpeg",
        link: {
            title: "Voir le site",
            url: "#",
        },
    },
];

export const PortfolioSection = () => {
    return (
        <SectionWrapper id="portfolio" type="dark">
            <div className="container text-center">
                <SectionHead title="Mes derniers projets" subtitle="Tous mes projets">
                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                    alteration.
                </SectionHead>
                <ul className="md:grid grid-cols-2 lg:grid-cols-3 gap-8 mdd:space-y-6 mt-10">
                    {projectsContent.map(project => {
                        const { id, title, subtitle, picture, link } = project;
                        console.log(id);
                        return (
                            <li key={id}>
                                <ProjectCard title={title} subtitle={subtitle} picture={picture} link={link} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </SectionWrapper>
    );
};
