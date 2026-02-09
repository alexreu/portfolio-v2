import { defineField, defineType } from "@sanity/types";
import { Settings } from "lucide-react";

/**
 * Site Settings - Global configuration for the portfolio
 * Singleton document (only one instance)
 */
const siteSettings = defineType({
    name: "siteSettings",
    title: "Paramètres du site",
    type: "document",
    icon: Settings,
    fields: [
        defineField({
            name: "title",
            title: "Titre interne",
            type: "string",
            readOnly: true,
            hidden: true,
            initialValue: "Paramètres du site",
        }),
        // Hero Section
        defineField({
            name: "hero",
            title: "Section Hero",
            type: "object",
            fields: [
                {
                    name: "name",
                    title: "Prénom",
                    type: "string",
                    validation: (rule) => rule.required(),
                },
                {
                    name: "title",
                    title: "Titre principal",
                    type: "string",
                    description: "Ex: Développeur",
                    validation: (rule) => rule.required(),
                },
                {
                    name: "subtitle",
                    title: "Sous-titre",
                    type: "string",
                    description: "Ex: Front-end",
                    validation: (rule) => rule.required(),
                },
                {
                    name: "description",
                    title: "Description",
                    type: "text",
                    rows: 3,
                    validation: (rule) => rule.required(),
                },
                {
                    name: "availabilityText",
                    title: "Texte de disponibilité",
                    type: "string",
                    description: "Ex: Disponible pour de nouveaux projets",
                },
                {
                    name: "profileImage",
                    title: "Photo de profil",
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        {
                            name: "alt",
                            title: "Texte alternatif",
                            type: "string",
                        },
                    ],
                },
                {
                    name: "ctaPrimary",
                    title: "Bouton principal",
                    type: "object",
                    fields: [
                        { name: "text", title: "Texte", type: "string" },
                        { name: "href", title: "Lien", type: "string" },
                    ],
                },
                {
                    name: "ctaSecondary",
                    title: "Bouton secondaire",
                    type: "object",
                    fields: [
                        { name: "text", title: "Texte", type: "string" },
                        { name: "href", title: "Lien", type: "string" },
                    ],
                },
            ],
        }),
        // About Section
        defineField({
            name: "about",
            title: "Section À propos",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "Titre",
                    type: "string",
                    validation: (rule) => rule.required(),
                },
                {
                    name: "subtitle",
                    title: "Sous-titre",
                    type: "string",
                },
                {
                    name: "yearsExperience",
                    title: "Années d'expérience",
                    type: "number",
                },
                {
                    name: "approach",
                    title: "Mon approche",
                    type: "object",
                    fields: [
                        { name: "title", title: "Titre", type: "string" },
                        { name: "description", title: "Description", type: "text", rows: 4 },
                    ],
                },
                {
                    name: "targetAudience",
                    title: "Pour qui ?",
                    type: "object",
                    fields: [
                        { name: "title", title: "Titre", type: "string" },
                        { name: "description", title: "Description", type: "text", rows: 4 },
                    ],
                },
            ],
        }),
        // Contact Info
        defineField({
            name: "contact",
            title: "Informations de contact",
            type: "object",
            fields: [
                {
                    name: "email",
                    title: "Email",
                    type: "string",
                    validation: (rule) => rule.email(),
                },
                {
                    name: "phone",
                    title: "Téléphone",
                    type: "string",
                },
                {
                    name: "calendlyUrl",
                    title: "URL Calendly",
                    type: "url",
                },
                {
                    name: "whatsappUrl",
                    title: "URL WhatsApp",
                    type: "url",
                },
                {
                    name: "responseTime",
                    title: "Temps de réponse",
                    type: "string",
                    description: "Ex: Réponse garantie sous 24h",
                },
            ],
        }),
        // Social Links
        defineField({
            name: "socialLinks",
            title: "Réseaux sociaux",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "platform",
                            title: "Plateforme",
                            type: "string",
                            options: {
                                list: [
                                    { title: "GitHub", value: "github" },
                                    { title: "LinkedIn", value: "linkedin" },
                                    { title: "Twitter/X", value: "twitter" },
                                    { title: "Dribbble", value: "dribbble" },
                                ],
                            },
                        },
                        { name: "url", title: "URL", type: "url" },
                    ],
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Paramètres du site",
            };
        },
    },
});

export default siteSettings;
