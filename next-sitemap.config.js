/** @type {import("next-sitemap").IConfig} */
module.exports = {
    siteUrl: "https://alexdevlab.com",
    changefreq: "weekly",
    priority: 0.7,
    sitemapSize: 5000,
    generateRobotsTxt: true,
    exclude: [
        "/studio",
        "/studio/*",
        "/maintenance",
        "/_next/*",
        "/_next/static/*",
        "/images/*",
        "*.woff2",
        "*.jpg",
        "*.png",
        "*.gif",
        "*.css",
        "*.js",
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/studio", "/_next", "/images", "/maintenance"],
            },
        ],
    },
    transform: async (config, path) => {
        if (
            path.includes("/_next") ||
            path.includes("/images") ||
            path.includes("/maintenance") ||
            path.match(/\.(woff2|jpg|png|gif|css|js)$/)
        ) {
            return null;
        }
        const priority = path === "/" ? 1.0 : config.priority;
        return {
            loc: path,
            changefreq: path === "/" ? "weekly" : "monthly",
            priority: priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            alternateRefs: config.alternateRefs ?? [],
        };
    },
};
