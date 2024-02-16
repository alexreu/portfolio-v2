import Link from "next/link";
import Image from "next/image";
import { MoveUpRight } from "lucide-react";
import React from "react";

export const Navbar = () => {
    return (
        <header role="banner">
            <nav
                className="mb-5 flex w-full items-center justify-between rounded-xl bg-card px-8 py-3 opacity-100
                    backdrop-blur-xl"
            >
                <Link href="#" className="font-bold text-primary">
                    <Image src="/images/logo-text-white.png" alt="" width={110} height={100} />
                </Link>
                <ul className="flex h-full gap-5 font-main text-base font-medium leading-3 text-white">
                    <li className="h-full">
                        <Link href="/" className="transition-all duration-200 ease-in-out hover:text-primary">
                            Accueil
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="transition-all duration-200 ease-in-out hover:text-primary">
                            A propos
                        </Link>
                    </li>
                    <li>
                        <Link href="/services" className="transition-all duration-200 ease-in-out hover:text-primary">
                            Services
                        </Link>
                    </li>
                    <li>
                        <Link href="/pricing" className="transition-all duration-200 ease-in-out hover:text-primary">
                            Tarifs
                        </Link>
                    </li>
                </ul>
                <Link
                    href="/contact"
                    className="inline-flex items-center justify-between gap-2 rounded-full bg-primary px-4 py-2
                        font-medium text-white transition-all duration-200 ease-in-out hover:bg-white hover:text-primary"
                >
                    Let's Talk
                    <MoveUpRight size={18} strokeWidth={3} />
                </Link>
            </nav>
        </header>
    );
};
