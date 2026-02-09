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
        // Log error to monitoring service (Sentry, etc.)
        // For now, just log to console in development
        if (process.env.NODE_ENV === "development") {
            console.error("Page error:", error.message);
        }
    }, [error]);

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md text-center"
            >
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <div className="bg-primary absolute inset-0 rounded-full opacity-20 blur-2xl" />
                        <AlertTriangle
                            className="text-primary relative h-16 w-16"
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                <h1 className="text-accent mb-4 text-2xl font-bold md:text-3xl">
                    Une erreur est survenue
                </h1>

                <p className="mb-8 text-gray-300">
                    Désolé, quelque chose s&apos;est mal passé. Veuillez réessayer ou revenir plus
                    tard.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button variant="primary" onClick={reset}>
                        <RefreshCw className="h-5 w-5" />
                        Réessayer
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href="/">
                            <Home className="h-5 w-5" />
                            Retour à l&apos;accueil
                        </Link>
                    </Button>
                </div>

                {process.env.NODE_ENV === "development" && error.digest && (
                    <p className="mt-6 text-xs text-gray-600">Error ID: {error.digest}</p>
                )}
            </motion.div>
        </div>
    );
}
