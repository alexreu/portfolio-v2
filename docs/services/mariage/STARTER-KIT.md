# Starter kit du tableau de bord mariés

Plan du 2026-10-06, décisions prises le même jour (§8). Complète `PLAN.md`
(§4.5 tableau de bord, §5 infrastructure, §8 feuille de route). Rien n'est
codé : ce document fixe le périmètre, l'ordre des lots et les règles.

**Préalable** : la démo `/mariage/demo/tableau-de-bord` est finalisée dans le
portfolio avant tout transfert. Le lot 2 extrait un code terminé, pas un code
en cours ; d'ici là, le kit n'est pas commencé.

## 1. Ce qu'est le starter kit

Le socle de la **plateforme mariages** (nouveau repo multi-tenant, `PLAN.md`
§5.1), côté mariés : un tableau de bord réel, branché sur Neon, dont **les
fonctions dépendent de la formule et des options achetées**.

Ce n'est pas un modèle qu'on clone par client. Une seule application sert N
mariages, et chaque mariage porte sa formule. On crée un mariage, on choisit
Intime, Essentiel ou Signature et les options : le tableau de bord se compose
tout seul.

Il reprend la démo `/mariage/demo/tableau-de-bord`, déjà écrite pour ça :

- la logique métier est pure et testée (`src/lib/wedding/`,
  `src/lib/wedding-dashboard/`), sans dépendance au contenu de la démo ;
- l'interface ne connaît que `state` et `dispatch` : seul le magasin change
  (`localStorage` dans la démo, serveur dans la plateforme).

Hors périmètre : le site des invités (il réutilise le même cœur, piste parallèle
de la phase 1 de `PLAN.md` §8), l'achat de domaines, le PDF du faire-part
(lot 6, mais son rendu est un chantier à part).

## 2. Le principe : des droits calculés depuis la formule

### 2.1 Catalogue

Une seule source de vérité, pure, dans le cœur partagé :

```ts
type Plan = "intime" | "essentiel" | "signature";

type OptionKey =
    | "questions"      // Intime
    | "galerie"        // Intime
    | "faire-part-pdf" // Intime
    | "plan-de-table"  // Essentiel
    | "qr-foyer"       // Intime, Essentiel
    | "co-gestion"     // Intime, Essentiel
    | "bilingue"       // toutes
    | "prolongation"   // toutes, sans effet sur les fonctions (durée)
    | "express";       // toutes, sans effet sur les fonctions (délai)

type Feature =
    | "invites" | "reponses" | "statistiques" | "export-csv" | "recap-traiteur"
    | "reponse-papier" | "activite" | "renvoi-lien"
    | "edition-faire-part" | "edition-programme" | "edition-dates"
    | "questions-perso" | "relances" | "galerie" | "faire-part-pdf"
    | "compte-a-rebours" | "dress-code-illustre"
    | "plan-de-table" | "qr-foyer" | "co-gestion" | "bilingue";

type Offer = { readonly plan: Plan; readonly options: readonly OptionKey[] };
```

Fonctions pures, testées par leur interface :

