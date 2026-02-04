import { defineArrayMember, defineField, defineType } from "@sanity/types";
import { CircleDollarSign } from "lucide-react";

/**
 * Pricing Plan V2 - Pricing plans with categorized features
 */
const pricingPlanV2 = defineType({
    name: "pricingPlanV2",
    title: "Plans tarifaires (v2)",
    type: "document",
    icon: CircleDollarSign,
    fields: [
        defineField({
            name: "name",
            title: "Nom du plan",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "subtitle",
            title: "Sous-titre",
            type: "string",
            description: "Ex: Le meilleur rapport qualité/prix",
        }),
        defineField({
            name: "description",
            title: "Description courte",
            type: "string",
        }),
        defineField({
            name: "price",
            title: "Prix (€)",
            type: "number",
            validation: (rule) => rule.required().min(0),
        }),
        defineField({
            name: "monthlyFee",
            title: "Frais mensuels",
            type: "string",
            description: "Ex: + 40€/mois",
        }),
        defineField({
            name: "commitment",
            title: "Engagement",
            type: "string",
            description: "Ex: Sans engagement, Engagement 12 mois",
        }),
        defineField({
            name: "isPopular",
            title: "Plan recommandé ?",
            type: "boolean",
            initialValue: false,
            description: "Affiche le badge 'Recommandé'",
        }),
        defineField({
            name: "icon",
            title: "Icône",
            type: "string",
            options: {
                list: [
                    { title: "Layers (Template)", value: "Layers" },
                    { title: "Sparkles (Custom)", value: "Sparkles" },
                    { title: "Rocket (Business)", value: "Rocket" },
                    { title: "Zap (Performance)", value: "Zap" },
                    { title: "Crown (Premium)", value: "Crown" },
                ],
            },
        }),
        defineField({
            name: "featureCategories",
            title: "Catégories de fonctionnalités",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        {
                            name: "categoryName",
                            title: "Nom de la catégorie",
                            type: "string",
                            description: "Ex: Design, Technique, Support",
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: "items",
                            title: "Éléments",
                            type: "array",
                            of: [{ type: "string" }],
                            validation: (rule) => rule.min(1),
                        },
                    ],
                    preview: {
                        select: {
                            title: "categoryName",
                            items: "items",
                        },
                        prepare({ title, items }) {
                            return {
                                title: title,
                                subtitle: `${items?.length || 0} éléments`,
                            };
                        },
                    },
                }),
            ],
        }),
        defineField({
            name: "featureIcons",
            title: "Icônes de fonctionnalités",
            description: "Petites icônes affichées sous le prix",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        {
                            name: "icon",
                            title: "Icône",
                            type: "string",
                            options: {
                                list: [
                                    { title: "Layers", value: "Layers" },
                                    { title: "Code", value: "Code" },
                                    { title: "Sparkles", value: "Sparkles" },
                                    { title: "Palette", value: "Palette" },
                                    { title: "Zap", value: "Zap" },
                                    { title: "TrendingUp", value: "TrendingUp" },
                                    { title: "Rocket", value: "Rocket" },
                                    { title: "Database", value: "Database" },
                                    { title: "Shield", value: "Shield" },
                                    { title: "Headphones", value: "Headphones" },
                                ],
                            },
                        },
                        {
                            name: "label",
                            title: "Label",
                            type: "string",
                        },
                    ],
                }),
            ],
        }),
        defineField({
            name: "ctaText",
            title: "Texte du bouton",
            type: "string",
            initialValue: "En savoir plus",
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
            title: "name",
            price: "price",
            isPopular: "isPopular",
        },
        prepare({ title, price, isPopular }) {
            return {
                title: `${title}${isPopular ? " ⭐" : ""}`,
                subtitle: `${price}€`,
            };
        },
    },
});

export default pricingPlanV2;
