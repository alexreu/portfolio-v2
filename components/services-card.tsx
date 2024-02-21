import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { FileCode2, MoveRight, PersonStanding, ThumbsUp, TrendingUp, Wallpaper } from "lucide-react";
import Link from "next/link";

export const ServicesCard = () => {
    return (
        <Card
            className="col-span-1 flex flex-col opacity-100 backdrop-blur-xl lg:col-span-6 lg:col-start-4 lg:row-span-2
                lg:row-start-2"
        >
            <CardHeader>
                <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">Services</h1>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
                <ul className="flex items-center justify-between">
                    <li className="flex flex-col-reverse items-center gap-2">
                        <h2 className="text-sm font-medium text-white">Developpement web</h2>
                        <FileCode2 className="stroke-primary" strokeWidth={1} size={48} />
                    </li>
                    <li className="flex flex-col-reverse items-center gap-2">
                        <h2 className="text-sm font-medium text-white">Integration Web</h2>
                        <Wallpaper className="stroke-primary" strokeWidth={1} size={48} />
                    </li>
                    <li className="flex flex-col-reverse items-center gap-2">
                        <h2 className="text-sm font-medium text-white">SEO & Référencement</h2>
                        <TrendingUp className="stroke-primary" strokeWidth={1} size={48} />
                    </li>
                    <li className="flex flex-col-reverse items-center gap-2">
                        <h2 className="text-sm font-medium text-white">Accessibilité</h2>
                        <PersonStanding className="stroke-primary" strokeWidth={1} size={48} />
                    </li>
                </ul>
                <h3 className="my-auto inline-flex items-center gap-2 text-3xl font-bold text-white">
                    <span>Things I’m good at</span>
                    <ThumbsUp className="animate-bounce stroke-primary" size={32} strokeWidth={1} />
                </h3>
                <Link
                    href="/services"
                    className="inline-flex w-full justify-between py-2 font-medium text-white transition-all
                        duration-200 ease-in-out hover:text-primary"
                >
                    Tous mes services
                    <MoveRight strokeWidth={1} />
                </Link>
            </CardContent>
        </Card>
    );
};
