import { defineField, defineType } from "@sanity/types";

export default defineType({
    name: "maintenanceSection",
    title: "Maintenance",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Titre",
            type: "string",
            validation: (rule) => rule.required().max(100),
        }),
        defineField({
            name: "description",
            title: "Description courte",
            type: "text",
            rows: 2,
            validation: (rule) => rule.required().max(220),
        }),
        defineField({
            name: "plans",
            title: "Niveaux (dans l’ordre d’affichage)",
            type: "array",
            validation: (rule) => rule.required().length(3),
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "name",
                            title: "Nom",
                            type: "string",
                            validation: (rule) => rule.required().max(40),
                        }),
                        defineField({
                            name: "price",
                            title: "Prix mensuel (€)",
                            type: "number",
                            validation: (rule) => rule.required().positive(),
                        }),
                        defineField({
                            name: "summary",
                            title: "À qui s’adresse la formule ?",
                            type: "string",
                            validation: (rule) => rule.required().max(140),
                        }),
                        defineField({
                            name: "detailsIntro",
                            title: "Introduction du détail",
                            description: "Ex : Tout Essentiel, avec :",
                            type: "string",
                            validation: (rule) => rule.max(80),
                        }),
                        defineField({
                            name: "features",
                            title: "Prestations incluses",
                            type: "array",
                            of: [
                                {
                                    type: "string",
                                    validation: (rule) => rule.required().max(90),
                                },
                            ],
                            validation: (rule) => rule.required().min(1).max(8),
                        }),
                    ],
                },
            ],
        }),
        defineField({
            name: "footerNote",
            title: "Précisions communes",
            description: "Conditions affichées sous les trois formules.",
            type: "text",
            rows: 3,
            validation: (rule) => rule.required().max(360),
        }),
    ],
    preview: { select: { title: "title" } },
});
