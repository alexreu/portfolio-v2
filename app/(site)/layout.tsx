import { ReactNode } from "react";

import { MousePointer } from "@/components/mouse-pointer";
import { Navbar } from "@/components/navbar";
import { ParticlesContainer } from "@/components/particles-container";
import { Footer } from "@/components/footer";
import { BackHome } from "@/components/back-home";
import { Toaster } from "@/components/ui/toaster";

type Props = {
    children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
    return (
        <>
            <ParticlesContainer />
            <MousePointer />
            <main
                className="relative m-0 h-screen w-screen overflow-hidden bg-transparent p-0 before:absolute
                    before:-left-52 before:-top-52 before:z-10 before:hidden before:h-[500px] before:w-[500px]
                    before:rounded-full before:bg-white before:opacity-20 before:blur-[200px] before:content-['']
                    after:absolute after:-bottom-52 after:-right-52 after:z-10 after:hidden after:h-[500px]
                    after:w-[500px] after:rounded-full after:bg-primary after:opacity-20 after:blur-[200px]
                    after:content-[''] 2xl:before:block 2xl:after:block"
            >
                <div className="flex h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth">
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
