# Starter kit du tableau de bord mariés

Plan du 2026-10-06, mis à jour le 2026-10-08 (état de la démo, identifiants en
anglais, emplacement du paquet). Complète `PLAN.md` (§4.5 tableau de bord, §5
infrastructure, §8 feuille de route).

**Où on en est** : la démo `/mariage/demo/tableau-de-bord` couvre déjà la
plupart des fonctions (§1.1). Le paquet `@alexreu/wedding-core` (lots 1 et
2) est construit dans `~/Developer/mariage-platform` (§3.1, §3.5) : 369 tests,
build ESM + types, publié en `0.1.0` sur GitHub Packages depuis le repo privé `alexreu/mariage-platform` (2026-10-08). La démo garde son propre code jusqu'au lot
9 ; d'ici là, toute évolution de la démo se reporte dans le paquet.

## 1. Ce qu'est le starter kit

Le socle de la **plateforme mariages** (nouveau repo multi-tenant, `PLAN.md`
§5.1), côté mariés : un tableau de bord réel, branché sur Neon, dont **les
fonctions dépendent de la formule et des options achetées**.

Ce n'est pas un modèle qu'on clone par client. Une seule application sert N
mariages, et chaque mariage porte sa formule. On crée un mariage, on choisit
Intime, Essentiel ou Signature et les options : le tableau de bord se compose
tout seul.

### 1.1 Ce que la démo fait déjà (2026-10-08)

- Une page par fonction (invités, programme et dates, plan de table,
  faire-part, relances, galerie, accès), menu repliable.
- Invités : création, modification, retrait, réponse papier, détail d'un foyer
  avec historique, aperçu du site par les mariés, export CSV.
- **Droits par personne** (`access.ts`, `permissions.ts`) : page « Accès »,
  modèles « Témoin » et « Wedding planner », niveau par fonction, régimes
  cachés à qui n'y a pas droit, sélecteur « Voir en tant que ». C'est la
  couche 4 des feature flags (§5.3), déjà jouable.
- Impressions générées dans le navigateur (`pdf-lib`, QR par `uqr`) :
  faire-part commun ou par foyer, affiches du QR du plan de table et de la
  galerie, récap traiteur.
- Pages ouvertes par les QR du jour J : plan de table, galerie.
- Site invité : modes avant, jour J, lendemain ; date limite ; réponse « à
  compléter » ; ajout à l'agenda.
- Une seule relance automatique, J-15 avant la date limite, date réglable.
- Sélecteur « Formule » dans le bandeau de démo (et `?formule=` sur le site
  invité) : menu, pages et site suivent Intime, Essentiel ou Signature ; une
  page hors formule le dit et propose de passer à Signature.
- « Renvoyer son lien » sur le détail d'un foyer, noté dans l'activité.
- « Importer une liste » : CSV ou collage, lignes à corriger listées.
- Page « Réglages » : groupes libres, contact, adresse du site, fuseau, formule,
  « Vos données » (export JSON complet).
- Connexion simulée par lien e-mail (`/mariage/demo/connexion`), même réponse
  pour toute adresse, le lien ouvre la vue de la personne.

## 2. Le principe : des droits calculés depuis la formule

### 2.1 Catalogue

Une seule source de vérité, pure, dans le cœur partagé. **Identifiants en
anglais** (règle du 2026-10-08) : ils s'écrivent en base et dans le code ; les
noms affichés restent en français dans le catalogue.

```ts
type PlanId = "intimate" | "essential" | "signature"; // Intime, Essentiel, Signature

type OptionId =
    | "questions"         // Intime
    | "gallery"           // Intime
    | "invitation-print"  // Intime : faire-part PDF + QR
    | "seating"           // Essentiel : plan de table numérique
    | "household-qr"      // Intime, Essentiel : QR personnel par foyer
    | "collaborators"     // Intime, Essentiel : co-gestion
    | "bilingual"         // toutes
    | "extension"         // toutes : prolongation, sans effet sur les fonctions
    | "express";          // toutes : livraison express, sans effet sur les fonctions

type Flag =
    | "guests" | "guests.diets" | "guests.export"
    | "dates" | "programme" | "invitation" | "questions"
    | "reminders" | "gallery" | "invitation-print"
    | "seating" | "household-qr" | "collaborators" | "bilingual"
    | "countdown" | "dress-code.illustrated";

type Offer = { readonly plan: PlanId; readonly options: readonly OptionId[] };
```

