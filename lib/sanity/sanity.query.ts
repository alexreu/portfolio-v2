import { groq } from "next-sanity";
import client from "./client";

export const getHomepageData = async () => {
    return client.fetch(groq`*[_type == "homepage"]{
        _id,
        firstname,
        profilePicture,
        job,
        keyFigures,
        skills
    }`);
};
