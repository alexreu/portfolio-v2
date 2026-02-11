import type { Metadata } from "next";

import {
    LegalPageLayout,
    LegalSection,
} from "@/components/shared/legal-page-layout";

export const metadata: Metadata = {
    title: "Mentions Légales | AlexDevLab",
    description:
        "Mentions légales du site alexdevlab.com — éditeur, hébergement, propriété intellectuelle et droit applicable.",
};

export default function MentionsLegales() {
    return (
        <LegalPageLayout title="Mentions légales" lastUpdated="11 février 2026">
            <LegalSection number="1" title="Éditeur du site">
                <p>Le site alexdevlab.com est édité par :</p>
                <ul className="list-inside list-disc space-y-1 pl-1">
                    <li>
                        <strong className="text-accent/80">Nom :</strong> Alexandre Adolphe
                    </li>
                    <li>
                        <strong className="text-accent/80">Nom commercial :</strong> Alex DevLab
                    </li>
                    <li>
                        <strong className="text-accent/80">Statut :</strong> Entrepreneur individuel
                    </li>
                    <li>
                        <strong className="text-accent/80">SIRET :</strong> 918 609 421 00014
                    </li>
                    <li>
                        <strong className="text-accent/80">SIREN :</strong> 918 609 421
                    </li>
                    <li>
                        <strong className="text-accent/80">Code APE :</strong> 6201Z — Programmation
                        informatique
                    </li>
                    <li>
                        <strong className="text-accent/80">N° TVA :</strong> FR75918609421
                    </li>
                    <li>
                        <strong className="text-accent/80">Adresse :</strong> 30 Rue Jean Marie
                        Tjibaou, 97441 Sainte-Suzanne, La Réunion
                    </li>
                    <li>
                        <strong className="text-accent/80">Email :</strong>{" "}
                        <a
                            href="mailto:contact@alexdevlab.com"
                            className="text-primary/80 hover:text-primary transition-colors"
                        >
                            contact@alexdevlab.com
                        </a>
                    </li>
                    <li>
                        <strong className="text-accent/80">Directeur de la publication :</strong>{" "}
                        Alexandre Adolphe
                    </li>
                </ul>
            </LegalSection>

            <LegalSection number="2" title="Hébergement">
                <p>Le site est hébergé par :</p>
                <ul className="list-inside list-disc space-y-1 pl-1">
                    <li>
                        <strong className="text-accent/80">Raison sociale :</strong> Vercel Inc.
                    </li>
                    <li>
                        <strong className="text-accent/80">Adresse :</strong> 440 N Barranca Avenue
                        #4133, Covina, CA 91723, États-Unis
                    </li>
                    <li>
                        <strong className="text-accent/80">Site web :</strong>{" "}
                        <a
                            href="https://vercel.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary/80 hover:text-primary transition-colors"
                        >
                            vercel.com
                        </a>
                    </li>
                </ul>
            </LegalSection>

            <LegalSection number="3" title="Propriété intellectuelle">
                <p>
                    L&apos;ensemble des contenus présents sur le site alexdevlab.com (textes,
                    images, graphismes, logo, icônes, code source, mise en page) sont protégés par
                    les lois françaises et internationales relatives à la propriété intellectuelle.
                </p>
                <p>
                    Toute reproduction, représentation, modification, publication ou adaptation de
                    tout ou partie des éléments du site est interdite sans l&apos;accord préalable
                    écrit de l&apos;éditeur, à l&apos;exception de l&apos;usage strictement
                    personnel et privé.
                </p>
            </LegalSection>

            <LegalSection number="4" title="Limitation de responsabilité">
                <p>
                    L&apos;éditeur s&apos;efforce de fournir des informations aussi précises que
                    possible. Toutefois, il ne saurait être tenu responsable des omissions, des
                    inexactitudes ou des carences dans la mise à jour des informations diffusées sur
                    ce site, qu&apos;elles soient de son fait ou du fait de tiers.
                </p>
                <p>
                    L&apos;utilisation des informations et contenus disponibles sur le site se fait
                    sous l&apos;entière et seule responsabilité de l&apos;utilisateur.
                </p>
            </LegalSection>

            <LegalSection number="5" title="Liens hypertextes">
                <p>
                    Le site alexdevlab.com peut contenir des liens vers d&apos;autres sites
                    internet. L&apos;éditeur n&apos;exerce aucun contrôle sur le contenu de ces
                    sites tiers et décline toute responsabilité quant à leur contenu ou aux
                    éventuels dommages pouvant résulter de leur consultation.
                </p>
            </LegalSection>

            <LegalSection number="6" title="Droit applicable">
                <p>
                    Le présent site et ses conditions d&apos;utilisation sont régis par le droit
                    français. En cas de litige, et après tentative de résolution amiable, les
                    tribunaux français seront seuls compétents.
                </p>
            </LegalSection>
        </LegalPageLayout>
    );
}
