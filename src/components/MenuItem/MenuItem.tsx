import React, { FC } from "react";
import Link from "next/link";

type Props = {
    anchor: string;
    label: string;
    scroll: boolean;
    isUnderline: boolean;
    onClick: () => void;
    pathName: string;
};

export const MenuItem = ({ anchor, label, scroll, isUnderline, onClick, pathName }: Props) => {
    const itemClasses = scroll
        ? "text-black dark:text-white"
        : `text-black dark:text-white ${pathName === "/" ? "xl:text-white" : "xl:text-black"}`;
    const linkClasses = isUnderline ? "before:xl:!w-full xl:text-primary" : "";

    return (
        <li
            key={anchor}
            id={`menuItem${anchor.charAt(0).toUpperCase() + anchor.slice(1)}`}
            className={`${itemClasses} xld:py-2 xld:w-full transition-200 duration-300 xld:border-b border-grey-light`}
        >
            <Link
                href={`/#${anchor}`}
                onClick={onClick}
                className={`${linkClasses} custom-underline inline-flex items-center h-full gap-x-4 font-medium text-base dark:hover:text-primary hover:text-primary 
            dark:focus:text-primary focus:text-primary`}
            >
                <span>{label}</span>
            </Link>
        </li>
    );
};
