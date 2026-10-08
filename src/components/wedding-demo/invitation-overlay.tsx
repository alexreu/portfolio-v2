"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import type { SealTone } from "@/lib/wedding-demo/tones";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useScrollLock } from "@/hooks/use-scroll-lock";

import { envelopeTimeline, InvitationEnvelope } from "./invitation-envelope";

type InvitationOverlayProps = {
    /** Unknown until the visitor's browser copy is read: the label waits for it. */
    guestName: string | null;
    first: string;
    second: string;
    dateLabel: string;
    tone: SealTone;
    /** Opened by the couple from their dashboard: said before the seal, not counted. */
    preview?: boolean;
    onOpened: () => void;
};

const FADE = 0.5;

const leaving: Variants = {
    closed: { opacity: 1, y: 0 },
    open: { opacity: 0, y: -6, transition: { duration: 0.3 } },
};

/** The faire-part in its envelope, addressed to the household, opened by touching the seal. */
export const InvitationOverlay = ({
    guestName,
    first,
    second,
    dateLabel,
    tone,
    preview = false,
    onOpened,
}: InvitationOverlayProps) => {
    const [opening, setOpening] = useState(false);
    const instant = useReducedMotion() ?? false;
    const dialog = useRef<HTMLDivElement>(null);
    const state = opening ? "open" : "closed";

    useScrollLock();
    useFocusTrap(dialog);

    /** Escape, « Passer » and the end of the animation may all ask: the site opens once. */
    const done = useRef(false);
    const finish = useCallback(() => {
        if (done.current) return;
        done.current = true;
        onOpened();
    }, [onOpened]);

    useEffect(() => {
        dialog.current?.focus({ preventScroll: true });
    }, []);

    useEffect(() => {
        const skipOnEscape = (event: KeyboardEvent) => event.key === "Escape" && finish();
        document.addEventListener("keydown", skipOnEscape);
        return () => document.removeEventListener("keydown", skipOnEscape);
    }, [finish]);

    useEffect(() => {
        if (!opening) return;
        const timer = window.setTimeout(finish, envelopeTimeline.handOver * 1_000);
        return () => window.clearTimeout(timer);
    }, [opening, finish]);

    const open = () => (instant ? finish() : setOpening(true));

    return (
        <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="faire-part-titre"
            tabIndex={-1}
            exit={{ opacity: 0, transition: { duration: instant ? 0 : FADE, ease: "easeOut" } }}
            className="bg-demo-paper fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,var(--demo-card),var(--demo-paper)_70%)] p-6 outline-none focus-visible:outline-none"
        >
            {preview && (
                <p className="bg-demo-ink text-demo-paper absolute inset-x-0 top-0 px-4 py-2.5 text-center text-sm">
                    <strong className="font-medium">Aperçu des mariés.</strong> Ouvrir ce faire-part
                    n&apos;est pas compté comme une visite du foyer.
                </p>
            )}
            <div className="flex flex-col items-center">
                <motion.div initial={false} animate={state} variants={leaving} className="mb-8">
                    <p
                        className={cn(
                            "text-demo-muted text-center text-sm transition-opacity duration-500",
                            guestName === null && "opacity-0",
                        )}
                    >
                        Faire-part pour
                        <span className="font-demo-serif text-demo-ink mt-1 block min-h-8 text-2xl italic">
                            {guestName}
                        </span>
                    </p>
                </motion.div>

                <InvitationEnvelope
                    first={first}
                    second={second}
                    dateLabel={dateLabel}
                    tone={tone}
                    opening={opening}
                    onSealTouched={open}
                    sealLabel="Ouvrir le faire-part"
                    title={{ as: "h1", id: "faire-part-titre" }}
                    className="w-[min(86vw,27.5rem,calc((100dvh-17rem)*1.47))]"
                />

                <motion.p
                    initial={false}
                    animate={state}
                    variants={leaving}
                    className="text-demo-muted mt-8 text-sm"
                >
                    Touchez le sceau pour ouvrir
                </motion.p>
            </div>

            {opening && (
                <motion.button
                    type="button"
                    onClick={finish}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.3 } }}
                    className="text-demo-ink-2 hover:text-demo-ink absolute right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm underline-offset-4 hover:underline"
                >
                    Passer
                </motion.button>
            )}
        </motion.div>
    );
};
