"use client";

import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";
import { GallerySection } from "../gallery-section";
import { QrPosterCard } from "../qr-poster-card";

export const GalleryPage = () => {
    const {
        state,
        dispatch,
        calendar,
        galleryUrl,
        downloadGalleryPoster,
        downloadGallery,
        dayAfterUrl,
        can,
    } = useDashboard();
    return (
        <>
            <PageHeader page="gallery" />
            <GallerySection
                photos={state.photos}
                opensLabel={calendar.galleryOpensLabel}
                onToggle={
                    can("gallery.moderate")
                        ? (photo) => dispatch({ type: "photo.toggle", photoId: photo.id })
                        : undefined
                }
                onDownload={can("gallery.read") ? downloadGallery : undefined}
                dayAfterUrl={dayAfterUrl}
            />
            {can("gallery.read") && (
                <QrPosterCard
                    id="qr-galerie"
                    title="QR code de la galerie"
                    url={galleryUrl}
                    qrLabel="QR code de la galerie : ouvre la galerie des invités"
                    plan="gallery"
                    aside="Sur chaque table"
                    downloadLabel="Affiche et cartes de table"
                    openLabel="Ouvrir la galerie des invités"
                    note="PDF A4 : l'affiche, puis une feuille de quatre cartes à découper."
                    onDownload={downloadGalleryPoster}
                >
                    Il ouvre la galerie, et rien d&apos;autre : ni faire-part ni réponse. Chaque
                    invité donne son prénom et son nom, qui signent ses photos, puis les envoie sans
                    application.
                </QrPosterCard>
            )}
        </>
    );
};
