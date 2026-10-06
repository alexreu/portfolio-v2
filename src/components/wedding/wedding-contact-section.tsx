import { Suspense } from "react";
import { Check } from "lucide-react";

import { WeddingContactForm } from "./wedding-contact";

const reassurances = [
    "Premier échange gratuit, sans engagement",
    "Rétractation de 14 jours",
    "Un seul interlocuteur, du début à la fin",
];

export const WeddingContactSection = () => (
    <section
        id="contact"
        aria-labelledby="contact-titre"
        className="bg-wed-night text-wed-night-text scroll-mt-20 py-20 md:py-28"
    >
        <div className="mx-auto grid max-w-300 items-start gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-18">
            <div>
                <p className="text-wed-gold-soft text-xs font-medium tracking-[0.18em] uppercase">
                    Parlons de votre mariage
                </p>
                <h2
                    id="contact-titre"
                    className="font-wed-serif mt-3 text-5xl leading-[1.05] font-normal md:text-6xl"
                >
                    Racontez-moi <em className="text-wed-gold-soft italic">votre jour.</em>
                </h2>
                <p className="text-wed-night-muted mt-5 max-w-[48ch] text-lg">
                    Je réponds sous 48 heures avec une première idée de direction et une date pour
                    en parler de vive voix.
                </p>
                <ul className="text-wed-night-muted mt-10 grid gap-3.5">
                    {reassurances.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                            <Check
                                aria-hidden="true"
                                className="text-wed-gold-soft size-4.5 shrink-0"
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <Suspense>
                <WeddingContactForm />
            </Suspense>
        </div>
    </section>
);
