"use client";

import { useState } from "react";
import { formatHour, type Programme, type RoomLayout, type SeatTable } from "@alexreu/wedding-core";
import { Camera } from "lucide-react";

import { RoomPlan } from "./room-plan";

type DayPanelProps = {
    /** Where the wedding takes place: every hour is read there. */
    timezone: string;
    /** "Samedi 12 juin" */
    dateLabel: string;
    guestName: string;
    /** Every table of the room, for the plan. */
    tables: readonly SeatTable[];
    room: RoomLayout;
    /** The household's own tables, set by the couple in their dashboard. */
    ownTables: readonly SeatTable[];
    programme: Programme;
    photoCount: number;
    /** Invited to dinner and not all declined: the table card has something to say. */
    seated: boolean;
    /** "10 h": while the tables are not shown yet; null once they are. */
    tablesAt: string | null;
    onAddPhotos: () => void;
};

/** The personal link on the wedding day: table, what is on now, and photo upload. */
export const DayPanel = ({
    timezone,
    dateLabel,
    guestName,
    tables,
    room,
    ownTables,
    programme,
    photoCount,
    seated,
    tablesAt,
    onAddPhotos,
}: DayPanelProps) => {
    const [mapOpen, setMapOpen] = useState(false);
    const { current, next } = programme;

    return (
        <section id="jourj" aria-labelledby="jourj-titre" className="scroll-mt-16 pt-7 pb-14">
            <div className="mx-auto max-w-150 px-4 md:px-7">
                <p className="text-demo-earth-dark text-[0.95rem]">
                    {dateLabel} · c&apos;est aujourd&apos;hui
                </p>
                <h2
                    id="jourj-titre"
                    className="font-demo-serif mt-1 mb-5 text-4xl leading-tight font-normal"
                >
                    Bienvenue {guestName}
                </h2>
                {seated && tablesAt !== null && (
                    <p className="bg-demo-ink text-demo-paper rounded-lg px-5 py-4.5">
                        <span className="text-demo-night-muted block text-sm">Votre table</span>
                        <span className="font-demo-serif block text-2xl leading-snug">
                            Dévoilée {tablesAt}
                        </span>
                    </p>
                )}
                {seated && tablesAt === null && (
                    <div className="bg-demo-ink text-demo-paper flex items-center justify-between gap-4 rounded-lg px-5 py-4.5">
                        {ownTables.length > 0 ? (
                            <p>
                                <span className="text-demo-night-muted block text-sm">
                                    {ownTables.length > 1 ? "Vos tables" : "Votre table"}
                                </span>
                                <span className="font-demo-serif block text-6xl leading-none">
                                    {ownTables.map((table) => table.number).join(" · ")}
                                </span>
                                <span className="font-demo-serif text-demo-sand text-xl italic">
                                    {ownTables.map((table) => table.name).join(" · ")}
                                </span>
                            </p>
                        ) : (
                            <p>
                                <span className="text-demo-night-muted block text-sm">
                                    Votre table
                                </span>
                                <span className="font-demo-serif block text-2xl leading-snug">
                                    Pas encore attribuée
                                </span>
                                <span className="text-demo-night-muted text-sm">
                                    Les témoins vous guideront à l&apos;arrivée.
                                </span>
                            </p>
                        )}
                        <button
                            type="button"
                            aria-expanded={mapOpen}
                            aria-controls="plan-salle"
                            onClick={() => setMapOpen((open) => !open)}
                            className="border-demo-ink-2 hover:border-demo-paper min-h-12 cursor-pointer rounded-full border px-5 whitespace-nowrap transition-colors"
                        >
                            {mapOpen ? "Masquer le plan" : "Voir le plan"}
                        </button>
                    </div>
                )}
                {seated && tablesAt === null && mapOpen && (
                    <div
                        id="plan-salle"
                        className="bg-demo-card border-demo-line mt-2 rounded-lg border p-2.5"
                    >
                        <RoomPlan
                            tables={tables}
                            room={room}
                            highlight={ownTables.map((table) => table.id)}
                            label={
                                ownTables.length > 0
                                    ? `Plan de la salle, table ${ownTables.map((table) => table.number).join(" et ")} en surbrillance`
                                    : "Plan de la salle"
                            }
                        />
                    </div>
                )}
                <div className="bg-demo-card border-demo-line mt-3.5 rounded-lg border px-5 py-1">
                    {current && (
                        <p className="border-demo-line grid gap-0.5 border-b py-3.5">
                            <span className="text-demo-olive flex items-center gap-2 text-sm font-medium">
                                <span
                                    aria-hidden="true"
                                    className="bg-demo-olive size-2 rounded-full"
                                />
                                En ce moment
                            </span>
                            <span className="font-demo-serif text-2xl">{current.title}</span>
                            <span className="text-demo-ink-2 text-[0.95rem]">
                                {current.place}
                                {current.endsAt &&
                                    ` · jusqu'à ${formatHour(current.endsAt, timezone)}`}
                            </span>
                        </p>
                    )}
                    {next && (
                        <p className="border-demo-line grid gap-0.5 border-b py-3.5">
                            <span className="text-demo-muted text-sm">
                                Ensuite · {formatHour(next.startsAt, timezone)}
                            </span>
                            <span className="font-demo-serif text-2xl">{next.title}</span>
                            <span className="text-demo-ink-2 text-[0.95rem]">{next.place}</span>
                        </p>
                    )}
                    <a href="#programme" className="flex min-h-13 items-center">
                        Tout le programme →
                    </a>
                </div>
                <button
                    type="button"
                    onClick={onAddPhotos}
                    className="bg-demo-olive hover:bg-demo-olive-dark mt-3.5 flex min-h-15 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full text-[1.05rem] font-medium text-white transition-[background-color,scale] active:scale-[0.99]"
                >
                    <Camera aria-hidden="true" className="size-5.5" strokeWidth={1.6} />
                    Ajouter mes photos
                </button>
                <p className="mt-1.5 text-center">
                    <a href="#photos" className="text-demo-ink-2 inline-flex min-h-11 items-center">
                        {photoCount.toLocaleString("fr-FR")} photos déjà partagées
                    </a>
                </p>
            </div>
        </section>
    );
};
