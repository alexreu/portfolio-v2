import React from "react";
import { SectionWrapper } from "../../SectionWrapper";
import { Heading } from "../../Heading";
import { SectionSubtitle } from "../../SectionSubtitle";

export const ServicesSection = () => {
    return (
        <SectionWrapper>
            <div className="container text-center">
                <SectionSubtitle>Que puis-je faire pour vous ?</SectionSubtitle>
                <Heading variant="h2" className="mb-5 text-[32px] lg:text-[50px] text-heading font-main font-semibold">
                    Mes incroyables services
                </Heading>
                <p className="px-[25%] text-lg text-gray">
                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                    alteration.
                </p>
            </div>
        </SectionWrapper>
    );
};
