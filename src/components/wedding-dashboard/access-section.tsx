"use client";

import { useState } from "react";
import { Pencil, Send, ShieldCheck, Trash2, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    accessSummary,
    collaboratorStatus,
    expiryLabel,
    ofPerson,
    roleLabel,
    type Collaborator,
    type CollaboratorDraft,
} from "@/lib/wedding-dashboard/access";
import { sinceLabel } from "@/lib/wedding-dashboard/calendar";
import type { CellTone } from "@/lib/wedding-dashboard/households";

import { AccessDialog } from "./access-dialog";
import { ConfirmPopover } from "./confirm-popover";
import { buttonStyles, Card, Chip, iconButton } from "./dashboard-ui";

type AccessSectionProps = {
    collaborators: readonly Collaborator[];
    couple: { first: string; second: string };
    now: Date;
    onInvite: (collaborator: Collaborator) => void;
    onUpdate: (collaborator: Collaborator, draft: CollaboratorDraft) => void;
    onReinvite: (collaborator: Collaborator) => void;
    onRemove: (collaborator: Collaborator) => void;
};

type Editing = { readonly mode: "new" } | { readonly mode: "edit"; readonly id: string };

const statusChip = (collaborator: Collaborator, now: Date): { tone: CellTone; label: string } => {
    const status = collaboratorStatus(collaborator, now);
    switch (status.kind) {
        case "active":
            return { tone: "yes", label: `A rejoint ${sinceLabel(status.since, now)}` };
        case "pending":
            return { tone: "wait", label: `Invitation ${expiryLabel(status.expiresAt, now)}` };
        default:
            return { tone: "no", label: "Invitation expirée" };
    }
};

const Avatar = ({ children, dark = false }: { children: string; dark?: boolean }) => (
    <span
        aria-hidden="true"
        className={cn(
            "grid size-10 place-items-center rounded-full text-sm font-semibold",
            dark ? "bg-wed-night text-wed-night-text font-wed-serif italic" : "bg-wed-line-soft",
        )}
    >
        {children}
    </span>
);

/**
 * Who else may open the dashboard: witnesses, a planner, a parent, with no limit. The couple
 * choose function by function what each person sees or changes.
 */
