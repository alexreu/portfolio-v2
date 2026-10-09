/** A heading whose `emphasis` words (a substring of `text`) are set in italics. */
export type Heading = {
    readonly text: string;
    readonly emphasis?: string;
};

export type SectionIntro = {
    readonly eyebrow: string;
    readonly heading: Heading;
    readonly intro?: string;
};

export type WeddingPlan = {
    readonly name: string;
    readonly tagline: string;
    /** Net price in euros: micro-enterprise under VAT franchise. */
    readonly price: number;
    /** "Tout Intime, plus :" — the plan this one builds on. */
    readonly inherits?: string;
    readonly items: readonly string[];
    readonly delivery: string;
    readonly featured: boolean;
};

export type WeddingService = {
    readonly hero: {
        readonly heading: Heading;
        readonly lead: string;
        readonly facts: readonly { readonly value: string; readonly label: string }[];
    };
    readonly moments: SectionIntro & {
        readonly items: readonly {
            readonly when: string;
            readonly title: string;
            readonly text: string;
        }[];
    };
    readonly demo: {
        readonly couple: string;
        readonly date: string;
        readonly text: string;
        readonly highlights: readonly string[];
    };
    readonly features: SectionIntro & {
        readonly items: readonly {
            readonly title: string;
            readonly text: string;
            readonly availability: string;
        }[];
    };
    readonly dashboard: SectionIntro & {
        readonly points: readonly { readonly title: string; readonly text: string }[];
    };
    readonly steps: SectionIntro & {
        readonly items: readonly {
            readonly title: string;
            readonly text: string;
            readonly duration: string;
        }[];
    };
    readonly pricing: SectionIntro & {
        readonly plans: readonly WeddingPlan[];
        readonly options: readonly { readonly label: string; readonly price: string }[];
        readonly note: string;
    };
    readonly comparison: SectionIntro & {
        readonly rows: readonly {
            readonly label: string;
            readonly platforms: string;
            readonly agency: string;
            readonly us: string;
        }[];
    };
    /** Who makes the site: a real face, a few words, and the way to the rest of his work. */
    readonly about: SectionIntro & {
        readonly paragraphs: readonly string[];
        /** Set apart: what working with him means for the couple. */
        readonly promise: string;
        readonly photo: { readonly src: string; readonly alt: string };
        readonly portfolioLabel: string;
    };
    readonly faq: SectionIntro & {
        readonly items: readonly { readonly question: string; readonly answer: string }[];
    };
};

/** What the Studio sends: a photo not uploaded yet comes without its address. */
export type WeddingServiceFromCms = Partial<Omit<WeddingService, "about">> & {
    readonly about?: Omit<WeddingService["about"], "photo"> & {
        readonly photo?: { readonly src: string | null; readonly alt: string | null } | null;
    };
};
