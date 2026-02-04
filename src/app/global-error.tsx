"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        // Log to monitoring service
        if (process.env.NODE_ENV === "development") {
            console.error("Global error:", error.message);
        }
    }, [error]);

    return (
        <html lang="fr">
            <body className="bg-[#0A090D] text-white">
                <div className="flex min-h-screen items-center justify-center px-4">
                    <div className="w-full max-w-md text-center">
                        <div className="mb-6 text-6xl">⚠️</div>

                        <h1 className="mb-4 text-2xl font-bold">Erreur critique</h1>

                        <p className="mb-8 text-gray-300">
                            Une erreur inattendue s&apos;est produite. Veuillez rafraîchir la page.
                        </p>

                        <button
                            onClick={reset}
                            className="rounded-full bg-[#FF4D4D] px-8 py-4 font-semibold text-white transition-all hover:opacity-90"
                        >
                            Rafraîchir la page
                        </button>

                        {process.env.NODE_ENV === "development" && error.digest && (
                            <p className="mt-6 text-xs text-gray-600">Error ID: {error.digest}</p>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
