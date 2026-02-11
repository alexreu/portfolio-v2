import { ReactNode } from "react";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type LegalSectionProps = {
    number: string;
    title: string;
    children: ReactNode;
};

export const LegalSection = ({ number, title, children }: LegalSectionProps) => {
    return (
        <section className="space-y-4">
            <h2 className="text-accent flex items-baseline gap-3 text-xl font-semibold md:text-2xl">
                <span className="text-primary font-bold opacity-80">§{number}</span>
                {title}
            </h2>
            <div className="space-y-3 leading-relaxed text-gray-400">{children}</div>
        </section>
    );
};

type LegalPageLayoutProps = {
    title: string;
    lastUpdated: string;
    children: ReactNode;
};

export const LegalPageLayout = ({ title, lastUpdated, children }: LegalPageLayoutProps) => {
    return (
        <div className="py-8 md:py-16">
            {/* Back link */}
            <Link
                href="/"
                className="group text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-2 text-sm transition-colors"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Retour à l&apos;accueil
            </Link>

            {/* Header */}
            <div className="mb-10 md:mb-14">
                <h1 className="text-accent text-3xl font-bold md:text-4xl lg:text-5xl">
                    {title}
                </h1>
                <p className="text-muted-foreground mt-3 text-sm">
                    Dernière mise à jour : {lastUpdated}
                </p>
            </div>

            {/* Content card */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm md:p-10 lg:p-14">
                <div className="space-y-10">{children}</div>
            </div>
        </div>
    );
};
