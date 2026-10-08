"use client";

import { useState } from "react";
import { AlertTriangle, Plus, RotateCw, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DraftIssue } from "@/lib/wedding-dashboard/drafts";
import { isFixture, pick, type Fixture } from "@/lib/wedding-dashboard/plan-selection";
import { freeSpot } from "@/lib/wedding-dashboard/room";
import {
    nextTableNumber,
    seatingPlan,
    tablesRemoval,
    validateTable,
    type SeatedGuest,
} from "@/lib/wedding-dashboard/seating";
import type {
    HouseholdRecord,
    RoomLayout,
    RoomSize,
    SeatTable,
} from "@/lib/wedding-dashboard/types";
import { RoomPlan } from "@/components/wedding-demo/room-plan";

import { ConfirmPopover } from "./confirm-popover";
import {
    buttonStyles,
    Card,
    FieldError,
    iconButton,
    inputStyles,
    issueMessages,
    plural,
    Select,
} from "./dashboard-ui";

type SeatingSectionProps = {
    households: readonly HouseholdRecord[];
    tables: readonly SeatTable[];
    seats: Readonly<Record<string, string>>;
    room: RoomLayout;
    onSaveRoom: (name: string, size: RoomSize) => void;
    onMoveFixture: (fixture: Fixture, x: number, y: number) => void;
    onRotateFixture: (fixture: Fixture) => void;
    onSaveTable: (table: SeatTable) => void;
    onMoveTable: (tableId: string, x: number, y: number) => void;
    onRemoveTables: (tableIds: readonly string[]) => void;
    onSeatGuest: (guestId: string, tableId: string | null) => void;
    onSeatHousehold: (householdId: string, tableId: string) => void;
};

/** A round action floating beside what is picked on the plan. */
const floatingButton =
    "bg-wed-paper border-wed-line grid size-9 cursor-pointer place-items-center rounded-full border shadow-md transition-colors [&_svg]:size-4";

/** Unseated guests by household, so a whole family is placed in one go. */
const byHousehold = (guests: readonly SeatedGuest[]) =>
    [...new Set(guests.map((guest) => guest.householdId))].map((householdId) => {
        const members = guests.filter((guest) => guest.householdId === householdId);
        return { householdId, name: members[0].householdName, members };
    });

const TableEditor = ({
    table,
    tables,
    onSave,
}: {
    table: SeatTable;
    tables: readonly SeatTable[];
    onSave: (table: SeatTable) => void;
}) => {
    const [draft, setDraft] = useState(table);
    const [issues, setIssues] = useState<readonly DraftIssue[]>([]);
    const dirty =
        draft.name !== table.name ||
        draft.number !== table.number ||
        draft.capacity !== table.capacity;
    const issueAt = (path: string) => issues.find((issue) => issue.path === path);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = validateTable(draft, tables);
        if (!result.ok) return setIssues(result.error);
        setIssues([]);
        onSave(result.value);
    };

    return (
        <form
            noValidate
            onSubmit={submit}
            aria-label="Table"
            className="grid grid-cols-[5rem_1fr_5rem] gap-2.5"
        >
            {(["number", "name", "capacity"] as const).map((path) => {
                const issue = issueAt(path);
                const labels = { number: "N°", name: "Nom", capacity: "Places" };
                return (
                    <label key={path} className="grid content-start gap-1 text-sm">
                        <span className="text-wed-muted">{labels[path]}</span>
                        <input
                            type={path === "name" ? "text" : "number"}
                            inputMode={path === "name" ? undefined : "numeric"}
                            min={path === "name" ? undefined : 1}
                            value={draft[path]}
                            onChange={(event) =>
                                setDraft({
                                    ...draft,
                                    [path]:
                                        path === "name"
                                            ? event.target.value
                                            : Number(event.target.value),
                                })
                            }
                            aria-invalid={Boolean(issue)}
                            aria-describedby={issue ? `table-${path}-erreur` : undefined}
                            className={inputStyles}
                        />
                        <FieldError
                            id={`table-${path}-erreur`}
                            message={issue && issueMessages[issue.code]}
                        />
                    </label>
                );
            })}
            {dirty && (
                <button
                    type="submit"
                    className={cn(buttonStyles.primary, "col-span-3 justify-self-start")}
                >
                    Enregistrer la table
                </button>
            )}
        </form>
    );
};

const sizes: readonly { value: RoomSize; label: string; fits: number }[] = [
    { value: "s", label: "Petite · ~10 tables", fits: 10 },
    { value: "m", label: "Moyenne · ~20 tables", fits: 22 },
    { value: "l", label: "Grande · ~40 tables", fits: 42 },
    { value: "xl", label: "Très grande · ~60 tables", fits: 64 },
];

