# Backlog

Chaque jalon a un critère de sortie. On ne passe au suivant qu'une fois ce critère atteint.

## M0 — Mise en route
**Sortie :** Hermann a vu la preview en ligne.
- [x] Découper le prototype en modules, avec tests et CI
- [x] Dépôt git local (branche `main`)
- [ ] Dépôt GitHub public et preview sur GitHub Pages (D6, procédure `docs/SETUP.md`)
- [ ] Montrer le site à Hermann, avec les questions ouvertes de `HANDOFF.md` §4

## Défauts relevés à la revue du 15 novembre 2026
Rien n'a été corrigé : Christophe choisit ce qu'on traite. Aucun ne dépend de Hermann, sauf le n° 5. Classés du plus au moins gênant.
- [ ] 1. **Tables de prix sur téléphone** : la colonne des prix est hors écran, il faut faire défiler la table sur le côté pour la voir (`table{min-width:520px}`).
- [ ] 2. **Photo du client** : l'image est relue en entier à chaque changement d'option (data URL réinjectée dans le SVG), ce qui ralentit la page avec une photo de téléphone ; et un format illisible (HEIC hors Safari) ne donne aucun message. Réduire l'image à l'import et gérer l'erreur.
- [ ] 3. **« Preview with your image » inaccessible au clavier** : c'est un `label` sur un champ caché.
- [ ] 4. **Sans passe-partout, les largeurs de marge restent cliquables** et l'une reste sélectionnée, sans effet.
- [ ] 5. **Recouvrement de 3 mm** : l'aide dit que le passe-partout recouvre l'œuvre de 3 mm par côté, mais le calcul n'en tient pas compte (ouverture = œuvre + 2 × marge). À trancher avec Hermann : corriger le texte ou le calcul.
- [ ] 6. **Couleurs hors tokens** : `.err` (`#B3261E`, peu lisible en sombre) et le texte de `.cta` (`#1B1408`), contraire à la règle de `CLAUDE.md`.
- [ ] 7. **Message d'erreur du formulaire** non annoncé aux lecteurs d'écran (pas de `role="alert"`) ; l'email et la quantité (max 50) ne sont pas vérifiés ; « Match image proportions » peut donner une hauteur de plus de 200 cm.
- [ ] 8. **Sur téléphone** : le menu disparaît sans remplacement, et l'aperçu n'est plus visible pendant qu'on choisit les options plus bas.
- [ ] 9. **Référence `KH-MMJJ-XXXX`** tirée au hasard dans le navigateur : sans année, doublons possibles. Suffisant tant que rien n'est enregistré ; à revoir en M2.
- [ ] 10. Polices chargées depuis Google Fonts : à héberger avec le site si le chargement est lent au Laos.

## M1 — Vrai contenu
**Sortie :** plus aucun PLACEHOLDER dans `catalog.js`, `config.js` et `index.html`.
- [ ] Valider le nom et l'identité (D5), ou les remplacer (tokens, logo, favicon, textes)
- [ ] Ville, adresse, horaires, WhatsApp, email réels dans `config.js` ; ville dans l'en-tête
- [ ] Catalogue réel : moulures et profils, avec des photos des échantillons, à afficher en texture dans les pastilles et éventuellement dans l'aperçu
- [ ] Grille de prix réelle et tests mis à jour
- [ ] Délai et moyens de paiement réels dans « How an order works »
- [ ] Retirer le bandeau « Preview »
- [ ] Image de partage (Open Graph) et meta description

## M2 — Les commandes arrivent à l'atelier
**Sortie :** une commande passée sur le site arrive chez Hermann sans action du client.
- [ ] Choisir le transport (D4) avec Hermann
- [ ] Implémenter l'envoi, avec honeypot, limitation de débit et message d'erreur clair
- [ ] Optionnel : joindre l'image du client (taille limitée, compressée côté navigateur)
- [ ] Écran de confirmation avec la référence
- [ ] Mention de traitement des données sous le formulaire

## M3 — Langues
**Sortie :** le site est disponible dans les langues décidées.
- [x] Extraire les textes dans un fichier de traduction (`src/i18n/en.js`, voir D7)
- [ ] Décider des langues (EN, LO, FR ?)
- [ ] Pour chaque langue : créer `src/i18n/<code>.js` et l'enregistrer dans `src/i18n.js` (marche à suivre dans `CLAUDE.md`)
- [ ] Faire relire le lao par un locuteur natif
- [ ] Rendre traduisibles les restes en dur : horaires de `config.js`, format des montants, unité « cm »
- [ ] Vérifier la mise en page avec la police lao et des textes plus longs (français), à 400 px
- [ ] Langue du récapitulatif envoyé à l'atelier (D8)
- [ ] Si le référencement par langue compte : pages par langue, donc revoir D1

## M4 — Lancement
**Sortie :** le site est en ligne sur son domaine.
- [ ] Réserver le domaine et choisir l'hébergement de production
- [ ] Mesure d'audience légère, sans cookie (Plausible, GoatCounter ou Cloudflare Web Analytics)
- [ ] Fiche Google Business Profile qui pointe vers le site
- [ ] Vérification finale : mobile, sombre, accessibilité au clavier, Lighthouse
- [ ] Retirer le bandeau « Preview » et la balise `noindex` d'`index.html` (D6)

## Plus tard
- Galerie de réalisations
- Formulaire de devis custom dédié (photos de l'objet, dimensions, usage)
- Tarifs pour les séries (artistes, expositions, hôtels)
- Petit back-office pour modifier le catalogue et les prix sans toucher au code
