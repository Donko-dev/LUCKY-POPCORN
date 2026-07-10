/* Lucky Popcorn — Service Worker
   Met en cache tous les fichiers du site pour un fonctionnement 100% hors-ligne.
   Stratégie "réseau d'abord" pour le HTML/CSS/JS : dès que l'appareil est en ligne,
   la dernière version publiée sur GitHub est toujours utilisée. Le cache ne sert
   de secours que lorsque l'appareil est hors-ligne. */

const CACHE_NAME = "lucky-popcorn-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./admin.html",
  "./css/style.css",
  "./js/data.js",
  "./js/icons.js",
  "./js/app.js",
  "./js/admin.js",
  "./manifest.json",
  "./assets/logo-master.png",
  "./assets/logo-alt.png",
  "./assets/icons/icon-48.png",
  "./assets/icons/icon-72.png",
  "./assets/icons/icon-96.png",
  "./assets/icons/icon-128.png",
  "./assets/icons/icon-144.png",
  "./assets/icons/icon-152.png",
  "./assets/icons/icon-180.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-256.png",
  "./assets/icons/icon-384.png",
  "./assets/icons/icon-512.png"
];

const NETWORK_FIRST_EXTENSIONS = [".html", ".js", ".css", ".json"];

function isNetworkFirst(url) {
  return NETWORK_FIRST_EXTENSIONS.some((ext) => url.pathname.endsWith(ext)) || url.pathname.endsWith("/");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const networkFirst = event.request.method === "GET" && url.origin === self.location.origin && isNetworkFirst(url);

  if (networkFirst) {
    // Réseau d'abord : garantit que toute mise à jour publiée est vue immédiatement quand l'appareil est en ligne.
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      }).catch(() => caches.match(event.request))
    );
  } else {
    // Cache d'abord pour les images/icônes (rarement modifiées) : rapide et fonctionne hors-ligne.
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
          return response;
        }).catch(() => cached);
      })
    );
  }
});
