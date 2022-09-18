import React from "react";
import { Heading } from "../Heading";
import Image from "next/future/image";
import styles from "./ProjectCard.module.css";

export const ProjectCard = ({ title, subtitle, link, picture }) => {
    const { url, title: linkTitle } = link;
    const IMAGE_DIR_PREFIX = "/images/projects/";
    const IMAGE_EXTENSION = ".png";

    return (
        <a href={url} target="_blank" rel="noreferrer noopener" className="group">
            <div
                className={`${styles.projectCard} flex items-center min-h-[500px] w-full relative z-0 p-10 overflow-hidden rounded-lg transform 
                transition-all duration-300 ease-in-out group-hover:cursor-pointer group-hover:before:opacity-0 group-hover:after:opacity-100
                group-hover:scale-[1.08] group-hover:translate-x-0 group-hover:translate-y-0 group-focus:scale-[1.08] group-focus:translate-x-0 group-focus:translate-y-0
                group-focus:cursor-pointer group-focus:before:opacity-0 group-focus:after:opacity-100`}
            >
                <Image
                    src={`${IMAGE_DIR_PREFIX}${picture}${IMAGE_EXTENSION}`}
                    width={358}
                    height={500}
                    alt=""
                    className="absolute bottom-0 left-0 !h-full -z-[1] object-cover object-bottom"
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
