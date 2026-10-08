import type { Metadata } from "next";

import { getProjectUrl } from "@/lib/projects";
import type { PricingPlan, Project, Service, SiteSettings } from "@/lib/sanity/types";
import { DASHBOARD_PATH } from "@/lib/wedding-dashboard/pages";
import type { WeddingPlan, WeddingService } from "@/lib/wedding-service/types";

/**
 * Single source of truth for SEO: metadata, JSON-LD, sitemap, robots and llms.txt
 * all read from here so the signals sent to Google and AI crawlers never drift apart.
 */
export const site = {
    url: "https://alexdevlab.com",
    name: "AlexDevLab",
    locale: "fr_FR",
    language: "fr-FR",
    title: "Développeur Front-End Freelance à La Réunion | AlexDevLab",
    description:
        "Alexandre Adolphe, développeur front-end freelance à La Réunion : sites vitrines et applications React / Next.js rapides et bien référencés. Devis gratuit.",
    email: "contact@alexdevlab.com",
    author: {
        name: "Alexandre Adolphe",
        jobTitle: "Développeur Front-End Freelance",
    },
    address: {
        addressLocality: "Sainte-Suzanne",
        postalCode: "97441",
        addressRegion: "La Réunion",
        addressCountry: "RE",
    },
    geo: { latitude: -20.9061, longitude: 55.6069 },
    vatId: "FR75918609421",
    legalPagesUpdatedAt: "2026-02-11",
    expertise: [
        "Développement front-end",
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Intégration web",
        "Design UI/UX",
        "Performance web",
        "Core Web Vitals",
        "Référencement naturel (SEO)",
        "Accessibilité web (WCAG)",
    ],
    services: [
        "Création de sites vitrines",
        "Développement d'applications React et Next.js",
        "Intégration web depuis Figma",
        "Design UI/UX",
        "Optimisation des performances web",
        "Référencement naturel (SEO technique)",
        "Maintenance de sites web",
    ],
} as const;

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

const ids = {
    website: `${site.url}/#website`,
    person: `${site.url}/#person`,
    business: `${site.url}/#business`,
};

// Declared explicitly because a page-level `openGraph` replaces the root one wholesale.
const ogImage = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "AlexDevLab, développeur front-end freelance à La Réunion",
};

type PageMetadataOptions = {
    title: string;
    description: string;
    path: string;
    /** A page's own share image, 1200 × 630; the studio's card otherwise. */
    image?: { url: string; alt: string };
    /** Its short name in the breadcrumb trail, when the title says more. */
    crumb?: string;
    /** "YYYY-MM-DD": the page's last real change; the legal pages' date otherwise. */
    updatedAt?: string;
};

/**
 * Child routes inherit `alternates` and `openGraph` from the root layout, so every
 * page must declare its own canonical and og:url or Google folds it into the homepage.
 */
export const buildPageMetadata = ({
    title,
    description,
    path,
    image,
}: PageMetadataOptions): Metadata => ({
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
        title: `${title} | ${site.name}`,
        description,
        url: path,
        siteName: site.name,
        locale: site.locale,
        type: "website",
        images: [image ? { ...ogImage, ...image } : ogImage],
    },
    twitter: {
        card: "summary_large_image",
        title: `${title} | ${site.name}`,
        description,
        images: [image?.url ?? ogImage.url],
    },
});

type JsonLdSource = {
    settings?: SiteSettings | null;
    services?: Service[];
    projects?: Project[];
    pricingPlans?: PricingPlan[];
};

const personNode = (settings?: SiteSettings | null) => {
    const sameAs = settings?.socialLinks?.map((link) => link.url).filter(Boolean) ?? [];

    return {
        "@type": "Person",
        "@id": ids.person,
        name: site.author.name,
        jobTitle: site.author.jobTitle,
        url: site.url,
        email: `mailto:${settings?.contact?.email ?? site.email}`,
        image: settings?.hero?.profileImage?.image ?? absoluteUrl("/images/resume-photo.png"),
        knowsAbout: site.expertise,
        knowsLanguage: ["fr", "en"],
        worksFor: { "@id": ids.business },
        address: { "@type": "PostalAddress", ...site.address },
        ...(sameAs.length > 0 && { sameAs }),
    };
};

const pricingOffer = (plan: PricingPlan) => ({
    "@type": "Offer",
    name: plan.name,
    ...(plan.description && { description: plan.description }),
    ...(plan.priceType === "fixed" &&
        plan.price != null && {
            priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "EUR",
                valueAddedTaxIncluded: false,
                ...(plan.startingFrom ? { minPrice: plan.price } : { price: plan.price }),
            },
        }),
    itemOffered: { "@type": "Service", name: plan.name, provider: { "@id": ids.business } },
});

const businessNode = ({ settings, services, pricingPlans }: JsonLdSource) => {
    const offered =
        services && services.length > 0
            ? services.map((service) => ({ name: service.title, description: service.description }))
            : site.services.map((name) => ({ name }));

    return {
        "@type": "ProfessionalService",
        "@id": ids.business,
        name: site.name,
        alternateName: "Alex DevLab",
        url: site.url,
        description: site.description,
        image: absoluteUrl("/opengraph-image"),
        logo: absoluteUrl("/images/logo-dark-8.png"),
        email: settings?.contact?.email ?? site.email,
        ...(settings?.contact?.phone && { telephone: settings.contact.phone }),
        founder: { "@id": ids.person },
        vatID: site.vatId,
        address: { "@type": "PostalAddress", ...site.address },
        geo: { "@type": "GeoCoordinates", ...site.geo },
        areaServed: [
            { "@type": "AdministrativeArea", name: "La Réunion" },
            { "@type": "Country", name: "France" },
        ],
        knowsLanguage: ["fr", "en"],
        priceRange: "€€",
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Services de développement web",
            itemListElement: [
                ...offered.map((service) => ({
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        ...service,
                        provider: { "@id": ids.business },
                    },
                })),
                ...(pricingPlans ?? []).map(pricingOffer),
            ],
        },
    };
};

