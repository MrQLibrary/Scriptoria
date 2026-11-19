"use strict";
/* ===== Werkzeuge: Treffertests, Auswahl-Operationen, Texteingabe, Radierer ===== */
const TOOL_CURSOR = { select: 'default', hand: 'grab', pen: 'crosshair', eraser: 'none', line: 'crosshair', arrow: 'crosshair', rect: 'crosshair', ellipse: 'crosshair',
  note: 'copy', text: 'text', compass: 'crosshair', place: 'crosshair', laser: 'none', ruler: 'default', parab: 'crosshair', wire: 'crosshair' };

function toggleOffTool() {                               // aktives Hilfswerkzeug erneut anklicken → weg damit
  if (S.tool === 'compass') S.compass.cx = null;
  setTool(S.prevTool && S.prevTool !== S.tool ? S.prevTool : 'pen');
}
function setTool(t) {
  if (t !== S.tool) S.prevTool = S.tool;
  if (S.editing) commitEdit();
  if (S.wire && t !== 'wire') wireFinish();
  S.eraserSkin = null;
  S.tool = t; S.draft = null; S.marquee = null; S.snapHint = null; S.laser.active = false;
  if (t !== 'select') S.sels = [];
  if (t !== 'place') { S.ghost = null; S.armedCirc = null; }
  updateCursor();
  if (window.refreshUI) refreshUI(); render();
}

/* ---------- Mauszeiger: beim Stift ein farbiger Punkt in Stiftgröße statt Fadenkreuz ---------- */
function penCursor() {
  const p = curPen(); let lw = p.width;
  if (p.kind === 'pencil') lw = Math.max(1, lw * 0.75); else if (p.kind === 'marker') lw *= 1.5;
  const dia = clamp(lw * S.view.z, 6, 60), sz = Math.ceil(dia + 4), c = sz / 2;
  const col = p.color === '@ink' ? (themeDark() ? '#f2f2f2' : '#1b1b1b') : p.color, ring = themeDark() ? '#000000' : '#ffffff';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}"><circle cx="${c}" cy="${c}" r="${dia / 2}" fill="${col}" fill-opacity="${p.kind === 'highlighter' ? 0.6 : 1}" stroke="${ring}" stroke-opacity=".9" stroke-width="1.2"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${Math.round(c)} ${Math.round(c)}, crosshair`;
}
function cursorFor() {
  if (typeof spaceDown !== 'undefined' && spaceDown) return 'grab';
  if (window.toolCursor) { const c = toolCursor(); if (c) return c; }
  if (S.tool === 'pen') return penCursor();
  return TOOL_CURSOR[S.tool] || 'default';
}
function updateCursor() { const cv = $('#board'); if (cv && !(typeof drag !== 'undefined' && drag && drag.k === 'pan')) cv.style.cursor = cursorFor(); }

/* ---------- Fertige Schaltungen am Mauszeiger platzieren ---------- */
function rotateObjAbout(o, cx, cy, a) {                  // Objekt um Punkt (cx,cy) drehen; Texte bleiben aufrecht lesbar
  const R = (x, y) => { const [u, v] = rotPt(x - cx, y - cy, a); return [cx + u, cy + v]; };
  if (o.type === 'pen') o.pts = o.pts.map(q => { const [x, y] = R(q[0], q[1]); return [x, y, ...q.slice(2)]; });
  else if (o.type === 'line' || o.type === 'arrow') { [o.x1, o.y1] = R(o.x1, o.y1); [o.x2, o.y2] = R(o.x2, o.y2); }
  else if (o.type === 'arc') { [o.cx, o.cy] = R(o.cx, o.cy); o.a0 += a; }
  else if (isBox(o)) { const [nx, ny] = R(o.x + o.w / 2, o.y + o.h / 2); o.x = nx - o.w / 2; o.y = ny - o.h / 2; if (o.type !== 'text') o.rot = (o.rot || 0) + a; }
}
function armCircuit(t) {
  const list = t.items.map(cloneObj), b = allBounds(list); if (!b) return;
  const ox = Math.round((b[0] + b[2]) / 2 / GRID) * GRID, oy = Math.round((b[1] + b[3]) / 2 / GRID) * GRID;
  list.forEach(o => moveObj(o, -ox, -oy));
  S.armed = null; setTool('place'); S.armedCirc = { name: t.name, items: list, rot: 0 };
  if (S.hover) S.ghost = circGhost({ x: (S.hover.sx - S.view.x) / S.view.z, y: (S.hover.sy - S.view.y) / S.view.z });
  hintToast('„' + t.name + '“: Klick setzt ab, Q dreht, Esc bricht ab.', 3500);
  if (window.refreshUI) refreshUI();
}
function circGhost(p) {
  const gx = Math.round(p.x / GRID) * GRID, gy = Math.round(p.y / GRID) * GRID, a = rad(S.armedCirc.rot);
  return S.armedCirc.items.map(o => { const c = cloneObj(o); if (a) rotateObjAbout(c, 0, 0, a); moveObj(c, gx, gy); return c; });
}

