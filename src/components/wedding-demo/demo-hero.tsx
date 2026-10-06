"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Transition, type Variants } from "motion/react";

import { countdownTo, type Countdown } from "@/lib/wedding/countdown";

import { TickingNumber } from "./ticking-number";

type DemoHeroProps = {
    first: string;
    second: string;
    dateLabel: string;
    venue: string;
    /** The couple's greeting, already addressed to the household. */
    welcome: string;
    ceremonyAt: string;
    photo: { readonly src: string; readonly alt: string };
    /** False while the faire-part covers the page; turning true plays the entrance. */
    revealed: boolean;
};

/**
 * Ticks on the client only, so server and browser render the same first frame.
 * Each tick lands just after a whole second, so the seconds never skip or stall.
 */
const useCountdown = (target: string): Countdown | null => {
    const [countdown, setCountdown] = useState<Countdown | null>(null);
    useEffect(() => {
        let timer = 0;
        const tick = () => {
            const now = new Date();
            setCountdown(countdownTo(target, now));
            timer = window.setTimeout(tick, 1_000 - (now.getTime() % 1_000) + 10);
        };
        tick();
        return () => window.clearTimeout(timer);
    }, [target]);
    return countdown;
};

const ink = [0.65, 0, 0.35, 1] as const;
const settle = [0.22, 1, 0.36, 1] as const;

const timed = (instant: boolean, transition: Transition): Transition =>
    instant ? { duration: 0 } : transition;

/** The script's swashes overflow its box, so the mask overflows too before wiping right. */
const written = (instant: boolean, delay: number): Variants => ({
    hidden: { clipPath: "inset(-30% 100% -30% -12%)" },
    shown: {
        clipPath: "inset(-30% -12% -30% -12%)",
        transition: timed(instant, { duration: 0.95, ease: ink, delay }),
    },
});

const risen = (instant: boolean, delay: number): Variants => ({
    hidden: { opacity: 0, y: 14 },
    shown: { opacity: 1, y: 0, transition: timed(instant, { duration: 0.8, ease: settle, delay }) },
});

const faded = (instant: boolean, delay: number): Variants => ({
    hidden: { opacity: 0 },
    shown: { opacity: 1, transition: timed(instant, { duration: 0.6, delay }) },
});

const unveiled = (instant: boolean): Variants => ({
    hidden: { clipPath: "inset(9% 7% 9% 7%)" },
    shown: {
        clipPath: "inset(0% 0% 0% 0%)",
        transition: timed(instant, { duration: 1.4, ease: settle, delay: 0.25 }),
    },
});

const zoomedOut = (instant: boolean): Variants => ({
    hidden: { scale: 1.12 },
    shown: { scale: 1, transition: timed(instant, { duration: 1.8, ease: settle, delay: 0.25 }) },
});

export const DemoHero = ({
    first,
    second,
    dateLabel,
    venue,
    welcome,
    ceremonyAt,
    photo,
    revealed,
}: DemoHeroProps) => {
    const countdown = useCountdown(ceremonyAt);
    const instant = useReducedMotion() ?? false;
    const units = [
        { value: countdown?.days, label: "jours", minDigits: 1 },
        { value: countdown?.hours, label: "heures", minDigits: 2 },
        { value: countdown?.minutes, label: "minutes", minDigits: 2 },
        { value: countdown?.seconds, label: "secondes", minDigits: 2 },
    ];

    return (
        <motion.section
            aria-labelledby="couple"
            initial={false}
            animate={revealed ? "shown" : "hidden"}
            className="pt-10"
        >
            <div className="mx-auto grid max-w-310 items-end gap-6 px-4 md:grid-cols-2 md:px-7">
                <h1
                    id="couple"
                    className="font-demo-script text-[clamp(4rem,10vw,9rem)] leading-[1.02] font-normal"
                >
                    <motion.span variants={written(instant, 0)} className="inline-block">
                        {first}
                    </motion.span>
                    <br />
                    <span className="inline-block pl-[0.7em] whitespace-nowrap">
                        <motion.span
                            variants={faded(instant, 0.4)}
                            className="font-demo-serif text-demo-earth-dark mr-[0.15em] inline-block -translate-y-[0.6em] text-[0.4em] italic"
                        >
                            &amp;
                        </motion.span>
                        <motion.span variants={written(instant, 0.45)} className="inline-block">
                            {second}
                        </motion.span>
                    </span>
                </h1>
                <div className="flex flex-col gap-5 pb-4">
                    <motion.p
                        variants={risen(instant, 0.5)}
                        className="font-demo-serif text-3xl leading-tight"
                    >
                        {dateLabel}
                        <span className="font-demo-sans text-demo-muted mt-1.5 block text-[0.95rem]">
                            {venue}
                        </span>
                    </motion.p>
                    <motion.p
                        variants={risen(instant, 0.65)}
                        className="text-demo-ink-2 max-w-[40ch]"
                    >
                        {welcome}
                    </motion.p>
                </div>
            </div>
            <div className="mx-auto mt-10 max-w-350 px-4 md:px-7">
                <motion.div
                    variants={unveiled(instant)}
                    className="relative h-[62vh] overflow-hidden md:h-[min(78vh,760px)]"
                >
                    <motion.div variants={zoomedOut(instant)} className="absolute inset-0">
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover object-[center_35%]"
                        />
                    </motion.div>
                    <motion.dl
                        aria-label="Compte à rebours"
                        variants={risen(instant, 0.9)}
                        className="bg-demo-card absolute inset-x-4 bottom-4 flex justify-between gap-4 px-5 py-4 md:inset-x-auto md:right-7 md:bottom-7 md:gap-6"
                    >
                        {units.map((unit) => (
                            <div
                                key={unit.label}
                                className="flex flex-col-reverse items-center text-center"
                            >
                                <dt className="text-demo-muted text-[0.8rem]">{unit.label}</dt>
                                <dd className="font-demo-serif text-4xl leading-none">
                                    <TickingNumber value={unit.value} minDigits={unit.minDigits} />
                                </dd>
                            </div>
                        ))}
                    </motion.dl>
                </motion.div>
            </div>
        </motion.section>
    );
};
