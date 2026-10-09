"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { DemoHeading } from "./demo-heading";
import type { MapPlace } from "./places-map";

type Place = MapPlace & {
    readonly note: string;
    readonly photo: { readonly src: string; readonly alt: string };
};

/** Leaflet needs the browser: loaded on the client only. */
const PlacesMap = dynamic(() => import("./places-map").then((module) => module.PlacesMap), {
    ssr: false,
});

/** Mounted when the section comes near: no map script nor tiles for those who never get there. */
const useNear = () => {
    const anchor = useRef<HTMLDivElement>(null);
    const [near, setNear] = useState(false);
    useEffect(() => {
        if (!anchor.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setNear(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "400px 0px" },
        );
        observer.observe(anchor.current);
        return () => observer.disconnect();
    }, []);
    return { anchor, near };
};

const directions = (address: string) => [
    {
        label: "Google Maps",
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    },
    { label: "Plans", href: `https://maps.apple.com/?q=${encodeURIComponent(address)}` },
    { label: "Waze", href: `https://waze.com/ul?q=${encodeURIComponent(address)}` },
];

export const DemoPlaces = ({ places }: { places: readonly Place[] }) => {
    const { anchor, near } = useNear();
    return (
        <section id="lieux" aria-labelledby="lieux-titre" className="scroll-mt-16 py-20 md:py-30">
            <div className="mx-auto max-w-310 px-4 md:px-7">
                <DemoHeading
                    id="lieux-titre"
                    number="03"
                    label="Lieux"
                    heading={{ text: "Où nous retrouver", emphasis: "retrouver" }}
                />
                <div className="mt-14 grid gap-7 md:grid-cols-2">
                    {places.map((place) => (
                        <article key={place.name} className="bg-demo-card border-demo-line border">
                            <div className="relative aspect-[16/10]">
                                <Image
                                    src={place.photo.src}
                                    alt={place.photo.alt}
                                    fill
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="px-6 pt-6 pb-7">
                                <h3 className="font-demo-serif text-3xl leading-tight">
                                    {place.name}
                                </h3>
                                <address className="text-demo-ink-2 mt-2 mb-4 not-italic">
                                    {place.address}
                                    <br />
                                    {place.note}
                                </address>
                                <div className="flex flex-wrap gap-2">
                                    {directions(place.address).map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="border-demo-line hover:border-demo-ink inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                    <div
                        ref={anchor}
                        role="region"
                        aria-label="Carte des lieux"
                        className="border-demo-line bg-demo-paper-2 relative isolate aspect-[4/3] overflow-hidden border md:aspect-auto md:min-h-96"
                    >
                        {near && <PlacesMap places={places} />}
                    </div>
                </div>
            </div>
        </section>
    );
};
