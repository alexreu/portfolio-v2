"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { buttonStyles, Card } from "./dashboard-ui";
import { PdfButton } from "./pdf-button";
import { QrImage } from "./qr-image";

type QrPosterCardProps = {
    id: string;
    title: string;
    /** The page the code opens, and only that one. */
    url: string;
    /** What scanning opens, for screen readers. */
    qrLabel: string;
    /** The section it belongs to, for the formula badge. */
    plan: string;
    aside: string;
    children: ReactNode;
    downloadLabel: string;
    openLabel: string;
    /** What the PDF holds. */
    note: string;
    onDownload: () => Promise<void>;
};

/** A QR code to print for the day, the page it opens, and its poster as a PDF. */
export const QrPosterCard = ({
    id,
    title,
    url,
    qrLabel,
    plan,
    aside,
    children,
    downloadLabel,
    openLabel,
    note,
    onDownload,
}: QrPosterCardProps) => (
    <Card
        id={id}
        title={title}
        titleId={`${id}-titre`}
        plan={plan}
        aside={<span className="text-wed-muted text-[0.8rem]">{aside}</span>}
    >
        <div className="flex flex-col items-start gap-5 p-5 sm:flex-row sm:items-center md:p-6">
            <QrImage url={url} label={qrLabel} className="size-32 shrink-0" />
            <div className="grid justify-items-start gap-3">
                <p className="text-wed-ink-soft max-w-prose text-sm">{children}</p>
                <div className="flex flex-wrap items-center gap-2">
                    <PdfButton onExport={onDownload}>{downloadLabel}</PdfButton>
                    <a href={url} target="_blank" rel="noopener" className={buttonStyles.quiet}>
                        <ExternalLink aria-hidden="true" />
                        {openLabel}
                    </a>
                </div>
                <p className="text-wed-muted text-xs">{note}</p>
            </div>
        </div>
    </Card>
);
