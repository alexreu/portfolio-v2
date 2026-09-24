/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    poweredByHeader: false,
    // One host only: www duplicates every page otherwise.
    async redirects() {
        return [
            {
                source: "/:path*",
                has: [{ type: "host", value: "www.alexdevlab.com" }],
                destination: "https://alexdevlab.com/:path*",
                permanent: true,
            },
        ];
    },
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
