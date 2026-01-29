import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    job: string;
};

export const TitleCard = ({ job }: Props) => {
    const [firstPart, secondPart] = job.split(" ");

    return (
        <Card className="order-2 col-span-1 opacity-100 backdrop-blur-xl lg:order-0 lg:col-span-3">
            <CardHeader className="flex h-full justify-center">
                <CardTitle className="inline-flex w-full flex-col gap-5 text-3xl lg:text-2xl xl:text-3xl">
                    <span className="text-white">{firstPart}</span>
                    <span className="text-muted-foreground ml-auto">{secondPart}</span>
                </CardTitle>
            </CardHeader>
        </Card>
    );
};
