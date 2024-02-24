import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { FileCode2, MoveRight, PersonStanding, ThumbsUp, TrendingUp, Wallpaper } from "lucide-react";
import Link from "next/link";

export const ServicesCard = () => {
    const services = [
        {
            title: "Developpement web",
            icons: <FileCode2 className="h-8 w-8 stroke-primary lg:h-12 lg:w-12" strokeWidth={1} />,
        },
        {
            title: "Integration Web",
            icons: <Wallpaper className="h-8 w-8 stroke-primary lg:h-12 lg:w-12" strokeWidth={1} />,
        },
        {
            title: "Référencement",
            icons: <TrendingUp className="h-8 w-8 stroke-primary lg:h-12 lg:w-12" strokeWidth={1} />,
        },
        {
            title: "Accessibilité",
            icons: <PersonStanding className="h-8 w-8 stroke-primary lg:h-12 lg:w-12" strokeWidth={1} />,
        },
    ];
    return (
        <Card
            className="order-4 col-span-1 flex flex-col gap-5 opacity-100 backdrop-blur-xl lg:order-none lg:col-span-6
                lg:col-start-4 lg:row-span-2 lg:row-start-2 lg:gap-0"
        >
            <CardHeader>
                <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">Services</h1>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-12 md:gap-8 lg:gap-0">
                <ul
                    className="grid grid-cols-2 content-center justify-items-center gap-2 justify-self-auto
                        lg:grid-cols-4 lg:gap-0"
                >
                    {services.map(({ title, icons }) => (
                        <li key={title} className="flex w-full flex-col-reverse items-center gap-2 text-center">
                            <h2 className="text-xs font-medium text-white lg:text-sm">{title}</h2>
                            {icons}
                        </li>
                    ))}
                </ul>
                <h3 className="my-auto inline-flex items-center gap-2 text-xl font-bold text-white lg:text-3xl">
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
