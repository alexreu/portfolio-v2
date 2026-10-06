import { ReactNode } from "react";
import { Viewport } from "next";
import { Jost, Newsreader, Pinyon_Script } from "next/font/google";

const newsreader = Newsreader({
    subsets: ["latin"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-newsreader",
});

const jost = Jost({ subsets: ["latin"], display: "swap", variable: "--font-jost" });

const pinyon = Pinyon_Script({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-pinyon",
});

/** The couple's own site: no portfolio header, paper tones up to the browser chrome. */
export const viewport: Viewport = {
    themeColor: "#EFEAE0",
    colorScheme: "light",
};

type Props = {
    children: ReactNode;
};

export default function DemoLayout({ children }: Props) {
    return (
        <div
            className={`${newsreader.variable} ${jost.variable} ${pinyon.variable} bg-demo-paper text-demo-ink font-demo-sans min-h-dvh`}
        >
            {children}
        </div>
    );
}
