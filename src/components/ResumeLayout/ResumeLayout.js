import Head from "next/head";

export const ResumeLayout = ({ children }) => {
    return (
        <>
            <Head>
                <title>Alexandre ADOLPHE | Curriculum vitae</title>
            </Head>
            <main>{children}</main>
        </>
    );
};
