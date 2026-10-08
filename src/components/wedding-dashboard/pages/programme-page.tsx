"use client";

import { useDashboard } from "../dashboard-context";
import { PageHeader, ReadOnly } from "../dashboard-ui";
import { DatesSection } from "../dates-section";
import { ProgrammeSection } from "../programme-section";

export const ProgrammePage = () => {
    const { state, dispatch, now, at, can, canRead } = useDashboard();
    return (
        <>
            <PageHeader page="programme" />
            {canRead("dates") && (
                <ReadOnly locked={!can("dates.edit")}>
                    <DatesSection
                        day={state.design.date}
                        dates={state.dates}
                        now={now}
                        onSave={(day, dates) =>
                            dispatch({ type: "dates-saved", day, dates, at: at() })
                        }
                    />
                </ReadOnly>
            )}
            {canRead("programme") && (
                <ReadOnly locked={!can("programme.edit")}>
                    <ProgrammeSection
                        moments={state.moments}
                        households={state.households}
                        weddingDay={state.design.date}
                        onSave={(moment, inviteAll) =>
                            dispatch({ type: "moment-saved", moment, inviteAll, at: at() })
                        }
                        onRemove={(moment) =>
                            dispatch({ type: "moment-removed", key: moment.key, at: at() })
                        }
                    />
                </ReadOnly>
            )}
        </>
    );
};
