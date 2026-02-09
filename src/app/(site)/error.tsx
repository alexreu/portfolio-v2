"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.error("Page error:", error.message);
        }
    }, [error]);

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
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
                    {/* Animated icon */}
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

                    {/* Error code */}
                    <motion.div
                        className="mb-6 text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <span className="bg-linear-to-r from-primary to-background inline-block bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
                            Oops!
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-accent mb-4 text-center text-2xl font-semibold md:text-4xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Une erreur est survenue
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        className="text-accent mx-auto mb-8 max-w-md text-center text-base leading-relaxed opacity-65 md:text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        Quelque chose s&apos;est mal passe. Veuillez reessayer ou revenir a
                        l&apos;accueil.
                    </motion.p>

                    {/* CTAs */}
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
                            onClick={reset}
                        >
                            <RefreshCw className="h-5 w-5" aria-hidden="true" />
                            Reessayer
                        </Button>

                        <Button variant="outline" className="w-full sm:w-auto" asChild>
                            <Link href="/" aria-label="Retourner a la page d'accueil">
                                <Home className="h-5 w-5" aria-hidden="true" />
                                Retour a l&apos;accueil
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Error digest */}
                {process.env.NODE_ENV === "development" && error.digest && (
                    <motion.p
                        className="text-muted-foreground mt-6 text-center text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        Error ID: {error.digest}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}
