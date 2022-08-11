import path from "path";

export const getDirectoryPath = directory => path.join(process.cwd(), directory);