/** The room's name, written at the entrance, and its size. */
const RoomSettings = ({
    room,
    tableCount,
    onSave,
}: {
    room: RoomLayout;
    tableCount: number;
    onSave: (name: string, size: RoomSize) => void;
}) => {
    const [name, setName] = useState(room.name);
    const fits = sizes.find((size) => size.value === room.size)?.fits ?? 10;
    const bigger = sizes.find((size) => size.fits >= tableCount && size.fits > fits);
    const saveName = () => {
        const trimmed = name.trim().slice(0, 40);
        if (trimmed && trimmed !== room.name) onSave(trimmed, room.size);
        else setName(room.name);
    };
    return (
        <fieldset className="border-wed-line-soft grid gap-4 rounded-2xl border px-4 pt-2 pb-4 sm:grid-cols-2">
            <legend className="text-wed-ink-soft px-1 text-sm">La salle</legend>
            <label className="grid content-start gap-1 text-sm">
                <span className="text-wed-muted">Nom, écrit à l&apos;entrée</span>
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onBlur={saveName}
                    onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
                    placeholder="L'orangerie, La grange…"
                    className={inputStyles}
                />
            </label>
            <label className="grid content-start gap-1 text-sm">
                <span className="text-wed-muted">Taille</span>
                <Select
                    value={room.size}
                    onChange={(event) => onSave(room.name, event.target.value as RoomSize)}
                >
                    {sizes.map((size) => (
                        <option key={size.value} value={size.value}>
                            {size.label}
                        </option>
                    ))}
                </Select>
            </label>
            {tableCount > fits && bigger && (
                <p className="text-wed-wait text-xs sm:col-span-2">
                    {tableCount} tables : la salle « {bigger.label.split(" · ")[0].toLowerCase()} »
                    leur laissera de la place.
                </p>
            )}
        </fieldset>
    );
};

