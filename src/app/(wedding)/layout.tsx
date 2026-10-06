import { ReactNode } from "react";
import { Cormorant_Garamond } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

const cormorant = Cormorant_Garamond({
    weight: ["400", "500"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-cormorant",
});

type Props = {
    children: ReactNode;
};

/** The dark portfolio frames an ivory page: same header and footer, no particles. */
export default function WeddingLayout({ children }: Props) {
    return (
        <SmoothScroll>
            <div className={`${cormorant.variable} relative z-10`}>
                <Header />
                <main className="bg-wed-ivory text-wed-ink">{children}</main>
                <Footer renderedYear={new Date().getFullYear()} />
            </div>
            <Toaster />
        </SmoothScroll>
    );
}
