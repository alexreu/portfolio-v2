/** @type {import("next-sitemap").IConfig} */
module.exports = {
    siteUrl: "https://alexdevlab.com",
    changefreq: "daily",
    priority: 0.7,
    sitemapSize: 5000,
    generateRobotsTxt: true, // (optional)
    exclude: [
        "/studio",
        "/studio/*",
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
            { userAgent: "*", allow: "/" },
            { userAgent: "*", disallow: ["/studio", "/_next", "/images"] },
        ],
    },
    // Default transformation function
    transform: async (config, path) => {
        // Skip static files and assets
        if (path.includes("/_next") || path.includes("/images") || path.match(/\.(woff2|jpg|png|gif|css|js)$/)) {
            return null;
        }
        const priority = path === "/" ? 1 : config.priority;
        return {
            loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
            changefreq: config.changefreq,
            priority: priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            alternateRefs: config.alternateRefs ?? [],
        };
    },
};
