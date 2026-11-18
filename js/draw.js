"use strict";
/* ===== Zeichnen: Objekte, Stifte, Raster, Auswahl-Griffe, Lineal, Zirkel ===== */
const RT = { dark: false };                       // aktuelles Render-Thema
const mctx = document.createElement('canvas').getContext('2d');
const colorOf = c => c === '@ink' ? (RT.dark ? '#f2f2f2' : '#1b1b1b') : (c || '#000');
const paperColor = () => RT.dark ? '#1e1f22' : '#ffffff';

function dashFor(ls, w) {
  switch (ls) {
    case 'dashed': return [w * 3 + 6, w * 2 + 5];
    case 'dotted': return [0.01, w * 2 + 4];
    case 'dashdot': return [w * 3 + 6, w * 1.5 + 4, Math.max(2, w), w * 1.5 + 4];   // Punkt hat echte Länge, sonst unsichtbar
    default: return [];
  }
}
function wrapText(c, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const wd of para.split(' ')) {
      const t = line ? line + ' ' + wd : wd;
      if (c.measureText(t).width > maxW && line) { out.push(line); line = wd; } else line = t;
    }
    out.push(line);
  }
  return out;
}
const FONTS = { 'Segoe UI': 'Standard (Segoe UI)', 'Arial': 'Arial', 'Times New Roman': 'Times New Roman', 'Georgia': 'Georgia', 'Consolas': 'Consolas (Festbreite)', 'Comic Sans MS': 'Comic Sans', 'Segoe Print': 'Handschrift (Segoe Print)' };
const fontStr = (o, size) => `${o.italic ? 'italic ' : ''}${o.bold ? 'bold ' : ''}${size}px "${o.font || 'Segoe UI'}", ${FONT}`;
const noteSize = o => o.size || 18;
function measureTextObj(o) {                         // Größe eines Textobjekts bestimmen
  mctx.font = fontStr(o, o.size);
  if (window.hasMath && hasMath(o.text)) { const lay = richLayout(mctx, o.text, o.size, colorOf(o.c), fontStr(o, o.size)); o.w = lay.w; o.h = lay.h; return; }
  const ls = String(o.text || '').split('\n');
  o.w = Math.max(24, ...ls.map(l => mctx.measureText(l).width)) + 4;
  o.h = ls.length * o.size * 1.25 + 2;
}

/* ---------- Stifte ---------- */
function smoothPath(c, p) {
  c.beginPath(); c.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length - 1; i++) c.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2);
  const l = p[p.length - 1]; c.lineTo(l[0], l[1]);
}
function drawPen(c, o) {
  if (window.drawHistPen && drawHistPen(c, o)) { c.globalAlpha = 1; return; }
  const p = o.pts, col = colorOf(o.c), kind = o.kind || 'ballpoint';
  c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = col; c.fillStyle = col;
  let lw = o.w, alpha = 1;
  if (kind === 'pencil') { lw = Math.max(1, o.w * 0.75); alpha = 0.8; }
  else if (kind === 'marker') { lw = o.w * 1.5; alpha = 0.96; }
  else if (kind === 'highlighter') { lw = o.w; alpha = 0.4; c.lineCap = 'butt'; }
  c.globalAlpha = alpha; c.lineWidth = lw;
  if (p.length < 2) { c.beginPath(); c.arc(p[0][0], p[0][1], lw / 2, 0, 7); c.fill(); c.globalAlpha = 1; return; }
  if (o.pr && p.length > 1) { pressureStroke(c, p, lw, kind === 'fountain'); c.globalAlpha = 1; return; }
  if (kind === 'fountain') {                       // Breitfeder: Strichstärke hängt von der Richtung ab
    const nib = rad(-40); let prev = o.w * 0.6;
    for (let i = 1; i < p.length; i++) {
      const a = Math.atan2(p[i][1] - p[i - 1][1], p[i][0] - p[i - 1][0]);
      const target = o.w * (0.28 + 0.9 * Math.abs(Math.sin(a - nib)));
      prev = prev * 0.7 + target * 0.3; c.lineWidth = prev;
      c.beginPath(); c.moveTo(p[i - 1][0], p[i - 1][1]); c.lineTo(p[i][0], p[i][1]); c.stroke();
    }
  } else {
    c.setLineDash(dashFor(o.ls, lw)); smoothPath(c, p); c.stroke(); c.setLineDash([]);
  }
  c.globalAlpha = 1;
}

