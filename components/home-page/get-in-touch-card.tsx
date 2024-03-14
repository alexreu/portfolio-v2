import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import React, { ComponentPropsWithoutRef } from "react";
import { Blend, MoveRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = ComponentPropsWithoutRef<"div">;

export const GetInTouchCard = ({ className }: Props) => {
    return (
        <Card
            className={cn(
                `relative order-7 col-span-1 flex flex-col opacity-100 backdrop-blur-xl lg:order-none lg:col-span-3
                lg:row-span-1 lg:justify-center`,
                className
            )}
        >
            <CardHeader className="xl:mt-auto">
                <h1
                    className="inline-flex flex-col gap-5 text-2xl font-semibold leading-none tracking-wide text-white
                        lg:text-xl xl:text-2xl"
                >
                    <span>Work</span>
                    <span className="ml-12 lg:ml-5">
                        With <span className="text-primary">me</span>... !
                    </span>
                </h1>
            </CardHeader>
            <CardFooter className="xl:mt-auto">
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
