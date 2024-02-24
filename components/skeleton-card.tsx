import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    numberOfSkeleton?: number;
};

export const SkeletonCard = ({ numberOfSkeleton = 3, ...props }: Props) => {
    return (
        <div className="flex h-full flex-col items-center justify-center space-y-4 p-6" {...props}>
            {new Array(numberOfSkeleton).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full bg-muted-foreground" />
            ))}
        </div>
    );
};
