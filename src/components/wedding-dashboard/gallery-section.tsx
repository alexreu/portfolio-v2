"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, RotateCcw, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/lib/wedding-dashboard/types";
import { PhotoLightbox } from "@/components/wedding-demo/photo-lightbox";

import { buttonStyles, Card, plural } from "./dashboard-ui";

type GallerySectionProps = {
    photos: readonly GalleryPhoto[];
    opensLabel: string;
    onToggle: (photo: GalleryPhoto) => void;
};

/** Guests publish straight away; the couple removes an awkward photo in one touch. */
export const GallerySection = ({ photos, opensLabel, onToggle }: GallerySectionProps) => {
    const visible = photos.filter((photo) => !photo.removed).length;
    const [shown, setShown] = useState<number | null>(null);

    return (
        <Card
            id="galerie"
            title="Galerie des invités"
            titleId="galerie-titre"
            plan="galerie"
            aside={
                <span className="text-wed-muted text-[0.8rem]">
                    Exemple après le jour J · ouverture le {opensLabel}
                </span>
            }
        >
            <ul className="grid grid-cols-2 gap-2.5 p-5 sm:grid-cols-4">
                {photos.map((photo, index) => (
                    <li
                        key={photo.id}
                        className="relative aspect-square overflow-hidden rounded-xl"
                    >
                        <button
                            type="button"
                            onClick={() => setShown(index)}
                            aria-label={`Agrandir la photo de ${photo.author}`}
                            className="group absolute inset-0 cursor-zoom-in"
                        >
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                sizes="(min-width: 640px) 20vw, 45vw"
                                className={cn(
                                    "object-cover transition-[filter,opacity,scale] duration-500 group-hover:scale-[1.04] motion-reduce:transition-none",
                                    photo.removed && "opacity-35 grayscale",
                                )}
                            />
                        </button>
                        <span className="bg-wed-night/70 absolute top-2 left-2 rounded-md px-2 py-0.5 text-[0.7rem] text-white">
                            {photo.removed ? "Retirée" : photo.author}
                        </span>
                        <button
                            type="button"
                            onClick={() => onToggle(photo)}
                            aria-label={
                                photo.removed
                                    ? `Remettre la photo de ${photo.author}`
                                    : `Retirer la photo de ${photo.author}`
                            }
                            className="bg-wed-paper/90 text-wed-ink hover:bg-wed-paper absolute right-2 bottom-2 grid size-11 cursor-pointer place-items-center rounded-full shadow-sm transition-colors [&_svg]:size-4"
                        >
                            {photo.removed ? (
                                <RotateCcw aria-hidden="true" />
                            ) : (
                                <X aria-hidden="true" />
                            )}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-5">
                <p className="text-wed-muted text-sm">
                    {plural(visible, "photo visible", "photos visibles")} · une photo gênante se
                    retire en un geste, sans modération préalable.
                </p>
                <a
                    href="/mariage/demo?skip&jourj#photos"
                    target="_blank"
                    rel="noopener"
                    className={buttonStyles.quiet}
                >
                    <ExternalLink aria-hidden="true" />
                    Voir côté invités
                </a>
            </div>
            <PhotoLightbox
                photos={photos.map((photo) => ({
                    ...photo,
                    author: photo.removed ? `${photo.author} · retirée` : photo.author,
                }))}
                index={shown}
                onIndexChange={setShown}
                actions={(_, index) => {
                    const photo = photos[index];
                    return (
                        <button
                            type="button"
                            onClick={() => onToggle(photo)}
                            className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 [&_svg]:size-4"
                        >
                            {photo.removed ? (
                                <RotateCcw aria-hidden="true" />
                            ) : (
                                <X aria-hidden="true" />
                            )}
                            {photo.removed ? "Remettre dans la galerie" : "Retirer de la galerie"}
                        </button>
                    );
                }}
            />
        </Card>
    );
};
