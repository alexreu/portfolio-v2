import React from "react";
import Head from "next/head";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";

function Layout({ showNavbar = true, showFooter = true, title, children }) {
    return (
        <>
            <Head>
                <title>Alexandre ADOLPHE | {title} </title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Alexandre ADOLPHE - Developpeur Front-End" />
            </Head>
            {showNavbar && <Navbar />}
            <main className="mt-auto font-main">{children}</main>
            {showFooter && <Footer />}
        </>
    );
}

export default Layout;
