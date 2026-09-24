import { ReactNode } from "react";
import { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { site } from "@/lib/seo";

import "./globals.css";

type Props = {
    children: ReactNode;
};

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: {
        default: site.title,
        template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    keywords: [
        "développeur front-end freelance",
        "développeur web La Réunion",
        "création site web La Réunion",
        "développeur React La Réunion",
        "développeur Next.js freelance",
        "création site vitrine 974",
        "Alexandre Adolphe",
        "AlexDevLab",
    ],
    authors: [{ name: site.author.name, url: site.url }],
    creator: site.author.name,
    publisher: site.name,
    category: "technology",
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
        title: site.title,
        description: site.description,
        url: "/",
        siteName: site.name,
        locale: site.locale,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: site.title,
        description: site.description,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export const viewport: Viewport = {
    themeColor: "#0A090D",
    colorScheme: "dark",
};

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
});

export default function RootLayout({ children }: Props) {
    return (
        <html lang="fr" className={`${poppins.variable}`} suppressHydrationWarning>
            <body className="bg-background">
                <SpeedInsights />
                <Analytics />
                {children}
            </body>
        </html>
    );
}
