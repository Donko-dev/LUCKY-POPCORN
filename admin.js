/* =========================================================================
   LUCKY POPCORN — Espace producteur : centre de contrôle (CRUD local, sans serveur)
   ========================================================================= */

let catalog = loadCatalog();
let editing = null;        // { kind, id } | null
let currentImages = [];    // base64 data URLs, max 4, for the item form

/* ---------------- Accès ---------------- */

function unlock() {
  const input = document.getElementById("pinInput").value.trim();
  if (input === getAdminPin()) {
    document.getElementById("lockCard").style.display = "none";
    document.getElementById("adminContent").style.display = "block";
    renderItemsList();
    renderSiteTextEditor();
    loadSecurityUI();
  } else {
    alert("Code incorrect.");
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem("luckyTheme", next);
}

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ---------------- Formulaire produit / service / activité / autre ---------------- */

function handleKindChange() {
  const kind = document.getElementById("f_kind").value;
  const groupSelect = document.getElementById("f_group");
  const groupWrap = document.getElementById("groupFieldWrap");
  const sectorWrap = document.getElementById("sectorFieldWrap");
  const placementWrap = document.getElementById("placementFieldWrap");

  const groupOptions = {
    product: ["socle", "sucre", "caramel"],
    service: ["gaz"],
    activity: ["activite"]
  };

  if (kind === "custom") {
    groupWrap.style.display = "none";
    sectorWrap.style.display = "block";
    placementWrap.style.display = "none"; // les "autres" sont toujours placées dans "Autres activités & secteurs"
  } else {
    groupWrap.style.display = "block";
    sectorWrap.style.display = "none";
    placementWrap.style.display = "block";
    Array.from(groupSelect.options).forEach(opt => {
      opt.hidden = !groupOptions[kind].includes(opt.value);
    });
    groupSelect.value = groupOptions[kind][0];
  }

  document.getElementById("priceFieldsProduct").style.display = kind === "product" ? "grid" : "none";
  document.getElementById("priceFieldService").style.display = (kind === "service" || kind === "custom") ? "block" : "none";
}

/* ---- Images (max 4, converties en base64, aucun serveur nécessaire) ---- */

function renderImagePreviews() {
  const wrap = document.getElementById("imagePreviews");
  wrap.innerHTML = currentImages.map((src, idx) => `
    <div style="position:relative; width:70px; height:70px;">
      <img src="${src}" style="width:70px;height:70px;object-fit:cover;border-radius:10px;border:1px solid var(--border);">
      <button type="button" onclick="removeImage(${idx})" style="position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;background:#C0392B;color:#fff;border:none;cursor:pointer;font-size:12px;">✕</button>
    </div>`).join("");
  document.getElementById("imageCountLabel").textContent = `${currentImages.length}/4 image(s)`;
}

function removeImage(idx) {
  currentImages.splice(idx, 1);
  renderImagePreviews();
}

function handleImageUpload(files) {
  const remaining = 4 - currentImages.length;
  if (remaining <= 0) { alert("Maximum 4 images par produit."); return; }
  const toRead = Array.from(files).slice(0, remaining);
  toRead.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      currentImages.push(reader.result);
      renderImagePreviews();
    };
    reader.readAsDataURL(file);
  });
}

/* ---- Ajout / modification ---- */

function resetForm() {
  document.getElementById("itemForm").reset();
  currentImages = [];
  renderImagePreviews();
  editing = null;
  document.getElementById("formSubmitBtn").textContent = "✅ Ajouter au catalogue";
  document.getElementById("cancelEditBtn").style.display = "none";
  handleKindChange();
}

