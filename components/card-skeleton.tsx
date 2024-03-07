import { Skeleton } from "@/components/ui/skeleton";
import { HTMLAttributes } from "react";

type Props = {
    numberOfSkeleton?: number;
    isBig?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const CardSkeleton = ({ numberOfSkeleton = 3, isBig, ...props }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-6" {...props}>
            {new Array(numberOfSkeleton).fill(0).map((_, i) => (
                <Skeleton key={i} className={`${i === 0 && isBig ? "h-36" : "h-4"} w-full bg-muted-foreground`} />
            ))}
        </div>
    );
};
