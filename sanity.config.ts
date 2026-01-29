import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemaTypes";

export default defineConfig({
    name: "portfolio-studio",
    title: "portfolio-studio",

    basePath: "/studio",

    projectId: "qh2sxz0g",
    dataset: "production",

    plugins: [structureTool(), visionTool()],

    schema: {
        types: schemaTypes,
    },
});
