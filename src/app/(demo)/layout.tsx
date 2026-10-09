import { ReactNode } from "react";
import { Viewport } from "next";

import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { jost, newsreader, pinyon } from "@/app/fonts/wedding";

/** The couple's own site: no portfolio header, paper tones up to the browser chrome. */
export const viewport: Viewport = {
    themeColor: "#EFEAE0",
    colorScheme: "light",
};

type Props = {
    children: ReactNode;
};

/**
 * Same smooth scroll as the portfolio; anchors stop under the 64 px sticky nav.
 * Focus rings take the couple's olive instead of the portfolio red.
 */
export default function DemoLayout({ children }: Props) {
    return (
        <SmoothScroll anchorOffset={64}>
            <div
                className={`${newsreader.variable} ${jost.variable} ${pinyon.variable} bg-demo-paper text-demo-ink font-demo-sans min-h-dvh [--primary:var(--demo-olive-dark)]`}
            >
                {children}
            </div>
        </SmoothScroll>
    );
}
