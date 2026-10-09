import { useMemo } from "react";
import { qrCode } from "@alexreu/wedding-core/prints";

import { cn } from "@/lib/utils";

type QrImageProps = {
    url: string;
    /** What scanning it opens, for screen readers. */
    label: string;
    className?: string;
};

/** A QR code drawn in the ink of the dashboard, on white so any phone reads it off the screen. */
export const QrImage = ({ url, label, className }: QrImageProps) => {
    const { size, path } = useMemo(() => qrCode(url, { border: 2 }), [url]);
    return (
        <svg
            role="img"
            aria-label={label}
            viewBox={`0 0 ${size} ${size}`}
            shapeRendering="crispEdges"
            className={cn("text-wed-ink rounded-lg bg-white", className)}
        >
            <path d={path} fill="currentColor" />
        </svg>
    );
};
