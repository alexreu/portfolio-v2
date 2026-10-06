import { ReactNode } from "react";
import { Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { WeddingHeader } from "@/components/wedding/wedding-header";

const cormorant = Cormorant_Garamond({
    weight: ["400", "500"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-cormorant",
});

/** Browser chrome matches the ivory page instead of the dark portfolio. */
export const viewport: Viewport = {
    themeColor: "#F4F0E8",
    colorScheme: "light",
};

type Props = {
    children: ReactNode;
};

/** An ivory page with its own navigation and a way back to the portfolio; no particles. */
export default function WeddingLayout({ children }: Props) {
    return (
        <SmoothScroll>
            <div className={`${cormorant.variable} relative z-10`}>
                <WeddingHeader />
                <main className="bg-wed-ivory text-wed-ink">{children}</main>
                <Footer renderedYear={new Date().getFullYear()} tone="ivory" />
            </div>
            <Toaster />
        </SmoothScroll>
    );
}
