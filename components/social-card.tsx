import { Card } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { Blend, Circle, Code, Crosshair, Linkedin } from "lucide-react";

export const SocialCard = () => {
    return (
        <Card
            className="relative col-span-3 row-span-1 flex flex-col items-start justify-center gap-3 p-4 opacity-100
                backdrop-blur-xl"
        >
            <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">Social</h1>
            <ul className="flex w-full justify-evenly">
                <li className="inline-flex">
                    <Link
                        href="#"
                        className="group relative rounded-full p-7 text-white transition-all duration-500 ease-in-out"
                        title="Profil Linkedin"
                    >
                        <span className="sr-only">consulter mon profil linkedin</span>
                        <Circle
                            className="absolute bottom-0 left-0 h-full w-full stroke-muted-foreground"
                            strokeWidth={0.3}
                        />
                        <Linkedin
                            size={24}
                            strokeWidth={1}
                            className="fill-white group-hover:fill-primary group-hover:stroke-primary
                                group-focus:fill-primary group-focus:stroke-primary"
                        />
                        <Crosshair
                            className="absolute bottom-0 left-0 h-full w-full stroke-muted-foreground opacity-0
                                transition-all duration-500 ease-in-out group-hover:rotate-45 group-hover:stroke-primary
                                group-hover:opacity-100 group-focus:rotate-45 group-focus:stroke-primary
                                group-focus:opacity-100"
                            strokeWidth={0.3}
                        />
                    </Link>
                </li>
                <li className="inline-flex">
                    <Link
                        href="#"
                        className="group relative rounded-full p-7 text-white transition-all duration-500 ease-in-out"
                        title="Profil Freelance"
                    >
                        <span className="sr-only">consulter mon profil freelance sur la plateforme codeur</span>
                        <Circle
                            className="absolute bottom-0 left-0 h-full w-full stroke-muted-foreground"
                            strokeWidth={0.3}
                        />
                        <Code size={24} className="group-hover:stroke-primary group-focus:stroke-primary" />
                        <Crosshair
                            className="absolute bottom-0 left-0 h-full w-full stroke-muted-foreground opacity-0
                                transition-all duration-500 ease-in-out group-hover:rotate-45 group-hover:stroke-primary
                                group-hover:opacity-100 group-focus:rotate-45 group-focus:stroke-primary
                                group-focus:opacity-100"
                            strokeWidth={0.3}
                        />
                    </Link>
                </li>
            </ul>
            <Blend
                className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
