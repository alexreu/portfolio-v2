/**
 * Sanity Types
 */

// Site Settings
export type SiteSettings = {
    _id: string;
    hero: {
        name: string;
        title: string;
        subtitle: string;
        description: string;
        availabilityText?: string;
        profileImage?: SanityImage;
        ctaPrimary?: { text: string; href: string };
        ctaSecondary?: { text: string; href: string };
    };
    about: {
        title: string;
        subtitle?: string;
        yearsExperience?: number;
        approach?: { title: string; description: string };
        targetAudience?: { title: string; description: string };
    };
    contact: {
        email?: string;
        phone?: string;
        calendlyUrl?: string;
        whatsappUrl?: string;
        responseTime?: string;
    };
    socialLinks?: Array<{
        platform: "github" | "linkedin" | "twitter" | "dribbble";
        url: string;
    }>;
};

// Service
export type Service = {
    _id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    order: number;
};

// Pricing Plan
export type FeatureCategory = {
    categoryName: string;
    items: string[];
};

export type FeatureIcon = {
    icon: string;
    label: string;
};

export type PricingPlan = {
    _id: string;
    name: string;
    subtitle?: string;
    description?: string;
    priceType: "fixed" | "custom";
    price?: number;
    priceCustom?: string;
    startingFrom?: boolean;
    minimumBudget?: string;
    monthlyFee?: string;
    commitment?: string;
    isPopular: boolean;
    icon?: string;
    featureCategories: FeatureCategory[];
    featureIcons?: FeatureIcon[];
    ctaText: string;
    order: number;
};

// Skill Category
export type Skill = {
    name: string;
    description?: string;
    emoji?: string;
};

export type SkillCategory = {
    _id: string;
    title: string;
    subtitle?: string;
    icon: string;
    theme: "primary" | "amber" | "emerald" | "purple";
    skills: Skill[];
    order: number;
};

// Sanity Image type
export type SanityImage = {
    alt?: string;
    image: string;
};

// Homepage data (combined)
export type HomepageData = {
    settings: SiteSettings | null;
    services: Service[];
    pricingPlans: PricingPlan[];
    skillCategories: SkillCategory[];
};
