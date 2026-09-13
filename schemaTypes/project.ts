import { defineArrayMember, defineField, defineType } from "@sanity/types";
import { PanelsTopLeft } from "lucide-react";

export default defineType({
    name: "project",
    title: "Projets",
    type: "document",
    icon: PanelsTopLeft,
    fields: [
        defineField({
            name: "title",
            title: "Nom",
            type: "string",
            validation: (rule) => rule.required().max(60),
        }),
        defineField({
            name: "category",
            title: "Catégorie",
            type: "string",
            validation: (rule) => rule.required().max(70),
        }),
        defineField({
            name: "description",
            title: "Description courte",
            type: "text",
            rows: 3,
            validation: (rule) => rule.required().max(220),
        }),
        defineField({
            name: "url",
            title: "Adresse du site",
            type: "url",
            validation: (rule) => rule.required().uri({ scheme: ["https", "http"] }),
        }),
        defineField({
            name: "cover",
            title: "Aperçu du site",
            type: "image",
            description:
                "Capture horizontale, idéalement au format 16:10. Le haut de l’image est conservé.",
            fields: [
                defineField({
                    name: "alt",
                    title: "Texte alternatif",
                    type: "string",
                    validation: (rule) => rule.required(),
                }),
            ],
        }),
        defineField({
            name: "tags",
            title: "Technologies ou caractéristiques",
            type: "array",
            of: [defineArrayMember({ type: "string", validation: (rule) => rule.max(30) })],
            validation: (rule) => rule.max(4).unique(),
        }),
        defineField({
            name: "order",
            title: "Ordre d’affichage",
            type: "number",
            initialValue: 0,
            validation: (rule) => rule.required().integer().min(0),
        }),
        defineField({
            name: "archived",
            title: "Masquer ce projet",
            type: "boolean",
            initialValue: false,
        }),
    ],
    orderings: [
        {
            title: "Ordre d’affichage",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: { select: { title: "title", subtitle: "category", media: "cover" } },
});
