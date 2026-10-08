/** The formula a dashboard section comes with, shown on the demo, which plays the Signature one. */
export type SectionPlan = {
    /** The first formula that includes it. */
    from: "Essentiel" | "Signature";
    /** What the couple reads beside the section. */
    note: string;
};

const plans: Readonly<Record<string, SectionPlan>> = {
    relances: { from: "Essentiel", note: "Dès Essentiel" },
    galerie: { from: "Essentiel", note: "Dès Essentiel · option Intime" },
    questions: { from: "Essentiel", note: "Dès Essentiel · option Intime" },
    "faire-part-pdf": { from: "Essentiel", note: "Dès Essentiel · option Intime" },
    "qr-foyer": { from: "Signature", note: "Signature · option Intime et Essentiel" },
    "plan-de-table": { from: "Signature", note: "Signature · option Essentiel" },
    acces: { from: "Signature", note: "Signature · option Intime et Essentiel" },
};

/** Nothing for a section that every formula has. */
export const planOf = (section: string): SectionPlan | undefined => plans[section];