/* Druckempfindlicher Strich: als gefüllte Fläche mit wechselnder Breite (keine dunklen Überlappungen bei Transparenz) */
function pressureStroke(c, p, lw, nib) {
  const n = p.length, raw = p.map((q, i) => {
    let w = lw * (0.25 + 1.25 * (q[2] == null ? 0.5 : q[2]));
    if (nib && i) { const a = Math.atan2(q[1] - p[i - 1][1], q[0] - p[i - 1][0]); w *= 0.3 + 0.9 * Math.abs(Math.sin(a + rad(40))); }
    return w;
  });
  const w = raw.map((_, i) => (raw[Math.max(0, i - 1)] + 2 * raw[i] + raw[Math.min(n - 1, i + 1)]) / 4), L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = p[Math.max(0, i - 1)], b = p[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l * w[i] / 2, ny = dx / l * w[i] / 2; L.push([p[i][0] + nx, p[i][1] + ny]); R.push([p[i][0] - nx, p[i][1] - ny]);
  }
  c.beginPath(); c.moveTo(L[0][0], L[0][1]);
  for (let i = 1; i < n; i++) c.lineTo(L[i][0], L[i][1]);
  c.arc(p[n - 1][0], p[n - 1][1], w[n - 1] / 2, Math.atan2(L[n - 1][1] - p[n - 1][1], L[n - 1][0] - p[n - 1][0]), Math.atan2(R[n - 1][1] - p[n - 1][1], R[n - 1][0] - p[n - 1][0]), true);
  for (let i = n - 1; i >= 0; i--) c.lineTo(R[i][0], R[i][1]);
  c.arc(p[0][0], p[0][1], w[0] / 2, Math.atan2(R[0][1] - p[0][1], R[0][0] - p[0][0]), Math.atan2(L[0][1] - p[0][1], L[0][0] - p[0][0]), true);
  c.closePath(); c.fill();
}

/* ---------- Objekte ---------- */
function strokeSetup(c, o, w) { c.strokeStyle = colorOf(o.c); c.lineWidth = w; c.lineCap = o.ls === 'dotted' ? 'round' : 'butt'; c.lineJoin = 'round'; c.setLineDash(dashFor(o.ls, w)); }

