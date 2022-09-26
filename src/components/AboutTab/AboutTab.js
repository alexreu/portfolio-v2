import React, { useState } from "react";
import { motion } from "framer-motion";
import { AboutTabItem } from "../AboutTabItem";

export const AboutTab = ({ navTabsContent }) => {
    const [currentTab, setCurrentTab] = useState("skills");

    const handleTabClick = tabId => {
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
                        <motion.li key={id} className={`relative text-sm ${currentTab === id && "text-white"}`}>
                            <button
                                type="button"
                                aria-controls={id}
                                onClick={() => handleTabClick(id)}
                                key={id}
                                id={id}
                                className="relative z-[2] px-[13.5px] -my-px -mx-0.5 lg:px-6 py-3 lg:py-3 hover:cursor-pointer font-semibold dark:!text-white"
                            >
                                {title}
                            </button>
                            {currentTab === id ? (
                                <motion.div
                                    layoutId="background"
                                    transition={spring}
                                    className="absolute z-[1] w-full h-full top-0 left-0 right-0 rounded-full bg-primary"
                                />
                            ) : null}
                        </motion.li>
                    );
                })}
            </ul>
            <div id={currentTab}>
                <AboutTabItem item={navTabsContent.filter(e => e.id === currentTab)} />
            </div>
        </div>
    );
};
