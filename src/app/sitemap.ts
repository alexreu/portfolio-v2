import type { MetadataRoute } from "next";

import {
    getHomepageData,
    getLastContentUpdate,
    getWeddingService,
} from "@/lib/sanity/sanity.query";
import { sitemapEntries } from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [data, lastContentUpdate, wedding] = await Promise.all([
        getHomepageData(),
        getLastContentUpdate(),
        getWeddingService(),
    ]);

    const images = [
        data.settings?.hero?.profileImage?.image,
        ...data.projects.map((project) => project.cover?.image),
    ].filter((image): image is string => Boolean(image));

    return sitemapEntries({
        images,
        lastContentUpdate,
        weddingUpdatedAt: wedding?.updatedAt ?? null,
    });
}
