import { groq } from "next-sanity";
import client from "./client";

export const getHomepageData = async () => {
    return client.fetch(groq`*[_type == "homepage"]{
        _id,
        firstname,
        profilePicture {alt, "image": asset->url},
        job,
        keyFigures,
        skills
    }`);
};

export const getPricingPageData = async () => {
    return client.fetch(groq`*[_type == "pricing"] | order(_createdAt asc) {
        _id,
        fixedPrice,
        monthlyPrice,
        isOfferCustom,
        offerContent,
        offerTitle
    }`);
};

export const getAboutPageData = async () => {
    return client.fetch(groq`*[_type == "about"][0]{
        _id,
        presentation,
        experiences,
        services,
        education,
        "homepageData": *[_type == "homepage"][0]{keyFigures, profilePicture {alt, "image": asset->url}, }
    }`);
};
