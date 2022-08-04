import { useState } from "react";
import Heading from "../heading/Heading";
import Button from "../button/Button";

const navTabsContent = [
  {
    id: 'skills',
    title: 'Compétences',
    content: [
      {
        title: 'Lorem ipsum dolor sit amet',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
      {
        title: 'Lorem ipsum dolor sit amet',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
      {
        title: 'Lorem ipsum dolor sit amet',
        description: 'lorem ipsum dolor sit amet consectetur',
      },
    ]
  },
  {
    id: 'experiencess',
    title: 'Expériences',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident iusto odio minus laborum pariatur, corporis sequi quam ad sit ipsum sint, nesciunt ullam exercitationem distinctio numquam iste excepturi eius eaque!'
  },
  {
    id: 'education',
    title: 'Formations',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident iusto odio minus laborum pariatur, corporis sequi quam ad sit ipsum sint, nesciunt ullam exercitationem distinctio numquam iste excepturi eius eaque!'
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
    <div>
      <ul className="flex items-center justify-evenly border-2 border-grey-light rounded-full">
        {navTabsContent.map(tab => (
          <li>
            <Button type="button" key={tab.id} id={tab.id} onClick={() => handleTabClick(tab.id)} style="px-4 py-2">
              {tab.title}
              </Button>
          </li>
        ))}
      </ul>
      <div>
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