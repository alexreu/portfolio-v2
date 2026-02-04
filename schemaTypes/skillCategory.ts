import { defineArrayMember, defineField, defineType } from "@sanity/types";
import { Wrench } from "lucide-react";

/**
 * Skill Category - Categories of skills with individual skills
 */
const skillCategory = defineType({
    name: "skillCategory",
    title: "Catégories de compétences",
    type: "document",
    icon: Wrench,
    fields: [
        defineField({
            name: "title",
            title: "Titre de la catégorie",
            type: "string",
            description: "Ex: Front-end & UI, Performance & Qualité",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "subtitle",
            title: "Sous-titre",
            type: "string",
            description: "Ex: Des interfaces qui convertissent et fidélisent",
        }),
        defineField({
            name: "icon",
            title: "Icône",
            type: "string",
            options: {
                list: [
                    { title: "Palette (UI)", value: "Palette" },
                    { title: "Zap (Performance)", value: "Zap" },
                    { title: "TrendingUp (SEO)", value: "TrendingUp" },
                    { title: "Wrench (Outils)", value: "Wrench" },
                    { title: "Code", value: "Code" },
                    { title: "Target", value: "Target" },
                    { title: "Shield", value: "Shield" },
                ],
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "theme",
            title: "Thème de couleur",
            type: "string",
            options: {
                list: [
                    { title: "Primary (Rouge)", value: "primary" },
                    { title: "Amber (Orange)", value: "amber" },
                    { title: "Emerald (Vert)", value: "emerald" },
                    { title: "Purple (Violet)", value: "purple" },
                ],
            },
            initialValue: "primary",
        }),
        defineField({
            name: "skills",
            title: "Compétences",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        {
                            name: "name",
                            title: "Nom",
                            type: "string",
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: "description",
                            title: "Description",
                            type: "string",
                        },
                        {
                            name: "emoji",
                            title: "Emoji",
                            type: "string",
                            description: "Ex: ⚛️, 📘, 🎨",
                        },
                    ],
                    preview: {
                        select: {
                            title: "name",
                            emoji: "emoji",
                        },
                        prepare({ title, emoji }) {
                            return {
                                title: `${emoji || "•"} ${title}`,
                            };
                        },
                    },
                }),
            ],
            validation: (rule) => rule.min(1),
        }),
        defineField({
            name: "order",
            title: "Ordre d'affichage",
            type: "number",
            initialValue: 0,
        }),
    ],
    orderings: [
        {
            title: "Ordre d'affichage",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            skills: "skills",
        },
        prepare({ title, skills }) {
            return {
                title: title,
                subtitle: `${skills?.length || 0} compétences`,
            };
        },
    },
});

export default skillCategory;
