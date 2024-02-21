"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { GlobalLoading } from "@/components/global-loading";
import { AnimatePresence } from "framer-motion";

export const ParticlesContainer = () => {
    const [isLoaderVisible, setIsLoaderVisible] = useState(true);

    useEffect(() => {
        const loadParticlesEngine = async () => {
            await initParticlesEngine(async engine => {
                await loadSlim(engine);
            });
        };

        loadParticlesEngine().then(() => {
            setIsLoaderVisible(false);
        });
    }, []);

    const options: ISourceOptions = useMemo(
        () => ({
            background: {
                color: {
                    value: "#0A090D",
                },
            },
            fpsLimit: 120,
            particles: {
                color: {
                    value: "#FD4766",
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
        []
    );

    return (
        <>
            <AnimatePresence mode="wait">{isLoaderVisible && <GlobalLoading />}</AnimatePresence>
            <Particles id="tsparticles" options={options} className="fixed left-0 top-0 h-screen w-screen" />
        </>
    );
};
