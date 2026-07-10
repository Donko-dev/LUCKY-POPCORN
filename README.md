# Lucky Popcorn — Site vitrine (PWA hors-ligne)

Site vitrine 100% statique (HTML/CSS/JS), sans serveur ni base de données, pour **Lucky Popcorn** (Agla, Cotonou, Bénin) — pop-corn artisanal et distribution de gaz bio-combustible.

## 📁 Contenu du projet

```
lucky-popcorn/
├── index.html          → Page principale (catalogue, hero, footer)
├── admin.html           → Espace producteur (ajouter/supprimer produits)
├── manifest.json        → Manifeste PWA (installation sur écran d'accueil)
├── sw.js                 → Service Worker (mise en cache hors-ligne)
├── css/style.css        → Design (thème clair/sombre inclus)
├── js/data.js            → Catalogue de données (FR/EN, prix, contacts)
├── js/icons.js           → Illustrations vectorielles (SVG) générées pour chaque article
├── js/app.js              → Logique du site (filtres, langue, devise, modal, PWA)
├── js/admin.js            → Logique de l'espace producteur
└── assets/                → Logo Lucky Popcorn + icônes d'application (toutes tailles)
```

## ✅ Fonctionnalités livrées

### Site public
- **Catalogue complet** : socle commun, variantes sucrées, qualités de caramel, distribution de gaz bio-combustible, activités, et une section libre **"Autres activités & secteurs"** (regroupée par secteur).
- **Bouton WhatsApp** sous chaque produit/service/activité avec message pré-rempli.
- **Fiches détails** avec galerie photo (jusqu'à 4 images, avec flèches de navigation), description, prix — y compris prix barré + prix promo si une promotion est activée.
- **Prix en FCFA, EUR, USD** (sélecteur de devise).
- **Thème clair / sombre**, **Français / English**, recherche, menu de catégories (Tous / Produits / Services / Activités / Autres activités & secteurs).
- **Réseaux sociaux** : vrais logos SVG (WhatsApp, TikTok, Facebook) en pied de page, tous clignotants (pulse).
- **Bulle "Partenariat & outils personnalisés"** avec clignotement **doré**, WhatsApp + Email.
- Lien boutique EMPIRE DONKO TOOLS STORE + mention "Powered by EMPIRE DONKO" en pied de page.
- **PWA installable** : le bouton "Installer l'application" **disparaît automatiquement une fois l'app installée** sur l'appareil, mais reste visible et fonctionnel pour tout visiteur qui ouvre le site dans un navigateur.
- **Protection anti-copie activable** (voir plus bas — à utiliser avec des attentes réalistes).

### Espace producteur (`admin.html`) — centre de contrôle sans toucher au code
- **Ajouter, modifier et supprimer** n'importe quel produit, service, activité, ou "autre activité / secteur" librement nommé.
- **Jusqu'à 4 photos par produit** (remplacent l'illustration automatiquement si ajoutées).
- **Prix normal + prix promo optionnel** (le prix normal s'affiche alors barré).
- **Placement au choix** : "Catalogue principal" ou "Autres activités & secteurs" — vous décidez où chaque produit apparaît sur le site.
- **Lien externe et lien vidéo optionnels** par produit.
- **Éditeur de textes du site** : modifiez titres, sous-titres, gras/italique/souligné, couleur et taille de tous les textes principaux (accueil, sections, pied de page), en FR et EN, sans toucher au code.
- **Changer le code d'accès producteur** directement depuis l'admin.
- **Activer/désactiver la protection anti-copie** du site depuis un simple interrupteur.
- **Export / Import / Réinitialisation** du catalogue en JSON (sauvegarde et restauration faciles).

## ⚠️ Limites importantes à connaître

- **Stockage des images** : les photos sont enregistrées directement dans le navigateur (localStorage), qui a une limite d'environ 5 à 10 Mo par appareil. Utilisez des photos de taille raisonnable (compressées) — évitez les photos en très haute résolution, sous peine d'atteindre cette limite après plusieurs produits.
- **Les données admin sont locales à l'appareil** : ce que vous ajoutez depuis le téléphone A ne s'affiche pas automatiquement sur le téléphone B, ni sur le site public en ligne, car il n'y a pas de base de données centrale (conformément à la demande initiale "hors serveur, hors base de données"). Pour publier vos changements à tous vos visiteurs, utilisez **Exporter (JSON)** dans l'admin, puis remplacez le fichier de données correspondant sur GitHub, ou dites-le-moi et je peux vous aider à l'intégrer au code source directement.
- **Protection anti-copie** : c'est un frein simple (blocage clic-droit / sélection / copier-coller), pas une sécurité réelle. Un site 100% autonome (sans serveur) ne peut techniquement pas empêcher un visiteur déterminé de consulter le code source via son navigateur. Aucun site web statique ne peut garantir une protection absolue contre le piratage — soyez prudent avec toute promesse en ce sens.
- **Mot de passe producteur** : stocké lui aussi uniquement sur l'appareil utilisé pour l'admin — si vous le changez sur un appareil, il ne changera pas sur un autre appareil ouvrant `admin.html`.

## 🎨 À propos des images

Comme il n'existe pas d'outil de génération de photos réalistes dans cet environnement, chaque produit/service/activité utilise une **illustration vectorielle (SVG) originale, générée sur mesure** (forme + palette de couleurs uniques) plutôt qu'une photo. Elles s'affichent instantanément, ne pèsent presque rien, et fonctionnent hors-ligne — mais si vous préférez de vraies photos, vous pouvez les glisser dans `/assets` et les référencer à la place des SVG dans `js/data.js` (propriété `icon`), ou me transmettre des photos à intégrer.

## 🌐 Mise en ligne sur GitHub (pour obtenir un lien d'accès)

Je n'ai pas d'accès réseau depuis cet environnement, donc je ne peux pas créer le dépôt GitHub à votre place — mais voici la marche à suivre (5 minutes) :

1. Créez un compte sur [github.com](https://github.com) si besoin.
2. Créez un nouveau dépôt, par exemple `lucky-popcorn`.
3. Téléversez **tous les fichiers de ce dossier** (glisser-déposer sur la page du dépôt, ou via `git push`).
4. Allez dans **Settings → Pages**, choisissez la branche `main` et le dossier `/ (root)`, puis **Save**.
5. Après 1-2 minutes, votre site sera accessible à une adresse du type :
   `https://votre-nom-utilisateur.github.io/lucky-popcorn/`
6. Partagez ce lien : vos clients pourront l'ouvrir et cliquer sur "Installer l'application" pour l'ajouter à leur écran d'accueil.

*Note : le Service Worker (mode hors-ligne + installation PWA) ne fonctionne que lorsque le site est servi via HTTPS (comme GitHub Pages) ou un serveur local — pas en ouvrant simplement le fichier `index.html` en double-clic. Le catalogue et les boutons WhatsApp, eux, fonctionnent dans tous les cas.*

## ✏️ Modifier les contacts, prix ou textes

- **Code producteur par défaut : `19001`** — changez-le depuis l'admin (section "🔑 Modifier le code producteur") dès que possible.

- Numéros WhatsApp, email, liens réseaux sociaux et boutique : en haut de `js/data.js`.
- Taux de change EUR/USD : variable `FX` dans `js/data.js`.
- Textes FR/EN : objet `I18N` dans `js/data.js`.
- Ajout de nouveaux produits sans toucher au code : page `admin.html`.
