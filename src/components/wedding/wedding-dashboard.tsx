import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WeddingService } from "@/lib/wedding-service/types";

import { SectionIntro } from "./section-intro";

type WeddingDashboardProps = {
    dashboard: WeddingService["dashboard"];
};

const kpis = [
    { label: "Réponses", value: "86", detail: "sur 121 invités · 71 %" },
    { label: "Au dîner", value: "74", detail: "dont 9 enfants" },
    { label: "Régimes", value: "11", detail: "8 végé · 3 sans gluten" },
    { label: "Date limite", value: "J-23", detail: "relance auto J-15" },
] as const;

type Status = "yes" | "wait" | "no";

const rows: readonly { household: string; ceremony: [Status, string]; dinner: [Status, string] }[] =
    [
        {
            household: "Marie & Thomas Lefèvre",
            ceremony: ["yes", "2 présents"],
            dinner: ["yes", "2 présents"],
        },
        {
            household: "Famille Moreau (4)",
            ceremony: ["yes", "4 présents"],
            dinner: ["wait", "En attente"],
        },
        { household: "Julien Bertrand", ceremony: ["no", "Absent"], dinner: ["no", "Absent"] },
        {
            household: "Inès & Karim",
            ceremony: ["wait", "Non ouvert"],
            dinner: ["wait", "Non ouvert"],
        },
    ];

const chipStyle: Record<Status, string> = {
    yes: "bg-wed-yes-bg text-wed-yes",
    wait: "bg-wed-wait-bg text-wed-wait",
    no: "bg-wed-line-soft text-wed-ink-soft",
};

const Chip = ({ status, label }: { status: Status; label: string }) => (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs", chipStyle[status])}>
        {label}
    </span>
);

/** A static preview of the couple's dashboard: illustrative figures only. */
const DashboardPreview = () => (
    <figure className="border-wed-night-line bg-wed-paper text-wed-ink overflow-hidden rounded-lg border">
        <figcaption className="bg-wed-line-soft text-wed-muted flex h-9 items-center gap-1.5 px-3.5 text-xs">
            <span aria-hidden="true" className="bg-wed-line size-2.5 rounded-full" />
            <span aria-hidden="true" className="bg-wed-line size-2.5 rounded-full" />
            <span aria-hidden="true" className="bg-wed-line size-2.5 rounded-full" />
            <span className="ml-3">Aperçu du tableau de bord · Camille &amp; Hugo</span>
        </figcaption>
        <div className="p-4 md:p-6">
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {kpis.map((kpi) => (
                    <div
                        key={kpi.label}
                        className="border-wed-line-soft bg-wed-ivory rounded-md border p-3.5"
                    >
                        <dt className="text-wed-muted text-[0.7rem] tracking-wider uppercase">
                            {kpi.label}
                        </dt>
                        <dd>
                            <span className="font-wed-serif block text-3xl leading-tight lining-nums">
                                {kpi.value}
                            </span>
                            <span className="text-wed-muted text-xs">{kpi.detail}</span>
                        </dd>
                    </div>
                ))}
            </dl>
            <table className="mt-4 w-full text-left text-sm">
                <thead className="text-wed-muted text-[0.7rem] tracking-wider uppercase">
                    <tr>
                        <th scope="col" className="py-2 font-normal">
                            Foyer
                        </th>
                        <th scope="col" className="py-2 font-normal">
                            Cérémonie
                        </th>
                        <th scope="col" className="hidden py-2 font-normal sm:table-cell">
                            Dîner
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.household} className="border-wed-line-soft border-t">
                            <td className="py-2.5 pr-2">{row.household}</td>
                            <td className="py-2.5 pr-2">
                                <Chip status={row.ceremony[0]} label={row.ceremony[1]} />
                            </td>
                            <td className="hidden py-2.5 sm:table-cell">
                                <Chip status={row.dinner[0]} label={row.dinner[1]} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </figure>
);

export const WeddingDashboard = ({ dashboard }: WeddingDashboardProps) => (
    <section
        aria-labelledby="tableau-de-bord-titre"
        className="bg-wed-night text-wed-night-text py-20 md:py-28"
    >
        <div className="mx-auto max-w-300 px-6">
            <SectionIntro content={dashboard} headingId="tableau-de-bord-titre" tone="dark" />
            <DashboardPreview />
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                    href="/mariage/demo/tableau-de-bord"
                    className="bg-wed-ivory text-wed-ink hover:bg-wed-paper inline-flex min-h-12 items-center gap-2 rounded-sm px-6 font-medium transition-colors"
                >
                    Essayer le tableau de bord
                    <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <p className="text-wed-night-muted text-sm">
                    Invités fictifs, gardés dans votre navigateur : rien n&apos;est envoyé.
                </p>
            </div>
            <ul className="mt-12 grid gap-8 md:grid-cols-3">
                {dashboard.points.map((point) => (
                    <li
                        key={point.title}
                        className="border-wed-night-line text-wed-night-muted border-t pt-5"
                    >
                        <h3 className="text-wed-night-text mb-1.5 font-medium">{point.title}</h3>
                        {point.text}
                    </li>
                ))}
            </ul>
        </div>
    </section>
);
