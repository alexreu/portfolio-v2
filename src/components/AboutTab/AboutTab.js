import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./AboutTab.module.css";
import { Button } from "../Button";
import { id } from "../../modules/idGenerator";

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
        const aboutTabContentHeight = aboutTabContent.current.getClientRects()[0].height;
        if (tabContentHeight !== aboutTabContentHeight || tabContentHeight === 210) {
            setDisplayShowMoreButton(aboutTabContentHeight >= 210);
            setTabContentHeight(aboutTabContentHeight);
        }
    }, [tabContent, tabContentHeight]);

    return (
        <div className="mt-7">
            <ul className={styles.tabList}>
                {navTabsContent.map(tab => (
                    <motion.li
                        key={tab.title}
                        className={`relative px-[13.5px] -my-px -mx-0.5 lg:px-6 py-3 lg:py-3 text-sm d ${
                            currentTab === tab.id && "text-white"
                        }`}
                    >
                        <button
                            type="button"
                            aria-controls="aboutTabContent"
                            onClick={() => handleTabClick(tab.id)}
                            key={tab.id}
                            id={tab.id}
                            className="relative z-[2] hover:cursor-pointer font-semibold ark:!text-white"
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
                <motion.ul
                    ref={aboutTabContent}
                    className={`${tabContentHeight >= 210 ? styles.folded : ""} ${styles.tabContent}`}
                    variants={tabContentVariants}
                    initial="fold"
                    animate={tabFold ? "fold" : "unFold"}
                    transition={{ duration: 0.8, type: "tween", ease: "circOut" }}
                >
                    {tabContent[0].content.map((content, index) => (
                        <li key={index} className="text-body dark:text-white text-base font-light">
                            <span className="block font-medium text-heading dark:text-dark-body">{content.title}</span>
                            {content.description}
                        </li>
                    ))}
                </motion.ul>
            </div>
            {displayShowMoreButton && (
                <div className={styles.showMoreWrapper}>
                    <Button
                        type="button"
                        style={`btn z-[2] mx-auto rounded-full p-2 bg-primary text-white border-primary transition-200 
                        hover:bg-white dark:hover:bg-background-dark-light hover:text-primary dark:hover:text-primary focus:bg-white dark:focus:bg-background-dark-light focus:text-primary`}
                        onClick={handleMoreButtonClick}
                    >
                        <i
                            className={`bi bi-chevron-down inline-flex transform ${
                                !tabFold && "-rotate-180"
                            } transition-200`}
                        ></i>
                        <span className="sr-only">Déplier</span>
                    </Button>
                </div>
            )}
        </div>
    );
};