Fonctions pures, testées par leur interface :

- `flagsOf(offer): ReadonlySet<Flag>` : ce que le mariage a payé ;
- `includes(offer, flag): boolean` ;
- `optionsFor(plan): readonly OptionId[]` : options proposables (une option
  déjà incluse dans la formule n'est pas vendable, ex. galerie en Essentiel) ;
- `validateOffer(offer): Result<Offer, OfferIssue[]>` : refuse une option hors
  formule ou en double ;
- `changeOffer(current, next, flagsInUse(state)): Result<Offer, OfferIssue[]>` :
  on ne retire jamais une fonction dont des données dépendent (§7) ;
- `optionGrid()` et `availabilityNote(flag)` : la grille d'options de
  `/mariage` et les badges de la démo, calculés depuis le catalogue.

### 2.2 Matrice formule × fonctions

| Fonction | Flag | Intime | Essentiel | Signature |
|---|---|---|---|---|
| Vue d'ensemble, statistiques, activité | — | ✓ | ✓ | ✓ |
| Invités : liste, détail, historique, lien, renvoi du lien, réponse papier | `guests` | ✓ | ✓ | ✓ |
| Régimes et allergies | `guests.diets` | ✓ | ✓ | ✓ |
| Récap traiteur + export CSV | `guests.export` | ✓ | ✓ | ✓ |
| Édition des dates, du programme, du faire-part | `dates`, `programme`, `invitation` | ✓ | ✓ | ✓ |
| Questions personnalisées | `questions` | option 40 € | ✓ | ✓ |
| Relance automatique | `reminders` | — | ✓ | ✓ |
| Galerie des invités (retrait, ZIP, affiche) | `gallery` | option 190 € | ✓ | ✓ |
| Faire-part PDF + QR | `invitation-print` | option 60 € | ✓ | ✓ |
| Compte à rebours, dress code illustré (site invité) | `countdown`, `dress-code.illustrated` | — | ✓ | ✓ |
| Plan de table numérique | `seating` | — | option 150 € | ✓ |
| QR personnel par foyer | `household-qr` | option 90 € | option 90 € | ✓ |
| Co-gestion : page « Accès » (§5) | `collaborators` | option 60 € | option 60 € | ✓ |
| Site bilingue | `bilingual` | option 150 € | option 150 € | option 150 € |

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
2. **Serveur** : chaque commande passe par `runCommand` (§3.2), qui vérifie
   les flags du mariage et le niveau de la personne avant toute écriture.
   L'interface n'est jamais la seule barrière.
3. **Site invité** : mêmes flags (couches 1 à 3).
4. **Tâches planifiées** : la relance ne part que pour les mariages qui ont
   `reminders` ; la révélation des tables que pour `seating`.

### 2.4 La démo profite du même mécanisme

La démo passe d'une formule Signature figée à un sélecteur
(`?formule=intime|essentiel|signature`, segment d'URL pour des visiteurs
français). Le prospect venu pour Intime voit exactement son futur tableau de
bord. Les badges de `src/lib/wedding-dashboard/plans.ts`, aujourd'hui écrits à
la main, sont alors calculés depuis le catalogue.

## 3. Architecture

### 3.1 Un dossier à part, en workspace pnpm

Le paquet se construit **hors du portfolio**, dans un nouveau repo frère :
`~/Developer/mariage-platform`. Il ne vit pas dans `portfolio-v2` :

- c'est le futur repo de la plateforme (`PLAN.md` §5.1), qui accueillera
  `apps/platform` ; le créer maintenant évite un déménagement ;
- le portfolio reste un site Next.js simple, sans workspace ni build de
  paquet ;
- le paquet se publie depuis ce repo (GitHub Packages) et le portfolio le
  consomme comme n'importe quelle dépendance au lot 9.

```
mariage-platform/
├── packages/core/            # @alexreu/wedding-core — TypeScript pur, sans React
│   └── src/
│       ├── result.ts
│       ├── time/             # fuseau du mariage : jour local, décalage, heures
│       ├── offer/            # catalogue, flagsOf, optionsFor, validateOffer, changeOffer, flagsInUse
│       ├── access/           # niveaux, droits par personne, 4 couches, permissions par action
│       ├── guest-site/       # ex src/lib/wedding : programme, mode, réponses, agenda…
│       ├── dashboard/        # ex src/lib/wedding-dashboard : stats, plan de table, CSV…
│       ├── commands/         # commandes pures, runCommand, diff en changements
│       └── prints/           # sous-chemin « /prints » : PDF et QR (pdf-lib, uqr)
├── packages/dashboard-ui/    # plus tard : composants du tableau de bord, magasin injecté
└── apps/platform/            # plus tard : Next.js 16, actions serveur, Drizzle, auth
```

`core` est construit avec tsup (ESM + types), testé avec Vitest, typé en
strict. `dashboard-ui` attend que l'interface de la démo soit figée.

### 3.2 Commandes, changements, magasin

L'interface reçoit un `DashboardStore` (même forme que `createDemoStore`
aujourd'hui) :

```ts
type DashboardStore = {
    readonly getSnapshot: () => WeddingState;
    readonly subscribe: (listener: () => void) => () => void;
    readonly dispatch: (command: Command) => Promise<Result<void, CommandIssue[]>>;
};
```

Le `demoReducer` (900 lignes, 25 actions) devient des **commandes pures** :

```ts
runCommand(state, command, context) → Result<{ state, changes }, CommandIssue[]>
```

- `context` porte les effets : `at` (horodatage), `newId`, l'acteur (mariés,
  personne invitée avec ses droits, invité du mariage avec son foyer) et les
  flags actifs du mariage. Aucune fonction du cœur ne lit l'horloge ni ne tire
  d'identifiant elle-même.
