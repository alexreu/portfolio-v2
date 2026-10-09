import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { WeddingService } from "@/lib/wedding-service/types";

import { EmphasisHeading } from "./emphasis-heading";

type WeddingAboutProps = {
    about: WeddingService["about"];
};

/**
 * Who makes the site: a face, a few words, what working together means. The portfolio is a
 * quiet link below, for whoever wants more: the couple stays on the offer meanwhile.
 */
export const WeddingAbout = ({ about }: WeddingAboutProps) => (
    <section
        id="qui-suis-je"
        aria-labelledby="qui-suis-je-titre"
        className="bg-wed-paper scroll-mt-24 py-20 md:py-28"
    >
        <div className="mx-auto grid max-w-300 items-center gap-10 px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
            <div className="relative mx-auto w-full max-w-sm md:max-w-none">
                <Image
                    src={about.photo.src}
                    alt={about.photo.alt}
                    width={1254}
                    height={1254}
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="aspect-[4/5] w-full rounded-sm object-cover object-[50%_20%]"
                />
                <span
                    aria-hidden="true"
                    className="border-wed-gold/40 absolute -inset-3 -z-0 hidden rounded-sm border md:block"
                />
            </div>
            <div>
                <p className="text-wed-gold text-xs font-medium tracking-[0.18em] uppercase">
                    {about.eyebrow}
                </p>
                <EmphasisHeading
                    id="qui-suis-je-titre"
                    heading={about.heading}
                    className="mt-3 text-4xl leading-[1.05] md:text-5xl"
                />
                <div className="text-wed-ink-soft mt-7 grid max-w-[60ch] gap-4 text-base leading-relaxed md:text-lg">
                    {about.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>
                <p className="border-wed-gold font-wed-serif text-wed-ink mt-8 max-w-[52ch] border-l-2 pl-5 text-2xl leading-snug italic">
                    {about.promise}
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a
                        href="#contact"
                        className="bg-wed-ink text-wed-paper inline-flex min-h-12 items-center rounded-sm px-5 font-medium transition-colors hover:bg-black"
                    >
                        Parler de mon mariage
                    </a>
                    <Link
                        href="/"
                        className="text-wed-ink-soft hover:text-wed-ink inline-flex min-h-11 items-center gap-1.5 text-sm underline-offset-4 hover:underline"
                    >
                        {about.portfolioLabel}
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                    </Link>
                </div>
            </div>
        </div>
    </section>
);
