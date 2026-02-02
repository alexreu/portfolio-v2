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

export type AboutPageData = {
    _id: string;
    presentation: { title: string; description: string };
    experiences: {
        _key: string;
        isCurrentJob: boolean;
        startYear: number;
        endYear?: number;
        job: string;
        company: string;
    }[];
    services: { _key: string; service: string }[];
    education: {
        _key: string;
        yearOfGraduation: number;
        graduationTitle: string;
        trainingLocation: string;
    }[];
    homePageData: {
        profilePicture: HomepageData["profilePicture"];
        keyFigures: HomepageData["keyFigures"];
    };
};

export type ServicesPageData = {
    _id: string;
    serviceIllustration: { image: string };
    serviceTitle: string;
    serviceDescription: string;
};
