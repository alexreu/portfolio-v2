import Head from "next/head";

export default function Layout({children}) {
    return (
        <>
            <Head>
                <title>Alexandre ADOLPHE | Coming Soon</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="Alexandre ADOLPHE - Portfolio"/>
            </Head>
            <main className="font-main">
                {children}
            </main>
        </>
)
}
