"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

import { signPhoto, type SignatureError } from "@/lib/wedding/photo-signature";
import { useStoredText } from "@/hooks/use-stored-text";

import { PhotoLightbox } from "./photo-lightbox";
import { UploadSheet } from "./upload-sheet";

/** Where the name given at the gallery's door is kept, so the guest types it once. */
const SIGNATURE_KEY = "alexdevlab:mariage-demo:galerie-signature";

type Photo = { readonly src: string; readonly alt: string; readonly author: string };

type GuestGalleryProps = {
    couple: string;
    photos: readonly Photo[];
};

const errorText: Record<SignatureError, string> = {
    "first-name-required": "Votre prénom, au moins deux lettres.",
    "last-name-required": "Votre nom.",
};

const field =
    "bg-demo-card border-demo-line focus:border-demo-ink aria-invalid:border-demo-no min-h-13 w-full rounded-lg border px-4 text-lg outline-none";

/** The gallery's door: a first and a last name, which will sign every photo shared. */
const NameGate = ({ couple, onEnter }: { couple: string; onEnter: (name: string) => void }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errors, setErrors] = useState<readonly SignatureError[]>([]);
    const missing = (error: SignatureError) => errors.includes(error);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const signature = signPhoto({ householdName: null, typedName: { firstName, lastName } });
        if (signature.ok) onEnter(signature.value);
        else setErrors(signature.error);
    };

    return (
        <section aria-labelledby="porte-titre" className="mx-auto grid max-w-120 gap-5">
            <div>
                <h1
                    id="porte-titre"
                    className="font-demo-serif text-4xl leading-tight font-normal md:text-5xl"
                >
                    La galerie de {couple}
                </h1>
                <p className="text-demo-ink-2 mt-2">
                    Avant d&apos;entrer, dites-nous qui vous êtes : votre nom signera les photos que
                    vous partagez.
                </p>
            </div>
            <form noValidate onSubmit={submit} aria-label="Qui êtes-vous ?" className="grid gap-4">
                <div className="grid gap-1.5">
                    <label htmlFor="porte-prenom" className="text-demo-ink-2 text-sm">
                        Prénom
                    </label>
                    <input
                        id="porte-prenom"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        autoComplete="given-name"
                        aria-invalid={missing("first-name-required")}
                        aria-describedby={
                            missing("first-name-required") ? "porte-prenom-erreur" : undefined
                        }
                        className={field}
                    />
                    {missing("first-name-required") && (
                        <span id="porte-prenom-erreur" className="text-demo-no text-sm">
                            {errorText["first-name-required"]}
                        </span>
                    )}
                </div>
                <div className="grid gap-1.5">
                    <label htmlFor="porte-nom" className="text-demo-ink-2 text-sm">
                        Nom
                    </label>
                    <input
                        id="porte-nom"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        autoComplete="family-name"
                        aria-invalid={missing("last-name-required")}
                        aria-describedby={
                            missing("last-name-required") ? "porte-nom-erreur" : undefined
                        }
                        className={field}
                    />
                    {missing("last-name-required") && (
                        <span id="porte-nom-erreur" className="text-demo-no text-sm">
                            {errorText["last-name-required"]}
                        </span>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-demo-ink text-demo-card hover:bg-demo-ink-2 min-h-14 cursor-pointer rounded-full text-[1.05rem] font-medium transition-[background-color,scale] active:scale-[0.99]"
                >
                    Entrer dans la galerie
                </button>
            </form>
        </section>
    );
};

/**
 * The guests' gallery, reached by its own QR code: nothing of the faire-part or the answers.
 * The guest gives their name once, then shares photos signed with it and sees everyone's.
 */
export const GuestGallery = ({ couple, photos }: GuestGalleryProps) => {
    const [signature, setSignature] = useStoredText(SIGNATURE_KEY);
    const [uploading, setUploading] = useState(false);
    const [shown, setShown] = useState<number | null>(null);
    /** Stable, so the sheet keeps its focus while the page re-renders. */
    const closeUpload = useCallback(() => setUploading(false), []);

    /** Unknown until the browser is read: nothing rather than a door that flashes. */
    if (signature === undefined) return <div aria-busy="true" className="min-h-[60dvh]" />;
    if (signature === null) return <NameGate couple={couple} onEnter={setSignature} />;

    return (
        <section aria-labelledby="galerie-titre" className="grid gap-6">
            <div>
                <p className="text-demo-ink-2">
                    Bonjour <strong className="font-medium">{signature}</strong> ·{" "}
                    <button
                        type="button"
                        onClick={() => setSignature(null)}
                        className="text-demo-muted hover:text-demo-ink inline-flex min-h-11 cursor-pointer items-center underline underline-offset-4"
                    >
                        Ce n&apos;est pas vous ?
                    </button>
                </p>
                <h1
                    id="galerie-titre"
                    className="font-demo-serif text-4xl leading-tight font-normal md:text-5xl"
                >
                    Vu par vous
                </h1>
                <p className="text-demo-ink-2 mt-2">
                    Vos photos arrivent ici, sans application, signées de votre nom. Elles restent
                    privées, entre nous.
                </p>
            </div>
            <button
                type="button"
                onClick={() => setUploading(true)}
                className="bg-demo-olive hover:bg-demo-olive-dark flex min-h-15 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full text-[1.05rem] font-medium text-white transition-[background-color,scale] active:scale-[0.99]"
            >
                <Camera aria-hidden="true" className="size-5.5" strokeWidth={1.6} />
                Ajouter mes photos
            </button>
            <ul aria-label="Photos partagées" className="columns-2 gap-2 md:columns-3 md:gap-3">
                {photos.map((photo, index) => (
                    <li key={photo.src} className="relative mb-2 break-inside-avoid md:mb-3">
                        <button
                            type="button"
                            onClick={() => setShown(index)}
                            aria-label={`Agrandir la photo de ${photo.author}`}
                            className="group block w-full cursor-zoom-in overflow-hidden rounded-md"
                        >
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                width={600}
                                height={800}
                                sizes="(min-width: 768px) 33vw, 50vw"
                                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                            />
                            <span className="absolute bottom-2 left-2.5 text-[0.8rem] text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
                                par {photo.author}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
            <PhotoLightbox photos={photos} index={shown} onIndexChange={setShown} />
            {uploading && <UploadSheet signature={signature} onClose={closeUpload} />}
        </section>
    );
};
