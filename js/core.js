"use strict";
/* ===== Kern: Zustand, Hilfsfunktionen, Geometrie, Verlauf ===== */
const $ = (s, r = document) => r.querySelector(s);
const FONT = '"Segoe UI",system-ui,sans-serif';
const GRID = 10;                       // Rastergröße in Board-Einheiten
const BOX = new Set(['rect', 'ellipse', 'note', 'text', 'image', 'symbol', 'graph']);
const isBox = o => o && BOX.has(o.type);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;

function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
}

/* ---------- Zustand ---------- */
const DEFAULT_PENS = () => [
  { kind: 'pencil',      name: 'Bleistift',       color: '@ink',    width: 3,  ls: 'solid' },
  { kind: 'ballpoint',   name: 'Kugelschreiber',  color: '#1d4ed8', width: 3,  ls: 'solid' },
  { kind: 'fountain',    name: 'Füllfederhalter', color: '#0b2a6f', width: 5,  ls: 'solid' },
  { kind: 'marker',      name: 'Edding',          color: '#dc2626', width: 8,  ls: 'solid' },
  { kind: 'highlighter', name: 'Textmarker gelb', color: '#fde047', width: 22, ls: 'solid' },
  { kind: 'highlighter', name: 'Textmarker grün', color: '#86efac', width: 22, ls: 'solid' },
  { kind: 'highlighter', name: 'Textmarker rosa', color: '#f9a8d4', width: 22, ls: 'solid' }
];

const S = {
  screen: 'home',
  project: null,                 // {id,name,created,modified,filePath}
  objs: [], sels: [], imgs: {},
  view: { x: 0, y: 0, z: 1 },
  hist: [], fut: [],
  tool: 'pen', penIdx: 1,
  pens: DEFAULT_PENS(),
  style: { color: '@ink', width: 3, ls: 'solid', fill: false, fillColor: null, size: 26, font: 'Segoe UI', bold: false, italic: false, noteSize: 200, noteText: 18 },
  eraser: { size: 14, mode: 'pixel' },
  compass: { angle: 40, leg: 10, cx: null, cy: null, rot: 0, tipA: 0 },
  ruler: { on: false, x: 160, y: 420, a: 0, len: 30 },   // Bildschirmkoordinaten, Länge in cm
  geo: { on: false, x: 600, y: 260, a: 0, len: 16 },     // Geodreieck, ebenfalls Bildschirmkoordinaten
  wire: null, wireHover: null,
  armed: null, armedRot: 0,      // gewähltes Symbol (Elektronik)
  laser: { pts: [], active: false, color: '#ff2d2d' },
  editing: null,
  settings: { theme: 'system', electronics: true, grid: true, snap: false, gridSize: 10, pxPerCm: 96 / 2.54, historic: false, histPure: false, hints: true, pressure: true, shapes: true, pdfMode: 'ask', pdfCols: 1,
    tools: { ruler: true, geo: true, compass: true, parab: true, laser: true, plot: false, phasor: false, diagram: false, timer: false }, gridType: 'dots', gridWeight: 'mittel', appIcon: 'board' },
  bg: null, tplIdx: 0, tablet: 0, eraserSkin: null,
  ui: { hidePanels: false, propsCollapsed: false },
  dirty: false, lastThumb: 0
};
const curPen = () => {                     // bei historischen Vorlagen: deren Schreibgeräte
  const t = window.curTpl && curTpl();
  if (!t) return S.pens[S.penIdx];
  const p = t.pens[S.tplIdx || 0]; return p && !p.erase ? p : t.pens.find(x => !x.erase);
};

