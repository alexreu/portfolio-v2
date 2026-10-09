# Service « Sites de mariage » — plan complet

> Statut : **cadrage**. Rien n'est implémenté. Ce document consigne les décisions
> prises le 2026-10-06 et sert de base aux maquettes de `./maquettes/`.

## 0. Décisions actées

| Sujet | Décision |
|---|---|
| Modèle de production | **Hybride** : socle technique commun + direction artistique par couple |
| Fonctionnalités | Faire-part numérique + RSVP, infos pratiques, galerie photos invités |
| Hors périmètre | Hébergements, transports, liste de mariage / cagnotte |
| Intégration portfolio | Carte bento sur la home + page dédiée `/mariage` |
| Univers de la page | **Rupture élégante** : ivoire, serif, doré — le portfolio sombre sert d'écrin |
| Tarifs | 3 formules : **Intime 290 € / Essentiel 490 € / Signature 890 €** ; l'ancien Prestige (1 690 €) est supprimé, ses briques passent en options |
| Suivi des réponses | **Tableau de bord mariés** (espace privé) |
| Accès invités | **Lien personnel par foyer**, sans mot de passe |
| Projet démo | Couple fictif, style **éditorial moderne** |
| Hébergement | **12 mois + nom de domaine perso inclus** |
| Périmètre événementiel | **Mariage d'abord**, PACS / fiançailles / anniversaires « sur demande » |
| Print | **PDF imprimable assorti + QR code** (pas d'impression gérée) |
| Nom | **« Sites de mariage » par AlexDevLab**, pas de marque dédiée au lancement |

### Vocabulaire

- **RSVP** : « Répondez s'il vous plaît ». Désigne la réponse de l'invité
  (présent ou non, contraintes alimentaires). Sur les pages publiques, on écrit
  « réponses des invités » ou « Répondre », jamais le sigle.
- **Moment** : une invitation distincte, donc une réponse — par exemple mairie,
  cérémonie & vin d'honneur, dîner & soirée, brunch du lendemain. Chaque foyer
  est invité à certains moments seulement, et répond moment par moment.
  Toutes les formules acceptent un nombre illimité de moments.
- **Horaire** : une ligne du programme à l'intérieur d'un moment. Un moment peut
  en contenir plusieurs : « Cérémonie & vin d'honneur » = cérémonie à 16 h +
  vin d'honneur à 17 h 30. Règle : deux temps qui réunissent exactement les
  mêmes invités forment **un seul moment** ; dès que la liste d'invités change,
  c'est un nouveau moment. Le programme, le formulaire de réponse et le tableau
  de bord comptent tous les moments de la même façon.
- **Questions** : tout ce que le formulaire demande en plus de la présence.
  Les questions de base sont incluses partout ; écrire ses propres questions
  est inclus dès Essentiel, en option à 40 € avec Intime. On ne compte jamais
  les questions dans l'offre.
- **Moodboard** : planche d'inspiration (images, couleurs, typographies,
  matières) validée par le couple avant le design. Sur les pages publiques, on
  écrit « planche d'inspiration ».
- **Foyer** : l'unité d'invitation (un couple, une famille, une personne seule),
  qui reçoit un lien personnel.

---

## 1. Positionnement

### 1.1 Promesse

> « Un site à votre image, de l'annonce au dernier souvenir. »

Les plateformes gratuites (Mariages.net, Zankyou, Joy, Zola) donnent un site
générique, avec publicité ou upsell, et des données invités hébergées hors de
votre contrôle. Les agences événementielles facturent 2 500 € et plus. L'offre se
place entre les deux : **design unique, outil de gestion réel, prix d'artisan**.

### 1.2 Cible

- **Primaire** : couples 27-38 ans, mariage dans 4 à 12 mois, 60 à 200 invités,
  sensibles au design (déjà équipés d'un photographe « auteur », faire-part
  soignés, lieu de caractère).
- **Secondaire** : wedding planners qui recommandent l'offre à leurs couples.
- **Prescripteurs** : photographes, fleuristes, domaines de réception. Pas de
  commission prévue : la recommandation passe par la qualité de la démo et un
  lien « Site conçu par AlexDevLab » en pied de chaque site.

### 1.3 Différenciation (argumentaire)

1. **Le RSVP qui se remplit tout seul** — chaque foyer reçoit son lien : son nom
   est déjà là, il ne voit que les moments auxquels il est invité (vin d'honneur
   seul ou dîner), il répond en 30 secondes.
2. **Un vrai tableau de bord** — qui a ouvert, qui a répondu, régimes
   alimentaires, relances, export traiteur.
3. **Les photos des invités au même endroit** — un QR code sur les tables, les
   photos arrivent dans une galerie privée, sans application à installer.
4. **Un design qui n'existe qu'une fois** — pas un thème parmi 300.
5. **Vos données restent privées** — hébergement européen, aucune publicité,
   suppression programmée après le mariage.

### 1.4 Concurrence directe (relevé du 2026-10-06)

