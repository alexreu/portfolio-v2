import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { CardTitle } from "@/components/card-title";

export const EducationCard = () => {
    return (
        <Card className="relative col-span-6 flex flex-col justify-center opacity-100 backdrop-blur-xl">
            <CardHeader>
                <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="grid grid-cols-2 gap-y-6">
                    <li className="col-span-1 flex flex-col">
                        <span className="text-muted-foreground">2019 - 2020</span>
                        <span className="text-xl text-white">Bachelor - CSI</span>
                        <span className="text-muted-foreground">CCI - Réunion</span>
                    </li>
                    <li className="col-span-1 flex flex-col">
                        <span className="text-muted-foreground">2018 - 2019</span>
                        <span className="text-xl text-white">BTS - DWWM</span>
                        <span className="text-muted-foreground">Simplon - Réunion</span>
                    </li>
                    <li className="col-span-1 flex flex-col">
                        <span className="text-muted-foreground">2015 - 2017</span>
                        <span className="text-xl text-white">BTS - CERT</span>
                        <span className="text-muted-foreground">CCI - Réunion</span>
                    </li>
                    <li className="col-span-1 flex flex-col">
                        <span className="text-muted-foreground">2014</span>
                        <span className="text-xl text-white">Baccalauréat STI2D</span>
                        <span className="text-muted-foreground">Lycée - Bel Air</span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
};
