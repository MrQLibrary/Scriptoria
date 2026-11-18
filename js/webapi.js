"use strict";
/* ===== Speicher für die Web-App: IndexedDB (fasst auch große Bilder/PDFs), Fallback: Arbeitsspeicher ===== */
(function () {
  const STORES = ['projects', 'kv', 'user', 'imgs'];       // imgs: Bilder/PDF-Seiten getrennt vom Board, Schlüssel "<Board-ID>/<Bild-ID>"
  const mem = { projects: new Map(), kv: new Map(), user: new Map(), imgs: new Map() };
  let dbp = null, volatile = false;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(resolve => {
      try {
        const rq = indexedDB.open('openboard', 2);              // interner Name bleibt, damit vorhandene Boards erhalten bleiben
        rq.onupgradeneeded = () => { const d = rq.result; STORES.forEach(n => { if (!d.objectStoreNames.contains(n)) d.createObjectStore(n); }); };
        rq.onsuccess = () => resolve(rq.result);
        rq.onerror = rq.onblocked = () => { volatile = true; resolve(null); };
      } catch (e) { volatile = true; resolve(null); }
    });
    return dbp;
  }
  const wrap = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  async function get(store, key) { const d = await db(); if (!d) return mem[store].get(key); return wrap(d.transaction(store).objectStore(store).get(key)); }
  async function put(store, key, val) {
    const d = await db(); if (!d) { mem[store].set(key, val); return; }
    return new Promise((res, rej) => { const t = d.transaction(store, 'readwrite'); t.objectStore(store).put(val, key); t.oncomplete = res; t.onerror = t.onabort = () => rej(t.error || new Error('Speichern fehlgeschlagen (Speicher voll?)')); });
  }
  async function del(store, key) {
    const d = await db(); if (!d) { mem[store].delete(key); return; }
    return new Promise((res, rej) => { const t = d.transaction(store, 'readwrite'); t.objectStore(store).delete(key); t.oncomplete = res; t.onerror = () => rej(t.error); });
  }
  async function all(store, prefix) {
    const d = await db();
    if (!d) return [...mem[store].entries()].filter(([k]) => !prefix || k.startsWith(prefix));
    return new Promise((res, rej) => {
      const range = prefix ? IDBKeyRange.bound(prefix, prefix + '￿') : undefined;
      const out = [], rq = d.transaction(store).objectStore(store).openCursor(range);
      rq.onsuccess = () => { const c = rq.result; if (c) { out.push([c.key, c.value]); c.continue(); } else res(out); };
      rq.onerror = () => rej(rq.error);
    });
  }
  const pickFiles = (accept, multiple) => new Promise(res => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.multiple = !!multiple; i.style.display = 'none';
    i.onchange = () => { res([...i.files]); i.remove(); }; i.oncancel = () => { res([]); i.remove(); };
    document.body.append(i); i.click();
  });

  window.api = {
    isDesktop: false, isWeb: true,
    get volatile() { return volatile; },
    listProjects: async () => (await all('projects')).map(([id, r]) => ({ ...r.meta, thumb: r.thumb || null })),
    loadProject: async id => { const r = await get('projects', id); return r ? r.json : null; },
    saveProject: async (meta, json, thumb) => {
      const old = await get('projects', meta.id);
      await put('projects', meta.id, { meta: { ...meta }, json, thumb: thumb || (old && old.thumb) || null }); return true;
    },
    deleteProject: async id => { await del('projects', id); for (const [k] of await all('imgs', id + '/')) await del('imgs', k); return true; },
    // Bilder werden nur einmal gespeichert, nicht bei jeder kleinen Änderung erneut
    putImgs: async (pid, map) => {
      const ids = Object.keys(map); if (!ids.length) return;
      const d = await db(); if (!d) { ids.forEach(i => mem.imgs.set(pid + '/' + i, map[i])); return; }
      return new Promise((res, rej) => {
        const t = d.transaction('imgs', 'readwrite'), s = t.objectStore('imgs');
        ids.forEach(i => s.put(map[i], pid + '/' + i));
        t.oncomplete = res; t.onerror = t.onabort = () => rej(t.error || new Error('Speichern fehlgeschlagen (Speicher voll?)'));
      });
    },
    getImgs: async pid => Object.fromEntries((await all('imgs', pid + '/')).map(([k, v]) => [k.slice(pid.length + 1), v])),
    delImgs: async (pid, ids) => { for (const i of ids) await del('imgs', pid + '/' + i); },
    copyImgs: async (from, to) => { const m = Object.fromEntries((await all('imgs', from + '/')).map(([k, v]) => [k.slice(from.length + 1), v])); await window.api.putImgs(to, m); },
    getSettings: async () => (await get('kv', 'settings')) || {},
    setSettings: async s => { await put('kv', 'settings', s); return true; },
    systemDark: async () => window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches,
    openDialog: async () => [], saveDialog: async () => null, readFile: async () => '', writeFile: async () => false, reveal: async () => false,
    listUser: async kind => (await all('user')).filter(([k]) => k.startsWith(kind + '/')).map(([k, data]) => ({ file: k.slice(kind.length + 1), data })),
    saveUser: async (kind, name, data) => { const f = name.replace(/[\\/:*?"<>|]/g, '_') + '.json'; await put('user', kind + '/' + f, data); return f; },
    clearUser: async kind => { for (const [k] of await all('user')) if (k.startsWith(kind + '/')) await del('user', k); return true; },
    pickFiles, openUserFolder: async () => false, onOpenFile: () => {}
  };
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }   // Browser soll die Daten nicht von selbst löschen
})();
