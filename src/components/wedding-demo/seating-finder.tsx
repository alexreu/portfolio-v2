"use client";

import { useState } from "react";
import { findGuests, type BoardTable, type RoomLayout } from "@alexreu/wedding-core";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

import { RoomPlan } from "./room-plan";

type SeatingFinderProps = {
    board: readonly BoardTable[];
    room: RoomLayout;
};

/** A table, picked from the list or through a guest found by name. */
/** One search per page: fixed ids, the same on the server and in the browser. */
const SEARCH = "recherche-table";
const RESULTS = "recherche-table-resultats";

type Picked = {
    readonly tableId: string;
    readonly guest: { readonly id: string; readonly firstName: string } | null;
};

/**
 * The room plan for the dinner, open to everyone who scans the code at the entrance: type a
 * first or last name to light up a table, or read who sits where, table by table.
 */
export const SeatingFinder = ({ board, room }: SeatingFinderProps) => {
    const [query, setQuery] = useState("");
    const [picked, setPicked] = useState<Picked | null>(null);
    const matches = findGuests(board, query);
    const table = board.find((entry) => entry.table.id === picked?.tableId)?.table ?? null;
    const typed = query.trim().length > 0;

    const pick = (next: Picked) => {
        setPicked(next);
        document.getElementById("plan-salle")?.scrollIntoView({
            block: "nearest",
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
        });
    };

    return (
        <div className="grid gap-8">
            <section aria-labelledby="trouver-titre" className="grid gap-4">
                <div>
                    <h1
                        id="trouver-titre"
                        className="font-demo-serif text-4xl leading-tight font-normal md:text-5xl"
                    >
                        Trouvez votre table
                    </h1>
                    <p className="text-demo-ink-2 mt-2">
                        Tapez votre prénom ou votre nom : votre table s&apos;allume sur le plan de
                        la salle.
                    </p>
                </div>
                <div className="relative">
                    <label htmlFor={SEARCH} className="sr-only">
                        Votre prénom ou votre nom
                    </label>
                    <Search
                        aria-hidden="true"
                        className="text-demo-muted pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
                    />
                    <input
                        id={SEARCH}
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Prénom ou nom"
                        autoComplete="off"
                        enterKeyHint="search"
                        aria-describedby={RESULTS}
                        className="bg-demo-card border-demo-line focus:border-demo-ink min-h-14 w-full rounded-full border pr-5 pl-12 text-lg outline-none"
                    />
                </div>
                <div id={RESULTS} aria-live="polite">
                    {typed && matches.length === 0 && (
                        <p className="text-demo-ink-2">
                            Personne à ce nom parmi les invités du dîner. Vérifiez
                            l&apos;orthographe, ou demandez aux témoins à l&apos;entrée.
                        </p>
                    )}
                    {matches.length > 0 && (
                        <ul aria-label="Invités trouvés" className="grid gap-2">
                            {matches.map((match) => (
                                <li key={match.guestId}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            pick({
                                                tableId: match.table.id,
                                                guest: {
                                                    id: match.guestId,
                                                    firstName: match.firstName,
                                                },
                                            })
                                        }
                                        aria-pressed={picked?.guest?.id === match.guestId}
                                        className="border-demo-line hover:border-demo-ink aria-pressed:border-demo-olive aria-pressed:bg-demo-card flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 py-2.5 text-left transition-colors"
                                    >
                                        <span>
                                            <span className="block font-medium">
                                                {match.firstName}
                                            </span>
                                            <span className="text-demo-muted text-sm">
                                                {match.household}
                                            </span>
                                        </span>
                                        <span className="text-right">
                                            <span className="font-demo-serif block text-2xl leading-none">
                                                Table {match.table.number}
                                            </span>
                                            <span className="text-demo-earth-dark text-sm italic">
                                                {match.table.name}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            <section aria-labelledby="plan-titre" className="grid gap-3">
                <h2 id="plan-titre" className="font-demo-serif text-3xl font-normal">
                    Le plan de la salle
                </h2>
                {table && (
                    <p role="status" className="bg-demo-ink text-demo-paper rounded-lg px-5 py-4">
                        <span className="text-demo-night-muted block text-sm">
                            {picked?.guest
                                ? `${picked.guest.firstName}, vous êtes à la`
                                : "Vous regardez la"}
                        </span>
                        <span className="font-demo-serif text-4xl">Table {table.number}</span>{" "}
                        <span className="font-demo-serif text-demo-sand text-xl italic">
                            {table.name}
                        </span>
                    </p>
                )}
                <div
                    id="plan-salle"
                    className="bg-demo-card border-demo-line scroll-mt-4 rounded-lg border p-2.5"
                >
                    <RoomPlan
                        tables={board.map((entry) => entry.table)}
                        room={room}
                        highlight={table ? [table.id] : []}
                        label={
                            table
                                ? `Plan de la salle, table ${table.number} en surbrillance`
                                : "Plan de la salle"
                        }
                    />
                </div>
            </section>

            <section aria-labelledby="tables-titre" className="grid gap-3">
                <h2 id="tables-titre" className="font-demo-serif text-3xl font-normal">
                    Qui est à quelle table
                </h2>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                    {board.map(({ table: entry, guests }) => (
                        <li key={entry.id}>
                            <button
                                type="button"
                                onClick={() => pick({ tableId: entry.id, guest: null })}
                                aria-pressed={picked?.tableId === entry.id}
                                aria-label={`Table ${entry.number}, ${entry.name} : ${guests.length > 0 ? guests.map((guest) => guest.firstName).join(", ") : "personne pour l'instant"}`}
                                className={cn(
                                    "border-demo-line hover:border-demo-ink grid h-full w-full cursor-pointer content-start gap-1.5 rounded-lg border px-4 py-3.5 text-left transition-colors",
                                    picked?.tableId === entry.id &&
                                        "border-demo-olive bg-demo-card",
                                )}
                            >
                                <span className="flex items-baseline gap-2">
                                    <span className="font-demo-serif text-2xl">
                                        Table {entry.number}
                                    </span>
                                    <span className="text-demo-earth-dark italic">
                                        {entry.name}
                                    </span>
                                </span>
                                <span className="text-demo-ink-2 text-[0.95rem]">
                                    {guests.length > 0
                                        ? guests.map((guest) => guest.firstName).join(", ")
                                        : "Personne pour l'instant"}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};
