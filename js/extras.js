"use strict";
/* ===== Zusatzwerkzeuge: Geodreieck, Parabel, Leitungen ziehen, LaTeX-Formeln ===== */

/* ======================================================================
   Gemeinsam: gerade Kanten von Lineal und Geodreieck (Bildschirm-Koordinaten).
   Stift und Linie „rasten“ an einer Kante ein, wenn man nahe daran ansetzt.
   ====================================================================== */
function instEdges() {
  const out = [];
  if (S.ruler.on) { const r = S.ruler, L = rulerLenPx(), [ex, ey] = rotPt(L, 0, r.a); out.push({ a: [r.x, r.y], b: [r.x + ex, r.y + ey], out: -1, inside: 12 }); }
  if (S.geo.on) {
    const g = S.geo, L = geoLenPx(), P = (x, y) => { const [u, v] = rotPt(x, y, g.a); return [g.x + u, g.y + v]; };
    const A = P(-L / 2, 0), B = P(L / 2, 0), C = P(0, L / 2);
    out.push({ a: A, b: B, inside: 14 }, { a: B, b: C, inside: 14 }, { a: C, b: A, inside: 14 });
  }
  return out;
}
function edgeProj(e, sx, sy) {                       // Projektion auf die Kante: [Abstand, Parameter t, Punkt]
  const dx = e.b[0] - e.a[0], dy = e.b[1] - e.a[1], l2 = dx * dx + dy * dy, t = ((sx - e.a[0]) * dx + (sy - e.a[1]) * dy) / l2;
  const px = e.a[0] + clamp(t, 0, 1) * dx, py = e.a[1] + clamp(t, 0, 1) * dy;
  return [Math.hypot(sx - px, sy - py), t, [px, py]];
}
function instEdge(sx, sy) {                          // Kante in Reichweite des Zeigers (oder null)
  let best = null, bd = 22;
  for (const e of instEdges()) { const [d, t] = edgeProj(e, sx, sy); if (t > -0.02 && t < 1.02 && d < bd) { bd = d; best = e; } }
  return best;
}
function instSnapWorld(e, sx, sy) { const [, , [px, py]] = edgeProj(e, sx, sy); return scrToWorld(px, py); }

/* ======================================================================
   Geodreieck (maßstabsgetreu wie das Lineal, Bildschirm-Koordinaten)
   Ursprung = Nullpunkt in der Mitte der langen Kante, Spitze zeigt nach „unten“ (lokal +y).
   ====================================================================== */
