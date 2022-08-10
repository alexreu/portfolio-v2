import React from "react";
import styles from "./SocialIcon.module.css";

export const SocialIcon = ({ icon, url, title, isBlank }) => {
    return (
        <a
            href={url}
            target={isBlank ? "_blank" : ""}
            title={title}
            className={styles.socialLink}
            rel="noreferrer noopeneer"
        >
            <i className={`bi bi-${icon} ${styles.socialLinkIcon}`}></i>
        </a>
    );
};