- `runCommand` vérifie dans l'ordre : flag du mariage, niveau de l'acteur,
  validation des données (les mêmes validateurs que les formulaires), puis
  applique.
- `changes` est calculé par `diffState(before, after)` : une liste de
  `put` / `delete` par entité (foyer, moment, table, place, photo, personne
  invitée, entrée d'activité, et les blocs faire-part, dates, salle). Le
  serveur traduit chaque changement en écriture Drizzle ;
  `applyChanges(before, changes)` redonne exactement `after` (testé).

Deux adaptateurs du magasin :

- **`localStorageStore`** (démo) : applique `state` dans le navigateur ;
- **`serverStore`** (plateforme) : `dispatch` appelle une action serveur qui
  rejoue `runCommand` côté serveur ; mise à jour optimiste avec
  `useOptimistic`, remplacée par la réponse du serveur, ou annulée avec le
  message d'erreur.

### 3.3 Ce que la démo code en dur, et qui devient une donnée

| Démo | Paquet |
|---|---|
| `GroupKey` = 4 groupes fixes (`famille-1`…) | `groups: { id, label }[]` libres par mariage |
| `DINNER = "diner"` | `MomentPlan.seated` : le moment placé à table |
| `parisDay`, `parisOffset`, `Europe/Paris` | `WeddingState.timezone` (IANA) : La Réunion comme la métropole |
| `SealTone` olive / terre / encre | `tone: string`, jeton du thème ; couleurs d'impression passées en paramètre |
| Photos Unsplash redimensionnées par l'URL | `resize(src)` fourni par l'appelant (R2 + Cloudflare Images) |
| Activité limitée à 30 entrées | aucune limite dans le cœur ; la démo coupe à l'affichage |
| Identifiants d'activité construits sur l'heure | `context.newId()` |
| Galerie ouverte un jour (`galleryOpens`), tables révélées à une heure du jour J (`room.revealAt`) | `dates.galleryOpens` et `dates.tablesReveal` : **un jour et une heure** chacun (`Opening`), par défaut la veille à 10 h et le jour J à 10 h, entre une semaine avant et le jour J (décidé le 2026-10-08) |

### 3.4 Noms : démo → paquet

| Démo | Paquet |
|---|---|
| `aucun` / `lecture` / `modification` | `none` / `read` / `write` |
| `invites`, `invites.regimes`, `invites.export` | `guests`, `guests.diets`, `guests.export` |
| `faire-part`, `questions-perso`, `plan-de-table`, `relances`, `galerie` | `invitation`, `questions`, `seating`, `reminders`, `gallery` |
| page `acces` | page `access` (la route reste `/acces`) |
| modèles `temoin`, `planner`, `sur-mesure` | rôles `witness`, `planner`, `custom` |
| `grant` (niveau par fonction) d'une personne, `role` libre | `role`, `added`, `removed` (features), `title` libre |
| `can(viewer, action)`, `canSee(viewer, page)` | `useCheckFeatureFlag().has(feature)`, `canSee(features, page)` |
| régimes `aucune`, `vegetarien`, `vegan`, `sans-gluten`, `autre` | `none`, `vegetarian`, `vegan`, `gluten-free`, `other` |
| `answeredBy`: `invite` / `maries` | `guest` / `couple` |
| tons `olive`, `terre`, `encre` | `olive`, `earth`, `ink` |
| `DemoState`, `DemoAction`, `demoReducer` | `WeddingState`, `Command`, `runCommand` |

Les textes affichés (« Masqué », « Voir », « Modifier », « Végétarien »…)
restent en français, dans le paquet.

### 3.5 Ce que contient le paquet (2026-10-08)

| Dossier | Contenu | Tests |
|---|---|---|
| `time/` | Fuseau IANA : jour local, décalage à une heure donnée (changement d'heure compris), heures en français | 14 |
| `offer/` | Catalogue, offre, `changeOffer`, `flagsInUse`, grille et badges | 22 |
| `features/` | 30 features, jeu par rôle, ajustements, plafond des flags du mariage, page Accès par fonction, visibilité des pages | 46 |
| `react/` | Sous-chemin `/react` : `FeatureFlagProvider`, `FeatureScope`, `useCheckFeatureFlag` | 7 |
| `guest-site/` | Programme, modes, barre du bas, réponses, signature des photos, compte à rebours, .ics | 30 |
| `dashboard/` | État, calendrier et ouvertures, foyers, stats, plan de table, salle, programme, CSV, récap traiteur, recherche de table, résumés, archive galerie | 150 |
| `commands/` | 29 commandes (`runCommand`), `diffState` / `applyChanges`, `createLocalStore` | 74 |
| `state/` | `parseWeddingState` (zod) | 8 |
| `prints/` | Sous-chemin `/prints` : faire-part, affiches, récap traiteur en PDF, QR | 18 |

Nouveautés par rapport à la démo : fuseau du mariage, groupes libres, moment
placé à table, ouvertures de la galerie et des tables à un jour et une heure,
commande de renvoi du lien (`household.resendLink`), import d'une liste
(`parseGuestList`, commande `households.import`, tout ou rien), réglages
(`settings.save` : contact, adresse du site, fuseau ; feature `settings.write`),
export complet (`weddingExport`), refus explicites
(`forbidden`, `not-found`, `answers-closed`, `invitation-expired`,
`last-moment`), réponse d'un invité refusée après la date limite.

## 4. Données

### 4.1 Le contenu modifiable passe de Sanity à Postgres

`PLAN.md` §5.6-5.7 mettait programme, horaires et textes dans Sanity. Depuis
que les mariés les modifient eux-mêmes, ce contenu va en **Postgres** (décidé
le 2026-10-06) : une seule source, transactionnelle, avec les droits du membre
connecté.

| Rédigé par | Contenu | Stockage |
|---|---|---|
| Les mariés, depuis le tableau de bord | Faire-part (prénoms, lieu, mot d'accueil, sceau, remerciement), programme et horaires, dates clés, questions, invités, plan de table, personnes invitées | Postgres |
| AlexDevLab, dans le Studio | FAQ, lieux (adresse, itinéraire, carte), dress code, notre histoire, photos du couple, thème | Sanity (dataset `weddings`) |

Les mariés demandent un changement de FAQ, de lieu ou de dress code par
message ; il est inclus pendant toute la mise en ligne (FAQ de `/mariage`).

### 4.2 Schéma (complète `PLAN.md` §5.6)

```
wedding          + plan, options text[], timezone, design jsonb (prénoms, lieu,
                   mot d'accueil, ton, remerciement), answer_deadline, reminder_at,
                   gallery_opens jsonb {day, time}, tables_reveal jsonb {day, time}
                   (heures locales au fuseau du mariage, NULL = automatique)
wedding_offer_log(wedding_id, plan, options, changed_by, changed_at)
household_group  (id, wedding_id, label, position)
moment           (wedding_id, key, title, position, seated bool)
slot             (id, wedding_id, moment_key, title, place, day_offset, start, end)
question         (id, wedding_id, label, placeholder, position)
room             (wedding_id, name, size, head jsonb, entrance jsonb)
seating_table    (id, wedding_id, number, name, capacity, x, y)
guest            + table_id NULL, labels jsonb
activity         (id, wedding_id, at, kind, text, detail, badge, subject)
```

- Toute lecture et écriture passe par un **dépôt** qui impose `wedding_id` du
  membre connecté, testé contre une branche Neon.
- Les correspondances lignes ↔ types du cœur (`HouseholdRecord`,
  `MomentPlan`…) et changements → écritures sont des fonctions pures, testées.

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

### 5.3 Feature flags : un jeu de features par rôle (révisé le 2026-10-08)

Deux niveaux distincts :

- **les flags du mariage** (§2.1 : `guests`, `seating`, `gallery`…) disent ce que
  le mariage a : formule, options, exceptions, coupures ;
- **les features** disent ce qu'une personne peut faire, finement, le niveau
  dans le nom : `guests.read`, `guests.write`, `guests.diets.read`,
  `seating.read`, `seating.write`, `reminders.send`, `gallery.moderate`,
  `access.manage`, `site.answer`, `site.table`… (30 features). Chaque feature
  dépend d'un ou plusieurs flags : `seating.write` demande `seating`,
  `invitation.print` demande `invitation-print`.

`guests.diets.read` est séparée parce que les contraintes alimentaires sont des
données de santé potentielles (`PLAN.md` §5.9) : un témoin peut gérer la liste
sans voir les allergies.

**Chaque rôle a son jeu de features** (`ROLE_FEATURES`) :

| Rôle | Jeu de features |
|---|---|
| `couple` | Toutes |
| `planner` | Tout le tableau de bord, sauf gérer les accès, voir la formule, l'export complet |
| `witness` | Invités en lecture (sans régimes), plan de table et galerie en modification |
| `custom` | Aucune : tout vient des ajustements |
| `guest` | Le site invité : `site.read`, `site.answer`, `site.table`, `site.gallery`… |
| `admin` | Toutes les features de lecture, aucune d'écriture |

**Résolution**, une fonction pure du cœur :

```
resolveFeatures({ role, added, removed, extra, flags })
  = (jeu du rôle + ajouts de la personne − retraits + ajouts de l'interface)
    ∩ features permises par les flags du mariage
```

| Couche | Qui la règle | Stockage |
|---|---|---|
| 1. Plateforme | AlexDevLab : `off` coupe une fonction (incident), `on` la teste sur quelques mariages | table `platform_flag` |
| 2. Formule | L'achat : `flagsOf(offer)` | `wedding.plan`, `wedding.options` |
| 3. Mariage | AlexDevLab : exception datée et motivée | table `wedding_flag` |
| 4. Rôle | Le jeu de features du rôle de la personne | `member.role` |
| 5. Ajustements | Les mariés : features ajoutées ou retirées à une personne | table `member_feature` (member_id, feature, mode[add\|remove]) |
| 6. Portion d'interface | Le code : `<FeatureScope add={…}>` pour un aperçu, une page ouverte par QR | aucun : jamais côté serveur |

- `weddingFlags(context)` combine les couches 1 à 3 ; **une coupure plateforme
  l'emporte toujours**. Rien, ni rôle ni ajout, ne dépasse les flags du mariage.
- Côté interface, React (`@alexreu/wedding-core/react`) :
  `<FeatureFlagProvider role added removed flags>` en haut de l'arbre,
  `useCheckFeatureFlag()` renvoie `{ features, has, hasAll, hasAny }`,
  `<FeatureScope add={[…]}>` ajoute des features à ses enfants seulement (les
  portées s'empilent). Hors d'un provider, aucune feature n'est ouverte.
- Côté serveur, `runCommand` refait le calcul : chaque commande demande une
  feature (`guest.seat` → `seating.write`, `collaborator.invite` →
  `access.manage`…). Une `FeatureScope` n'a aucun effet sur le serveur : elle
  ne sert qu'à montrer, jamais à autoriser une écriture.
- La page « Accès » lit et écrit les ajustements fonction par fonction
  (« Masqué / Voir / Modifier ») avec `areaLevel` et `withAreaLevel` : le choix
  du marié est enregistré comme un écart au rôle, et un écart qui ramène au rôle
  disparaît.

Pas d'outil externe (LaunchDarkly, PostHog…) : quelques tables, des fonctions
pures, des données qui restent en Europe. Si une coupure d'urgence doit
fonctionner même base indisponible, la couche 1 pourra passer sur Vercel Edge
Config avec le Flags SDK sans toucher aux autres couches.

### 5.4 Inviter quelqu'un

- La page « Accès » n'apparaît que si le flag `collaborators` est actif pour le
  mariage. Réservée aux mariés.
- **Pas de nombre limite** : les mariés invitent qui ils veulent.
- Le marié saisit un prénom, une adresse, un intitulé facultatif (« Témoin de
  Camille ») et choisit un **rôle** : témoin, wedding planner ou sur mesure.
  Il peut ensuite ajuster fonction par fonction ; l'ajustement est gardé comme
  un écart au rôle (§5.3).
- L'invitation (Better Auth) sert une fois, dure 72 heures et est liée à
  l'adresse : transférée à quelqu'un d'autre, elle ne sert à rien.
- Changer les droits d'une personne : effet à la requête suivante. Retirer un
  accès : sessions de la personne supprimées tout de suite.
- Option `collaborators` retirée ou fin de mise en ligne : accès des personnes
  invitées suspendus, ceux des mariés passent en lecture seule (§7).

### 5.5 Cas particuliers

- **Un marié change d'adresse ou la perd** : l'autre marié la remplace depuis
  « Accès » ; si les deux sont bloqués, AlexDevLab la change depuis l'admin
  après vérification (appel ou message habituel du couple).
- **Accès AlexDevLab** : passkey obligatoire ; consultation d'un mariage en
  lecture seule, journalisée, sans modification des réponses.

Tables ajoutées au schéma §4.2 (en plus de celles de Better Auth) :

```
platform_flag (flag, mode[on|off], wedding_ids text[] NULL, reason, updated_at)
wedding_flag  (wedding_id, flag, enabled, reason, expires_at NULL, set_by, set_at)
member_feature(member_id, feature, mode[add|remove])  -- ajustements ; le rôle est dans member.role
access_log    (id, wedding_id, user_id, action[login|export|admin_view|access_change|flag_change], at)
```

## 6. Lots

Chaque lot en TDD : un test, puis le code minimal. Durées pour une personne.

| Lot | Contenu | Sortie | Durée | État |
|---|---|---|---|---|
| **0. Amorçage** | Repo workspace, Next.js 16, Drizzle + Neon (branche par prévisualisation), Vitest, Playwright, CI, Vercel Pro `fra1`, gel des déploiements le jour J | Une page vide déployée, la CI verte | 1 sem. | workspace et paquet seulement |
| **1. Catalogue et flags** | `offer/` et `access/` : catalogue, `flagsOf`, `optionsFor`, `validateOffer`, `changeOffer`, `flagsInUse`, quatre couches, permissions par action, modèles « Témoin » et « Wedding planner » | Matrice §2.2 et résolution des quatre couches testées cas par cas | 4-5 j | **fait** (2026-10-08) |
| **2. Extraction du cœur** | `src/lib/wedding*` dans `guest-site/`, `dashboard/`, `prints/` ; valeurs codées en dur rendues configurables (§3.3) ; noms en anglais (§3.4) ; reducer découpé en commandes avec diff (§3.2) | Tous les tests de la démo repris dans le paquet | 1-1,5 sem. | **fait** (2026-10-08), sauf la consommation par le portfolio (lot 9) |
| **3. Persistance** | Schéma Drizzle §4.2, migrations, dépôts isolés par mariage, correspondances lignes ↔ types, changements → écritures, tenant `demo` semé | Lecture et écriture d'un mariage complet en test d'intégration | 1-1,5 sem. | — |
| **4. Accès** | §5 : Better Auth (`magicLink`, `organization`, `admin`, `passkey`) sans inscription, comptes des mariés créés par l'admin, tables de flags, chargement du contexte d'accès par requête, journal | Les deux mariés se connectent et ne voient que leur mariage ; une adresse inconnue n'obtient rien | 1 sem. | — |
| **5. Socle Intime** | `dashboard-ui` + `serverStore` : vue d'ensemble, invités (création, **import CSV**, détail, réponse papier, copier et renvoyer le lien), récap traiteur, export CSV (journalisé), édition faire-part / programme / dates, page « Votre formule » | **Formule Intime vendable côté mariés** | 2 sem. | — |
| **6. Modules Essentiel** | Questions perso, relance (Vercel Cron + Resend + `email_log`), galerie (R2, retrait, ZIP), faire-part PDF + QR | Formule Essentiel vendable ; options Intime actives | 2-3 sem. | — |
| **7. Modules Signature** | Plan de table (éditeur de la démo, révélation à l'heure dite, liste traiteur par table), QR par foyer, co-gestion (page « Accès », §5.4) | Formule Signature vendable ; options Essentiel actives | 2-3 sem. | — |
| **8. Admin AlexDevLab** | Créer un mariage (formule + options + fuseau), changer de formule (montée seulement), consulter en lecture seule, déclencher l'export avant purge | Un mariage livré sans toucher à la base | 1 sem. | — |
| **9. Démo branchée** | La démo du portfolio consomme `wedding-core` (puis `dashboard-ui`) avec `localStorageStore` et le sélecteur de formule ; badges calculés depuis le catalogue | La démo montre chaque formule telle qu'elle est vendue | 3-4 j | **wedding-core fait** (2026-10-08) : la démo consomme `@alexreu/wedding-core@0.3.0` (commandes, features, impressions), sélecteur de formule fait ; reste `dashboard-ui`, à extraire une fois l'interface figée |

Total : **11 à 14 semaines** pour le tableau de bord. Le site invité (réponse
par lien personnel, galerie, jour J) avance en parallèle sur le même cœur ; les
lots 5, 6 et 7 en dépendent pour être vendables de bout en bout.

### Tests attendus par lot

- **Unitaires (core)** : chaque cellule de la matrice, chaque couche de flags,
  chaque commande (droit, validation, état produit, activité, changements),
  `applyChanges(before, diffState(before, after))` égal à `after`.
- **Intégration (dépôts)** : isolation entre deux mariages, refus d'une action
  hors formule ou hors flag même appelée directement, refus d'un lien magique
  pour une adresse inconnue, invitation inutilisable par une autre adresse, un
  témoin sans `guests.diets` ne reçoit jamais les régimes (ni à l'écran ni
  dans l'export).
- **Bout en bout** : un parcours par formule (Intime ne voit ni relances ni
  plan de table ; Signature voit tout), mobile et desktop, comme aujourd'hui.

## 7. Règles de gestion

- **Montée de formule** en cours de contrat : autorisée, effet immédiat,
  tracée dans `wedding_offer_log`. Facturation hors plateforme.
- **Descente** : refusée dès que des données dépendent de la fonction (tables
  placées, questions posées, photos reçues, personnes invitées). Avant toute
  saisie, AlexDevLab peut corriger une erreur depuis l'admin.
- **Option retirée par erreur** : les données sont masquées, jamais supprimées,
  jusqu'à la purge RGPD.
- **Fin de mise en ligne** : le tableau de bord passe en lecture seule, export
  disponible jusqu'à la purge (`PLAN.md` §5.9).

## 8. Ce qui manque à la démo pour un vrai produit

Fait le 2026-10-08 (paquet 0.3.0) : import CSV des invités, « Renvoyer son
lien », page de connexion simulée, réglages (contact, adresse du site, fuseau),
groupes libres, export complet « Vos données ».

Reste, côté plateforme :

- Envoi réel des e-mails (lien de connexion, renvoi du lien, relance).
- États vides et erreurs réseau du `serverStore` (la démo n'en a pas).
- Purge programmée après l'export (`PLAN.md` §5.9).

## 9. Décisions

Prises le 2026-10-06 :

1. **Partage du code** : paquets privés `wedding-core` + `dashboard-ui` sur
   GitHub Packages (§3.1).
2. **Contenu modifiable par les mariés en Postgres** (§4.1).
3. **Fonction hors formule masquée**, jamais grisée (§2.3).
4. **FAQ, lieux et dress code rédigés par AlexDevLab** dans Sanity ; les mariés
   demandent les changements par message (§4.1).
5. **Renvoi manuel du lien à un foyer inclus dans toutes les formules** ; la
   relance automatique reste à partir d'Essentiel (§2.2).
6. **Connexion réservée aux mariés et aux personnes qu'ils invitent**, selon la
   formule : Better Auth (`magicLink` sans inscription, `organization`,
   `admin`, `passkey`), invitations liées à une adresse (§5.1, §5.2).
7. *(Révisée par la décision 11.)* **Feature flags plutôt que rôles** : quatre couches (plateforme, formule,
   mariage, personne) résolues par des fonctions pures ; les mariés choisissent
   flag par flag ce que chaque personne invitée voit ou modifie (§5.3).
8. **Pas de nombre limite** de personnes invitées : les mariés gèrent (§5.4).

Prises le 2026-10-08 :

9. **Identifiants en anglais** partout dans le paquet : flags, niveaux,
   formules, options, régimes, commandes (§2.1, §3.4). Le français reste dans
   les textes affichés et les segments d'URL.
10. **Le paquet se construit dans un repo frère**, `~/Developer/mariage-platform`,
    futur repo de la plateforme, pas dans le portfolio (§3.1). La démo garde son
    code jusqu'au lot 9.
11. **Feature flags par rôle** (révise la décision 7) : un jeu de features par
    rôle, des ajustements par personne choisis par les mariés, des ajouts par
    portion d'interface (`FeatureScope`), le tout plafonné par les flags du
    mariage ; hook `useCheckFeatureFlag` (§5.3).
12. **Paquet publié sous le compte `alexreu`** : `@alexreu/wedding-core` (le
    compte GitHub `AlexDevLab` n'est pas le tien), repo privé
    `alexreu/mariage-platform`. Publication par GitHub Actions à chaque tag
    `core-vX.Y.Z` égal à la version du paquet ; CI (`pnpm verify`) à chaque push.
13. **La démo consomme le paquet** depuis le 2026-10-08 (`^0.2.0`) : toute
    logique du site invité ou du tableau de bord évolue dans le paquet, plus
    dans le portfolio. Heure d'ouverture des tables réglée dans « Dates
    clés », plus dans le plan de table.
14. **Démo complète avant la plateforme** (2026-10-08, paquet `^0.3.0`) :
    formule jouable, import, renvoi du lien, réglages, connexion simulée,
    export. `dashboard-ui` attend que l'interface soit figée.
