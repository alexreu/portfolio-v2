import { Head, Html, Main, NextScript } from "next/document";

function Document() {
    return (
        <Html lang="fr">
            <Head>
                <link rel="shortcut icon" href="/images/favicon.ico" />
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
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

export default Document;
