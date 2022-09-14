import { Head, Html, Main, NextScript } from "next/document";

function Document() {
    return (
        <Html lang="fr">
            <Head>
                <link rel="shortcut icon" href="/images/favicon.ico" />
                <meta
                    name="keywords"
                    content="developpeur, developer, alexandre adolphe, alex devlab, freelance, developpeur front, front-end developer, ile de la reunion"
                />
                <meta
                    name="description"
                    content="AlexDevLab développeur Freelance basé à l'île de la Réunion. Intégration de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets."
                />
                <meta property="og:title" content="AlexDevLab | Portfolio" />
                <meta
                    property="og:description"
                    content="AlexDevLab développeur Freelance basé à l'île de la Réunion. Intégration de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets."
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
