import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { CardSkeleton } from "@/components/card-skeleton";

type Props = {
    job?: string;
};

export const TitleCard = ({ job }: Props) => {
    const [firstPart, secondPart] = useMemo(() => job?.split(" ") ?? [], [job]);

    return (
        <Card className="order-2 col-span-1 opacity-100 backdrop-blur-xl lg:order-none lg:col-span-3">
            {!job ? (
                <CardSkeleton />
            ) : (
                <CardHeader className="flex h-full justify-center">
                    <CardTitle className="inline-flex w-full flex-col gap-5 text-3xl lg:text-2xl xl:text-3xl">
                        <span className="text-white">{firstPart}</span>
                        <span className="ml-auto text-muted-foreground">{secondPart}</span>
                    </CardTitle>
                </CardHeader>
            )}
        </Card>
    );
};
