import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { weddingPhotos } from "@/content/wedding-photos";
import sharp from "sharp";

/** Built once at deploy time: the offer's share image does not change between visits. */
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

/** The offer page's own colours, as on /mariage. */
const IVORY = "#F4F0E8";
const PAPER = "#FBF8F2";
const INK = "#1E1B17";
const MUTED = "#6B6359";
const GOLD = "#7A5F37";
const GOLD_SOFT = "#C9AE82";

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

/**
 * What a couple sees when the offer's link is shared on WhatsApp, Instagram or LinkedIn: the
 * promise in the page's serif, a wedding photo, the price to start, and who makes it. At a
 * fixed address, `/mariage/partage`, so that the page's metadata can name it.
 */
/**
 * A JPEG, not the PNG the renderer gives: with a photo inside, the PNG weighs over 500 kB,
 * past what WhatsApp shows in a preview.
 */
export async function GET() {
    const [serif, serifItalic] = await Promise.all([
        font("cormorant-garamond-latin-500-normal.woff"),
        font("cormorant-garamond-latin-500-italic.woff"),
    ]);
    const png = new ImageResponse(
        <div style={{ width: "100%", height: "100%", display: "flex", background: IVORY }}>
            <div
                style={{
                    width: 700,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "64px 0 56px 72px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 20,
                        letterSpacing: 5,
                        color: GOLD,
                    }}
                >
                    SITES DE MARIAGE SUR-MESURE
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        fontFamily: "Cormorant",
                        fontSize: 66,
                        lineHeight: 1.02,
                        color: INK,
                    }}
                >
                    <span>Un site à votre image,</span>
                    <span>de l&apos;annonce au</span>
                    <span style={{ fontStyle: "italic", color: GOLD }}>dernier souvenir.</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div style={{ display: "flex", fontSize: 23, color: MUTED }}>
                        Faire-part animé · Réponses par foyer · Jour J · Photos
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div
                            style={{
                                display: "flex",
                                background: INK,
                                color: PAPER,
                                fontSize: 24,
                                padding: "10px 22px",
                                borderRadius: 4,
                            }}
                        >
                            Dès 290 €
                        </div>
                        <div style={{ display: "flex", fontSize: 24, color: INK }}>
                            AleX
                            <span style={{ color: GOLD }}>Dev</span>
                            Lab
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ flex: 1, display: "flex", position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- drawn into the image */}
                <img
                    src={`${weddingPhotos.courtyard.src}?auto=compress&w=1000`}
                    alt=""
                    width={500}
                    height={630}
                    style={{ width: 500, height: 630, objectFit: "cover" }}
                />
                <div
                    style={{
                        position: "absolute",
                        left: -60,
                        bottom: 56,
                        width: 250,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        padding: "22px 18px",
                        background: PAPER,
                        border: `1px solid ${GOLD_SOFT}`,
                        boxShadow: "0 18px 40px rgba(30, 27, 23, 0.18)",
                    }}
                >
                    <div style={{ display: "flex", fontSize: 14, color: MUTED }}>
                        Faire-part pour Marie & Thomas
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontFamily: "Cormorant",
                            fontSize: 36,
                            color: INK,
                            gap: 10,
                        }}
                    >
                        <span>Camille</span>
                        <span style={{ fontStyle: "italic", color: GOLD }}>&</span>
                        <span>Hugo</span>
                    </div>
                    <div style={{ display: "flex", fontSize: 14, color: INK }}>
                        12 juin 2027 · Luberon
                    </div>
                </div>
            </div>
        </div>,
        {
            ...size,
            fonts: [
                { name: "Cormorant", data: serif, style: "normal", weight: 500 },
                { name: "Cormorant", data: serifItalic, style: "italic", weight: 500 },
            ],
        },
    );
    const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
    return new Response(new Uint8Array(jpeg), {
        headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=86400" },
    });
}
