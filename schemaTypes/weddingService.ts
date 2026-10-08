import { defineArrayMember, defineField, defineType } from "@sanity/types";
import { Heart } from "lucide-react";

/** A heading whose `emphasis` words (copied from the text) are set in italics. */
const headingField = (name: string, title: string) =>
    defineField({
        name,
        title,
        type: "object",
        options: { collapsible: false },
        fields: [
            defineField({
                name: "text",
                title: "Texte",
                type: "string",
                validation: (rule) => rule.required().max(120),
            }),
            defineField({
                name: "emphasis",
                title: "Mots en italique",
                description: "Copiez exactement les mots du titre à mettre en italique.",
                type: "string",
            }),
        ],
    });

const stringField = (name: string, title: string, max = 160) =>
    defineField({ name, title, type: "string", validation: (rule) => rule.required().max(max) });

const textField = (name: string, title: string, max = 400) =>
    defineField({
        name,
        title,
        type: "text",
        rows: 3,
        validation: (rule) => rule.required().max(max),
    });

const listOf = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
    defineField({
        name,
        title,
        type: "array",
        validation: (rule) => rule.required().min(1),
        of: [defineArrayMember({ type: "object", fields })],
    });

/** Eyebrow + heading + intro, shared by every section of the page. */
const sectionIntro = () => [
    stringField("eyebrow", "Surtitre", 60),
    headingField("heading", "Titre"),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
];

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
    defineField({ name, title, type: "object", fields: [...sectionIntro(), ...fields] });

export default defineType({
    name: "weddingService",
    title: "Sites de mariage",
    type: "document",
    icon: Heart,
    fields: [
        defineField({
            name: "hero",
            title: "En-tête",
            type: "object",
            fields: [
                headingField("heading", "Titre"),
                textField("lead", "Accroche"),
                listOf("facts", "Chiffres clés", [
                    stringField("value", "Valeur", 20),
                    stringField("label", "Libellé", 60),
                ]),
            ],
        }),
        section("moments", "L'expérience invité", [
            listOf("items", "Moments", [
                stringField("when", "Quand", 40),
                stringField("title", "Titre", 60),
                textField("text", "Texte", 200),
            ]),
        ]),
        defineField({
            name: "demo",
            title: "Projet démo",
            type: "object",
            fields: [
                stringField("couple", "Couple", 60),
                stringField("date", "Date et lieu", 100),
                textField("text", "Présentation", 300),
                defineField({
                    name: "highlights",
                    title: "Points forts",
                    type: "array",
                    of: [{ type: "string" }],
                    validation: (rule) => rule.required().min(1).max(6),
                }),
            ],
        }),
        section("features", "Fonctionnalités", [
            listOf("items", "Fonctionnalités", [
                stringField("title", "Titre", 60),
                textField("text", "Texte", 220),
                stringField("availability", "Formules concernées", 40),
            ]),
        ]),
        section("dashboard", "Tableau de bord", [
            listOf("points", "Points", [
                stringField("title", "Titre", 60),
                textField("text", "Texte", 200),
            ]),
        ]),
        section("steps", "Déroulé", [
            listOf("items", "Étapes", [
                stringField("title", "Titre", 60),
                textField("text", "Texte", 200),
                stringField("duration", "Durée", 30),
            ]),
        ]),
        section("pricing", "Tarifs", [
            listOf("plans", "Formules (dans l'ordre d'affichage)", [
                stringField("name", "Nom", 30),
                stringField("tagline", "Promesse", 120),
                defineField({
                    name: "price",
                    title: "Prix net (€)",
                    description:
                        "Micro-entreprise en franchise de TVA : prix sans TVA, sans « HT » ni « TTC ».",
                    type: "number",
                    validation: (rule) => rule.required().min(0),
                }),
                defineField({ name: "inherits", title: "Reprend la formule", type: "string" }),
                defineField({
                    name: "items",
                    title: "Ce qui est inclus",
                    type: "array",
                    of: [{ type: "string" }],
                    validation: (rule) => rule.required().min(1).max(10),
                }),
                stringField("delivery", "Délai", 80),
                defineField({
                    name: "featured",
                    title: "Mise en avant",
                    type: "boolean",
                    initialValue: false,
                }),
            ]),
            listOf("options", "Options", [
                stringField("label", "Option", 80),
                stringField("price", "Prix", 30),
            ]),
            textField("note", "Mention sous les tarifs", 300),
        ]),
        section("comparison", "Comparatif", [
            listOf("rows", "Lignes", [
                stringField("label", "Critère", 60),
                stringField("platforms", "Plateformes en ligne", 60),
                stringField("agency", "Agence", 60),
                stringField("us", "AlexDevLab", 60),
            ]),
        ]),
        section("about", "Qui suis-je", [
            defineField({
                name: "paragraphs",
                title: "Paragraphes",
                type: "array",
                of: [{ type: "text", rows: 3 }],
                validation: (rule) => rule.required().min(1).max(4),
            }),
            textField("promise", "Engagement mis en avant", 220),
            defineField({
                name: "photo",
                title: "Photo",
                type: "image",
                description:
                    "Portrait carré ou vertical, visage bien éclairé. Sans photo, celle du site reste affichée.",
                options: { hotspot: true },
                fields: [
                    defineField({
                        name: "alt",
                        title: "Texte alternatif",
                        type: "string",
                        validation: (rule) => rule.required(),
                    }),
                ],
            }),
            stringField("portfolioLabel", "Lien vers le portfolio", 60),
        ]),
        section("faq", "Questions fréquentes", [
            listOf("items", "Questions", [
                stringField("question", "Question", 140),
                textField("answer", "Réponse", 500),
            ]),
        ]),
    ],
    preview: { prepare: () => ({ title: "Sites de mariage" }) },
});
