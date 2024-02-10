import React from "react";
import styles from "./Resume.module.css";
import { Heading } from "../Heading";
import { Timeline } from "../Timeline";
import { GraduationCap, Layers, Cog } from "lucide-react";

const ResumeRightSide = ({ data }) => {
    return (
        <div className="my-auto flex w-3/5 flex-col print:my-0 print:justify-between print:py-10">
            <section className="flex flex-col">
                <div className={styles.resumeRightSideHeading}>
                    <Heading
                        variant="h2"
                        className="ml-6 w-full rounded-bl-lg rounded-tl-lg bg-dark-resume py-2 pl-4 uppercase text-white print:!bg-dark-resume"
                    >
                        diplômes
                    </Heading>
                    <GraduationCap size={40} className="ml-1 stroke-yellow-resume" />
                </div>
                <Timeline data={data.find(e => e.id === "education")} />
            </section>
            <section>
                <div className={styles.resumeRightSideHeading}>
                    <Heading
                        variant="h2"
                        className="ml-6 w-full rounded-bl-lg rounded-tl-lg bg-dark-resume py-2 pl-4 uppercase text-white"
                    >
                        expériences
                    </Heading>
                    <Layers size={40} className="ml-1 stroke-yellow-resume" />
                </div>
                <Timeline data={data.find(e => e.id === "experiences")} />
            </section>
            <section>
                <div className={styles.resumeRightSideHeading}>
                    <Heading
                        variant="h2"
                        className="ml-6 w-full rounded-bl-lg rounded-tl-lg bg-dark-resume py-2 pl-4 uppercase text-white"
                    >
                        competences
                    </Heading>
                    <Cog size={40} className="ml-1 stroke-yellow-resume" />
                </div>
                <Timeline data={data.find(e => e.id === "skills")} />
            </section>
        </div>
    );
};

export default ResumeRightSide;
