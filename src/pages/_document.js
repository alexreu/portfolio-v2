import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

function Document() {
    return (
        <Html lang="fr">
            <Head>
                <link rel="shortcut icon" href="/images/favicon.ico" />
                {/*Global site tag (gtag.js) - Google Analytics*/}
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-DT7VW43HNN" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){window.dataLayer.push(arguments);}
                      gtag('js', new Date());
            
                      gtag('config', 'G-DT7VW43HNN');
                    `}
                </Script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

export default Document;
