import React, { FC, useState } from "react";
import { motion } from "framer-motion";
import { AboutTabItem } from "../AboutTabItem";

type AboutTabProps = {
    navTabsContent: { id: string; title: string; content: [{ title: string; description: string }] }[];
};

export const AboutTab: FC<AboutTabProps> = ({ navTabsContent }) => {
    const [currentTab, setCurrentTab] = useState("skills");
    const handleTabClick = (tabId: string) => {
        setCurrentTab(tabId);
    };

    const spring = {
        type: "spring",
        stiffness: 500,
        damping: 30,
    };

    return (
        <div className="mt-7">
            <ul
                className="flex items-center md:justify-between mdd:flex-wrap mdd:pb-2 font-main text-sm font-semibold
            md:border mdd:border-b border-border dark:border-border md:rounded-full"
            >
                {navTabsContent.map(tab => {
                    const { id, title } = tab;
                    return (
                        <motion.li key={id} className={`relative text-sm`}>
                            <button
                                type="button"
                                aria-controls={id}
                                onClick={() => handleTabClick(id)}
                                key={id}
                                id={id}
                                className={`relative z-[2] px-[13.5px] -my-px -mx-0.5 lg:px-6 py-3 lg:py-3 rounded-full transition-200
                                hover:cursor-pointer hover:text-primary dark:hover:text-primary font-semibold dark:text-white outline-0 focus:text-primary dark:focus:text-primary ${
                                    currentTab === id
                                        ? "text-white hover:text-tertiary dark:hover:text-tertiary dark:focus:text-white focus:text-white"
                                        : ""
                                }`}
                            >
                                {title}
                            </button>
                            {currentTab === id && (
                                <motion.div
                                    layoutId="background"
                                    transition={spring}
                                    className="absolute z-[1] w-full h-full top-0 left-0 right-0 rounded-full bg-primary"
                                />
                            )}
                        </motion.li>
                    );
                })}
            </ul>
            <div id={currentTab}>
                <AboutTabItem item={navTabsContent.filter(content => content.id === currentTab)} />
            </div>
        </div>
    );
};