| Acteur | Prix | Ce qu'il propose | Ce qu'il n'a pas (vs notre offre) |
|---|---|---|---|
| [Moment de Vie](https://momentdevie.fr/) | 99 → 299 € (5 paliers) | Lien personnel par invité, RSVP + tableau de bord, régimes, plan de table, galerie, animation d'ouverture, 2 ans d'hébergement, livré en 7 jours | Domaine perso (URL `momentdevie.fr/mariage/…`), galerie alimentée par les invités via QR (à confirmer), faire-part PDF avec QR personnel, bilingue |
| [Plume & Cire](https://plumeetcire.fr/) | 149 € (Essentielle) / 299 € (Signature) | 10 univers graphiques, sites animés, livrés en 5 à 10 jours | Sur-mesure réel (univers prédéfinis) ; RSVP et tableau de bord à vérifier |
| Maison Celestine, Cotton Bird (Bird Postal), Joy | gratuit → ~150 € | Mini-sites et faire-part numériques à partir de modèles | Design unique, accompagnement |

**Conséquence :** le marché « site-faire-part avec RSVP par lien personnel »
existe déjà entre 99 € et 299 €. Réponse retenue : une formule **Intime à 290 €**
au niveau du haut de ce marché, mais avec ce qu'il n'offre pas (domaine au nom
du couple, design ajusté par un humain, interlocuteur unique). Essentiel et
Signature se justifient ensuite par le design dédié, la galerie alimentée par
les invités le jour J, le QR personnel par foyer et le plan de table sur téléphone.

---

## 2. Offre commerciale

> **Micro-entreprise en franchise en base de TVA** : les prix affichés sont des
> prix nets, sans TVA. Mention obligatoire sur la page tarifs, les devis et les
> factures : « TVA non applicable, art. 293 B du CGI ». Pas de libellé « HT » ni
> « TTC » sur `/mariage` (le `PricingCard` actuel affiche « € HT » : à corriger
> aussi pour les particuliers). Surveiller le seuil de franchise des prestations
> de services : au-delà, la TVA s'applique et la grille devra être revue.

### 2.1 Formules

| | **Intime** — 290 € | **Essentiel** — 490 € | **Signature** — 890 € ★ |
|---|---|---|---|
| Promesse | Annoncer et recevoir les réponses | Tout le parcours, jusqu'aux photos | Un univers créé pour vous, du faire-part au jour J |
| Pour qui | Petit mariage, l'essentiel en ligne | Mariage simple, budget maîtrisé | Les couples qui veulent un site unique et le plan de table sur téléphone |
| Design | Un design standard, à vos couleurs et photos | Design ajusté : palette, typos, mise en page | Direction artistique dédiée (moodboard + 1 proposition), déclinée sur le site et le faire-part |
| Faire-part numérique | **Animé** (ouverture standard : sceau / enveloppe) | **Animé** (ouverture standard) | **Animé sur-mesure** (animation conçue pour le couple) |
| Pages | Accueil, notre histoire, programme, lieux, FAQ ; dress code en une ligne sous le programme | + compte à rebours ; dress code en section illustrée (texte + nuancier) | idem Essentiel |
| Réponses des invités par lien personnel | ✓ | ✓ | ✓ |
| Questions aux invités | De base : contraintes alimentaires, mot pour les mariés | + vos propres questions, sans limite | idem Essentiel |
| Tableau de bord | Liste, statuts, statistiques, export CSV ; textes, programme et dates modifiés par les mariés | idem | + plan de table, co-gestion (témoins, wedding planner) |
| Relances automatiques | — | ✓ (une relance J-15 avant la date limite, date réglable) | ✓ |
| Galerie photos invités (QR jour J) | option | ✓ | ✓ |
| Faire-part PDF + QR | option | ✓ 1 visuel, QR vers le site | ✓ **QR personnel par foyer** (ouvre directement sa réponse) |
| Plan de table numérique (QR jour J) | — | option | ✓ chaque invité trouve sa table sur son téléphone (§4.7) |
| Allers-retours sur le design | 1 | 2 | 3 |
| Délai de livraison | 10 jours | 2 semaines | 3 semaines |
| Mise en ligne | 12 mois + domaine perso | 12 mois + domaine perso | 12 mois + domaine perso |

Chaque formule répond à un besoin : Intime pour annoncer et collecter les
réponses, Essentiel pour suivre tout le parcours jusqu'aux photos du jour J
(galerie + relances), Signature pour un univers créé pour le couple, du
faire-part au jour J, avec le plan de table numérique. Le faire-part
animé est inclus partout : c'est la base d'une invitation de mariage.

Un aller-retour porte sur le design (mise en page, couleurs, animation). Le
contenu (textes, programme, horaires, dates, questions) se modifie depuis le
tableau de bord sans limite : il ne consomme aucun aller-retour.

**Pas de papeterie** (menu, plan de table papier, marque-places, remerciements) :
ce n'est pas notre métier, comme la galerie du photographe. Côté impression,
on ne livre que des fichiers générés depuis le site, que le couple fait
imprimer où il veut : le faire-part PDF + QR (ou un PDF par foyer avec son QR
personnel), l'affiche du QR du plan de table et celle du QR de la galerie. Signature passe de 990 € à 890 € (décidé
le 2026-10-06).

La démo du tableau de bord joue la formule Signature : chaque section qui n'est
pas dans toutes les formules porte un badge (« Dès Essentiel », « Signature ·
option Essentiel »…) pour qu'un couple venu pour Intime sache ce qu'il aura.

L'ancienne formule Prestige (1 690 €) est supprimée : le site bilingue et le
design 100 % sur-mesure deviennent des options (§2.2). La galerie du
photographe n'est pas reprise : ce n'est pas notre métier.

### 2.2 Options

| Option | Prix |
|---|---|
| Vos propres questions aux invités (Intime ; chanson, covoiturage, âge des enfants…) | 40 € |
| Galerie invités (Intime) | 190 € |
| Faire-part PDF + QR (Intime) | 60 € |
| Plan de table numérique, sans QR personnel (Essentiel) | 150 € |
| Faire-part PDF avec QR personnel par foyer (Intime, Essentiel) | 90 € |
| Co-gestion du tableau de bord (Intime, Essentiel) | 60 € |
| Langue supplémentaire | 150 € |
| Design 100 % sur-mesure (illustrations, animations, pages libres) | sur devis |
| Prolongation du site (archive galerie) | 49 € / an |
| Livraison express (−1 semaine) | 150 € |
| Site PACS / fiançailles / anniversaire | sur devis (base Intime) |

### 2.3 Conditions

- **Acompte 40 %** à la signature, solde à la mise en ligne.
- **Droit de rétractation** : contrat à distance avec un particulier → 14 jours.
  Si le couple veut démarrer plus tôt, demande expresse écrite + mention dans le
  devis (art. L221-25 du Code de la consommation).
- Le couple est **responsable de traitement** des données invités, AlexDevLab est
  **sous-traitant** : clause RGPD (art. 28) intégrée aux CGV.
- Contenu (textes, photos) fourni par le couple via un questionnaire, au plus tard
  J-10 avant la date de livraison.

### 2.4 Économie unitaire (ordre de grandeur)

| Formule | Temps estimé | Coût variable (domaine + stockage) | Marge brute / h |
|---|---|---|---|
| Intime | ~4,5 h (socle industrialisé) / ~7 h au lancement | ~15 € | ~61 €/h / ~39 €/h |
| Essentiel | ~8 h | ~15 € | ~59 €/h |
| Signature | ~10 h (sans papeterie) | ~20 € | ~87 €/h |

La rentabilité dépend du **socle hybride** : plus il est complet, plus le temps
par mariage baisse. Intime n'est rentable qu'avec au moins deux ou trois
designs standards prêts à l'emploi et l'import CSV des invités automatisé.
Objectif après 5 mariages : Intime en 4 h, Essentiel en 5 h.

---

## 3. Parcours

### 3.1 Parcours couple (client)

```
Découverte          Contrat           Production            En ligne              Après
───────────         ────────          ────────────          ─────────             ──────
Page /mariage  ──►  Appel 30 min ──►  Questionnaire   ──►  Envoi des liens  ──►  Galerie
Site démo           Devis + acompte   Moodboard (Sig+)      Suivi dashboard       Remerciements
Formulaire                            Proposition           Relances              Archive / purge
                                      Import invités CSV    Jour J : QR galerie
                                      Recette → mise en ligne
```

Calendrier conseillé au couple :

| Moment | Action |
|---|---|
| J-12 à J-8 mois | Signature, save-the-date en ligne (option : page unique) |
| J-6 à J-4 mois | Site complet + envoi des liens personnels |
| J-6 semaines | Date limite RSVP, relances automatiques avant |
| J-4 semaines | Export traiteur (effectifs, régimes) |
| Jour J | QR codes sur les tables, galerie ouverte |
| J+1 à J+30 | Galerie ouverte aux invités, message de remerciement |
| J+3 mois | Purge des données RSVP (minimisation RGPD), site en mode archive |
| Mise en ligne + 12 mois | Fin ou prolongation |

### 3.2 Parcours invité

1. Reçoit le lien (WhatsApp, SMS, email ou QR sur le faire-part papier).
2. **Faire-part** : écran d'ouverture → « Cher Marie & Thomas ».
3. Site : programme limité à ses moments, lieux, dress code, FAQ.
4. **RSVP** : une ligne par membre du foyer × moment, régime, message.
   Modifiable jusqu'à la date limite via le même lien.
5. Email de confirmation (si email renseigné) avec ajout au calendrier (.ics).
6. **Jour J** : scanne le QR de table → page d'upload → photos envoyées.
7. **Après** : reçoit le lien de la galerie et le message de remerciement.

### 3.3 Parcours AlexDevLab (production)

1. Création du mariage dans l'admin (slug, date, formule, domaine).
2. Contenu dans Sanity (document `weddingSite`), thème choisi ou créé.
3. Import CSV des invités → génération des foyers et des liens.
4. Recette avec le couple sur l'URL de prévisualisation.
5. Achat et branchement du domaine, mise en ligne.
6. Suivi : alertes si taux d'ouverture faible, support jour J.

---

## 4. Spécifications fonctionnelles

### 4.1 Faire-part numérique

- **Animé dans toutes les formules.** Écran d'ouverture plein écran : sceau /
  enveloppe / reveal typographique. Animation **≤ 3,5 s** (Signature : le rameau d'olivier reste visible une demi-seconde), passable, désactivée
  sous `prefers-reduced-motion`.
- Intime et Essentiel : une animation standard du socle, aux couleurs du
  couple. Signature : une animation conçue pour le couple.
- Personnalisation : « Chers Marie & Thomas » quand l'invité arrive par son lien.
- Bouton « Ajouter à mon calendrier » (.ics + Google Calendar).
- Image Open Graph dédiée (aperçu WhatsApp soigné : c'est le premier contact).

### 4.2 Infos pratiques

- **Programme** : les moments du foyer, chacun avec ses horaires (« Cérémonie &
  vin d'honneur » → 16 h cérémonie, 17 h 30 vin d'honneur).
  Un moment auquel le foyer n'est pas convié **n'apparaît pas du tout** (ni grisé,
  ni mentionné) : l'invité ne doit pas deviner qu'il existe. Horaires sur une
  seule ligne (« 17 h 30 »), y compris sur mobile.
- **Lieux** : adresse, carte statique (pas d'iframe Google Maps : RGPD et
  performance), liens Google Maps / Apple Plans / Waze.
- **Dress code** (seulement si le couple en a une) :
  - Intime : une ligne bien visible, placée sous le programme et **hors de la
    FAQ** (ex. « Tenue : chic champêtre, le blanc est réservé à la mariée »),
    pour qu'aucun invité ne la manque ;
  - Essentiel et Signature : une section dédiée, texte + nuancier de couleurs.
- **FAQ** : enfants, parking, horaires, contacts des témoins.
- Pas d'hébergement ni de transport (hors périmètre).

### 4.3 RSVP

- **Foyer** = unité d'invitation (couple, famille, invité seul).
- Chaque invité du foyer répond **par moment** : oui / non.
- Accompagnant « +1 » : emplacement nommable par l'invité.
- Questions **de base** (toutes formules) : contraintes alimentaires (liste +
  champ libre si « Autre »), mot pour les mariés.
- Questions **personnalisées** (dès Essentiel, option 40 € avec Intime) : écrites par le
  couple, sans limite de nombre — chanson pour la soirée, âge des enfants, covoiturage, etc.
- Date limite : après elle, formulaire verrouillé, message « contactez-nous ».
- Modification possible jusqu'à la date limite, historique conservé.
- Sans lien personnel (QR du faire-part commun, lien perdu) : le site s'ouvre
  adressé à personne, programme limité aux moments communs à tous les foyers.
  À la place du formulaire, « Recevoir mon lien personnel » : recherche par
  prénom ou nom, puis le lien part **à l'adresse notée par les mariés**, jamais
  affichée en clair (`m•••@exemple.fr`). La page n'ouvre jamais le foyer :
  personne ne répond à la place d'un autre (décidé le 2026-10-09, remplace
  « nom + code du faire-part », le faire-part commun n'ayant pas de code propre
  au foyer). Sans adresse : « demandez votre lien aux mariés ». Côté serveur :
  limitation de débit par IP et par foyer, pour qu'on ne noie pas une boîte de
  liens. Révèle seulement qu'un nom est invité, comme le plan de table.

### 4.4 Galerie invités

- **Deux accès, une seule galerie** :
  - le **lien personnel** de l'invité (WhatsApp, email, QR personnel du
    faire-part en Signature) : avant l'ouverture, un encart « la galerie ouvre
    le … » ; pendant, envoi signé du nom du foyer sans rien remplir ; après,
    consultation et téléchargement ;
  - le **QR jour J**, imprimé sur l'affiche d'accueil et les tables → `/jour-j`
    (envoyer ses photos, et trouver sa table en Signature). Un seul QR à
    imprimer pour tout le jour J.
- **Chaque photo est signée.** Téléphone reconnu ou lien personnel : signature
  automatique avec le nom du foyer. Invité qui vient de chercher sa table
  (Signature) : on réutilise son nom. Sinon, via le QR de la galerie : champs
  « Prénom » (2 caractères minimum) et « Nom » **obligatoires** avant d'entrer,
  demandés une seule fois puis mémorisés sur le téléphone.
- Qui voit la galerie : les invités via leur lien personnel, et toute personne
  ayant scanné le QR sur place pendant la fenêtre du jour J. Sans l'un ou
  l'autre, rien n'est visible.
- Upload : multi-sélection, file d'attente avec reprise (le Wi-Fi des domaines
  est mauvais), progression visible.
