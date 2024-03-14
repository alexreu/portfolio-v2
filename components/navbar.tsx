"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, MoveUpRight } from "lucide-react";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    const [sheetOpen, setSheetOpen] = useState(false);

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
                <Link href="/" className="rounded-xl font-bold text-primary" aria-label="retourner à la page d'accueil">
                    <Image src="/images/logo-text-white.png" alt="" width={110} height={100} />
                </Link>
                <ul className="hidden h-full gap-8 font-main text-base font-medium leading-3 text-white xl:flex">
                    {navLinks.map(({ title, link }, i) => (
                        <li className="h-full" key={`${title}-${i}`}>
                            <Link
                                href={link}
                                className="transition-color rounded-lg duration-200 ease-in-out hover:text-primary"
                            >
                                {title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger className="text-white xl:hidden">
                        <span className="sr-only">Ouvrir le menu mobile</span>
                        <Menu size={32} className="stroke-white" />
                    </SheetTrigger>
                    <SheetContent side="right">
                        <ul className="mt-8 flex flex-col gap-5 font-main text-base font-medium leading-3 text-white">
                            {navLinks.map(({ title, link }, i) => (
                                <li className="rounded-lg p-2" key={`${title}-${i}`}>
                                    <Link
                                        href={link}
                                        className="transition-all duration-200 ease-in-out hover:text-primary"
                                        onClick={() => setSheetOpen(false)}
                                    >
                                        {title}
                                    </Link>
                                </li>
                            ))}
                            <li className="p-2">
                                <Button className="inline-flex gap-2 rounded-full" asChild>
                                    <Link href="/contact" onClick={() => setSheetOpen(false)}>
                                        Let&#39;s Talk
                                        <MoveUpRight size={18} strokeWidth={3} />
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                    </SheetContent>
                </Sheet>
                <Button
                    className="hidden gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4
                        focus-visible:outline-primary xl:inline-flex"
                    asChild
                >
                    <Link href="/contact" aria-label="formulaire de contact">
                        Let&#39;s Talk
                        <MoveUpRight size={18} strokeWidth={3} />
                    </Link>
                </Button>
            </nav>
        </header>
    );
};
