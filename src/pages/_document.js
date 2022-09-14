import { Head, Html, Main, NextScript } from "next/document";

function Document() {
    return (
        <Html lang="fr">
            <Head>
                <link rel="shortcut icon" href="/images/favicon.ico" />
                <meta
                    name="description"
                    content="Développeur Freelance basé à l'île de la Réunion. Intégration de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets."
                />
                <meta property="og:title" content="Alexandre ADOLPHE | Portfolio" />
                <meta
                    property="og:description"
                    content="Développeur Freelance basé à l'île de la Réunion. Intégration de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets."
                />
                <meta property="og:url" content="https://alexandreadolphe.com/" />
                <meta property="og:type" content="website" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

export default Document;
