import React from "react";
import Head from "next/head";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";

function Layout({ showNavbar = true, showFooter = true, title, children, ...props }) {
    return (
        <>
            <Head>
                <title>{`AlexDevLab | ${title}`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
                <meta name="description" content={`Alexandre ADOLPHE - ${title}`} key="description" />
            </Head>
            {showNavbar && <Navbar />}
            <main {...props}>{children}</main>
            {showFooter && <Footer />}
        </>
    );
}

export default Layout;
