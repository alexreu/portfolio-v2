"use client";

import { useState, type ReactNode } from "react";
import { demoSeed } from "@/content/wedding-dashboard-demo";

import { parisDay, weddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { tablesRevealAt, tablesRevealed } from "@/lib/wedding-dashboard/room";
import { seatingBoard } from "@/lib/wedding-dashboard/table-finder";
import { formatHour } from "@/lib/wedding/format-hour";
import { useNow } from "@/hooks/use-now";
import { useWeddingDemo } from "@/hooks/use-wedding-demo";

import { GuestGallery } from "./guest-gallery";
import { GuestPageFrame } from "./guest-page-frame";
import { SeatingFinder } from "./seating-finder";

/** Camille & Hugo as the server renders them, before the visitor's browser copy is read. */
const fallback = demoSeed(new Date(0));

/**
 * Before its time, a page says when it opens; the demo can still show it ahead, which a real
 * site does not.
 */
const NotYet = ({ title, when, onPeek }: { title: string; when: string; onPeek: () => void }) => (
    <section aria-labelledby="bientot-titre" className="grid justify-items-start gap-4">
        <h1 id="bientot-titre" className="font-demo-serif text-4xl leading-tight font-normal">
            {title}
        </h1>
        <p className="text-demo-ink-2">{when}</p>
        <button
            type="button"
            onClick={onPeek}
            className="border-demo-olive text-demo-olive inline-flex min-h-11 cursor-pointer items-center rounded-full border border-dashed px-5 text-sm"
        >
            Démo : voir la page en avance
        </button>
    </section>
);

/** The page, or its « not yet » until it opens, unless the demo is asked to show it ahead. */
const Gate = ({
    open,
    title,
    when,
    children,
}: {
    open: boolean;
    title: string;
    when: string;
    children: ReactNode;
}) => {
    const [peek, setPeek] = useState(false);
    return open || peek ? (
        children
    ) : (
        <NotYet title={title} when={when} onPeek={() => setPeek(true)} />
    );
};

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
    const { copy, couple, when, calendar } = useDemoCopy();
    const now = useNow();
    const { date } = copy.design;
    return (
        <GuestPageFrame
            couple={couple}
            when={when}
            demoNote="Démo : le plan placé dans le tableau de bord, avec des invités fictifs. Seuls les invités attendus au dîner y figurent."
        >
            <Gate
                open={tablesRevealed(date, copy.room.revealAt, now)}
                title="Le plan de table arrive bientôt"
                when={`Il s'affiche ici le ${calendar.shortDateLabel.toLowerCase()} à ${formatHour(tablesRevealAt(date, copy.room.revealAt))}.`}
            >
                <SeatingFinder
                    board={seatingBoard(copy.households, copy.tables, copy.seats)}
                    room={copy.room}
                />
            </Gate>
        </GuestPageFrame>
    );
};

/** Opened by the gallery's QR code, on the tables: the photos, nothing else. */
export const GalleryQrPage = () => {
    const { copy, calendar, couple, when } = useDemoCopy();
    const now = useNow();
    return (
        <GuestPageFrame
            couple={couple}
            when={when}
            demoNote="Démo : aucune photo n'est envoyée. Les photos retirées dans le tableau de bord disparaissent ici."
        >
            <Gate
                open={parisDay(now) >= calendar.galleryOpens}
                title={`La galerie de ${couple} ouvre bientôt`}
                when={`Revenez le ${calendar.galleryOpensLabel} : vos photos arriveront ici, sans application.`}
            >
                <GuestGallery
                    couple={couple}
                    photos={copy.photos.filter((photo) => !photo.removed)}
                />
            </Gate>
        </GuestPageFrame>
    );
};
