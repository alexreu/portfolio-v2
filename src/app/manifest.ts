import type { MetadataRoute } from "next";

import { site } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${site.name} - ${site.author.jobTitle}`,
        short_name: site.name,
        description: site.description,
        start_url: "/",
        display: "standalone",
        lang: site.language,
        background_color: "#0A090D",
        theme_color: "#0A090D",
        icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
    };
}