- Compression côté navigateur (2 560 px max, WebP/JPEG), **suppression des
  données EXIF GPS**.
- **Pas de modération** : chaque photo est publiée dès son envoi. Les mariés
  peuvent retirer après coup une photo gênante depuis le tableau de bord, et
  tout invité peut demander le retrait d'une photo où il apparaît.
- Téléchargement ZIP pour les mariés.
- Fenêtre d'upload configurable : ouverture à **un jour et une heure** choisis
  par les mariés (par défaut la veille à 10 h, au plus tôt une semaine avant,
  au plus tard le jour J), dans le fuseau du mariage ; fermeture J+30.

### 4.5 Tableau de bord mariés

- Connexion par **lien magique** email (pas de mot de passe), réservée aux
  deux mariés et aux personnes qu'ils invitent selon leur formule : pas
  d'inscription, comptes créés par AlexDevLab (détail : `STARTER-KIT.md` §5).
- Vue d'ensemble : taux de réponse, présents/absents par moment, compte à
  rebours avant la date limite.
- Invités : liste filtrable (statut, moment, groupe « famille Camille »,
  « amis Hugo »), dernier accès, copier le lien, renvoyer, relancer.
- Récapitulatif traiteur : effectifs par moment, régimes, enfants → export
  CSV / PDF.
