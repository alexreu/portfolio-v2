import type { Metadata } from "next";

import {
    LegalPageLayout,
    LegalSection,
} from "@/components/shared/legal-page-layout";

export const metadata: Metadata = {
    title: "Politique de Confidentialité | AlexDevLab",
    description:
        "Politique de confidentialité du site alexdevlab.com — traitement des données personnelles, droits RGPD et cookies.",
};

export default function PolitiqueDeConfidentialite() {
    return (
        <LegalPageLayout
            title="Politique de confidentialité"
            lastUpdated="11 février 2026"
        >
            <LegalSection number="1" title="Responsable du traitement">
                <p>
                    Le responsable du traitement des données personnelles collectées sur le site
                    alexdevlab.com est :
                </p>
                <ul className="list-inside list-disc space-y-1 pl-1">
                    <li>
                        <strong className="text-accent/80">Nom :</strong> Alexandre Adolphe (Alex
                        DevLab)
                    </li>
                    <li>
                        <strong className="text-accent/80">SIRET :</strong> 918 609 421 00014
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
                        <strong className="text-accent/80">Site :</strong> alexdevlab.com
                    </li>
                </ul>
            </LegalSection>

            <LegalSection number="2" title="Données collectées">
                <p>Nous collectons les données suivantes dans le cadre du fonctionnement du site :</p>

                <h3 className="text-accent/90 mt-4 text-base font-semibold">
                    Formulaire de contact
                </h3>
                <p>
                    Lorsque vous utilisez le formulaire de contact, les données suivantes sont
                    collectées : prénom, nom, adresse email, objet du message et contenu du message.
                </p>

                <h3 className="text-accent/90 mt-4 text-base font-semibold">Vercel Analytics</h3>
                <p>
                    Ce site utilise Vercel Analytics, une solution d&apos;analyse respectueuse de la
                    vie privée. Les données collectées sont anonymisées et agrégées : pages
                    visitées, durée de visite, type d&apos;appareil et pays d&apos;origine. Vercel
                    Analytics{" "}
                    <strong className="text-accent/80">ne dépose aucun cookie</strong> et ne
                    collecte aucune donnée personnelle identifiable.
                </p>

                <h3 className="text-accent/90 mt-4 text-base font-semibold">Adresse IP</h3>
                <p>
                    Votre adresse IP est utilisée temporairement (quelques minutes) dans le cadre du
                    mécanisme de limitation de débit (rate limiting) pour protéger le site contre les
                    abus. Cette donnée est stockée en mémoire volatile et n&apos;est jamais
                    enregistrée de manière persistante.
                </p>
            </LegalSection>

            <LegalSection number="3" title="Finalités du traitement">
                <ul className="list-inside list-disc space-y-2 pl-1">
                    <li>
                        <strong className="text-accent/80">Formulaire de contact :</strong> répondre
                        à vos demandes et gérer la relation commerciale
                    </li>
                    <li>
                        <strong className="text-accent/80">Analytics :</strong> améliorer
                        l&apos;expérience utilisateur et analyser la fréquentation du site
                    </li>
                    <li>
                        <strong className="text-accent/80">Rate limiting :</strong> protéger le site
                        contre les abus et le spam
                    </li>
                </ul>
            </LegalSection>

            <LegalSection number="4" title="Base légale du traitement">
                <ul className="list-inside list-disc space-y-2 pl-1">
                    <li>
                        <strong className="text-accent/80">Formulaire de contact :</strong> votre
                        consentement (article 6.1.a du RGPD) et l&apos;exécution de mesures
                        précontractuelles (article 6.1.b)
                    </li>
                    <li>
                        <strong className="text-accent/80">Analytics :</strong> intérêt légitime
                        (article 6.1.f) — amélioration continue du site
                    </li>
                    <li>
                        <strong className="text-accent/80">Rate limiting :</strong> intérêt légitime
                        (article 6.1.f) — sécurité du site
                    </li>
                </ul>
            </LegalSection>

            <LegalSection number="5" title="Durée de conservation">
                <ul className="list-inside list-disc space-y-2 pl-1">
                    <li>
                        <strong className="text-accent/80">
                            Données du formulaire de contact :
                        </strong>{" "}
                        3 ans à compter du dernier contact
                    </li>
                    <li>
                        <strong className="text-accent/80">Données d&apos;analytics :</strong> 24
                        mois (données agrégées et anonymisées)
                    </li>
                    <li>
                        <strong className="text-accent/80">Adresses IP (rate limiting) :</strong>{" "}
                        quelques minutes (stockage en mémoire volatile uniquement)
                    </li>
                </ul>
            </LegalSection>

            <LegalSection number="6" title="Destinataires des données">
                <p>Vos données peuvent être transmises aux sous-traitants suivants :</p>
                <ul className="list-inside list-disc space-y-2 pl-1">
                    <li>
                        <strong className="text-accent/80">Vercel Inc.</strong> (hébergement et
                        analytics) — États-Unis
                    </li>
                    <li>
                        <strong className="text-accent/80">
                            Postmark / ActiveCampaign LLC
                        </strong>{" "}
                        (envoi d&apos;emails via le formulaire de contact) — États-Unis
                    </li>
                </ul>
                <p>
                    Ces transferts internationaux sont encadrés par des clauses contractuelles types
                    (CCT) conformes au RGPD, garantissant un niveau de protection adéquat de vos
                    données.
                </p>
            </LegalSection>

            <LegalSection number="7" title="Vos droits">
                <p>
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous
                    disposez des droits suivants :
                </p>
                <ul className="list-inside list-disc space-y-2 pl-1">
                    <li>
                        <strong className="text-accent/80">Droit d&apos;accès</strong> à vos données
                        personnelles
                    </li>
                    <li>
                        <strong className="text-accent/80">Droit de rectification</strong> des
                        données inexactes ou incomplètes
                    </li>
                    <li>
                        <strong className="text-accent/80">Droit à l&apos;effacement</strong> (droit
                        à l&apos;oubli)
                    </li>
                    <li>
                        <strong className="text-accent/80">Droit à la limitation</strong> du
                        traitement
                    </li>
                    <li>
                        <strong className="text-accent/80">Droit à la portabilité</strong> de vos
                        données
                    </li>
                    <li>
                        <strong className="text-accent/80">Droit d&apos;opposition</strong> au
                        traitement
                    </li>
                </ul>
                <p>
                    Pour exercer ces droits, contactez-nous à{" "}
                    <a
                        href="mailto:contact@alexdevlab.com"
                        className="text-primary/80 hover:text-primary transition-colors"
                    >
                        contact@alexdevlab.com
                    </a>
                    . Nous nous engageons à répondre dans un délai d&apos;un mois.
                </p>
                <p>
                    Vous disposez également du droit d&apos;introduire une réclamation auprès de la{" "}
                    <a
                        href="https://www.cnil.fr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/80 hover:text-primary transition-colors"
                    >
                        CNIL
                    </a>{" "}
                    (Commission Nationale de l&apos;Informatique et des Libertés).
                </p>
            </LegalSection>

            <LegalSection number="8" title="Sécurité des données">
                <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                    pour protéger vos données personnelles contre tout accès non autorisé,
                    modification, divulgation ou destruction, notamment :
                </p>
                <ul className="list-inside list-disc space-y-1 pl-1">
                    <li>Chiffrement des communications via HTTPS/TLS</li>
                    <li>Validation et assainissement des entrées utilisateur</li>
                    <li>Limitation du débit (rate limiting) contre les abus</li>
                    <li>Hébergement sécurisé chez Vercel</li>
                </ul>
            </LegalSection>

            <LegalSection number="9" title="Modifications">
                <p>
                    Nous nous réservons le droit de modifier la présente politique de confidentialité
                    à tout moment. Les modifications seront publiées sur cette page avec mise à jour
                    de la date indiquée en haut du document. Nous vous invitons à consulter
                    régulièrement cette page.
                </p>
            </LegalSection>

            <LegalSection number="10" title="Contact">
                <p>
                    Pour toute question relative à la présente politique de confidentialité ou au
                    traitement de vos données personnelles, vous pouvez nous contacter à{" "}
                    <a
                        href="mailto:contact@alexdevlab.com"
                        className="text-primary/80 hover:text-primary transition-colors"
                    >
                        contact@alexdevlab.com
                    </a>
                    .
                </p>
            </LegalSection>
        </LegalPageLayout>
    );
}
