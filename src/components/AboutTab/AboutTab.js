import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./AboutTab.module.css";
import { AboutTabItem } from "../AboutTabItem";

export const AboutTab = ({ navTabsContent }) => {
    const aboutTabContent = useRef(null);
    const [currentTab, setCurrentTab] = useState("skills");
    const [tabContent, setTabContent] = useState(navTabsContent.filter(e => e.id === currentTab));
    const [displayShowMoreButton, setDisplayShowMoreButton] = useState(false);
    const [tabContentHeight, setTabContentHeight] = useState(210);
    const [tabFold, setTabFold] = useState(true);

    const handleTabClick = tabId => {
        setCurrentTab(tabId);
        if (tabId !== currentTab) {
            setTabContent(navTabsContent.filter(e => e.id === tabId));
        }
    };

    const handleMoreButtonClick = () => {
        setTabFold(!tabFold);
    };
    const tabContentVariants = {
        fold: { maxHeight: 210 },
        unFold: { maxHeight: 400 },
    };

    const tabControlVariants = {
        selected: { backgroundColor: "#FD4766", color: "#FFFFFF" },
        unSelected: { color: "rgba(29,29,36,.75)" },
    };

    const spring = {
        type: "spring",
        stiffness: 500,
        damping: 30,
    };

    useEffect(() => {
        // const aboutTabContentHeight = aboutTabContent.current.getClientRects()[0].height;
        // if (tabContentHeight !== aboutTabContentHeight || tabContentHeight === 210) {
        //     setDisplayShowMoreButton(aboutTabContentHeight >= 210);
        //     setTabContentHeight(aboutTabContentHeight);
        // }
    }, [tabContent, tabContentHeight]);

    return (
        <div className="mt-7">
            <ul className={styles.tabList}>
                {navTabsContent.map(tab => (
                    <motion.li key={tab.title} className={`relative text-sm ${currentTab === tab.id && "text-white"}`}>
                        <button
                            type="button"
                            aria-controls="aboutTabContent"
                            onClick={() => handleTabClick(tab.id)}
                            key={tab.id}
                            id={tab.id}
                            className="relative z-[2] px-[13.5px] -my-px -mx-0.5 lg:px-6 py-3 lg:py-3 hover:cursor-pointer font-semibold dark:!text-white"
                        >
                            {tab.title}
                        </button>
                        {currentTab === tab.id ? (
                            <motion.div
                                layoutId="underline"
                                transition={spring}
                                className="absolute z-[1] w-full h-full top-0 left-0 right-0 rounded-full bg-primary"
                            />
                        ) : null}
                    </motion.li>
                ))}
            </ul>
            <div id="aboutTabContent">
                <AboutTabItem item={navTabsContent.filter(e => e.id === currentTab)} />
            </div>
        </div>
    );
};
