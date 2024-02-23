import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const TitleCard = ({job}) => {
    return (
        <Card className="col-span-1 opacity-100 backdrop-blur-xl lg:col-span-3">
            <CardHeader className="flex h-full justify-center">
                <CardTitle className="inline-flex w-full flex-col gap-5 text-3xl">
                    <span className="text-white">Developpeur</span>
                    <span className="ml-auto text-muted-foreground">Front-end</span>
                </CardTitle>
            </CardHeader>
        </Card>
    );
};
