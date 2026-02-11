import type { Metadata } from "next";

import {
    LegalPageLayout,
    LegalSection,
} from "@/components/shared/legal-page-layout";

export const metadata: Metadata = {
    title: "Politique de Cookies | AlexDevLab",
    description:
        "Politique de cookies du site alexdevlab.com — utilisation des cookies, Vercel Analytics et gestion de vos préférences.",
};

export default function PolitiqueDeCookies() {
    return (
        <LegalPageLayout title="Politique de cookies" lastUpdated="11 février 2026">
            <LegalSection number="1" title="Qu'est-ce qu'un cookie ?">
                <p>
                    Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur,
                    tablette, smartphone) lors de la visite d&apos;un site web. Il permet au site de
                    mémoriser des informations sur votre visite, telles que vos préférences de
                    navigation, afin de faciliter vos visites ultérieures.
                </p>
            </LegalSection>

            <LegalSection number="2" title="Cookies utilisés sur ce site">
                <p>
                    Le site alexdevlab.com adopte une approche minimaliste en matière de cookies.
                    Nous n&apos;utilisons{" "}
                    <strong className="text-accent/80">
                        aucun cookie publicitaire, de tracking ou de profilage
                    </strong>
                    .
                </p>
                <p>
                    Seuls des cookies strictement nécessaires au fonctionnement technique du site
                    peuvent être utilisés (gestion de session, préférences d&apos;affichage). Ces
                    cookies sont indispensables et ne nécessitent pas votre consentement
                    conformément à la directive ePrivacy.
                </p>
            </LegalSection>

            <LegalSection number="3" title="Vercel Analytics">
                <p>
                    Ce site utilise{" "}
                    <strong className="text-accent/80">Vercel Analytics</strong>, une solution
                    d&apos;analyse de fréquentation respectueuse de la vie privée. Vercel Analytics
                    présente les caractéristiques suivantes :
                </p>
                <ul className="list-inside list-disc space-y-2 pl-1">
                    <li>
                        <strong className="text-accent/80">Aucun cookie déposé</strong> sur votre
                        terminal
                    </li>
                    <li>
                        <strong className="text-accent/80">Aucune donnée personnelle</strong>{" "}
                        identifiable collectée
                    </li>
                    <li>
                        <strong className="text-accent/80">Données agrégées et anonymisées</strong>{" "}
                        (pages visitées, durée de visite, type d&apos;appareil, pays)
                    </li>
                    <li>
                        Conforme au RGPD sans nécessiter de bandeau de consentement
                    </li>
                </ul>
            </LegalSection>

            <LegalSection number="4" title="Gestion des cookies">
                <p>
                    Vous pouvez à tout moment configurer votre navigateur pour accepter ou refuser
                    les cookies. Voici comment accéder aux paramètres selon votre navigateur :
                </p>
                <ul className="mt-3 space-y-3 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                            C
                        </span>
                        <span>
                            <strong className="text-accent/80">Chrome :</strong> Paramètres &gt;
                            Confidentialité et sécurité &gt; Cookies et autres données de sites
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                            F
                        </span>
                        <span>
                            <strong className="text-accent/80">Firefox :</strong> Paramètres &gt;
                            Vie privée et sécurité &gt; Cookies et données de sites
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                            S
                        </span>
                        <span>
                            <strong className="text-accent/80">Safari :</strong> Préférences &gt;
                            Confidentialité &gt; Gérer les données de sites web
                        </span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                            E
                        </span>
                        <span>
                            <strong className="text-accent/80">Edge :</strong> Paramètres &gt;
                            Confidentialité, recherche et services &gt; Cookies
                        </span>
                    </li>
                </ul>
                <p className="mt-4">
                    <strong className="text-accent/80">Note :</strong> la suppression ou le blocage
                    de certains cookies peut affecter le fonctionnement du site.
                </p>
            </LegalSection>

            <LegalSection number="5" title="Contact">
                <p>
                    Pour toute question relative à notre utilisation des cookies, vous pouvez nous
                    contacter à{" "}
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
