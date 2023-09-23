import { promises as fs } from "fs";
import { RessourceType } from "../../enums";

export const getJsonContent = async (
    jsonDirectory: string,
    ressourceType: RessourceType,
): Promise<{ [key: string]: JSON }> => {
    const data: string = await fs.readFile(`${jsonDirectory}/${ressourceType}.json`, "utf-8");
    return JSON.parse(data);
};