function themeDark() {
  const t = S.settings.theme;
  return t === 'dark' || (t === 'system' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
}

/* ---------- Verlauf ---------- */
const snapshot = () => JSON.stringify(S.objs);
function record(pre) {
  if (snapshot() !== pre) {
    S.hist.push(pre); S.histSize = (S.histSize || 0) + pre.length;
    while (S.hist.length > 80 || (S.histSize > 60e6 && S.hist.length > 5)) S.histSize -= S.hist.shift().length;   // Speicher begrenzen
    S.fut = []; markDirty(); if (window.presentDirty) presentDirty(); if (window.simDirty) simDirty();
  }
  if (window.syncHist) syncHist();
  if (window.render) render();
}
function undo() {
  if (!S.hist.length) return;
  S.fut.push(snapshot()); const h0 = S.hist.pop(); S.histSize = Math.max(0, (S.histSize || 0) - h0.length); S.objs = JSON.parse(h0); S.sels = []; markDirty(); if (window.presentDirty) presentDirty(); if (window.simDirty) simDirty(); render(); if (window.refreshUI) refreshUI();
}
function redo() {
  if (!S.fut.length) return;
  const cur = snapshot(); S.hist.push(cur); S.histSize = (S.histSize || 0) + cur.length; S.objs = JSON.parse(S.fut.pop()); S.sels = []; markDirty(); if (window.presentDirty) presentDirty(); if (window.simDirty) simDirty(); render(); if (window.refreshUI) refreshUI();
}
function markDirty() { S.dirty = true; if (window.scheduleSave) scheduleSave(); }

/* ---------- Geometrie ---------- */
const gridStep = () => S.settings.gridSize || GRID;
const snapV = v => S.settings.snap ? Math.round(v / gridStep()) * gridStep() : v;
function rotPt(x, y, a) { const c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c]; }
const center = o => [o.x + o.w / 2, o.y + o.h / 2];
function toLocal(o, px, py) {                // Weltpunkt -> lokale Koordinaten (Mitte = 0,0, unrotiert)
  const [cx, cy] = center(o);
  return rotPt(px - cx, py - cy, -(o.rot || 0));
}
function fromLocal(o, lx, ly) {
  const [cx, cy] = center(o); const [x, y] = rotPt(lx, ly, o.rot || 0);
  return [cx + x, cy + y];
}
function corners(o) {
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => fromLocal(o, sx * o.w / 2, sy * o.h / 2));
}
function arcPoints(o, n = 32) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = o.a0 + o.sweep * i / n; out.push([o.cx + o.r * Math.cos(a), o.cy + o.r * Math.sin(a)]); }
  return out;
}
function objBounds(o) {
  let pts;
  if (isBox(o)) pts = corners(o);
  else if (o.type === 'pen') { pts = o.pts; }
  else if (o.type === 'line' || o.type === 'arrow') pts = [[o.x1, o.y1], [o.x2, o.y2]];
  else if (o.type === 'arc') pts = arcPoints(o);
  else pts = [[0, 0]];
  let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
  for (const [x, y] of pts) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); }
  const r = (o.w && !isBox(o) ? o.w : (o.sw || 0)) / 2 + 1;
  return [a - r, b - r, c + r, d + r];
}
function allBounds(list) {
  let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
  for (const o of list) { const r = objBounds(o); a = Math.min(a, r[0]); b = Math.min(b, r[1]); c = Math.max(c, r[2]); d = Math.max(d, r[3]); }
  return list.length ? [a, b, c, d] : null;
}
function moveObj(o, dx, dy) {
  if (o.type === 'pen') o.pts.forEach(q => { q[0] += dx; q[1] += dy; });
  else if (o.type === 'line' || o.type === 'arrow') { o.x1 += dx; o.x2 += dx; o.y1 += dy; o.y2 += dy; }
  else if (o.type === 'arc') { o.cx += dx; o.cy += dy; }
  else { o.x += dx; o.y += dy; }
}
function distSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1, l = dx * dx + dy * dy;
  let t = l ? ((px - x1) * dx + (py - y1) * dy) / l : 0; t = clamp(t, 0, 1);
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/* ---------- Koordinaten ---------- */
function toWorld(e) { const r = $('#board').getBoundingClientRect(); return { x: (e.clientX - r.left - S.view.x) / S.view.z, y: (e.clientY - r.top - S.view.y) / S.view.z }; }
function toScreen(x, y) { return [x * S.view.z + S.view.x, y * S.view.z + S.view.y]; }

/* ---------- Bilder ---------- */
/* Speicherschonend: nur die zuletzt gebrauchten Bilder in voller Auflösung (LRU), dazu von jedem Bild eine kleine
   Vorschau, die beim Herauszoomen genügt. So bleiben auch PDFs mit vielen Seiten flüssig und stabil. */
