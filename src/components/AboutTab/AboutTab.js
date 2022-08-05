import React, { useState } from "react";

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
                title: "BaccalauréatSTI2D - niveau IV",
                description: "Chargé d'Exploitation en Réseaux et Télécoms | 2015 - 2017",
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
    const [currentTab, setCurrentTab] = useState("skills");
    const [tabContent, setTabContent] = useState(navTabsContent.filter(e => e.id === currentTab));

    const handleTabClick = tabId => {
        setCurrentTab(tabId);
        setTabContent(navTabsContent.filter(e => e.id === tabId));
    };
    return (
        <div className="mt-7">
            <ul className="flex items-center md:justify-between font-main text-sm font-semibold border border-border dark:border-border-dark rounded-full">
                {navTabsContent.map((tab, index) => (
                    <li key={index}>
                        <a
                            key={tab.id}
                            id={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`${
                                currentTab === tab.id ? "bg-primary text-white" : "text-grey dark:text-white"
                            } inline-block px-[13.5px] -my-px -mx-0.5 lg:px-6 py-2 lg:py-3 text-sm font-semibold rounded-full hover:cursor-pointer transition-200`}
                        >
                            {tab.title}
                        </a>
                    </li>
                ))}
            </ul>
            <ul id="aboutTabContent" className="lg:h-[240px] pt-5 space-y-4 font-main">
                {tabContent[0].content.map((content, index) => (
                    <li key={index} className="text-body text-base font-light">
                        <span className="block font-medium text-heading">{content.title}</span>
                        {content.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};
