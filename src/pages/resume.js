import { Resume } from "../components/Resume";
import ressourceType from "../enums/RessourceType";
import { getDirectoryPath } from "../modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../modules/getJsonContent/getJsonContent";

const resume = ({ about }) => <Resume data={about} />;

export async function getStaticProps() {
    const { ABOUT } = ressourceType;
    const jsonDirectory = getDirectoryPath("json");
    const aboutData = await getJsonContent(jsonDirectory, ABOUT);
    return {
        props: { ...aboutData },
    };
}

export default resume;
