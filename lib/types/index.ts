export type HomepageData = {
    firstname: string;
    profilePicture: {
        alt?: string;
        image: string;
    };
    job: string;
    keyFigures: { keyFigure: string; keyFigureDescription: string; _key: string }[];
    skills: { skill: string; _key: string }[];
};

export type PricingPageData = {
    _id: string;
    fixedPrice?: number;
    monthlyPrice?: number;
    isOfferCustom: boolean;
    offerTitle: string;
    offerContent: { _key: string; offerContentItem: string }[];
};
