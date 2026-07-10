/* =========================================================================
   LUCKY POPCORN — Catalogue de données
   Toutes les données sont statiques (mode hors-ligne) mais peuvent être
   surchargées depuis l'espace producteur (localStorage) sans base de données.
   ========================================================================= */

const WHATSAPP_ORDER_NUMBER = "2290166920715";   // Commandes Lucky Popcorn
const PARTNER_WHATSAPP_NUMBER = "2290196809106";  // Partenariats EMPIRE DONKO
const PARTNER_EMAIL = "empiredonko@gmail.com";
const TIKTOK_URL = "https://www.tiktok.com/@luckmandjaboutou";
const FACEBOOK_URL = "https://www.facebook.com/share/19KLBMpp7P/";
const TOOLS_STORE_URL = "https://majesticfordonko.mychariow.shop";

// Taux indicatifs (à ajuster par le producteur) — 1 EUR = 655.957 FCFA (parité fixe UEMOA)
const FX = {
  FCFA: 1,
  EUR: 1 / 655.957,
  USD: 1 / 605       // taux indicatif, marché parallèle/moyen — non contractuel
};

const CURRENCY_SYMBOLS = { FCFA: "FCFA", EUR: "€", USD: "$" };

const I18N = {
  fr: {
    brand: "Lucky Popcorn",
    tagline: "Pop-corn gourmet, fait maison — Cotonou, Agla",
    navHome: "Accueil",
    navProducts: "Produits",
    navServices: "Services",
    navActivities: "Activités",
    navAll: "Tous",
    navContact: "Contact",
    heroTitle: "Le pop-corn qui éclate de bonheur",
    heroSubtitle: "Maïs soufflé artisanal, caramels maison et saveurs sucrées-salées, préparés à Agla, Cotonou. Commandez en un clic sur WhatsApp.",
    heroCta: "Voir le catalogue",
    heroCta2: "Commander sur WhatsApp",
    installBtn: "Installer l'application",
    installedBtn: "Application installée",
    sectionSocle: "Le socle commun",
    sectionSucre: "Les variantes sucrées",
    sectionCaramel: "Les qualités de caramel",
    sectionGaz: "Distribution de gaz bio-combustible",
    sectionActivites: "Nos activités",
    sectionAutres: "Autres activités & secteurs",
    navAutres: "Autres activités & secteurs",
    viewDetails: "Voir les détails",
    orderWhatsapp: "Commander sur WhatsApp",
    from: "à partir de",
    close: "Fermer",
    ingredients: "Ingrédients & procédé",
    quality: "Qualité premium",
    qualityText: "Préparé avec du maïs à éclater de type Butterfly, sélectionné pour un pop-corn léger, croustillant et régulier.",
    footerPowered: "Powered by",
    footerStore: "Boutique d'outils",
    footerAddress: "Agla, en face de la Pharmacie Cristal Santé, carrefour Agla Akplomey, Cotonou, Bénin",
    footerRights: "Tous droits réservés.",
    partnerBubbleTitle: "Partenariat & outils personnalisés",
    partnerBubbleText: "Une idée d'outil sur mesure pour votre activité ? Écrivez-nous.",
    partnerWhatsapp: "WhatsApp",
    partnerEmail: "Email",
    themeLight: "Mode clair",
    themeDark: "Mode sombre",
    langSwitch: "EN",
    menuLabel: "Catégories",
    adminLink: "Espace producteur",
    all: "Tous",
    products: "Produits",
    services: "Services",
    activities: "Activités",
    priceUnit: "sachet",
    gasUnit: "bouteille",
    searchPlaceholder: "Rechercher un produit ou service…",
    noResults: "Aucun résultat pour cette recherche.",
    watchVideo: "Voir la vidéo",
    viewLink: "Voir plus (lien)",
    promoLabel: "Promo",
    orderMsgPopcorn: (name) => `Bonjour Lucky Popcorn 👋, je souhaite commander : ${name}. Merci de me confirmer la disponibilité et le prix.`,
    orderMsgGas: (name) => `Bonjour, je souhaite commander une prestation de distribution de gaz bio-combustible : ${name}. Merci de me contacter pour la livraison.`,
    orderMsgActivity: (name) => `Bonjour, je suis intéressé(e) par votre activité : ${name}. Pouvez-vous me donner plus d'informations ?`,
    orderMsgCustom: (name) => `Bonjour, je suis intéressé(e) par : ${name}. Pouvez-vous me donner plus d'informations et le prix ?`,
    partnerMsg: "Bonjour EMPIRE DONKO 👋, je souhaite discuter d'un partenariat ou d'un outil personnalisé pour mon activité.",
  },
  en: {
    brand: "Lucky Popcorn",
    tagline: "Gourmet, homemade popcorn — Cotonou, Agla",
    navHome: "Home",
    navProducts: "Products",
    navServices: "Services",
    navActivities: "Activities",
    navAll: "All",
    navContact: "Contact",
    heroTitle: "Popcorn that bursts with happiness",
    heroSubtitle: "Handmade popped corn, homemade caramels and sweet-savory flavors, made in Agla, Cotonou. Order in one click on WhatsApp.",
    heroCta: "See the catalog",
    heroCta2: "Order on WhatsApp",
    installBtn: "Install the app",
    installedBtn: "App installed",
    sectionSocle: "The classics",
    sectionSucre: "Sweet variations",
    sectionCaramel: "Caramel qualities",
    sectionGaz: "Biofuel gas distribution",
    sectionActivites: "Our activities",
    sectionAutres: "Other activities & sectors",
    navAutres: "Other activities & sectors",
    viewDetails: "View details",
    orderWhatsapp: "Order on WhatsApp",
    from: "from",
    close: "Close",
    ingredients: "Ingredients & process",
    quality: "Premium quality",
    qualityText: "Made with Butterfly-type popping corn, selected for light, crunchy and consistent popcorn.",
    footerPowered: "Powered by",
    footerStore: "Tools store",
    footerAddress: "Agla, opposite Pharmacie Cristal Santé, Agla Akplomey junction, Cotonou, Benin",
    footerRights: "All rights reserved.",
    partnerBubbleTitle: "Partnership & custom tools",
    partnerBubbleText: "Need a custom tool for your business? Write to us.",
    partnerWhatsapp: "WhatsApp",
    partnerEmail: "Email",
    themeLight: "Light mode",
    themeDark: "Dark mode",
    langSwitch: "FR",
    menuLabel: "Categories",
    adminLink: "Producer area",
    all: "All",
    products: "Products",
    services: "Services",
    activities: "Activities",
    priceUnit: "bag",
    gasUnit: "bottle",
    searchPlaceholder: "Search a product or service…",
    noResults: "No results for this search.",
    watchVideo: "Watch video",
    viewLink: "See more (link)",
    promoLabel: "Sale",
    orderMsgPopcorn: (name) => `Hello Lucky Popcorn 👋, I would like to order: ${name}. Please confirm availability and price.`,
    orderMsgGas: (name) => `Hello, I would like to order a biofuel gas delivery service: ${name}. Please contact me for delivery.`,
    orderMsgActivity: (name) => `Hello, I'm interested in your activity: ${name}. Could you give me more information?`,
    orderMsgCustom: (name) => `Hello, I'm interested in: ${name}. Could you give me more information and the price?`,
    partnerMsg: "Hello EMPIRE DONKO 👋, I'd like to discuss a partnership or a custom tool for my business.",
  }
};

