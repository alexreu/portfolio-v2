import type { ReactNode } from "react";
import Link from "next/link";

type GuestPageFrameProps = {
    couple: string;
    /** "Samedi 12 juin 2027 · Luberon" */
    when: string;
    /** What this page shows in the demo, and what changes on a real site. */
    demoNote: ReactNode;
    children: ReactNode;
};

/**
 * A page reached by a QR code printed for the day: the couple's names, then one thing to do.
 * No menu and no faire-part, nothing that leads elsewhere on the site.
 */
export const GuestPageFrame = ({ couple, when, demoNote, children }: GuestPageFrameProps) => (
    <>
        <header className="border-demo-line border-b px-4 py-5 text-center">
            <p className="font-demo-script text-4xl leading-tight">{couple}</p>
            <p className="text-demo-muted mt-1 text-sm">{when}</p>
        </header>
        <main id="top" className="mx-auto w-full max-w-180 px-4 pt-8 pb-16 md:px-7">
            {children}
        </main>
        <footer className="border-demo-line text-demo-muted border-t px-4 pt-6 pb-10 text-center text-[0.8rem]">
            <p className="mx-auto max-w-[60ch]">{demoNote}</p>
            <p className="mt-3 flex flex-wrap justify-center gap-4.5">
                <Link
                    href="/mariage/demo/tableau-de-bord"
                    className="inline-flex min-h-11 items-center underline underline-offset-4"
                >
                    Côté mariés : le tableau de bord
                </Link>
                <Link
                    href="/mariage"
                    className="inline-flex min-h-11 items-center underline underline-offset-4"
                >
                    Site conçu par AlexDevLab
                </Link>
            </p>
        </footer>
    </>
);
