import { SectionWrapper } from "../../SectionWrapper";
import { SectionHead } from "../../SectionHead";

export const PortfolioSection = () => {
    return (
        <SectionWrapper id={"porfolio"} type="dark">
            <div className="container text-center">
                <SectionHead title="Mes derniers projets" subtitle="Tous mes projets">
                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                    alteration.
                </SectionHead>
            </div>
        </SectionWrapper>
    );
};
