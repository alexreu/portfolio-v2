import { getDirectoryPath } from "../../modules/getDirectoryPath/getDirectoryPath";
import { promises } from "fs";
import { RessourceType } from "../../enums";
const handler = async (req, res) => {
    const jsonDir = getDirectoryPath("json");
    const projects = await promises.readFile(`${jsonDir}/${RessourceType.PROJECTS}.json`, "utf-8");
    res.status(200).json(projects);
};

export default handler;
