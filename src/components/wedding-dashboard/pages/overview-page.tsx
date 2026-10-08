"use client";

import Link from "next/link";
import { canSee, pageSummaries } from "@alexreu/wedding-core";
import { useCheckFeatureFlag } from "@alexreu/wedding-core/react";
import { ChevronRight } from "lucide-react";

import { useDashboard } from "../dashboard-context";
import { dashboardEntries, dashboardHref } from "../dashboard-pages";
import { Card, PageBadge } from "../dashboard-ui";
import { ActivityCard } from "../follow-up-section";
import { OverviewSection } from "../overview-section";

/** The dashboard's home: the figures that matter, then a way into every page. */
export const OverviewPage = () => {
    const {
        state,
        moments,
        calendar,
        now,
        createHousehold,
        exportCsv,
        exportCatererPdf,
        remind,
        openHousehold,
        can,
    } = useDashboard();
    const { features } = useCheckFeatureFlag();
    const summaries = pageSummaries(state, calendar, now);

    return (
        <>
            <OverviewSection
                state={state}
                moments={moments}
                calendar={calendar}
                now={now}
                onAddHousehold={can("guests.write") ? createHousehold : undefined}
                onExport={can("guests.export") ? exportCsv : undefined}
                onExportCaterer={
                    can("guests.export") && can("guests.diets.read") ? exportCatererPdf : undefined
                }
                onRemind={can("reminders.send") ? remind : undefined}
                reminders={can("reminders.read")}
                gallery={can("gallery.read")}
            />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                <Card title="Tout le tableau de bord" titleId="pages-title">
                    <ul className="divide-wed-line-soft divide-y px-2 py-1.5">
                        {dashboardEntries.flatMap(({ page, label, icon: Icon }) =>
                            page && canSee(features, page)
                                ? [
                                      <li key={page}>
                                          <Link
                                              href={dashboardHref(page)}
                                              className="hover:bg-wed-ivory group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-3 transition-colors"
                                          >
                                              <span
                                                  aria-hidden="true"
                                                  className="bg-wed-line-soft text-wed-ink-soft grid size-9 place-items-center rounded-full"
                                              >
                                                  <Icon className="size-4" strokeWidth={1.6} />
                                              </span>
                                              <span className="min-w-0 text-sm">
                                                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
                                                      {label}
                                                      <PageBadge page={page} />
                                                  </span>
                                                  <span className="text-wed-muted block text-xs">
                                                      {summaries[page]}
                                                  </span>
                                              </span>
                                              <ChevronRight
                                                  aria-hidden="true"
                                                  className="text-wed-muted size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                              />
                                          </Link>
                                      </li>,
                                  ]
                                : [],
                        )}
                    </ul>
                </Card>
                {can("guests.read") && (
                    <ActivityCard
                        timezone={state.timezone}
                        activity={state.activity}
                        households={state.households}
                        now={now}
                        onOpenHousehold={openHousehold}
                    />
                )}
            </div>
        </>
    );
};
