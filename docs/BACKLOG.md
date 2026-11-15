# Backlog

Chaque jalon a un critère de sortie. On ne passe au suivant qu'une fois ce critère atteint.

## M0 — Mise en route
**Sortie :** Hermann a vu la preview en ligne.
- [x] Découper le prototype en modules, avec tests et CI
- [ ] Créer le dépôt GitHub (privé) et pousser
- [ ] Activer Pages (Settings → Pages → Source : GitHub Actions)
- [ ] Envoyer le lien de preview à Hermann, avec les questions ouvertes de `HANDOFF.md` §4

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
- [ ] Décider des langues (EN, LO, FR ?)
- [ ] Extraire les textes de `index.html` et `main.js` dans des fichiers de traduction ; revoir D1 si nécessaire
- [ ] Faire relire le lao par un locuteur natif

## M4 — Lancement
**Sortie :** le site est en ligne sur son domaine.
- [ ] Réserver le domaine et choisir l'hébergement de production
- [ ] Mesure d'audience légère, sans cookie (Plausible, GoatCounter ou Cloudflare Web Analytics)
- [ ] Fiche Google Business Profile qui pointe vers le site
- [ ] Vérification finale : mobile, sombre, accessibilité au clavier, Lighthouse

## Plus tard
- Galerie de réalisations
- Formulaire de devis custom dédié (photos de l'objet, dimensions, usage)
- Tarifs pour les séries (artistes, expositions, hôtels)
- Petit back-office pour modifier le catalogue et les prix sans toucher au code
