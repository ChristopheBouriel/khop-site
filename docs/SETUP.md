# Mise en ligne de la preview (M0)

_Rédigé le 18 novembre 2026 par Claude Code, à la demande de Christophe._

But : créer le dépôt GitHub **public** `ChristopheBouriel/khop-site` et publier la preview sur GitHub Pages, via le workflow `.github/workflows/pages.yml` déjà présent. Sortie attendue : une URL à envoyer à Hermann.

Règle : à chaque **⏸ VALIDATION**, Claude s'arrête et attend l'accord explicite de Christophe. Rien après l'étape 8.

## 1. Vérifications locales
- `git status` : arbre propre, sur `main`.
- `npm test` : tous les tests passent.
- Vérifier qu'aucun fichier ne contient de secret ou de donnée qui ne doit pas devenir publique (tokens, `.env`, vraies coordonnées).

## 2. Ce qui devient public ⏸ VALIDATION
Un dépôt public expose tout le contenu **et tout l'historique git**, dont :
- l'**adresse email des commits** (`git log`) ;
- les docs internes (`docs/`, `CLAUDE.md`, `prototype/`) ;
- les PLACEHOLDER (prix inventés, faux numéro WhatsApp, `hello@khop.la`), signalés sur la page par le bandeau « Preview: prices and contact details are placeholders ».

Christophe confirme :
- qu'il accepte de publier ces éléments tels quels (ou indique ce qu'il faut changer avant : par exemple réécrire l'auteur des commits avec l'adresse `noreply` de GitHub) ;
- s'il faut ajouter `<meta name="robots" content="noindex">` à `index.html` pour que la preview ne soit pas référencée par les moteurs de recherche.

## 3. Consigner la décision
- `docs/DECISIONS.md` : passer D6 à « décidé » (dépôt public + GitHub Pages pour la preview ; la production reste à décider, question 7).
- `docs/BACKLOG.md` : mettre à jour la ligne M0 sur le dépôt distant.
- Appliquer ce qui a été choisi à l'étape 2 (noindex, auteur des commits).
- `npm test`, puis commit local (pas encore de push).

## 4. Créer le dépôt GitHub ⏸ VALIDATION
Commande prévue (crée le dépôt vide et ajoute le remote `origin`, **sans pousser**) :
```bash
gh repo create ChristopheBouriel/khop-site --public --source=. --remote=origin \
  --description "Khop Framing Atelier: custom frame configurator (preview)"
```

## 5. Activer GitHub Pages
Source « GitHub Actions », avant le premier push pour que le déploiement fonctionne du premier coup :
```bash
gh api -X POST repos/ChristopheBouriel/khop-site/pages -f build_type=workflow
```

## 6. Pousser `main` ⏸ VALIDATION
```bash
git push -u origin main
```
Ce push déclenche les workflows CI (tests) et « Deploy to GitHub Pages ».

## 7. Suivre les workflows et vérifier le site
- `gh run list` / `gh run watch` : les deux workflows doivent finir en succès. En cas d'échec, lire les logs (`gh run view --log-failed`), s'arrêter et rendre compte avant toute correction.
- Ouvrir l'URL publiée (normalement `https://christophebouriel.github.io/khop-site/`) : la page se charge sans erreur console, les modules ES et les assets se chargent (chemins relatifs), à 400 px et sur desktop, en clair et en sombre ; un parcours de commande complet fonctionne.

## 8. Finaliser la documentation ⏸ VALIDATION
- `docs/HANDOFF.md` : l'URL de la preview, la mise à jour de §2 / §2 bis (le dépôt existe, la preview est en ligne).
- `docs/BACKLOG.md` : cocher le dépôt distant ; il reste « Montrer le site à Hermann ».
- Commit, puis push après validation de Christophe (ce qui redéploie le site).

**Fin.** Ne rien entreprendre d'autre ensuite.
