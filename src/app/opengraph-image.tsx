import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AlexDevLab - Developpeur Front-End Freelance a la Reunion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "linear-gradient(135deg, #0A090D 0%, #1a1a2e 50%, #0A090D 100%)",
                    fontFamily: "system-ui, sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Background glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "-200px",
                        right: "-100px",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255,77,77,0.15) 0%, transparent 70%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-200px",
                        left: "-100px",
                        width: "500px",
                        height: "500px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
                    }}
                />

                {/* Logo mark */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "32px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "48px",
                            fontWeight: 800,
                            color: "#F5F5F5",
                            letterSpacing: "-1px",
                        }}
                    >
                        AleX
                        <span style={{ color: "#FF4D4D" }}>Dev</span>
                        Lab
                    </div>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: "56px",
                        fontWeight: 700,
                        color: "#F5F5F5",
                        textAlign: "center",
                        lineHeight: 1.2,
                        maxWidth: "900px",
                        marginBottom: "24px",
                    }}
                >
                    Developpeur{" "}
                    <span style={{ color: "#FF4D4D" }}>Front-End</span>
                    {" "}Freelance
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: "24px",
                        color: "#9ca3af",
                        textAlign: "center",
                        maxWidth: "700px",
                        lineHeight: 1.5,
                    }}
                >
                    Sites web performants & applications React/Next.js
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "40px",
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        color: "#6b7280",
                        fontSize: "18px",
                    }}
                >
                    <span>alexdevlab.com</span>
                    <span style={{ color: "#FF4D4D" }}>|</span>
                    <span>Ile de la Reunion</span>
                    <span style={{ color: "#FF4D4D" }}>|</span>
                    <span>Devis gratuit</span>
                </div>
            </div>
        ),
        { ...size },
    );
}
