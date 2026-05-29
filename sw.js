/*
 * Service worker for Angle Measure.
 *
 * Strategy: stale-while-revalidate. Requests are served from cache instantly
 * (fast, works offline) while a fresh copy is fetched in the background and
 * stored for next time. Updates therefore apply on the next load — never more
 * than one reload stale. Bump CACHE_VERSION when shipping a release you want
 * to guarantee picks up immediately.
 */
const CACHE_VERSION = 'angle-measure-v3';
const PRECACHE = ['./', './index.html', './geometry.js', './favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            // Cache successful basic + font (opaque/cors) responses.
            if (res && (res.ok || res.type === 'opaque')) {
              cache.put(req, res.clone()).catch(() => {});
            }
            return res;
          })
          .catch(() => cached); // offline: fall back to cache
        return cached || network;
      })
    )
  );
});
