"use client";

import { useDashboard } from "../dashboard-context";
import { PageHeader, ReadOnly } from "../dashboard-ui";
import { DatesSection } from "../dates-section";
import { ProgrammeSection } from "../programme-section";

export const ProgrammePage = () => {
    const { state, dispatch, now, can } = useDashboard();
    return (
        <>
            <PageHeader page="programme" />
            {can("dates.read") && (
                <ReadOnly locked={!can("dates.write")}>
                    <DatesSection
                        day={state.design.date}
                        dates={state.dates}
                        now={now}
                        timezone={state.timezone}
                        onSave={(day, dates) => dispatch({ type: "dates.save", day, dates })}
                    />
                </ReadOnly>
            )}
            {can("programme.read") && (
                <ReadOnly locked={!can("programme.write")}>
                    <ProgrammeSection
                        moments={state.moments}
                        households={state.households}
                        weddingDay={state.design.date}
                        timezone={state.timezone}
                        onSave={(moment, inviteAll) =>
                            dispatch({ type: "moment.save", moment, inviteAll })
                        }
                        onRemove={(moment) => dispatch({ type: "moment.remove", key: moment.key })}
                    />
                </ReadOnly>
            )}
        </>
    );
};
