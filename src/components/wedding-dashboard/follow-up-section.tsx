import { Mail, Send } from "lucide-react";

import { sinceLabel, type WeddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { overview } from "@/lib/wedding-dashboard/stats";
import type { Activity, DemoState, HouseholdRecord } from "@/lib/wedding-dashboard/types";

import { buttonStyles, Card, plural } from "./dashboard-ui";

type FollowUpSectionProps = {
    state: DemoState;
    calendar: WeddingCalendar;
    now: Date;
    /** The household the reminder template is shown for. */
    sampleGuest: string;
    /** Left out for whoever may only follow the reminders, with its button. */
    onRemind?: () => void;
    /** Opens the detail of the household an event is about. */
    onOpenHousehold: (householdId: string) => void;
};

const SHOWN = 7;

const Badge = ({ entry }: { entry: Activity }) => (
    <span
        aria-hidden="true"
        className="bg-wed-line-soft text-wed-ink-soft grid size-9 place-items-center rounded-full text-xs font-semibold"
    >
        {entry.badge || <Mail className="size-4" />}
    </span>
);

type ActivityCardProps = {
    activity: readonly Activity[];
    households: readonly HouseholdRecord[];
    now: Date;
    onOpenHousehold: (householdId: string) => void;
};

/** Everything that happened, latest first; an event about a household opens its detail. */
export const ActivityCard = ({ activity, households, now, onOpenHousehold }: ActivityCardProps) => {
    const isHousehold = (id: string) => households.some((household) => household.id === id);
    return (
        <Card
            title="Activité récente"
            titleId="activite-titre"
            aside={<span className="text-wed-muted text-[0.8rem]">Tout est horodaté</span>}
        >
            <ol aria-live="polite" className="divide-wed-line-soft divide-y px-5 py-1">
                {activity.slice(0, SHOWN).map((entry) => (
                    <li
                        key={entry.id}
                        className="grid grid-cols-[2.25rem_1fr_auto] items-start gap-3 py-3"
                    >
                        <Badge entry={entry} />
                        <p className="text-sm">
                            {isHousehold(entry.subject) ? (
                                <button
                                    type="button"
                                    onClick={() => onOpenHousehold(entry.subject)}
                                    className="cursor-pointer text-left hover:underline hover:underline-offset-4"
                                >
                                    {entry.text}
                                </button>
                            ) : (
                                entry.text
                            )}
                            <span className="text-wed-muted block text-xs">{entry.detail}</span>
                        </p>
                        <time
                            dateTime={entry.at}
                            className="text-wed-muted text-xs whitespace-nowrap"
                        >
                            {sinceLabel(entry.at, now)}
                        </time>
                    </li>
                ))}
            </ol>
        </Card>
    );
};

/** Reminders on one side, everything that happened on the other. */
export const FollowUpSection = ({
    state,
    calendar,
    now,
    sampleGuest,
    onRemind,
    onOpenHousehold,
}: FollowUpSectionProps) => {
    const { pending } = overview(state.households);
    const couple = `${state.design.first} & ${state.design.second}`;

    return (
        <div id="relances" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card
                title="Relances"
                titleId="relances-titre"
                plan="relances"
                aside={
                    <span className="text-wed-muted text-[0.8rem]">
                        Seulement aux foyers sans réponse
                    </span>
                }
            >
                <div className="grid gap-4 px-5 py-4">
                    <p className="text-wed-ink-soft text-sm">
                        Prochaine relance automatique le <strong>{calendar.reminderLabel}</strong>,
                        quinze jours avant la date limite. Aujourd&apos;hui, elle partirait à{" "}
                        {plural(pending, "foyer", "foyers")}.
                    </p>
                    <figure className="border-wed-line-soft bg-wed-ivory rounded-xl border p-4 text-sm">
                        <figcaption className="text-wed-muted mb-2 text-xs">
                            Message envoyé · exemple pour {sampleGuest}
                        </figcaption>
                        <p>Bonjour {sampleGuest},</p>
                        <p className="mt-2">
                            {couple} attendent votre réponse avant le {calendar.answerDeadlineLabel}
                            . Elle ne prend qu&apos;une minute, depuis votre lien personnel.
                        </p>
                        <p className="mt-2">À très vite !</p>
                    </figure>
                    <div className="flex flex-wrap items-center gap-3">
                        {onRemind && (
                            <button
                                type="button"
                                onClick={onRemind}
                                disabled={pending === 0}
                                className={buttonStyles.primary}
                            >
                                <Send aria-hidden="true" />
                                Relancer maintenant
                            </button>
                        )}
                        {state.lastReminder && (
                            <p className="text-wed-muted text-sm">
                                Dernière : {sinceLabel(state.lastReminder.at, now)},{" "}
                                {plural(state.lastReminder.count, "foyer", "foyers")}
                            </p>
                        )}
                    </div>
                </div>
            </Card>

            <ActivityCard
                activity={state.activity}
                households={state.households}
                now={now}
                onOpenHousehold={onOpenHousehold}
            />
        </div>
    );
};
