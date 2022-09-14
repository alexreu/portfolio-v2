import { useEffect } from "react";
import "../../styles/globals.css";
import "../../styles/utilities.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function MyApp({ Component, pageProps }) {
    useEffect(() => {}, []);
    const getLayout = Component.getLayout || (page => page);
    return getLayout(
        <>
            {/*Global site tag (gtag.js) - Google Analytics*/}
            {/*<Script src="https://www.googletagmanager.com/gtag/js?id=G-DT7VW43HNN" strategy="afterInteractive" />*/}
            {/*<Script id="google-analytics" strategy="afterInteractive">*/}
            {/*    {`*/}
            {/*          window.dataLayer = window.dataLayer || [];*/}
            {/*          function gtag(){window.dataLayer.push(arguments);}*/}
            {/*          gtag('js', new Date());*/}

            {/*          gtag('config', 'G-DT7VW43HNN');*/}
            {/*        `}*/}
            {/*</Script>*/}
            <Component {...pageProps} />
        </>,
    );
}

export default MyApp;
