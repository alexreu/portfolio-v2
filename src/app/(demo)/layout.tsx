import { ReactNode } from "react";
import { Viewport } from "next";

import { jost, newsreader, pinyon } from "@/app/fonts/wedding";

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
