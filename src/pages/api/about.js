import { getDirectoryPath } from "../../modules/getDirectoryPath/getDirectoryPath";
import { promises as fs } from "fs";

export default async function handler(req, res) {
    const jsonDirectory = getDirectoryPath("json");
    const fileContent = await fs.readFile(`${jsonDirectory}/about.json`, "utf-8");

    res.status(200).json(fileContent);
}
