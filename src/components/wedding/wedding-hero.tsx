import Image from "next/image";
import Link from "next/link";
import { weddingPhotos } from "@/content/wedding-photos";
import { ArrowRight } from "lucide-react";

import type { WeddingService } from "@/lib/wedding-service/types";

import { EmphasisHeading } from "./emphasis-heading";

type WeddingHeroProps = {
    hero: WeddingService["hero"];
};

const PhonePreview = () => (
    <div
        aria-hidden="true"
        className="bg-wed-night shadow-wed-ink/40 absolute bottom-0 left-0 h-[30rem] w-60 rounded-[2.25rem] p-2.5 shadow-2xl md:h-[34rem] md:w-68"
    >
        <div className="bg-wed-paper flex h-full flex-col overflow-hidden rounded-[1.8rem]">
            <div className="relative h-3/5">
                <Image
                    src={weddingPhotos.arch.src}
                    alt=""
                    fill
                    sizes="272px"
                    className="object-cover"
                />
                <div className="to-wed-night/80 absolute inset-0 bg-linear-to-b from-transparent from-30%" />
                <p className="font-wed-serif text-wed-paper absolute right-4 bottom-4 left-4 text-3xl leading-none italic">
                    Camille
                    <br />& Hugo
                    <span className="mt-2 block font-sans text-[0.7rem] tracking-[0.18em] uppercase not-italic">
                        12 · 06 · 2027 — Luberon
                    </span>
                </p>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="font-wed-serif text-lg leading-tight">Chers Marie &amp; Thomas,</p>
                <p className="text-wed-muted text-xs leading-relaxed">
                    Nous serions heureux de vous compter parmi nous pour la cérémonie et le dîner.
                </p>
                <p className="bg-wed-ink text-wed-paper mt-auto rounded-sm py-2.5 text-center text-xs">
                    Répondre avant le 1er mai
                </p>
            </div>
        </div>
    </div>
);

export const WeddingHero = ({ hero }: WeddingHeroProps) => (
    <section aria-labelledby="mariage-titre" className="overflow-hidden">
        <div className="mx-auto grid max-w-300 items-center gap-14 px-6 pt-14 pb-20 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
                <EmphasisHeading
                    as="h1"
                    id="mariage-titre"
                    heading={hero.heading}
                    className="text-5xl leading-[1.02] md:text-7xl lg:text-[5.25rem]"
                />
                <p className="text-wed-muted mt-7 max-w-[56ch] text-lg leading-relaxed">
                    {hero.lead}
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                    <a
                        href="#contact"
                        className="bg-wed-ink text-wed-paper inline-flex min-h-12 items-center gap-2.5 rounded-sm px-6 text-[0.95rem] font-medium transition-colors hover:bg-black"
                    >
                        Parler de mon mariage
                        <ArrowRight aria-hidden="true" className="size-4" />
                    </a>
                    <Link
                        href="/mariage/demo"
                        className="border-wed-ink hover:bg-wed-ink hover:text-wed-paper inline-flex min-h-12 items-center rounded-sm border px-6 text-[0.95rem] font-medium transition-colors"
                    >
                        Voir le site démo
                    </Link>
                </div>
                <dl className="border-wed-line text-wed-muted mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t pt-7 text-sm">
                    {hero.facts.map((fact) => (
                        <div key={fact.label}>
                            <dt className="sr-only">{fact.label}</dt>
                            <dd>
                                <span className="font-wed-serif text-wed-ink block text-3xl leading-tight">
                                    {fact.value}
                                </span>
                                {fact.label}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
            <div className="relative h-[32rem] w-full max-w-lg md:h-[38rem] lg:max-w-none">
                <div className="absolute top-0 right-0 h-[88%] w-[78%] overflow-hidden rounded-xs">
                    <Image
                        src={weddingPhotos.backToBack.src}
                        alt=""
                        fill
                        priority
                        sizes="(min-width: 1024px) 40vw, 80vw"
                        className="object-cover saturate-[0.85]"
                    />
                </div>
                <PhonePreview />
                <div
                    aria-hidden="true"
                    className="border-wed-line bg-wed-paper shadow-wed-ink/10 absolute right-0 bottom-24 rounded-md border px-4 py-3 text-sm shadow-lg"
                >
                    <p className="text-wed-muted text-[0.7rem] tracking-[0.14em] uppercase">
                        Réponses reçues
                    </p>
                    <p className="font-wed-serif text-3xl leading-tight">
                        86 <span className="text-wed-muted text-base">/ 121</span>
                    </p>
                    <div className="bg-wed-line-soft mt-2 h-1 w-44 overflow-hidden rounded-full">
                        <div className="bg-wed-yes h-full w-[71%]" />
                    </div>
                </div>
            </div>
        </div>
    </section>
);
