import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export const TitleCard = () => {
    return (
        <Card className="col-span-3 opacity-100 backdrop-blur-xl">
            <CardHeader className="flex h-full justify-center">
                <CardTitle className="inline-flex w-full flex-col gap-5 text-3xl">
                    <span className="text-white">Developpeur</span>
                    <span className="ml-auto text-muted-foreground">Front-end</span>
                </CardTitle>
            </CardHeader>
        </Card>
    );
};
