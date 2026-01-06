import { Rule } from "@sanity/types";
import { CircleDollarSign } from "lucide-react";

const pricing = {
    name: "pricing",
    title: "Page tarifs",
    type: "document",
    icon: CircleDollarSign,
    fields: [
        {
            name: "offerTitle",
            title: "Titre de l'offre",
            type: "string",
            validation: (rule: Rule) => rule.required(),
        },
        {
            name: "fixedPrice",
            title: "Tarif fixe",
            type: "number",
        },
        {
            name: "monthlyPrice",
            title: "Tarif mensuel",
            type: "number",
        },
        {
            name: "isOfferCustom",
            title: "Offre custom ?",
            type: "boolean",
            initialValue: false,
        },
        {
            name: "offerContent",
            title: "Contenu de l'offre",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "offerContentItem",
                            title: "Item",
                            type: "string",
                            validation: (rule: Rule) => rule.required(),
                        },
                    ],
                },
            ],
        },
    ],
};

export default pricing;
