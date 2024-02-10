import React, { FC, HTMLAttributes } from "react";
import { Heading } from "../Heading";
import Image from "next/image";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
    title: string;
    subtitle: string;
    link: { url: string; title: string };
    picture: string;
} & HTMLAttributes<HTMLLinkElement> &
    HTMLAttributes<HTMLAnchorElement>;

export const ProjectCard: FC<ProjectCardProps> = ({ title, subtitle, link, picture, ...props }) => {
    const { url, title: linkTitle } = link;
    const IMAGE_DIR_PREFIX = "/images/projects/";
    const IMAGE_EXTENSION = ".png";

    return (
        <a href={url} target="_blank" rel="noreferrer noopener" className="group" {...props}>
            <div
                className={`${styles.projectCard} flex items-center min-h-[500px] w-full relative z-0 p-10 overflow-hidden  transform 
                transition-all duration-300 ease-in-out group-hover:cursor-pointer group-hover:before:opacity-0 group-hover:after:opacity-100
                group-hover:scale-[1.05] group-hover:translate-x-0 group-hover:translate-y-0 group-focus:scale-[1.05] group-focus:translate-x-0 group-focus:translate-y-0
                group-focus:cursor-pointer group-focus:before:opacity-0 group-focus:after:opacity-100`}
            >
                <Image
                    src={`${IMAGE_DIR_PREFIX}${picture}${IMAGE_EXTENSION}`}
                    width={358}
                    height={500}
                    alt=""
                    className="absolute bottom-0 left-0 w-full h-full -z-[1] object-cover object-bottom"
                />
                <div className="flex flex-col justify-end items-start h-full relative z-10 mt-auto">
                    <span className="mb-4 text-white opacity-70 font-light text-base">{subtitle}</span>
                    <Heading variant="h3" className="mb-4 text-2xl text-left font-semibold text-white">
                        {title}
                    </Heading>
                    <button
                        type="button"
                        className="text-white text-sm px-6 py-2 tracking-wide rounded-lg border-2 border-white border-opacity-30
                        transform hover:-translate-y-2 hover:bg-primary transition-all duration-300 ease-in-out
                        hover:border-primary hover:shadow-lg focus:-translate-y-2 focus:bg-primary
                        focus:border-primary focus:shadow-lg dark:focus:bg-primary dark:focus:border-primary"
                    >
                        {linkTitle}
                        <i className="bi bi-box-arrow-up-right inline-flex items-center ml-2"></i>
                        <span className="sr-only">Ouvrir {title} dans un nouvel onglet</span>
                    </button>
                </div>
            </div>
        </a>
    );
};
