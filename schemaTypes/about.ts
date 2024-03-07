import { defineArrayMember, defineField, defineType } from "@sanity/types";

const about = defineType({
    name: "About",
    title: "Page à propos",
    type: "document",
    fields: [
        defineField({
            name: "presentation",
            title: "Présentation",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        {
                            name: "title",
                            title: "Titre",
                            type: "text",
                            validation: rule => rule.required(),
                        },
                        {
                            name: "description",
                            title: "Description",
                            type: "array",
                            of: [{ type: "block" }],
                            validation: rule => rule.required(),
                        },
                    ],
                }),
            ],
        }),
        defineField({
            name: "experiences",
            title: "Experiences",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        {
                            name: "isCurrentJob",
                            title: "Poste en cours ?",
                            type: "boolean",
                            options: {
                                default: false,
                            },
                        },
                        {
                            name: "startYear",
                            title: "Année de début",
                            type: "date",
                            options: {
                                format: "YYYY",
                            },
                            validation: rule => rule.required(),
                        },
                        {
                            name: "endYear",
                            title: "Année de fin",
                            type: "date",
                            options: {
                                format: "YYYY",
                            },
                            hidden: ({ document }) => !!document?.isCurrentJob,
                        },
                    ],
                }),
            ],
        }),
    ],
});

export default about;
