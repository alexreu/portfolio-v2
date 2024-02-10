import { getDirectoryPath } from "../getDirectoryPath/getDirectoryPath";
import { promises } from "fs";
import { ResourceType } from "../../enums";
const handler = async (req, res) => {
    const jsonDir = getDirectoryPath("json");
    const projects = await promises.readFile(`${jsonDir}/${ResourceType.PROJECTS}.json`, "utf-8");
    res.status(200).json(projects);
};

export default handler;
