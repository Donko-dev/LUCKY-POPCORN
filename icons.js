/* =========================================================================
   LUCKY POPCORN — Illustrations vectorielles (SVG)
   Aucune image externe requise : fonctionne 100% hors-ligne.
   Chaque combinaison forme + palette produit une illustration unique.
   ========================================================================= */

const PALETTES = {
  cream:   { base: "#F6E9CF", mid: "#EAD2A0", dark: "#B9884A", accent: "#7B4A1E" },
  gold:    { base: "#F3D98B", mid: "#E0AE45", dark: "#A9761F", accent: "#6B3F1D" },
  pink:    { base: "#F7D8DE", mid: "#EDA9B8", dark: "#C25B72", accent: "#7B1E3D" },
  butter:  { base: "#FCEBB6", mid: "#F0C86A", dark: "#C99A2E", accent: "#8A5A15" },
  amber:   { base: "#F0C27B", mid: "#D98B3D", dark: "#A4581B", accent: "#5B2E0C" },
  honey:   { base: "#F4D689", mid: "#E3A83B", dark: "#B4740F", accent: "#6B3F1D" },
  cocoa:   { base: "#E7C9A9", mid: "#B9784A", dark: "#7B4A26", accent: "#3D2414" },
  milk:    { base: "#FBF3E3", mid: "#E9D2A8", dark: "#B98F55", accent: "#6B4423" },
  blue:    { base: "#CFE3F0", mid: "#6FA8C9", dark: "#2E6E97", accent: "#153C52" },
  orange:  { base: "#F6D3A8", mid: "#E8934A", dark: "#B75E1C", accent: "#5B2E0C" },
  red:     { base: "#F0BFBF", mid: "#D9605C", dark: "#A62E2A", accent: "#5B1210" },
  green:   { base: "#CDE6CB", mid: "#6FAE6C", dark: "#376B34", accent: "#1B3A19" },
  steel:   { base: "#DCE2E6", mid: "#93A3AD", dark: "#556570", accent: "#2B363D" },
  burgundy:{ base: "#E7C9CE", mid: "#A84A5F", dark: "#7B1E3D", accent: "#3D0F1E" }
};

function kernelSVG(p) {
  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="popcorn">
    <circle cx="100" cy="100" r="96" fill="${p.base}"/>
    <g>
      <path d="M100 45c14-16 40-13 44 6c14-4 28 8 26 24c17 6 20 28 5 38c9 16-3 34-22 33c-3 16-24 23-36 12c-12 11-33 4-36-12c-19 1-31-17-22-33c-15-10-12-32 5-38c-2-16 12-28 26-24c4-19 22-22 10-6z" fill="${p.mid}"/>
      <path d="M100 62c9-10 26-8 29 4c9-3 18 5 17 15c11 4 13 18 3 25c6 10-2 22-14 21c-2 10-16 15-23 8c-8 7-21 3-23-8c-12 1-20-11-14-21c-10-7-8-21 3-25c-1-10 8-18 17-15c3-12 12-16 5-4z" fill="${p.dark}"/>
      <path d="M100 78c5-6 15-5 17 2c5-2 10 3 10 8c6 2 7 10 2 14c3 6-1 12-8 12c-1 6-9 8-13 4c-4 4-12 2-13-4c-7 0-11-6-8-12c-5-4-4-12 2-14c0-5 5-10 10-8c2-7 6-9 1-2z" fill="${p.base}" opacity="0.9"/>
    </g>
    <circle cx="100" cy="100" r="96" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.35"/>
  </svg>`;
}

function clusterSVG(p) {
  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="caramel popcorn">
    <circle cx="100" cy="100" r="96" fill="${p.base}"/>
    <g>
      <ellipse cx="70" cy="110" rx="30" ry="26" fill="${p.dark}"/>
      <ellipse cx="115" cy="90" rx="34" ry="30" fill="${p.mid}"/>
      <ellipse cx="130" cy="130" rx="28" ry="24" fill="${p.dark}"/>
      <ellipse cx="85" cy="140" rx="26" ry="22" fill="${p.mid}"/>
      <path d="M45 100c30-40 100-40 120 5c8 18-4 40-24 46c-30 9-70 4-90-15c-14-13-16-24-6-36z" fill="none" stroke="${p.accent}" stroke-width="3" opacity="0.4"/>
      <path d="M60 95c6-10 20-9 24 2M110 78c6-9 18-8 22 2M100 122c6-9 18-8 22 2" stroke="${p.base}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>
    </g>
    <circle cx="100" cy="100" r="96" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.35"/>
  </svg>`;
}

