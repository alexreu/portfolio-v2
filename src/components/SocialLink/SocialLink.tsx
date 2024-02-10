import React, { cloneElement } from "react";

export const SocialLink = ({ icon, url, title, isPage }) => {
    return (
        <a
            href={url}
            className="transition-200 group inline-flex items-center gap-4 lg:gap-4"
            {...(!isPage ? { target: "_blank", rel: "noreferrer noopeneer" } : {})}
        >
            {cloneElement(icon, {
                size: 18,
                className:
                    "stroke-primary-light transform transition duration-200 group-hover:stroke-primary group-hover:translate-x-1 group-focus:text-primary group-focus:translate-x-1 dark:group-focus:stroke-primary",
            })}
            <span className="transition-200 transform text-sm tracking-tight text-primary-light group-hover:translate-x-1 group-hover:text-primary group-focus:translate-x-1 group-focus:text-primary dark:group-focus:text-primary lg:text-base">
                {title}
            </span>
        </a>
    );
};