function startEdit(kind, id) {
  const listKey = kind === "product" ? "products" : kind === "service" ? "services" : kind === "activity" ? "activities" : "custom";
  const item = catalog[listKey].find(i => i.id === id);
  if (!item) return;

  editing = { kind, id };
  document.getElementById("f_kind").value = kind;
  handleKindChange();

  if (kind === "custom") {
    document.getElementById("f_sector").value = item.sector || "";
  } else {
    document.getElementById("f_group").value = item.group || "";
    document.getElementById("f_placement").value = item.placement || "catalogue";
  }

  document.getElementById("f_name_fr").value = item.name?.fr || "";
  document.getElementById("f_name_en").value = item.name?.en || "";
  document.getElementById("f_short_fr").value = item.short?.fr || "";
  document.getElementById("f_short_en").value = item.short?.en || "";
  document.getElementById("f_details_fr").value = item.details?.fr || "";
  document.getElementById("f_details_en").value = item.details?.en || "";
  document.getElementById("f_icon_shape").value = item.icon?.shape || "kernel";
  document.getElementById("f_icon_palette").value = item.icon?.palette || "cream";
  document.getElementById("f_link").value = item.link || "";
  document.getElementById("f_video").value = item.video || "";

  if (kind === "product") {
    document.getElementById("f_price_small").value = item.priceFCFA?.small ?? 0;
    document.getElementById("f_price_medium").value = item.priceFCFA?.medium ?? 0;
    document.getElementById("f_price_large").value = item.priceFCFA?.large ?? 0;
    document.getElementById("f_promo_small").value = item.promoFCFA?.small ?? "";
    document.getElementById("f_promo_medium").value = item.promoFCFA?.medium ?? "";
    document.getElementById("f_promo_large").value = item.promoFCFA?.large ?? "";
  } else if (kind === "service" || kind === "custom") {
    document.getElementById("f_price_unit").value = item.priceFCFA?.unit ?? 0;
    document.getElementById("f_promo_unit").value = item.promoFCFA?.unit ?? "";
  }

  currentImages = Array.isArray(item.images) ? [...item.images] : [];
  renderImagePreviews();

  document.getElementById("formSubmitBtn").textContent = "💾 Enregistrer les modifications";
  document.getElementById("cancelEditBtn").style.display = "inline-flex";
  document.getElementById("itemForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelEdit() {
  resetForm();
}

function onSubmitItem(e) {
  e.preventDefault();
  const kind = document.getElementById("f_kind").value;
  const nameFr = document.getElementById("f_name_fr").value.trim();
  const nameEn = document.getElementById("f_name_en").value.trim() || nameFr;
  if (!nameFr) { alert("Le nom en français est obligatoire."); return; }

  const listKey = kind === "product" ? "products" : kind === "service" ? "services" : kind === "activity" ? "activities" : "custom";

  const item = {
    id: (editing && editing.kind === kind) ? editing.id : (slugify(nameFr) + "-" + Date.now().toString(36).slice(-4)),
    icon: {
      shape: document.getElementById("f_icon_shape").value,
      palette: document.getElementById("f_icon_palette").value
    },
    name: { fr: nameFr, en: nameEn },
    short: {
      fr: document.getElementById("f_short_fr").value.trim(),
      en: document.getElementById("f_short_en").value.trim() || document.getElementById("f_short_fr").value.trim()
    },
    details: {
      fr: document.getElementById("f_details_fr").value.trim(),
      en: document.getElementById("f_details_en").value.trim() || document.getElementById("f_details_fr").value.trim()
    },
    link: document.getElementById("f_link").value.trim(),
    video: document.getElementById("f_video").value.trim(),
    images: [...currentImages]
  };

  if (kind === "custom") {
    item.sector = document.getElementById("f_sector").value.trim() || "Divers";
    item.group = "autre";
    item.placement = "autres";
    const unit = Number(document.getElementById("f_price_unit").value) || 0;
    const promoUnit = document.getElementById("f_promo_unit").value;
    item.priceFCFA = { unit };
    if (promoUnit !== "" && Number(promoUnit) > 0 && Number(promoUnit) < unit) item.promoFCFA = { unit: Number(promoUnit) };
  } else {
    item.group = document.getElementById("f_group").value;
    item.placement = document.getElementById("f_placement").value;

    if (kind === "product") {
      const small = Number(document.getElementById("f_price_small").value) || 0;
      const medium = Number(document.getElementById("f_price_medium").value) || 0;
      const large = Number(document.getElementById("f_price_large").value) || 0;
      item.priceFCFA = { small, medium, large };
      const promo = {};
      const ps = document.getElementById("f_promo_small").value;
      const pm = document.getElementById("f_promo_medium").value;
      const pl = document.getElementById("f_promo_large").value;
      if (ps !== "" && Number(ps) > 0 && Number(ps) < small) promo.small = Number(ps);
      if (pm !== "" && Number(pm) > 0 && Number(pm) < medium) promo.medium = Number(pm);
      if (pl !== "" && Number(pl) > 0 && Number(pl) < large) promo.large = Number(pl);
      if (Object.keys(promo).length) item.promoFCFA = promo;
    } else if (kind === "service") {
      const unit = Number(document.getElementById("f_price_unit").value) || 0;
      item.priceFCFA = { unit };
      const promoUnit = document.getElementById("f_promo_unit").value;
      if (promoUnit !== "" && Number(promoUnit) > 0 && Number(promoUnit) < unit) item.promoFCFA = { unit: Number(promoUnit) };
    }
  }

  if (editing && editing.kind === kind) {
    const idx = catalog[listKey].findIndex(i => i.id === editing.id);
    if (idx !== -1) catalog[listKey][idx] = item;
    else catalog[listKey].push(item);
  } else if (editing && editing.kind !== kind) {
    // le type a changé pendant l'édition : on retire l'ancien puis on ajoute le nouveau
    const oldListKey = editing.kind === "product" ? "products" : editing.kind === "service" ? "services" : editing.kind === "activity" ? "activities" : "custom";
    catalog[oldListKey] = catalog[oldListKey].filter(i => i.id !== editing.id);
    catalog[listKey].push(item);
  } else {
    catalog[listKey].push(item);
  }

  saveCatalog(catalog);
  renderItemsList();
  const wasEditing = !!editing;
  resetForm();
  alert(wasEditing ? "Modifications enregistrées ! Retournez sur le site pour les voir." : "Ajouté au catalogue ! Retournez sur le site pour le voir apparaître.");
}

/* ---------------- Liste du catalogue ---------------- */

function renderItemsList() {
  const wrap = document.getElementById("itemsList");
  const all = [
    ...catalog.products.map(i => ({ ...i, kind: "product" })),
    ...catalog.services.map(i => ({ ...i, kind: "service" })),
    ...catalog.activities.map(i => ({ ...i, kind: "activity" })),
    ...(catalog.custom || []).map(i => ({ ...i, kind: "custom" }))
  ];
  wrap.innerHTML = all.map(i => `
    <div class="admin-list-item">
      <span>${i.name.fr}
        <span class="tag-pill">${i.kind}</span>
        <span class="tag-pill">${i.sector || i.group}</span>
        ${i.placement === "autres" ? '<span class="tag-pill">Autres activités & secteurs</span>' : ''}
        ${i.images && i.images.length ? `<span class="tag-pill">📷 ${i.images.length}</span>` : ''}
        ${i.promoFCFA ? '<span class="tag-pill">🏷️ Promo</span>' : ''}
      </span>
      <span style="display:flex; gap:6px;">
        <button class="btn btn-outline btn-sm" onclick="startEdit('${i.kind}','${i.id}')">✏️ Modifier</button>
        <button class="btn btn-outline btn-sm danger" onclick="deleteItem('${i.kind}','${i.id}')">🗑️ Supprimer</button>
      </span>
    </div>`).join("") || `<p class="empty-state">Aucun élément pour le moment.</p>`;
}

function deleteItem(kind, id) {
  if (!confirm("Supprimer cet élément du catalogue ?")) return;
  const listKey = kind === "product" ? "products" : kind === "service" ? "services" : kind === "activity" ? "activities" : "custom";
  catalog[listKey] = catalog[listKey].filter(i => i.id !== id);
  saveCatalog(catalog);
  renderItemsList();
  if (editing && editing.kind === kind && editing.id === id) resetForm();
}

/* ---------------- Export / Import / Reset ---------------- */

function exportCatalog() {
  const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "catalog-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function exportSiteSettings() {
  const payload = {
    texts: loadSiteTexts(),
    security: loadSecuritySettings()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "site-settings.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function loadPublishedIntoDraft() {
  if (!confirm("Charger la version actuellement publiée en ligne dans votre brouillon local ? Vos modifications locales non publiées seront remplacées.")) return;
  const publishedCatalog = await fetchPublishedJSON("./catalog-data.json");
  if (publishedCatalog && publishedCatalog.products) {
    if (!publishedCatalog.custom) publishedCatalog.custom = [];
    catalog = publishedCatalog;
    saveCatalog(catalog);
    renderItemsList();
  }
  const publishedSettings = await fetchPublishedJSON("./site-settings.json");
  if (publishedSettings) {
    if (publishedSettings.texts) saveSiteTexts(publishedSettings.texts);
    if (publishedSettings.security) saveSecuritySettings(publishedSettings.security);
    renderSiteTextEditor();
    loadSecurityUI();
  }
  alert("Version publiée chargée dans votre brouillon local.");
}

function importCatalog(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.products || !parsed.services || !parsed.activities) throw new Error("Format invalide");
      if (!parsed.custom) parsed.custom = [];
      catalog = parsed;
      saveCatalog(catalog);
      renderItemsList();
      alert("Catalogue importé avec succès.");
    } catch (err) {
      alert("Fichier invalide : " + err.message);
    }
  };
  reader.readAsText(file);
}

