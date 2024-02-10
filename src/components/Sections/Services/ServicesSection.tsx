"use client";
import React from "react";
import { SectionWrapper } from "../../SectionWrapper";
import { Heading } from "../../Heading";
import { SectionSubtitle } from "../../SectionSubtitle";
import { ServiceCard } from "../../ServiceCard";
import { Braces, Wallpaper, MousePointerSquare, TrendingUp, PersonStanding, BrainCircuit } from "lucide-react";

export const ServicesSection = () => {
    return (
        <SectionWrapper id="services">
            <div className="container text-center">
                <SectionSubtitle>Que puis-je faire pour vous ?</SectionSubtitle>
                <Heading
                    variant="h2"
                    className="mb-5 font-main text-[32px] font-semibold text-heading dark:text-white lg:text-[50px]"
                >
                    Mes services
                </Heading>
                <p className="text-lg text-gray dark:text-dark-body lg:px-[25%]">
                    Afin de répondre à tous vos besoins, voici les différents services que je vous propose pour la
                    réalisation de votre projet.
                </p>
                <ul className="mt-10 grid-cols-2 gap-8 md:grid lg:grid-cols-3 mdd:space-y-6">
                    <li>
                        <ServiceCard
                            icon={<Braces size={42} className="stroke-primary" />}
                            title="Développement front"
                            description="Création d'application web avec NextJs."
                        />
                    </li>
                    <li>
                        <ServiceCard
                            icon={<Wallpaper size={42} className="stroke-primary" />}
                            title="Intégration web"
                            description="Intégration web à partir de vos maquettes avec HTML / CSS / JavaScript."
                        />
                    </li>
                    <li>
                        <ServiceCard
                            icon={<MousePointerSquare size={42} className="stroke-primary" />}
                            title="Création de site vitrine"
                            description="Création de votre site vitrine avec NextJs / Headless CMS."
                        />
                    </li>
                    <li>
                        <ServiceCard
                            icon={<TrendingUp size={42} className="stroke-primary" />}
                            title="SEO & Référencement naturel"
                            description="Optimisation de la qualité de votre site web pour le référencement naturel."
                        />
                    </li>
                    <li>
                        <ServiceCard
                            icon={<PersonStanding size={42} className="stroke-primary" />}
                            title="Accessibilités"
                            description="Mise en place des bonnes pratiques pour un accès universel à votre site."
                        />
                    </li>
                    <li>
                        <ServiceCard
                            icon={<BrainCircuit size={42} className="stroke-primary" />}
                            title="Développement back"
                            description="Possibilités d'intervention sur le back-end de vos applications Javascript"
                        />
                    </li>
                </ul>
            </div>
        </SectionWrapper>
    );
};