function drawObj(c, o) {
  c.lineCap = 'round'; c.lineJoin = 'round'; c.textBaseline = 'top'; c.setLineDash([]);
  if (isBox(o)) {
    const [cx, cy] = center(o);
    c.save(); c.translate(cx, cy); c.rotate(o.rot || 0); c.translate(-o.w / 2, -o.h / 2);
    drawBox(c, o); c.restore(); return;
  }
  switch (o.type) {
    case 'pen': drawPen(c, o); break;
    case 'line': case 'arrow': {
      strokeSetup(c, o, o.w);
      c.beginPath(); c.moveTo(o.x1, o.y1); c.lineTo(o.x2, o.y2); c.stroke(); c.setLineDash([]); c.lineCap = 'round';
      if (o.type === 'arrow') {
        const a = Math.atan2(o.y2 - o.y1, o.x2 - o.x1), L = 11 + o.w * 2.2;
        c.beginPath(); c.moveTo(o.x2 - L * Math.cos(a - 0.45), o.y2 - L * Math.sin(a - 0.45)); c.lineTo(o.x2, o.y2);
        c.lineTo(o.x2 - L * Math.cos(a + 0.45), o.y2 - L * Math.sin(a + 0.45)); c.stroke();
      }
      break;
    }
    case 'arc': {
      strokeSetup(c, o, o.w); c.beginPath(); c.arc(o.cx, o.cy, o.r, o.a0, o.a0 + o.sweep, o.sweep < 0); c.stroke(); c.setLineDash([]); break;
    }
  }
}
function drawBox(c, o) {                              // Koordinaten: links oben = (0,0), bereits gedreht
  switch (o.type) {
    case 'rect': case 'ellipse': {
      c.beginPath();
      if (o.type === 'rect') c.rect(0, 0, o.w, o.h); else c.ellipse(o.w / 2, o.h / 2, Math.abs(o.w / 2), Math.abs(o.h / 2), 0, 0, 7);
      if (o.fill) { c.globalAlpha = 0.22; c.fillStyle = colorOf(o.fillC || o.c); c.fill(); c.globalAlpha = 1; }
      strokeSetup(c, o, o.sw); c.stroke(); c.setLineDash([]); break;
    }
    case 'image': {
      const im = getImg(o.id);
      if (im._ok) { try { c.drawImage(im, 0, 0, o.w, o.h); } catch (e) {} }
      else { c.fillStyle = '#8884'; c.fillRect(0, 0, o.w, o.h); }
      break;
    }
    case 'note': {
      c.save(); c.shadowColor = 'rgba(0,0,0,.28)'; c.shadowBlur = 8; c.shadowOffsetY = 3; c.fillStyle = o.c; c.fillRect(0, 0, o.w, o.h); c.restore();
      if (o !== S.editing) {
        c.save(); c.beginPath(); c.rect(0, 0, o.w, o.h); c.clip(); c.fillStyle = '#1b1b1b'; c.font = fontStr(o, noteSize(o));
        if (hasMath(o.text)) drawRich(c, richLayout(c, o.text, noteSize(o), '#1b1b1b', fontStr(o, noteSize(o))), 10, 8, '#1b1b1b', fontStr(o, noteSize(o)));
        else wrapText(c, o.text, o.w - 20).forEach((l, i) => c.fillText(l, 10, 10 + i * noteSize(o) * 1.28));
        c.restore();
      }
      break;
    }
    case 'text': {
      if (o === S.editing) break;
      c.fillStyle = colorOf(o.c); c.font = fontStr(o, o.size);
      if (hasMath(o.text)) drawRich(c, richLayout(c, o.text, o.size, colorOf(o.c), fontStr(o, o.size)), 2, 0, colorOf(o.c), fontStr(o, o.size));
      else String(o.text).split('\n').forEach((l, i) => c.fillText(l, 2, 1 + i * o.size * 1.25));
      break;
    }
    case 'symbol': {
      const sym = SYM[o.sym]; if (!sym) { c.strokeStyle = '#d33'; c.strokeRect(0, 0, o.w, o.h); break; }
      const sx = o.w / sym.w, sy = o.h / sym.h, P = symP2D(sym), col = colorOf(o.c);
      c.save(); c.scale(sx, sy);
      c.strokeStyle = col; c.fillStyle = col; c.lineWidth = o.sw / Math.sqrt(sx * sy); c.lineCap = 'round'; c.lineJoin = 'round';
      P.s.forEach(p => c.stroke(p)); P.f.forEach(p => c.fill(p));
      for (const t of sym.texts || []) {                 // Buchstaben im Symbol bleiben aufrecht lesbar, auch wenn das Bauteil gedreht ist
        c.save(); c.translate(t.x, t.y); c.rotate(-(o.rot || 0)); c.font = `${t.s}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t.t, 0, 0); c.restore();
      }
      c.restore();
      if (o.label && hasMath(o.label)) { const f = `15px ${FONT}`, lay = richLayout(c, o.label, 15, col, f); drawRich(c, lay, o.w / 2 - lay.w / 2, -3 - lay.h, col, f); }
      else if (o.label) {
        c.fillStyle = col; c.font = `15px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'bottom';
        c.fillText(o.label, o.w / 2, -3);
      }
      c.textAlign = 'start'; break;
    }
  }
}

/* ---------- Szene ----------
   Zwei Ebenen: #board enthält Hintergrund, Raster und alle fertigen Objekte und wird nur neu gezeichnet,
   wenn sich daran etwas ändert. #overlay enthält alles, was sich ständig bewegt (Laserpointer, Strich in Arbeit,
   Auswahlrahmen, Lineal, Zirkel, Vorschau) – so bleibt es auch bei vollen Boards flüssig. */