- `featuresOf(offer): ReadonlySet<Feature>` : ce que le mariage peut faire ;
- `can(offer, feature): boolean` ;
- `optionsFor(plan): readonly OptionKey[]` : options proposables (une option
  déjà incluse dans la formule n'est pas vendable, ex. galerie en Essentiel) ;
- `validateOffer(offer): Result<Offer, OfferIssue[]>` : refuse une option hors
  formule ou en double ;
- `upgrade(offer, next): Result<Offer, …>` : on ne descend jamais de formule
  une fois des données saisies (§7).

### 2.2 Matrice formule × fonctions

| Fonction (section du tableau de bord) | Intime | Essentiel | Signature |
|---|---|---|---|
| Vue d'ensemble, statistiques, activité | ✓ | ✓ | ✓ |
| Invités : liste, filtres, détail, historique, lien personnel | ✓ | ✓ | ✓ |
| Renvoyer son lien à un foyer, à la main | ✓ | ✓ | ✓ |
| Réponse papier saisie par les mariés | ✓ | ✓ | ✓ |
| Récap traiteur + export CSV | ✓ | ✓ | ✓ |
| Édition du faire-part, du programme, des dates | ✓ | ✓ | ✓ |
| Questions personnalisées | option 40 € | ✓ | ✓ |
| Relances automatiques | — | ✓ | ✓ |
| Galerie des invités (retrait, ZIP) | option 190 € | ✓ | ✓ |
| Faire-part PDF + QR | option 60 € | ✓ | ✓ |
| Plan de table numérique | — | option 150 € | ✓ |
| QR personnel par foyer | option 90 € | option 90 € | ✓ |
| Connexion des deux mariés | ✓ | ✓ | ✓ |
| Co-gestion : inviter témoins ou wedding planner (§5) | option 60 € | option 60 € | ✓ |
| Site bilingue | option 150 € | option 150 € | option 150 € |

Côté site invité, les mêmes droits décident du compte à rebours, du dress code
illustré, de l'onglet photos et de « Ma table ».

Un **test de cohérence** croise le catalogue avec la grille affichée sur
`/mariage` (prix des formules, prix et formules éligibles de chaque option) :
une grille modifiée d'un côté sans l'autre casse la CI.

### 2.3 Où s'appliquent les droits

Les droits de la formule sont la couche 2 des feature flags (§5.3) ; voici où
ils s'appliquent.

1. **Interface** : la navigation et les sections sont filtrées par les flags. Une
   fonction absente est **masquée**, pas grisée : la page `/mariage` promet
   « pas d'upsell ». Une page « Votre formule » liste ce qui est inclus et
   comment ajouter une option (par message, pas par paiement en ligne).
2. **Serveur** : chaque action serveur commence par
   `assertAccess(context, flag, niveau)` (§5.3). L'interface n'est jamais la
   seule barrière.
3. **Site invité** : mêmes droits, mêmes fonctions.
4. **Tâches planifiées** : les relances ne partent que pour les mariages qui
   ont `relances` ; la révélation des tables que pour `plan-de-table`.

### 2.4 La démo profite du même mécanisme

La démo passe d'une formule Signature figée à un sélecteur
(`?formule=intime|essentiel|signature`). Le prospect venu pour Intime voit
exactement son futur tableau de bord. Les badges ajoutés le 2026-10-06
(`src/lib/wedding-dashboard/plans.ts`) sont alors calculés depuis le catalogue
au lieu d'une table écrite à la main.

## 3. Architecture

### 3.1 Partage du code entre portfolio et plateforme

Recommandé : le repo de la plateforme est un **workspace pnpm** :

```
mariage-platform/
├── packages/core/          # @alexdevlab/wedding-core — TypeScript pur, sans React
│   ├── offer/              # catalogue, featuresOf, can, validateOffer, upgrade
│   ├── wedding/            # ex src/lib/wedding (programme, mode, réponses…)
│   └── dashboard/          # ex src/lib/wedding-dashboard (stats, plan de table…)
├── packages/dashboard-ui/  # composants du tableau de bord, magasin injecté
└── apps/platform/          # Next.js 16 : routes, actions serveur, Drizzle, auth
```

`core` et `dashboard-ui` sont publiés en privé sur GitHub Packages (décidé le
2026-10-06). Le portfolio les consomme pour la démo : un seul code, la démo ne
dérive plus du produit. Le transfert a lieu une fois la démo finalisée.

### 3.2 Le magasin, seul endroit qui change

L'interface reçoit un `DashboardStore` (même forme que `createDemoStore`
aujourd'hui) :

```ts
type DashboardStore = {
    readonly getSnapshot: () => DashboardState;
    readonly subscribe: (listener: () => void) => () => void;
    readonly dispatch: (command: DashboardCommand) => Promise<Result<void, Issue[]>>;
};
```

Deux adaptateurs :

- **`localStorageStore`** (démo) : la fonction actuelle, inchangée sur le fond ;
- **`serverStore`** (plateforme) : `dispatch` appelle une action serveur ; mise
  à jour optimiste avec `useOptimistic`, remplacée par la réponse du serveur,
  ou annulée avec le message d'erreur.

Le `demoReducer` actuel (629 lignes, 18 actions) est découpé en **commandes
pures par domaine** : `(état du domaine, commande, contexte) → Result<changements, issues>`.
La démo applique les changements à l'état local ; le serveur les traduit en
écritures Drizzle. Validation, horodatage et activité restent dans le cœur et
sont testés une fois.

Le contexte injecté porte les effets : `now`, `newId`, `offer`. Aucune fonction
du cœur ne lit l'horloge ni ne tire d'identifiant elle-même.

### 3.3 Ce que la démo code en dur, et qui doit devenir une donnée

| Aujourd'hui | Dans le kit |
|---|---|
| `GroupKey` = 4 groupes fixes | groupes libres par mariage (`household_group`) |
| `DINNER = "diner"` | moment marqué « placé à table » (`moment.seated`) |
| `parisDay`, `parisOffset` | `wedding.timezone` : mariages à La Réunion (UTC+4) comme en métropole |
| `SealTone` olive/terre/encre | jetons du thème (`weddingTheme`) |
| Photos statiques de la démo | photos R2 (`photo`, `PLAN.md` §5.5) |
| Activité limitée à 30 entrées en mémoire | table `activity`, paginée |
| Graine de démo (`wedding-dashboard-demo.ts`) | tenant `demo` semé en base, réinitialisé chaque nuit |

## 4. Données

### 4.1 Le contenu modifiable passe de Sanity à Postgres

`PLAN.md` §5.6-5.7 mettait programme, horaires et textes dans Sanity. Depuis
que les mariés les modifient eux-mêmes, ce contenu va en **Postgres** (décidé
le 2026-10-06) : une seule source, transactionnelle, avec les droits du membre
connecté.

| Rédigé par | Contenu | Stockage |
|---|---|---|
| Les mariés, depuis le tableau de bord | Faire-part (prénoms, lieu, mot d'accueil, sceau), programme et horaires, dates clés, questions, invités, plan de table | Postgres |
| AlexDevLab, dans le Studio | FAQ, lieux (adresse, itinéraire, carte), dress code, notre histoire, photos du couple, thème | Sanity (dataset `weddings`) |

Les mariés demandent un changement de FAQ, de lieu ou de dress code par
message ; il est inclus pendant toute la mise en ligne (FAQ de `/mariage`).

### 4.2 Schéma (complète `PLAN.md` §5.6)

```
wedding          + plan, options text[], timezone, design jsonb (prénoms, lieu,
                   mot d'accueil, ton du sceau), answer_deadline, reminder_at,
                   gallery_opens_at, tables_reveal_at
wedding_offer_log(wedding_id, plan, options, changed_by, changed_at)  -- historique des formules
household_group  (id, wedding_id, label, position)
moment           (wedding_id, key, title, position, seated bool)
slot             (id, wedding_id, moment_key, title, place, day_offset, start, end)
question         (id, wedding_id, label, placeholder, position)
room             (wedding_id, name, size, head jsonb, entrance jsonb)
seating_table    (id, wedding_id, number, name, capacity, x, y)
guest            + table_id NULL, labels jsonb
activity         (id, wedding_id, at, kind, text, detail, subject)
```

- Toute lecture et écriture passe par un **dépôt** qui impose `wedding_id` du
  membre connecté, testé contre une branche Neon.
- Les correspondances lignes ↔ types du cœur (`HouseholdRecord`, `MomentPlan`…)
  sont des fonctions pures, testées.

## 5. Accès au tableau de bord

Règle : **seuls les mariés et les personnes qu'ils invitent** entrent, et
chacun ne voit que ce que la formule et les mariés lui ouvrent. Les invités du
mariage n'ont jamais de compte : leur lien personnel (`PLAN.md` §5.8) ne donne
accès qu'à leur réponse.

Deux briques distinctes :

- **Better Auth** répond à « qui est-ce, et de quel mariage est-il membre ? »
  (identité, connexion, invitations) ;
- **les feature flags** (§5.3) répondent à « que peut-il voir et modifier ? ».

Pas de rôles figés du type « co-gestionnaire = tout sauf X » : les droits d'un
membre sont une liste de flags, choisie par les mariés.

### 5.1 Better Auth : ce qu'on prend

| Plugin | Usage | Réglage |
|---|---|---|
| `magicLink` | Connexion sans mot de passe, email envoyé par Resend | `disableSignUp: true` (aucun compte créé à la connexion), `expiresIn: 900` (15 min ; défaut 5 min), `storeToken: "hashed"` |
| `organization` | **Une organisation = un mariage** : membres, invitations liées à une adresse | `allowUserToCreateOrganization: false` (seul l'admin crée un mariage), `invitationExpiresIn` 72 h (défaut 48 h), `membershipLimit` relevé : aucune limite côté produit |
| `admin` | Compte AlexDevLab : créer les comptes des mariés, consulter un mariage (impersonation en lecture seule, journalisée) | rôle `admin` réservé à AlexDevLab |
| `passkey` | Connexion de l'admin, obligatoire ; proposée aux mariés plus tard | — |

Better Auth tourne sur la même base Neon via son adaptateur Drizzle : ses
tables (`user`, `session`, `organization`, `member`, `invitation`…) vivent à
côté des nôtres, `organization.id` sert de `wedding_id`.

On n'utilise **pas** le contrôle d'accès de Better Auth (`createAccessControl`,
`dynamicAccessControl`) pour les fonctions du tableau de bord : il raisonne en
rôles. Côté Better Auth, un membre n'a que deux rôles techniques, `owner` (les
mariés) et `member` (les personnes invitées) ; tout le reste passe par les
flags.

### 5.2 Comptes et connexion

- Aucune page d'inscription. À la création du mariage (admin, lot 8),
  AlexDevLab crée **les comptes des deux mariés** (`owner`), dans toutes les
  formules.
- `disableSignUp` bloque aussi une personne invitée qui n'a pas encore de
  compte. D'où la règle : **inviter crée le compte** (sans mot de passe, via
  l'API serveur) en même temps que l'invitation Better Auth. Le lien magique
  fonctionne alors pour cette adresse, et pour elle seule.
- La page de connexion répond toujours « Si cette adresse est connue, un lien
  vient de partir » : impossible de savoir qui a un compte.
- Lien à usage unique, 15 minutes, ouvrable sur un autre appareil que celui qui
  l'a demandé (demandé sur l'ordinateur, ouvert sur le téléphone). Limite de
  débit du plugin, doublée d'Upstash : 3 demandes par adresse et par heure.
- Session de 30 jours ; « Se déconnecter de tous les appareils » dans les
  réglages.

### 5.3 Feature flags

Un flag = une fonction du tableau de bord ou du site invité, à une granularité
plus fine que les sections quand les données l'exigent. Exemples :

```
invites                invites.regimes        invites.export
programme              dates                  faire-part
questions-perso        relances               galerie
galerie.retrait        plan-de-table          qr-foyer
co-gestion             bilingue
```

`invites.regimes` est séparé parce que les contraintes alimentaires sont des
données de santé potentielles (`PLAN.md` §5.9) : un témoin peut gérer la liste
sans voir les allergies.

**Résolution en quatre couches**, une fonction pure du cœur,
`resolveAccess(context) → (flag) => "aucun" | "lecture" | "modification"` :

| Couche | Qui la règle | Rôle | Stockage |
|---|---|---|---|
| 1. Plateforme | AlexDevLab | Coupure d'urgence (ex. envoi de photos suspendu pendant un incident), fonction en test sur quelques mariages | table `platform_flag` |
| 2. Formule | L'achat | `featuresOf(offer)` (§2.1) : ce que le mariage a payé | `wedding.plan`, `wedding.options` |
| 3. Mariage | AlexDevLab, admin | Exception datée et motivée : geste commercial, accès anticipé, retrait | table `wedding_flag` (flag, on/off, motif, expire_at) |
| 4. Membre | Les mariés | Ce que chaque personne invitée voit ou modifie | table `member_flag` (member_id, flag, niveau) |

- Un flag n'est actif pour un mariage que si les couches 1 à 3 l'autorisent ;
  la couche 3 peut ajouter ce que la formule n'inclut pas.
- Les mariés (`owner`) ont tous les flags actifs du mariage, en modification.
- Une personne invitée n'a **que** les flags que les mariés lui ont ouverts,
  et jamais un flag inactif pour le mariage.
- Restent réservés aux mariés, hors flags : gérer les accès, demander l'export
  complet, la page « Votre formule ».
- Chaque action serveur appelle `assertAccess(context, flag, niveau)`. Le
  contexte (formule, flags plateforme, flags du mariage, flags du membre) est
  chargé une fois par requête et passé en paramètre : la fonction ne lit
  rien elle-même.
- Le site invité n'utilise que les couches 1 à 3.

Pas d'outil externe (LaunchDarkly, PostHog…) : quatre tables, une fonction
pure, des données qui restent en Europe. Si une coupure d'urgence doit
fonctionner même base indisponible, la couche 1 pourra passer sur Vercel Edge
Config avec le Flags SDK sans toucher aux autres couches.

### 5.4 Inviter quelqu'un

- La page « Accès » n'apparaît que si le flag `co-gestion` est actif pour le
  mariage. Réservée aux mariés.
- **Pas de nombre limite** : les mariés invitent qui ils veulent.
- Le marié saisit un prénom et une adresse, puis coche ce que la personne voit
  et modifie. Deux modèles pour aller vite, ajustables flag par flag :
  - **Témoin** : invités en lecture (sans régimes), plan de table et galerie en
    modification ;
  - **Wedding planner** : tous les flags actifs du mariage, en modification.
- L'invitation (Better Auth) sert une fois, dure 72 heures et est liée à
  l'adresse : transférée à quelqu'un d'autre, elle ne sert à rien.
- Changer les flags d'une personne : effet à la requête suivante. Retirer un
  accès : sessions de la personne supprimées tout de suite.
- Option `co-gestion` retirée ou fin de mise en ligne : accès des personnes
  invitées suspendus, ceux des mariés passent en lecture seule (§7).

### 5.5 Cas particuliers

- **Un marié change d'adresse ou la perd** : l'autre marié la remplace depuis
  « Accès » ; si les deux sont bloqués, AlexDevLab la change depuis l'admin
  après vérification (appel ou message habituel du couple).
- **Accès AlexDevLab** : passkey obligatoire ; consultation d'un mariage en
  lecture seule, journalisée, sans modification des réponses.

Tables ajoutées au schéma §4.2 (en plus de celles de Better Auth) :

```
platform_flag (flag, enabled, wedding_ids text[] NULL, reason, updated_at)
wedding_flag  (wedding_id, flag, enabled, reason, expires_at NULL, set_by, set_at)
member_flag   (member_id, flag, level[read|write])
access_log    (id, wedding_id, user_id, action[login|export|admin_view|access_change|flag_change], at)
```

## 6. Lots

Chaque lot en TDD : un test, puis le code minimal. Durées pour une personne.

| Lot | Contenu | Sortie | Durée |
|---|---|---|---|
| **0. Amorçage** | Repo workspace, Next.js 16, Drizzle + Neon (branche par prévisualisation), Vitest, Playwright, CI, Vercel Pro `fra1`, gel des déploiements le jour J | Une page vide déployée, la CI verte | 1 sem. |
| **1. Catalogue et flags** | `core/offer` : types, `featuresOf`, `can`, `optionsFor`, `validateOffer`, `upgrade` ; `core/flags` : `resolveAccess`, `assertAccess`, modèles « Témoin » et « Wedding planner » ; test de cohérence avec la grille de `/mariage` | Matrice §2.2 et résolution des quatre couches testées cas par cas | 4-5 j |
| **2. Extraction du cœur** | Déplacer `src/lib/wedding*` dans `core`, rendre configurables les valeurs codées en dur (§3.3), découper le reducer en commandes ; le portfolio consomme le paquet | Démo inchangée pour le visiteur, tous les tests repris | 1-1,5 sem. |
| **3. Persistance** | Schéma Drizzle §4.2, migrations, dépôts isolés par mariage, correspondances lignes ↔ types, tenant `demo` semé | Lecture et écriture d'un mariage complet en test d'intégration | 1-1,5 sem. |
| **4. Accès** | §5 : Better Auth (`magicLink`, `organization`, `admin`, `passkey`) sans inscription, comptes des mariés créés par l'admin, tables de flags, chargement du contexte d'accès par requête, journal | Les deux mariés se connectent et ne voient que leur mariage ; une adresse inconnue n'obtient rien | 1 sem. |
| **5. Socle Intime** | `dashboard-ui` + `serverStore` : vue d'ensemble, invités (création, **import CSV**, détail, réponse papier, copier et renvoyer le lien), récap traiteur, export CSV (journalisé), édition faire-part / programme / dates, page « Votre formule » | **Formule Intime vendable côté mariés** | 2 sem. |
| **6. Modules Essentiel** | Questions perso, relances (Vercel Cron + Resend + `email_log`), galerie (R2, retrait, ZIP), faire-part PDF + QR | Formule Essentiel vendable ; options Intime actives | 2-3 sem. |
| **7. Modules Signature** | Plan de table (éditeur de la démo, révélation à l'heure dite, liste traiteur par table), QR par foyer, co-gestion (page « Accès », invitations et flags par personne, §5.4) | Formule Signature vendable ; options Essentiel actives | 2-3 sem. |
| **8. Admin AlexDevLab** | Créer un mariage (formule + options + fuseau), changer de formule (montée seulement), consulter en lecture seule, déclencher l'export avant purge | Un mariage livré sans toucher à la base | 1 sem. |
| **9. Démo branchée** | La démo du portfolio utilise `dashboard-ui` + `localStorageStore` et le sélecteur de formule ; badges calculés depuis le catalogue | La démo montre chaque formule telle qu'elle est vendue | 3-4 j |

Total : **11 à 14 semaines** pour le tableau de bord. Le site invité (réponse
par lien personnel, galerie, jour J) avance en parallèle sur le même cœur ; les
lots 5, 6 et 7 en dépendent pour être vendables de bout en bout.

### Tests attendus par lot

- **Unitaires (core)** : chaque cellule de la matrice, chaque commande
  (validation, changements produits, activité), chaque correspondance de ligne.
- **Intégration (dépôts)** : isolation entre deux mariages, refus d'une action
  hors formule ou hors flag même appelée directement, refus d'un lien magique
  pour une adresse inconnue, invitation inutilisable par une autre adresse, un
  témoin sans `invites.regimes` ne reçoit jamais les régimes (ni à l'écran ni
  dans l'export).
- **Bout en bout** : un parcours par formule (Intime ne voit ni relances ni
  plan de table ; Signature voit tout), mobile et desktop, comme aujourd'hui.

## 7. Règles de gestion

- **Montée de formule** en cours de contrat : autorisée, effet immédiat,
  tracée dans `wedding_offer_log`. Facturation hors plateforme.
- **Descente** : refusée dès que des données dépendent de la fonction (tables
  placées, questions posées, photos reçues). Avant toute saisie, AlexDevLab
  peut corriger une erreur depuis l'admin.
- **Option retirée par erreur** : les données sont masquées, jamais supprimées,
  jusqu'à la purge RGPD.
- **Fin de mise en ligne** : le tableau de bord passe en lecture seule, export
  disponible jusqu'à la purge (`PLAN.md` §5.9).

## 8. Ce qui manque à la démo pour un vrai produit

- Import CSV des invités (condition de rentabilité d'Intime, `PLAN.md` §2.4).
- Réglages du mariage : contact affiché, domaine, page « Accès » (§5).
- Bouton « Renvoyer le lien » sur le détail d'un foyer (email au foyer, tracé
  dans l'activité), inclus dans toutes les formules.
- Page de connexion et page « Accès » : inviter une personne, choisir ses flags
  (modèles « Témoin » et « Wedding planner »), voir le tableau de bord avec ses
  yeux (simulés dans la démo, sans email).
- Téléchargement ZIP de la galerie, export PDF du récap traiteur.
- Export complet avant purge, page « Vos données ».
- États vides et erreurs réseau du `serverStore` (la démo n'en a pas).

## 9. Décisions

Prises le 2026-10-06 :

1. **Partage du code** : paquets privés `wedding-core` + `dashboard-ui` sur
   GitHub Packages, après finalisation de la démo (§3.1).
2. **Contenu modifiable par les mariés en Postgres** (§4.1).
3. **Fonction hors formule masquée**, jamais grisée (§2.3).
4. **FAQ, lieux et dress code rédigés par AlexDevLab** dans Sanity ; les mariés
   demandent les changements par message (§4.1).
5. **Renvoi manuel du lien à un foyer inclus dans toutes les formules** ; les
   relances automatiques et groupées restent à partir d'Essentiel (§2.2).
6. **Connexion réservée aux mariés et aux personnes qu'ils invitent**, selon la
   formule : Better Auth (`magicLink` sans inscription, `organization`,
   `admin`, `passkey`), invitations liées à une adresse (§5.1, §5.2).
7. **Feature flags plutôt que rôles** : quatre couches (plateforme, formule,
   mariage, membre) résolues par une fonction pure ; les mariés choisissent
   flag par flag ce que chaque personne invitée voit ou modifie (§5.3).
8. **Pas de nombre limite** de personnes invitées : les mariés gèrent (§5.4).
