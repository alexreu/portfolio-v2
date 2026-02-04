"use client";

import Link from "next/link";
import { AlertTriangle, Home, Mail } from "lucide-react";
import { motion } from "motion/react";

import { ParticlesContainer } from "@/components/effects/particles-container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <>
            <ParticlesContainer />
            <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8">
                <motion.div
                    className="relative z-10 w-full max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div
                        className="border-border relative overflow-hidden rounded-3xl border bg-background p-8 shadow-2xl md:p-12"
                        style={{
                            boxShadow:
                                "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px color-mix(in srgb, var(--primary) 5%, transparent)",
                        }}
                    >
                        <motion.div
                            className="mb-6 flex justify-center"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200,
                            }}
                        >
                            <div className="relative">
                                <div className="bg-primary absolute inset-0 rounded-full opacity-20 blur-2xl" />
                                <AlertTriangle
                                    className="text-primary relative h-16 w-16 md:h-20 md:w-20"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            className="mb-6 text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <motion.h1
                                className="relative inline-block bg-linear-to-r from-primary to-background bg-clip-text text-8xl font-bold text-transparent md:text-9xl"
                                style={{
                                    textShadow:
                                        "0 0 60px rgba(255, 77, 77, 0.5), 0 0 100px rgba(255, 77, 77, 0.2)",
                                }}
                                animate={{
                                    textShadow: [
                                        "0 0 60px rgba(255, 77, 77, 0.5), 0 0 100px rgba(255, 77, 77, 0.2)",
                                        "0 0 80px rgba(255, 77, 77, 0.6), 0 0 120px rgba(255, 77, 77, 0.3)",
                                        "0 0 60px rgba(255, 77, 77, 0.5), 0 0 100px rgba(255, 77, 77, 0.2)",
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                404
                            </motion.h1>
                        </motion.div>

                        {/* Titre */}
                        <motion.h2
                            className="text-accent mb-4 text-center text-2xl font-semibold md:text-4xl"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Page introuvable
                        </motion.h2>
                        <motion.p
                            className="text-accent mx-auto mb-8 max-w-md text-center text-base leading-relaxed opacity-65 md:text-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            La page que vous cherchez n&apos;existe pas ou a été déplacée. Pas
                            d&apos;inquiétude, vous pouvez retourner à l&apos;accueil.
                        </motion.p>
                        <motion.div
                            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Button
                                variant="primary"
                                withGradient
                                className="w-full rounded-xl sm:w-auto"
                                asChild
                            >
                                <Link href="/" aria-label="Retourner à la page d'accueil">
                                    <Home className="h-5 w-5" aria-hidden="true" />
                                    Retour à l&apos;accueil
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                                asChild
                            >
                                <Link href="/contact" aria-label="Aller à la page de contact">
                                    <Mail className="h-5 w-5" aria-hidden="true" />
                                    Me contacter
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                    <motion.p
                        className="text-muted-foreground mt-6 text-center text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        Code erreur : 404 - Ressource introuvable
                    </motion.p>
                </motion.div>
            </div>
        </>
    );
}
