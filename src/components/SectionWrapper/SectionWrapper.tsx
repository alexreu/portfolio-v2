import React, { FC, HTMLAttributes } from "react";

type SectionWrapper = {
    type?: "dark";
    className?: string;
    id: string;
} & HTMLAttributes<HTMLElement>;

export const SectionWrapper: FC<SectionWrapper> = ({ type, className, id, children }) => {
    const sectionColor =
        type === "dark" ? "bg-white dark:bg-primary-darkest" : "bg-background-light dark:bg-background-dark-light";
    return (
        <section id={id} className={`py-20 lg:py-28 ${sectionColor} ${className}`}>
            {children}
        </section>
    );
};
