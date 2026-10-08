import type { MetadataRoute } from "next";

import { absoluteUrl, site, weddingDashboardDemoPage, weddingPage } from "@/lib/seo";

const legalPages = ["/mentions-legales", "/politique-de-confidentialite", "/politique-de-cookies"];

export type SitemapInput = {
    /** Images shown on the homepage (profile photo, project covers). */
    readonly images: readonly string[];
    readonly lastContentUpdate: string | null;
    /** Last edit of the « Sites de mariage » document, if published. */
    readonly weddingUpdatedAt: string | null;
};

export const sitemapEntries = ({
    images,
    lastContentUpdate,
    weddingUpdatedAt,
}: SitemapInput): MetadataRoute.Sitemap => [
    {
        url: absoluteUrl("/"),
        lastModified: lastContentUpdate ?? undefined,
        changeFrequency: "weekly",
        priority: 1,
        images: [...images],
    },
    {
        url: absoluteUrl(weddingPage.path),
        lastModified: weddingUpdatedAt ?? weddingPage.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
    },
    {
        url: absoluteUrl(`${weddingPage.path}/demo`),
        changeFrequency: "yearly",
        priority: 0.5,
    },
    {
        url: absoluteUrl(weddingDashboardDemoPage.path),
        changeFrequency: "yearly",
        priority: 0.4,
    },
    ...legalPages.map((path) => ({
        url: absoluteUrl(path),
        lastModified: site.legalPagesUpdatedAt,
        changeFrequency: "yearly" as const,
        priority: 0.3,
    })),
];
