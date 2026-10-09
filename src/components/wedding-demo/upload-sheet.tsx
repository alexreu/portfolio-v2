"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Images } from "lucide-react";

import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useScrollLock } from "@/hooks/use-scroll-lock";

type Upload = {
    readonly id: string;
    readonly name: string;
    readonly previewUrl: string;
    readonly progress: number;
};

type UploadSheetProps = {
    signature: string;
    onClose: () => void;
};

const STEP = 20;
const TICK_MS = 300;

const advance = (upload: Upload): Upload => ({
    ...upload,
    progress: Math.min(100, upload.progress + STEP),
});

const toUploads = (files: FileList): readonly Upload[] =>
    [...files].map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
    }));

/**
 * Demo of the photo upload: the chosen photos are previewed and their sending is simulated,
 * nothing leaves the phone. Signed with the household name, so there is nothing to fill in.
 */
export const UploadSheet = ({ signature, onClose }: UploadSheetProps) => {
    const [uploads, setUploads] = useState<readonly Upload[]>([]);
    const title = useRef<HTMLHeadingElement>(null);
    const sheet = useRef<HTMLDivElement>(null);
    const cameraInput = useRef<HTMLInputElement>(null);
    const galleryInput = useRef<HTMLInputElement>(null);
    const sending = uploads.some((upload) => upload.progress < 100);
    const done = uploads.length > 0 && !sending;

    useScrollLock();
    useFocusTrap(sheet);

    useEffect(() => {
        title.current?.focus();
        const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [onClose]);

    useEffect(() => {
        if (!sending) return;
        const timer = window.setInterval(
            () => setUploads((current) => current.map(advance)),
            TICK_MS,
        );
        return () => window.clearInterval(timer);
    }, [sending]);

    /** Previews are released when the sheet closes, not while their progress updates. */
    const previews = useRef<readonly Upload[]>([]);
    useEffect(() => {
        previews.current = uploads;
    }, [uploads]);
    useEffect(
        () => () => previews.current.forEach((upload) => URL.revokeObjectURL(upload.previewUrl)),
        [],
    );

    const pick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files?.length) setUploads((current) => [...current, ...toUploads(files)]);
        event.target.value = "";
    };

    return (
        <div
            className="bg-demo-ink/50 fixed inset-0 z-60 flex items-end justify-center"
            onClick={(event) => event.target === event.currentTarget && onClose()}
        >
            <div
                ref={sheet}
                role="dialog"
                aria-modal="true"
                aria-labelledby="envoi-titre"
                data-lenis-prevent
                className="bg-demo-card animate-in slide-in-from-bottom-10 max-h-[90dvh] w-full max-w-140 overflow-y-auto overscroll-contain rounded-t-2xl px-5 pt-2.5 pb-[calc(1rem+env(safe-area-inset-bottom))] motion-reduce:animate-none"
            >
                <div
                    aria-hidden="true"
                    className="bg-demo-line mx-auto mt-1 mb-3.5 h-1 w-10 rounded-full"
                />
                <h2
                    id="envoi-titre"
                    ref={title}
                    tabIndex={-1}
                    className="font-demo-serif text-3xl font-normal outline-none"
                >
                    Partager vos photos
                </h2>
                <p className="text-demo-muted mt-1 mb-4.5">
                    Envoyées au nom de{" "}
                    <strong className="text-demo-ink font-medium">{signature}</strong>, rien à
                    remplir.
                </p>
                <div className="grid gap-2.5">
                    <button
                        type="button"
                        onClick={() => cameraInput.current?.click()}
                        className="bg-demo-ink text-demo-card hover:bg-demo-ink-2 flex min-h-14.5 cursor-pointer items-center justify-center gap-2.5 rounded-full text-[1.05rem] font-medium transition-[background-color,scale] active:scale-[0.99]"
                    >
                        <Camera aria-hidden="true" className="size-5" strokeWidth={1.6} />
                        Prendre une photo
                    </button>
                    <button
                        type="button"
                        onClick={() => galleryInput.current?.click()}
                        className="border-demo-line text-demo-ink hover:border-demo-ink flex min-h-14.5 cursor-pointer items-center justify-center gap-2.5 rounded-full border text-[1.05rem] font-medium transition-[border-color,scale] active:scale-[0.99]"
                    >
                        <Images aria-hidden="true" className="size-5" strokeWidth={1.6} />
                        Choisir dans ma galerie
                    </button>
                    <input
                        ref={cameraInput}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={pick}
                        hidden
                    />
                    <input
                        ref={galleryInput}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={pick}
                        hidden
                    />
                </div>
                {uploads.length > 0 && (
                    <ul className="mt-4.5 grid gap-3">
                        {uploads.map((upload) => (
                            <li
                                key={upload.id}
                                className="grid grid-cols-[56px_1fr] items-center gap-3"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                                <img
                                    src={upload.previewUrl}
                                    alt=""
                                    className="size-14 rounded-lg object-cover"
                                />
                                <div>
                                    <p
                                        className={
                                            upload.progress === 100
                                                ? "text-demo-olive font-medium"
                                                : "text-demo-ink-2"
                                        }
                                    >
                                        {upload.progress === 100
                                            ? "Envoyée ✓"
                                            : `Envoi… ${upload.progress} %`}
                                    </p>
                                    <div className="bg-demo-line mt-1.5 h-1.5 overflow-hidden rounded-full">
                                        <div
                                            className="bg-demo-olive h-full transition-[width] duration-300"
                                            style={{ width: `${upload.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {done && (
                    <p role="status" className="font-demo-serif text-demo-olive mt-4 text-2xl">
                        {uploads.length > 1
                            ? `${uploads.length} photos partagées`
                            : "Photo partagée"}
                        , merci !
                    </p>
                )}
                <p className="text-demo-muted mt-3.5 text-sm">
                    La localisation est retirée des photos. Si le réseau coupe, l&apos;envoi reprend
                    tout seul.
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-demo-ink-2 hover:text-demo-ink mt-2 min-h-13 w-full cursor-pointer rounded-full transition-colors"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
};
