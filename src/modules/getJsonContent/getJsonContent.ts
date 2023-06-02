import { promises as fs } from "fs";

export const getJsonContent = async (jsonDirectory, ressourceType) => {
    const data = await fs.readFile(`${jsonDirectory}/${ressourceType}.json`, "utf-8");
    return JSON.parse(data);
};
