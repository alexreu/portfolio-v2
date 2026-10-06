"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type InvitationOverlayProps = {
    guestName: string;
    first: string;
    second: string;
    dateLabel: string;
    onOpened: () => void;
};

const OPENING_MS = 700;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The faire-part, addressed to the household, opened by touching the wax seal. */
export const InvitationOverlay = ({
    guestName,
    first,
    second,
    dateLabel,
    onOpened,
}: InvitationOverlayProps) => {
    const [opening, setOpening] = useState(false);

    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    const open = () => {
        if (prefersReducedMotion()) return onOpened();
        setOpening(true);
        window.setTimeout(onOpened, OPENING_MS);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="faire-part-titre"
            className="bg-demo-paper fixed inset-0 z-50 grid place-items-center p-6"
        >
            <div
                className={cn(
                    "bg-demo-card border-demo-line shadow-demo-ink/10 relative flex aspect-[3/4.1] w-full max-w-110 flex-col items-center justify-center border px-8 py-10 text-center shadow-xl transition-all duration-700 motion-reduce:transition-none",
                    "before:border-demo-line before:pointer-events-none before:absolute before:inset-2.5 before:border",
                    opening && "-translate-y-8 scale-95 opacity-0",
                )}
            >
                <p className="text-demo-muted text-sm">
                    Faire-part pour
                    <span className="font-demo-serif text-demo-ink mt-1 block text-2xl italic">
                        {guestName}
                    </span>
                </p>
                <h1
                    id="faire-part-titre"
                    className="font-demo-script my-7 text-6xl leading-[1.05] font-normal md:text-7xl"
                >
                    {first}
                    <span className="font-demo-serif text-demo-earth-dark my-1 block text-2xl italic">
                        &amp;
                    </span>
                    {second}
                </h1>
                <p className="text-demo-ink-2 text-[0.95rem]">{dateLabel}</p>
                <button
                    type="button"
                    onClick={open}
                    aria-label="Ouvrir le faire-part"
                    className="bg-demo-olive text-demo-card font-demo-serif mt-8 grid size-22 cursor-pointer place-items-center rounded-full text-xl italic shadow-[inset_0_0_0_6px_var(--demo-olive-dark)] transition-transform hover:scale-105"
                >
                    C·H
                </button>
                <p className="text-demo-muted mt-3.5 text-sm">Touchez le sceau pour ouvrir</p>
            </div>
        </div>
    );
};