const websiteNode = () => ({
    "@type": "WebSite",
    "@id": ids.website,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: site.language,
    publisher: { "@id": ids.business },
    author: { "@id": ids.person },
});

/** Full entity graph for the homepage: who, what, where, and the work shown. */
export const buildHomeJsonLd = (source: JsonLdSource) => {
    const { settings, projects } = source;
    const works =
        projects?.flatMap((project) => {
            const url = getProjectUrl(project.url);
            return url
                ? [
                      {
                          "@type": "CreativeWork",
                          name: project.title,
                          description: project.description,
                          url,
                          genre: project.category,
                          ...(project.tags?.length && { keywords: project.tags.join(", ") }),
                          ...(project.cover?.image && { image: project.cover.image }),
                          creator: { "@id": ids.person },
                      },
                  ]
                : [];
        }) ?? [];

    return {
        "@context": "https://schema.org",
        "@graph": [
            websiteNode(),
            personNode(settings),
            businessNode(source),
            {
                "@type": "ProfilePage",
                "@id": `${site.url}/#webpage`,
                url: site.url,
                name: site.title,
                description: site.description,
                inLanguage: site.language,
                isPartOf: { "@id": ids.website },
                about: { "@id": ids.business },
                mainEntity: { "@id": ids.person },
                ...(works.length > 0 && {
                    hasPart: {
                        "@type": "ItemList",
                        name: "Projets réalisés",
                        itemListElement: works.map((work, index) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            item: work,
                        })),
                    },
                }),
            },
        ],
    };
};

/** Lightweight graph for secondary pages: the page and its breadcrumb trail. */
export const buildPageJsonLd = ({
    title,
    description,
    path,
    crumb,
    updatedAt,
}: PageMetadataOptions) => ({
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": `${absoluteUrl(path)}#webpage`,
            url: absoluteUrl(path),
            name: title,
            description,
            inLanguage: site.language,
            isPartOf: { "@id": ids.website },
            publisher: { "@id": ids.business },
            dateModified: updatedAt ?? site.legalPagesUpdatedAt,
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: crumb ?? title,
                    item: absoluteUrl(path),
                },
            ],
        },
    ],
});

export const weddingPage = {
    path: "/mariage",
    /** What couples type, « site de mariage », first; under 60 characters with the brand. */
    title: "Site de mariage sur-mesure, faire-part animé",
    crumb: "Sites de mariage",
    /** The default content's last change; Sanity's own date wins once it is published. */
    updatedAt: "2026-10-08",
    description:
        "Faire-part numérique animé, réponses des invités par lien personnel, programme du jour J et galerie photo partagée. Un site de mariage unique, dès 290 €.",
    /** Its own share image, built at deploy time: see app/(wedding)/mariage/partage. */
    image: {
        url: "/mariage/partage",
        alt: "Un site de mariage sur-mesure par AlexDevLab : faire-part animé, réponses par foyer, jour J et photos, dès 290 €",
    },
} as const;

/** The demo's share image: Camille & Hugo's faire-part, at a fixed address. */
export const weddingDemoImage = {
    url: "/mariage/demo/partage",
    alt: "Faire-part de Camille & Hugo, exemple de site de mariage par AlexDevLab",
};

/** The couple's dashboard, playable with fictional data kept in the visitor's browser. */
export const weddingDashboardDemoPage = {
    path: DASHBOARD_PATH,
    title: "Démo · tableau de bord des mariés",
    description:
        "Essayez le tableau de bord d'un site de mariage : réponses des invités en temps réel, récap traiteur, création de faire-part et relances. Données fictives, rien n'est envoyé.",
    image: weddingDemoImage,
} as const;

const weddingOffer = (plan: WeddingPlan) => ({
    "@type": "Offer",
    name: plan.name,
    description: plan.tagline,
    price: String(plan.price),
    priceCurrency: "EUR",
    url: absoluteUrl(`${weddingPage.path}#tarifs`),
});

const faqNode = (content: WeddingService) => ({
    "@type": "FAQPage",
    "@id": `${absoluteUrl(weddingPage.path)}#faq`,
    mainEntity: content.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
});

/** The wedding offer page: the page itself, the service with its three plans, and its FAQ. */
export const buildWeddingJsonLd = (content: WeddingService) => ({
    "@context": "https://schema.org",
    "@graph": [
        ...buildPageJsonLd(weddingPage)["@graph"],
        faqNode(content),
        {
            "@type": "Service",
            "@id": `${absoluteUrl(weddingPage.path)}#service`,
            name: "Sites de mariage",
            serviceType: "Création de site internet de mariage",
            description: weddingPage.description,
            provider: { "@id": ids.business },
            areaServed: { "@type": "Country", name: "France" },
            offers: content.pricing.plans.map(weddingOffer),
        },
        {
            "@type": "Person",
            "@id": ids.person,
            name: site.author.name,
            jobTitle: site.author.jobTitle,
            image: absoluteUrl(content.about.photo.src),
        },
    ],
});

/** `<` is escaped so a Sanity string can never close the script tag early. */
export const serializeJsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
