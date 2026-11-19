"use strict";
/* ===== Anwendung: Start, Projekte, Speichern, Export ===== */
const FORMAT = 'openboard', FORMAT_VERSION = 3;
const EXT_FILTER = [{ name: 'Scriptoria-Whiteboard', extensions: ['owb'] }];

/* ---------- Einstellungen ---------- */
async function loadSettings() {
  const s = await api.getSettings() || {};
  const defTools = S.settings.tools; Object.assign(S.settings, s.settings || {}); S.settings.tools = { ...defTools, ...(S.settings.tools || {}) };
  if (Array.isArray(s.pens) && s.pens.length) S.pens = s.pens;
  if (Number.isInteger(s.penIdx)) S.penIdx = clamp(s.penIdx, 0, S.pens.length - 1);
  Object.assign(S.style, s.style || {}); Object.assign(S.eraser, s.eraser || {});
  if (s.laserColor) S.laser.color = s.laserColor;
  if (s.compass) { S.compass.angle = s.compass.angle || 40; S.compass.leg = s.compass.leg || 10; }
  if (s.ui) { S.ui.propsCollapsed = !!s.ui.propsCollapsed; S.ui.toolsCollapsed = !!s.ui.toolsCollapsed; }                 // ausgeblendete Leisten bewusst nicht merken
}
function saveSettings() {
  api.setSettings({ settings: S.settings, pens: S.pens, penIdx: S.penIdx, style: S.style, eraser: S.eraser, laserColor: S.laser.color, compass: { angle: S.compass.angle, leg: S.compass.leg }, ui: S.ui });
}
function applyTheme() { document.body.classList.toggle('dark', themeDark()); document.body.classList.toggle('light', !themeDark()); }
/* App-Symbol: Browser-Tab, Startbildschirm und – beim Installieren bzw. nächsten Start – die installierte App */
const APP_ICONS = [['board', 'Whiteboard'], ['circuit', 'Elektrotechnik'], ['scroll', 'Schriftrolle'], ['chalk', 'Kreidetafel'], ['papyrus', 'Papyrus'], ['wax', 'Wachstafel'],
  ['sand', 'Sandtafel'], ['clay', 'Tontafel'], ['slate', 'Schiefertafel'], ['parchment', 'Pergament']];
function applyAppIcon() {
  const id = APP_ICONS.some(([k]) => k === S.settings.appIcon) ? S.settings.appIcon : 'board';
  $('#favicon').href = `icons/app/${id}.svg`; $('#touchicon').href = `icons/app/${id}-192.png`;
  const m = id === 'board' ? 'manifest.webmanifest' : `manifests/${id}.webmanifest`; if (!$('#manifest').href.endsWith(m)) $('#manifest').href = m;
  const lg = $('#logo'); if (lg) lg.src = `icons/app/${id}.svg`;
}
function changeSetting(k, v) {
  S.settings[k] = v; saveSettings(); applyTheme(); if (k === 'appIcon') applyAppIcon();
  if (S.screen === 'editor') { refreshUI(); render(); } else renderHome();
}

