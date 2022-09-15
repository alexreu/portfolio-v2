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
        // const {
        //     current: { classList },
        // } = aboutTabContent;
        // classList.toggle(styles.full);
        setTabFold(!tabFold);
    };
    const variants = {
        fold: { maxHeight: 210 },
        unFold: { maxHeight: 400 },
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
                    <li key={id()}>
                        <Button
                            type="button"
                            key={tab.id}
                            id={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            aria-controls="aboutTabContent"
                            className={`${
                                currentTab === tab.id ? "bg-primary text-white" : "text-grey dark:text-white"
                            } inline-block px-[13.5px] -my-px -mx-0.5 lg:px-6 py-2 lg:py-3 text-sm font-semibold rounded-full hover:cursor-pointer transition-200`}
                        >
                            {tab.title}
                        </Button>
                    </li>
                ))}
            </ul>
            <div id="aboutTabContent">
                <motion.ul
                    ref={aboutTabContent}
                    className={`${tabContentHeight >= 210 ? styles.folded : ""} ${styles.tabContent}`}
                    variants={variants}
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
                        style={`btn z-[2] mx-auto rounded-full p-2 bg-primary text-white border-primary`}
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
