import type { MetadataRoute } from "next";

import { getHomepageData, getLastContentUpdate } from "@/lib/sanity/sanity.query";
import { absoluteUrl, site } from "@/lib/seo";

const legalPages = ["/mentions-legales", "/politique-de-confidentialite", "/politique-de-cookies"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [data, lastContentUpdate] = await Promise.all([
        getHomepageData(),
        getLastContentUpdate(),
    ]);

    const images = [
        data.settings?.hero?.profileImage?.image,
        ...data.projects.map((project) => project.cover?.image),
    ].filter((image): image is string => Boolean(image));

    return [
        {
            url: absoluteUrl("/"),
            lastModified: lastContentUpdate ?? undefined,
            changeFrequency: "weekly",
            priority: 1,
            images,
        },
        ...legalPages.map((path) => ({
            url: absoluteUrl(path),
            lastModified: site.legalPagesUpdatedAt,
            changeFrequency: "yearly" as const,
            priority: 0.3,
        })),
    ];
}
