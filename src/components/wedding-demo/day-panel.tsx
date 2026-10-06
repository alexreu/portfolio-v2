"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

import { formatHour } from "@/lib/wedding/format-hour";
import type { Programme } from "@/lib/wedding/programme";

type DayPanelProps = {
    /** "Samedi 12 juin" */
    dateLabel: string;
    guestName: string;
    table: { readonly number: number; readonly name: string };
    programme: Programme;
    photoCount: number;
    onAddPhotos: () => void;
};

/** The personal link on the wedding day: table, what is on now, and photo upload. */
export const DayPanel = ({
    dateLabel,
    guestName,
    table,
    programme,
    photoCount,
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
                <div className="bg-demo-ink text-demo-paper flex items-center justify-between gap-4 rounded-lg px-5 py-4.5">
                    <p>
                        <span className="text-demo-night-muted block text-sm">Votre table</span>
                        <span className="font-demo-serif block text-6xl leading-none">
                            {table.number}
                        </span>
                        <span className="font-demo-serif text-demo-sand text-xl italic">
                            {table.name}
                        </span>
                    </p>
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
                {mapOpen && (
                    <div
                        id="plan-salle"
                        className="bg-demo-card border-demo-line mt-2 rounded-lg border p-2.5"
                    >
                        <svg
                            viewBox="0 0 280 150"
                            role="img"
                            aria-label={`Plan de la salle, table ${table.number} en surbrillance`}
                            className="h-auto w-full"
                        >
                            <rect
                                x="1"
                                y="1"
                                width="278"
                                height="148"
                                rx="4"
                                className="fill-demo-card stroke-demo-line"
                            />
                            <rect
                                x="95"
                                y="8"
                                width="90"
                                height="18"
                                rx="2"
                                className="fill-demo-paper-2"
                            />
                            <text
                                x="140"
                                y="21"
                                textAnchor="middle"
                                className="fill-demo-muted text-[10px]"
                            >
                                Mariés
                            </text>
                            {[
                                [45, 58],
                                [100, 58],
                                [180, 58],
                                [235, 58],
                                [45, 112],
                                [100, 112],
                                [235, 112],
                            ].map(([cx, cy]) => (
                                <circle
                                    key={`${cx}-${cy}`}
                                    cx={cx}
                                    cy={cy}
                                    r="16"
                                    className="fill-demo-paper-2"
                                />
                            ))}
                            <circle cx="180" cy="112" r="18" className="fill-demo-olive" />
                            <text
                                x="180"
                                y="117"
                                textAnchor="middle"
                                className="fill-demo-card text-[14px]"
                            >
                                {table.number}
                            </text>
                            <text
                                x="140"
                                y="144"
                                textAnchor="middle"
                                className="fill-demo-muted text-[10px]"
                            >
                                Entrée de l&apos;orangerie
                            </text>
                        </svg>
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
                                {current.endsAt && ` · jusqu'à ${formatHour(current.endsAt)}`}
                            </span>
                        </p>
                    )}
                    {next && (
                        <p className="border-demo-line grid gap-0.5 border-b py-3.5">
                            <span className="text-demo-muted text-sm">
                                Ensuite · {formatHour(next.startsAt)}
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
