"use client";

import { useEffect, useMemo, useState } from "react";
import { type ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export const ParticlesContainer = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        const loadParticlesEngine = async () => {
            await initParticlesEngine(async (engine) => {
                await loadSlim(engine).then(() => {
                    setInit(true);
                });
            });
        };

        loadParticlesEngine();
    }, []);

    const options: ISourceOptions = useMemo(() => {
        const style =
            typeof window !== "undefined"
                ? getComputedStyle(document.documentElement)
                : null;

        return {
            background: {
                color: {
                    value: style?.getPropertyValue("--background").trim() || "#0A090D",
                },
            },
            fpsLimit: 60,
            particles: {
                color: {
                    value: style?.getPropertyValue("--primary").trim() || "#FF4D4D",
                },
                move: {
                    direction: "bottom",
                    enable: true,
                    outModes: {
                        default: "out",
                    },
                    random: false,
                    speed: 3,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 30,
                },
                opacity: {
                    value: 0.4,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 4 },
                },
            },
            detectRetina: true,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Recalculate options when engine initializes
    }, [init]);

    if (init) {
        return (
            <Particles
                id="tsparticles"
                key="tsparticlesContainer"
                options={options}
                className="fixed top-0 left-0 z-0 h-screen w-screen"
            />
        );
    }
};