/* ---------- Projekte ---------- */
const emptyView = () => ({ x: 0, y: 0, z: 1 });
// withImgs = true: für .owb-Dateien (alles in einer Datei). Im Browser-Speicher liegen die Bilder getrennt,
// damit beim automatischen Speichern nicht jedes Mal alle Bilder/PDF-Seiten neu geschrieben werden müssen.
function projectJSON(withImgs = true) {
  const p = S.project;
  return JSON.stringify({ format: FORMAT, version: FORMAT_VERSION, name: p.name, created: p.created, modified: p.modified, view: S.view, ruler: S.ruler, geo: S.geo, bg: S.bg || null, pages: pagesJSON(), page: S.page, imgs: withImgs ? usedImgs() : {} });
}
function loadIntoEditor(meta, data, storedImgs = {}) {
  if (window.SIM && SIM.on) stopSim();                        // Simulation gehört zum jeweiligen Board
  S.project = { id: meta.id, name: meta.name, created: meta.created, modified: meta.modified, filePath: meta.filePath || null };
  initPages(data); S.imgs = { ...(data.imgs || {}), ...storedImgs }; clearImgCache();
  S.savedImgs = new Set(Object.keys(storedImgs)); S.bg = data.bg || null;
  if (data.ruler) Object.assign(S.ruler, data.ruler); S.geo.on = false; if (data.geo) Object.assign(S.geo, data.geo); S.wire = null;
  S.hist = []; S.fut = []; S.histSize = 0; S.sels = []; S.draft = null; S.dirty = false; S.editing = null; $('#ed').hidden = true;
  for (const o of allObjs()) if (o.type === 'text' && !o.w) measureTextObj(o);
  if (window.presentDirty) presentDirty();
  showEditor();
}
function showEditor() {
  S.screen = 'editor'; $('#home').hidden = true; $('#editor').hidden = false; document.body.classList.add('in-editor');
  if (S.tool === 'place' && !S.armed) S.tool = 'pen';
  applyTheme(); resizeBoard(); setTool(S.tool === 'place' ? 'select' : S.tool); refreshUI(); render();
}
function newProject() {
  const now = Date.now();
  loadIntoEditor({ id: uid(), name: 'Unbenanntes Whiteboard', created: now, modified: now }, { objs: [] });
  S.dirty = true; doSave(true);
}
async function openProject(id) {
  const raw = await api.loadProject(id); const meta = (await api.listProjects()).find(m => m.id === id);
  if (!raw || !meta) { toast('Whiteboard konnte nicht geladen werden.'); return; }
  try {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw, imgs = api.getImgs ? await api.getImgs(id) : {};
    loadIntoEditor(meta, data, imgs);
    const all = allObjs(), stale = Object.keys(imgs).filter(k => !all.some(o => o.type === 'image' && o.id === k));   // gelöschte Bilder aufräumen
    if (stale.length && api.delImgs) { api.delImgs(id, stale); stale.forEach(k => { delete S.imgs[k]; S.savedImgs.delete(k); }); }
    if (data.imgs && Object.keys(data.imgs).length) { S.dirty = true; doSave(false); }                     // altes Format: Bilder einmalig auslagern
  } catch (e) { console.error(e); toast('Die Datei ist beschädigt.'); }
}
async function goHome() {
  if (S.editing) commitEdit(); if (SIM.on) stopSim();
  if (S.dirty) await doSave(true);
  S.screen = 'home'; $('#editor').hidden = true; $('#home').hidden = false; $('#elec').hidden = true; document.body.classList.remove('in-editor');
  applyTheme(); renderHome();
}
function renameProject(name) { name = (name || '').trim() || 'Unbenanntes Whiteboard'; if (S.project) { S.project.name = name; markDirty(); } }

