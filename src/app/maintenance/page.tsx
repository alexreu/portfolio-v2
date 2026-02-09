import { Metadata } from "next";
import { Wrench } from "lucide-react";

export const metadata: Metadata = {
    title: "Maintenance en cours | AlexDevLab",
    description: "Le site est actuellement en maintenance. Nous serons de retour très bientôt.",
    robots: "noindex, nofollow",
};

export default function MaintenancePage() {
    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-lg text-center">
                {/* Animated icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="bg-primary/30 absolute inset-0 animate-pulse rounded-full blur-2xl" />
                        <div className="bg-primary/10 relative flex h-24 w-24 items-center justify-center rounded-full">
                            <Wrench
                                className="text-primary h-12 w-12 animate-[spin_3s_ease-in-out_infinite]"
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-accent mb-4 text-3xl font-bold md:text-4xl">
                    Maintenance en cours
                </h1>

                {/* Description */}
                <p className="mb-8 text-lg leading-relaxed text-gray-300">
                    Je travaille actuellement sur des améliorations pour vous offrir une meilleure
                    expérience. Le site sera de retour très bientôt.
                </p>

                {/* Progress indicator */}
                <div className="mb-8">
                    <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-white/10">
                        <div className="from-primary to-primary-light h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Mise à jour en cours...</p>
                </div>

                {/* Contact info */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="mb-2 text-sm text-gray-300">
                        Besoin de me contacter en urgence ?
                    </p>
                    <a
                        href="mailto:contact@alexdevlab.com"
                        className="text-primary hover:text-primary-light font-semibold transition-colors"
                    >
                        contact@alexdevlab.com
                    </a>
                </div>

                {/* Footer */}
                <p className="mt-8 text-sm text-gray-600">Merci de votre patience !</p>
            </div>
        </div>
    );
}
