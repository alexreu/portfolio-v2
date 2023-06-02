import React from "react";

export const SocialLink = ({ icon, url, title, isPage }) => {
    return (
        <>
            <a
                href={url}
                className="inline-flex items-center gap-4 lg:gap-8 transition-200 group"
                {...(!isPage ? { target: "_blank", rel: "noreferrer noopeneer" } : {})}
            >
                <i
                    className={`bi bi-${icon} inline-flex items-center text-primary-light text-xl transform transition-200 group-hover:text-primary group-hover:translate-x-1 group-focus:text-primary group-focus:translate-x-1 dark:group-focus:text-primary`}
                ></i>
                <span className="text-sm lg:text-base text-primary-light tracking-tight transform transition-200 group-hover:text-primary group-hover:translate-x-1 group-focus:text-primary group-focus:translate-x-1 dark:group-focus:text-primary">
                    {title}
                </span>
            </a>
        </>
    );
};
