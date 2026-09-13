# Section projets

Branche `feat/adaptive-projects`, créée depuis `master` à jour (`e41bab3`).

## Contenu et Sanity

La page récupère les documents `project` dans la requête groupée existante. Ils sont triés par `order`, puis par identifiant ; les projets archivés sont exclus. Aucun document de production n’est modifié par cette branche.

Tant qu’aucun projet n’est publié dans Sanity, la sélection locale de `src/lib/projects.ts` affiche Nexa et Anne Esthetik, avec leurs captures réelles du 13 septembre 2026. Nexa est explicitement identifié comme démonstration SaaS. Les tags décrivent les interfaces sans supposer une stack non vérifiée.

Dans `/studio`, l’entrée **Projets** permet de saisir le nom, la catégorie, une description courte (220 caractères maximum), le lien HTTP(S), une capture avec son texte alternatif, jusqu’à quatre tags et l’ordre. Dès qu’un premier projet est publié, la sélection CMS remplace intégralement la sélection locale : publier les deux documents pour conserver les deux projets. Un seul document publié affiche volontairement une seule composition. Archiver tous les projets masque la section ; supprimer tous les documents réactive la sélection initiale. La page étant pré-rendue comme auparavant, reconstruire/redéployer le site après publication de contenu.

Les images locales optimisées sont dans `public/images/projects/`. Pour reprendre ces aperçus dans Sanity, téléverser les fichiers WebP correspondants dans le champ Aperçu du site. Le cadre utilise un ratio 16:9 et conserve le haut de l’image. Sans image, un visuel typographique présente le nom du projet.

## Présentation et accessibilité

Liste de compositions à deux colonnes à partir de 768 px, alternant image et texte sans dépendre du nombre de projets. Sur mobile, chaque image précède son texte. Aucun carrousel, hauteur fixe ou contenu tronqué. Les titres restent sémantiques et les images sont chargées via Next Image.

Les liens annoncent le projet et l’ouverture d’un nouvel onglet. Le focus dispose d’un anneau et d’un changement de couleur. Les URL non HTTP(S) ne produisent pas de lien. La révélation au scroll et le zoom d’image respectent la préférence de mouvement réduit ; le contenu est visible dès le HTML initial. L’offset Lenis de 96 px maintient les ancres sous la navigation fixe.

## Validation

- `pnpm lint` et `pnpm ts-lint`.
- `NEXT_PUBLIC_SANITY_PROJECT_ID=qh2sxz0g POSTMARK_SERVER_TOKEN=build-validation-no-email pnpm build` : configuration publique du Studio et jeton de validation factice, sans envoi d’email.
- Contrôle navigateur à 375, 768, 1024 et 1440 px, avec 1, 2 et 3 projets via une route temporaire retirée après validation : absence de débordement horizontal, alternance, images et fallback sans image.
- Contrôle clavier des liens et de leur focus ; navigation vers l’ancre depuis la page réelle ; inspection des captures et de la console finale.
