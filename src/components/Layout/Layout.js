import React from "react";
import Head from "next/head";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";
import { ThemeProvider } from "../../modules/theme";

function Layout({ children }) {
    return (
        <>
            <Head>
                <title>Alexandre ADOLPHE | Developpeur Front-End</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Alexandre ADOLPHE - Developpeur Front-End" />
            </Head>
            <Navbar />
            <main className="mt-auto font-main">{children}</main>
            <Footer />
        </>
    );
}

export default Layout;
