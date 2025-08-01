import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import React, { ComponentPropsWithoutRef } from "react";
import { Blend } from "lucide-react";
import { cn } from "@/lib/utils";
import { CardFooterLink } from "@/components/ui/card-footer-link";

type Props = ComponentPropsWithoutRef<"div">;

export const GetInTouchCard = ({ className }: Props) => {
    return (
        <Card
            className={cn(
                `relative order-7 col-span-1 flex flex-col opacity-100 backdrop-blur-xl lg:order-0 lg:col-span-3
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
                <CardFooterLink href="/contact" aria-label="formulaire de contact">
                    Get in touch
                </CardFooterLink>
            </CardFooter>
            <Blend
                className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
