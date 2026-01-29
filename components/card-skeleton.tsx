import { HTMLAttributes } from "react";

import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    numberOfSkeleton?: number;
    isBig?: boolean;
    skeletonClassName?: string;
} & HTMLAttributes<HTMLDivElement>;

export const CardSkeleton = ({
    numberOfSkeleton = 3,
    isBig,
    skeletonClassName,
    ...props
}: Props) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-6" {...props}>
            {new Array(numberOfSkeleton).fill(0).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`${i === 0 && isBig ? "h-36" : "h-4"} bg-muted-foreground w-full ${skeletonClassName}`}
                />
            ))}
        </div>
    );
};
