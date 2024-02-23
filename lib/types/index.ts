export type HomepageData = {
    firstname: string;
    profilePicture: {
        alt?: string;
        image: string;
    };
    job: string;
    keyFigures: { keyFigure: string; description: string }[];
    skills: { skill: string }[];
};
