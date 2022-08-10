import React, { useEffect, useState, useMemo } from "react";

export const MenuItem = ({ anchor, label, scroll, isUnderline }) => {
    return (
        <li
            key={anchor}
            id={anchor}
            className={`${
                scroll ? "text-black dark:lg:text-white" : "text-black dark:text-white lg:text-white"
            } lgd:py-2 lgd:w-full transition-200 duration-300 dark:hover:text-primary hover:text-primary lgd:border-b border-grey-light`}
        >
            <a
                href={`#${anchor}`}
                className={`${
                    isUnderline ? "before:!w-full text-primary" : ""
                } custom-underline inline-flex items-center h-full gap-x-4 font-medium text-base`}
            >
                <span>{label}</span>
            </a>
        </li>
    );
};