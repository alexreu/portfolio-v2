import React from "react";
import { SectionWrapper } from "../../SectionWrapper";
import { SectionHead } from "../../SectionHead";
import { ProjectCard } from "../../ProjectCard";
import { id } from "../../../modules/idGenerator";

export const PortfolioSection = ({ projects }) => {
    return (
        <SectionWrapper id="portfolio" type="dark">
            <div className="container text-center">
                <SectionHead title="Mes derniers projets" subtitle="Tous mes projets">
                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                    alteration.
                </SectionHead>
                <ul className="md:grid grid-cols-2 lg:grid-cols-3 gap-8 mdd:space-y-6 mt-10">
                    {projects.map(project => {
                        const { title, subtitle, picture, link } = project;
                        return (
                            <li key={id()}>
                                <ProjectCard title={title} subtitle={subtitle} picture={picture} link={link} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </SectionWrapper>
    );
};
