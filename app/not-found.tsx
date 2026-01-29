import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-white">
            <h2 className="text-3xl font-semibold">Page introuvable</h2>
            <p className="text-muted-foreground">La page que vous cherchez n&apos;existe pas.</p>
            <Link href="/" className="rounded-xl bg-primary px-6 py-3 font-medium text-white">
                Retour à l&apos;accueil
            </Link>
        </div>
    );
}
