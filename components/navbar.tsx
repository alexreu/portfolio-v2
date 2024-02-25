"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, MoveUpRight } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
    const navLinks = [
        { title: "Accueil", link: "/" },
        { title: "A propos", link: "/about" },
        { title: "Services", link: "/services" },
        { title: "Tarifs", link: "/pricing" },
    ];

    return (
        <header role="banner">
            <nav
                className="mb-10 flex w-full items-center justify-between rounded-xl bg-card px-8 py-3 opacity-100
                    backdrop-blur-xl"
            >
                <Link href="#" className="font-bold text-primary">
                    <Image src="/images/logo-text-white.png" alt="" width={110} height={100} />
                </Link>
                <ul className="hidden h-full gap-5 font-main text-base font-medium leading-3 text-white xl:flex">
                    {navLinks.map(({ title, link }, i) => (
                        <li className="h-full" key={`${title}-${i}`}>
                            <Link href={link} className="transition-all duration-200 ease-in-out hover:text-primary">
                                {title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <Sheet>
                    <SheetTrigger className="text-white xl:hidden">
                        <span className="sr-only">Déplier le menu</span>
                        <Menu size={32} className="stroke-white" />
                    </SheetTrigger>
                    <SheetContent>
                        <ul className="mt-8 flex flex-col gap-5 font-main text-base font-medium leading-3 text-white">
                            {navLinks.map(({ title, link }, i) => (
                                <li className="p-2" key={`${title}-${i}`}>
                                    <Link
                                        href={link}
                                        className="transition-all duration-200 ease-in-out hover:text-primary"
                                    >
                                        {title}
                                    </Link>
                                </li>
                            ))}
                            <li className="p-2">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-between gap-2 rounded-full bg-primary
                                        px-4 py-2 font-medium text-white transition-all duration-200 ease-in-out
                                        hover:bg-white hover:text-primary"
                                >
                                    Let&#39;s Talk
                                    <MoveUpRight size={18} strokeWidth={3} />
                                </Link>
                            </li>
                        </ul>
                    </SheetContent>
                </Sheet>
                <Link
                    href="/contact"
                    className="hidden items-center justify-between gap-2 rounded-full bg-primary px-4 py-2 font-medium
                        text-white transition-all duration-200 ease-in-out hover:bg-white hover:text-primary
                        xl:inline-flex"
                >
                    Let&#39;s Talk
                    <MoveUpRight size={18} strokeWidth={3} />
                </Link>
            </nav>
        </header>
    );
};
