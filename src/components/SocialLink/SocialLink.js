import React from "react";
import styles from "./SocialLink.module.css";

export const SocialLink = ({ icon, url, title, isPage }) => {
    return (
        <>
            <a
                href={url}
                className={`${styles.socialLink} group`}
                {...(!isPage ? { target: "_blank", rel: "noreferrer noopeneer" } : {})}
            >
                <i className={`bi bi-${icon} ${styles.socialLinkIcon} dark:group-focus:text-primary`}></i>
                <span className={`${styles.socialLinkContent} dark:group-focus:text-primary`}>{title}</span>
            </a>
        </>
    );
};
