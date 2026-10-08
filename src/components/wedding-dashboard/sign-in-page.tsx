"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

import { DASHBOARD_PATH } from "@/lib/wedding-demo/routes";
import { COUPLE_EMAILS, signInTarget, type SignInTarget } from "@/lib/wedding-demo/sign-in";
import { useNow } from "@/hooks/use-now";
import { useWeddingDemo } from "@/hooks/use-wedding-demo";

import { buttonStyles, inputStyles } from "./dashboard-ui";

/** Where the link opens: the couple's view, or the dashboard as the person invited sees it. */
const hrefOf = (target: SignInTarget) =>
    target.kind === "couple"
        ? DASHBOARD_PATH
        : `${DASHBOARD_PATH}?vue=${encodeURIComponent(target.id)}`;

/** What the demo shows once the « e-mail » left: the link one would have received. */
const DemoLink = ({ target, onOpen }: { target: SignInTarget | null; onOpen: () => void }) => {
    if (!target)
        return (
            <p>
                Démo : aucun compte pour cette adresse, rien ne part. Essayez celle de Camille ou
                d&apos;une personne invitée, ci-dessous.
            </p>
        );
    if (target.kind === "collaborator" && target.status === "expired")
        return (
            <p>
                Démo : l&apos;invitation de {target.firstName} a expiré. Les mariés peuvent la
                renvoyer depuis leur page Accès.
            </p>
        );
    return (
        <div className="grid justify-items-start gap-3">
            <p>
                Démo : voici le lien que{" "}
                {target.kind === "couple" ? "vous auriez" : `${target.firstName} aurait`} reçu.
                {target.kind === "collaborator" &&
                    target.status === "pending" &&
                    " L'ouvrir accepte aussi l'invitation."}
            </p>
            <button type="button" onClick={onOpen} className={buttonStyles.primary}>
                Ouvrir le lien
            </button>
        </div>
    );
};

/**
 * The couple's sign-in, as the platform will have it: no password, a link sent by e-mail to an
 * address already known, and the same answer for every address.
 */
export const SignInPage = () => {
    const { state, dispatch } = useWeddingDemo();
    const now = useNow();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState<{ target: SignInTarget | null } | null>(null);

    const open = (target: SignInTarget) => {
        if (target.kind === "collaborator" && target.status === "pending")
            dispatch(
                { type: "collaborator.join", collaboratorId: target.id },
                { actor: { kind: "invitee", collaboratorId: target.id } },
            );
        router.push(hrefOf(target));
    };

    const tryWith = [
        { label: "Camille", email: COUPLE_EMAILS[0] },
        ...(state?.collaborators ?? []).map((person) => ({
            label: person.firstName,
            email: person.email,
        })),
    ];

    return (
        <main className="mx-auto grid min-h-dvh w-full max-w-md content-center gap-6 px-4 py-12">
            <div>
                <p className="font-wed-serif text-[2.6rem] leading-tight font-medium">
                    Votre tableau de bord
                </p>
                <p className="text-wed-muted mt-1">Camille &amp; Hugo · sans mot de passe</p>
            </div>
            {sent ? (
                <section
                    aria-labelledby="lien-titre"
                    className="border-wed-line-soft bg-wed-paper grid gap-4 rounded-2xl border p-6"
                >
                    <h1 id="lien-titre" className="flex items-center gap-2 text-lg font-semibold">
                        <Mail aria-hidden="true" className="size-5" />
                        Vérifiez votre boîte mail
                    </h1>
                    <p role="status" className="text-wed-ink-soft">
                        Si cette adresse est connue, un lien de connexion vient de partir. Il est
                        valable 15 minutes et ne sert qu&apos;une fois.
                    </p>
                    <div className="border-wed-line bg-wed-ivory/70 text-wed-ink-soft rounded-xl border border-dashed p-4 text-sm">
                        <DemoLink
                            target={sent.target}
                            onOpen={() => sent.target && open(sent.target)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setSent(null)}
                        className={`${buttonStyles.quiet} justify-self-start`}
                    >
                        Utiliser une autre adresse
                    </button>
                </section>
            ) : (
                <form
                    noValidate
                    aria-labelledby="connexion-titre"
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (!state) return;
                        setSent({ target: signInTarget(state, email, now) });
                    }}
                    className="border-wed-line-soft bg-wed-paper grid gap-4 rounded-2xl border p-6"
                >
                    <h1 id="connexion-titre" className="text-lg font-semibold">
                        Recevoir un lien de connexion
                    </h1>
                    <label className="grid gap-1.5 text-sm">
                        <span className="text-wed-ink-soft">Votre adresse e-mail</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
                            className={inputStyles}
                        />
                    </label>
                    <button type="submit" className={buttonStyles.primary}>
                        Recevoir le lien
                    </button>
                </form>
            )}
            <div className="text-wed-muted grid gap-2 text-sm">
                <p>Démo : essayez une de ces adresses.</p>
                <ul className="flex flex-wrap gap-2">
                    {tryWith.map((entry) => (
                        <li key={entry.email}>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail(entry.email);
                                    setSent(null);
                                }}
                                className={buttonStyles.quiet}
                            >
                                {entry.label}
                            </button>
                        </li>
                    ))}
                </ul>
                <Link href={DASHBOARD_PATH} className="underline underline-offset-4">
                    Retour au tableau de bord
                </Link>
            </div>
        </main>
    );
};
