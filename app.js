/* =========================================================================
   LUCKY POPCORN — Application logique (offline, sans base de données)
   ========================================================================= */

let state = {
  lang: localStorage.getItem("luckyLang") || "fr",
  theme: localStorage.getItem("luckyTheme") || "light",
  currency: localStorage.getItem("luckyCurrency") || "FCFA",
  filter: "all",
  query: ""
};

let catalog = null;
let siteTextOverrides = {};
let securitySettings = { copyProtection: false };
let modalGalleryIndex = 0;
let modalGalleryImages = [];

function t(key) {
  const dict = I18N[state.lang];
  return dict[key] !== undefined ? dict[key] : key;
}

/* ---------------- Textes personnalisés (depuis l'espace producteur) ---------------- */

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = state.theme === "light" ? "🌙" : "☀️";
}

function applyLang() {
  document.documentElement.setAttribute("lang", state.lang);
  const overrides = siteTextOverrides;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const ov = overrides[state.lang] && overrides[state.lang][key];
    el.textContent = ov && ov.text !== undefined && ov.text !== "" ? ov.text : t(key);
    if (ov) {
      el.style.fontWeight = ov.bold ? "700" : "";
      el.style.fontStyle = ov.italic ? "italic" : "";
      el.style.textDecoration = ov.underline ? "underline" : "";
      if (ov.color) el.style.color = ov.color;
      if (ov.size) el.style.fontSize = ov.size + "px";
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  const langBtn = document.getElementById("langToggle");
  if (langBtn) langBtn.textContent = t("langSwitch");
  document.title = `${t("brand")} — ${t("tagline")}`;
}

function formatPrice(fcfa) {
  const converted = fcfa * FX[state.currency];
  const symbol = CURRENCY_SYMBOLS[state.currency];
  if (state.currency === "FCFA") return `${Math.round(converted).toLocaleString("fr-FR")} ${symbol}`;
  return `${converted.toFixed(2)} ${symbol}`;
}

function waLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/* ---------------- Media (photos ou illustration SVG) ---------------- */

function itemMediaHTML(item) {
  if (item.images && item.images.length) {
    return `<img src="${item.images[0]}" alt="${item.name[state.lang]}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`;
  }
  return renderIconSVG(item.icon || { shape: "kernel", palette: "cream" });
}

/* ---------------- Prix (avec gestion promo) ---------------- */

function priceBlockHTML(item, kind) {
  if (kind === "product") {
    const reg = item.priceFCFA.small;
    const promo = item.promoFCFA && item.promoFCFA.small;
    if (promo && promo < reg) {
      return `<span style="text-decoration:line-through; opacity:0.6;">${formatPrice(reg)}</span> <span class="price-main">${formatPrice(promo)}</span> <span>${t("from")} · ${t("priceUnit")}</span>`;
    }
    return `<span class="price-main">${formatPrice(reg)}</span> <span>${t("from")} · ${t("priceUnit")}</span>`;
  }
  if (kind === "service" || kind === "custom") {
    const reg = item.priceFCFA?.unit;
    if (reg === undefined) return "";
    const promo = item.promoFCFA && item.promoFCFA.unit;
    if (promo && promo < reg) {
      return `<span style="text-decoration:line-through; opacity:0.6;">${formatPrice(reg)}</span> <span class="price-main">${formatPrice(promo)}</span> <span>/ ${t("gasUnit")}</span>`;
    }
    return `<span class="price-main">${formatPrice(reg)}</span> <span>/ ${t("gasUnit")}</span>`;
  }
  return "";
}

/* ---------------- Card rendering ---------------- */

function productCardHTML(item, kind) {
  const name = item.name[state.lang];
  const short = item.short[state.lang];
  const priceLabel = priceBlockHTML(item, kind);
  const media = itemMediaHTML(item);
  const promoTag = item.promoFCFA ? `<span class="tag-pill" style="position:absolute; top:10px; left:10px; background:var(--burgundy); color:#fff; border:none;">${t("promoLabel")}</span>` : "";
  return `
  <div class="card" data-id="${item.id}" data-kind="${kind}">
    <div class="card-media" style="position:relative;">${promoTag}${media}</div>
    <div class="card-body">
      <h3>${name}</h3>
      <p class="desc">${short}</p>
      ${priceLabel ? `<div class="price-row">${priceLabel}</div>` : ""}
      <div class="card-actions">
        <button class="btn btn-outline btn-sm" onclick="openDetails('${kind}','${item.id}')">${t("viewDetails")}</button>
        <a class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener" href="${orderLink(item, kind)}">💬 ${t("orderWhatsappShort")}</a>
      </div>
    </div>
  </div>`;
}

function orderLink(item, kind) {
  const name = item.name[state.lang];
  let msg;
  if (kind === "product") msg = t("orderMsgPopcorn")(name);
  else if (kind === "service") msg = t("orderMsgGas")(name);
  else if (kind === "activity") msg = t("orderMsgActivity")(name);
  else msg = t("orderMsgCustom")(name);
  return waLink(WHATSAPP_ORDER_NUMBER, msg);
}

function matchesFilter(item, group) {
  if ((item.placement || "catalogue") === "autres") return false; // ces éléments n'apparaissent que dans "Autres activités & secteurs"
  if (state.filter === "all") return true;
  if (state.filter === "autres") return false;
  if (state.filter === "products" && ["socle", "sucre", "caramel"].includes(group)) return true;
  if (state.filter === "services" && group === "gaz") return true;
  if (state.filter === "activities" && group === "activite") return true;
  return state.filter === group;
}

function matchesQuery(item) {
  if (!state.query) return true;
  const q = state.query.toLowerCase();
  return item.name.fr.toLowerCase().includes(q) || item.name.en.toLowerCase().includes(q) ||
         item.short.fr.toLowerCase().includes(q) || item.short.en.toLowerCase().includes(q);
}

function renderAll() {
  renderGroup("socle", "socleGrid", "product");
  renderGroup("sucre", "sucreGrid", "product");
  renderGroup("caramel", "caramelGrid", "product");
  renderGroup("gaz", "gazGrid", "service");
  renderActivities();
  renderAutres();
}

function renderGroup(group, containerId, kind) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = (kind === "product" ? catalog.products : catalog.services)
    .filter(i => i.group === group)
    .filter(i => matchesFilter(i, group))
    .filter(matchesQuery);
  container.innerHTML = items.length ? items.map(i => productCardHTML(i, kind)).join("") :
    `<p class="empty-state">${t("noResults")}</p>`;
  const section = container.closest(".section");
  if (section) section.style.display = items.length === 0 && (state.query || state.filter !== "all") ? "none" : "";
}

