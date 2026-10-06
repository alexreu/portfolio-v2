import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";

import { schemaTypes } from "./schemaTypes";

/** One document each: no create, no duplicate, opened directly from the menu. */
const singletons = ["maintenanceSection", "weddingService"];

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
                            (item) => !singletons.includes(item.getId() ?? ""),
                        ),
                        S.listItem()
                            .title("Maintenance")
                            .id("maintenanceSection")
                            .child(
                                S.document()
                                    .schemaType("maintenanceSection")
                                    .documentId("maintenanceSection"),
                            ),
                        S.listItem()
                            .title("Sites de mariage")
                            .id("weddingService")
                            .child(
                                S.document()
                                    .schemaType("weddingService")
                                    .documentId("weddingService"),
                            ),
                    ]),
        }),
        visionTool(),
    ],
    document: {
        newDocumentOptions: (options) =>
            options.filter((option) => !singletons.includes(option.templateId)),
        actions: (actions, context) =>
            singletons.includes(context.schemaType)
                ? actions.filter((action) => action.action !== "duplicate")
                : actions,
    },

    schema: {
        types: schemaTypes,
    },
});
