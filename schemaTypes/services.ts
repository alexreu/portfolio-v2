import { defineField, defineType } from "@sanity/types";

const services = defineType({
    name: "services",
    title: "Page services",
    type: "document",
    fields: [
        defineField({
            name: "serviceIllustration",
            title: "Illustration du service",
            type: "image",
            options: { hotspot: true },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "serviceTitle",
            title: "Titre du service",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "serviceDescription",
            title: "Description du service",
            type: "text",
            rows: 5,
            validation: (rule) => rule.required(),
        }),
    ],
});

export default services;
