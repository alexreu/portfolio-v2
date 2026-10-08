"use client";

import { AccessSection } from "../access-section";
import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";

export const AccessPage = () => {
    const { state, dispatch, now } = useDashboard();
    return (
        <>
            <PageHeader page="access" />
            <AccessSection
                collaborators={state.collaborators}
                couple={{ first: state.design.first, second: state.design.second }}
                now={now}
                timezone={state.timezone}
                onInvite={(draft) => {
                    const result = dispatch({ type: "collaborator.invite", draft });
                    if (!result.ok) return null;
                    return (
                        result.value.collaborators.find(
                            (collaborator) => collaborator.email === draft.email,
                        ) ?? null
                    );
                }}
                onUpdate={(collaborator, { title, role, added, removed }) =>
                    dispatch({
                        type: "collaborator.update",
                        collaboratorId: collaborator.id,
                        title,
                        role,
                        added,
                        removed,
                    })
                }
                onReinvite={(collaborator) =>
                    dispatch({ type: "collaborator.reinvite", collaboratorId: collaborator.id })
                }
                onRemove={(collaborator) =>
                    dispatch({ type: "collaborator.remove", collaboratorId: collaborator.id })
                }
            />
        </>
    );
};