function resetCatalog() {
  if (!confirm("Réinitialiser tout le catalogue au contenu par défaut ? Cette action est irréversible.")) return;
  localStorage.removeItem("luckyPopcornCatalog");
  catalog = loadCatalog();
  renderItemsList();
}

/* ---------------- Éditeur de textes du site ---------------- */

function renderSiteTextEditor() {
  const wrap = document.getElementById("siteTextEditor");
  const overrides = loadSiteTexts();
  let html = "";
  EDITABLE_TEXT_KEYS.forEach(key => {
    ["fr", "en"].forEach(lang => {
      const ov = (overrides[lang] && overrides[lang][key]) || {};
      const defaultValue = I18N[lang][key] || "";
      const val = ov.text !== undefined ? ov.text : defaultValue;
      html += `
      <div class="admin-card" style="padding:16px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <strong style="font-size:0.82rem;">${key} <span class="tag-pill">${lang.toUpperCase()}</span></strong>
        </div>
        <div class="field">
          <textarea data-textkey="${key}" data-lang="${lang}" class="site-text-input" style="min-height:50px; font-weight:${ov.bold ? '700' : '400'}; font-style:${ov.italic ? 'italic' : 'normal'}; text-decoration:${ov.underline ? 'underline' : 'none'}; color:${ov.color || 'inherit'}; font-size:${ov.size ? ov.size + 'px' : 'inherit'};">${val}</textarea>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <button type="button" class="btn btn-outline btn-sm toggle-fmt" data-fmt="bold" data-textkey="${key}" data-lang="${lang}">B</button>
          <button type="button" class="btn btn-outline btn-sm toggle-fmt" data-fmt="italic" data-textkey="${key}" data-lang="${lang}"><i>I</i></button>
          <button type="button" class="btn btn-outline btn-sm toggle-fmt" data-fmt="underline" data-textkey="${key}" data-lang="${lang}"><u>U</u></button>
          <input type="color" class="fmt-color" data-textkey="${key}" data-lang="${lang}" value="${ov.color || '#2B1810'}" style="width:36px;height:36px;border:none;border-radius:8px;">
          <input type="number" class="fmt-size" data-textkey="${key}" data-lang="${lang}" value="${ov.size || ''}" placeholder="taille px" style="width:90px; padding:8px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text);">
        </div>
      </div>`;
    });
  });
  wrap.innerHTML = html;

  wrap.querySelectorAll(".toggle-fmt").forEach(btn => {
    btn.addEventListener("click", () => saveOneSiteText(btn.dataset.textkey, btn.dataset.lang, btn.dataset.fmt));
  });
  wrap.querySelectorAll(".fmt-color, .fmt-size, .site-text-input").forEach(el => {
    el.addEventListener("change", () => saveOneSiteText(el.dataset.textkey, el.dataset.lang, null));
  });
}

