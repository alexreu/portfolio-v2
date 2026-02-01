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

    const options: ISourceOptions = useMemo(
        () => ({
            background: {
                color: {
                    value: "#0A0A0A",
                },
            },
            fpsLimit: 120,
            particles: {
                color: {
                    value: "#FF4D4D",
                },
                move: {
                    direction: "bottom",
                    enable: true,
                    outModes: {
                        default: "out",
                    },
                    random: false,
                    speed: 4,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 60,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 5 },
                },
            },
            detectRetina: true,
        }),
        [],
    );

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
