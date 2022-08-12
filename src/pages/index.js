import React, { useState, useEffect } from "react";
import { AboutSection, HomeSection, PortfolioSection, ServicesSection } from "../components/Sections";
import { fetcher } from "../modules/fetcher";
import { Loader } from "../components/Loader";
import { RessourceType } from "../enums";

const Index = () => {
    const { ABOUT, SERVICES, PROJECTS } = RessourceType;
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [datas, setDatas] = useState(null);

    const getAllData = async () => {
        return await Promise.all([fetcher(`/api/${ABOUT}`), fetcher(`/api/${SERVICES}`), fetcher(`/api/${PROJECTS}`)]);
    };

    useEffect(() => {
        setIsLoading(true);
        try {
            getAllData().then(res => {
                res.forEach(data => {
                    const [currentKey] = Object.keys(data);
                    setDatas(prevState => ({ ...prevState, [currentKey]: data[currentKey] }));
                });
                setIsLoading(false);
            });
        } catch (e) {
            setIsLoading(false);
            setIsError(true);
            console.log(e);
        }
    }, []);

    if (isLoading) return <Loader />;

    return (
        <>
            <HomeSection />
            <AboutSection data={datas.about} />
            <ServicesSection services={datas.services} />
            <PortfolioSection projects={datas.projects} />
        </>
    );
};

export default Index;
