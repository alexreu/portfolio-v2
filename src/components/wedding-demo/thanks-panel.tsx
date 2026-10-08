import { Camera } from "lucide-react";

type ThanksPanelProps = {
    couple: string;
    /** "Samedi 12 juin 2027" */
    dateLabel: string;
    thanks: string;
    photoCount: number;
    /** Without a guest gallery in the formula, the thanks alone. */
    gallery: boolean;
    onAddPhotos: () => void;
};

/** The day after: the couple's thanks first, then the photos of the day. */
export const ThanksPanel = ({
    couple,
    dateLabel,
    thanks,
    photoCount,
    gallery,
    onAddPhotos,
}: ThanksPanelProps) => (
    <section aria-labelledby="merci-titre" className="pt-10 pb-16 md:pt-16">
        <div className="mx-auto grid max-w-150 gap-5 px-4 text-center md:px-7">
            <p className="text-demo-earth-dark text-[0.95rem]">{dateLabel} · c&apos;était hier</p>
            <h1 id="merci-titre" className="font-demo-script text-6xl leading-tight md:text-7xl">
                Merci
            </h1>
            <p className="font-demo-serif text-demo-ink-2 text-2xl leading-snug italic">{thanks}</p>
            <p className="text-demo-muted">{couple}</p>
            {gallery && (
                <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                    <a
                        href="#photos"
                        className="bg-demo-ink text-demo-card hover:bg-demo-ink-2 inline-flex min-h-13 items-center justify-center rounded-full px-6 font-medium transition-colors"
                    >
                        Voir les {photoCount.toLocaleString("fr-FR")} photos
                    </a>
                    <button
                        type="button"
                        onClick={onAddPhotos}
                        className="border-demo-line hover:border-demo-ink inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-full border px-6 font-medium transition-colors"
                    >
                        <Camera aria-hidden="true" className="size-4.5" strokeWidth={1.6} />
                        Ajouter les miennes
                    </button>
                </div>
            )}
        </div>
    </section>
);
