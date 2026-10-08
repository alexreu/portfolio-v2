"use client";

import { demoSeed } from "@/content/wedding-dashboard-demo";
import { weddingDemo } from "@/content/wedding-demo";

import { weddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { seatingBoard } from "@/lib/wedding-dashboard/table-finder";
import { useWeddingDemo } from "@/hooks/use-wedding-demo";

import { GuestGallery } from "./guest-gallery";
import { GuestPageFrame } from "./guest-page-frame";
import { SeatingFinder } from "./seating-finder";

/** Camille & Hugo as the server renders them, before the visitor's browser copy is read. */
const fallback = demoSeed(new Date(0));

/** The demo copy kept in this browser, shared with the couple's dashboard. */
const useDemoCopy = () => {
    const { state } = useWeddingDemo();
    const copy = state ?? fallback;
    const { design } = copy;
    const calendar = weddingCalendar(design.date, copy.dates);
    return {
        copy,
        calendar,
        couple: `${design.first} & ${design.second}`,
        when: `${calendar.dateLabel} · ${design.place}`,
    };
};

/** Opened by the QR code at the dinner's entrance: the room plan, and who sits where. */
export const SeatingQrPage = () => {
    const { copy, couple, when } = useDemoCopy();
    return (
        <GuestPageFrame
            couple={couple}
            when={when}
            demoNote="Démo : le plan placé dans le tableau de bord, avec des invités fictifs. Sur votre site, il s'affiche le jour J à l'heure choisie, et seuls les invités attendus au dîner y figurent."
        >
            <SeatingFinder
                board={seatingBoard(copy.households, copy.tables, copy.seats)}
                room={copy.room}
            />
        </GuestPageFrame>
    );
};

/** Opened by the gallery's QR code, on the tables: the photos, nothing else. */
export const GalleryQrPage = () => {
    const { copy, calendar, couple, when } = useDemoCopy();
    return (
        <GuestPageFrame
            couple={couple}
            when={when}
            demoNote={`Démo : aucune photo n'est envoyée. Sur votre site, la galerie ouvre le ${calendar.galleryOpensLabel} ; les photos retirées dans le tableau de bord disparaissent ici.`}
        >
            <GuestGallery
                couple={couple}
                photos={
                    copy.photos.filter((photo) => !photo.removed).length > 0
                        ? copy.photos.filter((photo) => !photo.removed)
                        : weddingDemo.gallery.photos
                }
            />
        </GuestPageFrame>
    );
};
