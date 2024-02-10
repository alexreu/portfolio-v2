import path from "path";

export const getDirectoryPath = (directory: string): string => path.join(process.cwd(), directory);
