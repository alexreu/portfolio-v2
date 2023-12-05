// import { Head, Html, Main, NextScript } from "next/document";
import React from "react";

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <head>
                <link rel="shortcut icon" href="/images/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
                />
                <meta
                    name="keywords"
                    content="developpeur, developer, alexandre adolphe, alex devlab, alexdevlab freelance, developpeur front, front-end developer, ile de la reunion"
                />
                <meta
                    name="description"
                    content="Alexandre Adolphe développeur front freelance basé à l'île de la Réunion. Intégration web de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets."
                />
                <meta
                    property="og:title"
                    content="Alexandre Adolphe - AlexDevLab | Developpeur front île de la réunion 🏝️"
                />
                <meta
                    property="og:description"
                    content="Alexandre Adolphe développeur front freelance basé à l'île de la Réunion. Intégration web de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets."
                />
                <meta property="og:url" content="https://alexdevlab.com/" />
                <meta property="og:type" content="website" />
            </head>
            <body>
                {children}
                <NextScript />
            </body>
        </html>
    );
}
