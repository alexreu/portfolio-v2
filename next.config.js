/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    turbopack: {
        root: __dirname,
    },
    experimental: {
        viewTransition: true,
    },
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
            },
        ],
    },
};
