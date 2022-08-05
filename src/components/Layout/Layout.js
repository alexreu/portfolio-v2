import React from "react";
import Head from "next/head";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";
import { ThemeProvider } from "../../modules/theme/ThemeContext";

function Layout({ children }) {
    return (
        <ThemeProvider>
            <Head>
                <title>Alexandre ADOLPHE | Developpeur Front-End</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Alexandre ADOLPHE - Developpeur Front-End" />
            </Head>
            <Navbar />
            <main className="mt-auto font-main">{children}</main>
            <Footer />
        </ThemeProvider>
    );
}

export default Layout;
