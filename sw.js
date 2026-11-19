/* Service Worker: legt alle Dateien beim ersten Besuch im Cache, danach läuft Scriptoria auch ohne Internet. */
const VERSION = 'scriptoria-v13';
const FILES = ['./', 'index.html', 'style.css', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'lib/pdf.min.js', 'lib/pdf.worker.min.js', 'lib/jspdf.umd.min.js',
  'js/webapi.js', 'js/core.js', 'js/symbols.js', 'js/draw.js', 'js/tools.js', 'js/input.js', 'js/extras.js', 'icons/app/scroll.svg', 'icons/app/board.svg', 'icons/app/circuit.svg', 'icons/app/chalk.svg', 'icons/app/papyrus.svg', 'icons/app/wax.svg', 'icons/app/sand.svg', 'icons/app/clay.svg', 'icons/app/slate.svg', 'icons/app/parchment.svg', 'js/historic.js', 'js/pages.js', 'js/smart.js', 'js/sim.js', 'lib/mathjax/tex-svg-full.js', 'js/templates.js', 'js/calc.js', 'js/i18n.js', 'js/lang/dict.js', 'js/lang/help-en.js', 'js/lang/help-fr.js', 'js/lang/help-zh.js', 'js/lang/help-ru.js', 'js/lang/help-hi.js', 'js/lang/help-la.js', 'js/dialogs.js', 'js/ui.js', 'js/app.js', 'js/pwa.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Cache zuerst (schnell/offline), im Hintergrund aktualisieren
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r && r.ok && new URL(e.request.url).origin === location.origin) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