function saveOneSiteText(key, lang, toggleFmt) {
  const overrides = loadSiteTexts();
  if (!overrides[lang]) overrides[lang] = {};
  const current = overrides[lang][key] || {};
  const textEl = document.querySelector(`.site-text-input[data-textkey="${key}"][data-lang="${lang}"]`);
  const colorEl = document.querySelector(`.fmt-color[data-textkey="${key}"][data-lang="${lang}"]`);
  const sizeEl = document.querySelector(`.fmt-size[data-textkey="${key}"][data-lang="${lang}"]`);

  const updated = {
    text: textEl.value,
    bold: current.bold || false,
    italic: current.italic || false,
    underline: current.underline || false,
    color: colorEl.value,
    size: sizeEl.value ? Number(sizeEl.value) : null
  };
  if (toggleFmt) updated[toggleFmt] = !current[toggleFmt];

  overrides[lang][key] = updated;
  saveSiteTexts(overrides);
  renderSiteTextEditor();
}

function resetSiteTexts() {
  if (!confirm("Réinitialiser tous les textes du site à leur valeur par défaut ?")) return;
  localStorage.removeItem("luckySiteTexts");
  renderSiteTextEditor();
}

/* ---------------- Sécurité (protection anti-copie) ---------------- */

function loadSecurityUI() {
  const settings = loadSecuritySettings();
  document.getElementById("copyProtectionToggle").checked = !!settings.copyProtection;
}