function bottleSVG(p, size) {
  const heights = { sm: 70, md: 85, lg: 100, xl: 112 };
  const h = heights[size] || 90;
  const top = 190 - h;
  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="bouteille de gaz">
    <circle cx="100" cy="100" r="96" fill="${p.base}"/>
    <rect x="88" y="${top-18}" width="24" height="14" rx="3" fill="${p.accent}"/>
    <path d="M75 ${top} q25-18 50 0 v${h-20} q0 20 -25 20 q-25 0 -25-20 z" fill="${p.mid}"/>
    <rect x="70" y="${top+h-24}" width="60" height="14" rx="4" fill="${p.dark}"/>
    <rect x="75" y="${top+10}" width="50" height="8" rx="3" fill="${p.base}" opacity="0.7"/>
    <path d="M70 ${top+30} h60" stroke="${p.accent}" stroke-width="2" opacity="0.3"/>
    <circle cx="100" cy="100" r="96" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.35"/>
  </svg>`;
}

function regulatorSVG(p) {
  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="détendeur de gaz">
    <circle cx="100" cy="100" r="96" fill="${p.base}"/>
    <circle cx="95" cy="95" r="38" fill="${p.mid}"/>
    <circle cx="95" cy="95" r="24" fill="${p.dark}"/>
    <circle cx="95" cy="95" r="10" fill="${p.accent}"/>
    <path d="M133 95 h35 v14 h-35z" fill="${p.dark}"/>
    <path d="M60 130 q-10 30 20 40" stroke="${p.accent}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="100" cy="100" r="96" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.35"/>
  </svg>`;
}

function truckSVG(p) {
  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="livraison">
    <circle cx="100" cy="100" r="96" fill="${p.base}"/>
    <rect x="35" y="90" width="80" height="45" rx="6" fill="${p.mid}"/>
    <path d="M115 100 h30 l20 20 v15 h-50z" fill="${p.dark}"/>
    <rect x="122" y="107" width="16" height="14" fill="${p.base}"/>
    <circle cx="65" cy="140" r="12" fill="${p.accent}"/>
    <circle cx="150" cy="140" r="12" fill="${p.accent}"/>
    <circle cx="65" cy="140" r="5" fill="${p.base}"/>
    <circle cx="150" cy="140" r="5" fill="${p.base}"/>
    <circle cx="100" cy="100" r="96" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.35"/>
  </svg>`;
}

function kettleSVG(p) {
  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="marmite popcorn">
    <circle cx="100" cy="100" r="96" fill="${p.base}"/>
    <path d="M55 110 q45-20 90 0 v10 q-45 20 -90 0z" fill="${p.dark}"/>
    <ellipse cx="100" cy="110" rx="45" ry="12" fill="${p.mid}"/>
    <rect x="93" y="70" width="14" height="30" rx="4" fill="${p.accent}"/>
    <circle cx="72" cy="80" r="8" fill="${p.mid}"/>
    <circle cx="95" cy="65" r="9" fill="${p.mid}"/>
    <circle cx="118" cy="78" r="7" fill="${p.mid}"/>
    <circle cx="100" cy="100" r="96" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.35"/>
  </svg>`;
}

function crateSVG(p) {
  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="vente en gros">
    <circle cx="100" cy="100" r="96" fill="${p.base}"/>
    <rect x="55" y="90" width="90" height="55" rx="4" fill="${p.mid}"/>
    <rect x="55" y="90" width="90" height="14" fill="${p.dark}"/>
    <path d="M55 90 l45-20 45 20" fill="none" stroke="${p.accent}" stroke-width="4"/>
    <path d="M70 104 v40 M100 104 v40 M130 104 v40" stroke="${p.accent}" stroke-width="3" opacity="0.5"/>
    <circle cx="100" cy="100" r="96" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.35"/>
  </svg>`;
}

function handshakeSVG(p) {
  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="partenariat">
    <circle cx="100" cy="100" r="96" fill="${p.base}"/>
    <path d="M40 95 l35-15 15 8 15-8 35 15-15 25-20-10-15 8-15-8-20 10z" fill="${p.mid}"/>
    <path d="M60 105 l20 20 20-20" fill="none" stroke="${p.accent}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="100" cy="100" r="96" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.35"/>
  </svg>`;
}

const SHAPE_BUILDERS = {
  kernel: kernelSVG,
  cluster: clusterSVG,
  bottle: bottleSVG,
  regulator: regulatorSVG,
  truck: truckSVG,
  kettle: kettleSVG,
  crate: crateSVG,
  handshake: handshakeSVG
};

function renderIconSVG(icon) {
  const palette = PALETTES[icon.palette] || PALETTES.cream;
  const builder = SHAPE_BUILDERS[icon.shape] || kernelSVG;
  return builder(palette, icon.size);
}
