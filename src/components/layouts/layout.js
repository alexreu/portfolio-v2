import Head from "next/head";
import Image from "next/image";
import Footer from "./footer";
import Navbar from "./navbar";
import backgroundPic from '../../../public/images/bg-under-construction.jpeg'

const Layout = ({children}) => {
    return (
        <>
            <Head>
                <title>Alexandre ADOLPHE | Developpeur Front-End</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                <meta name="description" content="Alexandre ADOLPHE - Developpeur Front-End"/>
            </Head>
            <div>
                {/*<Image*/}
                {/*    src={backgroundPic}*/}
                {/*    className="-z-[2]"*/}
                {/*    alt=""*/}
                {/*    layout="fill"*/}
                {/*    objectFit="cover"*/}
                {/*    objectPosition="center"*/}
                {/*    loading="eager"*/}
                {/*/>*/}
                <Navbar />
                <main className="mt-auto font-main">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    )
}

export default Layout;