function renderActivities() {
  const container = document.getElementById("activitiesGrid");
  if (!container) return;
  const items = catalog.activities.filter(i => matchesFilter(i, "activite")).filter(matchesQuery);
  container.innerHTML = items.map(item => `
    <div class="activity-card">
      <div class="icon-wrap">${itemMediaHTML(item)}</div>
      <div>
        <h3>${item.name[state.lang]}</h3>
        <p>${item.short[state.lang]}</p>
        <a class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener" href="${orderLink(item,'activity')}">💬 ${t("orderWhatsappShort")}</a>
      </div>
    </div>`).join("");
  const section = container.closest(".section");
  if (section) section.style.display = items.length === 0 && (state.query || (state.filter !== "all" && state.filter !== "activities")) ? "none" : "";
}

function renderAutres() {
  const container = document.getElementById("autresGrid");
  if (!container) return;
  const items = [
    ...(catalog.custom || []).map(i => ({ ...i, kind: "custom" })),
    ...catalog.products.filter(i => i.placement === "autres").map(i => ({ ...i, kind: "product" })),
    ...catalog.services.filter(i => i.placement === "autres").map(i => ({ ...i, kind: "service" })),
    ...catalog.activities.filter(i => i.placement === "autres").map(i => ({ ...i, kind: "activity" }))
  ].filter(matchesQuery);

  if (state.filter !== "all" && state.filter !== "autres") {
    container.innerHTML = "";
    const section = container.closest(".section");
    if (section) section.style.display = "none";
    return;
  }

  const bySector = {};
  items.forEach(i => {
    const sector = i.sector || i.group || "Divers";
    if (!bySector[sector]) bySector[sector] = [];
    bySector[sector].push(i);
  });

  let html = "";
  Object.keys(bySector).forEach(sector => {
    html += `<h3 style="margin:20px 0 12px; font-size:1.1rem;">${sector}</h3><div class="grid">`;
    html += bySector[sector].map(i => productCardHTML(i, i.kind)).join("");
    html += `</div>`;
  });

  container.innerHTML = html || `<p class="empty-state">${t("noResults")}</p>`;
  const section = container.closest(".section");
  if (section) section.style.display = items.length === 0 && state.query ? "none" : "";
}

/* ---------------- Modal ---------------- */

