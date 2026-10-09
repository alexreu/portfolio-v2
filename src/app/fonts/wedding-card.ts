import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";

/**
 * The home's wedding card, below the fold: its fonts load when it shows, not with the page.
 * Preloading the wedding fonts held up the home's first load, and their late swap jolted the
 * scroll. Same CSS variables as `wedding.ts`, so the card's classes stay the wedding page's.
 */
export const cardCormorant = Cormorant_Garamond({
    weight: ["400", "500"],
    style: "italic",
    subsets: ["latin"],
    display: "swap",
    preload: false,
    variable: "--font-cormorant",
});

export const cardPinyon = Pinyon_Script({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    preload: false,
    variable: "--font-pinyon",
});
