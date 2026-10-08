import type { Metadata } from "next";

import { buildPageMetadata, weddingDemoImage } from "@/lib/seo";
import type { DashboardPage } from "@/lib/wedding-dashboard/pages";
import { dashboardEntry, dashboardHref } from "@/components/wedding-dashboard/dashboard-pages";

/** The pages under the overview repeat its fictional data: shown, linked, not indexed. */
export const dashboardPageMetadata = (page: DashboardPage): Metadata => {
    const { label, intro } = dashboardEntry(page);
    return {
        ...buildPageMetadata({
            title: `${label} · démo du tableau de bord des mariés`,
            description: `${intro} Démo du tableau de bord d'un site de mariage, données fictives.`,
            path: dashboardHref(page),
            image: weddingDemoImage,
        }),
        robots: { index: false, follow: true },
    };
};
