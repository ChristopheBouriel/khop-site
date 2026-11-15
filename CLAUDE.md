# CLAUDE.md

Site de commande de **Khop**, un atelier d'encadrement sur-mesure au Laos (Christophe + Hermann).
Le client saisit les dimensions de son œuvre, choisit moulure, passe-partout et verre, voit son cadre en direct, puis envoie une demande de commande. Paiement au retrait, rien en ligne.

**Avant toute tâche, lis `docs/HANDOFF.md`** (contexte, règles métier, questions ouvertes). Les choix déjà faits sont dans `docs/DECISIONS.md`, la suite dans `docs/BACKLOG.md`.

## Commandes

```bash
npm run dev    # serveur statique sur http://localhost:5173 (les modules ES ne marchent pas en file://)
npm test       # node --test, aucune dépendance
```

Pas de build, pas de dépendance npm. Node 22 (`.nvmrc`).

## Structure

```
index.html          page unique (balisage seulement, pas de style inline) ; textes balisés par data-i18n
src/catalog.js      catalogue et grille tarifaire — SEUL fichier à toucher pour les prix et options (ids, pas de libellés)
src/config.js       coordonnées de l'atelier (WhatsApp, email, adresse, horaires)
src/i18n/en.js      TOUS les textes du site, en anglais (langue de référence)
src/i18n.js         choix de la langue et fonction de traduction t() (pur, testé)
src/pricing.js      logique de prix pure (pas de DOM), testée
src/order.js        récapitulatif de commande, référence, lien WhatsApp (pur, testé)
src/preview.js      aperçu SVG du cadre, viewBox en centimètres
src/main.js         câblage DOM : langue, état, événements, rendu
src/styles.css      tokens de couleur et typo sur :root, thèmes clair et sombre
test/               tests node:test de pricing.js, order.js et des textes (i18n.test.js)
prototype/          prototype d'origine, en un seul fichier — référence visuelle, ne pas modifier
.github/workflows/  CI (tests) et déploiement GitHub Pages
```

## Règles

- **Ne jamais inventer de données réelles** (prix, adresse, numéro, nom de domaine). Tout ce qui est marqué PLACEHOLDER dans `catalog.js` et `config.js` attend une validation de Christophe et Hermann. Si une tâche en dépend, demande.
- `pricing.js` et `order.js` restent purs (pas d'accès au DOM). Toute modification de la logique de prix ou de la grille s'accompagne de tests à jour.
- Pas de framework ni de dépendance sans en discuter d'abord (voir D1 dans `docs/DECISIONS.md`).
- Styles : uniquement via les tokens de `:root` dans `styles.css`. Chaque couleur ajoutée doit exister dans les trois blocs (clair, `prefers-color-scheme: dark`, `[data-theme="dark"]`).
- La page doit marcher à 400 px de large sans scroll horizontal, en clair et en sombre.
- Textes du site en anglais pour l'instant (les langues sont une question ouverte). Code et commentaires en anglais, docs du projet en français.
- **Aucun texte visible en dur** dans `main.js`, `pricing.js`, `order.js`, `preview.js` ou `catalog.js` : tout passe par une clé de `src/i18n/en.js` et `t()`. Dans `index.html`, un texte balisé `data-i18n` doit rester identique à la valeur de `en.js` (un test le vérifie). Voir D7.
- Ajouter une option au catalogue = un id dans `catalog.js` **et** son libellé `catalog.<type>.<id>` dans `en.js` (un test échoue sinon).
- Ajouter une langue : copier `src/i18n/en.js` en `src/i18n/<code>.js`, traduire les valeurs, l'enregistrer dans `LOCALES` de `src/i18n.js`. Le sélecteur de langue apparaît tout seul. Ne pas ajouter de langue sans décision de Christophe et Hermann, ni de traduction en lao non relue par un locuteur natif.
- Le dossier `prototype/` ne bouge pas.

## Avant de dire qu'un changement est fini

1. `npm test` passe.
2. La page s'ouvre sans erreur console via `npm run dev`, vérifiée à 400 px et sur desktop.
3. Si un choix structurant a été fait, ajoute une entrée dans `docs/DECISIONS.md` ; coche ou ajoute les tâches dans `docs/BACKLOG.md`.