- Galerie : consultation, retrait d'une photo, téléchargement ZIP.
- Relances : planification automatique, modèles de message.
- Accès : les deux mariés dans toutes les formules ; co-gestion (témoins,
  planner, sans limite de nombre) incluse en Signature, en option avec Intime
  et Essentiel. Pas de rôles figés : les mariés choisissent, fonction par
  fonction (feature flags), ce que chaque personne invitée voit ou modifie.
- Renvoyer son lien à un foyer, à la main : toutes formules. Relances
  automatiques et groupées : à partir d'Essentiel.
- Une fonction hors formule est masquée, jamais grisée.

### 4.6 Faire-part imprimable

- PDF A5 / 148×148 mm généré depuis le même design, QR vers le site adressé à
  personne (voir « Sans lien personnel » ci-dessus), jamais vers un foyer.
- Option : un PDF par foyer avec **QR personnel** (le RSVP s'ouvre directement).
- Fichiers prêts pour l'imprimeur : fonds perdus 3 mm, CMJN laissé à l'imprimeur.

---

### 4.6 bis Lien personnel sur mobile

La grande majorité des invités ouvre son lien sur téléphone, souvent depuis
WhatsApp. Le site est conçu pour le pouce, en deux états.

**Avant le mariage**

- Barre d'accès rapide fixée en bas de l'écran : Programme · Lieux · Questions
  (FAQ) · **Répondre** (bouton principal). Une fois la réponse envoyée,
  « Répondre » devient un onglet normal « Répondu » (coche verte, sans fond) :
  seule l'action principale du moment a un fond plein. Pas d'onglet Photos
  avant le jour J : la galerie est vide.
- Formulaire de réponse : un moment par ligne, boutons Présent·e / Absent·e en
  pleine largeur (48 px de haut), libellés jamais écrasés.
- Galerie : avant son ouverture, un simple encart « La galerie ouvre le
  vendredi 11 juin à 10 h ». Ensuite : bouton d'envoi en tête, aperçu sur 2 colonnes
  limité à 6 photos + « Voir les N photos ». Le QR code de la galerie est masqué sur mobile
  (inutile de montrer un QR au téléphone qui devrait le scanner).

**Le jour J** (bascule automatique le matin du mariage)

- L'écran d'accueil devient un tableau de bord invité : « Bienvenue Marie &
  Thomas », **sa table** (Signature, avec plan de salle dépliable), **en ce
  moment / ensuite** d'après l'heure réelle, et un grand bouton **Ajouter mes
  photos**.
- Barre du bas : Programme · Ma table · **Ajouter** (photos) · Lieux. Le
  formulaire de réponse disparaît (réponses closes).
- Programme : horaires passés estompés, horaire en cours marqué « En ce
  moment », lien « Itinéraire » sous chaque moment.
- Envoi des photos dans une feuille qui monte du bas : « Prendre une photo » /
  « Choisir dans ma galerie ». Aucun champ à remplir : l'envoi est signé du nom
  du foyer grâce au lien personnel (via le QR de la galerie : prénom et nom
  obligatoires, demandés une seule fois, cf. §4.4). Progression photo par photo, reprise
  automatique si le réseau coupe, confirmation « 3 photos partagées, merci ! ».
- Cibles tactiles ≥ 44 px partout, textes ≥ 13 px, aucune barre horizontale,
  marges de sécurité de l'iPhone respectées (`env(safe-area-inset-bottom)`).

### 4.7 Plan de table numérique (Signature)

**Principe : deux QR codes sur place, chacun pour une seule chose** (décidé le
2026-10-08, remplace le « QR jour J » unique). Aucun ne mène au faire-part ni
aux réponses :

- **QR du plan de table**, sur l'affiche à l'entrée du dîner (PDF A4 fourni) :
  il ouvre la page `/plan-de-table`, le plan de la salle, la recherche par
  prénom ou nom, et qui est à quelle table.
- **QR de la galerie**, sur l'affiche d'accueil et sur chaque table (PDF A4 +
  4 cartes à découper) : il ouvre la page `/galerie`. Pour entrer, l'invité
  donne son prénom et son nom, qui signent ses photos (gardés sur son
  téléphone, demandés une seule fois).

**Comment l'invité est reconnu**, du plus fluide au plus manuel :

1. **Téléphone déjà reconnu.** Si l'invité a ouvert son lien personnel sur ce
   téléphone (faire-part, réponse), le site s'en souvient (jeton du foyer
   conservé 6 mois). Le scan affiche directement « Marie, vous êtes à la
   table 7 — Les Oliviers », avec le plan de la salle et sa table en surbrillance.
2. **QR personnel.** En Signature, le faire-part imprimé porte un QR propre au
   foyer : le jour J, il ouvre la même page personnelle, qui passe d'elle-même
   en « mode jour J » (table en tête, programme du jour, bouton photos).
3. **Recherche par prénom ou nom** (page du QR du plan de table) : l'invité
   tape les premières lettres de son prénom, de son nom, ou des deux ; la liste
   affiche « Marie L. », « Marine D. » ; il touche son nom et voit sa table.
   Sous le plan, la liste des tables avec les prénoms de leurs convives. Seuls les invités attendus au dîner sont proposés, avec
   prénom + initiale du nom, jamais le nom complet.

**Règles :**

- Tables **révélées à un jour et une heure** choisis par les mariés (par
  défaut le jour J à 10 h, au plus tôt une semaine avant, au plus tard le jour
  J), dans le fuseau du mariage : pas de négociation de placement les semaines
  d'avant.
- Les données de la table sont **gardées en cache** sur le téléphone dès la
  veille pour les invités reconnus : la page fonctionne même sans réseau dans
  la salle.
- Pas de plan de table papier fourni : un changement de dernière minute
  s'applique tout de suite sur le site, sans rien réimprimer.
- Un « +1 » sans nom apparaît comme « Invité de Marie L. ».
- Confidentialité : la recherche n'est active que pendant la fenêtre du jour J,
  limitée en nombre de requêtes, et la page n'est pas indexée.

