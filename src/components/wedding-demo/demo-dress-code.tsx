import Image from "next/image";

import { DemoHeading } from "./demo-heading";

type DemoDressCodeProps = {
    dressCode: {
        readonly title: string;
        readonly text: string;
        readonly palette: readonly { readonly name: string; readonly color: string }[];
        readonly notes: readonly string[];
    };
    photo: { readonly src: string; readonly alt: string };
};

/** The illustrated dress code of the Essentiel and Signature plans: text and colour palette. */
export const DemoDressCode = ({ dressCode, photo }: DemoDressCodeProps) => (
    <section
        id="dresscode"
        aria-labelledby="dresscode-titre"
        className="bg-demo-paper-2 scroll-mt-16 py-20 md:py-30"
    >
        <div className="mx-auto grid max-w-310 items-center gap-10 px-4 md:grid-cols-2 md:gap-18 md:px-7">
            <div>
                <DemoHeading
                    id="dresscode-titre"
                    number="04"
                    label="Dress code"
                    heading={{ text: dressCode.title, emphasis: "champêtre" }}
                />
                <p className="text-demo-ink-2 mt-5 max-w-[44ch]">{dressCode.text}</p>
                <ul aria-label="Palette conseillée" className="mt-8 grid grid-cols-5 gap-2.5">
                    {dressCode.palette.map((swatch) => (
                        <li key={swatch.name}>
                            <span
                                aria-hidden="true"
                                className="block aspect-[1/1.5] rounded-xs"
                                style={{ background: swatch.color }}
                            />
                            <span className="text-demo-muted mt-1.5 block text-sm">
                                {swatch.name}
                            </span>
                        </li>
                    ))}
                </ul>
                <ul className="text-demo-ink-2 mt-8 grid gap-2.5">
                    {dressCode.notes.map((note) => (
                        <li
                            key={note}
                            className="before:text-demo-earth-dark relative pl-5.5 before:absolute before:left-0 before:content-['—']"
                        >
                            {note}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="relative aspect-[4/5]">
                <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                />
            </div>
        </div>
    </section>
);
