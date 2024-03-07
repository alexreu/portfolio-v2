import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export const KeyFigures = () => {
    return (
        <Card className="relative col-span-5 flex flex-col justify-center opacity-100 backdrop-blur-xl">
            <CardContent className="pt-6">
                <ul className="grid grid-cols-2 gap-8">
                    <li className="col-span-1 flex flex-col items-start justify-start gap-2 text-left">
                        <span className="text-5xl font-medium tracking-normal text-white">05</span>
                        <span className="uppercase text-muted-foreground">année d&apos;expériences</span>
                    </li>
                    <li className="col-span-1 flex flex-col items-start justify-start gap-2 text-left">
                        <span className="text-5xl font-medium tracking-normal text-white">05</span>
                        <span className="uppercase text-muted-foreground">année d&apos;expériences</span>
                    </li>
                    <li className="col-span-1 flex flex-col items-start justify-start gap-2 text-left">
                        <span className="text-5xl font-medium tracking-normal text-white">05</span>
                        <span className="uppercase text-muted-foreground">année d&apos;expériences</span>
                    </li>
                    <li className="col-span-1 flex flex-col items-start justify-start gap-2 text-left">
                        <span className="text-5xl font-medium tracking-normal text-white">05</span>
                        <span className="uppercase text-muted-foreground">année d&apos;expériences</span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
};
