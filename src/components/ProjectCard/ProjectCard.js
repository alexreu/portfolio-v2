import React from "react";
import { Heading } from "../Heading";
import Image from "next/image";
import styles from "./ProjectCard.module.css";

export const ProjectCard = ({ title, subtitle, link, picture }) => {
    const { url, title: linkTitle } = link;
    return (
        <div className={`${styles.projectCard}`}>
            <Image src={picture} layout="fill" alt="" className={`${styles.projectCardPicture}`} />
            <div className={styles.projectCardContent}>
                <span className={styles.projectCardSubtitle}>{subtitle}</span>
                <Heading variant="h3" className={`${styles.projectCardTitle}`}>
                    {title}
                </Heading>
                <a href={url} className={styles.projectCardLink}>
                    {linkTitle}
                </a>
            </div>
        </div>
    );
};
