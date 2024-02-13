import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";

export const ProfileCard = () => {
    return (
        <Card className="col-span-3 col-start-1 row-span-2 row-start-1 flex flex-col items-center opacity-100 backdrop-blur-xl">
            <div className="mx-auto mt-6 h-36 w-36 rounded-full bg-primary bg-[url('/images/resume-photo.png')] bg-cover bg-center"></div>
            <CardHeader>
                <CardTitle className="text-primary">
                    <Link className="rounded-xl bg-primary p-3 text-white" href="#">
                        AlexDevLab
                    </Link>
                </CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    );
};
