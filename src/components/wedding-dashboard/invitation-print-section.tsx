"use client";

import { Card, PlanBadge } from "./dashboard-ui";
import { PdfButton } from "./pdf-button";
import { QrImage } from "./qr-image";

type InvitationPrintSectionProps = {
    siteUrl: string;
    /** A household's personal link, to show what its own code opens. */
    sample: { readonly name: string; readonly link: string };
    householdCount: number;
    onDownloadShared: () => Promise<void>;
    onDownloadHouseholds: () => Promise<void>;
};

const panel = "grid content-start justify-items-start gap-4 p-5 md:p-6";

/**
 * The faire-part as files to print wherever the couple likes: one card for everyone, its code
 * opening the site, or one per household, its code opening that household's own answer.
 */
export const InvitationPrintSection = ({
    siteUrl,
    sample,
    householdCount,
    onDownloadShared,
    onDownloadHouseholds,
}: InvitationPrintSectionProps) => (
    <Card
        id="impression"
        title="Faire-part à imprimer"
        titleId="impression-titre"
        plan="faire-part-pdf"
        aside={
            <span className="text-wed-muted text-[0.8rem]">
                PDF au format A5, à imprimer où vous voulez
            </span>
        }
    >
        <div className="divide-wed-line-soft grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className={panel}>
                <h3 className="font-semibold">Le même pour tous</h3>
                <div className="flex items-center gap-4">
                    <QrImage
                        url={siteUrl}
                        label="QR code du faire-part : ouvre le site du mariage"
                        className="size-24 shrink-0"
                    />
                    <p className="text-wed-ink-soft text-sm">
                        Vos prénoms, la date et le lieu, et un QR code qui ouvre le site. Son
                        adresse est écrite dessous, pour qui ne scanne pas.
                    </p>
                </div>
                <PdfButton onExport={onDownloadShared}>Le faire-part en PDF</PdfButton>
            </div>
            <div className={panel}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h3 className="font-semibold">Un par foyer</h3>
                    <PlanBadge section="qr-foyer" />
                </div>
                <div className="flex items-center gap-4">
                    <figure className="grid shrink-0 justify-items-center gap-1">
                        <QrImage
                            url={sample.link}
                            label={`QR code personnel de ${sample.name}`}
                            className="size-24"
                        />
                        <figcaption className="text-wed-muted max-w-24 truncate text-[0.7rem]">
                            {sample.name}
                        </figcaption>
                    </figure>
                    <p className="text-wed-ink-soft text-sm">
                        Chaque faire-part porte le nom du foyer et son propre QR code : il ouvre sa
                        réponse sans rien taper, et le jour J, sa table.
                    </p>
                </div>
                <PdfButton onExport={onDownloadHouseholds}>
                    {householdCount > 1
                        ? `Les ${householdCount} faire-part en PDF`
                        : "Le faire-part en PDF"}
                </PdfButton>
            </div>
        </div>
    </Card>
);
