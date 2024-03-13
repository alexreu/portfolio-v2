"use client";

import { MapPin, MoveUpRight, Send, Share2 } from "lucide-react";
import React from "react";
import { ContactForm } from "@/components/contact-page/contact-form";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "tween" }}
            className="grid grid-cols-12"
        >
            <motion.div
                initial={{ translateX: -200 }}
                animate={{ translateX: 0 }}
                transition={{ duration: 0.3, type: "tween" }}
                className="col-span-4 flex flex-col gap-5"
            >
                <h1 className="font-semibold text-primary">Contact info</h1>
                <h2 className="text-4xl font-semibold text-white">Get in touch</h2>
                <p className="font-semibold text-muted-foreground">Don&apos;t be afraid !</p>
                <ul className="flex flex-col gap-8">
                    <li className="group inline-flex items-center gap-5">
                        <div
                            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white
                                transition-all duration-300 ease-in-out group-hover:border-primary"
                        >
                            <Send className="stroke-primary" strokeWidth={1} size={32} />
                        </div>
                        <div className="flex flex-col gap-2 text-white">
                            <p className="text-xl font-semibold">Email</p>
                            <p>contact@alexdevlab.com</p>
                        </div>
                    </li>
                    <li className="group inline-flex items-center gap-5">
                        <div
                            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white
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
                            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white
                                transition-all duration-300 ease-in-out group-hover:border-primary"
                        >
                            <Share2 className="stroke-primary" strokeWidth={1} size={32} />
                        </div>
                        <div className="flex flex-col gap-2 text-white">
                            <p className="text-xl font-semibold">Freelancer</p>
                            <Link
                                href="https://www.malt.fr/profile/alexandreadolphe"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Profile freelance Alexandre ADOLPHE sur la plateforme MALT"
                                className="inline-flex items-center gap-1 transition-all duration-300 ease-in-out
                                    hover:text-primary"
                            >
                                <span>Voir le profil</span> <MoveUpRight size={16} />
                            </Link>
                        </div>
                    </li>
                </ul>
            </motion.div>
            <ContactForm />
        </motion.section>
    );
}