/* icon: reference to an SVG illustration generated in js/icons.js (id + palette) */
const DEFAULT_CATALOG = {
  products: [
    {
      id: "nature",
      group: "socle",
      icon: { shape: "kernel", palette: "cream" },
      name: { fr: "Popcorn Nature (Simple)", en: "Plain Popcorn (Nature)" },
      short: { fr: "Grains soufflés à l'air chaud, légers et croustillants.", en: "Air-popped corn, light and crunchy." },
      details: {
        fr: "Grains de maïs soufflés à l'air chaud ou dans une cuillère à soupe d'huile neutre. Le bon grain éclate complètement et reste léger — sans sel, sans sucre, 100% nature.",
        en: "Corn kernels popped with hot air or a tablespoon of neutral oil. A good kernel pops fully and stays light — no salt, no sugar, 100% natural."
      },
      priceFCFA: { small: 300, medium: 500, large: 800 }
    },
    {
      id: "sale",
      group: "socle",
      icon: { shape: "kernel", palette: "gold" },
      name: { fr: "Popcorn Salé", en: "Salted Popcorn" },
      short: { fr: "Salé à chaud juste après l'éclatement pour une adhérence parfaite.", en: "Salted hot right after popping for perfect adhesion." },
      details: {
        fr: "Salé immédiatement après l'éclatement, lorsque le pop-corn est encore chaud, pour que le sel adhère naturellement. Nous utilisons du sel fin ou de la fleur de sel pour une meilleure tenue.",
        en: "Salted immediately after popping, while still hot, so the salt adheres naturally. We use fine salt or fleur de sel for the best texture."
      },
      priceFCFA: { small: 300, medium: 500, large: 800 }
    },
    {
      id: "sucre-seul",
      group: "sucre",
      icon: { shape: "kernel", palette: "pink" },
      name: { fr: "Popcorn Sucré", en: "Sweet Popcorn" },
      short: { fr: "Sucre cristallisé ajouté en fin de cuisson pour un enrobage léger.", en: "Crystallized sugar added at the end of cooking for a light coating." },
      details: {
        fr: "Le sucre cristallisé est ajouté directement en fin de cuisson pendant que le maïs éclate, ce qui enrobe le grain sous l'effet de la chaleur, ou saupoudré juste à la fin.",
        en: "Crystallized sugar is added directly at the end of cooking while the corn pops, coating the kernel with the heat, or sprinkled at the very end."
      },
      priceFCFA: { small: 300, medium: 500, large: 800 }
    },
    {
      id: "beurre",
      group: "sucre",
      icon: { shape: "kernel", palette: "butter" },
      name: { fr: "Popcorn Beurré \"Goût Cinéma\"", en: "Buttered Popcorn \"Cinema Taste\"" },
      short: { fr: "Arrosé de beurre fondu tiède puis salé ou sucré.", en: "Drizzled with warm melted butter, then salted or sweetened." },
      details: {
        fr: "Une fois le maïs éclaté nature, on l'arrose de beurre fondu tiède, puis on le sale (ou sucre) pour créer le classique goût cinéma.",
        en: "Once the corn is popped plain, it's drizzled with warm melted butter, then salted (or sweetened) to create the classic cinema taste."
      },
      priceFCFA: { small: 400, medium: 700, large: 1100 }
    },
    {
      id: "caramel-sucre",
      group: "caramel",
      icon: { shape: "cluster", palette: "amber" },
      name: { fr: "Caramel au Sucre", en: "Sugar Caramel" },
      short: { fr: "Caramel classique, enrobage craquant.", en: "Classic caramel, crunchy coating." },
      details: {
        fr: "Un caramel classique réalisé à partir de sucre fondu, chauffé jusqu'à obtention d'une couleur ambrée pour un goût torréfié, puis enrobé rapidement. Il durcit en refroidissant pour un enrobage très craquant.",
        en: "A classic caramel made from melted sugar, heated until amber for a roasted flavor, then quickly coated. It hardens as it cools for a very crunchy coating."
      },
      priceFCFA: { small: 500, medium: 900, large: 1500 }
    },
    {
      id: "caramel-miel",
      group: "caramel",
      icon: { shape: "cluster", palette: "honey" },
      name: { fr: "Caramel au Miel", en: "Honey Caramel" },
      short: { fr: "Le miel remplace le sucre pour une saveur florale et moelleuse.", en: "Honey replaces sugar for a floral, soft flavor." },
      details: {
        fr: "Le miel remplace une partie ou la totalité du sucre. Il apporte une saveur florale unique, un moelleux plus prononcé et une belle coloration ambrée.",
        en: "Honey replaces some or all of the sugar. It brings a unique floral flavor, a softer bite and a beautiful amber color."
      },
      priceFCFA: { small: 600, medium: 1000, large: 1700 }
    },
    {
      id: "caramel-beurre-sale",
      group: "caramel",
      icon: { shape: "cluster", palette: "cocoa" },
      name: { fr: "Caramel au Beurre Salé", en: "Salted Butter Caramel" },
      short: { fr: "Caramel onctueux au beurre et à la fleur de sel.", en: "Creamy caramel with butter and fleur de sel." },
      details: {
        fr: "L'ajout de beurre (et parfois d'une touche de crème liquide ou de fleur de sel) au caramel chaud permet de créer une texture onctueuse qui enrobe parfaitement les grains.",
        en: "Adding butter (and sometimes a touch of cream or fleur de sel) to the hot caramel creates a creamy texture that perfectly coats the kernels."
      },
      priceFCFA: { small: 600, medium: 1000, large: 1700 }
    },
    {
      id: "sucre-lait",
      group: "caramel",
      icon: { shape: "cluster", palette: "milk" },
      name: { fr: "Sucré au Lait (Dulce de Leche)", en: "Milk Sweet (Dulce de Leche)" },
      short: { fr: "Caramel au lait concentré, crémeux et lacté.", en: "Condensed milk caramel, creamy and milky." },
      details: {
        fr: "Le caramel est réalisé avec du lait concentré (souvent sucré) ou en incorporant du lait à la préparation. Cela donne une texture crémeuse et une saveur lactée, très proche du goût dulce de leche.",
        en: "The caramel is made with condensed milk (often sweetened) or by incorporating milk into the mix. This gives a creamy texture and a milky flavor, very close to dulce de leche."
      },
      priceFCFA: { small: 700, medium: 1200, large: 2000 }
    }
  ],
  services: [
    {
      id: "gaz-6kg",
      group: "gaz",
      icon: { shape: "bottle", palette: "blue", size: "sm" },
      name: { fr: "Bouteille de Gaz Bio-combustible 6 kg", en: "6 kg Biofuel Gas Bottle" },
      short: { fr: "Format compact, idéal petits foyers.", en: "Compact size, ideal for small households." },
      details: { fr: "Distribution et livraison à domicile de bouteilles de gaz bio-combustible 6 kg, consigne ou recharge, à Cotonou et environs.", en: "Home distribution and delivery of 6 kg biofuel gas bottles, deposit or refill, in Cotonou and surrounding areas." },
      priceFCFA: { unit: 3500 }
    },
    {
      id: "gaz-12kg",
      group: "gaz",
      icon: { shape: "bottle", palette: "orange", size: "md" },
      name: { fr: "Bouteille de Gaz Bio-combustible 12,5 kg", en: "12.5 kg Biofuel Gas Bottle" },
      short: { fr: "Le format le plus utilisé pour les ménages.", en: "The most common household size." },
      details: { fr: "Distribution et livraison à domicile de bouteilles de gaz bio-combustible 12,5 kg, consigne ou recharge, à Cotonou et environs.", en: "Home distribution and delivery of 12.5 kg biofuel gas bottles, deposit or refill, in Cotonou and surrounding areas." },
      priceFCFA: { unit: 6500 }
    },
    {
      id: "gaz-25kg",
      group: "gaz",
      icon: { shape: "bottle", palette: "red", size: "lg" },
      name: { fr: "Bouteille de Gaz Bio-combustible 25 kg", en: "25 kg Biofuel Gas Bottle" },
      short: { fr: "Pour restaurants et grandes familles.", en: "For restaurants and large families." },
      details: { fr: "Distribution et livraison de bouteilles de gaz bio-combustible 25 kg pour restaurants, snack-bars et grandes familles.", en: "Delivery of 25 kg biofuel gas bottles for restaurants, snack bars and large families." },
      priceFCFA: { unit: 13000 }
    },
    {
      id: "gaz-38kg",
      group: "gaz",
      icon: { shape: "bottle", palette: "green", size: "xl" },
      name: { fr: "Bouteille de Gaz Bio-combustible 38 kg", en: "38 kg Biofuel Gas Bottle" },
      short: { fr: "Format professionnel, forte autonomie.", en: "Professional size, long-lasting." },
      details: { fr: "Distribution de bouteilles de gaz bio-combustible 38 kg pour usage professionnel intensif (restauration, industrie légère).", en: "Distribution of 38 kg biofuel gas bottles for intensive professional use (catering, light industry)." },
      priceFCFA: { unit: 19500 }
    },
    {
      id: "gaz-accessoires",
      group: "gaz",
      icon: { shape: "regulator", palette: "steel" },
      name: { fr: "Accessoires : détendeur & tuyau", en: "Accessories: regulator & hose" },
      short: { fr: "Détendeurs, tuyaux et joints aux normes.", en: "Regulators, hoses and standard-compliant seals." },
      details: { fr: "Vente de détendeurs, tuyaux flexibles et joints d'étanchéité pour une installation sûre et conforme.", en: "Sale of regulators, flexible hoses and sealing joints for a safe, compliant installation." },
      priceFCFA: { unit: 4000 }
    },
    {
      id: "gaz-livraison",
      group: "gaz",
      icon: { shape: "truck", palette: "steel" },
      name: { fr: "Livraison express à domicile", en: "Express home delivery" },
      short: { fr: "Livraison rapide de gaz bio-combustible, tous formats.", en: "Fast delivery of biofuel gas, all sizes." },
      details: { fr: "Service de livraison express de bouteilles de gaz bio-combustible (tous formats) à domicile ou en entreprise, à Cotonou et environs.", en: "Express delivery service for biofuel gas bottles (all sizes) to homes or businesses, in Cotonou and surrounding areas." },
      priceFCFA: { unit: 1000 }
    }
  ],
  activities: [
    {
      id: "act-production",
      group: "activite",
      icon: { shape: "kettle", palette: "amber" },
      name: { fr: "Production artisanale de Pop-corn", en: "Artisanal Popcorn Production" },
      short: { fr: "Fabrication maison, recettes maison, qualité contrôlée.", en: "Homemade production, homemade recipes, controlled quality." },
      details: { fr: "Lucky Popcorn fabrique tous ses pop-corn de façon artisanale à Agla, Cotonou, avec du maïs à éclater sélectionné et des recettes de caramel maison.", en: "Lucky Popcorn makes all its popcorn artisanally in Agla, Cotonou, using selected popping corn and homemade caramel recipes." }
    },
    {
      id: "act-gaz",
      group: "activite",
      icon: { shape: "bottle", palette: "blue" },
      name: { fr: "Distribution de Gaz Bio-combustible", en: "Biofuel Gas Distribution" },
      short: { fr: "Vente et livraison de bouteilles de gaz bio-combustible, tous formats.", en: "Sale and delivery of biofuel gas bottles, all sizes." },
      details: { fr: "En complément du pop-corn, Lucky Popcorn distribue des bouteilles de gaz bio-combustible de 6 à 38 kg avec livraison à domicile.", en: "In addition to popcorn, Lucky Popcorn distributes biofuel gas bottles from 6 to 38 kg with home delivery." }
    },
    {
      id: "act-gros",
      group: "activite",
      icon: { shape: "crate", palette: "gold" },
      name: { fr: "Vente en gros & détail", en: "Wholesale & retail" },
      short: { fr: "Pour particuliers, événements et boutiques.", en: "For individuals, events and shops." },
      details: { fr: "Commandes en gros pour événements, mariages, anniversaires et boutiques partenaires, ou au détail pour les particuliers.", en: "Bulk orders for events, weddings, birthdays and partner shops, or retail for individuals." }
    },
    {
      id: "act-partenariat",
      group: "activite",
      icon: { shape: "handshake", palette: "burgundy" },
      name: { fr: "Partenariats & outils personnalisés", en: "Partnerships & custom tools" },
      short: { fr: "Avec EMPIRE DONKO : sites, applications et outils sur mesure.", en: "With EMPIRE DONKO: custom websites, apps and tools." },
      details: { fr: "EMPIRE DONKO accompagne Lucky Popcorn et d'autres entreprises avec des outils numériques sur mesure : sites vitrines, applications, catalogues.", en: "EMPIRE DONKO supports Lucky Popcorn and other businesses with custom digital tools: showcase websites, apps, catalogs." }
    }
  ]
};

