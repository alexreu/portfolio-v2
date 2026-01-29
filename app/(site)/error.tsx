"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-white">
            <h2 className="text-2xl font-semibold">Une erreur est survenue</h2>
            <p className="text-muted-foreground">Veuillez réessayer.</p>
            <button onClick={reset} className="rounded-xl bg-primary px-6 py-3 font-medium text-white">
                Réessayer
            </button>
        </div>
    );
}
