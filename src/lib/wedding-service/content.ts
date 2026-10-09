import { defaultWeddingService } from "@/content/wedding-service";

import type { WeddingService, WeddingServiceFromCms } from "./types";

type SectionKey = keyof WeddingService;

const sectionKeys = Object.keys(defaultWeddingService) as readonly SectionKey[];

/** A section counts as published only if none of its lists was left empty in the Studio. */
const isFilled = (section: unknown): boolean =>
    typeof section === "object" &&
    section !== null &&
    Object.values(section).every((value) => !Array.isArray(value) || value.length > 0);

const sectionFrom = (fromCms: WeddingServiceFromCms | null, key: SectionKey) =>
    isFilled(fromCms?.[key]) ? fromCms?.[key] : defaultWeddingService[key];

/** The photo comes on its own in the Studio: until it is uploaded, the default one stays. */
const withPhoto = (about: NonNullable<WeddingServiceFromCms["about"]>): WeddingService["about"] =>
    about.photo?.src
        ? { ...about, photo: { src: about.photo.src, alt: about.photo.alt ?? "" } }
        : { ...about, photo: defaultWeddingService.about.photo };

/** Section by section: what is published in Sanity wins, the default fills the gaps. */
export const resolveWeddingService = (fromCms: WeddingServiceFromCms | null): WeddingService => {
    const resolved = Object.fromEntries(
        sectionKeys.map((key) => [key, sectionFrom(fromCms, key)]),
    ) as WeddingService & { readonly about: NonNullable<WeddingServiceFromCms["about"]> };
    return { ...resolved, about: withPhoto(resolved.about) };
};
