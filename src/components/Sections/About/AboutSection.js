import React from "react";
import Image from "next/image";
import { AboutTab } from "../../AboutTab";
import { Heading } from "../../Heading";
import { SectionSubtitle } from "../../SectionSubtitle";

export const AboutSection = ({ data }) => {
    return (
        <section id="about" className="bg-white dark:bg-primary-darkest py-[80px] lg:py-[120px]">
            <div className="container lg:grid grid-cols-12 items-baseline gap-x-12">
                <div className="col-span-5 relative rounded-lg overflow-hidden min-h-[300px] lg:min-h-[637px]">
                    <Image
                        src="/images/about-me.jpg"
                        className={"object-cover rounded-lg overflow-hidden"}
                        layout="fill"
                        alt=""
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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident iusto odio minus laborum
                        pariatur, corporis sequi quam ad sit ipsum sint, nesciunt ullam exercitationem distinctio
                        numquam iste excepturi eius eaque!
                    </p>
                    <AboutTab data={data} />
                </div>
            </div>
        </section>
    );
};
