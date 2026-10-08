import type { GuestQuestion, Invitation, Moment, WeddingDay } from "@alexreu/wedding-core";

import { weddingPhotos } from "./wedding-photos";

/** Fictional couple used to show the service: Camille & Hugo, as seen by Marie & Thomas. */
export const weddingDemo = {
    couple: { first: "Camille", second: "Hugo", monogram: "C & H" },
    dateLabel: "Samedi 12 juin 2027",
    shortDateLabel: "12 juin 2027 · Luberon",
    venue: "Domaine des Oliviers · Lourmarin, Vaucluse",
    ceremonyAt: "2027-06-12T16:00:00+02:00",
    answerDeadline: "1er mai 2027",
    galleryOpensLabel: "vendredi 11 juin à 10 h",
    day: {
        startsAt: "2027-06-12T08:00:00+02:00",
        endsAt: "2027-06-13T15:00:00+02:00",
    } satisfies WeddingDay,
    /** Clock used by the « Aperçu jour J » preview: during the vin d'honneur. */
    dayPreviewAt: "2027-06-12T18:10:00+02:00",
    household: {
        name: "Marie & Thomas",
        signature: "Marie Lefèvre",
        table: { number: 7, name: "Les Oliviers" },
        /** Agreed with each guest: "Présente" for Marie, "Présent" for Thomas. */
        presenceLabels: {
            marie: { yes: "Présente", no: "Absente" },
            thomas: { yes: "Présent", no: "Absent" },
        },
        invitation: {
            guests: [
                { id: "marie", firstName: "Marie" },
                { id: "thomas", firstName: "Thomas" },
            ],
            momentKeys: ["ceremonie-vin-honneur", "diner", "brunch"],
        } satisfies Invitation,
    },
    story: {
        heading: "Huit ans, deux villes, un oui.",
        lede: "On s'est rencontrés à une terrasse d'Arles, un soir de rencontres photographiques, en se disputant la dernière chaise. Hugo l'a gardée. Camille a gardé Hugo.",
        paragraphs: [
            "Il y a eu Lyon, puis Lisbonne, puis Lyon à nouveau. Un appartement trop petit, un chat trop grand, et beaucoup de dimanches au marché de la Croix-Rousse.",
            "Au printemps dernier, sur un chemin du Luberon, Hugo a fait sa demande avec une bague cachée dans une boîte de calissons. Camille a dit oui, la bouche pleine.",
            "Nous avons choisi le Domaine des Oliviers pour sa cour en pierre, ses platanes et la lumière de juin. Il ne manque plus que vous.",
        ],
        photos: [
            { ...weddingPhotos.backToBack, caption: "Arles, 2019" },
            { ...weddingPhotos.blackAndWhite, caption: "Les fiançailles, 2026" },
        ],
    },
    moments: [
        {
            key: "ceremonie-vin-honneur",
            title: "Cérémonie & vin d'honneur",
            slots: [
                {
                    title: "Cérémonie laïque",
                    place: "Sous les platanes · Domaine des Oliviers",
                    startsAt: "2027-06-12T16:00:00+02:00",
                },
                {
                    title: "Vin d'honneur",
                    place: "La cour en pierre · Domaine des Oliviers",
                    startsAt: "2027-06-12T17:30:00+02:00",
                    endsAt: "2027-06-12T19:30:00+02:00",
                },
            ],
        },
        {
            key: "diner",
            title: "Dîner & soirée",
            slots: [
                {
                    title: "Dîner",
                    place: "L'orangerie · Domaine des Oliviers",
                    startsAt: "2027-06-12T20:00:00+02:00",
                },
                {
                    title: "Ouverture du bal",
                    place: "Jusqu'au bout de la nuit",
                    startsAt: "2027-06-12T23:00:00+02:00",
                    endsAt: "2027-06-13T04:00:00+02:00",
                },
            ],
        },
        {
            key: "brunch",
            title: "Brunch",
            slots: [
                {
                    title: "Brunch au bord de la piscine",
                    place: "Tenue détendue, maillot conseillé",
                    startsAt: "2027-06-13T11:00:00+02:00",
                    endsAt: "2027-06-13T15:00:00+02:00",
                },
            ],
        },
    ] satisfies readonly Moment[],
    /** The couple's own questions, answered once per household. */
    questions: [
        {
            id: "chanson",
            label: "Une chanson qui vous fera danser",
            placeholder: "Artiste — titre",
        },
    ] satisfies readonly GuestQuestion[],
    places: [
        {
            name: "Domaine des Oliviers",
            address: "Route de Vaugines, 84160 Lourmarin",
            note: "Parking sur place · navettes non prévues",
            photo: weddingPhotos.table,
            /** Fictional estate, placed on the road from Lourmarin to Vaugines. */
            coordinates: { lat: 43.7652, lng: 5.3735 },
        },
    ],
    dressCode: {
        title: "Chic champêtre",
        text: "Des matières légères, des tons de terre et d'olivier. La cérémonie a lieu sur l'herbe : on oublie les talons fins.",
        /** The couple's palette: content, not interface colours. */
        palette: [
            { name: "Olivier", color: "#5E6B4E" },
            { name: "Terre", color: "#B08A6A" },
            { name: "Lin", color: "#D9C9AE" },
            { name: "Sauge", color: "#8C9A86" },
            { name: "Encre", color: "#3F3A33" },
        ],
        notes: [
            "Le blanc et l'ivoire sont réservés à la mariée",
            "Une petite laine pour la soirée, les nuits sont fraîches",
            "Brunch : tenue détendue et maillot de bain",
        ],
    },
    faq: [
        {
            question: "Les enfants sont-ils les bienvenus ?",
            answer: "Oui ! Un espace avec une animatrice est prévu pendant le dîner. Indiquez leur âge dans votre réponse.",
        },
        {
            question: "Peut-on venir accompagné ?",
            answer: "Les invitations sont nominatives. Si votre lien prévoit un accompagnant, son nom vous sera demandé dans le formulaire.",
        },
        {
            question: "Y a-t-il un parking ?",
            answer: "Oui, 120 places sur le domaine. Pensez au covoiturage : les chemins sont étroits.",
        },
        {
            question: "Qui contacter le jour J ?",
            answer: "Nos témoins, Léa et Karim, dont les numéros figurent sur votre faire-part. Pas les mariés, ils seront occupés.",
        },
    ],
    gallery: {
        count: 1248,
        photos: [
            { ...weddingPhotos.embrace, author: "Léa" },
            { ...weddingPhotos.bouquets, author: "Thomas" },
            { ...weddingPhotos.veil, author: "Inès" },
            { ...weddingPhotos.banquet, author: "Julien" },
            { ...weddingPhotos.sea, author: "Marie" },
            { ...weddingPhotos.centrepiece, author: "Karim" },
            { ...weddingPhotos.kiss, author: "Sophie" },
            { ...weddingPhotos.roses, author: "Hugo" },
        ],
    },
    heroPhoto: weddingPhotos.arch,
    dressPhoto: weddingPhotos.courtyard,
} as const;