function viewRect(v, w, h, d) { return [-v.x / v.z, -v.y / v.z, (w / d - v.x) / v.z, (h / d - v.y) / v.z]; }
function drawBase(c, d, v, opt) {
  RT.dark = !!opt.dark;
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (window.drawBackground && opt.bgDraw !== false && drawBackground(c, d, v, opt)) { /* historische Vorlage hat den Hintergrund gezeichnet */ }
  else { c.fillStyle = paperColor(); c.fillRect(0, 0, opt.w, opt.h); }
  c.setTransform(d * v.z, 0, 0, d * v.z, d * v.x, d * v.y);
  if (opt.grid) drawGuides(c, d, v, opt);
  const vr = opt.cull === false ? null : viewRect(v, opt.w, opt.h, d), m = 40 / v.z;
  for (const o of S.objs) {
    if (vr) { const b = objBounds(o); if (b[2] < vr[0] - m || b[0] > vr[2] + m || b[3] < vr[1] - m || b[1] > vr[3] + m) continue; }   // außerhalb des Bildschirms: überspringen
    drawObj(c, o);
  }
}
/* Hilfslinien: Punkte, Karos (5 mm) oder Linien wie im Schreibheft; Stärke in den Einstellungen */
const GUIDE_W = { fein: { a: 0.75, lw: 0.7, r: 0.8 }, mittel: { a: 0.85, lw: 1, r: 1.1 }, kraeftig: { a: 1, lw: 1.6, r: 1.6 } };
function drawGuides(c, d, v, opt) {
  const type = S.settings.gridType || 'dots', W = GUIDE_W[S.settings.gridWeight] || GUIDE_W.mittel;
  let sp = gridStep() * (type === 'squares' ? 2 : type === 'lines' ? 3 : 1); while (sp * v.z < (type === 'dots' ? 9 : 7)) sp *= 2;
  const x0 = Math.floor(-v.x / v.z / sp) * sp, y0 = Math.floor(-v.y / v.z / sp) * sp, x1 = (opt.w / d - v.x) / v.z, y1 = (opt.h / d - v.y) / v.z;
  c.save(); c.globalAlpha = W.a;
  if (type === 'dots') {
    c.fillStyle = RT.dark ? '#4a4d54' : '#c4c8cf'; const r = W.r / v.z;
    for (let x = x0; x < x1; x += sp) for (let y = y0; y < y1; y += sp) c.fillRect(x - r, y - r, 2 * r, 2 * r);
  } else {
    c.strokeStyle = type === 'lines' ? (RT.dark ? '#3e4a5c' : '#b9c7dc') : (RT.dark ? '#3f434a' : '#cdd1d8'); c.lineWidth = W.lw / v.z; c.beginPath();
    for (let y = y0; y < y1; y += sp) { c.moveTo(x0, y); c.lineTo(x1, y); }
    if (type === 'squares') for (let x = x0; x < x1; x += sp) { c.moveTo(x, y0); c.lineTo(x, y1); }
    c.stroke();
  }
  c.restore();
}
function drawOverlay(c, d, v, w, hh) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, hh);
  RT.dark = themeDark();
  c.setTransform(d * v.z, 0, 0, d * v.z, d * v.x, d * v.y);
  if (S.draft) drawObj(c, S.draft);
  drawSelection(c, v.z);
  if (S.tool === 'compass') drawCompass(c);
  if (window.drawInstruments) drawInstruments(c, v.z);
  if (S.snapHint) { c.save(); c.strokeStyle = '#2563eb'; c.fillStyle = 'rgba(37,99,235,.18)'; c.lineWidth = 1.6 / v.z; c.beginPath(); c.arc(S.snapHint.x, S.snapHint.y, 7 / v.z, 0, 7); c.fill(); c.stroke(); c.restore(); }
  if (S.ghost && S.tool === 'place') { c.save(); c.globalAlpha = 0.55; (Array.isArray(S.ghost) ? S.ghost : [S.ghost]).forEach(o => drawObj(c, o)); c.restore(); }
  drawLaser(c, v.z);
  if (S.marquee) {
    const m = S.marquee; c.save(); c.fillStyle = 'rgba(37,99,235,.12)'; c.strokeStyle = '#2563eb'; c.lineWidth = 1 / v.z;
    c.fillRect(m.x1, m.y1, m.x2 - m.x1, m.y2 - m.y1); c.strokeRect(m.x1, m.y1, m.x2 - m.x1, m.y2 - m.y1); c.restore();
  }
  c.setTransform(d, 0, 0, d, 0, 0);
  if (S.ruler.on) drawRuler(c);
  if (window.drawScreenTools) drawScreenTools(c);
  if (S.tool === 'eraser' && S.hover && S.eraserSkin && window.drawEraserSkin) drawEraserSkin(c, S.hover.sx, S.hover.sy, S.eraser.size);
  else if (S.tool === 'eraser' && S.hover) {
    c.save(); c.strokeStyle = RT.dark ? '#fff' : '#000'; c.fillStyle = RT.dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)'; c.lineWidth = 1.2; c.beginPath();
    c.arc(S.hover.sx, S.hover.sy, S.eraser.size, 0, 7); c.fill(); c.stroke(); c.restore();
  }
}
// Für Export und Vorschaubilder: nur die fertigen Objekte, ohne Bedienelemente
function drawScene(c, d, v, opt) { drawBase(c, d, v, opt); }

