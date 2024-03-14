import Link from "next/link";
import { LoaderCircle, MoveRight } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentPropsWithoutRef<typeof Link>;

export const CardFooterLink = ({ className, children, ...props }: Props) => {
    return (
        <Link
            className={cn("group inline-flex w-full justify-between py-2 font-medium text-white", className)}
            {...props}
        >
            <span className="transition-all duration-300 ease-in-out group-hover:text-primary">{children}</span>
            <span className="relative inline-flex items-center pr-4 text-sm font-medium text-white">
                <MoveRight
                    strokeWidth={2}
                    className="transition-all duration-300 ease-in-out group-hover:stroke-primary"
                />
                <LoaderCircle
                    strokeWidth={1}
                    size={38}
                    className="absolute -top-[7px] right-0 -rotate-[145deg] transition-all duration-300 ease-in-out
                        group-hover:stroke-primary"
                />
            </span>
        </Link>
    );
};
