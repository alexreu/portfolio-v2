"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";

import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";

export type LightboxPhoto = {
    readonly src: string;
    readonly alt: string;
    readonly author: string;
};

type PhotoLightboxProps = {
    photos: readonly LightboxPhoto[];
    /** The photo shown; null while the viewer is closed. */
    index: number | null;
    onIndexChange: (index: number | null) => void;
    /** Extra actions under the photo, e.g. removing it from the dashboard. */
    actions?: (photo: LightboxPhoto, index: number) => ReactNode;
};

/** A swipe longer than this, in pixels, turns the page. */
const SWIPE = 60;

const roundButton =
    "grid size-12 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 [&_svg]:size-5";

const Viewer = ({
    photos,
    index,
    onIndexChange,
    actions,
}: Omit<PhotoLightboxProps, "index"> & { index: number }) => {
    const instant = useReducedMotion() ?? false;
    const [direction, setDirection] = useState(0);
    const photo = photos[index];
    const several = photos.length > 1;

    useScrollLock();

    const go = (delta: number) => {
        setDirection(delta);
        onIndexChange((index + delta + photos.length) % photos.length);
    };

    const swipe = (_: unknown, info: PanInfo) => {
        if (info.offset.x < -SWIPE) go(1);
        else if (info.offset.x > SWIPE) go(-1);
    };

    return (
        <div
            className="grid h-full grid-rows-[auto_1fr_auto]"
            onKeyDown={(event) => {
                if (!several) return;
                if (event.key === "ArrowRight") go(1);
                if (event.key === "ArrowLeft") go(-1);
            }}
        >
            <div className="flex items-center justify-between gap-4 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 text-sm text-white/80 md:px-6">
                <p aria-live="polite">
                    <span className="tabular-nums">
                        {index + 1} / {photos.length}
                    </span>
                    <span className="ml-3 text-white">par {photo.author}</span>
                </p>
                <Dialog.Close aria-label="Fermer la photo" className={roundButton}>
                    <X aria-hidden="true" />
                </Dialog.Close>
            </div>

            <div className="relative min-h-0 overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={photo.src}
                        custom={direction}
                        initial={{ opacity: 0, x: instant ? 0 : direction * 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: instant ? 0 : direction * -60 }}
                        transition={{ duration: instant ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                        drag={several ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.25}
                        onDragEnd={swipe}
                        className="absolute inset-0 mx-4 cursor-grab touch-pan-y active:cursor-grabbing md:mx-24"
                    >
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            priority
                            draggable={false}
                            sizes="100vw"
                            className="object-contain select-none"
                        />
                    </motion.div>
                </AnimatePresence>
                {several && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Photo précédente"
                            className={cn(
                                roundButton,
                                "absolute top-1/2 left-5 hidden -translate-y-1/2 md:grid",
                            )}
                        >
                            <ChevronLeft aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Photo suivante"
                            className={cn(
                                roundButton,
                                "absolute top-1/2 right-5 hidden -translate-y-1/2 md:grid",
                            )}
                        >
                            <ChevronRight aria-hidden="true" />
                        </button>
                    </>
                )}
            </div>

            <div className="flex min-h-18 items-center justify-center gap-3 px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {several && (
                    <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label="Photo précédente"
                        className={cn(roundButton, "md:hidden")}
                    >
                        <ChevronLeft aria-hidden="true" />
                    </button>
                )}
                {actions?.(photo, index)}
                {several && (
                    <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label="Photo suivante"
                        className={cn(roundButton, "md:hidden")}
                    >
                        <ChevronRight aria-hidden="true" />
                    </button>
                )}
            </div>
        </div>
    );
};

/** A gallery photo in full: arrows, keyboard and swipe to go through them, Échap to close. */
export const PhotoLightbox = ({ photos, index, onIndexChange, actions }: PhotoLightboxProps) => {
    const open = index !== null && photos[index] !== undefined;
    return (
        <Dialog.Root open={open} onOpenChange={(next) => !next && onIndexChange(null)}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-demo-ink data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-60 motion-reduce:animate-none" />
                <Dialog.Content
                    data-lenis-prevent
                    aria-describedby={undefined}
                    className="font-main fixed inset-0 z-60 outline-none"
                >
                    {open && (
                        <>
                            <Dialog.Title className="sr-only">
                                Photo de {photos[index].author}, {index + 1} sur {photos.length}
                            </Dialog.Title>
                            <Viewer
                                photos={photos}
                                index={index}
                                onIndexChange={onIndexChange}
                                actions={actions}
                            />
                        </>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