/* Zeichnen wird pro Bildschirmbild (requestAnimationFrame) gebündelt: viele Mausereignisse = ein Neuzeichnen. */
let rafId = 0, needBase = false, needOver = false;
function render() { needBase = needOver = true; if (!rafId) rafId = requestAnimationFrame(flushRender); }
function renderOverlay() { needOver = true; if (!rafId) rafId = requestAnimationFrame(flushRender); }
function flushRender() {
  rafId = 0; if (S.screen !== 'editor') return;
  const cv = $('#board'), ov = $('#overlay'), d = window.devicePixelRatio || 1;
  try {
    if (needBase) { needBase = false; drawBase(cv.getContext('2d'), d, S.view, { dark: themeDark(), grid: S.settings.grid && !curTpl(), w: cv.width, h: cv.height }); }
    if (needOver) { needOver = false; drawOverlay(ov.getContext('2d'), d, S.view, ov.width, ov.height); }
  } catch (e) { console.error(e); }
  const zl = $('#zl'); if (zl) zl.textContent = Math.round(S.view.z * 100) + ' %';
  if (window.presentSend && !IS_PRESENTER_VIEW) presentSend();
}
function resizeBoard() {
  const d = window.devicePixelRatio || 1;
  for (const cv of [$('#board'), $('#overlay')]) { cv.width = Math.round(innerWidth * d); cv.height = Math.round(innerHeight * d); }
  render();
}

