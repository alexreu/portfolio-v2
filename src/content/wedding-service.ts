import type { WeddingService } from "@/lib/wedding-service/types";

/** Shown until the « Sites de mariage » document is published in Sanity. */
export const defaultWeddingService: WeddingService = {
    hero: {
        heading: {
            text: "Un site à votre image, de l'annonce au dernier souvenir.",
            emphasis: "de l'annonce",
        },
        lead: "Faire-part numérique, réponses de vos invités, infos du jour J et photos partagées. Un seul lien par foyer, un tableau de bord pour vous, un design qui n'existe qu'une fois.",
        facts: [
            { value: "30 s", label: "pour répondre" },
            { value: "0", label: "application à installer" },
            { value: "12 mois", label: "en ligne, domaine inclus" },
        ],
    },
    moments: {
        eyebrow: "L'expérience invité",
        heading: { text: "Quatre moments, un seul lien.", emphasis: "un seul lien." },
        intro: "Vos invités reçoivent un lien personnel. Il les accompagne de l'annonce jusqu'aux photos du lendemain, sans compte, sans mot de passe, sur le téléphone qu'ils ont en main.",
        items: [
            {
                when: "6 mois avant",
                title: "Le faire-part",
                text: "Une ouverture animée, leurs prénoms, la date. L'aperçu WhatsApp est déjà soigné.",
            },
            {
                when: "Jusqu'à la date limite",
                title: "La réponse en 30 secondes",
                text: "Le foyer est pré-rempli. Chacun répond pour chaque moment auquel il est invité, régime compris.",
            },
            {
                when: "Le jour J",
                title: "Le programme et les photos",
                text: "Horaires, lieux, dress code. Un QR code sur les tables, les photos arrivent dans votre galerie.",
            },
            {
                when: "Le lendemain",
                title: "Les souvenirs",
                text: "Une galerie privée, votre message de remerciement, tout reste en ligne une année.",
            },
        ],
    },
    demo: {
        couple: "Camille & Hugo",
        date: "12 juin 2027 · Domaine des Oliviers, Luberon",
        text: "Un mariage en trois temps — cérémonie, dîner, brunch — et une mise en page de magazine, des photos plein cadre, une calligraphie pour les prénoms.",
        highlights: [
            "Faire-part qui s'ouvre au prénom de l'invité",
            "Programme limité aux moments où l'on est convié",
            "Réponses par personne et par moment",
            "Le jour J : sa table, ce qui se passe maintenant, ses photos",
        ],
    },
    features: {
        eyebrow: "Ce qui est inclus",
        heading: {
            text: "Tout ce dont vos invités ont besoin, rien de plus.",
            emphasis: "rien de plus.",
        },
        intro: "Pas de liste de cadeaux imposée, pas de publicité, pas de thème vu cent fois. Les briques essentielles, conçues pour votre mariage.",
        items: [
            {
                title: "Faire-part numérique",
                text: "Ouverture animée, prénoms de l'invité, ajout au calendrier, aperçu soigné sur WhatsApp et iMessage.",
                availability: "Toutes formules",
            },
            {
                title: "Réponses des invités par lien personnel",
                text: "Un lien par foyer : noms pré-remplis, réponse par personne et par moment, régimes, modifiable jusqu'à la date limite.",
                availability: "Toutes formules",
            },
            {
                title: "Infos pratiques",
                text: "Programme, lieux avec itinéraire, dress code, questions fréquentes. Chacun ne voit que ce qui le concerne.",
                availability: "Toutes formules",
            },
            {
                title: "Galerie des invités",
                text: "Un QR code sur les tables, les photos arrivent sans application. Vous les retrouvez toutes et les téléchargez en un clic.",
                availability: "Essentiel et Signature",
            },
            {
                title: "Tableau de bord",
                text: "Qui a ouvert, qui a répondu, combien de végétariens. Export pour le traiteur, et vos textes, votre programme et vos dates modifiés par vous-mêmes.",
                availability: "Toutes formules",
            },
            {
                title: "Faire-part à imprimer",
                text: "Le faire-part en PDF avec son QR code, à faire imprimer où vous voulez. En Signature, un QR par foyer qui ouvre directement sa réponse, et chaque invité trouve sa table en scannant un QR code.",
                availability: "Essentiel et Signature",
            },
        ],
    },
    dashboard: {
        eyebrow: "Votre espace",
        heading: { text: "Vous, vous gardez la main.", emphasis: "vous gardez la main." },
        intro: "Fini le tableur partagé et les messages « tu as eu la réponse de tante Brigitte ? ». Les réponses tombent, le tableau se met à jour.",
        points: [
            {
                title: "Suivi en temps réel",
                text: "Ouverture du lien, réponse, modification : tout est horodaté.",
            },
            {
                title: "Relances sans gêne",
                text: "Un rappel automatique avant la date limite, seulement à ceux qui n'ont pas répondu.",
            },
            {
                title: "Export traiteur",
                text: "Effectifs par moment, régimes et enfants, en un clic.",
            },
        ],
    },
    steps: {
        eyebrow: "Comment ça se passe",
        heading: {
            text: "De notre premier appel à la mise en ligne.",
            emphasis: "à la mise en ligne.",
        },
        intro: "Idéalement 6 à 9 mois avant le mariage. Possible jusqu'à 2 mois avant, selon le planning.",
        items: [
            {
                title: "On se rencontre",
                text: "30 minutes en visio : votre mariage, vos envies, vos invités.",
                duration: "Gratuit",
            },
            {
                title: "Vous me racontez",
                text: "Un questionnaire, vos photos, vos textes et la liste des invités.",
                duration: "1 semaine",
            },
            {
                title: "Je propose",
                text: "Une direction visuelle et la page d'accueil. On ajuste ensemble.",
                duration: "1 semaine",
            },
            {
                title: "On met en ligne",
                text: "Votre domaine, vos liens personnels prêts à envoyer, le PDF à imprimer.",
                duration: "1 à 2 semaines",
            },
            {
                title: "Je reste là",
                text: "Ajustements, relances, support le jour J, galerie après la fête.",
                duration: "12 mois",
            },
        ],
    },
    pricing: {
        eyebrow: "Tarifs",
        heading: { text: "Trois formules, un même soin.", emphasis: "un même soin." },
        intro: "Domaine personnalisé et 12 mois d'hébergement inclus. Acompte de 40 % à la commande, solde à la mise en ligne.",
        plans: [
            {
                name: "Intime",
                tagline: "Annoncer votre mariage et recevoir les réponses.",
                price: 290,
                items: [
                    "Un design standard, à vos couleurs et photos",
                    "Faire-part animé à l'ouverture",
                    "Réponses des invités par lien personnel, pour tous vos moments",
                    "Notre histoire, programme, lieux, FAQ",
                    "Votre dress code en une ligne, bien visible",
                    "Questions de base : contraintes alimentaires, mot pour les mariés",
                    "Tableau de bord + export CSV",
                    "Textes, programme et dates modifiables par vous, à tout moment",
                    "Votre nom de domaine, 12 mois en ligne",
                    "1 aller-retour sur le design",
                ],
                delivery: "Livré en 10 jours",
                featured: false,
            },
            {
                name: "Essentiel",
                tagline: "Tout le parcours, jusqu'aux photos de vos invités.",
                price: 490,
                inherits: "Intime",
                items: [
                    "Galerie des invités par QR code",
                    "Vos propres questions aux invités",
                    "Compte à rebours et dress code illustrée (nuancier)",
                    "Relances automatiques avant la date limite",
                    "Faire-part PDF + QR code à imprimer",
                    "Design ajusté : palette, typos, mise en page",
                    "2 allers-retours sur le design",
                ],
                delivery: "Livré en 2 semaines",
                featured: false,
            },
            {
                name: "Signature",
                tagline: "Un univers créé pour vous, du faire-part au jour J.",
                price: 890,
                inherits: "Essentiel",
                items: [
                    "Un univers graphique créé pour vous, validé sur une planche d'inspiration",
                    "Animation du faire-part conçue pour vous",
                    "Plan de table numérique : chaque invité trouve sa table en scannant un QR code",
                    "Faire-part avec QR personnel par foyer",
                    "Co-gestion avec vos témoins ou votre wedding planner",
                    "3 allers-retours sur le design",
                ],
                delivery: "Livré en 3 semaines",
                featured: true,
            },
        ],
        options: [
            { label: "Vos propres questions aux invités (Intime)", price: "40 €" },
            { label: "Galerie invités (Intime)", price: "190 €" },
            { label: "Faire-part PDF + QR (Intime)", price: "60 €" },
            { label: "Plan de table numérique (Essentiel)", price: "150 €" },
            { label: "QR personnel par foyer (Intime, Essentiel)", price: "90 €" },
            { label: "Co-gestion (Intime, Essentiel)", price: "60 €" },
            { label: "Site bilingue", price: "150 €" },
            { label: "Prolongation du site", price: "49 € / an" },
            { label: "Livraison express", price: "150 €" },
        ],
        note: "TVA non applicable, art. 293 B du CGI. PACS, fiançailles, anniversaires : sur demande, à partir de la formule Intime.",
    },
    comparison: {
        eyebrow: "Comparatif",
        heading: { text: "Un modèle, ou votre site ?", emphasis: "ou votre site ?" },
        intro: "Les plateformes en ligne proposent des modèles, de la version gratuite avec publicité jusqu'à 300 €. Les agences, des budgets à quatre chiffres. Entre les deux : un design pensé pour vous et un seul interlocuteur.",
        rows: [
            {
                label: "Design",
                platforms: "Modèle parmi d'autres",
                agency: "Sur-mesure",
                us: "Pensé pour vous",
            },
            {
                label: "Lien personnel par foyer",
                platforms: "Selon la plateforme",
                agency: "Variable",
                us: "Toujours",
            },
            {
                label: "Publicité, upsell",
                platforms: "Souvent, sur les offres gratuites",
                agency: "Non",
                us: "Non",
            },
            {
                label: "Données hébergées en Europe",
                platforms: "Pas toujours",
                agency: "Variable",
                us: "Oui, purge programmée",
            },
            {
                label: "Votre nom de domaine",
                platforms: "En option payante",
                agency: "Oui",
                us: "Inclus",
            },
            {
                label: "Prix",
                platforms: "0 € à 300 €",
                agency: "2 500 € et plus",
                us: "290 € à 890 €",
            },
        ],
    },
    faq: {
        eyebrow: "Questions fréquentes",
        heading: { text: "Ce qu'on me demande souvent.", emphasis: "demande souvent." },
        items: [
            {
                question: "Et si un invité n'a pas de smartphone ?",
                answer: "Le faire-part papier fourni en PDF porte un QR code et l'adresse du site. Vous pouvez aussi saisir sa réponse vous-même depuis le tableau de bord.",
            },
            {
                question: "Nos invités doivent-ils créer un compte ?",
                answer: "Non. Chaque foyer reçoit un lien personnel qui l'identifie. Pour la galerie, un QR code suffit.",
            },
            {
                question: "Peut-on modifier le site après la mise en ligne ?",
                answer: "Oui. Textes, programme, horaires et dates se modifient depuis votre tableau de bord, à tout moment. Pour la FAQ ou un détail de mise en page, un message suffit, c'est inclus pendant toute la durée de mise en ligne.",
            },
            {
                question: "Que deviennent les données de nos invités ?",
                answer: "Elles sont hébergées en Europe, jamais revendues, et supprimées trois mois après le mariage. Vous recevez un export complet avant.",
            },
            {
                question: "Le nom de domaine nous appartient-il ?",
                answer: "Il est réservé et renouvelé par mes soins pendant le contrat, puis transférable à votre nom sur simple demande.",
            },
            {
                question: "Combien de temps à l'avance faut-il s'y prendre ?",
                answer: "Idéalement 6 à 9 mois avant, pour envoyer les liens 4 à 6 mois avant la date. Minimum 2 mois.",
            },
        ],
    },
};
