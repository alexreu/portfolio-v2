import { getDirectoryPath } from "../../modules/getDirectoryPath/getDirectoryPath";
import { promises as fs } from "fs";
import { RessourceType } from "../../enums";

const handler = async (req, res) => {
    const jsonDirectory = getDirectoryPath("json");
    const fileContent = await fs.readFile(`${jsonDirectory}/${RessourceType.ABOUT}.json`, "utf-8");
    res.status(200).json(fileContent);
};

export default handler;
