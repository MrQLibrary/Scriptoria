"use strict";
/* ===== Web-App: Service Worker (Offline), Installieren, .owb per Doppelklick öffnen ===== */
(function () {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { });
  // Installieren (Edge/Chrome): eigener Knopf auf dem Startbildschirm
  let deferred = null; const btn = document.getElementById('h-install');
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; if (btn) btn.hidden = false; });
  if (btn) btn.onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; btn.hidden = true; };
  addEventListener('appinstalled', () => { if (btn) btn.hidden = true; toast('Scriptoria wurde installiert.'); });
  // Doppelklick auf eine .owb-Datei, wenn die App installiert ist (Chromium)
  if ('launchQueue' in window) launchQueue.setConsumer(async p => {
    for (const h of p.files || []) { try { const f = await h.getFile(); importProjectText(await f.text(), null); } catch (e) { toast('Datei konnte nicht geöffnet werden.'); } }
  });
  if (api.volatile) toast('Achtung: Dein Browser erlaubt kein dauerhaftes Speichern (privates Fenster?). Speichere wichtige Boards mit Strg+S als Datei.', 9000);
})();
