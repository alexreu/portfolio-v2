import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import { Blend, MoveRight } from "lucide-react";
import Link from "next/link";

export const GetInTouchCard = () => {
    return (
        <Card className="relative col-span-1 flex flex-col opacity-100 backdrop-blur-xl lg:col-span-3 lg:row-span-1">
            <CardHeader>
                <h1 className="inline-flex flex-col gap-5 text-2xl font-semibold leading-none tracking-wide text-white">
                    <span>Work</span>
                    <span className="ml-5">
                        With <span className="text-primary">me</span>... !
                    </span>
                </h1>
            </CardHeader>
            <CardFooter className="mt-auto">
                <Link
                    href="/contact"
                    className="inline-flex w-full justify-between py-2 font-medium text-white transition-all
                        duration-200 ease-in-out hover:text-primary"
                >
                    <span>Get in touch</span>
                    <MoveRight strokeWidth={1} />
                </Link>
            </CardFooter>
            <Blend
                className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
