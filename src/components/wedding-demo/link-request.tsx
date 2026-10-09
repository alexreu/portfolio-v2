"use client";

import { useState } from "react";
import Link from "next/link";
import { findInvitations, type HouseholdRecord, type InvitationMatch } from "@alexreu/wedding-core";
import { Search } from "lucide-react";

type LinkRequestProps = {
    households: readonly HouseholdRecord[];
    /** Where a guest without an address writes to the couple; empty when none was given. */
    contactEmail: string;
    /** Sends the household its link, to the address the couple noted. */
    onRequest: (householdId: string) => void;
};

/** One search per page: fixed ids, the same on the server and in the browser. */
const SEARCH = "recherche-invitation";
const RESULTS = "recherche-invitation-resultats";

/**
 * The answer, for whoever came through the shared faire-part's code: find one's household by
 * name and have its link sent to the address the couple noted. The page never opens the
 * household itself, so nobody answers in someone else's name.
 */
export const LinkRequest = ({ households, contactEmail, onRequest }: LinkRequestProps) => {
    const [query, setQuery] = useState("");
    const [asked, setAsked] = useState<InvitationMatch | null>(null);
    const matches = findInvitations(households, query);
    const typed = query.trim().length > 1;

    const ask = (match: InvitationMatch) => {
        if (match.email) onRequest(match.householdId);
        setAsked(match);
    };

    return (
        <div className="grid gap-5">
            <div>
                <h3 className="font-demo-serif text-2xl font-normal">
                    Recevoir mon lien personnel
                </h3>
                <p className="text-demo-ink-2 mt-2">
                    Tapez votre prénom ou votre nom : votre lien part à l&apos;adresse que nous
                    avons notée pour vous.
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
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setAsked(null);
                    }}
                    placeholder="Prénom ou nom"
                    autoComplete="off"
                    enterKeyHint="search"
                    aria-describedby={RESULTS}
                    className="bg-demo-paper border-demo-line focus:border-demo-ink min-h-14 w-full rounded-full border pr-5 pl-12 text-lg outline-none"
                />
            </div>
            <div id={RESULTS} aria-live="polite">
                {typed && matches.length === 0 && (
                    <p className="text-demo-ink-2">
                        Personne à ce nom parmi les invités. Vérifiez l&apos;orthographe, ou
                        demandez votre lien aux mariés.
                    </p>
                )}
                {matches.length > 0 && (
                    <ul aria-label="Invitations trouvées" className="grid gap-2">
                        {matches.map((match) => (
                            <li key={match.householdId}>
                                <button
                                    type="button"
                                    onClick={() => ask(match)}
                                    aria-pressed={asked?.householdId === match.householdId}
                                    className="border-demo-line hover:border-demo-ink aria-pressed:border-demo-olive aria-pressed:bg-demo-paper flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 py-2.5 text-left transition-colors"
                                >
                                    <span className="font-medium">{match.label}</span>
                                    <span className="text-demo-muted text-sm">
                                        {match.email ? "Recevoir mon lien" : "Pas d'adresse notée"}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <p role="status" className="text-demo-ink-2 empty:hidden">
                {asked &&
                    (asked.email ? (
                        <>
                            Votre lien personnel part à{" "}
                            <strong className="text-demo-ink font-medium">{asked.email}</strong>. Il
                            ouvre votre réponse, sans rien taper.
                        </>
                    ) : (
                        <>
                            Nous n&apos;avons pas d&apos;adresse pour {asked.label} : demandez votre
                            lien aux mariés
                            {contactEmail ? (
                                <>
                                    {" "}
                                    à{" "}
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="underline underline-offset-4"
                                    >
                                        {contactEmail}
                                    </a>
                                </>
                            ) : null}
                            .
                        </>
                    ))}
            </p>
            {asked?.email && (
                <Link
                    href={`/mariage/demo?foyer=${encodeURIComponent(asked.householdId)}`}
                    className="border-demo-olive text-demo-olive inline-flex min-h-11 items-center justify-self-start rounded-full border border-dashed px-5 text-sm"
                >
                    Démo : aucun e-mail ne part, ouvrir le lien reçu
                </Link>
            )}
        </div>
    );
};
