"use client";
import React, { FC } from "react";
import { SectionWrapper } from "../../SectionWrapper";
import { Heading } from "../../Heading";
import { SectionSubtitle } from "../../SectionSubtitle";
import { ServiceCard } from "../../ServiceCard";
import { id } from "../../../modules/idGenerator";

type ServicesSectionProps = {
    services: { icon: string; title: string; description: string }[];
};

export const ServicesSection: FC<ServicesSectionProps> = ({ services }) => {
    return (
        <SectionWrapper id="services">
            <div className="container text-center">
                <SectionSubtitle>Que puis-je faire pour vous ?</SectionSubtitle>
                <Heading
                    variant="h2"
                    className="mb-5 text-[32px] lg:text-[50px] text-heading dark:text-white font-main font-semibold"
                >
                    Mes services
                </Heading>
                <p className="lg:px-[25%] text-lg text-gray dark:text-dark-body">
                    Afin de répondre à tous vos besoins, voici les différents services que je vous propose pour la
                    réalisation de votre projet.
                </p>
                <ul className="md:grid grid-cols-2 lg:grid-cols-3 gap-8 mdd:space-y-6 mt-10">
                    {services.map(({ icon, title, description }) => (
                        <li key={id()}>
                            <ServiceCard icon={icon} title={title} description={description} />
                        </li>
                    ))}
                </ul>
            </div>
        </SectionWrapper>
    );
};