**Côté mariés (tableau de bord) :**

- Créer les tables (numéro ou nom, nombre de places, position sur un plan
  simple de la salle).
- Glisser-déposer les invités **qui ont confirmé le dîner** ; alertes : table
  pleine, invité sans table, enfant seul à une table d'adultes.
- Exports : **liste du
  traiteur par table avec les contraintes alimentaires** (« table 7 : 1
  végétarien, 1 sans gluten »).

## 5. Infrastructure d'hébergement

### 5.1 Principe : deux applications distinctes

```
                ┌───────────────────────────────┐
                │  Portfolio (repo actuel)      │  alexdevlab.com
                │  Next.js 16 · Vercel · Sanity │  /mariage, carte bento, démo
                └──────────────┬────────────────┘
                               │ lien « voir la démo »
                ┌──────────────▼────────────────────────────────────────┐
                │  Plateforme mariages (nouveau repo, multi-tenant)     │
                │  Next.js 16 · Vercel Pro · région fra1 (Francfort)    │
                │                                                       │
                │  proxy (ex-middleware) : Host → tenant                │
                │   camille-et-hugo.fr          → wedding « camille-hugo »
                │   demo.mariage.alexdevlab.com  → wedding « demo »      │
                │   app.mariage.alexdevlab.com   → tableau de bord       │
                └──┬──────────┬──────────┬───────────┬──────────┬───────┘
                   │          │          │           │          │
              Sanity      Neon       Cloudflare    Email     Upstash
             (contenu)   Postgres    R2 + Images  transac.  Redis
                         (Francfort)  (photos)    (Resend,   (rate limit,
                                                   région EU)  file upload)
```

**Pourquoi ne pas mettre les sites de mariage dans le portfolio** : cycle de
déploiement indépendant (un déploiement raté du portfolio ne doit pas casser un
mariage le jour J), données personnelles isolées, et surtout une **seule
application multi-tenant** pour N mariages : un correctif profite à tous.

**Pourquoi pas un projet Vercel par mariage** : N déploiements à maintenir,
N mises à jour de dépendances. Le multi-tenant par domaine est le modèle
« Platforms » documenté par Vercel.

### 5.2 Composants