/* Automatisches Speichern: kurz nach jeder Änderung, beim Verlassen der Seite und beim Wechsel in einen anderen Tab/ein anderes Fenster. */
let saveTimer = null, saveChain = Promise.resolve();
function scheduleSave() { clearTimeout(saveTimer); setSaveState('pending'); saveTimer = setTimeout(() => doSave(false), 800); }
function setSaveState(st) {
  S.saveState = st; const el = $('#savest'); if (!el) return;
  el.textContent = { pending: 'Änderungen …', saving: 'Speichert …', saved: '✓ Gespeichert', error: '⚠ Nicht gespeichert', volatile: '⚠ Nur vorübergehend' }[st] || '';
  el.className = 'savest ' + st;
  el.title = st === 'volatile' ? 'Der Browser erlaubt hier keinen dauerhaften Speicher (z. B. privates Fenster). Bitte mit Strg+S als Datei sichern.'
    : st === 'error' ? 'Speichern fehlgeschlagen. Bitte mit Strg+S als Datei sichern.' : 'Wird automatisch im Browser gespeichert. Mit Strg+S zusätzlich als Datei sichern.';
}
function doSave(withThumb) {
  saveChain = saveChain.then(() => saveNow(withThumb)).catch(() => { });   // nie zwei Speichervorgänge gleichzeitig
  return saveChain;
}
async function saveNow(withThumb) {
  if (!S.project || S.screen !== 'editor' && !withThumb) return;
  clearTimeout(saveTimer); if (!S.dirty && !withThumb) { setSaveState('saved'); return; }
  S.project.modified = Date.now(); S.dirty = false; setSaveState('saving');
  let thumb = null;
  try { thumb = withThumb || Date.now() - S.lastThumb > 15000 ? makeThumb() : null; if (thumb) S.lastThumb = Date.now(); } catch (e) { console.error(e); }
  try {
    const pid = S.project.id, fresh = {};
    for (const [k, v] of Object.entries(usedImgs())) if (!S.savedImgs.has(k)) fresh[k] = v;
    if (api.putImgs) { await api.putImgs(pid, fresh); Object.keys(fresh).forEach(k => S.savedImgs.add(k)); }
    await api.saveProject({ id: pid, name: S.project.name, created: S.project.created, modified: S.project.modified, filePath: S.project.filePath }, projectJSON(!api.putImgs), thumb);
    setSaveState(S.dirty ? 'pending' : api.volatile ? 'volatile' : 'saved');
  } catch (e) { console.error(e); S.dirty = true; setSaveState('error'); toast('Speichern fehlgeschlagen: ' + e.message + ' – bitte mit Strg+S als Datei sichern.', 7000); }
}
function flushSave() { if (S.editing) commitEdit(); if (S.dirty && S.screen === 'editor') doSave(true); }
async function listSorted() { return (await api.listProjects()).sort((a, b) => b.modified - a.modified); }

