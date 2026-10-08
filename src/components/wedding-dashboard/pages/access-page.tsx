"use client";

import { AccessSection } from "../access-section";
import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";

export const AccessPage = () => {
    const { state, dispatch, now, at } = useDashboard();
    return (
        <>
            <PageHeader page="acces" />
            <AccessSection
                collaborators={state.collaborators}
                couple={{ first: state.design.first, second: state.design.second }}
                now={now}
                onInvite={(collaborator) =>
                    dispatch({ type: "collaborator-invited", collaborator, at: at() })
                }
                onUpdate={(collaborator, { role, grant }) =>
                    dispatch({
                        type: "collaborator-updated",
                        collaboratorId: collaborator.id,
                        role,
                        grant,
                        at: at(),
                    })
                }
                onReinvite={(collaborator) =>
                    dispatch({
                        type: "collaborator-reinvited",
                        collaboratorId: collaborator.id,
                        at: at(),
                    })
                }
                onRemove={(collaborator) =>
                    dispatch({
                        type: "collaborator-removed",
                        collaboratorId: collaborator.id,
                        at: at(),
                    })
                }
            />
        </>
    );
};
