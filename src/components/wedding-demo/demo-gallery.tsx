import Image from "next/image";
import { Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SiteMode } from "@/lib/wedding/site-mode";

import { DemoHeading } from "./demo-heading";

type DemoGalleryProps = {
    mode: SiteMode;
    opensLabel: string;
    count: number;
    photos: readonly { readonly src: string; readonly alt: string; readonly author: string }[];
    onAddPhotos: () => void;
};

/** Empty until the day: before, it only announces its opening; then upload comes first. */
export const DemoGallery = ({ mode, opensLabel, count, photos, onAddPhotos }: DemoGalleryProps) => (
    <section
        id="photos"
        aria-labelledby="photos-titre"
        className="bg-demo-ink text-demo-paper scroll-mt-16 py-20 md:py-30"
    >
        <div className="mx-auto max-w-310 px-4 md:px-7">
            <DemoHeading
                id="photos-titre"
                number="06"
                label="Vos photos"
                heading={{ text: "Vu par vous", emphasis: "par vous" }}
                tone="dark"
            />
            <p className="text-demo-night-muted mt-5 mb-10 max-w-[46ch]">
                Le jour J, scannez le code posé sur votre table : vos photos arrivent ici, sans
                application. Elles restent privées, entre nous.
            </p>
            {mode === "before" ? (
                <p className="border-demo-ink-2 text-demo-night-muted max-w-160 rounded-lg border border-dashed px-5.5 py-5">
                    <strong className="text-demo-paper font-medium">
                        La galerie ouvre le {opensLabel}.
                    </strong>{" "}
                    Le jour J, un bouton apparaîtra ici et en bas de votre écran pour envoyer vos
                    photos en un geste.
                </p>
            ) : (
                <>
                    <div className="border-demo-night-line mb-7 flex flex-wrap items-center justify-between gap-4 border-b pb-7">
                        <button
                            type="button"
                            onClick={onAddPhotos}
                            className="bg-demo-paper text-demo-ink inline-flex min-h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xs px-5.5 font-medium md:w-auto"
                        >
                            <Upload aria-hidden="true" className="size-4.5" />
                            Ajouter mes photos
                        </button>
                        <p className="text-demo-night-muted text-sm">
                            JPEG, HEIC ou PNG · la localisation est retirée automatiquement · envoi
                            repris si le réseau coupe
                        </p>
                    </div>
                    <ul className="columns-2 gap-2 md:columns-4 md:gap-3">
                        {photos.map((photo, index) => (
                            <li
                                key={photo.src}
                                className={cn(
                                    "relative mb-2 break-inside-avoid md:mb-3",
                                    index >= 6 && "hidden md:block",
                                )}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    width={600}
                                    height={800}
                                    sizes="(min-width: 768px) 25vw, 50vw"
                                    className="h-auto w-full"
                                />
                                <span className="absolute bottom-2 left-2.5 text-[0.8rem] text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
                                    par {photo.author}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 flex justify-center">
                        <a
                            href="#photos"
                            className="border-demo-ink-2 inline-flex min-h-11 items-center rounded-xs border px-4.5"
                        >
                            Voir les {count.toLocaleString("fr-FR")} photos
                        </a>
                    </p>
                </>
            )}
        </div>
    </section>
);