/* ---------- Dateien (.owb) ---------- */
function download(name, data, mime, base64) {
  const bin = base64 ? Uint8Array.from(atob(data), c => c.charCodeAt(0)) : data;
  const a = h('a', { href: URL.createObjectURL(new Blob([bin], { type: mime })), download: name }); document.body.append(a); a.click(); a.remove();
}
async function saveOut(defaultName, data, { base64 = false, filters, mime = 'application/octet-stream', path = null } = {}) {
  if (api.isDesktop) {
    const p = path || await api.saveDialog(defaultName, filters); if (!p) return null;
    await api.writeFile(p, data, base64); return p;
  }
  download(defaultName, data, mime, base64); return defaultName;
}
async function saveFile(saveAs) {
  if (S.editing) commitEdit();
  const p = S.project, name = p.name.replace(/[\\/:*?"<>|]/g, '_') + '.owb';
  const path = await saveOut(name, projectJSON(), { filters: EXT_FILTER, path: !saveAs && p.filePath || null, mime: 'application/json' });
  if (path) { if (api.isDesktop) p.filePath = path; markDirty(); toast('Gespeichert: ' + (api.isDesktop ? path : name), 4500); }
}
async function importProjectText(text, path) {
  let data; try { data = JSON.parse(text); } catch (e) { toast('Das ist keine gültige Whiteboard-Datei.'); return; }
  if (!data || !(Array.isArray(data.objs) || Array.isArray(data.pages))) { toast('Das ist keine gültige Whiteboard-Datei.'); return; }
  const now = Date.now(), name = data.name || (path ? path.split(/[\\/]/).pop().replace(/\.owb$/i, '') : 'Importiertes Whiteboard');
  loadIntoEditor({ id: uid(), name, created: data.created || now, modified: now, filePath: path || null }, data);
  S.dirty = true; await doSave(true);
}
async function openFileDialog() {
  if (api.isDesktop) { const [p] = await api.openDialog(EXT_FILTER.concat([{ name: 'Alle Dateien', extensions: ['*'] }]), false); if (p) importProjectText(await api.readFile(p), p); }
  else $('#f-owb').click();
}

/* ---------- Bilder, PDFs und .owb per Drag & Drop / Einfügen ---------- */
const readURL = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
const loadImage = src => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
function makeImgObj(src, nw, nh, x, y, maxW) {
  const id = uid(); S.imgs[id] = src; const w = Math.min(maxW, nw), hh = w * nh / nw;
  return { type: 'image', id, x, y, w, h: hh, rot: 0 };
}
async function openPdf(file) {
  if (typeof pdfjsLib === 'undefined') throw new Error('pdf.js fehlt');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
  toast('PDF wird geöffnet …', 60000);
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  if (pdf.numPages > 80 && !await confirmDlg('Großes PDF', `Das PDF hat ${pdf.numPages} Seiten. Wirklich alle einfügen?`, 'Alle einfügen')) { pdf.destroy(); return null; }
  return pdf;
}
async function renderPdfPages(pdf, each) {                // Seite für Seite: sofort sichtbar, wenig Speicher
  for (let i = 1; i <= pdf.numPages; i++) {
    toast(`PDF wird eingefügt … Seite ${i} von ${pdf.numPages}`, 60000);
    const page = await pdf.getPage(i), s = Math.min(3, 1600 / page.getViewport({ scale: 1 }).width), v = page.getViewport({ scale: s });
    const c = document.createElement('canvas'); c.width = Math.ceil(v.width); c.height = Math.ceil(v.height);
    const cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvasContext: cx, viewport: v }).promise;
    each({ src: c.toDataURL('image/jpeg', 0.88), w: c.width, h: c.height });
    page.cleanup(); c.width = c.height = 0;
  }
  pdf.destroy();
}
const IMG_RE = /\.(png|jpe?g|svg|gif|webp|bmp|avif)$/;
async function askPdfMode(name, pages) {
  if (S.settings.pdfMode && S.settings.pdfMode !== 'ask') return S.settings.pdfMode;
  const remember = h('input', { type: 'checkbox' });
  const v = await dialog({ title: 'PDF einfügen', body: [h('p', {}, `„${name}“ hat ${pages} Seite${pages > 1 ? 'n' : ''}. Wie sollen sie eingefügt werden?`),
    h('label', { class: 'chk' }, remember, ' Auswahl merken (änderbar in den Einstellungen)')],
    buttons: [{ label: 'Abbrechen', value: null }, { label: 'Untereinander auf dieser Seite', value: 'stack' }, { label: 'Jede PDF-Seite als eigene Seite', primary: true, value: 'pages' }] });
  if (v && remember.checked) changeSetting('pdfMode', v);
  return v;
}
function fitWidth(b) {                                   // Ansicht auf die Breite einer Seite einstellen (oberer Rand sichtbar)
  const w = b[2] - b[0], z = clamp(Math.min((innerWidth - 160) / w, 1.6), 0.15, 3);
  S.view = { z, x: innerWidth / 2 - (b[0] + w / 2) * z, y: 80 - b[1] * z }; markDirty(); render(); updateCursor();
}
async function addFiles(files, p) {
  if (S.editing) commitEdit();
  const pre = snapshot(); let n = 0, skipped = 0, pdfDone = false; const added = [];
  for (const f of files) {
    const name = f.name.toLowerCase();
    try {
      if (name.endsWith('.owb')) { await importProjectText(await f.text(), f.path || null); return; }
      if (f.type === 'application/pdf' || name.endsWith('.pdf')) {
        const pdf = await openPdf(f); if (!pdf) continue;
        const mode = await askPdfMode(f.name, pdf.numPages); if (!mode) { pdf.destroy(); continue; }
        const W = 800;
        if (mode === 'pages') {
          let first = true;
          await renderPdfPages(pdf, pg => {
            const o = makeImgObj(pg.src, pg.w, pg.h, 0, 0, W); o.lock = true;
            if (first && !S.objs.length) { S.objs.push(o); record(pre); } else { addPage([o]); }
            first = false; fitWidth(objBounds(o)); n++;
          });
        } else {
          const c = viewCenter(); let x = (p ? p.x : c.x) - W / 2, y = p ? p.y : (60 - S.view.y) / S.view.z; const start = added.length;
          await renderPdfPages(pdf, pg => { const o = makeImgObj(pg.src, pg.w, pg.h, x, y, W); o.lock = true; S.objs.push(o); added.push(o); y += o.h + 24; n++; render(); });
          if (added.length > start) fitWidth(objBounds(added[start]));
        }
        pdfDone = true;
      } else if (/^image\//.test(f.type) || IMG_RE.test(name)) {
        const src = await readURL(name.endsWith('.svg') ? f.slice(0, f.size, 'image/svg+xml') : f), im = await loadImage(src);
        const c = p || viewCenter(), maxW = Math.min(900, (innerWidth * 0.6) / S.view.z), nw = im.naturalWidth || 800, nh = im.naturalHeight || 600;
        const w = Math.min(maxW, nw), hh = w * nh / nw;
        const o = makeImgObj(src, nw, nh, c.x - w / 2 + added.length * 30, c.y - hh / 2 + added.length * 30, maxW); S.objs.push(o); added.push(o); n++;
      } else skipped++;
    } catch (err) { console.error(err); toast(`„${f.name}“ konnte nicht geladen werden.`, 5000); }
  }
  toast(null);
  if (skipped) toast('Unterstützt werden Bilder (PNG, JPG, SVG, GIF, WebP), PDF und .owb-Dateien.', 4500);
  if (pdfDone) { if (curTpl()) selectPen(S.tplIdx || 0); else setTool('pen'); hintToast('PDF eingefügt – die Seiten sind fixiert (Doppelklick zum Bearbeiten).', 3500); }
  else if (n) { setTool('select'); S.sels = added.slice(-1); }
  if (added.length) record(pre); refreshUI(); render();
}
/* ---------- Export ---------- */
function renderToCanvas(list, { maxDim = 4000, scale = 2, pad = 30 } = {}) {
  const b = allBounds(list); if (!b) return null;
  const w = Math.ceil(b[2] - b[0] + 2 * pad), hh = Math.ceil(b[3] - b[1] + 2 * pad), s = Math.min(scale, maxDim / Math.max(w, hh));
  const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.ceil(w * s)); cv.height = Math.max(1, Math.ceil(hh * s));
  const keep = { o: S.objs, e: S.editing }; S.objs = list; S.editing = null;
  try { drawScene(cv.getContext('2d'), s, { x: -b[0] + pad, y: -b[1] + pad, z: 1 }, { dark: false, grid: false, w: cv.width, h: cv.height, cull: false, exporting: true }); }
  finally { S.objs = keep.o; S.editing = keep.e; }
  return { cv, w, h: hh };
}
function makeThumb() {
  const r = renderToCanvas(S.objs, { maxDim: 1200, scale: 1, pad: 40 }); if (!r) return null;
  const t = document.createElement('canvas'); t.width = 320; t.height = 200; const c = t.getContext('2d');
  c.fillStyle = '#fff'; c.fillRect(0, 0, 320, 200); const k = Math.min(300 / r.cv.width, 180 / r.cv.height);
  c.drawImage(r.cv, (320 - r.cv.width * k) / 2, (200 - r.cv.height * k) / 2, r.cv.width * k, r.cv.height * k);
  return t.toDataURL('image/jpeg', 0.75);
}
async function exportPNG() {
  if (S.editing) commitEdit(); await loadImgsOf(S.objs.slice(0, MAX_FULL));
  const r = renderToCanvas(S.objs, { maxDim: 8000, scale: 2 }); if (!r) { toast('Das Whiteboard ist leer.'); return; }
  const out = await saveOut(S.project.name + '.png', r.cv.toDataURL('image/png').split(',')[1], { base64: true, filters: [{ name: 'PNG-Bild', extensions: ['png'] }], mime: 'image/png' });
  if (out) toast('PNG exportiert.');
}
async function exportPDFDialog() { if (S.editing) commitEdit(); const o = await openPdfExport(); if (o) exportPDF(o); }
async function exportPDF({ format, onlySel, allPages }) {
  const lists = onlySel && S.sels.length ? [S.sels] : allPages ? (syncPage(), S.pages.map(pg => pg.objs).filter(l => l.length)) : [S.objs];
  const { jsPDF } = window.jspdf, mm = 25.4 / 96; let doc = null;
  let pi = 0;
  for (const list of lists) {
    toast(`PDF wird erstellt … Seite ${++pi} von ${lists.length}`, 60000); await loadImgsOf(list);
    const r = renderToCanvas(list, { maxDim: 4200, scale: 2.5 }); if (!r) continue;
    const img = r.cv.toDataURL('image/jpeg', 0.93);
    if (format === 'fit') {
      const w = r.w * mm, hh = r.h * mm, o = w >= hh ? 'l' : 'p';
      if (!doc) doc = new jsPDF({ unit: 'mm', format: [w, hh], orientation: o }); else doc.addPage([w, hh], o);
      doc.addImage(img, 'JPEG', 0, 0, w, hh);
    } else {
      const land = format === 'a4l', pw = land ? 297 : 210, ph = land ? 210 : 297, m = 10, k = Math.min((pw - 2 * m) / r.cv.width, (ph - 2 * m) / r.cv.height);
      const w = r.cv.width * k, hh = r.cv.height * k;
      if (!doc) doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: land ? 'l' : 'p' }); else doc.addPage('a4', land ? 'l' : 'p');
      doc.addImage(img, 'JPEG', (pw - w) / 2, (ph - hh) / 2, w, hh);
    }
    r.cv.width = r.cv.height = 0;
  }
  toast(null);
  if (!doc) { toast('Das Whiteboard ist leer.'); return; }
  const b64 = doc.output('datauristring').split(',')[1];
  const out = await saveOut(S.project.name + '.pdf', b64, { base64: true, filters: [{ name: 'PDF-Dokument', extensions: ['pdf'] }], mime: 'application/pdf' });
  if (out) toast('PDF exportiert.');
}

