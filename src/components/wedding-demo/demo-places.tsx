import Image from "next/image";

import { DemoHeading } from "./demo-heading";

type Place = {
    readonly name: string;
    readonly address: string;
    readonly note: string;
    readonly photo: { readonly src: string; readonly alt: string };
};

const directions = (address: string) => [
    {
        label: "Google Maps",
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    },
    { label: "Plans", href: `https://maps.apple.com/?q=${encodeURIComponent(address)}` },
    { label: "Waze", href: `https://waze.com/ul?q=${encodeURIComponent(address)}` },
];

export const DemoPlaces = ({ places }: { places: readonly Place[] }) => (
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
                            <h3 className="font-demo-serif text-3xl leading-tight">{place.name}</h3>
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
                                        className="border-demo-line hover:border-demo-ink inline-flex min-h-11 items-center rounded-xs border px-3.5 text-sm"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    </section>
);
