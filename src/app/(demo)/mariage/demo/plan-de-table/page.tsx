import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";
import { SeatingQrPage } from "@/components/wedding-demo/qr-guest-pages";

/** Reached by a printed QR code on the day: shown, not indexed. */
export const metadata: Metadata = {
    ...buildPageMetadata({
        title: "Plan de table · Camille & Hugo",
        description:
            "Démo d'un plan de table de mariage sur téléphone : chaque invité tape son prénom ou son nom et voit sa table s'allumer sur le plan de la salle.",
        path: "/mariage/demo/plan-de-table",
    }),
    robots: { index: false, follow: true },
};

export default function WeddingSeatingPage() {
    return <SeatingQrPage />;
}
