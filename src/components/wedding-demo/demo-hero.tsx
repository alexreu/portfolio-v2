"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { countdownTo, type Countdown } from "@/lib/wedding/countdown";

type DemoHeroProps = {
    first: string;
    second: string;
    dateLabel: string;
    venue: string;
    guestName: string;
    ceremonyAt: string;
    photo: { readonly src: string; readonly alt: string };
};

/** Ticks on the client only, so server and browser render the same first frame. */
const useCountdown = (target: string): Countdown | null => {
    const [countdown, setCountdown] = useState<Countdown | null>(null);
    useEffect(() => {
        const tick = () => setCountdown(countdownTo(target, new Date()));
        tick();
        const timer = window.setInterval(tick, 30_000);
        return () => window.clearInterval(timer);
    }, [target]);
    return countdown;
};

export const DemoHero = ({
    first,
    second,
    dateLabel,
    venue,
    guestName,
    ceremonyAt,
    photo,
}: DemoHeroProps) => {
    const countdown = useCountdown(ceremonyAt);
    const units = [
        { value: countdown?.days, label: "jours" },
        { value: countdown?.hours, label: "heures" },
        { value: countdown?.minutes, label: "minutes" },
    ];

    return (
        <section aria-labelledby="couple" className="pt-10">
            <div className="mx-auto grid max-w-310 items-end gap-6 px-4 md:grid-cols-2 md:px-7">
                <h1
                    id="couple"
                    className="font-demo-script text-[clamp(4rem,10vw,9rem)] leading-[1.02] font-normal"
                >
                    {first}
                    <br />
                    <span className="inline-block pl-[0.7em] whitespace-nowrap">
                        <span className="font-demo-serif text-demo-earth-dark mr-[0.15em] inline-block -translate-y-[0.6em] text-[0.4em] italic">
                            &amp;
                        </span>
                        {second}
                    </span>
                </h1>
                <div className="flex flex-col gap-5 pb-4">
                    <p className="font-demo-serif text-3xl leading-tight">
                        {dateLabel}
                        <span className="font-demo-sans text-demo-muted mt-1.5 block text-[0.95rem]">
                            {venue}
                        </span>
                    </p>
                    <p className="text-demo-ink-2 max-w-[40ch]">
                        Chers {guestName}, nous nous marions et nous aimerions beaucoup que vous
                        soyez là, pour la cérémonie et pour le dîner.
                    </p>
                </div>
            </div>
            <div className="mx-auto mt-10 max-w-350 px-4 md:px-7">
                <div className="relative h-[62vh] overflow-hidden md:h-[min(78vh,760px)]">
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-[center_35%]"
                    />
                    <dl
                        aria-label="Compte à rebours"
                        className="bg-demo-card absolute inset-x-4 bottom-4 flex justify-between gap-5 px-5 py-4 md:inset-x-auto md:right-7 md:bottom-7"
                    >
                        {units.map((unit) => (
                            <div key={unit.label} className="text-center">
                                <dd className="font-demo-serif text-4xl leading-none">
                                    {unit.value === undefined
                                        ? "–"
                                        : String(unit.value).padStart(
                                              unit.label === "jours" ? 1 : 2,
                                              "0",
                                          )}
                                </dd>
                                <dt className="text-demo-muted text-[0.8rem]">{unit.label}</dt>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
};