const geoLenPx = () => S.geo.len * S.settings.pxPerCm;
function geoLocal(sx, sy) { const g = S.geo; return rotPt(sx - g.x, sy - g.y, -g.a); }
function geoKnob() { const g = S.geo, L = geoLenPx(), [u, v] = rotPt(0, L / 2 - 26, g.a); return [g.x + u, g.y + v]; }
function geoInside(sx, sy) { const [lx, ly] = geoLocal(sx, sy), L = geoLenPx(); return ly >= -2 && Math.abs(lx) <= L / 2 - ly + 2; }
function toggleGeo() {
  S.geo.on = !S.geo.on;
  if (S.geo.on && (S.geo.x < 0 || S.geo.x > innerWidth || S.geo.y < 0 || S.geo.y > innerHeight)) { S.geo.x = innerWidth / 2; S.geo.y = innerHeight / 3; }
  markDirty(); refreshUI(); render();
}
function geoDown(sx, sy) {
  const [kx, ky] = geoKnob();
  if (Math.hypot(sx - kx, sy - ky) <= 15) { drag = { k: 'gknob' }; return true; }
  if (!geoInside(sx, sy)) return false;
  const drawing = ['pen', 'line', 'arrow'].includes(S.tool);
  if (drawing) { const e = instEdge(sx, sy); if (e && edgeProj(e, sx, sy)[0] <= e.inside) return false; }   // nahe der Kante: dort zeichnen
  drag = { k: 'gmove', ox: sx - S.geo.x, oy: sy - S.geo.y }; return true;
}
function geoMove(sx, sy, e) {
  if (drag.k === 'gmove') { S.geo.x = sx - drag.ox; S.geo.y = sy - drag.oy; }
  else { let a = Math.atan2(sy - S.geo.y, sx - S.geo.x) - Math.PI / 2; const st = rad(15), n = Math.round(a / st) * st; if (e.shiftKey || Math.abs(a - n) < rad(1.5)) a = n; S.geo.a = a; }
}
function drawGeo(c) {
  const g = S.geo, L = geoLenPx(), ppc = S.settings.pxPerCm, dark = themeDark(), H = L / 2;
  const ink = dark ? '#cfe3ff' : '#123a6b';
  c.save(); c.translate(g.x, g.y); c.rotate(g.a);
  // Körper
  c.beginPath(); c.moveTo(-H, 0); c.lineTo(H, 0); c.lineTo(0, H); c.closePath();
  c.shadowColor = 'rgba(0,0,0,.28)'; c.shadowBlur = 10; c.shadowOffsetY = 2;
  c.fillStyle = dark ? 'rgba(120,160,210,.30)' : 'rgba(205,228,255,.62)'; c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = ink; c.lineWidth = 1.2; c.stroke();
  // Hilfslinien parallel zur langen Kante (alle 1 cm) und Lot im Nullpunkt
  c.save(); c.clip(); c.strokeStyle = dark ? 'rgba(207,227,255,.22)' : 'rgba(18,58,107,.16)'; c.lineWidth = 1; c.beginPath();
  for (let y = ppc; y < H; y += ppc) { c.moveTo(-H, y); c.lineTo(H, y); }
  c.moveTo(0, 0); c.lineTo(0, H); c.stroke(); c.restore();
  // cm-Skala auf der langen Kante, 0 in der Mitte
  c.strokeStyle = ink; c.fillStyle = ink; c.lineWidth = 1; c.beginPath();
  const n = Math.floor(H / ppc * 10);
  for (let mm = -n; mm <= n; mm++) { const x = Math.round(mm * ppc / 10) + 0.5, l = mm % 10 === 0 ? 14 : mm % 5 === 0 ? 10 : 6; c.moveTo(x, 0); c.lineTo(x, l); }
  c.stroke();
  c.font = `11px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'top';
  for (let cm = -Math.floor(H / ppc); cm <= Math.floor(H / ppc); cm++) if (cm && Math.abs(cm * ppc) < H - 8) c.fillText(String(Math.abs(cm)), cm * ppc, 16);
  c.fillText('0', 0, 16);
  // Winkelskala (Halbkreis um den Nullpunkt)
  const R = L * 0.31; c.beginPath();
  for (let d = 0; d <= 180; d++) {
    const a = rad(180 + d), l = d % 10 === 0 ? 11 : d % 5 === 0 ? 7 : 4, cs = Math.cos(a), sn = -Math.sin(a);
    c.moveTo(cs * R, sn * R); c.lineTo(cs * (R - l), sn * (R - l));
  }
  c.stroke();
  c.font = `10px ${FONT}`; c.textBaseline = 'middle';
  for (let d = 10; d < 180; d += 10) {
    const a = rad(180 + d), cs = Math.cos(a), sn = -Math.sin(a);
    c.fillText(String(d), cs * (R - 20), sn * (R - 20));
    c.globalAlpha = 0.6; c.fillText(String(180 - d), cs * (R - 33), sn * (R - 33)); c.globalAlpha = 1;
  }
  c.beginPath(); c.arc(0, 0, 3, 0, 7); c.fill();
  // Winkelanzeige
  c.font = `600 12px ${FONT}`; c.fillText(Math.round(((deg(-g.a) % 360) + 360) % 360) + '°', 0, H - 50);
  c.restore();
  const [kx, ky] = geoKnob();
  c.save(); c.fillStyle = '#2563eb'; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(kx, ky, 9, 0, 7); c.fill(); c.stroke();
  c.lineWidth = 1.5; c.beginPath(); c.arc(kx, ky, 4, 0.3, 4.6); c.stroke(); c.restore();
}

/* ======================================================================
   Parabel: am Scheitelpunkt ansetzen und zu einem Kurvenpunkt ziehen.
   ====================================================================== */
function makeParab(v, p, horiz) {
  const du = horiz ? p.y - v.y : p.x - v.x, dv = horiz ? p.x - v.x : p.y - v.y;
  if (Math.abs(du) < 4 / S.view.z) return null;
  const k = dv / (du * du), N = 120, pts = [];
  for (let i = 0; i <= N; i++) { const t = -Math.abs(du) + 2 * Math.abs(du) * i / N, s = k * t * t; pts.push(horiz ? [v.x + s, v.y + t] : [v.x + t, v.y + s]); }
  const a = -k * S.settings.pxPerCm * (horiz ? -1 : 1);       // y = a·x² in cm (y nach oben positiv)
  S.parabInfo = { x: p.x, y: p.y, a, horiz, v };
  return { type: 'pen', kind: 'plain', pts, c: S.style.color, w: S.style.width, ls: S.style.ls };
}
const fmtNum = x => (Math.abs(x) >= 100 ? x.toFixed(0) : Math.abs(x) >= 10 ? x.toFixed(1) : x.toFixed(2)).replace('.', ',');

/* ======================================================================
   Leitungen ziehen (Elektronik): Klick – Klick – … rechtwinklig, rastet an Anschlüssen ein.
   ====================================================================== */
function wireSnap(p) {
  const m = magnetPoint(p);
  if (m) return { x: m.x, y: m.y, hit: true };
  const tol = 9 / S.view.z;                              // auf eine bestehende Leitung (T-Abzweig)
  for (const o of S.objs) if (o.type === 'line' && distSeg(p.x, p.y, o.x1, o.y1, o.x2, o.y2) <= tol) {
    const dx = o.x2 - o.x1, dy = o.y2 - o.y1, t = clamp(((p.x - o.x1) * dx + (p.y - o.y1) * dy) / (dx * dx + dy * dy), 0, 1);
    let x = o.x1 + t * dx, y = o.y1 + t * dy; if (dx === 0) y = Math.round(y / gridStep()) * gridStep(); if (dy === 0) x = Math.round(x / gridStep()) * gridStep();
    return { x, y, hit: true, onWire: true };
  }
  const g = gridStep(); return { x: Math.round(p.x / g) * g, y: Math.round(p.y / g) * g, hit: false };
}
function elbow(a, b, firstH, straight) {
  if (straight || a.x === b.x || a.y === b.y) return [[a.x, a.y, b.x, b.y]];
  const m = firstH ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
  return [[a.x, a.y, m.x, m.y], [m.x, m.y, b.x, b.y]];
}
const wireLine = s => ({ type: 'line', x1: s[0], y1: s[1], x2: s[2], y2: s[3], c: S.style.color, w: 2.5, ls: 'solid' });
function wireDown(p, pre, e) {
  const q = wireSnap(p), W = S.wire;
  if (!W) { S.wire = { pre, start: q, last: q, segs: [] }; S.snapHint = q.hit ? q : null; renderOverlay(); return; }
  if (Math.abs(q.x - W.last.x) < 0.5 && Math.abs(q.y - W.last.y) < 0.5) { wireFinish(); return; }   // gleicher Punkt / Doppelklick = fertig
  const dx = q.x - W.last.x, dy = q.y - W.last.y;
  for (const s of elbow(W.last, q, Math.abs(dx) >= Math.abs(dy), e.shiftKey)) if (s[0] !== s[2] || s[1] !== s[3]) W.segs.push(wireLine(s));
  W.last = q;
  if (q.hit) wireFinish();                               // an Anschluss/Leitung angekommen
  else renderOverlay();
}
function needsDot(pt, ignore) {                         // Knotenpunkt nötig? (T-Abzweig oder ≥3 Verbindungen)
  let ends = 0; const eq = (x, y) => Math.abs(x - pt.x) < 0.5 && Math.abs(y - pt.y) < 0.5;
  for (const o of S.objs) {
    if (ignore.includes(o)) continue;
    if (o.type === 'symbol' && o.sym === 'junction' && eq(o.x + o.w / 2, o.y + o.h / 2)) return false;
    if (o.type === 'line') {
      if (eq(o.x1, o.y1) || eq(o.x2, o.y2)) ends++;
      else if (distSeg(pt.x, pt.y, o.x1, o.y1, o.x2, o.y2) < 0.5) return true;
    }
    if (o.type === 'symbol' && SYM[o.sym]) SYM[o.sym].pins.forEach((_, i) => { const [x, y] = pinWorld(o, i); if (eq(x, y)) ends++; });
  }
  return ends >= 2;
}
function wireFinish() {
  const W = S.wire; if (!W) return; S.wire = null; S.wireHover = null; S.snapHint = null;
  if (!W.segs.length) { renderOverlay(); return; }
  W.segs.forEach(o => S.objs.push(o));
  for (const pt of [W.start, W.last]) if (needsDot(pt, W.segs)) S.objs.push(makeSymObj('junction', pt, 0));
  record(W.pre);
}
function wirePreview() {
  const W = S.wire, hv = S.wireHover; if (!W) return [];
  const out = W.segs.slice();
  if (hv) { const dx = hv.x - W.last.x, dy = hv.y - W.last.y; for (const s of elbow(W.last, hv, Math.abs(dx) >= Math.abs(dy), hv.straight)) out.push(wireLine(s)); }
  return out;
}

/* ---------- Hooks für Zeichnen, Mauszeiger und Bewegung ohne gedrückte Taste ---------- */
function drawInstruments(c, z) {
  if (S.tool === 'wire') {
    c.save(); c.globalAlpha = 0.9; wirePreview().forEach(o => drawObj(c, o)); c.restore();
    if (S.wire) { c.save(); c.fillStyle = '#2563eb'; c.beginPath(); c.arc(S.wire.start.x, S.wire.start.y, 4 / z, 0, 7); c.fill(); c.restore(); }
  }
  if (S.parabInfo && drag && drag.k === 'parab' && S.draft) {
    const P = S.parabInfo, t = (P.horiz ? 'x = ' : 'y = ') + fmtNum(P.a) + (P.horiz ? ' · y²' : ' · x²');
    c.save(); c.font = `${14 / z}px ${FONT}`; c.textBaseline = 'bottom';
    const w = c.measureText(t).width, x = P.x + 12 / z, y = P.y - 10 / z;
    c.fillStyle = themeDark() ? 'rgba(30,31,34,.9)' : 'rgba(255,255,255,.92)'; c.fillRect(x - 4 / z, y - 18 / z, w + 8 / z, 22 / z);
    c.fillStyle = '#2563eb'; c.fillText(t, x, y);
    c.beginPath(); c.arc(P.v.x, P.v.y, 4 / z, 0, 7); c.fill(); c.restore();
  }
}
function drawScreenTools(c) { if (window.drawTplFrame) drawTplFrame(c); if (S.geo.on) drawGeo(c); }
function hoverTools(e) {
  if (S.tool === 'wire') { const q = wireSnap(toWorld(e)); q.straight = e.shiftKey; S.wireHover = q; S.snapHint = q.hit ? q : null; renderOverlay(); }
}
function toolCursor() { if (S.tool === 'wire' || S.tool === 'parab') return 'crosshair'; return null; }

/* ---------- Eigenschaften-Leiste ---------- */
function extraProps() {
  const kids = [], t = S.tool;
  if (t === 'parab') {
    const ax = S.style.parabAxis || 'v';
    kids.push(h('h3', {}, 'Achse'), h('div', { class: 'seg' }, [['v', 'Senkrecht'], ['h', 'Waagerecht']].map(([v, l]) => h('button', { class: ax === v ? 'on' : '', onclick: () => { S.style.parabAxis = v; refreshUI(); } }, l))),
      hint('Am Scheitel ansetzen und zum Kurvenpunkt ziehen. Umschalt wechselt die Achse.'));
  }
  if (t === 'wire') kids.push(hint('Am Anschluss klicken, Eckpunkte setzen. Endet an Anschluss oder Leitung. Esc beendet.'));
  if ((t === 'text' || t === 'note' || (S.sels.length && S.sels.every(x => x.type === 'text' || x.type === 'note' || x.type === 'symbol'))) && S.tool !== 'pen')
    kids.push(...(S.settings.hints === false ? [] : [h('h3', {}, 'Formeln'), hint('Formeln zwischen $…$, z. B. $U = R \\cdot I$')]));
  if (S.geo.on) {
    const ov = h('span', {}, S.geo.len + ' cm');
    kids.push(h('h3', {}, 'Geodreieck'), h('div', { class: 'row' }, h('input', { type: 'range', min: '10', max: '40', value: S.geo.len, oninput: e => { S.geo.len = +e.target.value; ov.textContent = S.geo.len + ' cm'; renderOverlay(); } }), ov),
      hint('Blauer Knopf dreht. An einer Kante zeichnen ergibt gerade Linien.'));
  }
  return kids;
}

/* ======================================================================
   LaTeX: Formeln zwischen $…$ werden mit MathJax (liegt offline in lib/) gesetzt.
   Normaler Text daneben bleibt in der gewählten Schrift.
   ====================================================================== */
const MJ = { state: 'idle', cache: new Map() };
function hasMath(s) { return typeof s === 'string' && /\$[^$\n]+\$/.test(s); }
function loadMathJax() {
  if (MJ.state !== 'idle') return; MJ.state = 'loading';
  window.MathJax = {
    loader: { load: [] }, tex: { packages: { '[+]': ['ams', 'newcommand', 'boldsymbol'] } }, svg: { fontCache: 'none' },
    startup: { typeset: false, ready() { MathJax.startup.defaultReady(); MJ.state = 'ready'; MJ.cache.clear(); for (const o of S.objs) if (o.type === 'text') measureTextObj(o); render();
      setTimeout(() => { builtinCircuits = null; if (S.elecOpen && S.elecTab === 'circuits') buildElec(); }, 400); } }
  };
  const sc = document.createElement('script'); sc.src = 'lib/mathjax/tex-svg-full.js'; sc.async = true;
  sc.onerror = () => { MJ.state = 'failed'; toast('Formel-Darstellung konnte nicht geladen werden.'); };
  document.head.append(sc);
}
function mathImg(tex, size, color) {                 // → {img, w, asc, desc} oder null (noch nicht bereit)
  if (MJ.state !== 'ready') { loadMathJax(); return null; }
  const key = tex + '|' + size + '|' + color; let r = MJ.cache.get(key); if (r) return r;
  try {
    const svg = MathJax.tex2svg('\\displaystyle ' + tex, { display: false }).querySelector('svg');   // große Brüche wie an der Tafel
    const vb = svg.getAttribute('viewBox').split(/\s+/).map(Number), k = size / 1000;
    const w = vb[2] * k, hh = vb[3] * k, asc = -vb[1] * k;
    svg.setAttribute('width', w); svg.setAttribute('height', hh); svg.removeAttribute('style');
    if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.outerHTML.replace(/currentColor/g, color));
    const img = new Image(); img.onload = () => { r.ok = true; render(); }; img.src = src;
    r = { img, w, asc, desc: hh - asc, ok: false };
  } catch (e) { console.error(e); r = { w: 0, asc: 0, desc: 0, bad: true }; }
  MJ.cache.set(key, r); return r;
}
function richLine(c, line, size, color, font) {       // Zeile in Text- und Formelteile zerlegen und messen
  const parts = line.split('$'), segs = []; let w = 0, asc = size * 0.92, desc = size * 0.28, ready = true;
  c.font = font;
  parts.forEach((p, i) => {
    if (!p) return;
    if (i % 2 === 1 && i < parts.length - 1) {
      const m = mathImg(p, size, color);
      if (!m) { ready = false; const tw = c.measureText('$' + p + '$').width; segs.push({ text: '$' + p + '$', w: tw }); w += tw; return; }
      segs.push({ m, w: m.w }); w += m.w; asc = Math.max(asc, m.asc); desc = Math.max(desc, m.desc);
    } else { const t = i % 2 === 1 ? '$' + p : p, tw = c.measureText(t).width; segs.push({ text: t, w: tw }); w += tw; }
  });
  return { segs, w, asc, desc, ready };
}
function richLayout(c, text, size, color, font) {
  const lines = String(text).split('\n').map(l => richLine(c, l, size, color, font));
  let y = 0; for (const L of lines) { L.base = y + Math.max(L.asc, size * 0.92) + 1; y = L.base + Math.max(L.desc, size * 0.33); }
  return { lines, w: Math.max(24, ...lines.map(l => l.w)) + 4, h: y + 2 };
}
function drawRich(c, lay, x0, y0, color, font) {
  c.save(); c.font = font; c.fillStyle = color; c.textBaseline = 'alphabetic';
  for (const L of lay.lines) {
    let x = x0;
    for (const s of L.segs) {
      if (s.m) { if (s.m.ok) c.drawImage(s.m.img, x, y0 + L.base - s.m.asc, s.m.w, s.m.asc + s.m.desc); }
      else c.fillText(s.text, x, y0 + L.base);
      x += s.w;
    }
  }
  c.restore();
}
