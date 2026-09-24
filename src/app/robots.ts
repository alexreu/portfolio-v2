import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

// `/_next` and `/images` stay crawlable: Google needs CSS/JS to render the page
// and image files to index them.
const disallow = ["/studio", "/api/", "/maintenance"];

// AI search and assistant crawlers, allowed explicitly so the intent is unambiguous
// to operators who read robots.txt before crawling.
const aiCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "Meta-ExternalAgent",
    "Amazonbot",
    "DuckAssistBot",
    "MistralAI-User",
    "CCBot",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow },
            { userAgent: aiCrawlers, allow: "/", disallow },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
    };
}
