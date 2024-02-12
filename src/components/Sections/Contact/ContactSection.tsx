import { SectionHead } from "../../SectionHead";
import { SectionWrapper } from "../../SectionWrapper";

export const ContactSection = () => {
    return (
        <SectionWrapper id="contact">
            <div className="container text-center">
                <SectionHead subtitle="Don't be afraid" title="Restons en contact"></SectionHead>
                <div>
                    <Input placeholder="name"/>
                </div>
            </div>
        </SectionWrapper>
    );
};
