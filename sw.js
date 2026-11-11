// Notenliste – Service Worker: App offline verfügbar, Updates im Hintergrund.
// Beim Veröffentlichen einer neuen Version VERSION erhöhen.
const VERSION = 'notenliste-v5';
const DATEIEN = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Erst aus dem Speicher (sofort, auch offline), parallel neue Version holen
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async c => {
    const treffer = await c.match(e.request, { ignoreSearch: true });
    const netz = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => null);
    return treffer || (await netz) || (await c.match('./index.html'));
  }));
});
