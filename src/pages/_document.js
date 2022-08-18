import { Html, Head, Main, NextScript } from "next/document";

function Document() {
    return (
        <Html lang="fr">
            <Head>
                <link rel="shortcut icon" href="/images/favicon.ico" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

export default Document;
