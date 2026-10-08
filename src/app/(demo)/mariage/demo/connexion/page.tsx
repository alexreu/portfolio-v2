import type { Metadata } from "next";

import { buildPageMetadata, weddingDemoImage } from "@/lib/seo";
import { SignInPage } from "@/components/wedding-dashboard/sign-in-page";
import { cormorant } from "@/app/fonts/wedding";

/** The couple's sign-in, simulated: shown, not indexed. */
export const metadata: Metadata = {
    ...buildPageMetadata({
        title: "Connexion · démo du tableau de bord des mariés",
        description:
            "Démo de la connexion des mariés à leur tableau de bord : un lien par e-mail, sans mot de passe, réservé aux adresses connues.",
        path: "/mariage/demo/connexion",
        image: weddingDemoImage,
    }),
    robots: { index: false, follow: true },
};

export default function DashboardSignInPage() {
    return (
        <div className={`${cormorant.variable} bg-wed-ivory text-wed-ink font-main min-h-dvh`}>
            <SignInPage />
        </div>
    );
}
