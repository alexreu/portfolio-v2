import { ReactNode } from "react";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

type Props = {
    children: ReactNode;
};

export const metadata: Metadata = {
    metadataBase: new URL("https://alexdevlab.com"),
    title: "AlexDevLab - Freelance | Developpeur front île de la réunion 🏝️",
    description:
        "AlexDevLab développeur front freelance basé à l'île de la Réunion. Je suis capable de répondre à tous vos besoins, de la création de sites web vitrines et e-commerce à la réalisation de landing pages et d'applications web.",
    keywords: [
        "developpeur",
        "developer",
        "alexandre adolphe",
        "alex devlab",
        "alexdevlab freelance",
        "developpeur front",
        "front-end developer",
        "ile de la reunion",
        "freelance",
        "developpeur reunion",
        "developpeur ile de la reunion",
        "freelance front",
        "malt freelance",
        "codeur freelance",
        "malt",
        "codeur",
        "la reunion",
        "la réunion",
    ],
    openGraph: {
        title: "AlexDevLab - Freelance | Developpeur front île de la réunion 🏝",
        description:
            "AlexDevLab développeur front freelance basé à l'île de la Réunion. Je suis capable de répondre à tous vos besoins, de la création de sites web vitrines et e-commerce à la réalisation de landing pages et d'applications web.",
        url: "https://alexdevlab.com/",
        type: "website",
    },
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
            <body className="bg-[#0A090D]">
                <SpeedInsights />
                <Analytics />
                {children}
            </body>
        </html>
    );
}
