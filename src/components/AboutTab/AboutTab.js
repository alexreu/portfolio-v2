import { useState } from "react";
import Heading from "../heading/Heading";
import Button from "../Button/Button";

const navTabsContent = [
  {
    id: 'skills',
    title: 'Compétences',
    content: [
      {
        title: 'Skill 1',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
      {
        title: 'Skill 2',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
      {
        title: 'Skill 3',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
    ]
  },
  {
    id: 'experiencess',
    title: 'Expériences',
    content: [
      {
        title: 'Experience 1',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
      {
        title: 'Experience 2',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
      {
        title: 'Experience 3',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
    ]
  },
  {
    id: 'education',
    title: 'Formations',
    content: [
      {
        title: 'Formation 1',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
      {
        title: 'Formation 2',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
      {
        title: 'Formation 3',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
    ]
  }
]
const AboutTab = () => {
  const [currentTab, setCurrentTab] = useState("skills");
  const [tabContent, setTabContent] = useState(navTabsContent.filter(e => e.id === currentTab));
  
  const handleTabClick = tabId => {
    setCurrentTab(tabId);
    setTabContent(navTabsContent.filter(e => e.id === tabId));
  }
  return (
    <div className="mt-7">
      <ul className="flex items-center md:justify-evenly font-main text-sm font-semibold border border-grey-light rounded-full">
        {navTabsContent.map(tab => (
          <li>
            <Button type="button" key={tab.id} id={tab.id} 
            onClick={() => handleTabClick(tab.id)} 
            style={`${currentTab === tab.id ? 'bg-primary text-white' : 'text-grey'} px-[13.5px] lg:px-5 py-2 lg:py-3 text-sm font-semibold rounded-full transition-200`}>
              {tab.title}
              </Button>
          </li>
        ))}
      </ul>
      <div id="aboutTabContent" className="pt-5">
        {tabContent[0]["content"].map(content => (
          <>
            <p>{content.title}</p>
            <p>{content.description}</p>
          </>
        ))}
      </div>
    </div>
  )
}

export default AboutTab;