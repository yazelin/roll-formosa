/* Roll Formosa service worker — offline-playable PWA + fast repeat loads.
 * Vite ships hashed /assets/* filenames, so we don't hard-list them: instead
 * - app shell (./, html, manifest, icons) is precached on install,
 * - hashed /assets/* + other same-origin files are cached cache-first on first
 *   fetch (immutable per hash → instant + offline after first visit),
 * - HTML navigations are network-first (fresh on deploy, cached as offline fallback).
 * Bump CACHE to force-refresh everything on a new release.
 */
const CACHE = 'rollformosa-v1';
const SHELL = [
  './', 'index.html', 'preview.html', 'manifest.webmanifest',
  'assets/icon-192.png', 'assets/icon-512.png', 'assets/icon-512-maskable.png', 'assets/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(SHELL.map((u) => c.add(u))); // best-effort; one miss won't fail install
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // let cross-origin (Google Fonts etc.) pass through

  // HTML navigations → network-first (fresh deploy wins; cache is offline fallback).
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        const c = await caches.open(CACHE); c.put(req, res.clone());
        return res;
      } catch {
        return (await caches.match(req)) || (await caches.match('index.html')) || Response.error();
      }
    })());
    return;
  }

  // Everything else same-origin (hashed JS/CSS, webp, audio, json) → cache-first.
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.ok) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
      return res;
    } catch {
      return cached || Response.error();
    }
  })());
});
