import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Blend } from "lucide-react";
import React from "react";

export const ProfilePictureCard = () => {
    return (
        <Card className="relative col-span-4 flex flex-col justify-center opacity-100 backdrop-blur-xl">
            <CardHeader>
                <div className="mx-auto mt-6 h-40 w-40 rounded-full bg-primary">
                    <Image src="/images/resume-photo.png" alt="" width={160} height={160} />
                </div>
            </CardHeader>
            <Blend
                className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
