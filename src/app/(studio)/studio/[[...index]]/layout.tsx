import { ReactNode } from "react";

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
