import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Heading } from "../Heading";
import Image from "next/future/image";
import styles from "./ProjectCard.module.css";

export const ProjectCard = ({ title, subtitle, link, picture }) => {
    const { url, title: linkTitle } = link;
    const IMAGE_DIR_PREFIX = "/images/projects/";
    const IMAGE_EXTENSION = ".png";
    const linkRef = useRef(null);
    const buttonRef = useRef(null);

    const handleFocus = () => {
        if (document.activeElement === linkRef.current) {
            buttonRef.current.focus();
        }
    };

    return (
        <a href={url} target="_blank" rel="noreferrer noopener" ref={linkRef} onFocus={handleFocus}>
            <motion.div
                whileHover={{
                    translateZ: 0,
                    scale: 1.08,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 40, duration: 0.3 }}
                className={`${styles.projectCard}`}
            >
                <Image
                    src={`${IMAGE_DIR_PREFIX}${picture}${IMAGE_EXTENSION}`}
                    width={380}
                    height={560}
                    alt=""
                    priority={true}
                    className={`${styles.projectCardPicture}`}
                />
                <div className={styles.projectCardContent}>
                    <span className={styles.projectCardSubtitle}>{subtitle}</span>
                    <Heading variant="h3" className={`${styles.projectCardTitle}`}>
                        {title}
                    </Heading>
                    <button
                        ref={buttonRef}
                        type="button"
                        className={`${styles.projectCardLink} dark:focus:bg-primary dark:focus:border-primary `}
                    >
                        {linkTitle}
                        <i className="bi bi-box-arrow-up-right inline-flex items-center ml-2"></i>
                        <span className="sr-only">Ouvrir {title} dans un nouvel onglet</span>
                    </button>
                </div>
            </motion.div>
        </a>
    );
};