/* ---------- Treffertests ---------- */
function angleIn(o, a) {                              // liegt Winkel a im Bogen o?
  const TAU = Math.PI * 2; let d = ((a - o.a0) % TAU + TAU) % TAU;
  return o.sweep >= 0 ? d <= o.sweep : (TAU - d) <= -o.sweep || d === 0;
}
function hitObj(o, p, tol) {
  if (isBox(o)) {
    const [lx, ly] = toLocal(o, p.x, p.y), hw = o.w / 2, hh = o.h / 2;
    if (Math.abs(lx) > hw + tol || Math.abs(ly) > hh + tol) return false;
    if (o.type === 'rect' && !o.fill) return !(Math.abs(lx) < hw - tol && Math.abs(ly) < hh - tol);
    if (o.type === 'ellipse') {
      const r = Math.hypot(lx / hw, ly / hh), m = Math.min(hw, hh);
      return o.fill ? r <= 1 + tol / m : Math.abs(r - 1) * m <= tol;
    }
    return true;
  }
  if (o.type === 'pen') {
    const q = o.pts, r = tol + o.w / 2;
    if (q.length === 1) return Math.hypot(p.x - q[0][0], p.y - q[0][1]) <= r;
    for (let i = 1; i < q.length; i++) if (distSeg(p.x, p.y, q[i - 1][0], q[i - 1][1], q[i][0], q[i][1]) <= r) return true;
    return false;
  }
  if (o.type === 'line' || o.type === 'arrow') return distSeg(p.x, p.y, o.x1, o.y1, o.x2, o.y2) <= tol + o.w / 2 + 2;
  if (o.type === 'arc') return Math.abs(Math.hypot(p.x - o.cx, p.y - o.cy) - o.r) <= tol + o.w / 2 + 2 && angleIn(o, Math.atan2(p.y - o.cy, p.x - o.cx));
  return false;
}
function hitTest(p, withLocked) { const tol = 6 / S.view.z; for (let i = S.objs.length - 1; i >= 0; i--) { const o = S.objs[i]; if ((!o.lock || withLocked) && hitObj(o, p, tol)) return o; } return null; }

