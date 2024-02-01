import React, { ReactNode } from "react";
import { Metadata } from "next";
import { Providers } from "./providers";

import "../styles/globals.css";
import { BackToTop } from "../src/components/BackToTop";
//TODO - Continue migration page router -> app router

export const metadata: Metadata = {
    icons: {
        icon: "/favicon.ico",
    },
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

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body>
                <Providers>
                    {children}
                    <BackToTop />
                </Providers>
            </body>
        </html>
    );
}
