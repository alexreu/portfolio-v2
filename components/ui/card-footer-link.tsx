import { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { LoaderCircle, MoveRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = ComponentPropsWithoutRef<typeof Link>;

export const CardFooterLink = ({ className, children, ...props }: Props) => {
    return (
        <Link
            className={cn(
                "group inline-flex w-full justify-between rounded-lg py-2 font-medium text-white",
                className,
            )}
            {...props}
        >
            <span className="group-hover:text-primary transition-all duration-300 ease-in-out">
                {children}
            </span>
            <span className="relative inline-flex items-center pr-4 text-sm font-medium text-white">
                <MoveRight
                    strokeWidth={2}
                    className="group-hover:stroke-primary transition-all duration-300 ease-in-out"
                />
                <LoaderCircle
                    strokeWidth={1}
                    size={38}
                    className="group-hover:stroke-primary absolute -top-[7px] right-0 -rotate-145 transition-all duration-300 ease-in-out"
                />
            </span>
        </Link>
    );
};
