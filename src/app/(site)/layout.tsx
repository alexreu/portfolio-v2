import { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { MousePointer } from "@/components/effects/mouse-pointer";
import { ParticlesContainer } from "@/components/effects/particles-container";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

type Props = {
    children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
    return (
        <SmoothScroll>
            <ParticlesContainer />
            <div className="relative z-10">
                <Header />
                <main className="mx-auto max-w-350 space-y-8 px-6 py-8">{children}</main>
                <Footer />
            </div>
            <Toaster />
        </SmoothScroll>
    );
}
