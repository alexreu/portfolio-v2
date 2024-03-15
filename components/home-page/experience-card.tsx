import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { CardSkeleton } from "@/components/card-skeleton";

type Props = {
    keyFigures?: { keyFigure: string; keyFigureDescription: string; _key: string }[];
};

export const ExperienceCard = ({ keyFigures }: Props) => {
    return (
        <Card
            className="relative order-3 col-span-1 flex flex-col gap-12 opacity-100 backdrop-blur-xl lg:order-none
                lg:col-span-3 lg:row-span-2 lg:gap-0 xl:row-span-3"
        >
            <CardHeader>
                <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">Experiences</h1>
            </CardHeader>
            {!keyFigures ? (
                <CardSkeleton numberOfSkeleton={5} />
            ) : (
                <CardContent className="w-full flex-1 pb-12 lg:p-6">
                    <ul className="flex h-full flex-col justify-center gap-12">
                        {keyFigures.map(({ keyFigure, keyFigureDescription, _key }) => (
                            <li key={_key} className="flex flex-col items-center justify-center gap-2 text-center">
                                <span className="text-5xl font-medium tracking-normal text-white">{keyFigure}</span>
                                <span className="uppercase text-muted-foreground">{keyFigureDescription}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            )}
            <Sparkles
                className="absolute right-1 top-1 rotate-90 animate-pulse stroke-muted-foreground"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