/* ---------- Startbildschirm ---------- */
async function renderHome() {
  const grid = $('#h-grid'), list = await listSorted();
  $('#h-empty').hidden = list.length > 0; $('#h-title').hidden = list.length === 0;
  const fmt = t => new Date(t).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const cards = list.map(m => {
    const more = h('button', { class: 'more', title: 'Mehr', onclick: e => { e.stopPropagation(); popupMenu(e.currentTarget, [
      { label: 'Öffnen', run: () => openProject(m.id) }, { label: 'Umbenennen …', run: async () => { const n = await askText('Umbenennen', 'Neuer Name', m.name, 'Umbenennen'); if (n) await rewriteProject(m.id, d => { d.name = n; }); } },
      { label: 'Duplizieren', run: () => rewriteProject(m.id, d => { d.name += ' (Kopie)'; }, true) }, { label: 'Als Datei speichern (.owb) …', run: () => exportLibraryFile(m) }, '-',
      { label: 'Löschen …', run: async () => { if (await confirmDlg('Whiteboard löschen', `„${m.name}“ wirklich löschen? Das lässt sich nicht rückgängig machen.`, 'Löschen', true)) { await api.deleteProject(m.id); renderHome(); } } }]); } }, '⋯');
    return h('div', { class: 'card', onclick: () => openProject(m.id) }, h('div', { class: 'th', style: m.thumb ? `background-image:url(${m.thumb})` : '' }, m.thumb ? '' : '▭'),
      h('div', { class: 'meta' }, h('div', { class: 'nm', title: m.name }, m.name), h('div', { class: 'dt' }, 'Geändert: ' + fmt(m.modified))), more);
  });
  const nw = h('div', { class: 'card', onclick: newProject }, h('div', { class: 'th new' }, '＋'), h('div', { class: 'meta' }, h('div', { class: 'nm' }, 'Neues Whiteboard'), h('div', { class: 'dt' }, 'Leere Fläche öffnen')));
  grid.replaceChildren(nw, ...cards);
  const hs = $('#h-hist'); hs.hidden = !S.settings.historic;
  if (S.settings.historic && !$('#h-hgrid').children.length) $('#h-hgrid').replaceChildren(...Object.entries(HIST).map(([id, t]) =>
    h('div', { class: 'card', onclick: () => newTemplateProject(id) }, h('div', { class: 'th', style: `background-image:url(${tplPreview(id)})` }),
      h('div', { class: 'meta' }, h('div', { class: 'nm' }, t.name), h('div', { class: 'dt' }, t.era)))));
}
async function rewriteProject(id, fn, asCopy) {
  const raw = await api.loadProject(id); const meta = (await api.listProjects()).find(m => m.id === id); if (!raw || !meta) return;
  const d = typeof raw === 'string' ? JSON.parse(raw) : raw; d.name = meta.name; fn(d);
  const now = Date.now(), nid = asCopy ? uid() : id;
  if (asCopy && api.copyImgs) await api.copyImgs(id, nid);
  await api.saveProject({ id: nid, name: d.name, created: asCopy ? now : meta.created, modified: asCopy ? now : meta.modified, filePath: asCopy ? null : meta.filePath }, JSON.stringify(d), meta.thumb || null);
  renderHome();
}
async function exportLibraryFile(m) {
  const raw = await api.loadProject(m.id); if (!raw) return;
  const obj = typeof raw === 'string' ? JSON.parse(raw) : raw, stored = api.getImgs ? await api.getImgs(m.id) : {};
  obj.imgs = { ...(obj.imgs || {}), ...stored };
  const d = JSON.stringify(obj);
  const out = await saveOut(m.name.replace(/[\\/:*?"<>|]/g, '_') + '.owb', d, { filters: EXT_FILTER, mime: 'application/json' }); if (out) toast('Gespeichert.');
}

/* ---------- Start ---------- */
async function boot() {
  await loadSettings(); await loadUserLibrary(false);
  if (IS_PRESENTER_VIEW) { applyTheme(); bootPresenterView(); return; }      // zweites Fenster für den Beamer
  applyTheme(); initInput();
  $('#h-new').onclick = newProject; $('#h-open').onclick = openFileDialog; $('#h-settings').onclick = openSettings; $('#h-help').onclick = openHelp;
  $('#f-img').onchange = e => { addFiles([...e.target.files], null); e.target.value = ''; };
  $('#f-owb').onchange = async e => { const f = e.target.files[0]; if (f) importProjectText(await f.text(), null); e.target.value = ''; };
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && S.screen === 'editor') { e.preventDefault(); saveFile(e.shiftKey); } });
  addEventListener('beforeunload', flushSave); addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSave(); });
  setInterval(() => { if (S.dirty && S.screen === 'editor' && !drag) doSave(false); }, 20000);      // Sicherheitsnetz
  $('#home').addEventListener('dragover', e => e.preventDefault());
  $('#home').addEventListener('drop', async e => { e.preventDefault(); const fs = [...e.dataTransfer.files], f = fs.find(x => /\.owb$/i.test(x.name));
    if (f) importProjectText(await f.text(), f.path || null);
    else if (fs.length) { newProject(); S.project.name = fs[0].name.replace(/\.[^.]+$/, ''); await addFiles(fs, null); refreshUI(); } });
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.settings.theme === 'system') { applyTheme(); S.screen === 'editor' ? (refreshUI(), render()) : renderHome(); } });
  api.onOpenFile(async p => { try { importProjectText(await api.readFile(p), p); } catch (e) { toast('Datei konnte nicht geöffnet werden.'); } });
  applyAppIcon(); renderHome();
  setTimeout(() => loadMathJax(), 2500);                                 // Formelsatz im Hintergrund vorladen
  setTimeout(() => { if (api.volatile) toast('Achtung: Dieser Browser erlaubt hier keinen dauerhaften Speicher (z. B. privates Fenster). Sichern Sie Ihre Boards mit Strg+S als Datei.', 9000); }, 800);
}
boot();
