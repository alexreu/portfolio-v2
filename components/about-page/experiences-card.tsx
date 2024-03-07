import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronsRight, Layers } from "lucide-react";

export const ExperiencesCard = () => {
    return (
        <Card className="relative col-span-4 flex flex-col justify-center opacity-100 backdrop-blur-xl">
            <CardHeader>
                <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">Expériences</h1>
            </CardHeader>
            <CardContent>
                <ul className="flex flex-col justify-center gap-5">
                    <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                        <ChevronsRight />
                        <p className="inline-flex items-center gap-0.5">
                            <span className="pr-1">2022 // Now</span>
                            <span
                                className="relative pl-3 pr-1 before:absolute before:left-0 before:top-1/2
                                    before:h-[1px] before:w-2 before:bg-white before:content-['']"
                            >
                                Developpeur front
                            </span>
                            <span
                                className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:h-[1px]
                                    before:w-2 before:bg-white before:content-['']"
                            >
                                Simplon.co
                            </span>
                        </p>
                    </li>
                    <li className="flex gap-2 text-sm text-white opacity-60">
                        <ChevronsRight />
                        <p className="inline-flex items-center gap-0.5">
                            <span className="pr-1">2018 // 2022</span>
                            <span
                                className="relative pl-3 pr-1 before:absolute before:left-0 before:top-1/2
                                    before:h-[1px] before:w-2 before:bg-white before:content-['']"
                            >
                                Developpeur front
                            </span>
                            <span
                                className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:h-[1px]
                                    before:w-2 before:bg-white before:content-['']"
                            >
                                Simplon.Prod
                            </span>
                        </p>
                    </li>
                    <li className="flex gap-2 text-sm text-white opacity-60">
                        <ChevronsRight />
                        <p className="inline-flex items-center gap-0.5">
                            <span className="pr-1">2015 // 2017</span>
                            <span
                                className="relative pl-3 pr-1 before:absolute before:left-0 before:top-1/2
                                    before:h-[1px] before:w-2 before:bg-white before:content-['']"
                            >
                                Technicien réseaux
                            </span>
                            <span
                                className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:h-[1px]
                                    before:w-2 before:bg-white before:content-['']"
                            >
                                AtoutPc&apos;s
                            </span>
                        </p>
                    </li>
                </ul>
            </CardContent>
            <Layers className="absolute right-1 top-1 stroke-muted-foreground opacity-50" size={58} strokeWidth={0.5} />
        </Card>
    );
};