function findItem(kind, id) {
  const list = kind === "product" ? catalog.products : kind === "service" ? catalog.services : kind === "activity" ? catalog.activities : catalog.custom;
  return (list || []).find(i => i.id === id);
}

function openDetails(kind, id) {
  const item = findItem(kind, id);
  if (!item) return;

  modalGalleryImages = (item.images && item.images.length) ? item.images : [];
  modalGalleryIndex = 0;
  renderModalMedia(item);

  document.getElementById("modalTitle").textContent = item.name[state.lang];
  document.getElementById("modalDetails").textContent = item.details[state.lang];
  document.getElementById("modalQuality").textContent = t("quality");

  const pricesWrap = document.getElementById("modalPrices");
  pricesWrap.innerHTML = "";
  if (kind === "product" && item.priceFCFA) {
    ["small", "medium", "large"].forEach(sz => {
      if (item.priceFCFA[sz] !== undefined) {
        const label = { small: "S", medium: "M", large: "L" }[sz];
        const promo = item.promoFCFA && item.promoFCFA[sz];
        if (promo && promo < item.priceFCFA[sz]) {
          pricesWrap.innerHTML += `<span class="chip">${label} — <span style="text-decoration:line-through;opacity:0.6;">${formatPrice(item.priceFCFA[sz])}</span> <b>${formatPrice(promo)}</b></span>`;
        } else {
          pricesWrap.innerHTML += `<span class="chip">${label} — ${formatPrice(item.priceFCFA[sz])}</span>`;
        }
      }
    });
  } else if (item.priceFCFA && item.priceFCFA.unit !== undefined) {
    const promo = item.promoFCFA && item.promoFCFA.unit;
    if (promo && promo < item.priceFCFA.unit) {
      pricesWrap.innerHTML = `<span class="chip"><span style="text-decoration:line-through;opacity:0.6;">${formatPrice(item.priceFCFA.unit)}</span> <b>${formatPrice(promo)}</b> / ${t("gasUnit")}</span>`;
    } else {
      pricesWrap.innerHTML = `<span class="chip">${formatPrice(item.priceFCFA.unit)} / ${t("gasUnit")}</span>`;
    }
  }

  const extraLinks = document.getElementById("modalExtraLinks");
  extraLinks.innerHTML = "";
  if (item.link) extraLinks.innerHTML += `<a class="btn btn-outline btn-sm" target="_blank" rel="noopener" href="${item.link}">🔗 ${t("viewLink")}</a>`;
  if (item.video) extraLinks.innerHTML += `<a class="btn btn-outline btn-sm" target="_blank" rel="noopener" href="${item.video}">🎬 ${t("watchVideo")}</a>`;

  document.getElementById("modalOrderLink").href = orderLink(item, kind);
  document.getElementById("modalOverlay").classList.add("open");
}

function renderModalMedia(item) {
  const mediaEl = document.getElementById("modalMedia");
  if (modalGalleryImages.length) {
    mediaEl.innerHTML = `
      <div style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
        <img src="${modalGalleryImages[modalGalleryIndex]}" style="max-width:100%; max-height:100%; border-radius:12px; object-fit:cover;">
        ${modalGalleryImages.length > 1 ? `
          <button onclick="modalGalleryNav(-1)" style="position:absolute; left:6px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.4); color:#fff; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer;">‹</button>
          <button onclick="modalGalleryNav(1)" style="position:absolute; right:6px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.4); color:#fff; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer;">›</button>
          <div style="position:absolute; bottom:8px; left:0; right:0; display:flex; justify-content:center; gap:6px;">
            ${modalGalleryImages.map((_, i) => `<span style="width:7px;height:7px;border-radius:50%;background:${i === modalGalleryIndex ? 'var(--burgundy)' : 'rgba(0,0,0,0.25)'};"></span>`).join("")}
          </div>` : ""}
      </div>`;
  } else {
    mediaEl.innerHTML = renderIconSVG(item.icon || { shape: "kernel", palette: "cream" });
  }
}

function modalGalleryNav(dir) {
  if (!modalGalleryImages.length) return;
  modalGalleryIndex = (modalGalleryIndex + dir + modalGalleryImages.length) % modalGalleryImages.length;
  const mediaEl = document.getElementById("modalMedia");
  const img = mediaEl.querySelector("img");
  if (img) img.src = modalGalleryImages[modalGalleryIndex];
  const dots = mediaEl.querySelectorAll("div > span");
  dots.forEach((d, i) => d.style.background = i === modalGalleryIndex ? "var(--burgundy)" : "rgba(0,0,0,0.25)");
}