/* ---------- Eigenschaften der Auswahl ---------- */
const widthKey = o => (o.type === 'pen' || o.type === 'line' || o.type === 'arrow' || o.type === 'arc') ? 'w' : (o.type === 'rect' || o.type === 'ellipse' || o.type === 'symbol') ? 'sw' : null;
function applyProp(key, val) {
  if (!S.sels.length) return;
  const pre = snapshot();
  for (const o of S.sels) {
    if (key === 'color') o.c = o.type === 'note' && val === '@ink' ? '#fff1a8' : val;
    else if (key === 'width') { const k = widthKey(o); if (k) o[k] = val; }
    else if (key === 'ls') { if (o.type !== 'text' && o.type !== 'note' && o.type !== 'image' && o.type !== 'symbol') o.ls = val; }
    else if (key === 'fill') { if (o.type === 'rect' || o.type === 'ellipse') o.fill = val; }
    else if (key === 'fillC') { if (o.type === 'rect' || o.type === 'ellipse') { o.fillC = val; o.fill = true; } }
    else if (key === 'size') { if (o.type === 'text') { o.size = val; measureTextObj(o); } else if (o.type === 'note') o.size = val; }
    else if (key === 'font' || key === 'bold' || key === 'italic') { if (o.type === 'text' || o.type === 'note') { o[key] = val; if (o.type === 'text') measureTextObj(o); } }
    else if (key === 'noteSize') { if (o.type === 'note') { o.w = val; o.h = val; } }
    else if (key === 'noteW') { if (o.type === 'note') o.w = Math.max(60, val); }
    else if (key === 'noteH') { if (o.type === 'note') o.h = Math.max(60, val); }
    else if (key === 'rot') { if (isBox(o)) o.rot = rad(val); }
    else if (key === 'label') { if (o.type === 'symbol') o.label = val; }
    else if (key === 'val') { if (o.type === 'symbol') o.val = val; }
  }
  record(pre);
}
function deleteSel() { if (!S.sels.length) return; const pre = snapshot(); S.objs = S.objs.filter(o => !S.sels.includes(o)); S.sels = []; record(pre); if (window.refreshUI) refreshUI(); }
function cloneObj(o) { return JSON.parse(JSON.stringify(o)); }
function duplicateSel() {
  if (!S.sels.length) return; const pre = snapshot(), n = [];
  for (const o of S.sels) { const c = cloneObj(o); moveObj(c, 20, 20); S.objs.push(c); n.push(c); }
  S.sels = n; record(pre); if (window.refreshUI) refreshUI();
}
function orderSel(front) {
  if (!S.sels.length) return; const pre = snapshot(), keep = S.objs.filter(o => !S.sels.includes(o)), mine = S.objs.filter(o => S.sels.includes(o));
  S.objs = front ? keep.concat(mine) : mine.concat(keep); record(pre);
}
let clipboard = null;
function copySel() { if (S.sels.length) clipboard = JSON.stringify(S.sels); }
function pasteClip() {
  if (!clipboard) return false; const pre = snapshot(), n = JSON.parse(clipboard);
  n.forEach(o => { moveObj(o, 30, 30); S.objs.push(o); }); clipboard = JSON.stringify(n);
  S.sels = n; setTool('select'); S.sels = n; record(pre); if (window.refreshUI) refreshUI(); return true;
}
function selectAll() { setTool('select'); S.sels = S.objs.slice(); render(); if (window.refreshUI) refreshUI(); }