DEFAULT_CATALOG.custom = [];

/* Clés de texte modifiables depuis l'espace producteur (sans toucher au code) */
const EDITABLE_TEXT_KEYS = [
  "brand", "tagline", "heroTitle", "heroSubtitle", "heroCta", "heroCta2",
  "sectionSocle", "sectionSucre", "sectionCaramel", "sectionGaz", "sectionActivites", "sectionAutres",
  "footerAddress", "footerRights", "partnerBubbleTitle", "partnerBubbleText"
];

function loadCatalog() {
  try {
    const saved = localStorage.getItem("luckyPopcornCatalog");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.products && parsed.services && parsed.activities) {
        if (!parsed.custom) parsed.custom = [];
        return parsed;
      }
    }
  } catch (e) { console.warn("Catalogue local invalide, retour au catalogue par défaut.", e); }
  return DEFAULT_CATALOG;
}

function saveCatalog(catalog) {
  localStorage.setItem("luckyPopcornCatalog", JSON.stringify(catalog));
}

/* ---------------- Textes du site (titres, sous-titres, mise en forme) ---------------- */

function loadSiteTexts() {
  try {
    const saved = localStorage.getItem("luckySiteTexts");
    if (saved) return JSON.parse(saved);
  } catch (e) { console.warn("Textes personnalisés invalides.", e); }
  return {};
}

function saveSiteTexts(texts) {
  localStorage.setItem("luckySiteTexts", JSON.stringify(texts));
}

/* ---------------- Réglages de sécurité (protection anti-copie) ---------------- */

function loadSecuritySettings() {
  try {
    const saved = localStorage.getItem("luckySecurity");
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return { copyProtection: false };
}

function saveSecuritySettings(settings) {
  localStorage.setItem("luckySecurity", JSON.stringify(settings));
}

/* ---------------- Code d'accès producteur ---------------- */

const ADMIN_PIN_KEY = "luckyAdminPin";

function getAdminPin() {
  return localStorage.getItem(ADMIN_PIN_KEY) || "19001";
}

function setAdminPin(newPin) {
  localStorage.setItem(ADMIN_PIN_KEY, newPin);
}