export const AccessSection = ({
    collaborators,
    couple,
    now,
    onInvite,
    onUpdate,
    onReinvite,
    onRemove,
}: AccessSectionProps) => {
    const [editing, setEditing] = useState<Editing | null>(null);
    const [notice, setNotice] = useState("");
    const edited =
        editing?.mode === "edit"
            ? (collaborators.find((collaborator) => collaborator.id === editing.id) ?? null)
            : null;

    const invite = () => setEditing({ mode: "new" });

    return (
        <Card
            id="acces"
            title="Accès au tableau de bord"
            titleId="acces-titre"
            plan="acces"
            aside={
                <button type="button" onClick={invite} className={buttonStyles.secondary}>
                    <UserPlus aria-hidden="true" />
                    Inviter une personne
                </button>
            }
        >
            <div className="grid gap-3 px-5 py-4">
                <p className="text-wed-muted text-sm">
                    Témoins, wedding planner, parents : invitez qui vous voulez, sans limite. Pour
                    chacun, vous choisissez fonction par fonction ce qu&apos;il voit ou modifie.
                </p>
                <ul aria-label="Personnes ayant accès" className="divide-wed-line-soft divide-y">
                    <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 py-3.5">
                        <Avatar
                            dark
                        >{`${couple.first.charAt(0)}${couple.second.charAt(0)}`}</Avatar>
                        <div className="min-w-0">
                            <p className="text-sm font-medium">
                                {couple.first} &amp; {couple.second}{" "}
                                <span className="text-wed-muted font-normal">· les mariés</span>
                            </p>
                            <p className="text-wed-ink-soft text-xs">
                                Tout voir, tout modifier, gérer les accès
                            </p>
                        </div>
                    </li>
                    {collaborators.map((collaborator) => {
                        const status = collaboratorStatus(collaborator, now);
                        const chip = statusChip(collaborator, now);
                        const who = ofPerson(collaborator.firstName);
                        return (
                            <li
                                key={collaborator.id}
                                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-2.5 py-3.5 md:grid-cols-[2.5rem_minmax(0,1fr)_auto] md:items-center"
                            >
                                <Avatar>{collaborator.firstName.charAt(0).toUpperCase()}</Avatar>
                                <div className="grid min-w-0 gap-1">
                                    <p className="text-sm font-medium">
                                        {collaborator.firstName}{" "}
                                        <span className="text-wed-muted font-normal">
                                            · {roleLabel(collaborator)}
                                        </span>
                                    </p>
                                    <p className="text-wed-muted truncate text-xs">
                                        {collaborator.email}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
                                        <Chip tone={chip.tone}>{chip.label}</Chip>
                                        <span className="text-wed-ink-soft">
                                            {accessSummary(collaborator.grant)}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-2 flex flex-wrap items-center justify-end gap-1 md:col-span-1">
                                    {status.kind !== "active" && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onReinvite(collaborator);
                                                setNotice(
                                                    `Invitation renvoyée à ${collaborator.firstName}, valable 72 h.`,
                                                );
                                            }}
                                            aria-label={`Renvoyer l'invitation ${who}`}
                                            className={cn(buttonStyles.quiet, "min-h-10")}
                                        >
                                            <Send aria-hidden="true" />
                                            Renvoyer
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditing({ mode: "edit", id: collaborator.id })
                                        }
                                        aria-label={`Modifier les accès ${who}`}
                                        className={cn(buttonStyles.quiet, "min-h-10")}
                                    >
                                        <Pencil aria-hidden="true" />
                                        Modifier
                                    </button>
                                    <ConfirmPopover
                                        question={`Retirer l'accès ${who} ?`}
                                        detail="Déconnexion immédiate de tous ses appareils. Vous pourrez l'inviter de nouveau."
                                        confirmLabel="Retirer l'accès"
                                        align="end"
                                        onConfirm={() => {
                                            onRemove(collaborator);
                                            setNotice(`Accès ${who} retiré.`);
                                        }}
                                    >
                                        <button
                                            type="button"
                                            aria-label={`Retirer l'accès ${who}`}
                                            className={iconButton}
                                        >
                                            <Trash2 aria-hidden="true" />
                                        </button>
                                    </ConfirmPopover>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                {collaborators.length === 0 && (
                    <p className="border-wed-line text-wed-muted rounded-2xl border border-dashed px-4 py-5 text-center text-sm">
                        Personne d&apos;autre que vous deux pour l&apos;instant.{" "}
                        <button
                            type="button"
                            onClick={invite}
                            className="text-wed-ink cursor-pointer underline underline-offset-4"
                        >
                            Inviter un témoin
                        </button>
                    </p>
                )}
                <p role="status" className="text-wed-yes text-sm empty:hidden">
                    {notice}
                </p>
                <p className="bg-wed-ivory text-wed-ink-soft flex items-start gap-2.5 rounded-xl px-4 py-3 text-xs">
                    <ShieldCheck
                        aria-hidden="true"
                        className="text-wed-yes mt-px size-4 shrink-0"
                    />
                    <span>
                        Restent réservés à vous deux : les accès, l&apos;export complet et votre
                        formule. Vos invités n&apos;ont jamais de compte : leur lien personnel
                        n&apos;ouvre que leur réponse.
                    </span>
                </p>
            </div>
            <AccessDialog
                open={editing !== null}
                onOpenChange={(open) => !open && setEditing(null)}
                editing={edited}
                couple={couple}
                taken={collaborators
                    .filter((collaborator) => collaborator.id !== edited?.id)
                    .map((collaborator) => collaborator.email)}
                onInvite={(collaborator) => {
                    onInvite(collaborator);
                    setNotice("");
                }}
                onUpdate={(collaborator, draft) => {
                    onUpdate(collaborator, draft);
                    setEditing(null);
                    setNotice(`Accès ${ofPerson(collaborator.firstName)} enregistrés.`);
                }}
            />
        </Card>
    );
};