function closeDetails() {
  document.getElementById("modalOverlay").classList.remove("open");
}

/* ---------------- Filters & search ---------------- */

function setFilter(f) {
  state.filter = f;
  document.querySelectorAll(".nav-btn[data-filter]").forEach(b => b.classList.toggle("active", b.dataset.filter === f));
  renderAll();
}

function onSearch(e) {
  state.query = e.target.value.trim();
  renderAll();
}

/* ---------------- Theme / language / currency ---------------- */

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  localStorage.setItem("luckyTheme", state.theme);
  applyTheme();
}

function toggleLang() {
  state.lang = state.lang === "fr" ? "en" : "fr";
  localStorage.setItem("luckyLang", state.lang);
  applyLang();
  renderAll();
}

function setCurrency(cur) {
  state.currency = cur;
  localStorage.setItem("luckyCurrency", cur);
  document.querySelectorAll(".currency-btn").forEach(b => b.classList.toggle("active", b.dataset.cur === cur));
  renderAll();
}

/* ---------------- Mobile drawer ---------------- */

function toggleDrawer(open) {
  document.getElementById("mobileDrawer").classList.toggle("open", open);
}

/* ---------------- Partner FAB ---------------- */

function togglePartnerPanel() {
  document.getElementById("partnerPanel").classList.toggle("open");
}

/* ---------------- PWA install ---------------- */

let deferredPrompt = null;

function isRunningStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function updateInstallVisibility() {
  const standalone = isRunningStandalone();
  document.querySelectorAll(".js-install-only").forEach(el => {
    el.style.display = standalone ? "none" : "";
  });
  if (standalone) {
    const banner = document.getElementById("installBanner");
    if (banner) banner.classList.remove("show");
  }
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (!isRunningStandalone()) {
    const banner = document.getElementById("installBanner");
    if (banner) banner.classList.add("show");
  }
});

function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.finally(() => {
    deferredPrompt = null;
    const banner = document.getElementById("installBanner");
    if (banner) banner.classList.remove("show");
  });
}

window.addEventListener("appinstalled", () => {
  updateInstallVisibility();
});

/* ---------------- Protection anti-copie (dissuasive, pas infaillible) ---------------- */

function applyCopyProtection() {
  if (securitySettings.copyProtection) {
    document.body.classList.add("no-select");
    document.addEventListener("contextmenu", preventDefaultHandler);
    document.addEventListener("copy", preventDefaultHandler);
    document.addEventListener("selectstart", preventDefaultHandler);
  } else {
    document.body.classList.remove("no-select");
    document.removeEventListener("contextmenu", preventDefaultHandler);
    document.removeEventListener("copy", preventDefaultHandler);
    document.removeEventListener("selectstart", preventDefaultHandler);
  }
}
function preventDefaultHandler(e) { e.preventDefault(); }

/* ---------------- Init ---------------- */

document.addEventListener("DOMContentLoaded", async () => {
  catalog = await resolveCatalog();
  const settings = await resolveSiteSettings();
  siteTextOverrides = settings.texts || {};
  securitySettings = settings.security || { copyProtection: false };

  applyTheme();
  applyLang();
  renderAll();
  updateInstallVisibility();
  applyCopyProtection();

  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("langToggle")?.addEventListener("click", toggleLang);
  document.getElementById("menuToggle")?.addEventListener("click", () => toggleDrawer(true));
  document.getElementById("drawerClose")?.addEventListener("click", () => toggleDrawer(false));
  document.getElementById("mobileDrawer")?.addEventListener("click", (e) => { if (e.target.id === "mobileDrawer") toggleDrawer(false); });
  document.getElementById("modalOverlay")?.addEventListener("click", (e) => { if (e.target.id === "modalOverlay") closeDetails(); });
  document.getElementById("modalCloseBtn")?.addEventListener("click", closeDetails);
  document.getElementById("searchInput")?.addEventListener("input", onSearch);
  document.getElementById("partnerFabBtn")?.addEventListener("click", togglePartnerPanel);
  document.getElementById("installBtn")?.addEventListener("click", installApp);
  document.getElementById("installBannerBtn")?.addEventListener("click", installApp);

  document.querySelectorAll(".nav-btn[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => { setFilter(btn.dataset.filter); toggleDrawer(false); });
  });
  document.querySelectorAll(".currency-btn").forEach(btn => {
    btn.addEventListener("click", () => setCurrency(btn.dataset.cur));
    btn.classList.toggle("active", btn.dataset.cur === state.currency);
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }
});
