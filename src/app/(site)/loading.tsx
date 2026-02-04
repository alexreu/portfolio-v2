export default function Loading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Animated logo/spinner */}
                <div className="relative h-16 w-16">
                    {/* Outer ring */}
                    <div className="border-t-primary absolute inset-0 animate-spin rounded-full border-4 border-transparent" />
                    {/* Inner glow */}
                    <div className="bg-primary/20 absolute inset-2 rounded-full blur-sm" />
                    {/* Center dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary h-4 w-4 animate-pulse rounded-full" />
                    </div>
                </div>

                <p className="text-sm text-gray-300">Chargement...</p>
            </div>
        </div>
    );
}
