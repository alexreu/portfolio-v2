import { groq } from "next-sanity";

import client from "./client";
import type {
    HomepageData,
    PricingPlanV2,
    ServiceV2,
    SiteSettings,
    SkillCategory,
} from "./types";

// ===========================================
// LEGACY QUERIES (keep for backward compatibility)
// ===========================================

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

// ===========================================
// V2 QUERIES (new schema)
// ===========================================

/**
 * Get site settings (singleton)
 */
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
    return client.fetch(groq`*[_type == "siteSettings"][0]{
        _id,
        hero {
            name,
            title,
            subtitle,
            description,
            availabilityText,
            profileImage {alt, "image": asset->url},
            ctaPrimary,
            ctaSecondary
        },
        about {
            title,
            subtitle,
            yearsExperience,
            approach,
            targetAudience
        },
        contact {
            email,
            phone,
            calendlyUrl,
            whatsappUrl,
            responseTime
        },
        socialLinks
    }`);
};

/**
 * Get all services (V2)
 */
export const getServicesV2 = async (): Promise<ServiceV2[]> => {
    return client.fetch(groq`*[_type == "serviceV2"] | order(order asc) {
        _id,
        title,
        description,
        icon,
        features,
        order
    }`);
};

/**
 * Get all pricing plans (V2)
 */
export const getPricingPlansV2 = async (): Promise<PricingPlanV2[]> => {
    return client.fetch(groq`*[_type == "pricingPlanV2"] | order(order asc) {
        _id,
        name,
        subtitle,
        description,
        price,
        monthlyFee,
        commitment,
        isPopular,
        icon,
        featureCategories[] {
            categoryName,
            items
        },
        featureIcons[] {
            icon,
            label
        },
        ctaText,
        order
    }`);
};

/**
 * Get all skill categories
 */
export const getSkillCategories = async (): Promise<SkillCategory[]> => {
    return client.fetch(groq`*[_type == "skillCategory"] | order(order asc) {
        _id,
        title,
        subtitle,
        icon,
        theme,
        skills[] {
            name,
            description,
            emoji
        },
        order
    }`);
};

/**
 * Get all homepage data in a single query (V2)
 * Use this for the main page to reduce API calls
 */
export const getHomepageDataV2 = async (): Promise<HomepageData> => {
    return client.fetch(groq`{
        "settings": *[_type == "siteSettings"][0]{
            _id,
            hero {
                name,
                title,
                subtitle,
                description,
                availabilityText,
                profileImage {alt, "image": asset->url},
                ctaPrimary,
                ctaSecondary
            },
            about {
                title,
                subtitle,
                yearsExperience,
                approach,
                targetAudience
            },
            contact {
                email,
                phone,
                calendlyUrl,
                whatsappUrl,
                responseTime
            },
            socialLinks
        },
        "services": *[_type == "serviceV2"] | order(order asc) {
            _id,
            title,
            description,
            icon,
            features,
            order
        },
        "pricingPlans": *[_type == "pricingPlanV2"] | order(order asc) {
            _id,
            name,
            subtitle,
            description,
            price,
            monthlyFee,
            commitment,
            isPopular,
            icon,
            featureCategories[] {
                categoryName,
                items
            },
            featureIcons[] {
                icon,
                label
            },
            ctaText,
            order
        },
        "skillCategories": *[_type == "skillCategory"] | order(order asc) {
            _id,
            title,
            subtitle,
            icon,
            theme,
            skills[] {
                name,
                description,
                emoji
            },
            order
        }
    }`);
};
