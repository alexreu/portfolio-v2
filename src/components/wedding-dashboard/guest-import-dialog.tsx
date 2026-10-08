"use client";

import { useState } from "react";
import {
    parseGuestList,
    type HouseholdGroup,
    type ImportIssue,
    type MomentPlan,
} from "@alexreu/wedding-core";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { cormorant } from "@/app/fonts/wedding";

import { buttonStyles, iconButton, inputStyles, plural } from "./dashboard-ui";

type GuestImportDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    moments: readonly Pick<MomentPlan, "key" | "title">[];
    groups: readonly HouseholdGroup[];
    /** Adds the households; the number added, or null when the wedding refused them. */
    onImport: (drafts: ReturnType<typeof parseGuestList>["drafts"]) => number | null;
};

const issueText = (issue: ImportIssue) => {
    switch (issue.code) {
        case "columns-missing":
            return "La première ligne doit nommer au moins les colonnes « Foyer » et « Prénom ».";
        case "household-required":
            return `Ligne ${issue.line} : le nom du foyer manque.`;
        case "first-name-required":
            return `Ligne ${issue.line} : le prénom manque.`;
        case "group-unknown":
            return `Ligne ${issue.line} : le groupe « ${issue.value} » n'existe pas, créez-le dans les réglages.`;
        default:
            return `Ligne ${issue.line} : le moment « ${issue.value} » n'est pas au programme.`;
    }
};

/** A sample to fill in a spreadsheet: the columns, and two households. */
const sample = (groups: readonly HouseholdGroup[], moments: GuestImportDialogProps["moments"]) =>
    [
        "Foyer;Prénom;Enfant;Groupe;E-mail;Moments",
        `Famille Martin;Paul;non;${groups[0]?.label ?? ""};paul.martin@exemple.fr;`,
        `Famille Martin;Léa;oui;${groups[0]?.label ?? ""};;`,
        `Julien Bertrand;Julien;non;;julien@exemple.fr;${moments[0]?.title ?? ""}`,
    ].join("\r\n");

const ImportBody = ({
    moments,
    groups,
    onImport,
}: Omit<GuestImportDialogProps, "open" | "onOpenChange">) => {
    const [text, setText] = useState("");
    const [added, setAdded] = useState<number | null>(null);
    useScrollLock();
    const parsed = text.trim() ? parseGuestList(text, { moments, groups }) : null;
    const guests = parsed?.drafts.reduce((sum, draft) => sum + draft.guests.length, 0) ?? 0;

    if (added !== null)
        return (
            <div role="status" className="grid gap-5">
                <p className="font-wed-serif text-3xl leading-tight">
                    {plural(added, "foyer importé", "foyers importés")}
                </p>
                <p className="text-wed-muted text-sm">
                    Leurs liens personnels sont prêts, dans la liste des invités.
                </p>
                <Dialog.Close className={cn(buttonStyles.primary, "justify-self-start")}>
                    Voir la liste
                </Dialog.Close>
            </div>
        );

    return (
        <form
            noValidate
            aria-label="Importer une liste d'invités"
            onSubmit={(event) => {
                event.preventDefault();
                if (!parsed || parsed.drafts.length === 0) return;
                setAdded(onImport(parsed.drafts));
            }}
            className="grid gap-4"
        >
            <p className="text-wed-muted text-sm">
                Une ligne par invité, depuis un tableur enregistré en CSV. Les lignes d&apos;un même
                foyer sont regroupées ; sans colonne « Moments », chaque foyer est invité à tout.
            </p>
            <div className="flex flex-wrap gap-2">
                <label className={cn(buttonStyles.secondary, "cursor-pointer")}>
                    <Upload aria-hidden="true" />
                    Choisir un fichier
                    <input
                        type="file"
                        accept=".csv,text/csv,text/plain"
                        className="sr-only"
                        onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (file) setText(await file.text());
                        }}
                    />
                </label>
                <a
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(`﻿${sample(groups, moments)}`)}`}
                    download="modele-invites.csv"
                    className={buttonStyles.quiet}
                >
                    <Download aria-hidden="true" />
                    Télécharger un modèle
                </a>
            </div>
            <label className="grid gap-1.5 text-sm">
                <span className="text-wed-ink-soft">Ou collez la liste</span>
                <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    rows={6}
                    spellCheck={false}
                    placeholder="Foyer;Prénom;Enfant;Groupe;E-mail"
                    className={cn(inputStyles, "min-h-32 py-2.5 font-mono text-[0.8rem]")}
                />
            </label>
            {parsed && (
                <div aria-live="polite" className="grid gap-2 text-sm">
                    <p className="text-wed-ink">
                        {plural(parsed.drafts.length, "foyer", "foyers")} ·{" "}
                        {plural(guests, "invité", "invités")} prêts à importer
                    </p>
                    {parsed.issues.length > 0 && (
                        <ul className="text-wed-no grid gap-1 text-[0.8rem]">
                            {parsed.issues.slice(0, 8).map((issue) => (
                                <li key={`${issue.line}-${issue.code}`}>{issueText(issue)}</li>
                            ))}
                            {parsed.issues.length > 8 && (
                                <li>Et {parsed.issues.length - 8} autres lignes à corriger.</li>
                            )}
                        </ul>
                    )}
                </div>
            )}
            <button
                type="submit"
                disabled={!parsed || parsed.drafts.length === 0}
                className={cn(buttonStyles.primary, "min-h-12 w-full")}
            >
                {parsed && parsed.drafts.length > 0
                    ? `Importer ${plural(parsed.drafts.length, "foyer", "foyers")}`
                    : "Importer"}
            </button>
        </form>
    );
};

/** « Importer une liste » : a whole guest list at once, from a spreadsheet. */
export const GuestImportDialog = ({ open, onOpenChange, ...body }: GuestImportDialogProps) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
            <Dialog.Overlay className="bg-wed-night/55 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50" />
            <Dialog.Content
                data-lenis-prevent
                className={`${cormorant.variable} bg-wed-paper text-wed-ink font-main data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] motion-reduce:animate-none sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[min(36rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-7`}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <Dialog.Title className="font-wed-serif text-3xl leading-tight font-medium">
                            Importer une liste
                        </Dialog.Title>
                        <Dialog.Description className="text-wed-muted mt-1 text-sm">
                            Tous vos invités d&apos;un coup, un lien personnel par foyer.
                        </Dialog.Description>
                    </div>
                    <Dialog.Close aria-label="Fermer" className={iconButton}>
                        <X aria-hidden="true" />
                    </Dialog.Close>
                </div>
                {open && <ImportBody {...body} />}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);
