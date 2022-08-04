import Footer from "./Footer";
import Navbar from "./Navbar";
import { ThemeProvider } from "../../modules/theme/ThemeContext";
import Head from "next/head";

function Layout({ children }) {
    return (
        <ThemeProvider>
            <Head>
                <title>Alexandre ADOLPHE | Developpeur Front-End</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Alexandre ADOLPHE - Developpeur Front-End" />
            </Head>
            <div>
                {/* <Image */}
                {/*    src={backgroundPic} */}
                {/*    className="-z-[2]" */}
                {/*    alt="" */}
                {/*    layout="fill" */}
                {/*    objectFit="cover" */}
                {/*    objectPosition="center" */}
                {/*    loading="eager" */}
                {/* /> */}
                <Navbar />
                <main className="mt-auto font-main">{children}</main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default Layout;