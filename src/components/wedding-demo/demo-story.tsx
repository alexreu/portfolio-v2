import Image from "next/image";

import { DemoHeading } from "./demo-heading";

type DemoStoryProps = {
    story: {
        readonly heading: string;
        readonly lede: string;
        readonly paragraphs: readonly string[];
        readonly photos: readonly {
            readonly src: string;
            readonly alt: string;
            readonly caption: string;
        }[];
    };
};

export const DemoStory = ({ story }: DemoStoryProps) => (
    <section id="histoire" aria-labelledby="histoire-titre" className="scroll-mt-16 py-20 md:py-30">
        <div className="mx-auto grid max-w-310 gap-6 px-4 md:grid-cols-[5fr_7fr] md:gap-18 md:px-7">
            <div>
                <DemoHeading
                    id="histoire-titre"
                    number="01"
                    label="Notre histoire"
                    heading={{ text: story.heading, emphasis: "deux villes," }}
                />
                <div className="mt-10 grid grid-cols-2 gap-4">
                    {story.photos.map((photo, index) => (
                        <figure key={photo.caption} className={index === 0 ? "mt-15" : undefined}>
                            <div className="relative aspect-[3/4]">
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    sizes="(min-width: 768px) 20vw, 45vw"
                                    className="object-cover"
                                />
                            </div>
                            <figcaption className="text-demo-muted mt-2 text-sm italic">
                                {photo.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
            <div>
                <p className="font-demo-serif first-letter:text-demo-earth-dark mt-7 text-[clamp(1.6rem,2.6vw,2.25rem)] leading-snug first-letter:float-left first-letter:mt-1.5 first-letter:mr-2.5 first-letter:text-[3.2em] first-letter:leading-[0.8] first-letter:italic">
                    {story.lede}
                </p>
                <div className="text-demo-ink-2 mt-7 gap-10 space-y-4 md:columns-2 md:space-y-0">
                    {story.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="md:mb-4 md:break-inside-avoid">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    </section>
);