/** The dinner's room plan: tables to place, guests confirmed at dinner to seat. */
export const SeatingSection = ({
    households,
    tables,
    seats,
    room,
    onSaveRoom,
    onMoveFixture,
    onRotateFixture,
    onSaveTable,
    onMoveTable,
    onRemoveTables,
    onSeatGuest,
    onSeatHousehold,
}: SeatingSectionProps) => {
    const [picked, setPicked] = useState<readonly string[]>([]);
    const plan = seatingPlan(households, tables, seats);
    /** Tables removed meanwhile, in the guest site's tab for instance, drop out. */
    const selection = picked.filter(
        (item) => isFixture(item) || tables.some((table) => table.id === item),
    );
    const selectedTables = plan.tables.filter((entry) => selection.includes(entry.table.id));
    const selected = selectedTables.length === 1 ? selectedTables[0] : null;
    const fixture = selection.find(isFixture) ?? null;
    const removal = tablesRemoval(
        plan.tables,
        selectedTables.map((entry) => entry.table.id),
    );
    const removeSelected = () => {
        onRemoveTables(selectedTables.map((entry) => entry.table.id));
        setPicked([]);
    };
    const allIds = tables.map((table) => table.id);
    const removeAll = () => {
        onRemoveTables(allIds);
        setPicked([]);
    };
    const waiting = byHousehold(plan.unseated);
    const counts = Object.fromEntries(
        plan.tables.map((entry) => [entry.table.id, entry.guests.length]),
    );
    const seatedCount = plan.tables.reduce((sum, entry) => sum + entry.guests.length, 0);

    const addTable = () => {
        const number = nextTableNumber(tables);
        const table: SeatTable = {
            id: `t${Date.now().toString(36)}`,
            number,
            name: `Table ${number}`,
            capacity: 8,
            ...freeSpot(tables, room),
        };
        onSaveTable(table);
        setPicked([table.id]);
    };

    const place = (value: string, tableId: string) => {
        const [kind, id] = value.split(":");
        if (kind === "foyer") onSeatHousehold(id, tableId);
        if (kind === "invite") onSeatGuest(id, tableId);
    };

    return (
        <Card
            id="plan-de-table"
            title="Plan de table · dîner"
            titleId="plan-de-table-titre"
            plan="plan-de-table"
            aside={
                <span className="text-wed-muted text-[0.8rem]">
                    {seatedCount} placés ·{" "}
                    {plural(plan.unseated.length, "sans table", "sans table")}
                </span>
            }
        >
            {plan.alerts.length > 0 && (
                <ul
                    aria-label="Points à vérifier"
                    className="border-wed-line-soft grid gap-1.5 border-b px-5 py-3.5 text-sm"
                >
                    {plan.alerts.map((alert) => (
                        <li key={alert.text} className="text-wed-ink-soft flex items-start gap-2">
                            <AlertTriangle
                                aria-hidden="true"
                                className={cn(
                                    "mt-0.5 size-4 shrink-0",
                                    alert.kind === "over" || alert.kind === "child-alone"
                                        ? "text-wed-no"
                                        : "text-wed-wait",
                                )}
                            />
                            {alert.text}
                        </li>
                    ))}
                </ul>
            )}

            <div className="grid gap-8 p-5 md:p-6 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
                <div className="grid content-start gap-6">
                    <div
                        className="border-wed-line-soft overflow-hidden rounded-2xl border"
                        onKeyDown={(event) => event.key === "Escape" && setPicked([])}
                    >
                        <RoomPlan
                            tables={tables}
                            room={room}
                            onMoveFixture={onMoveFixture}
                            onRotateFixture={onRotateFixture}
                            selectedAction={
                                fixture ? (
                                    <button
                                        type="button"
                                        onClick={() => onRotateFixture(fixture)}
                                        aria-label={
                                            fixture === "head"
                                                ? "Pivoter la table des mariés"
                                                : "Pivoter l'entrée"
                                        }
                                        className={cn(
                                            floatingButton,
                                            "text-wed-ink hover:bg-wed-ink hover:text-wed-paper",
                                        )}
                                    >
                                        <RotateCw aria-hidden="true" />
                                    </button>
                                ) : (
                                    selected && (
                                        <ConfirmPopover
                                            question={removal.question}
                                            detail={removal.detail}
                                            confirmLabel="Retirer"
                                            onConfirm={removeSelected}
                                        >
                                            <button
                                                type="button"
                                                aria-label={`Retirer la table ${selected.table.number}`}
                                                className={cn(
                                                    floatingButton,
                                                    "text-wed-no hover:bg-wed-no hover:text-white",
                                                )}
                                            >
                                                <Trash2 aria-hidden="true" />
                                            </button>
                                        </ConfirmPopover>
                                    )
                                )
                            }
                            seated={counts}
                            selectedIds={selection}
                            label="Plan de la salle : glissez une table pour la déplacer, touchez-la pour la composer"
                            onSelect={(item, additive) =>
                                setPicked(pick(selection, item, additive))
                            }
                            onMove={onMoveTable}
                        />
                    </div>
                    <div className="grid gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={addTable}
                                className={buttonStyles.secondary}
                            >
                                <Plus aria-hidden="true" />
                                Ajouter une table
                            </button>
                            {tables.length > 1 && (
                                <ConfirmPopover
                                    {...tablesRemoval(plan.tables, allIds)}
                                    confirmLabel="Tout retirer"
                                    onConfirm={removeAll}
                                >
                                    <button
                                        type="button"
                                        className={cn(
                                            buttonStyles.quiet,
                                            "text-wed-no hover:bg-wed-no-bg hover:text-wed-no",
                                        )}
                                    >
                                        <Trash2 aria-hidden="true" />
                                        Retirer toutes les tables
                                    </button>
                                </ConfirmPopover>
                            )}
                        </div>
                        <p className="text-wed-muted max-w-[62ch] text-xs leading-relaxed">
                            Glissez les tables, la table des mariés et l&apos;entrée ; touchez-les
                            pour les composer ou les pivoter. Ctrl ou ⌘ + clic sélectionne plusieurs
                            tables. Les invités découvrent leur table le jour J.
                        </p>
                    </div>
                    <RoomSettings
                        key={room.name}
                        room={room}
                        tableCount={tables.length}
                        onSave={onSaveRoom}
                    />
                </div>

                {selectedTables.length > 1 ? (
                    <section
                        aria-label={`${selectedTables.length} tables sélectionnées`}
                        className="grid content-start gap-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="font-wed-serif text-2xl leading-tight font-medium lining-nums">
                                {selectedTables.length} tables sélectionnées
                                <span className="font-main text-wed-muted block text-sm font-normal">
                                    Ctrl ou ⌘ + clic pour en ajouter ou en retirer une.
                                </span>
                            </p>
                            <button
                                type="button"
                                onClick={() => setPicked([])}
                                aria-label="Tout désélectionner"
                                className={iconButton}
                            >
                                <X aria-hidden="true" />
                            </button>
                        </div>
                        <ul className="divide-wed-line-soft border-wed-line-soft divide-y rounded-2xl border text-sm">
                            {selectedTables.map((entry) => (
                                <li
                                    key={entry.table.id}
                                    className="flex items-center justify-between gap-2 px-4 py-2.5"
                                >
                                    <span>
                                        Table {entry.table.number} · {entry.table.name}
                                    </span>
                                    <span className="text-wed-muted text-xs lining-nums">
                                        {entry.guests.length}/{entry.table.capacity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <ConfirmPopover
                            question={removal.question}
                            detail={removal.detail}
                            confirmLabel="Retirer"
                            onConfirm={removeSelected}
                        >
                            <button
                                type="button"
                                className={cn(
                                    buttonStyles.secondary,
                                    "text-wed-no hover:border-wed-no justify-self-start",
                                )}
                            >
                                <Trash2 aria-hidden="true" />
                                Retirer les {selectedTables.length} tables
                            </button>
                        </ConfirmPopover>
                    </section>
                ) : selected ? (
                    <section
                        aria-label={`Table ${selected.table.number}`}
                        className="grid content-start gap-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="font-wed-serif text-2xl leading-tight font-medium lining-nums">
                                Table {selected.table.number} · {selected.table.name}
                                <span className="font-main text-wed-muted block text-sm font-normal">
                                    {selected.guests.length} / {selected.table.capacity} places
                                </span>
                            </p>
                            <button
                                type="button"
                                onClick={() => setPicked([])}
                                aria-label="Fermer la table"
                                className={iconButton}
                            >
                                <X aria-hidden="true" />
                            </button>
                        </div>
                        <TableEditor
                            key={`${selected.table.id}-${selected.table.number}-${selected.table.name}-${selected.table.capacity}`}
                            table={selected.table}
                            tables={tables}
                            onSave={onSaveTable}
                        />
                        <ul className="divide-wed-line-soft border-wed-line-soft divide-y rounded-2xl border text-sm">
                            {selected.guests.map((guest) => (
                                <li
                                    key={guest.guestId}
                                    className="flex items-center justify-between gap-2 py-1 pr-1 pl-4"
                                >
                                    <span>
                                        {guest.firstName}
                                        {guest.child && (
                                            <span className="text-wed-muted"> · enfant</span>
                                        )}
                                        <span className="text-wed-muted block text-xs">
                                            {guest.householdName}
                                            {!guest.confirmed && " · pas confirmé au dîner"}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onSeatGuest(guest.guestId, null)}
                                        aria-label={`Retirer ${guest.firstName} de la table`}
                                        className={iconButton}
                                    >
                                        <X aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                            {selected.guests.length === 0 && (
                                <li className="text-wed-muted px-4 py-3">
                                    Personne pour l&apos;instant.
                                </li>
                            )}
                        </ul>
                        {waiting.length > 0 && (
                            <label className="grid gap-1.5 text-sm">
                                <span className="text-wed-ink-soft">Ajouter à cette table</span>
                                <Select
                                    value=""
                                    onChange={(event) =>
                                        place(event.target.value, selected.table.id)
                                    }
                                >
                                    <option value="" disabled>
                                        Choisir un invité sans table…
                                    </option>
                                    {waiting.map((household) => (
                                        <optgroup
                                            key={household.householdId}
                                            label={household.name}
                                        >
                                            {household.members.length > 1 && (
                                                <option value={`foyer:${household.householdId}`}>
                                                    Tout le foyer ({household.members.length})
                                                </option>
                                            )}
                                            {household.members.map((guest) => (
                                                <option
                                                    key={guest.guestId}
                                                    value={`invite:${guest.guestId}`}
                                                >
                                                    {guest.firstName}
                                                    {guest.child ? " (enfant)" : ""}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </Select>
                            </label>
                        )}
                    </section>
                ) : (
                    <section aria-label="Invités sans table" className="grid content-start gap-3">
                        <p className="font-wed-serif text-2xl leading-tight font-medium lining-nums">
                            Sans table
                            <span className="font-main text-wed-muted block text-sm font-normal">
                                {plan.unseated.length === 0
                                    ? "Tous les invités du dîner ont une place."
                                    : "Confirmés au dîner, pas encore placés."}
                            </span>
                        </p>
                        <ul className="grid gap-2.5">
                            {waiting.map((household) => (
                                <li
                                    key={household.householdId}
                                    className="border-wed-line-soft grid gap-2 rounded-2xl border px-4 py-3 text-sm"
                                >
                                    <p>
                                        <span className="font-medium">{household.name}</span>
                                        <span className="text-wed-muted block text-xs">
                                            {household.members
                                                .map(
                                                    (guest) =>
                                                        guest.firstName +
                                                        (guest.child ? " (enfant)" : ""),
                                                )
                                                .join(", ")}
                                        </span>
                                    </p>
                                    <label className="grid gap-1">
                                        <span className="sr-only">
                                            Placer {household.name} à une table
                                        </span>
                                        <Select
                                            value=""
                                            onChange={(event) =>
                                                onSeatHousehold(
                                                    household.householdId,
                                                    event.target.value,
                                                )
                                            }
                                        >
                                            <option value="" disabled>
                                                Placer le foyer à…
                                            </option>
                                            {plan.tables.map((entry) => (
                                                <option key={entry.table.id} value={entry.table.id}>
                                                    Table {entry.table.number} · {entry.table.name}{" "}
                                                    ({entry.guests.length}/{entry.table.capacity})
                                                </option>
                                            ))}
                                        </Select>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </Card>
    );
};
