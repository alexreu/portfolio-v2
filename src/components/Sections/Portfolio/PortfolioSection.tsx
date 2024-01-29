"use client";

import React, { FC } from "react";
import { SectionWrapper } from "../../SectionWrapper";
import { SectionHead } from "../../SectionHead";
import { ProjectCard } from "../../ProjectCard";
import { id } from "../../../modules/idGenerator";

export type PortfolioSectionProps = {
    projects: { title: string; subtitle: string; picture: string; link: { title: string; url: string } }[];
};

export const PortfolioSection: FC<PortfolioSectionProps> = ({ projects }) => {
    return (
        <SectionWrapper id="portfolio" type="dark">
            <div className="container text-center">
                <SectionHead title="Mes derniers projets" subtitle="Tous mes projets">
                    Retrouvez les projets les plus récents sur lesquels j&apos;ai eu l&apos;opportunité de travailler
                    durant ces dernières années.
                </SectionHead>
                <ul className="md:grid grid-cols-2 lg:grid-cols-3 gap-8 mdd:space-y-8 mt-10">
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
