import React, { useState, useEffect, useRef } from "react";
import styles from "./AboutTab.module.css";
import { Button } from "../Button";

const navTabsContent = [
    {
        id: "skills",
        title: "Compétences",
        content: [
            {
                title: "Front End - Javascript",
                description: "jQuery, AlpineJs, ReactJs, NextJs",
            },
            {
                title: "Front End - CSS",
                description: "CSS3, SASS, Bootstrap, Tailwind",
            },
            {
                title: "Back End - PHP",
                description: "Laravel, Drupal",
            },
            {
                title: "Back End - Javascript",
                description: "NodeJs, ExpressJs",
            },
            {
                title: "Back End - Base de données",
                description: "Mysql, MongoDB",
            },
        ],
    },
    {
        id: "experiencess",
        title: "Expériences",
        content: [
            {
                title: "Simplon Prod - Développeur Front",
                description: "2018 - 2022",
            },
            {
                title: "Stage Colipays - Intégrateur",
                description: "2018",
            },
            {
                title: "Atout Pc's - Technicien informatique & réseau",
                description: "2015 - 2017",
            },
        ],
    },
    {
        id: "education",
        title: "Formations",
        content: [
            {
                title: "Bachelor CSI - niveau VI",
                description: "Concepteur de systèmes d'informations | 2019 - 2020",
            },
            {
                title: "DWWW - niveau V",
                description: "Developpeur Web & Web Mobile | 2018 - 2019",
            },
            {
                title: "Simplon Reunion - certification",
                description: "POEC Développeur Web | 2018",
            },
            {
                title: "CERT - niveau V",
                description: "Chargé d'Exploitation en Réseaux et Télécoms | 2015 - 2017",
            },
            {
                title: "Baccalauréat STI2D - niveau IV",
                description: "Spécialité ITEC: Innovation Technologique et Éco-Conception | 2014",
            },
        ],
    },
    {
        id: "other",
        title: "Autres",
        content: [
            {
                title: "Outils Collaboratifs",
                description: "Git, Github, Gitlab, Jira, Trello",
            },
            {
                title: "Langues",
                description: "Français - Anglais",
            },
            {
                title: "Soft Skills",
                description: "Communication, Curiosité, Persévérance, Investit",
            },
        ],
    },
];

export const AboutTab = () => {
    const aboutTabContent = useRef(null);

    const [currentTab, setCurrentTab] = useState("skills");
    const [tabContent, setTabContent] = useState(navTabsContent.filter(e => e.id === currentTab));
    const [displayShowMoreButton, setDisplayShowMoreButton] = useState(false);
    const [tabContentHeight, setTabContentHeight] = useState(210);

    const handleTabClick = tabId => {
        setCurrentTab(tabId);
        if (tabId !== currentTab) {
            setTabContent(navTabsContent.filter(e => e.id === tabId));
        }
    };

    const handleMoreButtonClick = () => {
        const {
            current: { classList },
        } = aboutTabContent;
        classList.toggle(styles.full);
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
            <ul className={styles.tabList} role="tablist">
                {navTabsContent.map((tab, index) => (
                    <li key={index}>
                        <a
                            key={tab.id}
                            id={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            aria-selected={currentTab === tab.id}
                            aria-controls="aboutTabContent"
                            className={`${
                                currentTab === tab.id ? "bg-primary text-white" : "text-grey dark:text-white"
                            } inline-block px-[13.5px] -my-px -mx-0.5 lg:px-6 py-2 lg:py-3 text-sm font-semibold rounded-full hover:cursor-pointer transition-200`}
                        >
                            {tab.title}
                        </a>
                    </li>
                ))}
            </ul>
            <ul
                ref={aboutTabContent}
                id="aboutTabContent"
                className={`${tabContentHeight >= 210 ? styles.folded : ""} ${styles.tabContent}`}
            >
                {tabContent[0].content.map((content, index) => (
                    <li key={index} className="text-body dark:text-white text-base font-light">
                        <span className="block font-medium text-heading dark:text-dark-body">{content.title}</span>
                        {content.description}
                    </li>
                ))}
            </ul>
            {displayShowMoreButton && (
                <div className={styles.showMoreWrapper}>
                    <Button
                        type="button"
                        style={`btn z-[2] mx-auto rounded-full p-2 bg-primary text-white border-primary`}
                        onClick={handleMoreButtonClick}
                    >
                        <i className={`bi bi-chevron-down inline-flex`}></i>
                    </Button>
                </div>
            )}
        </div>
    );
};
