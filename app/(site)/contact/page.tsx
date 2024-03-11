"use client";

import { Linkedin, MapPin, MoveUpRight, Send } from "lucide-react";
import React from "react";
import { ContactForm } from "@/components/contact-page/contact-form";
import Link from "next/link";

export default function ContactPage() {
    return (
        <section className="grid grid-cols-12">
            <div className="col-span-4 flex flex-col gap-5">
                <h1 className="font-semibold text-primary">Contact info</h1>
                <h2 className="text-4xl font-semibold text-white">Get in touch</h2>
                <p className="font-semibold text-muted-foreground">Don&apos;t be afraid !</p>
                <ul className="flex flex-col gap-8">
                    <li className="group inline-flex items-center gap-5">
                        <div
                            className="flex h-20 w-20 items-center justify-center rounded-full border border-white
                                transition-all duration-300 ease-in-out group-hover:border-primary"
                        >
                            <Send className="stroke-primary" strokeWidth={1} size={32} />
                        </div>
                        <div className="flex flex-col gap-2 text-white">
                            <p className="text-xl font-semibold">Email</p>
                            <p>alexandre.adolphepro@gmail.com</p>
                        </div>
                    </li>
                    <li className="group inline-flex items-center gap-5">
                        <div
                            className="flex h-20 w-20 items-center justify-center rounded-full border border-white
                                transition-all duration-300 ease-in-out group-hover:border-primary"
                        >
                            <MapPin className="stroke-primary" strokeWidth={1} size={32} />
                        </div>
                        <div className="flex flex-col gap-2 text-white">
                            <p className="text-xl font-semibold">Adresse</p>
                            <p>île de la Réunion 🇷🇪</p>
                        </div>
                    </li>
                    <li className="group inline-flex items-center gap-5">
                        <div
                            className="flex h-20 w-20 items-center justify-center rounded-full border border-white
                                transition-all duration-300 ease-in-out group-hover:border-primary"
                        >
                            <Linkedin className="stroke-primary" strokeWidth={1} size={32} />
                        </div>
                        <div className="flex flex-col gap-2 text-white">
                            <p className="text-xl font-semibold">Linkedin</p>
                            <Link
                                href="https://www.linkedin.com/in/alexandre-adolphe-817059146/"
                                target="_blank"
                                className="inline-flex items-center gap-1 transition-all duration-300 ease-in-out
                                    hover:text-primary"
                            >
                                <span>Voir le profil</span> <MoveUpRight size={16} />
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
            <ContactForm />
        </section>
    );
}
