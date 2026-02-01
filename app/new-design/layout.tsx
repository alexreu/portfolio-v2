import { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { BackHome } from "@/components/back-home";
import { Footer } from "@/components/footer";
import { MousePointer } from "@/components/mouse-pointer";
import { Navbar } from "@/components/navbar";
import { BentoGrid } from "@/components/new-design/BentoGrid";
import { Header } from "@/components/new-design/Header";
import { HeroSection } from "@/components/new-design/HeroSection";
import { ParticlesContainer } from "@/components/particles-container";

type Props = {
    children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
    return (
        <>
            <ParticlesContainer />
            <MousePointer />
            <div className="relative z-10">
                <Header />
                <main className="mx-auto max-w-350 space-y-8 px-6 py-8">
                    <HeroSection />
                    <BentoGrid />
                    {children}
                </main>
            </div>
            <Toaster />
        </>
    );
}