| Brique | Choix recommandé | Rôle | Alternative |
|---|---|---|---|
| Hébergement app | **Vercel Pro** (à souscrire) | Next.js, domaines perso, SSL auto, CDN | Netlify, Coolify sur VPS (Hetzner) |
| Région fonctions | **fra1 (Francfort)** | Au plus près de la base Neon | cdg1 si la base change |
| Contenu éditorial | **Sanity** (même projet, dataset `weddings`) | Textes, photos du couple, thème, programme | Contenu en base + éditeur maison |
| Base transactionnelle | **Neon Postgres, région Francfort (aws-eu-central-1)**, pilote serverless `@neondatabase/serverless` + ORM **Drizzle** | Foyers, invités, réponses, tables, comptes, métadonnées photos | Supabase (Paris) |
| Authentification mariés | **Better Auth**, lien magique envoyé par **Resend** (compte existant) | Accès au tableau de bord | Auth.js + adaptateur Drizzle |
| Photos | **Cloudflare R2** (juridiction EU) | Stockage originaux + variantes, **sans frais de sortie** | Vercel Blob |
| Transformations d'images | Cloudflare Images (transform sur R2) | Miniatures, AVIF/WebP à la volée | Variantes pré-générées à l'upload |
| Email transactionnel | **Resend** (compte existant, région d'envoi `eu-west-1`), modèles en React Email | Lien magique, confirmations RSVP, relances | Brevo (société FR) |
| Rate limiting / files | **Upstash Redis** (région EU) | RSVP, recherche par nom, upload | Table Postgres + compteur |
| Registrar domaines | **OVHcloud** ou **Gandi** (API) | Achat des `.fr` / `.com` des couples | Vercel Domains (`.fr` non garanti) |
| Tâches planifiées | Vercel Cron | Relances, ouverture/fermeture galerie, purge RGPD | — |
| PDF | Génération HTML → PDF (Playwright dans un job) ou `@react-pdf/renderer` | Faire-part imprimable | Export manuel depuis Figma |
| Monitoring | Sentry + Vercel Analytics + sonde de disponibilité (Better Stack) | Erreurs, perfs, alerte jour J | — |

> **Le portfolio est aujourd'hui sur Vercel Hobby, qui interdit l'usage
> commercial.** Les sites livrés à des clients imposent le plan **Pro**
> (20 $/mois/membre) **avant le premier mariage vendu**. Un portfolio qui vend
> des prestations est déjà à la limite de l'usage commercial : basculer le
> portfolio dans la même équipe Pro règle les deux d'un coup.
>
> Alternative à coût fixe nul tant qu'il n'y a pas de client : Cloudflare
> Pages / Workers (offre gratuite autorisant l'usage commercial) avec
> l'adaptateur OpenNext. Plus de configuration, moins de confort qu'avec
> Vercel ; à considérer seulement si le budget fixe bloque le lancement.

### 5.3 Domaines

- **Domaine perso inclus** (`camille-et-hugo.fr`) : acheté par AlexDevLab via
  l'API du registrar, ajouté au projet Vercel via l'API (`POST /v10/projects/{id}/domains`),
  enregistrements DNS A/CNAME posés automatiquement, SSL automatique.
- **Titulaire du domaine** : AlexDevLab par défaut (renouvellement maîtrisé),
  transfert au couple sur demande à la fin du contrat. À écrire dans les CGV.
- **Sous-domaine de secours** : `camille-hugo.mariage.alexdevlab.com`, toujours
  actif (prévisualisation, recette, panne DNS). Le joker
  `*.mariage.alexdevlab.com` impose que la zone `mariage.alexdevlab.com` soit
  gérée par les serveurs DNS de Vercel.
- `www` → redirection 308 vers l'apex.
- Renouvellement : rappel J-30 avant échéance → prolongation ou expiration.

### 5.4 Rendu et cache

| Page | Rendu | Cache |
|---|---|---|
| Faire-part, programme, lieux, FAQ (générique) | Statique, cache par tag `wedding:{slug}` | Révalidation par webhook Sanity (mécanisme déjà présent dans `src/app/api/revalidate`) |
| `/i/[token]` (version personnalisée) | Dynamique, rendu serveur | `no-store`, contenu statique réutilisé |
| RSVP | Server Action → Postgres | — |
| Galerie | Statique + liste paginée côté serveur | Révalidée à l'arrivée de nouvelles photos (au plus une fois par minute) |
| Tableau de bord | Dynamique, authentifié | `no-store` |

- En-têtes **`X-Robots-Tag: noindex, nofollow`** sur tous les sites de mariage
  (sauf la démo, indexable pour le SEO de l'offre).
- Pas de pistage tiers sur les sites invités. Mesure d'audience sans cookie au
  plus.

### 5.5 Upload photos le jour J

Pic de charge typique : 150 invités, 20 à 40 photos chacun, concentrés sur
2 heures (dîner, soirée).

```
Téléphone invité                Vercel (fonction)            Cloudflare R2
────────────────                ─────────────────            ─────────────
compresse + retire l'EXIF
POST /api/uploads/sign  ──────► vérifie token galerie
                                + rate limit (Upstash)
                                crée photo(status=uploading)
                         ◄────── URL PUT présignée (5 min)
PUT fichier direct  ───────────────────────────────────────► stockage
POST /api/uploads/complete ───► photo.status = published
                                révalide le tag galerie
```

- **Envoi direct vers R2** : contourne la limite de corps de requête des
  fonctions Vercel (4,5 Mo) et ne consomme pas de calcul serverless.
- File d'attente côté client (IndexedDB) avec reprise : l'upload continue quand
  le réseau revient.
- Formats : JPEG, PNG, WebP, HEIC (iOS convertit en JPEG à la sélection si
  `accept="image/*"`). Taille max 25 Mo avant compression.
- Volumétrie : ~4 000 photos × 1,2 Mo ≈ **5 Go par mariage**. R2 : ~0,015 $/Go/mois,
  sortie gratuite → coût négligeable même si toute la famille télécharge la galerie.

### 5.6 Modèle de données (Postgres)

```
wedding        (id, slug, couple_names, date, timezone, plan, status[draft|live|archived],
                primary_domain, rsvp_deadline, gallery_opens_at, gallery_closes_at,
                tables_reveal_at, purge_at, created_at)
household      (id, wedding_id, display_name, token UNIQUE, email, phone, locale,
                group_label, last_opened_at, reminders_sent, created_at)
household_moment(household_id, moment_key)              -- à quoi le foyer est invité
guest          (id, household_id, first_name, last_name, is_child, is_plus_one, table_id NULL)
seating_table  (id, wedding_id, label, number, capacity, pos_x, pos_y)
rsvp           (guest_id, moment_key, status[pending|yes|no], updated_at)
question       (id, wedding_id, label, kind[text|choice|boolean], required, is_sensitive)
answer         (guest_id, question_id, value, updated_at)
photo          (id, wedding_id, r2_key, width, height, uploader_name, household_id NULL,
                status[uploading|published|removed], created_at)
member         (user_id, wedding_id, role[owner|member])  -- géré par Better Auth (organization = wedding)
member_flag    (member_id, flag, level[read|write])       -- droits par personne, cf. STARTER-KIT.md §5.3
email_log      (id, wedding_id, household_id, kind, provider_id, status, sent_at)
```

- **Révisé le 2026-10-06** : les mariés modifient eux-mêmes faire-part,
  programme, horaires, dates et questions depuis le tableau de bord. Ce contenu
  vit donc en base (tables `moment`, `slot`, `question`, `room`… détaillées
  dans `STARTER-KIT.md` §4.2), plus dans Sanity. On répond toujours à un
  moment, jamais à un horaire.
- **Isolation entre mariages** : toute requête passe par une couche d'accès
  aux données qui impose le filtre `wedding_id` du membre connecté (testée
  unitairement). La Row Level Security de Postgres reste possible en défense
  supplémentaire.
- **Branches Neon** : une base par branche de code, créée automatiquement pour
  chaque prévisualisation Vercel, avec des données de démonstration.
- **Mise en veille** : désactivée sur l'offre payante dès le premier client
  (évite le délai de réveil de la base le jour J).
- Jetons des liens : 22 caractères base62 (~128 bits), régénérables par foyer.

### 5.7 Contenu (Sanity)

Sanity ne garde que ce qu'AlexDevLab rédige ; les mariés demandent les
changements par message.

Document `weddingSite` : `slug`, `theme` (référence `weddingTheme`), `hero`,
`story`, `venues[]` (lieu, adresse, coordonnées, itinéraire), `dressCode`,
`faq[]`, `photos[]`, `ogImage`, `locales`. Le programme et ses horaires sont en
base (§5.6) : un créneau y désigne un lieu de `venues[]`.

Document `weddingTheme` : jetons CSS (couleurs, typos, rayons), variante du
faire-part, composants de section autorisés. Le **modèle hybride** tient ici :
un thème = des jetons + des variantes de composants du socle ; pour un design
sur-mesure (sur devis), un
thème peut déclarer des sections spécifiques codées dans `themes/<slug>/`.

### 5.8 Sécurité

- Liens invités imprévisibles, régénérables, aucune liste de foyers exposée.
- Rate limiting : RSVP (10/min/jeton), recherche par nom (5/min/IP), upload
  (60 photos/heure/appareil).
- Validation Zod de toutes les entrées serveur, CSP stricte, `noindex`.
- Uploads : vérification du type MIME réel (octets magiques), taille, clés R2
  non devinables, bucket privé, lecture via URL signée ou domaine de
  transformation protégé.
- Tableau de bord : lien magique à usage unique (15 min) réservé aux adresses
  déjà rattachées à un mariage, aucune inscription, invitations de
  co-gestion liées à une adresse (72 h), session 30 jours, compte admin
  AlexDevLab protégé par passkey ; Better Auth (`magicLink`, `organization`,
  `admin`, `passkey`) + feature flags en quatre couches (`STARTER-KIT.md` §5).
- Journal d'audit des exports CSV (données personnelles).

### 5.9 RGPD

| Donnée | Base légale | Conservation |
|---|---|---|
| Nom, email, téléphone des invités | Exécution du service pour le couple (intérêt légitime) | Jusqu'à J+3 mois |
| **Régimes / allergies** | Données de santé potentielles (art. 9) → **consentement explicite** (case à cocher) ; préférer « contraintes alimentaires » en texte libre facultatif | Jusqu'à J+1 mois |
| Photos invités | Consentement (upload volontaire) ; droit à l'image des personnes photographiées → retrait sur simple demande | Durée de mise en ligne + archive |
| Compte mariés | Contrat | Durée du contrat + 1 an |

- Hébergement **UE uniquement** (Vercel fra1, Neon Francfort, R2 juridiction EU,
  Upstash EU, Resend en région d'envoi EU). Resend étant une société américaine,
  citer son DPA et les clauses contractuelles types dans la liste des
  sous-traitants des CGV.
- Mentions d'information sur chaque site invité (page « Vos données »).
- Purge automatique par tâche planifiée (`wedding.purge_at`).
- Export complet remis au couple avant purge.

### 5.10 Sauvegarde et continuité

- Postgres : restauration à un instant donné (Neon, durée selon l'offre) + export
  quotidien chiffré vers R2.
- R2 : versionnage des objets pendant la fenêtre de galerie.
- **Jour J** : gel des déploiements la veille et le jour du mariage (règle
  d'équipe + vérification dans la CI), sonde de disponibilité toutes les minutes,
  alerte SMS.
- Domaine de secours toujours actif si le DNS du domaine perso tombe.

### 5.11 Coûts fixes mensuels (estimation)

| Poste | Démarrage (1-5 mariages) | Croisière (10-30 mariages/an) |
|---|---|---|
| Vercel Pro | 20 $ (nouveau, couvre aussi le portfolio) | 20 $ + dépassements éventuels |
| Neon | 0 $ (offre gratuite, base mise en veille quand inactive) | offre payante sans mise en veille (tarif à vérifier) |
| Cloudflare R2 + Images | ~0-5 $ | ~5-15 $ |
| Sanity | 0 $ (offre gratuite) | 0-15 $ |
| Email (Resend) | 0 $ si l'offre gratuite suffit (3 000/mois, 100/jour) | 20 $ (Pro) dès que les relances dépassent 100 emails/jour |
| Upstash | 0 $ | ~0-10 $ |
| Sentry / sonde | 0 $ | 0-25 $ |
| **Total** | **~50 €/mois** | **~80-130 €/mois** |
| Domaines | ~8-15 € / an / mariage (refacturé dans la formule) | |

Un Essentiel couvre environ **9 mois** d'infrastructure fixe.

---

## 6. Intégration dans le portfolio

### 6.1 Carte bento (home)

- Nouvelle carte pleine largeur entre « Services » et « Projets ».
- Fond sombre du portfolio + **aperçu ivoire du faire-part** incliné : la rupture
  se voit dès la home.
- CTA principal → `/mariage`, CTA secondaire → site démo.
- Composant : `src/components/home/wedding-card.tsx`, données Sanity.

### 6.2 Page `/mariage`

Route : `src/app/(site)/mariage/page.tsx`. Sections :

1. Hero — promesse, CTA « Parler de mon mariage », aperçu téléphone.
2. Les 4 moments — faire-part → RSVP → jour J → souvenirs.
3. Démo — Camille & Hugo, lien vers le site.
4. Fonctionnalités — 6 blocs.
5. Tableau de bord — « vous gardez la main ».
6. Process — 5 étapes + délais.
7. Tarifs — 3 formules + options, prix nets + mention art. 293 B.
8. Comparatif — plateformes gratuites vs agence vs AlexDevLab.
9. FAQ — schéma `FAQPage`.
10. Formulaire de contact qualifié (date, nombre d'invités, formule).

### 6.3 Sanity (portfolio)

- Singleton `weddingService` : hero, moments, fonctionnalités, process, FAQ,
  comparatif, référence démo.
- `pricingPlan` : ajouter un champ `offer: "web" | "wedding"` et
  un champ `vatNotice` (mention art. 293 B) plutôt que dupliquer le schéma.
- Révalidation : étendre le webhook existant au tag `wedding-service`.

### 6.4 SEO

- Requêtes visées : « site internet mariage », « site de mariage personnalisé »,
  « faire-part digital mariage », « RSVP mariage en ligne », « galerie photo
  mariage invités QR code ».
- JSON-LD : `Service` + `Offer` ×3 + `FAQPage`, intégré à `buildHomeJsonLd` /
  nouveau `buildWeddingJsonLd`.
- Ajout au `sitemap.ts`, canonical `/mariage`, image OG dédiée (ivoire).
- La démo indexée sert de preuve et de page d'atterrissage longue traîne.
- `llms.txt` : ajouter l'offre.

### 6.5 Formulaire de contact

Postmark a été retiré : le formulaire `/mariage` doit passer par le fournisseur
email retenu pour la plateforme (Resend) ou enregistrer les demandes dans
Sanity. Champs : prénoms, email, téléphone (facultatif), date du mariage, lieu,
nombre d'invités, formule pressentie, message, consentement.

---

## 7. Direction artistique

### 7.1 Page `/mariage` (AlexDevLab)

| Rôle | Valeur |
|---|---|
| Fond | Ivoire `#F4F0E8` |
| Surface | Papier `#FBF8F2` |
| Texte | Encre `#1E1B17` |
| Texte atténué | `#6B6359` |
| Accent | Doré champagne `#9A7B4F` (texte ≥ 18 px uniquement) / `#7A5F37` (petit texte, contraste AA) |
| Bande sombre | `#14120F` (rappel du portfolio) |
| Signature | Rouge AlexDevLab `#FF4D4D` réservé au logo |
| Display | Cormorant Garamond (300-600, italique) |
| Texte UI | Poppins (continuité avec le portfolio) |

Rayons 2-6 px, filets fins plutôt qu'ombres, beaucoup d'air.

### 7.2 Démo « Camille & Hugo » (éditorial moderne)

| Rôle | Valeur |
|---|---|
| Papier | `#EFEAE0` |
| Encre | `#1F1D1A` |
| Olivier (accent) | `#5E6B4E` |
| Terre | `#B08A6A` |
| Titres et chapô | **Newsreader** (validée ; Bodoni Moda abandonnée, traits trop fins) |
| Prénoms | **Pinyon Script** (validée) — prénoms du faire-part, du hero et signature uniquement |
| Texte | Jost |

Mise en page magazine : grands titres, photos plein cadre, colonnes, numérotation
des sections, légendes.

### 7.3 Accessibilité

- Contraste AA partout (le doré sur ivoire ne sert qu'aux grands textes).
- Formulaire RSVP : libellés visibles, erreurs sous le champ, cibles ≥ 44 px.
- Animation d'ouverture passable et désactivée en mouvement réduit.
- La majorité des invités ouvre le lien sur **mobile depuis WhatsApp** :
  conception mobile d'abord, LCP < 2 s en 4G.

---

## 8. Feuille de route

| Phase | Contenu | Durée | Sortie |
|---|---|---|---|
| **0. Validation** | Page `/mariage` + carte bento + démo statique | 2 sem. | Offre en ligne, premiers contacts |
| **1. MVP plateforme** | Multi-tenant, faire-part animé, infos, RSVP lien perso, tableau de bord (liste, détail d'un foyer, export, édition des textes, du programme et des dates), 2 designs standards | 6-8 sem. | Formule Intime vendable |
| **2. Essentiel** | Galerie invités, relances, PDF/QR, page `/jour-j`, questions personnalisées | 3-4 sem. | Formule Essentiel vendable |
| **2 bis. Signature** | Plan de table (éditeur de salle comme la démo : tables déplaçables et pivotables, sélection multiple, alertes ; recherche invité + cache hors ligne), QR personnel par foyer, affiche du QR jour J, co-gestion | 4-6 sem. | Formule Signature vendable, option plan de table pour Essentiel |
| **3. Options** | Multilingue, co-gestion, thèmes sur-mesure | 3 sem. | Options vendables |
| **4. Industrialisation** | Admin de création de mariage, import CSV assisté, achat de domaine automatisé, purge | continu | Intime en 4 h, Essentiel en 5 h |

Pour la phase 0, la démo peut être un site statique tant que la plateforme
n'existe pas. Elle sera migrée en tenant `demo` en phase 1.

### État de la phase 0 (branche `feat/wedding-service`, 2026-10-06)

Faite, en TDD (Vitest + Playwright), dans le portfolio :

- **`/mariage`** : en-tête propre à la page (sections, retour au portfolio,
  contact), contenu du singleton Sanity « Sites de mariage » avec repli
  statique, JSON-LD `Service` + 3 `Offer` + `FAQPage`, sitemap, `llms.txt`,
  formulaire de contact envoyé par Resend (limite 3 demandes/heure/IP).
- **`/mariage/demo`** : site de Camille & Hugo vu par Marie & Thomas
  (faire-part au sceau, programme par moments, réponses validées, barre du bas
  mobile) et aperçu du jour J (table, « en ce moment / ensuite », envoi de
  photos simulé et signé du nom du foyer).
- **`/mariage/demo/tableau-de-bord`** : tableau de bord des mariés jouable
  (indicateurs, réponses par moment, récap traiteur, foyers filtrables,
  création de faire-part avec lien personnel, éditeur du faire-part, détail
  d'une réponse (qui vient à quoi, régimes, chanson, petit mot, historique),
  dates clés (jour J, date limite, relance, ouverture de la galerie),
  programme éditable (moments et horaires datés), questions du faire-part, plan de
  table par personne (tables déplaçables, alertes), relances, galerie avec
  visionneuse, export CSV). Les sections absentes de certaines formules portent
  un badge de formule (carte et menu). Invités fictifs gardés dans le navigateur, partagés
  avec le site invité : une réponse donnée sur `/mariage/demo` apparaît aussitôt.
- **Home** : carte « Sites de mariage » dans la grille bento.
- **Logique réutilisable par la plateforme** (`src/lib/wedding/`) :
  `programmeAt`, `siteModeAt`, `tabBar`, `signPhoto`, `validateAnswer`,
  `countdownTo`, `formatHour` — fonctions pures, sans base de données.

Avant la mise en ligne : renseigner `RESEND_API_KEY`, `WEDDING_INQUIRY_FROM`
(domaine vérifié chez Resend) et `WEDDING_INQUIRY_TO`, puis publier le document
« Sites de mariage » dans le Studio (sinon le contenu par défaut s'affiche).

---

## 9. Indicateurs

- Conversion `/mariage` → demande de contact (cible 3-5 %).
- Taux de réponse RSVP à la date limite (cible > 85 %).
- Délai médian de réponse après envoi du lien.
- Photos par invité le jour J.
- Temps de production par formule (suivi pour le socle hybride).
- Demandes entrantes venant du lien « Site conçu par AlexDevLab ».

## 10. Risques

| Risque | Parade |
|---|---|
| Panne le jour J | Gel des déploiements, sonde de disponibilité, sous-domaine de secours |
| Wi-Fi du lieu inexistant | File d'upload avec reprise, upload possible jusqu'à J+30 |
| Saisonnalité (mai-septembre) | Ventes 6-12 mois avant, planning de production lissé |
| Personnalisation sans fin | Allers-retours comptés, jalons validés par écrit |
| Concurrence gratuite | Démo très soignée, tableau de bord, données privées |
| Données de santé (allergies) | Consentement explicite, texte libre facultatif, purge J+1 mois |
| Domaine perdu en fin de contrat | Rappels, transfert proposé, archive sur sous-domaine |

## 11. Questions encore ouvertes

Aucune à ce stade.

Tranché le 2026-10-06 :

- franchise en base de TVA ; portfolio sur Vercel Hobby (passage Pro à prévoir) ;
- base de données **Neon** (Francfort) + Drizzle, auth **Better Auth** + lien
  magique via Resend, fonctions Vercel en `fra1` (Supabase écarté) ;
- pas de commission partenaires ; univers « BUILD MODE » abandonné ;
- polices de la démo : Newsreader + Pinyon Script ; emails via Resend ;
- grille Intime 290 € / Essentiel 490 € / Signature 890 € (Prestige supprimé,
  ses briques passent en options) ; moments illimités dans toutes les formules ;
- questions : de base partout ; questions personnalisées incluses dès
  Essentiel, en option à 40 € avec Intime (révisé le 2026-10-06 : les mariés
  les écrivent eux-mêmes dans le tableau de bord) ;
- tableau de bord : les mariés modifient eux-mêmes textes, programme et dates
  dans toutes les formules ; un aller-retour ne porte que sur le design ;
- plan de table numérique en option à 150 € avec Essentiel (sans QR
  personnel), face à Moment de Vie qui l'inclut dès 299 € ;
- pas de papeterie (ce n'est pas notre métier) : Signature passe de 990 € à
  890 €, l'option « supports print » disparaît ; on garde les fichiers à
  imprimer générés depuis le site (faire-part PDF + QR, affiche du QR jour J) ;
- Signature repositionnée « un univers créé pour vous, du faire-part au jour
  J » : direction artistique, animation sur-mesure, plan de table numérique par QR,
  QR personnel par foyer, co-gestion ; statistiques pour tous ;
- faire-part animé et page « notre histoire » dans toutes les formules ;
  compte à rebours à partir d'Essentiel ; dress code en une ligne visible (hors
  FAQ) en Intime, section illustrée avec nuancier à partir d'Essentiel ; Essentiel = galerie + relances +
  PDF ; Signature conservée (direction artistique, animation sur-mesure) ;
- galerie invités sans modération : publication directe, retrait après coup ;
- starter kit du tableau de bord (`STARTER-KIT.md`) : code partagé en paquets
  privés (`wedding-core`, `dashboard-ui`) une fois la démo finalisée ; contenu
  modifiable par les mariés en Postgres ; FAQ, lieux et dress code rédigés par
  AlexDevLab dans Sanity ; fonction hors formule masquée ; renvoi manuel du
  lien inclus partout ; connexion réservée aux mariés et aux personnes qu'ils
  invitent selon la formule (Better Auth) ; droits par feature flags
  (plateforme, formule, mariage, membre) plutôt que par rôles ; pas de limite
  au nombre de personnes invitées ;
- pas de marque dédiée : le service s'appelle « Sites de mariage » par
  AlexDevLab. Une marque propre ne se justifiera que si l'activité mariage pèse
  réellement ; piste gardée pour ce moment-là : **Les Conviés**
  (`lesconvies.fr` et `.com` libres au 2026-10-06, INPI et Instagram non
  vérifiés).
