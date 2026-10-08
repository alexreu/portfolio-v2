import { ImageResponse } from "next/og";
import { defaultDesign } from "@/content/wedding-dashboard-demo";

import { weddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { sealInitials } from "@/lib/wedding-dashboard/drafts";

/** Built once at deploy time, like the offer's. */
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

/** The demo's own colours: paper, ink and the olive seal, as on the guest site. */
const PAPER = "#EFEAE0";
const CARD = "#F7F4EE";
const INK = "#1F1D1A";
const MUTED = "#6A6257";
const OLIVE = "#5E6B4E";

/**
 * At a fixed address, `/mariage/demo/partage`, so that the page's metadata can name it: a
 * generated `opengraph-image` gets a hashed one, which the shared metadata would override.
 *
 * What WhatsApp or iMessage shows when the couple sends a link: the faire-part, not the
 * studio's card. The seal, their names and the day, as the guest is about to open it.
 */
export function GET() {
    const { first, second, date, place } = defaultDesign;
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: PAPER,
            }}
        >
            <div
                style={{
                    width: 980,
                    height: 470,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 22,
                    background: CARD,
                    border: `2px solid ${OLIVE}`,
                    borderRadius: 8,
                }}
            >
                <div style={{ display: "flex", fontSize: 26, color: MUTED, letterSpacing: 6 }}>
                    VOUS ÊTES INVITÉS
                </div>
                <div style={{ display: "flex", fontSize: 92, color: INK, gap: 28 }}>
                    <span>{first}</span>
                    <span style={{ color: OLIVE }}>&</span>
                    <span>{second}</span>
                </div>
                <div style={{ display: "flex", fontSize: 30, color: INK }}>
                    {weddingCalendar(date).dateLabel} · {place}
                </div>
                <div
                    style={{
                        marginTop: 10,
                        width: 96,
                        height: 96,
                        borderRadius: 48,
                        background: OLIVE,
                        color: CARD,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 30,
                    }}
                >
                    {sealInitials(first, second)}
                </div>
            </div>
        </div>,
        size,
    );
}
