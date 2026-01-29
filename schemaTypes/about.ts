import { defineArrayMember, defineField, defineType } from "@sanity/types";

const about = defineType({
    name: "about",
    title: "Page à propos",
    type: "document",
    fields: [
        defineField({
            name: "title",
            readOnly: true,
            type: "string",
            hidden: true,
            initialValue: "À propos",
        }),
        {
            name: "presentation",
            title: "Présentation",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "Titre",
                    rows: 3,
                    type: "text",
                    validation: (rule) => rule.required(),
                },
                {
                    name: "description",
                    title: "Description",
                    type: "text",
                    rows: 7,
                    validation: (rule) => rule.required(),
                },
            ],
        },
        defineField({
            name: "experiences",
            title: "Experiences",
            type: "array",
            options: { layout: "tags" },
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        {
                            name: "isCurrentJob",
                            title: "Poste en cours ?",
                            type: "boolean",
                            initialValue: false,
                        },
                        {
                            name: "startYear",
                            title: "Année de début",
                            type: "number",
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: "endYear",
                            title: "Année de fin",
                            type: "number",
                            hidden: ({ parent }) => parent.isCurrentJob,
                        },
                        {
                            name: "job",
                            title: "Poste",
                            type: "string",
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: "company",
                            title: "Enterprise",
                            type: "string",
                            validation: (rule) => rule.required(),
                        },
                    ],
                }),
            ],
        }),
        defineField({
            name: "services",
            title: "What i do ?",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        {
                            name: "service",
                            title: "Service",
                            type: "string",
                            validation: (rule) => rule.required(),
                        },
                    ],
                }),
            ],
        }),
        defineField({
            name: "education",
            title: "Diplômes",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        {
                            name: "yearOfGraduation",
                            title: "Année d'obtention",
                            type: "number",
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: "graduationTitle",
                            title: "Nom du diplôme",
                            type: "string",
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: "trainingLocation",
                            title: "Lieu de la formation",
                            type: "string",
                            validation: (rule) => rule.required(),
                        },
                    ],
                }),
            ],
        }),
    ],
});

export default about;
