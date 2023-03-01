import React from "react";
import Link from "next/link";

export const MenuItem = ({ anchor, label, scroll, isUnderline, onClick, pathName }) => {
    return (
        <li
            key={anchor}
            id={`menuItem${anchor.charAt(0).toUpperCase() + anchor.slice(1)}`}
            className={`${
                scroll
                    ? "text-black dark:text-white"
                    : `text-black dark:text-white ${pathName === "/" ? "xl:text-white" : "xl:text-black"}`
            } xld:py-2 xld:w-full transition-200 duration-300 xld:border-b border-grey-light`}
        >
            <Link href={`/#${anchor}`} onClick={onClick} className={`${
              isUnderline ? "before:xl:!w-full xl:text-primary" : ""
            } custom-underline inline-flex items-center h-full gap-x-4 font-medium text-base dark:hover:text-primary hover:text-primary 
            dark:focus:text-primary focus:text-primary`} >

                    <span>{label}</span>
            </Link>
        </li>
    );
};
