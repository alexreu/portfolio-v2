import { promises as fs } from "fs";
import { RessourceType } from "../../enums";
import { AboutData, ProjectsData, ServicesData } from "../../../app/page";

type SectionData = AboutData | ProjectsData | ServicesData;

export const getJsonContent = async (jsonDirectory: string, ressourceType: RessourceType): Promise<SectionData> => {
    try {
        const filePath = `${jsonDirectory}/${ressourceType}.json`;
        return JSON.parse(await fs.readFile(filePath, "utf-8"));
    } catch (e) {
        throw new Error(`Error reading or parsing JSON: ${e.message}`);
    }
};
