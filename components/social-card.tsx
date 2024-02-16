import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { Circle, Code, Crosshair, Linkedin } from "lucide-react";

export const SocialCard = () => {
    return (
        <Card className="col-span-3 row-span-1 opacity-100 backdrop-blur-xl">
            <CardHeader className="h-full justify-between">
                <CardTitle className="text-xl tracking-normal text-primary">Social</CardTitle>
                <CardDescription>
                    <ul className="flex justify-evenly">
                        <li className="inline-flex">
                            <Link
                                href="#"
                                className="group relative rounded-full p-9 text-white transition-all duration-500
                                    ease-in-out"
                                title="Profil Linkedin"
                            >
                                <span className="sr-only">consulter mon profil linkedin</span>
                                <Circle
                                    className="absolute bottom-0 left-0 h-full w-full stroke-muted-foreground"
                                    strokeWidth={0.3}
                                />
                                <Linkedin size={28} className="group-hover:stroke-primary group-focus:stroke-primary" />
                                <Crosshair
                                    className="absolute bottom-0 left-0 h-full w-full stroke-muted-foreground opacity-0
                                        transition-all duration-300 ease-in-out group-hover:rotate-45
                                        group-hover:stroke-primary group-hover:opacity-100 group-focus:rotate-45
                                        group-focus:stroke-primary group-focus:opacity-100"
                                    strokeWidth={0.3}
                                />
                            </Link>
                        </li>
                        <li className="inline-flex">
                            <Link
                                href="#"
                                className="group relative rounded-full p-9 text-white transition-all duration-500
                                    ease-in-out"
                                title="Profile Freelance"
                            >
                                <span className="sr-only">consulter mon profil freelance sur la plateforme codeur</span>
                                <Circle
                                    className="absolute bottom-0 left-0 h-full w-full stroke-muted-foreground"
                                    strokeWidth={0.3}
                                />
                                <Code size={28} className="group-hover:stroke-primary group-focus:stroke-primary" />
                                <Crosshair
                                    className="absolute bottom-0 left-0 h-full w-full stroke-muted-foreground opacity-0
                                        transition-all duration-300 ease-in-out group-hover:rotate-45
                                        group-hover:stroke-primary group-hover:opacity-100 group-focus:rotate-45
                                        group-focus:stroke-primary group-focus:opacity-100"
                                    strokeWidth={0.3}
                                />
                            </Link>
                        </li>
                    </ul>
                </CardDescription>
            </CardHeader>
        </Card>
    );
};
