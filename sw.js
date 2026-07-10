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
  "./style.css",
  "./data.js",
  "./icons.js",
  "./app.js",
  "./admin.js",
  "./manifest.json",
  "./catalog-data.json",
  "./site-settings.json",
  "./logo-master.png",
  "./logo-alt.png",
  "./icon-48.png",
  "./icon-72.png",
  "./icon-96.png",
  "./icon-128.png",
  "./icon-144.png",
  "./icon-152.png",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-256.png",
  "./icon-384.png",
  "./icon-512.png"
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
