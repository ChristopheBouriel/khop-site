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
index.html          page unique (balisage seulement, pas de style inline)
src/catalog.js      catalogue et grille tarifaire — SEUL fichier à toucher pour les prix et options
src/config.js       coordonnées de l'atelier (WhatsApp, email, adresse, horaires)
src/pricing.js      logique de prix pure (pas de DOM), testée
src/order.js        récapitulatif de commande, référence, lien WhatsApp (pur, testé)
src/preview.js      aperçu SVG du cadre, viewBox en centimètres
src/main.js         câblage DOM : état, événements, rendu
src/styles.css      tokens de couleur et typo sur :root, thèmes clair et sombre
test/               tests node:test de pricing.js et order.js
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
- Le dossier `prototype/` ne bouge pas.

## Avant de dire qu'un changement est fini

1. `npm test` passe.
2. La page s'ouvre sans erreur console via `npm run dev`, vérifiée à 400 px et sur desktop.
3. Si un choix structurant a été fait, ajoute une entrée dans `docs/DECISIONS.md` ; coche ou ajoute les tâches dans `docs/BACKLOG.md`.
