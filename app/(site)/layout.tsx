import { Metadata } from "next";
import { ReactNode } from "react";

import { MousePointer } from "@/components/mouse-pointer";
import { Navbar } from "@/components/navbar";
import { ParticlesContainer } from "@/components/particles-container";
import { Inter, Montserrat, Poppins } from "next/font/google";
import "../globals.css";

type Props = {
    children: ReactNode;
};

export const metadata: Metadata = {
    metadataBase: new URL("https://alexdevlab.com"),
    title: "Alexandre Adolphe - AlexDevLab | Developpeur front île de la réunion 🏝️",
    description:
        "Alexandre Adolphe développeur front freelance basé à l'île de la Réunion. Intégration web de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets.",
    keywords: [
        "developpeur",
        "developer",
        "alexandre adolphe",
        "alex devlab",
        "alexdevlab freelance",
        "developpeur front",
        "front-end developer",
        "ile de la reunion",
        "freelance",
        "developpeur reunion",
        "developpeur ile de la reunion",
    ],
    openGraph: {
        title: "Alexandre Adolphe - AlexDevLab | Developpeur front île de la réunion 🏝️",
        description:
            "Alexandre Adolphe développeur front freelance basé à l'île de la Réunion. Intégration web de vos maquettes, développement de vos interfaces front. N'hésitez pas à me contacter pour tous vos projets.",
        url: "https://alexdevlab.com/",
        type: "website",
    },
};

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
});

const inter = Inter({
    weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const montserrat = Montserrat({
    weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-montserrat",
});

export default function RootLayout({ children }: Props) {
    return (
        <html
            lang="fr"
            className={`${poppins.variable} ${inter.variable} ${montserrat.variable}`}
            suppressHydrationWarning
        >
            <body>
                <ParticlesContainer />
                <MousePointer />
                <main
                    className="relative m-0 h-screen w-screen overflow-hidden bg-transparent p-0 before:absolute
                        before:-left-52 before:-top-52 before:z-10 before:h-[500px] before:w-[500px] before:rounded-full
                        before:bg-white before:opacity-20 before:blur-[200px] before:content-[''] after:absolute
                        after:-bottom-52 after:-right-52 after:z-10 after:h-[500px] after:w-[500px] after:rounded-full
                        after:bg-primary after:opacity-20 after:blur-[200px] after:content-['']"
                >
                    <div className="flex h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth">
                        <div className="container m-auto flex flex-col py-10">
                            <Navbar />
                            {children}
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}