function onSecurityToggle(e) {
  const settings = loadSecuritySettings();
  settings.copyProtection = e.target.checked;
  saveSecuritySettings(settings);
}

/* ---------------- Mot de passe producteur ---------------- */

function onChangePin(e) {
  e.preventDefault();
  const current = document.getElementById("pin_current").value.trim();
  const next = document.getElementById("pin_new").value.trim();
  const confirmPin = document.getElementById("pin_confirm").value.trim();

  if (current !== getAdminPin()) { alert("Le code actuel est incorrect."); return; }
  if (next.length < 4) { alert("Le nouveau code doit contenir au moins 4 caractères."); return; }
  if (next !== confirmPin) { alert("La confirmation ne correspond pas au nouveau code."); return; }

  setAdminPin(next);
  document.getElementById("pinChangeForm").reset();
  alert("Code producteur mis à jour avec succès.");
}

/* ---------------- Initialisation ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("luckyTheme")) {
    document.documentElement.setAttribute("data-theme", localStorage.getItem("luckyTheme"));
  }
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("unlockBtn").addEventListener("click", unlock);
  document.getElementById("pinInput").addEventListener("keydown", (e) => { if (e.key === "Enter") unlock(); });

  document.getElementById("f_kind").addEventListener("change", handleKindChange);
  document.getElementById("itemForm").addEventListener("submit", onSubmitItem);
  document.getElementById("cancelEditBtn").addEventListener("click", cancelEdit);

  document.getElementById("f_images").addEventListener("change", (e) => handleImageUpload(e.target.files));

  document.getElementById("exportBtn").addEventListener("click", exportCatalog);
  document.getElementById("exportSettingsBtn").addEventListener("click", exportSiteSettings);
  document.getElementById("loadPublishedBtn").addEventListener("click", loadPublishedIntoDraft);
  document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile").addEventListener("change", (e) => { if (e.target.files[0]) importCatalog(e.target.files[0]); });
  document.getElementById("resetBtn").addEventListener("click", resetCatalog);

  document.getElementById("resetTextsBtn").addEventListener("click", resetSiteTexts);
  document.getElementById("copyProtectionToggle").addEventListener("change", onSecurityToggle);
  document.getElementById("pinChangeForm").addEventListener("submit", onChangePin);

  handleKindChange();
  renderImagePreviews();
});
