import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight, Sparkles } from "lucide-react";
import React from "react";

export const SkillsCard = () => {
    return (
        <Card className="relative col-span-3 flex flex-col justify-center opacity-100 backdrop-blur-xl">
            <CardHeader>
                <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">What i do</h1>
            </CardHeader>
            <CardContent>
                <ul className="flex flex-col justify-center gap-5">
                    <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                        <ChevronRight />
                        <p>Developpement front</p>
                    </li>
                    <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                        <ChevronRight />
                        <p>Integration web</p>
                    </li>
                    <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                        <ChevronRight />
                        <p>Développement back</p>
                    </li>
                    <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                        <ChevronRight />
                        <p>SEO & Referencement simple</p>
                    </li>
                </ul>
            </CardContent>
            <Sparkles
                className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
