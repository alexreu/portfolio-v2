import React from "react";
import styles from "./SocialLink.module.css";

export const SocialLink = ({ icon, url, title }) => {
    return (
        <>
            <a href={url} className={styles.socialLink} target="_blank" rel="noreferrer noopeneer">
                <i className={`bi bi-${icon} ${styles.socialLinkIcon}`}></i>
                <span className={styles.socialLinkContent}>{title}</span>
            </a>
        </>
    );
};