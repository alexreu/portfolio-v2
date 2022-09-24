import React, { useEffect } from "react";
import { BackToTop } from "../components/BackToTop";
import "../../styles/globals.css";
import "../../styles/utilities.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function MyApp({ Component, pageProps }) {
    useEffect(() => {}, []);
    const getLayout = Component.getLayout || (page => page);
    return getLayout(
        <>
            <Component {...pageProps} />
            <BackToTop />
        </>,
    );
}

export default MyApp;
