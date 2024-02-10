import { getDirectoryPath } from "../getDirectoryPath/getDirectoryPath";
import { promises as fs } from "fs";
import { ResourceType } from "../../enums";

const handler = async (req, res) => {
    const jsonDirectory = getDirectoryPath("json");
    const fileContent = await fs.readFile(`${jsonDirectory}/${ResourceType.ABOUT}.json`, "utf-8");
    res.status(200).json(fileContent);
};

export default handler;