const imgCache = new Map(), imgSmall = new Map(), MAX_FULL = 12, SMALL_W = 420;
function getImg(id) {
  let im = imgCache.get(id);
  if (im) { imgCache.delete(id); imgCache.set(id, im); return im; }        // als zuletzt benutzt markieren
  im = new Image(); im.decoding = 'async';
  im.onload = () => {
    im._ok = true;
    if (!imgSmall.has(id)) { try { const k = Math.min(1, SMALL_W / im.naturalWidth), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(im.naturalWidth * k)); c.height = Math.max(1, Math.round(im.naturalHeight * k)); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); imgSmall.set(id, c); } catch (e) { } }
    if (im._res) im._res(); render();
  };
  im.onerror = () => { if (im._res) im._res(); };
  im.src = S.imgs[id] || ''; imgCache.set(id, im);
  while (imgCache.size > MAX_FULL) { const [k, old] = imgCache.entries().next().value; imgCache.delete(k); old.onload = null; old.src = ''; if (old._res) old._res(); }   // ältestes freigeben
  return im;
}
function clearImgCache() { for (const im of imgCache.values()) { im.onload = null; im.src = ''; } imgCache.clear(); imgSmall.clear(); }
function loadImgsOf(list) {                                // für Export: alle Bilder einer Seite vollständig laden
  return Promise.all(list.filter(o => o.type === 'image').map(o => { const im = getImg(o.id); return im._ok ? null : new Promise(r => { im._res = r; setTimeout(r, 8000); }); }));
}
function usedImgs() { const r = {}; for (const o of (window.allObjs ? allObjs() : S.objs)) if (o.type === 'image' && S.imgs[o.id]) r[o.id] = S.imgs[o.id]; return r; }

/* ---------- Benachrichtigung ---------- */
let toastTimer = null;
function toast(msg, ms = 3500) {
  const t = $('#toast'); clearTimeout(toastTimer);
  if (!msg) { t.hidden = true; return; }
  t.textContent = msg; t.hidden = false; toastTimer = setTimeout(() => t.hidden = true, ms);
}

/* ---------- Ersatz-API für den Browser (nur zum Testen/Entwickeln) ---------- */
if (!window.api) {
  const ls = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d; } catch (e) { return d; } };
  const put = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  window.api = {
    isDesktop: false,
    listProjects: async () => ls('ob-index', []).map(m => ({ ...m, thumb: localStorage.getItem('ob-th-' + m.id) })),
    loadProject: async id => ls('ob-p-' + id, null),
    saveProject: async (meta, json, thumb) => {
      localStorage.setItem('ob-p-' + meta.id, json); if (thumb) localStorage.setItem('ob-th-' + meta.id, thumb);
      const idx = ls('ob-index', []).filter(m => m.id !== meta.id); idx.push({ ...meta }); put('ob-index', idx); return true;
    },
    deleteProject: async id => { localStorage.removeItem('ob-p-' + id); localStorage.removeItem('ob-th-' + id); put('ob-index', ls('ob-index', []).filter(m => m.id !== id)); return true; },
    getSettings: async () => ls('ob-settings', {}), setSettings: async s => { put('ob-settings', s); return true; },
    systemDark: async () => window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches,
    openDialog: async () => [], saveDialog: async () => null, readFile: async () => '', writeFile: async () => false, reveal: async () => false,
    listUser: async kind => ls('ob-user-' + kind, []), saveUser: async (kind, name, data) => { const l = ls('ob-user-' + kind, []); l.push({ file: name + '.json', data }); put('ob-user-' + kind, l); return name + '.json'; },
    openUserFolder: async () => false, onOpenFile: () => {}
  };
}

/* ---------- Unerwartete Fehler: nicht stillschweigend abstürzen, sondern melden und sichern ---------- */
let lastErrToast = 0;
function onAppError(err) {
  console.error(err);
  try { if (window.flushSave && S.screen === 'editor') { S.dirty = true; flushSave(); } } catch (e) { }
  if (Date.now() - lastErrToast > 10000) { lastErrToast = Date.now(); toast('Ein interner Fehler ist aufgetreten. Ihr Board wurde vorsorglich gespeichert.', 6000); }
}
addEventListener('error', e => { if (e.error) onAppError(e.error); });
addEventListener('unhandledrejection', e => onAppError(e.reason));

/* Kurze Hilfetexte – in den Einstellungen ganz abschaltbar */
function hint(text) { return S.settings.hints === false ? null : h('p', { class: 'muted hint' }, text); }
function hintToast(text, ms) { if (S.settings.hints !== false) toast(text, ms); }
