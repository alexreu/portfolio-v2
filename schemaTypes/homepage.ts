import { Home, Key } from "lucide-react";

const homepage = {
    name: "homepage",
    title: "Page d'accueil",
    type: "document",
    icon: Home,
    fields: [
        {
            name: "firstname",
            title: "Prénom",
            type: "string",
            validation: rule => rule.required(),
        },
        {
            name: "profileImage",
            title: "Photo de profil",
            type: "image",
            description: "Importer une photo de profil.",
            options: { hotspot: true },
            fields: [
                {
                    name: "alt",
                    title: "Alt",
                    type: "string",
                },
            ],
        },
        {
            name: "job",
            title: "Poste",
            type: "string",
        },
        {
            name: "keyFigures",
            title: "Chiffres clés",
            description: "Chiffres clés de l'activitée",
            icon: Key,
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "keyFigure", title: "Chiffre clé", type: "string" },
                        { name: "keyFigureDescription", title: "Description", type: "string" },
                    ],
                },
            ],
        },
    ],
};

export default homepage;
