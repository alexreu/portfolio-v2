"use client";

import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";
import { QrPosterCard } from "../qr-poster-card";
import { SeatingSection } from "../seating-section";

export const SeatingPage = () => {
    const { state, dispatch, seatingUrl, downloadSeatingPoster } = useDashboard();
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
            <QrPosterCard
                id="qr-plan-de-table"
                title="QR code du plan de table"
                url={seatingUrl}
                qrLabel="QR code du plan de table : ouvre le plan de la salle"
                plan="plan-de-table"
                aside="À l'entrée du dîner"
                downloadLabel="Affiche du plan de table"
                openLabel="Ouvrir le plan des invités"
                note="PDF A4, à poser à l'entrée de la salle."
                onDownload={downloadSeatingPoster}
            >
                Il ouvre le plan de la salle, et rien d&apos;autre : ni faire-part ni réponse.
                Chacun tape son prénom ou son nom et voit sa table s&apos;allumer, avec qui est à
                quelle table.
            </QrPosterCard>
        </>
    );
};
