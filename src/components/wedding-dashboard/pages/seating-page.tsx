"use client";

import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";
import { SeatingSection } from "../seating-section";

export const SeatingPage = () => {
    const { state, dispatch } = useDashboard();
    return (
        <>
            <PageHeader page="plan-de-table" />
            <SeatingSection
                households={state.households}
                tables={state.tables}
                seats={state.seats}
                room={state.room}
                onSaveRoom={(name, size) => dispatch({ type: "room-saved", name, size })}
                onMoveFixture={(fixture, x, y) =>
                    dispatch({ type: "fixture-moved", fixture, x, y })
                }
                onRotateFixture={(fixture) => dispatch({ type: "fixture-rotated", fixture })}
                onSaveTable={(table) => dispatch({ type: "table-saved", table })}
                onMoveTable={(tableId, x, y) => dispatch({ type: "table-moved", tableId, x, y })}
                onRemoveTables={(tableIds) => dispatch({ type: "tables-removed", tableIds })}
                onSeatGuest={(guestId, tableId) =>
                    dispatch({ type: "guest-seated", guestId, tableId })
                }
                onSeatHousehold={(householdId, tableId) =>
                    dispatch({ type: "household-seated", householdId, tableId })
                }
            />
        </>
    );
};
