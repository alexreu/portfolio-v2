"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { weddingDemo } from "@/content/wedding-demo";

import { signPhoto } from "@/lib/wedding/photo-signature";
import { programmeAt } from "@/lib/wedding/programme";
import { siteModeAt } from "@/lib/wedding/site-mode";

import { AnswerForm } from "./answer-form";
import { DayPanel } from "./day-panel";
import { DemoDressCode } from "./demo-dress-code";
import { DemoFaq } from "./demo-faq";
import { DemoGallery } from "./demo-gallery";
import { DemoHeading } from "./demo-heading";
import { DemoHero } from "./demo-hero";
import { DemoNav } from "./demo-nav";
import { DemoPlaces } from "./demo-places";
import { DemoProgramme } from "./demo-programme";
import { DemoStory } from "./demo-story";
import { DemoTabBar } from "./demo-tab-bar";
import { InvitationOverlay } from "./invitation-overlay";
import { UploadSheet } from "./upload-sheet";

const { couple, household } = weddingDemo;

const invitedMoments = weddingDemo.moments.filter((moment) =>
    household.invitation.momentKeys.includes(moment.key),
);

const photoSignature = signPhoto({ householdName: household.signature, typedFirstName: "" });

/**
 * Camille & Hugo's site as Marie & Thomas see it through their personal link.
 * `?skip` skips the faire-part, `?jourj` opens the wedding-day preview.
 */
type DemoSiteProps = {
    /** `?skip`: straight to the site, without the faire-part. */
    skipInvitation: boolean;
    /** `?jourj`: open on the wedding-day preview. */
    startOnWeddingDay: boolean;
};

export const DemoSite = ({ skipInvitation, startOnWeddingDay }: DemoSiteProps) => {
    const [opened, setOpened] = useState(skipInvitation || startOnWeddingDay);
    const [previewDay, setPreviewDay] = useState(startOnWeddingDay);
    const [answered, setAnswered] = useState(false);
    const [uploading, setUploading] = useState(false);
    const openUpload = useCallback(() => setUploading(true), []);
    const closeUpload = useCallback(() => setUploading(false), []);

    const mode = previewDay ? "day" : siteModeAt(weddingDemo.day, new Date());
    const programme = programmeAt(
        invitedMoments,
        mode === "day" ? new Date(weddingDemo.dayPreviewAt) : new Date(),
    );

    return (
        <>
            {!opened && (
                <InvitationOverlay
                    guestName={household.name}
                    first={couple.first}
                    second={couple.second}
                    dateLabel={`${weddingDemo.dateLabel} · Luberon`}
                    onOpened={() => setOpened(true)}
                />
            )}
            <DemoNav
                monogram={couple.monogram}
                mode={mode}
                onTogglePreview={() => {
                    setPreviewDay((day) => !day);
                    window.scrollTo({ top: 0 });
                }}
            />
            <main id="top" className="pb-24 md:pb-0">
                {mode === "day" ? (
                    <DayPanel
                        guestName={household.name}
                        table={household.table}
                        programme={programme}
                        photoCount={weddingDemo.gallery.count}
                        onAddPhotos={openUpload}
                    />
                ) : (
                    <DemoHero
                        first={couple.first}
                        second={couple.second}
                        dateLabel={weddingDemo.dateLabel}
                        venue={weddingDemo.venue}
                        guestName={household.name}
                        ceremonyAt={weddingDemo.ceremonyAt}
                        photo={weddingDemo.heroPhoto}
                    />
                )}
                <DemoStory story={weddingDemo.story} />
                <DemoProgramme programme={programme} mode={mode} />
                <DemoPlaces places={weddingDemo.places} />
                <DemoDressCode dressCode={weddingDemo.dressCode} photo={weddingDemo.dressPhoto} />
                {mode === "before" && (
                    <section
                        id="rsvp"
                        aria-labelledby="rsvp-titre"
                        className="scroll-mt-16 py-20 md:py-30"
                    >
                        <div className="mx-auto grid max-w-310 items-start gap-8 px-4 md:grid-cols-[5fr_7fr] md:gap-18 md:px-7">
                            <div>
                                <DemoHeading
                                    id="rsvp-titre"
                                    number="05"
                                    label="Réponse"
                                    heading={{
                                        text: "Serez-vous des nôtres ?",
                                        emphasis: "des nôtres ?",
                                    }}
                                />
                                <p className="text-demo-ink-2 mt-5 max-w-[40ch]">
                                    Une réponse par personne et par moment. Vous pourrez la modifier
                                    avec ce même lien jusqu&apos;à la date limite.
                                </p>
                                <p className="bg-demo-card border-demo-line mt-7 inline-flex gap-2.5 border px-4 py-3">
                                    Date limite{" "}
                                    <strong className="font-demo-serif font-medium">
                                        {weddingDemo.answerDeadline}
                                    </strong>
                                </p>
                            </div>
                            <div className="bg-demo-card border-demo-line border p-5 md:p-9">
                                <AnswerForm
                                    householdName={household.name}
                                    invitation={household.invitation}
                                    moments={invitedMoments}
                                    presenceLabels={household.presenceLabels}
                                    answered={answered}
                                    onAnswered={setAnswered}
                                />
                            </div>
                        </div>
                    </section>
                )}
                <DemoGallery
                    mode={mode}
                    opensLabel={weddingDemo.galleryOpensLabel}
                    count={weddingDemo.gallery.count}
                    photos={weddingDemo.gallery.photos}
                    onAddPhotos={openUpload}
                />
                <DemoFaq items={weddingDemo.faq} />
            </main>
            <footer className="border-demo-line border-t px-4 pt-20 pb-28 text-center md:pb-10">
                <p className="font-demo-script text-5xl">
                    {couple.first} &amp; {couple.second}
                </p>
                <p className="text-demo-muted mt-2.5 text-sm">Nous avons hâte de vous voir.</p>
                <p className="text-demo-muted mt-10 flex flex-wrap justify-center gap-4.5 text-[0.8rem]">
                    <span>Vos données restent en Europe et sont supprimées après le mariage</span>
                    <Link
                        href="/mariage"
                        className="inline-flex min-h-11 items-center underline underline-offset-4"
                    >
                        Site conçu par AlexDevLab
                    </Link>
                    <span>Photos : Pexels</span>
                </p>
            </footer>
            <DemoTabBar mode={mode} answered={answered} onAddPhotos={openUpload} />
            {uploading && photoSignature.ok && (
                <UploadSheet signature={photoSignature.value} onClose={closeUpload} />
            )}
        </>
    );
};
