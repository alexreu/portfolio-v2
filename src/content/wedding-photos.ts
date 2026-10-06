/** Pexels photos used by the wedding page and its demo, hotlinked as Pexels asks. */
const pexels = (id: string, extension = "jpeg") =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${extension}`;

export const weddingPhotos = {
    arch: {
        src: pexels("9755935"),
        alt: "Camille et Hugo devant une fenêtre en arche baignée de lumière",
    },
    backToBack: { src: pexels("13765483"), alt: "Le couple dos à dos, en noir et blanc" },
    courtyard: { src: pexels("29175671"), alt: "Les mariés marchant dans une cour de pierre" },
    blackAndWhite: { src: pexels("36513942", "png"), alt: "Portrait du couple en noir et blanc" },
    table: { src: pexels("9342984"), alt: "Table dressée en plein air avec bouquets et verres" },
    embrace: { src: pexels("11813966"), alt: "Hugo serre Camille dans ses bras, ému" },
    bouquets: { src: pexels("18430845"), alt: "Bouquets sur la table du dîner" },
    veil: { src: pexels("32113387"), alt: "Les mariés sous le voile" },
    banquet: { src: pexels("6310593"), alt: "Table de banquet vue du dessus" },
    sea: { src: pexels("27529922"), alt: "Les mariés main dans la main face à la mer" },
    centrepiece: { src: pexels("17119950"), alt: "Centre de table fleuri" },
    kiss: { src: pexels("27826609"), alt: "Baiser sous le voile" },
    roses: { src: pexels("19869796"), alt: "Roses blanches sur une table en bois" },
} as const;
