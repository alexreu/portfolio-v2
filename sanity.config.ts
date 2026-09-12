import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";

import { schemaTypes } from "./schemaTypes";

export default defineConfig({
    name: "portfolio-studio",
    title: "portfolio-studio",

    basePath: "/studio",

    projectId: "qh2sxz0g",
    dataset: "production",

    plugins: [
        structureTool({
            structure: (S: StructureBuilder) =>
                S.list()
                    .title("Contenu")
                    .items([
                        ...S.documentTypeListItems().filter(
                            (item) => item.getId() !== "maintenanceSection",
                        ),
                        S.listItem()
                            .title("Maintenance")
                            .id("maintenanceSection")
                            .child(
                                S.document()
                                    .schemaType("maintenanceSection")
                                    .documentId("maintenanceSection"),
                            ),
                    ]),
        }),
        visionTool(),
    ],
    document: {
        newDocumentOptions: (options) =>
            options.filter((option) => option.templateId !== "maintenanceSection"),
        actions: (actions, context) =>
            context.schemaType === "maintenanceSection"
                ? actions.filter((action) => action.action !== "duplicate")
                : actions,
    },

    schema: {
        types: schemaTypes,
    },
});
