import { describe, expect, it } from "vitest";

import { galleryArchive } from "./gallery-archive";

const photo = (id: string, author: string, removed = false) => ({
    id,
    src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`,
    alt: "",
    author,
    removed,
});

describe("galleryArchive", () => {
    it("names each photo kept in the gallery after its author, in order", () => {
        const archive = galleryArchive({ first: "Camille", second: "Hugo" }, [
            photo("1", "Léa"),
            photo("2", "Thomas", true),
            photo("3", "Léa"),
            photo("4", "李"),
        ]);

        expect(archive.filename).toBe("photos-camille-hugo.zip");
        expect(archive.files.map((file) => file.name)).toEqual([
            "01-lea.jpg",
            "02-lea.jpg",
            "03-photo.jpg",
        ]);
        expect(archive.files[0].url).toContain("pexels-photo-1.jpeg");
    });

    it("asks for a size fit to keep and print, not the full camera file", () => {
        const [file] = galleryArchive({ first: "A", second: "B" }, [photo("1", "Léa")]).files;

        expect(new URL(file.url).searchParams.get("w")).toBe("2400");
    });
});
