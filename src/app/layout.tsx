import { ReactNode } from "react";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

type Props = {
    children: ReactNode;
};

const siteUrl = "https://alexdevlab.com";
const siteName = "AlexDevLab";
const title = "AlexDevLab - Developpeur Front-End Freelance | Ile de la Reunion";
const description =
    "Developpeur front-end freelance a l'ile de la Reunion. Creation de sites web, applications React/Next.js, et solutions performantes. Devis gratuit sous 24h.";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: title,
        template: `%s | ${siteName}`,
    },
    description,
    keywords: [
        "developpeur front-end freelance",
        "developpeur web reunion",
        "creation site web reunion",
        "developpeur react reunion",
        "developpeur next.js freelance",
        "freelance front-end ile de la reunion",
        "creation site vitrine reunion",
        "creation application web reunion",
        "alexandre adolphe developpeur",
        "alexdevlab",
        "agence web reunion",
        "site internet reunion",
        "developpeur typescript",
        "integration web freelance",
        "SEO reunion",
        "performance web",
    ],
    authors: [{ name: "Alexandre Adolphe", url: siteUrl }],
    creator: "Alexandre Adolphe",
    publisher: siteName,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title,
        description,
        url: siteUrl,
        siteName,
        locale: "fr_FR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
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

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: siteName,
            description,
            inLanguage: "fr-FR",
        },
        {
            "@type": "ProfessionalService",
            "@id": `${siteUrl}/#business`,
            name: siteName,
            url: siteUrl,
            description,
            founder: {
                "@type": "Person",
                name: "Alexandre Adolphe",
                jobTitle: "Developpeur Front-End Freelance",
                url: siteUrl,
            },
            areaServed: [
                {
                    "@type": "Place",
                    name: "Ile de la Reunion",
                },
                {
                    "@type": "Place",
                    name: "France",
                },
            ],
            serviceType: [
                "Creation de sites web",
                "Developpement front-end",
                "Applications React/Next.js",
                "Optimisation SEO",
                "Design UI/UX",
            ],
            priceRange: "$$",
            image: `${siteUrl}/opengraph-image`,
        },
    ],
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <SpeedInsights />
                <Analytics />
                {children}
            </body>
        </html>
    );
}
