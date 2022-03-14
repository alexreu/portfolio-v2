import Head from "next/head";
import Image from "next/image";
import Footer from "./footer";
import Navbar from "./navbar";
import backgroundPic from '../../../public/images/bg-under-construction.jpeg'

const Layout = ({children}) => {
    return (
        <>
            <Head>
                <title>Alexandre ADOLPHE | Coming Soon</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                <meta name="description" content="Alexandre ADOLPHE - Portfolio"/>
            </Head>
            <div className="flex flex-col relative z-0 h-screen w-screen overflow-hidden p-4 before:absolute before:h-full before:w-full before:top-0 before:left-0 before:-z-[1] before:bg-black before:bg-opacity-50">
                <Image
                    src={backgroundPic}
                    className="-z-[2]"
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    loading="eager"
                />
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
