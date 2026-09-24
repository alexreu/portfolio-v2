import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Studio",
    robots: { index: false, follow: false },
};

type Props = {
    children: ReactNode;
};
export default function StudioLayout({ children }: Props) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    );
}