/* ---------- Auswahl & Griffe ---------- */
function handleDefs(o) {                              // sichtbare Griffe: [Name, sx, sy]
  if (o.type === 'text') return [['se', 1, 1]];
  return [['nw', -1, -1], ['n', 0, -1], ['ne', 1, -1], ['e', 1, 0], ['se', 1, 1], ['s', 0, 1], ['sw', -1, 1], ['w', -1, 0]];
}
const ROT_DIST = 30;                                  // Abstand des Drehgriffs (Bildschirm-px)
function drawSelection(c, z) {
  if (!S.sels.length) return;
  c.save(); c.lineWidth = 1.5 / z; c.strokeStyle = '#2563eb'; c.setLineDash([6 / z, 4 / z]);
  if (S.sels.length > 4) {                            // viele Objekte: nur ein gemeinsamer Rahmen
    const b = allBounds(S.sels), m = 6 / z;
    c.strokeRect(b[0] - m, b[1] - m, b[2] - b[0] + 2 * m, b[3] - b[1] + 2 * m); c.restore(); return;
  }
  for (const o of S.sels) {
    if (isBox(o)) { const [cx, cy] = center(o); c.save(); c.translate(cx, cy); c.rotate(o.rot || 0); c.strokeRect(-o.w / 2 - 3 / z, -o.h / 2 - 3 / z, o.w + 6 / z, o.h + 6 / z); c.restore(); }
    else { const b = objBounds(o), m = 4 / z; c.strokeRect(b[0] - m, b[1] - m, b[2] - b[0] + 2 * m, b[3] - b[1] + 2 * m); }
  }
  c.setLineDash([]);
  if (S.sels.length === 1 && (S.sels[0].type === 'line' || S.sels[0].type === 'arrow') && S.tool === 'select') {
    const o = S.sels[0], s = 10 / z; c.fillStyle = '#fff'; c.strokeStyle = '#2563eb'; c.lineWidth = 1.6 / z;
    for (const [x, y] of [[o.x1, o.y1], [o.x2, o.y2]]) { c.beginPath(); c.arc(x, y, s / 2, 0, 7); c.fill(); c.stroke(); }
  }
  if (S.sels.length === 1 && isBox(S.sels[0]) && S.tool === 'select') {
    const o = S.sels[0], [cx, cy] = center(o), s = 9 / z;
    c.save(); c.translate(cx, cy); c.rotate(o.rot || 0);
    c.fillStyle = '#fff'; c.strokeStyle = '#2563eb'; c.lineWidth = 1.6 / z;
    for (const [, sx, sy] of handleDefs(o)) { const x = sx * (o.w / 2 + 3 / z), y = sy * (o.h / 2 + 3 / z); c.fillRect(x - s / 2, y - s / 2, s, s); c.strokeRect(x - s / 2, y - s / 2, s, s); }
    const ry = -o.h / 2 - ROT_DIST / z;
    c.beginPath(); c.moveTo(0, -o.h / 2 - 3 / z); c.lineTo(0, ry); c.stroke();
    c.beginPath(); c.arc(0, ry, 6 / z, 0, 7); c.fill(); c.stroke();
    c.restore();
  }
  c.restore();
}

/* ---------- Laserpointer: roter Punkt folgt der Maus, nur ein ganz kurzer Schweif (nichts wird gespeichert) ---------- */
const LASER_FADE = 140;                               // ms – bewusst sehr kurz
function laserAlive() { const L = S.laser; return L.pts.length && performance.now() - L.pts[L.pts.length - 1].t < LASER_FADE; }
function drawLaser(c, z) {
  if (S.tool === 'laser' && curTpl() && curTpl().tools && curTpl().tools.laser) { S.laser.pts = []; drawPointerStick(c, z); return; }
  const L = S.laser, now = performance.now();
  L.pts = L.pts.filter(q => now - q.t < LASER_FADE);
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  for (let i = 1; i < L.pts.length; i++) {
    const a = L.pts[i - 1], b = L.pts[i], k = 1 - (now - b.t) / LASER_FADE;
    c.strokeStyle = L.color; c.globalAlpha = 0.5 * k; c.lineWidth = 8 * k / z;
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
  }
  if (L.active && L.pos) {
    const g = c.createRadialGradient(L.pos.x, L.pos.y, 0, L.pos.x, L.pos.y, 16 / z);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.22, L.color); g.addColorStop(1, 'rgba(255,0,0,0)');
    c.globalAlpha = 1; c.fillStyle = g; c.beginPath(); c.arc(L.pos.x, L.pos.y, 16 / z, 0, 7); c.fill();
  }
  c.restore();
  if (laserAlive()) renderOverlay();
}

