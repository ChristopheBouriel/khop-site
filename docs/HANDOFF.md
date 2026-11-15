# Hand-off : site Khop

_Dernière mise à jour : 15 novembre 2026._

Ce document donne à Claude (ou à n'importe qui reprenant le projet) tout le contexte nécessaire. Il complète `CLAUDE.md`, qui décrit comment travailler dans le dépôt.

## 1. Le projet

**L'activité.** Christophe et son ami Hermann lancent au Laos un petit atelier de **cadres sur-mesure**. Le site doit permettre aux clients de commander un cadre en donnant les dimensions de leur œuvre et en choisissant la couleur de la moulure, le passe-partout, etc.

**Les clients visés.** Des locaux, expats ou Laotiens, qui cherchent des cadres de qualité pour la déco, et des artistes et photographes.

**Le modèle de commande.**
- Le client configure son cadre et envoie une **demande de commande**. Il n'y a aucun paiement en ligne.
- L'atelier confirme le prix et la date de retrait par message.
- Le client **paie au retrait**.
- Il faut une voie de contact pour les demandes **custom**, hors configurateur.

**Les prix.**
- On commence avec des **forfaits par taille**.
- Le **passe-partout est optionnel**, avec un prix **par tranche selon sa surface**.
- Le catalogue réel (moulures, couleurs) n'est pas encore défini.

**L'identité.** « Khop » (ຂອບ, « bord » en lao), la palette indigo et safran et le logo sont une **proposition de Claude**, pas encore validée par Christophe et Hermann.

## 2. Où on en est

Un prototype d'une seule page a été fait dans Claude (`prototype/khop-prototype.html`), puis découpé en modules testés dans ce dépôt. Fonctionne aujourd'hui :

- Saisie des dimensions (10 à 200 cm, pas de 0,5), bouton de rotation.
- 6 finitions et 3 profils de moulure, 5 passe-partout (dont « Saa paper », papier de mûrier local, avec une texture), 3 largeurs de marge, 3 options de verre.
- **Aperçu SVG à l'échelle** : moulure à onglets éclairée, biseau du passe-partout, reflet du verre, ombre portée. Il affiche par défaut un paysage peint au chargement ; le client peut charger sa propre image et caler la hauteur sur ses proportions.
- **Prix en direct**, au détail par ligne. Au-delà de la plus grande taille, la commande passe en « On quote ».
- Tables de prix générées depuis le catalogue.
- **Formulaire de commande.** Il produit un récapitulatif texte avec une référence `KH-MMJJ-XXXX`, que le client copie ou envoie sur WhatsApp (lien `wa.me`, actif seulement si un numéro est configuré).
- Section « Custom work » avec les coordonnées.
- Thème clair et sombre automatique, mise en page mobile.
- 29 tests (`npm test`) : prix, commande, cohérence des textes.
- Textes regroupés dans `src/i18n/en.js`, prêts à être traduits (D7).
- Workflows GitHub présents (tests, déploiement Pages) mais jamais lancés.

**Pas encore fait :**
- Aucune commande n'arrive à l'atelier automatiquement : le client doit copier ou envoyer lui-même.
- L'image chargée par le client reste dans son navigateur ; elle n'est pas jointe à la commande.
- Le site n'existe qu'en anglais (la mécanique de traduction est en place, aucune autre langue n'est écrite).
- Le dépôt n'existe qu'en local : ni dépôt GitHub, ni preview en ligne.

## 2 bis. Où reprendre

**État au 15 novembre 2026, fin de la première session Claude Code.**
- Dépôt git local sur `main`. Vérifier avec `git status` s'il reste des modifications non commitées.
- Fait pendant la session : revue du code et du site dans un navigateur (400 px et bureau, clair et sombre, parcours de commande complet, aucune erreur console), puis extraction des textes (D7, D8).
- **La revue a relevé 10 défauts, listés dans `BACKLOG.md`. Aucun n'est corrigé.**
- **Hébergement et dépôt distant : en suspens**, Christophe en parle avec Hermann (D6). Ne pas créer de dépôt GitHub ni déployer sans qu'il le demande.

**Pour reprendre**, dans l'ordre le plus probable :
1. Christophe rapporte les réponses de Hermann aux questions du §4 → M1 (vrai contenu) et la décision d'hébergement.
2. Sans attendre Hermann : corriger les défauts du backlog (tous sauf le n° 5), ou préparer le côté site de M2 (écran de confirmation, anti-spam, messages d'erreur).
3. Dès que les langues sont décidées : M3, il n'y a plus qu'à écrire les fichiers de traduction.

## 3. Ce qui est provisoire (PLACEHOLDER)

Tout ceci a été inventé pour le prototype et **ne doit pas partir en ligne tel quel** :

| Élément | Où | Valeur actuelle |
|---|---|---|
| Nom, logo, palette | `index.html`, `styles.css`, `assets/` | Khop, indigo + safran |
| Ville de l'atelier | `config.js`, `index.html` (en-tête) | Luang Prabang (supposé) |
| Adresse, horaires | `config.js` | « Address to come », lun–sam 9h–18h |
| WhatsApp, email | `config.js` | numéro factice, `hello@khop.la` (domaine non réservé) |
| Grille de prix | `catalog.js` | S 350 000 ₭ … XL 1 300 000 ₭ ; passe-partout 90 000 → 400 000 ₭ ; verre anti-reflet en supplément |
| Finitions et profils | `catalog.js` | teck, teck foncé, palissandre, noir, blanc, or ; 2 / 3,5 / 5 cm |
| Délai de 3 à 5 jours, paiement cash ou LaoQR | `index.html` | supposés |
| Bandeau « Preview… » | `index.html` | à retirer au lancement |

## 4. Questions ouvertes, à trancher avec Hermann

1. **Nom et identité** : on garde Khop ? Sinon lequel ?
2. **Où est l'atelier**, quelle adresse, quels horaires ?
3. **Catalogue réel** : quelles moulures, de quel fournisseur, quelles largeurs ? Il faudra des photos des vrais échantillons.
4. **Grille de prix réelle** : les seuils des tailles S, M, L, XL conviennent-ils ? Quel prix par tranche de passe-partout ?
5. **Langues** : anglais seul, ou anglais + lao, + français ?
6. **Réception des commandes** : comment l'atelier veut-il les recevoir ? Email, WhatsApp, Telegram ou tableur ? Voir D4.
7. **Nom de domaine et hébergement de production.**
8. Moyens de paiement acceptés au retrait, et délai standard.

## 5. Règles métier de prix (implémentées dans `src/pricing.js`)

- **Ouverture** = œuvre + 2 × marge du passe-partout (marge 0 si pas de passe-partout).
- **Taille du cadre** : la plus petite taille dont `fit = [petit côté, grand côté]` contient l'ouverture, **quelle que soit l'orientation**. Les bornes sont inclusives.
- **Au-delà de la plus grande taille** (XL, 100 × 140 cm) : pas de prix, « On quote », taille notée XXL dans la commande.
- **Passe-partout** : prix selon la tranche de **surface de l'ouverture** en m², bornes hautes inclusives. Les tranches s'arrêtent à la même limite que les tailles : toute ouverture qui a une taille a une tranche (c'est testé).
- **Verre** : le verre clair est inclus, l'anti-reflet a un supplément par taille, et on peut choisir sans verre (pour les toiles).
- **Dimensions extérieures** = ouverture + 2 × largeur du profil (pour l'affichage seulement).
- **Total** = somme des lignes ; dans le récapitulatif de commande, il est multiplié par la quantité.
- Montants en **kip entiers**, affichés `1,300,000 ₭`.

## 6. Architecture

Site statique : HTML, CSS et modules ES natifs, sans build ni dépendance (voir D1). Les fichiers sont décrits dans `CLAUDE.md`. Le principe : les données (`catalog.js`, `config.js`) et les textes (`src/i18n/`) sont séparés de la logique pure et testée (`pricing.js`, `order.js`, `i18n.js`), elle-même séparée du rendu (`preview.js`, `main.js`).

L'aperçu (`preview.js`) génère un SVG dont le `viewBox` est en centimètres :
- la moulure est faite de 4 trapèzes ombrés différemment ;
- la texture du papier Saa vient d'un `feTurbulence` passé dans un `feColorMatrix` ;
- le reflet du verre est un `linearGradient` diagonal, atténué pour l'anti-reflet.

## 7. Design

L'intention : un établi d'atelier, avec l'aperçu sur un « mur » à gauche (sticky) et la fiche de commande à droite. Sur mobile, les deux s'empilent.

- **Couleurs** (tokens sur `:root`) : fond gris-vert clair, encre bleu nuit, **indigo** (textiles lao) comme accent, **safran** pour le bouton d'action et les numéros d'étapes. Chaque couleur a sa version sombre.
- **Polices** : Young Serif pour les titres, Figtree pour le texte, IBM Plex Mono pour les mesures et les prix, Noto Sans Lao pour le lao.
- Les mesures et montants sont en chiffres tabulaires et en police mono.

Si l'identité change, il suffit de remplacer les tokens et le logo ; les composants n'utilisent que les tokens.

## 8. Prochaines étapes

Voir `docs/BACKLOG.md`. En résumé :
- **M0** : pousser le dépôt, activer Pages, montrer la preview à Hermann.
- **M1** : remplacer les placeholders par le vrai contenu.
- **M2** : faire arriver les commandes à l'atelier.
- **M3** : les langues.
- **M4** : le lancement.

## 9. Message à donner à Claude Code pour reprendre

> Lis CLAUDE.md puis docs/HANDOFF.md (surtout « Où reprendre »), docs/DECISIONS.md et docs/BACKLOG.md. Lance `npm test` et `git status`, puis dis-moi en quelques lignes où on en est et ce que tu proposes d'attaquer. Ne modifie rien avant qu'on en ait parlé.
