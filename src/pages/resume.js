import React, { useEffect, useState } from "react";
import { ResumeWrapper } from "../components/Resume";
import ressourceType from "../enums/RessourceType";
import { getDirectoryPath } from "../modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../modules/getJsonContent/getJsonContent";
import Layout from "../components/Layout/Layout";
import { Loader } from "../components/Loader";

const Resume = ({ about }) => {
    const [showResume, setShowResume] = useState(false);
    useEffect(() => {
        const checkWindowWidth = () => {
            if (window.innerWidth <= 1170) {
                setShowResume(false);
            } else {
                setShowResume(true);
            }
        };
        checkWindowWidth();
        window.addEventListener("resize", checkWindowWidth);
    }, []);

    return showResume ? <ResumeWrapper data={about} /> : <Loader />;
};

Resume.getLayout = page => (
    <Layout showNavbar={false} showFooter={false} title="Curriculum vitae">
        {page}
    </Layout>
);
export async function getStaticProps() {
    const { ABOUT } = ressourceType;
    const jsonDirectory = getDirectoryPath("json");
    const aboutData = await getJsonContent(jsonDirectory, ABOUT);
    return {
        props: { ...aboutData },
    };
}

export default Resume;
