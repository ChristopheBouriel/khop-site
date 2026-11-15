# Décisions

Chaque entrée indique qui l'a prise. « Proposé » veut dire que c'est une proposition de Claude, pas encore confirmée.

## D1 — Site statique sans framework ni build
**Statut : proposé, à confirmer par Christophe.**

**Choix.** HTML, CSS et modules ES natifs. Aucune dépendance npm, tests avec `node:test`.

**Pourquoi.**
- C'est une seule page avec un configurateur.
- Sans build, le site se déploie n'importe où (GitHub Pages, Cloudflare Pages, Netlify).
- La logique de prix est pure, donc testable sans outil supplémentaire.

**À revoir si** le site passe à plusieurs langues, plusieurs pages (galerie, réalisations) ou une interface d'admin. Le candidat naturel serait alors **Astro**, qui reste statique et dont les composants sont faciles à reprendre ; ou React/Next si un back-office devient central. `pricing.js` et `order.js` se reprennent tels quels dans les deux cas.

## D2 — Prix : forfait par taille, passe-partout par tranche de surface
**Statut : décidé par Christophe et Hermann.**

- Le forfait de taille se calcule sur l'**ouverture** (œuvre + passe-partout), pas sur l'œuvre seule. C'est la mesure qui détermine la quantité de moulure et de verre. _Ce point est une proposition de Claude._
- Au-delà de la plus grande taille, le prix se fait sur devis.

## D3 — Pas de paiement en ligne
**Statut : décidé par Christophe et Hermann.** Le client envoie une demande de commande et paie au retrait.

## D4 — Transport des commandes, V1 : copier ou WhatsApp
**Statut : proposé, provisoire.**

**V1.** Le site génère un récapitulatif texte. Le client le copie ou l'envoie sur WhatsApp via un lien `wa.me` prérempli. Pas de serveur, pas de données personnelles stockées.

**Limite.** Rien ne garantit que la demande arrive, et l'image du client n'est pas jointe.

**Options pour M2**, à choisir selon la façon dont Hermann veut recevoir les commandes :
- Une fonction serverless (Cloudflare Worker ou Netlify Function) qui envoie un **email** et/ou un message **Telegram** à l'atelier. Peu de code, gratuit à ce volume.
- Un service de formulaires (Formspree, Web3Forms). Rien à héberger, mais c'est une dépendance externe et le volume gratuit est limité.
- Un petit backend NestJS avec une base de données. C'est le plus souple (suivi des commandes, statut), mais c'est surdimensionné pour démarrer.

Dans tous les cas : protection anti-spam (honeypot et limitation de débit) et consentement au traitement des données.

## D5 — Identité « Khop »
**Statut : proposé, à valider avec Hermann.**
- Nom : ຂອບ, « bord » en lao. Court et prononçable en anglais comme en lao.
- Palette : indigo des textiles lao et safran.
- Logo : cadre à onglets.

## D6 — Hébergement de la preview : GitHub Pages
**Statut : en suspens (15 novembre 2026).** Christophe en parle d'abord avec Hermann ; ne rien déployer ni créer de dépôt distant d'ici là. Le workflow `pages.yml` est resté dans le dépôt mais n'a jamais tourné.

À savoir pour la discussion : Pages sur un dépôt privé demande un compte GitHub payant, et Pages ne peut pas héberger la fonction d'envoi des commandes envisagée pour M2 (D4). Cloudflare Pages ou Netlify couvrent les deux gratuitement. L'hébergement de production et le domaine restent à décider (voir la question ouverte 7).

## D7 — Textes dans un dictionnaire, traduction au chargement
**Statut : fait le 15 novembre 2026 par Claude Code, à la demande de Christophe (préparation de M3). Les langues elles-mêmes ne sont pas décidées.**

**Choix.**
- Tous les textes sont dans `src/i18n/en.js`, un objet à plat `clé → texte`, avec des variables `{nom}`. `src/i18n.js` fournit `t()` et le choix de la langue.
- `index.html` garde le texte anglais (c'est ce qui s'affiche avant le script, et ce que lit un moteur de recherche) et chaque élément porte un `data-i18n`. Un test vérifie que les deux restent identiques.
- `catalog.js` ne contient plus que des ids ; les libellés sont dans le dictionnaire. `pricing.js` renvoie des lignes de prix avec des ids, et `main.js` les met en texte.
- Langue choisie dans l'ordre : `?lang=` dans l'URL, dernier choix mémorisé sur l'appareil, langue du navigateur, anglais.
- Le sélecteur de langue n'apparaît que s'il y a au moins deux langues. Il est donc invisible aujourd'hui.

**Limites connues.**
- Une seule URL pour toutes les langues : moins bon pour le référencement que des pages par langue, et un visiteur non anglophone voit l'anglais une fraction de seconde. Si le référencement en lao ou en français compte, passer à des pages générées par langue (Astro, voir D1) ; le dictionnaire se reprend tel quel.
- Restent en dur : le nom « Khop » et la ligne de copyright, les horaires de `config.js` (« Mon–Sat »), l'unité « cm », le format des montants (`1,300,000 ₭`).

## D8 — Le récapitulatif de commande reste dans la langue de l'atelier
**Statut : proposé.** Le texte que le client copie ou envoie sur WhatsApp est rédigé en anglais quelle que soit la langue du site (`ORDER_LOCALE` dans `src/i18n.js`), pour que l'atelier reçoive toujours le même format. À confirmer avec Hermann : il préfère peut-être le lire en lao ou en français, auquel cas c'est une ligne à changer une fois la langue ajoutée.
