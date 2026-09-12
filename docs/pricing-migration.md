# Tarifs condensés et maintenance

Branche : `feat/compact-pricing-sanity`, issue de `origin/master` (`63077ec`).

## Architecture

Sanity reste l’unique source du contenu affiché : aucun tarif de secours codé dans le composant. `content/pricing.json` est la charge utile de migration, pas une source importée par le site. Sans offres, un lien vers le formulaire de contact est affiché. Sans document Maintenance, la section est masquée.

- `pricingPlan` conserve les identifiants des trois documents existants. `highlights` contient 1 à 8 points courts, `contextLabel` et `context` la ligne d’options ou d’usage. `featureCategories` contient les détails de l’accordéon natif, utilisable au clavier. `archived` permet de retirer une offre sans la supprimer.
- `maintenanceSection` est un document identifié par `maintenanceSection` avec titre, description, trois niveaux ordonnés, leurs prestations détaillées et une note de conditions commune. Le Studio propose une entrée unique « Maintenance » liée à cet identifiant et désactive la création libre ainsi que la duplication de ce type. Les détails de chaque niveau restent repliés par défaut dans l’interface.
- Une projection GROQ commune alimente `getPricingPlans` et `getHomepageData`, y compris `startingFrom` qui manquait auparavant sur la page d’accueil.
- `BentoGrid` transmet les données à `PricingCard` et au composant `Maintenance`. Les anciennes catégories servent de résumé limité à huit points avant migration.
- Les offres passent en trois colonnes à 1280 px pour laisser assez de place aux titres. Avant ce seuil, elles sont empilées et leurs points passent en deux colonnes dès 640 px. La maintenance passe en trois colonnes dès 768 px. Aucun changement de taille au survol ; les CTA restent en bas des cartes.

## Migration

Le Studio et l’environnement local existants utilisent le projet `qh2sxz0g`, dataset `production`. Le `.env.example` historique désigne un autre projet : ne pas l’utiliser pour cette migration.

1. Déployer les nouveaux schémas Studio et l’application ensemble.
2. Examiner `content/pricing.json`. Le script associe les anciens packs Essential, Custom et Ecosystem aux trois nouvelles offres grâce à leurs identifiants, conserve ces identifiants, remplace leurs détails et retire leurs anciens frais mensuels/engagements. Business comprend **2 h au total par mois**, conformément à la conversation source.
3. Exécuter la simulation :

```sh
NEXT_PUBLIC_SANITY_PROJECT_ID=qh2sxz0g SANITY_DATASET=production node scripts/migrate-pricing.mjs
```

4. Pour publier les contenus, fournir `SANITY_API_WRITE_TOKEN` dans l’environnement (ne pas le versionner), puis :

```sh
NEXT_PUBLIC_SANITY_PROJECT_ID=qh2sxz0g SANITY_DATASET=production node scripts/migrate-pricing.mjs --apply
```

Une session Sanity CLI authentifiée peut être utilisée sans manipuler directement le jeton :

```sh
NEXT_PUBLIC_SANITY_PROJECT_ID=qh2sxz0g SANITY_DATASET=production pnpm exec sanity exec scripts/migrate-pricing.mjs --with-user-token -- --apply --cli-user-token
```

Le script refuse les offres sources manquantes et les brouillons existants, sauvegarde les documents originaux dans `.sanity-backups/`, puis applique une transaction atomique avec contrôle des révisions. Il refuse de remplacer une maintenance déjà existante : une seconde exécution ne peut donc pas écraser des retouches éditoriales. Une simulation sans jeton ne peut voir que les documents accessibles publiquement ; l’exécution avec un jeton éditeur vérifie aussi les brouillons.

La migration a été appliquée au dataset `production` le 12 septembre 2026 avec la session Sanity CLI authentifiée. Les documents précédents ont été sauvegardés localement dans `.sanity-backups/pricing-1789236577511.json`. La page d’accueil étant générée statiquement, relancer le build et le déploiement de l’application pour rendre les nouveaux montants visibles en production.

## Fichiers concernés

- `schemaTypes/pricingPlan.ts`, `schemaTypes/maintenanceSection.ts`, `schemaTypes/index.ts`, `sanity.config.ts` : modèle éditorial, validations et document Maintenance unique.
- `src/lib/sanity/types.ts`, `src/lib/sanity/sanity.query.ts` : types et projection commune.
- `src/app/(site)/page.tsx`, `src/components/home/bento-grid.tsx` : transmission des données.
- `src/components/home/pricing-card.tsx`, `src/components/home/maintenance.tsx` : cartes condensées, accordéons et maintenance.
- `content/pricing.json`, `scripts/migrate-pricing.mjs`, `.gitignore` : nouveaux contenus, migration et exclusion des sauvegardes locales.
- `docs/pricing-migration.md` : procédure et validation.

## Vérifications

- `pnpm install --frozen-lockfile` : dépendances de master installées dans la copie isolée, lockfile inchangé.
- `pnpm ts-lint` et `pnpm lint` : réussis.
- `NEXT_PUBLIC_SANITY_PROJECT_ID=qh2sxz0g POSTMARK_SERVER_TOKEN=build-validation-no-email pnpm build` : build avec contenu public Sanity et jeton Postmark factice ; aucun email envoyé. La première tentative sans jeton échouait sur la configuration préexistante de `/api/email`.
- `NEXT_PUBLIC_SANITY_PROJECT_ID=qh2sxz0g SANITY_DATASET=production node scripts/migrate-pricing.mjs` : simulation réussie sur les trois identifiants existants ; aucune écriture.
- Contrôle GROQ ponctuel avec `node /tmp/check-pricing-query.cjs` : cohérence des deux queries, tri, exclusion des archives, tarifs, maintenance, anciens documents et contenu absent.
- Contrôle navigateur ponctuel avec `node /tmp/check-pricing.cjs` : Chrome à 375, 768, 1024 et 1440 px, absence de débordement horizontal, huit points, CTA de contact, accordéons au clavier et absence d’erreur JavaScript. Cartes desktop fermées : 652,25 px chacune. Maintenance sur une rangée dès 768 px.
- Inspection des captures mobile et desktop. L’aperçu utilisait les données de migration dans une route temporaire retirée après vérification ; aucun contenu de test n’est livré dans l’application.
- `git diff --check` : réussi. Aucun script de tests préexistant dans `package.json`.
