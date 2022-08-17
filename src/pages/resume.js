import React from "react";
import { ResumeWrapper } from "../components/Resume";
import ressourceType from "../enums/RessourceType";
import { getDirectoryPath } from "../modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../modules/getJsonContent/getJsonContent";
import Layout from "../components/Layout/Layout";

const Resume = ({ about }) => <ResumeWrapper data={about} />;

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
