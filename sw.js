// Notenliste – Service Worker: App offline verfügbar, Updates sofort beim nächsten Start.
// Beim Veröffentlichen einer neuen Version VERSION erhöhen (gleiche Zahl wie APP_VERSION in index.html).
const VERSION = 'notenliste-v19';
const DATEIEN = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  // Die App selbst (index.html): zuerst aus dem Netz, damit eine neue Version sofort beim Start gilt.
  // Ohne Netz (oder wenn es länger als 4 s dauert) die gespeicherte Version.
  if (req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      const netz = fetch(url.href, { cache: 'no-cache', credentials: 'same-origin' }).then(r => {
        if (r && r.ok) { c.put('./index.html', r.clone()); }
        return r;
      });
      e.waitUntil(netz.catch(() => {}));
      try {
        const r = await Promise.race([netz, new Promise((_, rej) => setTimeout(() => rej(new Error('Zeit')), 4000))]);
        if (r && r.ok) return r;
      } catch (err) {}
      return (await c.match('./index.html')) || (await c.match(req, { ignoreSearch: true })) || fetch(req);
    })());
    return;
  }
  // Übrige Dateien (Symbole, Manifest): aus dem Speicher, im Hintergrund auffrischen
  e.respondWith(caches.open(VERSION).then(async c => {
    const treffer = await c.match(req, { ignoreSearch: true });
    const netz = fetch(req).then(r => { if (r && r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
    return treffer || (await netz) || (await c.match('./index.html'));
  }));
});
