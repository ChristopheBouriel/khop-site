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

## Créer le dépôt GitHub

```bash
git init -b main
git add .
git commit -m "Initial import: Khop configurator, tests, CI, hand-off docs"
gh repo create khop-site --private --source=. --push
```

Puis dans GitHub : **Settings → Pages → Source : GitHub Actions**. La preview se met à jour à chaque push sur `main`.

## Documentation

- `CLAUDE.md` — comment travailler dans le dépôt (lu automatiquement par Claude Code)
- `docs/HANDOFF.md` — contexte complet, règles métier, questions ouvertes
- `docs/DECISIONS.md` — choix faits et à confirmer
- `docs/BACKLOG.md` — jalons et tâches
