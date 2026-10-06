import Image from "next/image";
import Link from "next/link";
import { weddingPhotos } from "@/content/wedding-photos";

import type { WeddingService } from "@/lib/wedding-service/types";

type WeddingDemoBandProps = {
    demo: WeddingService["demo"];
};

export const WeddingDemoBand = ({ demo }: WeddingDemoBandProps) => (
    <section id="demo" aria-labelledby="demo-titre" className="bg-wed-night text-wed-night-text">
        <div className="grid lg:min-h-[40rem] lg:grid-cols-[1.25fr_1fr]">
            <div className="relative h-80 sm:h-[26rem] lg:h-auto">
                <Image
                    src={weddingPhotos.courtyard.src}
                    alt={weddingPhotos.courtyard.alt}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover brightness-[0.92] saturate-[0.8]"
                />
            </div>
            <div className="flex flex-col justify-center px-6 py-14 md:px-16 md:py-20">
                <p className="text-wed-gold-soft text-xs font-medium tracking-[0.18em] uppercase">
                    Projet d&apos;exemple
                </p>
                <h2
                    id="demo-titre"
                    className="font-wed-serif mt-4 text-5xl leading-none italic md:text-7xl"
                >
                    {demo.couple}
                </h2>
                <p className="font-wed-serif text-wed-night-muted mt-3 text-xl italic">
                    {demo.date}
                </p>
                <p className="text-wed-night-muted mt-7 max-w-[44ch]">{demo.text}</p>
                <ul className="mt-8 grid gap-3 text-[0.95rem]">
                    {demo.highlights.map((highlight, index) => (
                        <li
                            key={highlight}
                            className="border-wed-night-line flex items-baseline gap-3 border-b pb-3"
                        >
                            <span className="font-wed-serif text-wed-gold-soft min-w-6 italic">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            {highlight}
                        </li>
                    ))}
                </ul>
                <Link
                    href="/mariage/demo"
                    className="bg-wed-ivory text-wed-ink hover:bg-wed-paper mt-10 inline-flex min-h-12 w-fit items-center rounded-sm px-6 font-medium transition-colors"
                >
                    Ouvrir le site démo
                </Link>
            </div>
        </div>
    </section>
);
