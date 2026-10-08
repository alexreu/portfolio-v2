"use client";

import { useState } from "react";
import { Check, ChevronRight, Copy, ExternalLink, Plus, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { sinceLabel } from "@/lib/wedding-dashboard/calendar";
import {
    filterHouseholds,
    groupLabel,
    householdSummary,
    momentCell,
    statusCounts,
    type HouseholdFilter,
    type StatusFilter,
} from "@/lib/wedding-dashboard/households";
import { previewOf } from "@/lib/wedding-dashboard/preview-link";
import type { GroupKey, HouseholdRecord, InvitationDesign } from "@/lib/wedding-dashboard/types";
import type { Moment } from "@/lib/wedding/types";

import { buttonStyles, Card, Chip, iconButton, inputStyles, plural, Select } from "./dashboard-ui";

type HouseholdsSectionProps = {
    households: readonly HouseholdRecord[];
    moments: readonly Moment[];
    design: InvitationDesign;
    now: Date;
    /** The household just created, shown first and lit up. */
    highlightId: string | null;
    linkFor: (household: HouseholdRecord) => string;
    /** Left out for whoever may not create a household, with its button. */
    onAddHousehold?: () => void;
    /** Whether the person looking may read the diets, health data. */
    showDiets: boolean;
    /** Opens the household's whole answer. */
    onOpen: (household: HouseholdRecord) => void;
};

const NO_FILTER: HouseholdFilter = { query: "", status: "all", group: "all" };

const statusTabs: readonly { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "answered", label: "Répondu" },
    { value: "incomplete", label: "À compléter" },
    { value: "opened", label: "Lien ouvert" },
    { value: "never-opened", label: "Jamais ouvert" },
];

const groups: readonly GroupKey[] = ["famille-1", "famille-2", "amis", "collegues"];

const lastSeen = (household: HouseholdRecord, now: Date) => {
    if (household.lastSeenAt) return sinceLabel(household.lastSeenAt, now);
    return household.answeredBy === "maries" ? "réponse papier" : "—";
};

/** The household's name opens its detail: the keyboard way into the whole row. */
const HouseholdName = ({
    household,
    design,
    showDiets,
    onOpen,
}: {
    household: HouseholdRecord;
    design: InvitationDesign;
    showDiets: boolean;
    onOpen: (household: HouseholdRecord) => void;
}) => (
    <button
        type="button"
        onClick={() => onOpen(household)}
        aria-label={`Voir la réponse de ${household.name}`}
        className="group/name -mx-1.5 min-w-0 cursor-pointer rounded-lg px-1.5 py-0.5 text-left"
    >
        <span className="flex items-center gap-1 font-medium [overflow-wrap:anywhere] group-hover/name:underline group-hover/name:underline-offset-4">
            {household.name}
            <ChevronRight aria-hidden="true" className="text-wed-muted size-4" />
        </span>
        <span className="text-wed-muted block text-xs">
            {householdSummary(household, { diets: showDiets })}
            {household.answeredBy === "maries" && ` · réponse saisie par ${design.first}`}
        </span>
    </button>
);

/** A click anywhere on a row opens it, except on its own buttons and links. */
const openFromRow =
    (household: HouseholdRecord, onOpen: (household: HouseholdRecord) => void) =>
    (event: React.MouseEvent<HTMLElement>) => {
        if (!(event.target as HTMLElement).closest("button, a")) onOpen(household);
    };

