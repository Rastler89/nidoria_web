/*
 * Service worker de Nidoria.
 *
 * Estrategias:
 *  - Navegaciones: red primero, con copia en caché y fallback a `/offline`.
 *  - `/_next/static/` e iconos: caché primero (son inmutables por build).
 *  - Imágenes, fuentes, estilos y scripts propios: stale-while-revalidate.
 *  - `/api/` y peticiones de otro origen: sin interceptar (siempre red).
 *
 * Al cambiar el comportamiento del worker, subir CACHE_VERSION para invalidar
 * las cachés antiguas en los navegadores que ya lo tengan instalado.
 *
 * Las escrituras en caché se esperan dentro de la misma promesa que se pasa a
 * `respondWith` y `waitUntil`: WebKit (iOS) mata el worker en cuanto termina el
 * evento, así que un `cache.put` suelto se pierde y la app queda sin offline.
 */
const CACHE_VERSION = "nidoria-v3";
const PRECACHE = `${CACHE_VERSION}-precache`;
const PAGES = `${CACHE_VERSION}-pages`;
const ASSETS = `${CACHE_VERSION}-assets`;
const OFFLINE_URL = "/offline";

// Límites para que las cachés no crezcan sin freno entre despliegues.
const MAX_PAGES = 30;
const MAX_ASSETS = 150;

const PRECACHE_URLS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
];

const ASSET_DESTINATIONS = new Set(["image", "font", "style", "script"]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // Un recurso que falle no debe impedir la instalación del worker.
      await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(new Request(url, { cache: "reload" }));
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch {
            // Sin conexión en la instalación: se reintentará en el próximo fetch.
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PRECACHE, PAGES, ASSETS]);
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => !keep.has(name)).map((name) => caches.delete(name)),
      );
      await trimCache(PAGES, MAX_PAGES);
      await trimCache(ASSETS, MAX_ASSETS);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname === "/sw.js") return;

  if (request.mode === "navigate") {
    handleNavigation(event);
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/")
  ) {
    cacheFirst(event);
    return;
  }

  if (ASSET_DESTINATIONS.has(request.destination)) {
    staleWhileRevalidate(event);
  }
});

/**
 * Deja las `max` entradas más recientes de una caché. `cache.keys()` respeta el
 * orden de inserción, así que se eliminan las más antiguas.
 */
async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length <= max) return;

  const excess = keys.slice(0, keys.length - max);
  await Promise.all(excess.map((request) => cache.delete(request)));
}

/**
 * Navegación: red primero para no servir HTML viejo; si falla, la última copia
 * de esa URL y, en último término, la página offline precargada.
 */
function handleNavigation(event) {
  const { request } = event;

  const work = (async () => {
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        const cache = await caches.open(PAGES);
        // Se espera el `put` antes de devolver la respuesta: si se deja suelto,
        // WebKit puede cerrar el worker y no guardar nunca la copia offline.
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await caches.match(request, { ignoreSearch: true });
      if (cached) return cached;

      const offline = await caches.match(OFFLINE_URL);
      if (offline) return offline;

      return new Response("Sin conexión", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  })();

  event.respondWith(work);
  event.waitUntil(work.catch(() => undefined));
}

function cacheFirst(event) {
  const { request } = event;

  const work = (async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        const cache = await caches.open(ASSETS);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return new Response("", { status: 504, statusText: "Sin conexión" });
    }
  })();

  event.respondWith(work);
  event.waitUntil(work.catch(() => undefined));
}

function staleWhileRevalidate(event) {
  const { request } = event;

  // Las promesas se crean de forma síncrona para poder pasárselas a
  // `waitUntil` y que la actualización en segundo plano no se pierda en iOS.
  const cacheReady = caches.open(ASSETS);
  const network = cacheReady
    .then((cache) =>
      fetch(request).then(async (response) => {
        if (response.ok && response.type === "basic") {
          await cache.put(request, response.clone());
        }
        return response;
      }),
    )
    .catch(() => undefined);

  const work = (async () => {
    const cache = await cacheReady;
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await network;
    if (response) return response;

    return new Response("", { status: 504, statusText: "Sin conexión" });
  })();

  event.respondWith(work);
  event.waitUntil(Promise.allSettled([work, network]));
}
