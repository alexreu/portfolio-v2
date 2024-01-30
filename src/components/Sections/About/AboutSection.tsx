"use client";

import React from "react";
import Image from "next/image";
import { AboutTab } from "../../AboutTab";
import { Heading } from "../../Heading";
import { SectionSubtitle } from "../../SectionSubtitle";
import aboutMe from "../../../../public/images/about-me.jpg";

export type Props = {
    data: { id: string; title: string; content: [{ title: string; description: string }] }[];
};

export const AboutSection = ({ data }: Props) => {
    const experience = new Date().getFullYear() - 2019;
    return (
        <section id="about" className="bg-white dark:bg-primary-darkest py-[80px] lg:py-[120px]">
            <div className="container lg:grid grid-cols-12 gap-x-12">
                <div className="col-span-5 relative rounded-lg overflow-hidden min-h-[300px] lg:max-h-[691px]">
                    <Image
                        src={aboutMe}
                        className={"h-full object-cover object-left lgd:mx-auto rounded-lg overflow-hidden"}
                        alt=""
                        height={691}
                        width={446}
                    />
                </div>
                <div className="col-span-7 lgd:pt-10">
                    <SectionSubtitle>Mes informations personnelles</SectionSubtitle>
                    <Heading
                        variant="h2"
                        className="mb-7 text-[32px] lg:text-[50px] text-heading dark:text-white font-main font-semibold"
                    >
                        À propos de moi
                    </Heading>
                    <p className="text-gray dark:text-dark-body text-lg leading-8 font-light font-main">
                        Développeur front depuis {experience} ans spécialisé dans l’intégration web et la création
                        d’applications web avec ReactJs.
                        <br />
                        Je serais ravi de vous accompagner dans le développement de votre projet.
                        <br />
                        Je n’hésiterai pas à être force de proposition si nécessaire afin de vous aider dans la
                        réalisation de celui-ci. N’hésitez pas à me contacter, afin de discuter de votre projet, je
                        serais ravi de participer au développement de celui-ci !
                        <br />À bientôt
                        <span className="text-heading ml-2">👋</span>
                    </p>
                    <AboutTab navTabsContent={data} />
                </div>
            </div>
        </section>
    );
};
