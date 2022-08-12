import { getDirectoryPath } from "../../modules/getDirectoryPath/getDirectoryPath";
import { promises } from "fs";
import { RessourceType } from "../../enums";

const handler = async (req, res) => {
    const jsonDir = getDirectoryPath("json");
    const services = await promises.readFile(`${jsonDir}/${RessourceType.SERVICES}.json`, "utf-8");
    res.status(200).json(services);
};

export default handler;