export const HouseholdsSection = ({
    households,
    moments,
    design,
    now,
    highlightId,
    linkFor,
    onAddHousehold,
    showDiets,
    onOpen,
}: HouseholdsSectionProps) => {
    const still = useReducedMotion() ?? false;
    const [filter, setFilter] = useState<HouseholdFilter>(NO_FILTER);
    /** A household just created is shown whatever was filtered: the filters start over. */
    const [litFor, setLitFor] = useState(highlightId);
    if (highlightId !== litFor) {
        setLitFor(highlightId);
        if (highlightId) setFilter(NO_FILTER);
    }
    const [copied, setCopied] = useState<HouseholdRecord | null>(null);
    const counts = statusCounts(households);
    const visible = filterHouseholds(households, filter);
    const guests = households.reduce((sum, household) => sum + household.guests.length, 0);

    const copy = async (household: HouseholdRecord) => {
        try {
            await navigator.clipboard.writeText(linkFor(household));
            setCopied(household);
        } catch {
            window.prompt("Copiez le lien personnel :", linkFor(household));
        }
    };

    const actions = (household: HouseholdRecord) => (
        <div className="flex justify-end gap-1">
            <button
                type="button"
                onClick={() => copy(household)}
                aria-label={`Copier le lien de ${household.name}`}
                className={iconButton}
            >
                {copied?.id === household.id ? (
                    <Check aria-hidden="true" />
                ) : (
                    <Copy aria-hidden="true" />
                )}
            </button>
            <a
                href={previewOf(linkFor(household))}
                target="_blank"
                rel="noopener"
                aria-label={`Ouvrir le faire-part de ${household.name} (nouvel onglet)`}
                className={iconButton}
            >
                <ExternalLink aria-hidden="true" />
            </a>
        </div>
    );

    return (
        <Card
            id="invites"
            title="Foyers invités"
            titleId="invites-titre"
            aside={
                <div className="flex items-center gap-3">
                    <span className="text-wed-muted text-[0.8rem]">
                        {plural(households.length, "foyer", "foyers")} ·{" "}
                        {plural(guests, "invité", "invités")}
                    </span>
                    {onAddHousehold && (
                        <button
                            type="button"
                            onClick={onAddHousehold}
                            className={buttonStyles.secondary}
                        >
                            <Plus aria-hidden="true" />
                            Créer un faire-part
                        </button>
                    )}
                </div>
            }
        >
            <div className="border-wed-line-soft flex flex-wrap items-center gap-x-4 gap-y-3 border-b px-5 py-4">
                <label className="relative min-w-52 flex-1 md:max-w-80">
                    <span className="sr-only">Rechercher un foyer ou un prénom</span>
                    <Search
                        aria-hidden="true"
                        className="text-wed-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
                    />
                    <input
                        type="search"
                        value={filter.query}
                        onChange={(event) => setFilter({ ...filter, query: event.target.value })}
                        placeholder="Rechercher un nom"
                        className={cn(inputStyles, "pl-10")}
                    />
                </label>
                <div
                    role="group"
                    aria-label="Filtrer par statut"
                    className="bg-wed-ivory flex max-w-full min-w-0 gap-1 overflow-x-auto rounded-full p-1"
                >
                    {statusTabs
                        .filter((tab) => tab.value !== "incomplete" || counts.incomplete > 0)
                        .map((tab) => {
                            const current = filter.status === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    aria-pressed={current}
                                    onClick={() => setFilter({ ...filter, status: tab.value })}
                                    className={cn(
                                        "relative min-h-9 cursor-pointer rounded-full px-3.5 text-[0.8rem] whitespace-nowrap transition-colors duration-200",
                                        current
                                            ? "text-wed-ink"
                                            : "text-wed-muted hover:text-wed-ink",
                                    )}
                                >
                                    {/* One pill, shared by the tabs: it slides to the one picked. */}
                                    {current && (
                                        <motion.span
                                            aria-hidden="true"
                                            layoutId="household-status-pill"
                                            transition={
                                                still
                                                    ? { duration: 0 }
                                                    : {
                                                          type: "spring",
                                                          stiffness: 500,
                                                          damping: 38,
                                                      }
                                            }
                                            className="bg-wed-paper absolute inset-0 rounded-full shadow-sm"
                                        />
                                    )}
                                    {/* A hidden bold copy holds the width: tabs never shift as the weight changes. */}
                                    <span className="relative grid">
                                        <span
                                            className={cn(
                                                "col-start-1 row-start-1",
                                                current && "font-medium",
                                            )}
                                        >
                                            {tab.label} {counts[tab.value]}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="invisible col-start-1 row-start-1 font-medium"
                                        >
                                            {tab.label} {counts[tab.value]}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                </div>
                <Select
                    aria-label="Filtrer par groupe"
                    value={filter.group}
                    onChange={(event) =>
                        setFilter({
                            ...filter,
                            group: event.target.value as HouseholdFilter["group"],
                        })
                    }
                    wrapperClassName="w-auto"
                >
                    <option value="all">Tous les groupes</option>
                    {groups.map((group) => (
                        <option key={group} value={group}>
                            {groupLabel(group, design)}
                        </option>
                    ))}
                </Select>
            </div>

            <p aria-live="polite" className="sr-only">
                {copied && `Lien de ${copied.name} copié.`}
            </p>

            {visible.length === 0 ? (
                <p className="text-wed-muted px-5 py-10 text-center">
                    {households.length === 0
                        ? "Aucun foyer pour l'instant : créez votre premier faire-part."
                        : "Aucun foyer ne correspond."}
                </p>
            ) : (
                <>
                    <div className="relative hidden overflow-x-auto xl:block">
                        <table className="w-full text-left text-sm">
                            <thead className="text-wed-muted text-xs">
                                <tr className="border-wed-line-soft border-b">
                                    <th scope="col" className="px-5 py-2.5 font-medium">
                                        Foyer
                                    </th>
                                    <th scope="col" className="px-3 py-2.5 font-medium">
                                        Groupe
                                    </th>
                                    {moments.map((moment) => (
                                        <th
                                            key={moment.key}
                                            scope="col"
                                            className="px-3 py-2.5 font-medium"
                                        >
                                            {moment.title}
                                        </th>
                                    ))}
                                    <th scope="col" className="px-3 py-2.5 font-medium">
                                        Dernier accès
                                    </th>
                                    <th scope="col" className="px-5 py-2.5">
                                        <span className="sr-only">Lien personnel</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map((household) => (
                                    <tr
                                        key={household.id}
                                        onClick={openFromRow(household, onOpen)}
                                        className={cn(
                                            "border-wed-line-soft hover:bg-wed-ivory/60 cursor-pointer border-b transition-colors duration-1000 last:border-b-0",
                                            household.id === highlightId && "bg-wed-wait-bg/70",
                                        )}
                                    >
                                        <td className="px-5 py-3">
                                            <HouseholdName
                                                showDiets={showDiets}
                                                household={household}
                                                design={design}
                                                onOpen={onOpen}
                                            />
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="border-wed-line text-wed-muted rounded-md border px-2 py-0.5 text-xs whitespace-nowrap">
                                                {groupLabel(household.group, design)}
                                            </span>
                                        </td>
                                        {moments.map((moment) => {
                                            const cell = momentCell(household, moment.key);
                                            return (
                                                <td key={moment.key} className="px-3 py-3">
                                                    <Chip tone={cell.tone}>{cell.label}</Chip>
                                                </td>
                                            );
                                        })}
                                        <td className="text-wed-muted px-3 py-3 text-[0.8rem] whitespace-nowrap">
                                            {lastSeen(household, now)}
                                        </td>
                                        <td className="px-5 py-1.5">{actions(household)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <ul className="divide-wed-line-soft divide-y xl:hidden">
                        {visible.map((household) => (
                            <li
                                key={household.id}
                                onClick={openFromRow(household, onOpen)}
                                className={cn(
                                    "grid cursor-pointer grid-cols-[1fr_auto] gap-x-2 gap-y-2.5 px-5 py-4 transition-colors duration-1000",
                                    household.id === highlightId && "bg-wed-wait-bg/70",
                                )}
                            >
                                <p className="text-sm">
                                    <HouseholdName
                                        showDiets={showDiets}
                                        household={household}
                                        design={design}
                                        onOpen={onOpen}
                                    />
                                </p>
                                {actions(household)}
                                <dl className="col-span-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
                                    {moments.map((moment) => {
                                        const cell = momentCell(household, moment.key);
                                        return (
                                            <div
                                                key={moment.key}
                                                className="flex items-center gap-1.5"
                                            >
                                                <dt className="text-wed-muted">{moment.title}</dt>
                                                <dd>
                                                    <Chip tone={cell.tone}>{cell.label}</Chip>
                                                </dd>
                                            </div>
                                        );
                                    })}
                                </dl>
                                <p className="text-wed-muted col-span-2 text-xs">
                                    {groupLabel(household.group, design)} · dernier accès{" "}
                                    {lastSeen(household, now)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Card>
    );
};
