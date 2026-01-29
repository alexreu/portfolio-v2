import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
    keyFigures: { keyFigure: string; keyFigureDescription: string; _key: string }[];
};

export const ExperienceCard = ({ keyFigures }: Props) => {
    return (
        <Card className="relative order-3 col-span-1 flex flex-col gap-12 opacity-100 backdrop-blur-xl lg:order-0 lg:col-span-3 lg:gap-0">
            <CardHeader>
                <h1 className="text-primary text-xl leading-none font-semibold tracking-tight">
                    Experiences
                </h1>
            </CardHeader>
            <CardContent className="w-full flex-1 pb-12 lg:p-6">
                <ul className="flex h-full flex-col justify-center gap-12">
                    {keyFigures.map(({ keyFigure, keyFigureDescription, _key }) => (
                        <li
                            key={_key}
                            className="flex flex-col items-center justify-center gap-2 text-center"
                        >
                            <span className="text-5xl font-medium tracking-normal text-white">
                                {keyFigure}
                            </span>
                            <span className="text-muted-foreground uppercase">
                                {keyFigureDescription}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <Sparkles
                className="stroke-muted-foreground absolute top-1 right-1 rotate-90 animate-pulse"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
