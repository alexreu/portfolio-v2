import { defineArrayMember, defineField, defineType } from "@sanity/types";
import { CircleDollarSign } from "lucide-react";

/**
 * Pricing Plan - Pricing plans with categorized features
 */
const pricingPlan = defineType({
    name: "pricingPlan",
    title: "Plans tarifaires",
    type: "document",
    icon: CircleDollarSign,
    fields: [
        defineField({
            name: "archived",
            title: "Archiver cette offre",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "highlights",
            title: "Points visibles sur la carte",
            description:
                "8 points courts maximum. Les détails restent dans les catégories ci-dessous.",
            type: "array",
            of: [{ type: "string", validation: (rule) => rule.required().max(65) }],
            validation: (rule) => rule.required().min(1).max(8),
        }),
        defineField({
            name: "contextLabel",
            title: "Libellé du contexte",
            type: "string",
            initialValue: "Options",
            validation: (rule) => rule.required().max(20),
        }),
        defineField({
            name: "context",
            title: "Options ou contexte",
            type: "string",
            validation: (rule) => rule.required().max(160),
        }),
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
            validation: (rule) => rule.required().max(90),
        }),
        defineField({
            name: "description",
            title: "Description courte",
            type: "string",
            validation: (rule) => rule.required().max(180),
        }),
        defineField({
            name: "priceType",
            title: "Type de prix",
            type: "string",
            options: {
                list: [
                    { title: "Montant fixe", value: "fixed" },
                    { title: "Texte libre (ex: Sur devis)", value: "custom" },
                ],
                layout: "radio",
            },
            initialValue: "fixed",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "price",
            title: "Prix (€)",
            type: "number",
            validation: (rule) =>
                rule
                    .min(0)
                    .custom((value, context) =>
                        context.document?.priceType === "fixed" && typeof value !== "number"
                            ? "Un montant est requis pour un prix fixe."
                            : true,
                    ),
            hidden: ({ parent }) => parent?.priceType !== "fixed",
        }),
        defineField({
            name: "priceCustom",
            title: "Prix (texte)",
            type: "string",
            description: "Ex: Sur devis",
            hidden: ({ parent }) => parent?.priceType !== "custom",
        }),
        defineField({
            name: "startingFrom",
            title: "Afficher « À partir de »",
            type: "boolean",
            initialValue: false,
            description: "Affiche la mention « À partir de » avant le prix",
        }),
        defineField({
            name: "minimumBudget",
            title: "Budget minimum conseillé",
            type: "string",
            description: "Ex: 6 000 € HT",
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
            title: "Détails de l’offre (accordéon)",
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
            initialValue: "Parler de mon projet",
            validation: (rule) => rule.required().max(50),
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
            priceType: "priceType",
            price: "price",
            priceCustom: "priceCustom",
            isPopular: "isPopular",
        },
        prepare({ title, priceType, price, priceCustom, isPopular }) {
            const displayPrice = priceType === "custom" ? priceCustom || "Sur devis" : `${price}€`;
            return {
                title: `${title}${isPopular ? " ⭐" : ""}`,
                subtitle: displayPrice,
            };
        },
    },
});

export default pricingPlan;
