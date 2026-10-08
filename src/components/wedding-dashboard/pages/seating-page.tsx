"use client";

import { seatedMomentKey } from "@alexreu/wedding-core";

import { useDashboard } from "../dashboard-context";
import { dashboardHref } from "../dashboard-pages";
import { PageHeader, ReadOnly } from "../dashboard-ui";
import { QrPosterCard } from "../qr-poster-card";
import { SeatingSection } from "../seating-section";

export const SeatingPage = () => {
    const { state, calendar, dispatch, seatingUrl, downloadSeatingPoster, can } = useDashboard();
    const locked = !can("seating.write");
    return (
        <>
            <PageHeader page="seating" />
            <ReadOnly locked={locked}>
                <SeatingSection
                    readOnly={locked}
                    households={state.households}
                    tables={state.tables}
                    seats={state.seats}
                    room={state.room}
                    seatedKey={seatedMomentKey(state.moments)}
                    revealLabel={calendar.tablesRevealLabel}
                    datesHref={`${dashboardHref("programme")}#dates`}
                    onSaveRoom={(name, size) => dispatch({ type: "room.save", name, size })}
                    onMoveFixture={(fixture, x, y) =>
                        dispatch({ type: "fixture.move", fixture, x, y })
                    }
                    onRotateFixture={(fixture) => dispatch({ type: "fixture.rotate", fixture })}
                    onSaveTable={(table) => dispatch({ type: "table.save", table })}
                    onMoveTable={(tableId, x, y) => dispatch({ type: "table.move", tableId, x, y })}
                    onRemoveTables={(tableIds) => dispatch({ type: "tables.remove", tableIds })}
                    onSeatGuest={(guestId, tableId) =>
                        dispatch({ type: "guest.seat", guestId, tableId })
                    }
                    onSeatHousehold={(householdId, tableId) =>
                        dispatch({ type: "household.seat", householdId, tableId })
                    }
                />
            </ReadOnly>
            {can("seating.read") && (
                <QrPosterCard
                    id="qr-plan-de-table"
                    title="QR code du plan de table"
                    url={seatingUrl}
                    qrLabel="QR code du plan de table : ouvre le plan de la salle"
                    plan="seating"
                    aside="À l'entrée du dîner"
                    downloadLabel="Affiche du plan de table"
                    openLabel="Ouvrir le plan des invités"
                    note="PDF A4, à poser à l'entrée de la salle."
                    onDownload={downloadSeatingPoster}
                >
                    Il ouvre le plan de la salle, et rien d&apos;autre : ni faire-part ni réponse.
                    Chacun tape son prénom ou son nom et voit sa table s&apos;allumer, avec qui est
                    à quelle table.
                </QrPosterCard>
            )}
        </>
    );
};
