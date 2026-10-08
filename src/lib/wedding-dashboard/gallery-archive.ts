import { slugOf } from "./drafts";
import type { GalleryPhoto, InvitationDesign } from "./types";

export type ArchiveFile = { readonly name: string; readonly url: string };

export type GalleryArchive = { readonly filename: string; readonly files: readonly ArchiveFile[] };

/** Large enough to print a 20 × 30 photo, small enough to download the whole day at once. */
const KEPT_WIDTH = "2400";

const sized = (src: string) => {
    const url = new URL(src);
    url.searchParams.set("auto", "compress");
    url.searchParams.set("w", KEPT_WIDTH);
    return url.toString();
};

/**
 * The photos still in the gallery, to download in one archive: numbered in the gallery's order
 * and named after whoever shared them, "01-lea.jpg". Removed photos stay out.
 */
export const galleryArchive = (
    design: Pick<InvitationDesign, "first" | "second">,
    photos: readonly GalleryPhoto[],
): GalleryArchive => {
    const kept = photos.filter((photo) => !photo.removed);
    const digits = Math.max(2, String(kept.length).length);
    return {
        filename: `photos-${slugOf(`${design.first} ${design.second}`) || "mariage"}.zip`,
        files: kept.map((photo, index) => ({
            name: `${String(index + 1).padStart(digits, "0")}-${slugOf(photo.author) || "photo"}.jpg`,
            url: sized(photo.src),
        })),
    };
};