/* ---------- Texteingabe (Text + Haftnotizen) ---------- */
const fontProps = () => ({ font: S.style.font, bold: S.style.bold, italic: S.style.italic });
function newText(p) { return { type: 'text', x: p.x, y: p.y, w: 40, h: 33, rot: 0, text: '', c: S.style.color, size: S.style.size, ...fontProps() }; }
function newNote(p) {
  const c = S.style.color === '@ink' || !/^#/.test(S.style.color) ? '#fff1a8' : S.style.color;
  const n = S.style.noteSize;
  return { type: 'note', x: p.x - n / 2, y: p.y - n / 2, w: n, h: n, rot: 0, text: '', c, size: S.style.noteText, ...fontProps() };
}
function layoutEditor() {
  const o = S.editing, ed = $('#ed'); if (!o) return;
  const [sx, sy] = toScreen(...corners(o)[0]);
  const isNote = o.type === 'note', col = isNote ? '#1b1b1b' : colorOf(o.c);
  ed.className = isNote ? 'wrap' : '';
  const fs = isNote ? noteSize(o) : o.size;
  Object.assign(ed.style, {
    left: sx + 'px', top: sy + 'px', transform: `rotate(${o.rot || 0}rad) scale(${S.view.z})`,
    fontFamily: `"${o.font || 'Segoe UI'}", ${FONT}`, fontWeight: o.bold ? '700' : '400', fontStyle: o.italic ? 'italic' : 'normal',
    fontSize: fs + 'px', lineHeight: isNote ? (fs * 1.28) + 'px' : '1.25', color: col,
    background: isNote ? o.c : (themeDark() ? '#1e1f22' : '#ffffff'), padding: isNote ? '9px 9px' : '1px 1px'
  });
  if (isNote) { ed.style.width = o.w + 'px'; ed.style.height = o.h + 'px'; }
  else {
    mctx.font = fontStr(o, o.size);
    const ls = ed.value.split('\n');
    ed.style.width = Math.max(60, ...ls.map(l => mctx.measureText(l).width)) + 24 + 'px';
    ed.style.height = ls.length * o.size * 1.25 + 8 + 'px';
  }
}
function startEdit(o, pre) {
  if (S.editing) commitEdit();
  S.editing = o; S.editPre = pre; S.sels = [o];
  const ed = $('#ed'); ed.hidden = false; ed.value = o.text || '';
  layoutEditor(); render();
  ed.focus(); ed.setSelectionRange(ed.value.length, ed.value.length);
  requestAnimationFrame(() => { if (S.editing === o) ed.focus(); });   // Fokus sichern, falls der Klick ihn noch wegnimmt
}
function commitEdit() {
  const o = S.editing; if (!o) return;
  const ed = $('#ed'); S.editing = null; o.text = ed.value; ed.hidden = true;
  if (o.type === 'text') { if (!o.text.trim()) { S.objs = S.objs.filter(x => x !== o); S.sels = []; } else measureTextObj(o); }
  record(S.editPre);
}
function initEditor() {
  const ed = $('#ed');
  ed.addEventListener('input', layoutEditor);
  ed.addEventListener('blur', () => { if (S.editing && !S.keepEdit) commitEdit(); });
  ed.addEventListener('keydown', e => { if (e.key === 'Escape' || (e.key === 'Enter' && e.ctrlKey)) { e.preventDefault(); commitEdit(); } e.stopPropagation(); });
  ed.addEventListener('pointerdown', e => e.stopPropagation());
}

/* ---------- Radierer ---------- */
function penRuns(o, p, r) {                           // Stift-Strich in Teilstücke außerhalb des Radierkreises zerlegen
  const q = o.pts, runs = []; let cur = [];
  for (let i = 0; i < q.length; i++) {
    const inside = Math.hypot(q[i][0] - p.x, q[i][1] - p.y) <= r;
    const cutSeg = i > 0 && !inside && distSeg(p.x, p.y, q[i - 1][0], q[i - 1][1], q[i][0], q[i][1]) <= r;
    if (inside || cutSeg) { if (cur.length) runs.push(cur); cur = []; }
    if (!inside) cur.push(q[i]);
  }
  if (cur.length) runs.push(cur);
  return runs;
}
function erase(p) {
  const r = S.eraser.size / S.view.z, out = []; let changed = false;
  for (const o of S.objs) {
    if (o.type === 'image' || o.type === 'graph') { out.push(o); continue; }   // Bilder, PDFs und Diagramme bleiben beim Radieren erhalten
    if (S.eraser.mode === 'pixel' && o.type === 'pen') {
      const hitAny = o.pts.some(q => Math.hypot(q[0] - p.x, q[1] - p.y) <= r) || o.pts.some((q, i) => i && distSeg(p.x, p.y, o.pts[i - 1][0], o.pts[i - 1][1], q[0], q[1]) <= r);
      if (!hitAny) { out.push(o); continue; }
      changed = true;
      for (const run of penRuns(o, p, r)) if (run.length > 1 || o.pts.length === 1) out.push({ ...o, pts: run });
    } else if (hitObj(o, p, r)) changed = true;
    else out.push(o);
  }
  if (changed) { S.objs = out; S.sels = S.sels.filter(s => out.includes(s)); }
  return changed;
}
