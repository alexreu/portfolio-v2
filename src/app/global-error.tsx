"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.error("Global error:", error.message);
        }
    }, [error]);

    return (
        <html lang="fr">
            <body
                style={{
                    margin: 0,
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0A090D",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    color: "#F5F5F5",
                    padding: "16px",
                }}
            >
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                            @keyframes fadeInUp {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            @keyframes scaleIn {
                                from { opacity: 0; transform: scale(0.8) rotate(-180deg); }
                                to { opacity: 1; transform: scale(1) rotate(0deg); }
                            }
                            @keyframes glow {
                                0%, 100% { box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,77,77,0.05); }
                                50% { box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(255,77,77,0.1); }
                            }
                            .ge-card {
                                max-width: 640px;
                                width: 100%;
                                border: 1px solid rgba(255,255,255,0.08);
                                border-radius: 24px;
                                background: #0A090D;
                                padding: 48px 32px;
                                text-align: center;
                                animation: fadeInUp 0.6s ease-out, glow 4s ease-in-out infinite;
                            }
                            .ge-icon {
                                display: inline-flex;
                                position: relative;
                                animation: scaleIn 0.6s ease-out 0.2s both;
                            }
                            .ge-icon-glow {
                                position: absolute;
                                inset: 0;
                                border-radius: 50%;
                                background: #FF4D4D;
                                opacity: 0.2;
                                filter: blur(24px);
                            }
                            .ge-code {
                                font-size: clamp(48px, 10vw, 72px);
                                font-weight: 700;
                                background: linear-gradient(to right, #FF4D4D, #0A090D);
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                                background-clip: text;
                                margin: 24px 0 16px;
                                animation: fadeInUp 0.6s ease-out 0.3s both;
                            }
                            .ge-title {
                                font-size: clamp(20px, 4vw, 32px);
                                font-weight: 600;
                                margin: 0 0 16px;
                                animation: fadeInUp 0.5s ease-out 0.4s both;
                            }
                            .ge-desc {
                                color: #9ca3af;
                                font-size: clamp(14px, 2.5vw, 18px);
                                line-height: 1.6;
                                max-width: 420px;
                                margin: 0 auto 32px;
                                animation: fadeInUp 0.5s ease-out 0.5s both;
                            }
                            .ge-btn {
                                display: inline-flex;
                                align-items: center;
                                gap: 8px;
                                background: linear-gradient(to right, #FF4D4D, #ff6b6b);
                                color: white;
                                border: none;
                                border-radius: 12px;
                                padding: 14px 32px;
                                font-size: 16px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: opacity 0.2s, transform 0.2s;
                                animation: fadeInUp 0.5s ease-out 0.6s both;
                            }
                            .ge-btn:hover { opacity: 0.9; transform: translateY(-2px); }
                            .ge-btn:active { transform: translateY(0); }
                            .ge-digest {
                                margin-top: 24px;
                                font-size: 12px;
                                color: #4b5563;
                                animation: fadeInUp 0.5s ease-out 0.7s both;
                            }
                        `,
                    }}
                />
                <div className="ge-card">
                    {/* Icon */}
                    <div className="ge-icon">
                        <div className="ge-icon-glow" />
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FF4D4D"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ position: "relative" }}
                        >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                        </svg>
                    </div>

                    {/* Error code */}
                    <div className="ge-code">Erreur</div>

                    {/* Title */}
                    <h1 className="ge-title">Erreur critique</h1>

                    {/* Description */}
                    <p className="ge-desc">
                        Une erreur inattendue s&apos;est produite. Veuillez rafraichir la page pour
                        continuer.
                    </p>

                    {/* Reset button */}
                    <button className="ge-btn" onClick={reset}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                        </svg>
                        Rafraichir la page
                    </button>

                    {/* Error digest */}
                    {process.env.NODE_ENV === "development" && error.digest && (
                        <p className="ge-digest">Error ID: {error.digest}</p>
                    )}
                </div>
            </body>
        </html>
    );
}
