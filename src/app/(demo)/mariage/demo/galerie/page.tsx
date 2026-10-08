import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";
import { GalleryQrPage } from "@/components/wedding-demo/qr-guest-pages";

/** Reached by a printed QR code on the day: shown, not indexed. */
export const metadata: Metadata = {
    ...buildPageMetadata({
        title: "Galerie photo · Camille & Hugo",
        description:
            "Démo d'une galerie photo de mariage : les invités scannent le QR code de leur table, donnent leur nom et partagent leurs photos, sans application.",
        path: "/mariage/demo/galerie",
    }),
    robots: { index: false, follow: true },
};

export default function WeddingGalleryPage() {
    return <GalleryQrPage />;
}
