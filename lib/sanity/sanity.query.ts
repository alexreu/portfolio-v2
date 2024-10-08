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
        "homePageData": *[_type == "homepage"][0]{keyFigures, profilePicture {alt, "image": asset->url}, }
    }`);
};

export const getServicesPageData = async () => {
    return client.fetch(groq`*[_type == "services"] | order(_createdAt asc) {
        _id,
        serviceTitle,
        serviceDescription,
        serviceIllustration {"image": asset->url},
    }`);
};
