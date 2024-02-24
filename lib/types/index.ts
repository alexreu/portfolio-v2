export type HomepageData = {
    firstname: string;
    profilePicture: {
        alt?: string;
        image: string;
    };
    job: string;
    keyFigures: { keyFigure: string; keyFigureDescription: string; _key: string }[];
    skills: { skillTitle: string; _key: string }[];
};
