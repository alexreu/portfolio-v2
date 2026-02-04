import { Metadata } from "next";
import { Wrench } from "lucide-react";

export const metadata: Metadata = {
    title: "Maintenance en cours | AlexDevLab",
    description: "Le site est actuellement en maintenance. Nous serons de retour très bientôt.",
    robots: "noindex, nofollow",
};

export default function MaintenancePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-lg text-center">
                {/* Animated icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/30 blur-2xl" />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                            <Wrench
                                className="h-12 w-12 animate-[spin_3s_ease-in-out_infinite] text-primary"
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="mb-4 text-3xl font-bold text-accent md:text-4xl">
                    Maintenance en cours
                </h1>

                {/* Description */}
                <p className="mb-8 text-lg leading-relaxed text-gray-400">
                    Je travaille actuellement sur des améliorations pour vous offrir
                    une meilleure expérience. Le site sera de retour très bientôt.
                </p>

                {/* Progress indicator */}
                <div className="mb-8">
                    <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-primary to-primary-light" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        Mise à jour en cours...
                    </p>
                </div>

                {/* Contact info */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="mb-2 text-sm text-gray-400">
                        Besoin de me contacter en urgence ?
                    </p>
                    <a
                        href="mailto:contact@alexdevlab.com"
                        className="font-semibold text-primary transition-colors hover:text-primary-light"
                    >
                        contact@alexdevlab.com
                    </a>
                </div>

                {/* Footer */}
                <p className="mt-8 text-sm text-gray-600">
                    Merci de votre patience !
                </p>
            </div>
        </div>
    );
}