/* ---------- Lineal (Bildschirm-Koordinaten, maßstabsgetreu) ---------- */
const RULER_H = 64;
function rulerLenPx() { return S.ruler.len * S.settings.pxPerCm; }
function drawRuler(c) {
  const r = S.ruler, L = rulerLenPx(), ppc = S.settings.pxPerCm, dark = themeDark();
  c.save(); c.translate(r.x, r.y); c.rotate(r.a);
  c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 8; c.shadowOffsetY = 2;
  const wood = !!curTpl();                              // bei historischen Tafeln: Holzlineal
  c.fillStyle = wood ? 'rgba(196,150,92,.96)' : dark ? 'rgba(86,84,60,.93)' : 'rgba(255,238,160,.93)'; c.fillRect(0, 0, L, RULER_H);
  c.shadowColor = 'transparent'; c.strokeStyle = wood ? '#4a2c12' : dark ? '#d8d2a0' : '#6b5e1b'; c.fillStyle = c.strokeStyle; c.lineWidth = 1;
  c.strokeRect(0.5, 0.5, L, RULER_H);
  c.beginPath();
  for (let mm = 0; mm <= r.len * 10; mm++) {
    const x = Math.round(mm * ppc / 10) + 0.5, len = mm % 10 === 0 ? 20 : mm % 5 === 0 ? 14 : 8;
    c.moveTo(x, 0); c.lineTo(x, len);
  }
  c.stroke();
  c.font = `12px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'top';
  for (let cm = 1; cm < r.len; cm++) c.fillText(String(cm), cm * ppc, 23);
  c.textAlign = 'left'; c.fillText('cm', 4, 23);
  c.textAlign = 'right'; c.fillText(Math.round(((deg(r.a) % 360) + 360) % 360) + '°', L - 8, RULER_H - 20);
  c.restore();
  const [kx, ky] = rulerKnob();
  c.save(); c.fillStyle = '#2563eb'; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(kx, ky, 9, 0, 7); c.fill(); c.stroke();
  c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.arc(kx, ky, 4, 0.3, 4.6); c.stroke(); c.restore();
}
function rulerKnob() { const r = S.ruler, L = rulerLenPx(), [x, y] = rotPt(L + 20, RULER_H / 2, r.a); return [r.x + x, r.y + y]; }
function rulerLocal(sx, sy) { const r = S.ruler; return rotPt(sx - r.x, sy - r.y, -r.a); }   // Bildschirmpunkt -> Lineal-Koordinaten

/* ---------- Zirkel ---------- */
function compassRadius() {                           // Radius in Board-Einheiten (physikalisch maßstäblich bei aktuellem Zoom)
  const L = S.compass.leg * S.settings.pxPerCm / S.view.z;
  return 2 * L * Math.sin(rad(S.compass.angle) / 2);
}
function compassTip() { const k = S.compass, r = compassRadius(); return [k.cx + r * Math.cos(k.tipA), k.cy + r * Math.sin(k.tipA)]; }
function drawCompass(c) {                            // altmodischer Holzzirkel mit Metallspitze und Grafitmine
  const k = S.compass; if (k.cx == null) return;
  const z = S.view.z, u = 1 / z, r = compassRadius(), L = k.leg * S.settings.pxPerCm / z;
  const [tx, ty] = compassTip(), px = k.cx, py = k.cy;
  const mx = (px + tx) / 2, my = (py + ty) / 2, dir = Math.atan2(ty - py, tx - px), hgt = Math.sqrt(Math.max(0, L * L - r * r / 4));
  const hx = mx + hgt * Math.cos(dir - Math.PI / 2), hy = my + hgt * Math.sin(dir - Math.PI / 2);
  const WOOD = '#b9803f', WOOD_E = '#6b4218', LIGHT = '#e6c58f', STEEL = '#c3cad2', STEEL_E = '#56606b';
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  c.setLineDash([4 * u, 5 * u]); c.strokeStyle = 'rgba(37,99,235,.55)'; c.lineWidth = 1.2 * u;      // Kreis-Vorschau
  c.beginPath(); c.arc(px, py, r, 0, 7); c.stroke(); c.setLineDash([]);
  const poly = (pts, fill, edge) => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = edge; c.lineWidth = 1 * u; c.stroke(); };
  const bar = (sx, sy, ex, ey, w0, w1, fill, edge) => {                       // sich verjüngender Stab
    const a = Math.atan2(ey - sy, ex - sx), nx = -Math.sin(a), ny = Math.cos(a);
    poly([[sx + nx * w0 / 2, sy + ny * w0 / 2], [ex + nx * w1 / 2, ey + ny * w1 / 2], [ex - nx * w1 / 2, ey - ny * w1 / 2], [sx - nx * w0 / 2, sy - ny * w0 / 2]], fill, edge);
    c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 2 * u; c.beginPath(); c.moveTo(sx + nx * w0 * .2, sy + ny * w0 * .2); c.lineTo(ex + nx * w1 * .2, ey + ny * w1 * .2); c.stroke();
  };
  const unit = (ax, ay, bx, by) => { const l = Math.hypot(bx - ax, by - ay) || 1; return [(bx - ax) / l, (by - ay) / l]; };
  // Nadelschenkel (Holz + Stahlspitze)
  let [dx, dy] = unit(hx, hy, px, py); const nl = 24 * u, nw = 3.4 * u;
  bar(hx, hy, px - dx * nl, py - dy * nl, 12 * u, 8 * u, WOOD, WOOD_E);
  poly([[px - dx * nl - dy * nw, py - dy * nl + dx * nw], [px - dx * nl + dy * nw, py - dy * nl - dx * nw], [px, py]], STEEL, STEEL_E);
  c.fillStyle = STEEL; c.strokeStyle = STEEL_E; c.lineWidth = 1 * u; c.beginPath(); c.arc(px - dx * nl, py - dy * nl, 4.6 * u, 0, 7); c.fill(); c.stroke();   // Metallzwinge
  // Bleistiftschenkel (Holz, angespitzt, Grafitkern)
  [dx, dy] = unit(hx, hy, tx, ty); const cl = 34 * u, gl = 9 * u;
  bar(hx, hy, tx - dx * cl, ty - dy * cl, 12 * u, 8 * u, WOOD, WOOD_E);
  const bx = tx - dx * cl, by = ty - dy * cl, gx = tx - dx * gl, gy = ty - dy * gl;
  poly([[bx - dy * 4 * u, by + dx * 4 * u], [bx + dy * 4 * u, by - dx * 4 * u], [gx + dy * 1.8 * u, gy - dx * 1.8 * u], [gx - dy * 1.8 * u, gy + dx * 1.8 * u]], LIGHT, WOOD_E);
  poly([[gx - dy * 1.8 * u, gy + dx * 1.8 * u], [gx + dy * 1.8 * u, gy - dx * 1.8 * u], [tx, ty]], '#3a3a3a', '#222');
  // Gelenk mit Schraube und Haltering
  const [ex, ey] = unit(mx, my, hx, hy);
  c.strokeStyle = STEEL_E; c.lineWidth = 6.5 * u; c.beginPath(); c.moveTo(hx + ex * 6 * u, hy + ey * 6 * u); c.lineTo(hx + ex * 20 * u, hy + ey * 20 * u); c.stroke();
  c.strokeStyle = STEEL; c.lineWidth = 4.5 * u; c.beginPath(); c.moveTo(hx + ex * 6 * u, hy + ey * 6 * u); c.lineTo(hx + ex * 20 * u, hy + ey * 20 * u); c.stroke();
  c.strokeStyle = STEEL_E; c.lineWidth = 2 * u; c.beginPath(); c.arc(hx + ex * 25 * u, hy + ey * 25 * u, 5 * u, 0, 7); c.stroke();
  c.fillStyle = STEEL; c.strokeStyle = STEEL_E; c.lineWidth = 1.2 * u; c.beginPath(); c.arc(hx, hy, 7.5 * u, 0, 7); c.fill(); c.stroke();
  c.strokeStyle = STEEL_E; c.lineWidth = 1.6 * u; c.beginPath(); c.moveTo(hx - 3.6 * u, hy - 3.6 * u); c.lineTo(hx + 3.6 * u, hy + 3.6 * u); c.stroke();
  // Greifpunkte
  c.lineWidth = 1.4 * u; c.strokeStyle = 'rgba(37,99,235,.8)'; c.beginPath(); c.arc(px, py, 9 * u, 0, 7); c.stroke();
  c.strokeStyle = 'rgba(220,38,38,.8)'; c.beginPath(); c.arc(tx, ty, 9 * u, 0, 7); c.stroke();
  c.restore();
}
