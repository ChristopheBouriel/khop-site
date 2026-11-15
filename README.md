# Khop — site de l'atelier d'encadrement

Configurateur de cadres sur-mesure : dimensions, moulure, passe-partout, verre, aperçu à l'échelle et prix en direct, puis demande de commande. Paiement au retrait.

> Les prix, coordonnées et le nom lui-même sont **provisoires**. Voir `docs/HANDOFF.md` §3.

## Lancer en local

```bash
npm run dev   # http://localhost:5173
npm test
```

Aucune installation : Node 22 suffit. Ouvrir `index.html` directement depuis le disque ne marche pas, car les modules ES exigent un serveur.

## Modifier les prix ou les options

Tout est dans `src/catalog.js`. Les coordonnées de l'atelier sont dans `src/config.js`. Après une modification de la grille de prix, lancer `npm test` : certains tests vérifient les montants et devront peut-être être ajustés.

Les libellés des options (noms des finitions, des passe-partout…) ne sont pas dans `catalog.js` mais avec les autres textes, dans `src/i18n/en.js`.

## Modifier un texte ou ajouter une langue

Tous les textes sont dans `src/i18n/en.js`. Si le texte apparaît aussi dans `index.html` (élément avec `data-i18n`), le modifier aux deux endroits : `npm test` signale tout écart.

Pour ajouter une langue : copier `src/i18n/en.js` en `src/i18n/<code>.js`, traduire les valeurs sans toucher aux clés, puis l'ajouter à `LOCALES` dans `src/i18n.js`. Le sélecteur de langue apparaît alors dans l'en-tête, et `?lang=<code>` force une langue.

## Dépôt et hébergement

Le dépôt est local pour l'instant. Le dépôt distant et l'hébergement de la preview sont en suspens (voir D6 dans `docs/DECISIONS.md`).

## Documentation

- `CLAUDE.md` — comment travailler dans le dépôt (lu automatiquement par Claude Code)
- `docs/HANDOFF.md` — contexte complet, règles métier, questions ouvertes
- `docs/DECISIONS.md` — choix faits et à confirmer
- `docs/BACKLOG.md` — jalons et tâches
