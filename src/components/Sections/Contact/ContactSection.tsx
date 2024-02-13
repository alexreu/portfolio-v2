"use client";

import { SectionHead } from "../../SectionHead";
import { SectionWrapper } from "../../SectionWrapper";
// import { Input } from "../../../../components/ui/input";
// import { Textarea } from "../../../../@/components/ui/textarea";
import { Button } from "../../../../@/components/ui/button";
import { Input } from "antd";

const { TextArea } = Input;

export const ContactSection = () => {
    return (
        <SectionWrapper id="contact">
            <div className="container text-center">
                <SectionHead subtitle="Don't be afraid" title="Restons en contact"></SectionHead>
                <form>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-5 col-start-2 flex flex-col gap-5">
                            <Input placeholder="Nom" />
                            <Input placeholder="Prénom" />
                            <Input placeholder="Email" />
                        </div>
                        <div className="col-span-5">
                            <TextArea className="!h-full" />
                        </div>
                        <div className="col-span-2 col-start-10">
                            <Button type="submit" className="ml-auto">
                                Envoyer
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </SectionWrapper>
    );
};
