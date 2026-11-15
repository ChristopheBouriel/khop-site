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
**Statut : proposé.** Pages sert à montrer l'avancement à Hermann à chaque push sur `main`. L'hébergement de production et le domaine restent à décider (voir la question ouverte 7).
