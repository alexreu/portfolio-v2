import { useState } from "react";
import Button from "../Button/Button";

const navTabsContent = [
    {
        id: "skills",
        title: "Compétences",
        content: [
            {
                title: "Skill 1",
                description: "lorem ipsum dolor sit amet consectetur",
            },
            {
                title: "Skill 2",
                description: "lorem ipsum dolor sit amet consectetur",
            },
            {
                title: "Skill 3",
                description: "lorem ipsum dolor sit amet consectetur",
            },
        ],
    },
    {
        id: "experiencess",
        title: "Expériences",
        content: [
            {
                title: "Experience 1",
                description: "lorem ipsum dolor sit amet consectetur",
            },
            {
                title: "Experience 2",
                description: "lorem ipsum dolor sit amet consectetur",
            },
            {
                title: "Experience 3",
                description: "lorem ipsum dolor sit amet consectetur",
            },
        ],
    },
    {
        id: "education",
        title: "Formations & Certifications",
        content: [
            {
                title: "Formation 1",
                description: "lorem ipsum dolor sit amet consectetur",
            },
            {
                title: "Formation 2",
                description: "lorem ipsum dolor sit amet consectetur",
            },
            {
                title: "Formation 3",
                description: "lorem ipsum dolor sit amet consectetur",
            },
        ],
    },
];
function AboutTab() {
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
                            } inline-block px-[13.5px] -my-px -mx-0.5 lg:px-4 py-2 lg:py-3 text-sm font-semibold rounded-full hover:cursor-pointer transition-200`}
                        >
                            {tab.title}
                        </a>
                    </li>
                ))}
            </ul>
            <div id="aboutTabContent" className="pt-5">
                {tabContent[0].content.map(content => (
                    <>
                        <p>{content.title}</p>
                        <p>{content.description}</p>
                    </>
                ))}
            </div>
        </div>
    );
}

export default AboutTab;
