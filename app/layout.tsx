import React, { ReactNode } from "react";
import { Metadata } from "next";
import { Providers } from "./providers";

import "../styles/globals.css";
import { Poppins, Inter, Montserrat } from "next/font/google";

type Props = {
    children: ReactNode;
};

export const metadata: Metadata = {
    metadataBase: new URL("https://alexdevlab.com"),
    title: "Alexandre Adolphe - AlexDevLab | Developpeur front île de la réunion 🏝️",
    description:
        "Alexandre Adolphe développeur front freelance basé à l'île de la Réunion. Intégration web de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets.",
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
    ],
    openGraph: {
        title: "Alexandre Adolphe - AlexDevLab | Developpeur front île de la réunion 🏝️",
        description:
            "Alexandre Adolphe développeur front freelance basé à l'île de la Réunion. Intégration web de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets.",
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

const inter = Inter({
    weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const montserrat = Montserrat({
    weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-montserrat",
});

export default function RootLayout({ children }: Props) {
    return (
        <html
            lang="fr"
            className={`${poppins.variable} ${inter.variable} ${montserrat.variable}`}
            suppressHydrationWarning
        >
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
