export default function Loading() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="relative flex flex-col items-center gap-6">
                {/* Ambient glow */}
                <div className="bg-primary/10 absolute -inset-20 rounded-full blur-3xl" />

                {/* Orbiting ring */}
                <div className="relative flex h-28 w-28 items-center justify-center">
                    {/* Outer spinning ring with gradient trail */}
                    <div
                        className="absolute inset-0 animate-spin rounded-full"
                        style={{
                            background:
                                "conic-gradient(from 0deg, transparent 0%, transparent 60%, var(--primary) 100%)",
                            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px))",
                            WebkitMask:
                                "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px))",
                            animationDuration: "1.4s",
                            animationTimingFunction: "linear",
                        }}
                    />

                    {/* Static subtle track */}
                    <div className="absolute inset-0 rounded-full border border-white/[0.06]" />

                    {/* Glowing dot at ring tip */}
                    <div
                        className="absolute inset-0 animate-spin"
                        style={{
                            animationDuration: "1.4s",
                            animationTimingFunction: "linear",
                        }}
                    >
                        <div className="bg-primary shadow-glow-sm absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" />
                    </div>

                    {/* Inner glass card with brand mark */}
                    <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
                        <span
                            className="text-primary text-lg font-bold tracking-tight select-none"
                            style={{ animationDuration: "2s" }}
                        >
                            &lt;/&gt;
                        </span>
                    </div>
                </div>

                {/* Loading text */}
                <p className="animate-pulse text-sm tracking-widest text-gray-500 uppercase">
                    Chargement
                </p>
            </div>
        </div>
    );
}
