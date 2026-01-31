import { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { BackHome } from "@/components/back-home";
import { Footer } from "@/components/footer";
import { MousePointer } from "@/components/mouse-pointer";
import { Navbar } from "@/components/navbar";
import { ParticlesContainer } from "@/components/particles-container";

type Props = {
    children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
    return (
        <>
            <ParticlesContainer />
            <MousePointer />
            <main className="after:bg-primary relative m-0 h-screen w-screen overflow-hidden bg-transparent p-0 before:absolute before:-top-52 before:-left-52 before:z-10 before:hidden before:h-125 before:w-125 before:rounded-full before:bg-white before:opacity-20 before:blur-[200px] before:content-[''] after:absolute after:-right-52 after:-bottom-52 after:z-10 after:hidden after:h-125 after:w-125 after:rounded-full after:opacity-20 after:blur-[200px] after:content-[''] 2xl:before:block 2xl:after:block">
                <div className="flex h-full w-full overflow-x-hidden overflow-y-auto scroll-smooth">
                    <div className="container m-auto flex flex-col py-10">
                        <Navbar />
                        <BackHome />
                        {children}
                        <Footer />
                    </div>
                </div>
            </main>
            <Toaster />
        </>
    );
}
