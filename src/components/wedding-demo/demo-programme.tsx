import { formatHour, type Programme, type SiteMode } from "@alexreu/wedding-core";
import { CalendarPlus } from "lucide-react";

import { cn } from "@/lib/utils";

import { DemoHeading } from "./demo-heading";

type DemoProgrammeProps = {
    /** Where the wedding takes place: every hour is read there. */
    timezone: string;
    programme: Programme;
    mode: SiteMode;
    /** Downloads the household's moments as a calendar file; before the wedding only. */
    onAddToCalendar?: () => void;
};

const dayOf = (iso: string, timezone: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: timezone,
    });

/** Only the moments this household is invited to; on the day, past slots fade and the current one is flagged. */
export const DemoProgramme = ({
    programme,
    mode,
    timezone,
    onAddToCalendar,
}: DemoProgrammeProps) => {
    const days = [
        ...new Set(programme.moments.map((moment) => dayOf(moment.slots[0].startsAt, timezone))),
    ];

    return (
        <section
            id="programme"
            aria-labelledby="programme-titre"
            className="bg-demo-ink text-demo-paper scroll-mt-16 py-20 md:py-30"
        >
            <div className="mx-auto max-w-310 px-4 md:px-7">
                <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
                    <DemoHeading
                        id="programme-titre"
                        number="02"
                        label="Programme"
                        heading={{ text: "Le déroulé", emphasis: "déroulé" }}
                        tone="dark"
                    />
                    <div className="flex flex-wrap items-center gap-2.5">
                        <p className="border-demo-ink-2 text-demo-sand inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm">
                            <span
                                aria-hidden="true"
                                className="bg-demo-earth size-1.5 rounded-full"
                            />
                            {programme.moments.length > 1
                                ? `${programme.moments.length} moments vous attendent`
                                : "1 moment vous attend"}
                        </p>
                        {onAddToCalendar && programme.moments.length > 0 && (
                            <button
                                type="button"
                                onClick={onAddToCalendar}
                                className="border-demo-ink-2 text-demo-paper hover:border-demo-paper inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm transition-colors"
                            >
                                <CalendarPlus aria-hidden="true" className="size-4" />
                                Ajouter à mon agenda
                            </button>
                        )}
                    </div>
                </div>
                {days.map((day) => (
                    <div key={day} className="mt-8 first:mt-0">
                        <h3 className="font-demo-serif text-demo-earth text-2xl capitalize italic">
                            {day}
                        </h3>
                        {programme.moments
                            .filter((moment) => dayOf(moment.slots[0].startsAt, timezone) === day)
                            .map((moment) => (
                                <div
                                    key={moment.key}
                                    className="border-demo-night-line grid gap-4 border-t py-7 md:grid-cols-[minmax(220px,1fr)_2fr] md:gap-7"
                                >
                                    <h4 className="font-demo-serif text-3xl leading-tight font-normal">
                                        {moment.title}
                                    </h4>
                                    <div>
                                        <ul className="grid gap-5">
                                            {moment.slots.map((slot) => (
                                                <li
                                                    key={slot.startsAt}
                                                    className={cn(
                                                        "grid grid-cols-[92px_1fr] items-baseline gap-3.5 md:grid-cols-[140px_1fr] md:gap-5",
                                                        mode === "day" &&
                                                            slot.status === "past" &&
                                                            "opacity-45",
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "font-demo-serif text-2xl leading-none whitespace-nowrap md:text-[2.1rem]",
                                                            mode === "day" &&
                                                                slot.status === "now" &&
                                                                "text-demo-sand",
                                                        )}
                                                    >
                                                        {formatHour(slot.startsAt, timezone)}
                                                    </span>
                                                    <span className="text-lg">
                                                        {slot.title}
                                                        {mode === "day" &&
                                                            slot.status === "now" && (
                                                                <span className="bg-demo-olive ml-1.5 inline-block rounded-full px-2.5 align-middle text-[0.8rem] text-white">
                                                                    En ce moment
                                                                </span>
                                                            )}
                                                        <span className="text-demo-night-muted mt-0.5 block text-[0.95rem]">
                                                            {slot.place}
                                                        </span>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <a
                                            href="#lieux"
                                            className="text-demo-sand mt-2 inline-flex min-h-11 items-center underline underline-offset-4"
                                        >
                                            Itinéraire
                                        </a>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </section>
    );
};
