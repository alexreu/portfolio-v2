import { defineArrayMember, defineField, defineType } from "@sanity/types";
import { Briefcase } from "lucide-react";

/**
 * Service - Services offered with icon and features
 */
const service = defineType({
    name: "service",
    title: "Services",
    type: "document",
    icon: Briefcase,
    fields: [
        defineField({
            name: "title",
            title: "Titre du service",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            rows: 3,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "icon",
            title: "Icône",
            type: "string",
            description: "Nom de l'icône Lucide (ex: Code, Palette, Zap, TrendingUp)",
            options: {
                list: [
                    { title: "Code", value: "Code" },
                    { title: "Palette", value: "Palette" },
                    { title: "Zap (Performance)", value: "Zap" },
                    { title: "TrendingUp (SEO)", value: "TrendingUp" },
                    { title: "Layout", value: "Layout" },
                    { title: "Smartphone", value: "Smartphone" },
                    { title: "Search", value: "Search" },
                    { title: "Shield", value: "Shield" },
                ],
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "features",
            title: "Technologies / Features",
            type: "array",
            of: [
                defineArrayMember({
                    type: "string",
                }),
            ],
            validation: (rule) => rule.min(1).max(5),
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
            subtitle: "description",
        },
    },
});

export default service;
