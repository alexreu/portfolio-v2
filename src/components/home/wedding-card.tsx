import Image from "next/image";
import Link from "next/link";
import { weddingPhotos } from "@/content/wedding-photos";
import { ArrowRight, BarChart3, Link2, Mail, QrCode } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { cardCormorant, cardPinyon } from "@/app/fonts/wedding-card";

const features = [
    { icon: Mail, label: "Faire-part animé" },
    { icon: Link2, label: "Réponses en 30 secondes" },
    { icon: QrCode, label: "Galerie invités par QR" },
    { icon: BarChart3, label: "Tableau de bord mariés" },
] as const;

/** The ivory faire-part shown inside the dark portfolio: the wedding page's break, previewed. */
const InvitationPreview = () => (
    <div aria-hidden="true" className="relative h-96 overflow-hidden sm:h-[26rem] lg:h-auto">
        <div className="absolute top-10 -right-8 h-[78%] w-[62%] rotate-[4deg] overflow-hidden rounded-xs">
            <Image
                src={weddingPhotos.arch.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 28vw, 60vw"
                className="object-cover brightness-[0.85] grayscale-[0.15]"
            />
        </div>
        <div className="bg-wed-paper text-wed-ink before:border-wed-line absolute top-8 left-[8%] flex aspect-[3/4.1] w-[min(56%,300px)] -rotate-[5deg] flex-col items-center justify-center px-6 py-7 text-center shadow-2xl shadow-black/70 transition-transform duration-500 group-hover:-rotate-2 before:absolute before:inset-2 before:border motion-reduce:transition-none lg:w-[min(44%,300px)]">
            <p className="text-wed-muted text-[0.7rem]">
                Faire-part pour
                <span className="font-wed-serif text-wed-ink block text-base italic">
                    Marie &amp; Thomas
                </span>
            </p>
            <p className="font-demo-script my-3 text-[clamp(1.9rem,3vw,2.75rem)] leading-[0.95]">
                Camille
                <span className="font-wed-serif text-wed-gold my-1 block text-[0.5em] italic">
                    &amp;
                </span>
                Hugo
            </p>
            <p className="text-wed-ink-soft text-[0.7rem]">12 juin 2027 · Luberon</p>
            <span className="bg-demo-olive text-demo-card font-wed-serif mt-4 grid size-11 place-items-center rounded-full text-sm italic shadow-[inset_0_0_0_4px_var(--demo-olive-dark)]">
                C·H
            </span>
        </div>
        <p className="bg-background/90 absolute bottom-7 left-[6%] z-10 flex items-center gap-3 rounded-xl border border-white/10 px-3.5 py-3 text-sm text-gray-200 backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>
                <b className="font-semibold">Marie</b> a répondu · 2 présents au dîner
            </span>
        </p>
    </div>
);

export const WeddingCard = () => (
    <GlassCard>
        <section
            aria-labelledby="mariage-carte-titre"
            className={cn(
                cardCormorant.variable,
                cardPinyon.variable,
                "grid min-h-[34rem] lg:grid-cols-[1.05fr_1fr]",
            )}
        >
            <div className="relative z-10 flex flex-col p-6 md:p-12">
                <p className="text-primary flex items-center gap-2.5 text-sm font-semibold tracking-wider uppercase">
                    Sites de mariage
                    <span className="bg-wed-gold-soft text-background rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium tracking-normal normal-case">
                        Nouveau
                    </span>
                </p>
                <h2
                    id="mariage-carte-titre"
                    className="text-accent mt-4 text-3xl leading-tight font-bold tracking-tight md:text-[2.6rem]"
                >
                    Votre mariage mérite mieux{" "}
                    <em className="font-wed-serif text-wed-gold-soft text-[1.15em] font-medium italic">
                        qu&apos;un template.
                    </em>
                </h2>
                <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-gray-300">
                    Faire-part numérique, réponses de vos invités, programme du jour J et photos
                    partagées : un site unique, avec un lien personnel par foyer et un tableau de
                    bord pour vous.
                </p>
                <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {features.map(({ icon: Icon, label }) => (
                        <li
                            key={label}
                            className="flex items-center gap-2.5 text-[0.95rem] text-gray-300"
                        >
                            <Icon
                                aria-hidden="true"
                                className="text-wed-gold-soft size-4.5 shrink-0"
                            />
                            {label}
                        </li>
                    ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-3.5 pt-9">
                    <Button variant="primary" asChild>
                        <Link href="/mariage">
                            Découvrir l&apos;offre
                            <ArrowRight
                                aria-hidden="true"
                                className="size-4 transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/mariage/demo">Voir le site démo</Link>
                    </Button>
                    <span className="text-sm text-gray-400">
                        dès <b className="text-foreground font-semibold">290 €</b>
                    </span>
                </div>
            </div>
            <InvitationPreview />
        </section>
    </GlassCard>
);
