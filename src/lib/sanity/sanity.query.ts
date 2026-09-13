import { groq } from "next-sanity";

import client from "./client";
import type { HomepageData, PricingPlan, Service, SiteSettings, SkillCategory } from "./types";

// Shared projection keeps the standalone and homepage queries in sync.
const pricingFields = groq`_id, name, subtitle, description, priceType, price, priceCustom,
    startingFrom, minimumBudget, monthlyFee, commitment, isPopular, icon,
    highlights, contextLabel, context,
    featureCategories[] { categoryName, items }, ctaText, order`;

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
 * Get all services
 */
export const getServices = async (): Promise<Service[]> => {
    return client.fetch(groq`*[_type == "service"] | order(order asc) {
        _id,
        title,
        description,
        icon,
        features,
        order
    }`);
};

/**
 * Get all pricing plans
 */
export const getPricingPlans = async (): Promise<PricingPlan[]> => {
    return client.fetch(
        groq`*[_type == "pricingPlan" && archived != true] | order(order asc) {${pricingFields}}`,
    );
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
 * Get all homepage data in a single query
 * Use this for the main page to reduce API calls
 */
export const getHomepageData = async (): Promise<HomepageData> => {
    return client.fetch(groq`{
        "projectCount": count(*[_type == "project"]),
        "projects": *[_type == "project" && archived != true] | order(order asc, _id asc) {
            _id, title, category, description, url, tags, order,
            cover {alt, "image": asset->url}
        },
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
        "services": *[_type == "service"] | order(order asc) {
            _id,
            title,
            description,
            icon,
            features,
            order
        },
        "pricingPlans": *[_type == "pricingPlan" && archived != true] | order(order asc) {${pricingFields}},
        "maintenance": *[_type == "maintenanceSection" && _id == "maintenanceSection"][0] {
            _id, title, description, footerNote,
            plans[] { _key, name, price, summary, detailsIntro, features }
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
