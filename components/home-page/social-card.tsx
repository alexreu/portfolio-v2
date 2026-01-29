import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { Blend, Circle, Code, Crosshair, Linkedin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Props = ComponentPropsWithoutRef<"div">;

export const SocialCard = ({ className }: Props) => {
    return (
        <Card
            className={cn(
                `relative order-5 col-span-1 flex flex-col items-start justify-center gap-3 p-4 opacity-100 backdrop-blur-xl lg:order-0 lg:col-span-3 lg:row-span-1`,
                className,
            )}
        >
            <h1 className="text-primary text-xl leading-none font-semibold tracking-tight">
                Social
            </h1>
            <ul className="flex w-full justify-evenly">
                <li className="inline-flex">
                    <Link
                        href="https://www.linkedin.com/in/alexandre-adolphe-817059146"
                        className="group relative rounded-full p-7 text-white transition-all duration-500 ease-in-out"
                        title="Profil Linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="sr-only">consulter mon profil linkedin</span>
                        <Circle
                            className="stroke-muted-foreground absolute bottom-0 left-0 h-full w-full"
                            strokeWidth={0.3}
                        />
                        <Linkedin
                            size={24}
                            strokeWidth={0}
                            className="group-hover:fill-primary group-hover:stroke-primary group-focus:fill-primary group-focus:stroke-primary fill-white"
                        />
                        <Crosshair
                            className="stroke-muted-foreground group-hover:stroke-primary group-focus:stroke-primary absolute bottom-0 left-0 h-full w-full opacity-0 transition-all duration-500 ease-in-out group-hover:rotate-45 group-hover:opacity-100 group-focus:rotate-45 group-focus:opacity-100"
                            strokeWidth={0.3}
                        />
                    </Link>
                </li>
                <li className="inline-flex">
                    <Link
                        href="https://www.malt.fr/profile/alexandreadolphe"
                        className="group relative rounded-full p-7 text-white transition-all duration-500 ease-in-out"
                        title="Profil Freelance"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="sr-only">
                            consulter mon profil freelance sur la plateforme malt
                        </span>
                        <Circle
                            className="stroke-muted-foreground absolute bottom-0 left-0 h-full w-full"
                            strokeWidth={0.3}
                        />
                        <Code
                            size={24}
                            className="group-hover:stroke-primary group-focus:stroke-primary"
                        />
                        <Crosshair
                            className="stroke-muted-foreground group-hover:stroke-primary group-focus:stroke-primary absolute bottom-0 left-0 h-full w-full opacity-0 transition-all duration-500 ease-in-out group-hover:rotate-45 group-hover:opacity-100 group-focus:rotate-45 group-focus:opacity-100"
                            strokeWidth={0.3}
                        />
                    </Link>
                </li>
            </ul>
            <Blend
                className="stroke-muted-foreground absolute top-1 right-1 rotate-90 opacity-50"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
