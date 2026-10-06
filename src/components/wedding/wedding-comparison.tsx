import type { WeddingService } from "@/lib/wedding-service/types";

import { SectionIntro } from "./section-intro";

type WeddingComparisonProps = {
    comparison: WeddingService["comparison"];
};

export const WeddingComparison = ({ comparison }: WeddingComparisonProps) => (
    <section aria-labelledby="comparatif-titre" className="py-20 md:py-28">
        <div className="mx-auto max-w-300 px-6">
            <SectionIntro content={comparison} headingId="comparatif-titre" />
            <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-left text-[0.95rem]">
                    <thead className="text-wed-muted text-xs tracking-[0.12em] uppercase">
                        <tr className="border-wed-line border-b">
                            <td className="p-3" />
                            <th scope="col" className="p-3 font-medium">
                                Plateformes en ligne
                            </th>
                            <th scope="col" className="p-3 font-medium">
                                Agence événementielle
                            </th>
                            <th scope="col" className="bg-wed-paper text-wed-ink p-3 font-medium">
                                AlexDevLab
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparison.rows.map((row) => (
                            <tr key={row.label} className="border-wed-line border-b">
                                <th scope="row" className="text-wed-ink-soft p-3 font-normal">
                                    {row.label}
                                </th>
                                <td className="p-3">{row.platforms}</td>
                                <td className="p-3">{row.agency}</td>
                                <td className="bg-wed-paper p-3 font-medium">{row.us}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
);
