export default function Loading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Animated logo/spinner */}
                <div className="relative h-16 w-16">
                    {/* Outer ring */}
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                    {/* Inner glow */}
                    <div className="absolute inset-2 rounded-full bg-primary/20 blur-sm" />
                    {/* Center dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 animate-pulse rounded-full bg-primary" />
                    </div>
                </div>

                <p className="text-sm text-gray-400">Chargement...</p>
            </div>
        </div>
    );
}
