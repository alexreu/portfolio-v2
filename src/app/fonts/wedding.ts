import { Cormorant_Garamond, Jost, Newsreader, Pinyon_Script } from "next/font/google";

/** /mariage headings. */
export const cormorant = Cormorant_Garamond({
    weight: ["400", "500"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-cormorant",
});

/** Demo site: titles, body text and the couple's names. */
export const newsreader = Newsreader({
    subsets: ["latin"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-newsreader",
});

export const jost = Jost({ subsets: ["latin"], display: "swap", variable: "--font-jost" });

export const pinyon = Pinyon_Script({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-pinyon",
});
