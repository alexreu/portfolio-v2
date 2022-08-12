import React from "react";
import { SectionWrapper } from "../../SectionWrapper";
import { Heading } from "../../Heading";
import { SectionSubtitle } from "../../SectionSubtitle";
import { ServiceCard } from "../../ServiceCard";

export const ServicesSection = ({ data: { services = [] } }) => {
    return (
        <SectionWrapper id="services">
            <div className="container text-center">
                <SectionSubtitle>Que puis-je faire pour vous ?</SectionSubtitle>
                <Heading
                    variant="h2"
                    className="mb-5 text-[32px] lg:text-[50px] text-heading dark:text-white font-main font-semibold"
                >
                    Mes incroyables services
                </Heading>
                <p className="lg:px-[25%] text-lg text-gray dark:text-dark-body">
                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                    alteration.
                </p>
                <ul className="md:grid grid-cols-2 lg:grid-cols-3 gap-8 mdd:space-y-6 mt-10">
                    {services.map(({ icon, title, description }, index) => (
                        <li key={`${title}'-'${index}`}>
                            <ServiceCard icon={icon} title={title} description={description} />
                        </li>
                    ))}
                </ul>
            </div>
        </SectionWrapper>
    );
};
