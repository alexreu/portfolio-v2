import React, { FC, HTMLAttributes } from "react";
import Head from "next/head";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";
import { ThemeProvider, getInitialTheme } from "../../modules/theme";

type LayoutProps = {
    showNavbar?: boolean;
    showFooter?: boolean;
    title: string;
} & HTMLAttributes<HTMLElement>;

export const Layout: FC<LayoutProps> = ({ showNavbar = true, showFooter = true, title, children, ...props }) => {
    return (
        <ThemeProvider initialTheme={getInitialTheme()}>
            <main>
                <Head>
                    <title>{`AlexDevLab | ${title}`}</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
                    <meta name="description" content={`AlexDevLab - ${title}`} key="description" />
                </Head>
                {showNavbar && <Navbar />}
                <main {...props}>{children}</main>
                {showFooter && <Footer />}
            </main>
        </ThemeProvider>
    );
};
