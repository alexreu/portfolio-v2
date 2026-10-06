import { defaultWeddingService } from "@/content/wedding-service";

import type { WeddingService } from "./types";

type SectionKey = keyof WeddingService;

const sectionKeys = Object.keys(defaultWeddingService) as readonly SectionKey[];

/** A section counts as published only if none of its lists was left empty in the Studio. */
const isFilled = (section: unknown): boolean =>
    typeof section === "object" &&
    section !== null &&
    Object.values(section).every((value) => !Array.isArray(value) || value.length > 0);

const sectionFrom = (fromCms: Partial<WeddingService> | null, key: SectionKey) =>
    isFilled(fromCms?.[key]) ? fromCms?.[key] : defaultWeddingService[key];

/** Section by section: what is published in Sanity wins, the default fills the gaps. */
export const resolveWeddingService = (fromCms: Partial<WeddingService> | null): WeddingService =>
    Object.fromEntries(
        sectionKeys.map((key) => [key, sectionFrom(fromCms, key)]),
    ) as WeddingService;
