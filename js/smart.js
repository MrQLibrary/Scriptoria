"use strict";
/* ===== Formerkennung, Präsentationsfenster, Stoppuhr, Funktionsplotter, Zeigerdiagramm, Diagramm-Vorlagen ===== */

/* ======================================================================
   Formerkennung: Stift am Ende kurz stillhalten → saubere Form
   ====================================================================== */
const SHAPE_HOLD = 550;
function shapeHold(sx, sy) {                             // bei jeder Bewegung während des Zeichnens aufrufen
  if (S.settings.shapes === false || !drag || drag.k !== 'draw' || drag.snapR || !S.draft || ['wedge'].includes(S.draft.kind)) return;
  if (drag.hp && Math.hypot(sx - drag.hp[0], sy - drag.hp[1]) < 5) return;   // leichtes Zittern ignorieren
  drag.hp = [sx, sy]; clearTimeout(drag.ht);
  drag.ht = setTimeout(() => { if (drag && drag.k === 'draw') { const r = recognizeShape(S.draft); if (r) { drag.k = 'drawShape'; S.draft = r[0]; renderOverlay(); } } }, SHAPE_HOLD);
}
function rdp(pts, eps) {                                  // Linienzug vereinfachen (Ramer-Douglas-Peucker)
  if (pts.length < 3) return pts.slice();
  const [a, b] = [pts[0], pts[pts.length - 1]]; let dm = 0, im = 0;
  for (let i = 1; i < pts.length - 1; i++) { const d = distSeg(pts[i][0], pts[i][1], a[0], a[1], b[0], b[1]); if (d > dm) { dm = d; im = i; } }
  if (dm <= eps) return [a, b];
  return [...rdp(pts.slice(0, im + 1), eps).slice(0, -1), ...rdp(pts.slice(im), eps)];
}
function recognizeShape(o) {
  const p = o.pts.map(q => [q[0], q[1]]); if (p.length < 5) return null;
  let len = 0; for (let i = 1; i < p.length; i++) len += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  if (len < 25 / S.view.z) return null;
  const b = allBounds([{ type: 'pen', pts: p, w: 0 }]), W = b[2] - b[0], H = b[3] - b[1], size = Math.max(W, H);
  let lw = o.w; if (o.kind === 'pencil') lw = Math.max(1, o.w * 0.75); else if (o.kind === 'marker') lw = o.w * 1.5;
  const base = { c: o.c, ls: o.ls || 'solid' }, A = p[0], Z = p[p.length - 1];
  const closed = Math.hypot(A[0] - Z[0], A[1] - Z[1]) < Math.max(0.22 * size, 12 / S.view.z);
  if (!closed) {                                          // gerade Linie?
    const dev = Math.max(...p.map(q => distSeg(q[0], q[1], A[0], A[1], Z[0], Z[1]))), L = Math.hypot(Z[0] - A[0], Z[1] - A[1]);
    if (L > 0 && dev < 0.07 * L) {
      let a = Math.atan2(Z[1] - A[1], Z[0] - A[0]); const st = rad(15), n = Math.round(a / st) * st; if (Math.abs(a - n) < rad(4)) a = n;
      return [{ type: 'line', x1: A[0], y1: A[1], x2: A[0] + L * Math.cos(a), y2: A[1] + L * Math.sin(a), w: lw, ...base }];
    }
    return null;
  }
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, rx = W / 2, ry = H / 2;
  // Ellipse/Kreis: normierter Abstand ≈ 1
  const er = p.map(q => Math.hypot((q[0] - cx) / (rx || 1), (q[1] - cy) / (ry || 1))), em = er.reduce((s, v) => s + v, 0) / er.length;
  const esd = Math.sqrt(er.reduce((s, v) => s + (v - em) ** 2, 0) / er.length);
  const poly = rdp([...p, p[0]], size * 0.09); const corners = poly.length - 1;
  if (corners === 3) return [{ type: 'pen', kind: 'plain', pts: [...poly.slice(0, 3), poly[0]].map(q => [q[0], q[1]]), w: lw, ...base }];
  if (corners === 4 && esd > 0.06) {
    const ang = []; for (let i = 0; i < 4; i++) { const a = poly[i], b2 = poly[(i + 1) % 4]; ang.push(Math.atan2(b2[1] - a[1], b2[0] - a[0])); }
    const axis = ang.every(a => { const m = ((a % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2); return Math.min(m, Math.PI / 2 - m) < rad(14); });
    if (axis) return [{ type: 'rect', x: b[0], y: b[1], w: W, h: H, rot: 0, sw: lw, fill: false, ...base }];
    return [{ type: 'pen', kind: 'plain', pts: [...poly.slice(0, 4), poly[0]].map(q => [q[0], q[1]]), w: lw, ...base }];
  }
  if (esd < 0.11) {
    let w = W, hh = H; if (Math.abs(W - H) < 0.15 * Math.max(W, H)) w = hh = (W + H) / 2;   // fast rund → Kreis
    return [{ type: 'ellipse', x: cx - w / 2, y: cy - hh / 2, w, h: hh, rot: 0, sw: lw, fill: false, ...base }];
  }
  return null;
}

/* ======================================================================
   Präsentationsfenster: zweites Fenster (z. B. auf dem Beamer) zeigt nur die Fläche, live
   ====================================================================== */
const PRESENT = { ch: null, win: null, sentImgs: new Set(), lastBase: 0 };
const IS_PRESENTER_VIEW = new URLSearchParams(location.search).get('present') === '1';
function presentChannel() {
  if (!PRESENT.ch && 'BroadcastChannel' in window) {
    PRESENT.ch = new BroadcastChannel('scriptoria-present');
    if (!IS_PRESENTER_VIEW) PRESENT.ch.onmessage = ev => { if (ev.data && ev.data.t === 'hello') { PRESENT.sentImgs.clear(); presentSend(true); } };
  }
  return PRESENT.ch;
}
function presentDirty() { PRESENT.dirtyBase = true; }
async function openPresentation() {
  const url = 'index.html?present=1';
  let feat = 'popup=yes,width=1280,height=760';
  try {                                                  // Edge/Chrome: wenn möglich direkt auf den zweiten Bildschirm
    if ('getScreenDetails' in window) { const sd = await getScreenDetails(); const o = sd.screens.find(s => s !== sd.currentScreen); if (o) feat = `popup=yes,left=${o.availLeft},top=${o.availTop},width=${o.availWidth},height=${o.availHeight}`; }
  } catch (e) { }
  PRESENT.win = window.open(url, 'scriptoria-praesentation', feat);
  if (!PRESENT.win) { toast('Das Fenster wurde blockiert. Bitte Pop-ups für diese Seite erlauben.', 6000); return; }
  PRESENT.sentImgs.clear(); presentChannel(); setTimeout(() => presentSend(true), 800);
  hintToast('Präsentationsfenster geöffnet: auf den Beamer ziehen und dort doppelklicken für Vollbild.', 5000);
}
function presentActive() { return PRESENT.win && !PRESENT.win.closed && PRESENT.ch; }
function presentSend(full) {                             // nach jedem Neuzeichnen aufrufen
  if (!presentActive()) return;
  const now = performance.now();
  const msg = { t: 'ov', view: S.view, w: innerWidth, h: innerHeight, draft: S.draft, laser: S.tool === 'laser' && S.laser.active ? { pos: S.laser.pos, pts: S.laser.pts.slice(-40), color: S.laser.color } : null, dark: themeDark() };
  if (full || PRESENT.dirtyBase) {
    PRESENT.dirtyBase = false;
    const imgs = {}; for (const o of S.objs) if (o.type === 'image' && !PRESENT.sentImgs.has(o.id) && S.imgs[o.id]) { imgs[o.id] = S.imgs[o.id]; PRESENT.sentImgs.add(o.id); }
    Object.assign(msg, { t: 'all', objs: S.objs, imgs, bg: S.bg, grid: S.settings.grid && !curTpl(), settings: { gridType: S.settings.gridType, gridWeight: S.settings.gridWeight, gridSize: S.settings.gridSize } });
  }
  try { PRESENT.ch.postMessage(msg); } catch (e) { console.error(e); }
}
function bootPresenterView() {                           // läuft im zweiten Fenster
  document.body.classList.add('presenter', 'in-editor', 'nopanels');
  S.screen = 'editor'; $('#home').hidden = true; $('#editor').hidden = false; S.tool = 'hand';
  const ch = presentChannel(); let remote = null;
  const fitRemote = () => {                              // gleichen Ausschnitt wie beim Vortragenden zeigen, an die Fenstergröße angepasst
    if (!remote) return; const v = remote.view, k = Math.min(innerWidth / remote.w, innerHeight / remote.h);
    const cxw = (remote.w / 2 - v.x) / v.z, cyw = (remote.h / 2 - v.y) / v.z, z = v.z * k;
    S.view = { z, x: innerWidth / 2 - cxw * z, y: innerHeight / 2 - cyw * z };
  };
  ch.onmessage = ev => {
    const m = ev.data; remote = m;
    if (m.t === 'all') { S.objs = m.objs; Object.assign(S.imgs, m.imgs || {}); S.bg = m.bg; S.settings.grid = m.grid; Object.assign(S.settings, m.settings || {}); for (const o of S.objs) if (o.type === 'text') measureTextObj(o); }
    S.draft = m.draft; if (m.laser) { S.laser.active = true; S.laser.pos = m.laser.pos; S.laser.pts = m.laser.pts.map(q => ({ ...q, t: performance.now() - 200 })); S.laser.color = m.laser.color; } else S.laser.active = false;
    document.body.classList.toggle('dark', m.dark); document.body.classList.toggle('light', !m.dark);
    fitRemote(); if (m.t === 'all') render(); else renderOverlay();
  };
  addEventListener('resize', () => { resizeBoard(); fitRemote(); render(); });
  addEventListener('dblclick', () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => { }); });
  resizeBoard(); ch.postMessage({ t: 'hello' });
}

/* ======================================================================
   Stoppuhr (und Countdown)
   ====================================================================== */
const TIMER = { run: false, t0: 0, acc: 0, down: 0, iv: 0 };
function toggleTimer() { S.timerOpen = !S.timerOpen; buildTimer(); refreshUI(); }
function timerMs() { const e = TIMER.acc + (TIMER.run ? performance.now() - TIMER.t0 : 0); return TIMER.down ? Math.max(0, TIMER.down - e) : e; }
function fmtTime(ms) { const s = Math.floor(ms / 1000), m = Math.floor(s / 60); return (m < 10 ? '0' : '') + m + ':' + String(s % 60).padStart(2, '0'); }
function buildTimer() {
  let el = $('#timer');
  if (!S.timerOpen) { if (el) el.remove(); clearInterval(TIMER.iv); return; }
  if (!el) { el = h('div', { id: 'timer', class: 'panel' }); $('#editor').append(el); }
  const disp = h('div', { class: 'tdisp' }, fmtTime(timerMs()));
  const startStop = h('button', { class: 'btn sm primary', onclick: () => { if (TIMER.run) { TIMER.acc += performance.now() - TIMER.t0; TIMER.run = false; } else { TIMER.t0 = performance.now(); TIMER.run = true; } buildTimer(); } }, TIMER.run ? 'Pause' : 'Start');
  const reset = h('button', { class: 'btn sm', onclick: () => { TIMER.run = false; TIMER.acc = 0; buildTimer(); } }, 'Zurück');
  const mode = h('select', { onchange: e => { TIMER.down = +e.target.value * 60000; TIMER.run = false; TIMER.acc = 0; buildTimer(); } },
    [['0', 'Stoppuhr'], ['1', '1 min'], ['3', '3 min'], ['5', '5 min'], ['10', '10 min'], ['15', '15 min'], ['20', '20 min']].map(([v, l]) => h('option', { value: v, selected: TIMER.down === +v * 60000 }, l)));
  el.replaceChildren(disp, h('div', { class: 'trow' }, startStop, reset, mode), h('button', { class: 'tb tclose', title: 'Schließen', onclick: toggleTimer }, '✕'));
  clearInterval(TIMER.iv);
  TIMER.iv = setInterval(() => {
    const ms = timerMs(); disp.textContent = fmtTime(ms);
    if (TIMER.down && TIMER.run && ms <= 0) { TIMER.run = false; TIMER.acc = TIMER.down; el.classList.add('done'); setTimeout(() => el.classList.remove('done'), 4000); buildTimer(); }
  }, 250);
}

/* ======================================================================
   Formel-Auswertung ohne eval (sicher, funktioniert mit strenger Content-Security-Policy)
   ====================================================================== */
function parseExpr(src) {
  const s = src.replace(/,/g, '.').replace(/\s+/g, '').replace(/·|⋅|×/g, '*').replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/²/g, '^2').replace(/³/g, '^3').toLowerCase();
  let i = 0;
  const FN = { sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    exp: Math.exp, ln: Math.log, log: Math.log10, lg: Math.log10, sqrt: Math.sqrt, wurzel: Math.sqrt, abs: Math.abs, sgn: Math.sign, sign: Math.sign };
  const C = { pi: () => Math.PI, e: () => Math.E }, FNS = Object.keys(FN).sort((a, b) => b.length - a.length);
  const peek = () => s[i], eat = c => { if (s[i] === c) { i++; return true; } return false; };
  function expr() { let f = term(); for (;;) { if (eat('+')) { const a = f, b = term(); f = v => a(v) + b(v); } else if (eat('-')) { const a = f, b = term(); f = v => a(v) - b(v); } else return f; } }
  function term() { let f = unary(); for (;;) {
    if (eat('*')) { const a = f, b = unary(); f = v => a(v) * b(v); } else if (eat('/')) { const a = f, b = unary(); f = v => a(v) / b(v); }
    else if (peek() && /[a-z0-9(.]/.test(peek())) { const a = f, b = unary(); f = v => a(v) * b(v); }     // 2x, 3sin(x), (x+1)(x-1)
    else return f; } }
  function unary() { if (eat('-')) { const a = unary(); return v => -a(v); } if (eat('+')) return unary(); return power(); }
  function power() { const b = atom(); if (eat('^')) { const e = unary(); return v => Math.pow(b(v), e(v)); } return b; }
  function atom() {
    if (eat('(')) { const f = expr(); if (!eat(')')) throw new Error('„)“ fehlt'); return f; }
    const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(s.slice(i)); if (m) { i += m[0].length; const n = parseFloat(m[0]); return () => n; }
    const w = /^[a-z]+/.exec(s.slice(i)); if (!w) throw new Error('Unerwartetes Zeichen bei „' + s.slice(i, i + 5) + '“');
    const id = w[0];
    for (const k of FNS) if (id.startsWith(k)) { i += k.length; const fn = FN[k], arg = s[i] === '(' ? atom() : power(); return v => fn(arg(v)); }
    if (id.startsWith('pi')) { i += 2; return C.pi; }
    i += 1;
    if (id[0] === 'x' || id[0] === 't') return v => v;
    if (id[0] === 'e') return C.e;
    throw new Error('Unbekannt: „' + id + '“ (erlaubt: x, pi, e, sin, cos, tan, exp, ln, log, sqrt, abs …)');
  }
  const f = expr(); if (i < s.length) throw new Error('Unerwartet: „' + s.slice(i) + '“');
  return f;
}

/* ---------- Bausteine für Achsen und Raster (als normale, bearbeitbare Objekte) ---------- */
const G = {
  line: (x1, y1, x2, y2, w = 1.4, c = '@ink', ls = 'solid') => ({ type: 'line', x1, y1, x2, y2, c, w, ls }),
  arrow: (x1, y1, x2, y2, w = 2, c = '@ink') => ({ type: 'arrow', x1, y1, x2, y2, c, w, ls: 'solid' }),
  text: (x, y, t, size = 15, c = '@ink', align = 'center') => { const o = { type: 'text', x, y, w: 0, h: 0, rot: 0, text: t, size, c, font: S.style.font || 'Segoe UI' }; measureTextObj(o); o.x = align === 'center' ? x - o.w / 2 : align === 'right' ? x - o.w : x; o.y = y - o.h / 2; return o; }
};
const niceStep = r => { const raw = r / 8, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; };
const fmtTick = v => { const r = Math.round(v * 1e6) / 1e6; return String(r).replace('.', ','); };
function axesObjs({ x0, x1, y0, y1, U, xl = 'x', yl = 'y', grid = true }) {           // U = Board-Einheiten pro Achseneinheit
  const out = [], X = v => v * U, Y = v => -v * U, sx = niceStep(x1 - x0), sy = niceStep(y1 - y0), gc = '#9aa3ad';
  if (grid) {
    for (let v = Math.ceil(x0 / sx) * sx; v <= x1 + 1e-9; v += sx) if (Math.abs(v) > 1e-9) out.push(G.line(X(v), Y(y0), X(v), Y(y1), 0.8, gc));
    for (let v = Math.ceil(y0 / sy) * sy; v <= y1 + 1e-9; v += sy) if (Math.abs(v) > 1e-9) out.push(G.line(X(x0), Y(v), X(x1), Y(v), 0.8, gc));
  }
  const ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);
  out.push(G.arrow(X(x0), Y(ax), X(x1) + 22, Y(ax)), G.arrow(X(ay), Y(y0), X(ay), Y(y1) - 22));
  for (let v = Math.ceil(x0 / sx) * sx; v <= x1 + 1e-9; v += sx) if (Math.abs(v) > 1e-9) { out.push(G.line(X(v), Y(ax) - 5, X(v), Y(ax) + 5, 1.4)); out.push(G.text(X(v), Y(ax) + 16, fmtTick(v), 12)); }
  for (let v = Math.ceil(y0 / sy) * sy; v <= y1 + 1e-9; v += sy) if (Math.abs(v) > 1e-9) { out.push(G.line(X(ay) - 5, Y(v), X(ay) + 5, Y(v), 1.4)); out.push(G.text(X(ay) - 9, Y(v), fmtTick(v), 12, '@ink', 'right')); }
  out.push(G.text(X(x1) + 30, Y(ax) - 16, xl, 16), G.text(X(ay) + 16, Y(y1) - 30, yl, 16, '@ink', 'left'));
  return out;
}
function placeGroup(list, label) {                       // Gruppe in die Bildschirmmitte setzen und auswählen
  const b = allBounds(list), c = viewCenter(), pre = snapshot();
  list.forEach(o => moveObj(o, c.x - (b[0] + b[2]) / 2, c.y - (b[1] + b[3]) / 2));
  S.objs.push(...list); setTool('select'); S.sels = list; record(pre); refreshUI(); render();
  if (label) hintToast(label + ' eingefügt. Alles ist ausgewählt und lässt sich verschieben.', 3000);
}

/* ======================================================================
   Funktionsplotter & Koordinatensystem
   ====================================================================== */
async function openPlotDialog() {
  const P = S.plotPrefs || (S.plotPrefs = { f: 'sin(x)', f2: '', x0: -6.3, x1: 6.3, y0: -1.5, y1: 1.5, cm: 1.5, grid: true, xl: 'x', yl: 'y' });
  const inp = (v, w = '90px', type = 'text') => h('input', { type, value: v, style: `width:${w}` });
  const f = inp(P.f, '100%'), f2 = inp(P.f2, '100%'), x0 = inp(P.x0, '70px'), x1 = inp(P.x1, '70px'), y0 = inp(P.y0, '70px'), y1 = inp(P.y1, '70px'), cm = inp(P.cm, '70px'), xl = inp(P.xl, '60px'), yl = inp(P.yl, '60px');
  const grid = h('input', { type: 'checkbox', checked: P.grid }), err = h('p', { class: 'err' });
  const body = [
    h('div', { class: 'frow' }, h('label', {}, 'f(x) ='), f), h('div', { class: 'frow' }, h('label', {}, 'g(x) ='), f2),
    hint('Leer lassen für ein leeres Koordinatensystem. Beispiele: 2*sin(x - pi/4), x^2 - 1, exp(-x)*cos(5x), sqrt(x)'),
    h('div', { class: 'frow' }, h('label', {}, 'x von … bis'), x0, x1), h('div', { class: 'frow' }, h('label', {}, 'y von … bis'), y0, y1),
    h('div', { class: 'frow' }, h('label', {}, 'cm pro Einheit'), cm), h('div', { class: 'frow' }, h('label', {}, 'Achsen'), xl, yl),
    h('label', { class: 'chk' }, grid, ' Gitterlinien'), err];
  const ok = await dialog({ title: 'Funktionsplotter', body, buttons: [{ label: 'Abbrechen', value: null }, { label: 'Einfügen', primary: true, value: true }],
    onOpen: (dlg, close) => { const old = dlg.querySelector('.btn.primary'), btn = old.cloneNode(true); old.replaceWith(btn); btn.onclick = () => { try { buildPlot(); close(true); } catch (x) { err.textContent = x.message; } }; } });
  function buildPlot() {
    const num = el => { const v = parseFloat(String(el.value).replace(',', '.')); if (!isFinite(v)) throw new Error('Bitte gültige Zahlen eingeben.'); return v; };
    Object.assign(P, { f: f.value, f2: f2.value, x0: num(x0), x1: num(x1), y0: num(y0), y1: num(y1), cm: num(cm), grid: grid.checked, xl: xl.value, yl: yl.value });
    if (P.x1 <= P.x0 || P.y1 <= P.y0) throw new Error('„bis“ muss größer als „von“ sein.');
    const fns = [P.f, P.f2].filter(s => s.trim()).map(s => ({ src: s, fn: parseExpr(s) })), U = P.cm * S.settings.pxPerCm;
    const list = axesObjs({ x0: P.x0, x1: P.x1, y0: P.y0, y1: P.y1, U, xl: P.xl || 'x', yl: P.yl || 'y', grid: P.grid });
    const colors = ['#2563eb', '#dc2626'];
    fns.forEach(({ fn }, k) => {
      const N = 600, span = P.y1 - P.y0; let run = [];
      const flush = () => { if (run.length > 1) list.push({ type: 'pen', kind: 'plain', pts: run, c: colors[k], w: 2.6, ls: 'solid' }); run = []; };
      let prev = null;
      for (let i = 0; i <= N; i++) {
        const x = P.x0 + (P.x1 - P.x0) * i / N, y = fn(x);
        if (!isFinite(y) || y < P.y0 - span || y > P.y1 + span || (prev != null && Math.abs(y - prev) > span)) { flush(); prev = isFinite(y) ? y : null; continue; }
        run.push([x * U, -Math.max(P.y0 - 0.02 * span, Math.min(P.y1 + 0.02 * span, y)) * U]); prev = y;
      }
      flush();
    });
    placeGroup(list, fns.length ? 'Graph' : 'Koordinatensystem');
  }
  return ok;
}

/* ======================================================================
   Zeigerdiagramm (komplexe Zeiger mit Betrag und Winkel)
   ====================================================================== */
async function openPhasorDialog() {
  const rows = S.phasorPrefs || (S.phasorPrefs = [{ n: 'U', m: 230, a: 0 }, { n: 'I', m: 2, a: -30 }]);
  const tbl = h('div', { class: 'ptbl' }), scale = h('input', { type: 'text', value: '4', style: 'width:70px' }), axes = h('input', { type: 'checkbox', checked: true }), arcs = h('input', { type: 'checkbox', checked: true });
  const draw = () => tbl.replaceChildren(h('div', { class: 'ph' }, h('span', {}, 'Name'), h('span', {}, 'Betrag'), h('span', {}, 'Winkel in °'), h('span', {})),
    ...rows.map((r, i) => h('div', { class: 'pr' },
      h('input', { value: r.n, oninput: e => r.n = e.target.value }), h('input', { value: r.m, oninput: e => r.m = e.target.value }), h('input', { value: r.a, oninput: e => r.a = e.target.value }),
      h('button', { class: 'tb', title: 'Entfernen', onclick: () => { rows.splice(i, 1); draw(); } }, '✕'))),
    h('button', { class: 'btn sm', onclick: () => { rows.push({ n: 'Z', m: 1, a: 45 }); draw(); } }, '+ Zeiger'));
  draw();
  const ok = await dialog({ title: 'Zeigerdiagramm', body: [tbl, hint('Jeder Zeiger wird auf seinen größten Wert normiert, damit Spannungen und Ströme gemeinsam sichtbar sind.'),
    h('div', { class: 'frow' }, h('label', {}, 'Länge des längsten Zeigers (cm)'), scale), h('label', { class: 'chk' }, axes, ' Re/Im-Achsen'), h('label', { class: 'chk' }, arcs, ' Winkel einzeichnen')],
    buttons: [{ label: 'Abbrechen', value: null }, { label: 'Einfügen', primary: true, value: true }] });
  if (!ok) return;
  const num = v => parseFloat(String(v).replace(',', '.')) || 0, L = (num(scale.value) || 4) * S.settings.pxPerCm, cols = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];
  const groups = {}; rows.forEach(r => { const k = (r.n || '?').trim()[0].toUpperCase(); groups[k] = Math.max(groups[k] || 0, Math.abs(num(r.m))); });   // je Größenart normieren
  const list = [];
  if (axes.checked) list.push(G.arrow(-L * 1.15, 0, L * 1.25, 0, 1.6, '#6b7280'), G.arrow(0, L * 1.15, 0, -L * 1.25, 1.6, '#6b7280'), G.text(L * 1.25 + 18, 14, 'Re', 14, '#6b7280'), G.text(18, -L * 1.25 - 6, 'Im', 14, '#6b7280', 'left'));
  rows.forEach((r, i) => {
    const k = (r.n || '?').trim()[0].toUpperCase(), len = groups[k] ? L * Math.abs(num(r.m)) / groups[k] : 0, a = rad(num(r.a)), c = cols[i % cols.length];
    if (len < 1) return;
    const x = len * Math.cos(a), y = -len * Math.sin(a);
    list.push(G.arrow(0, 0, x, y, 2.8, c));
    list.push(G.text(x + 22 * Math.cos(a), y - 22 * Math.sin(a), '$\\underline{' + (r.n || '?').replace(/[{}\\$]/g, '') + '}$', 18, c));
    if (arcs.checked && Math.abs(num(r.a)) > 0.5) {
      const rr = 34 + i * 16, a0 = 0, sw = -a; list.push({ type: 'arc', cx: 0, cy: 0, r: rr, a0, sweep: sw, c, w: 1.4, ls: 'solid' });
      list.push(G.text((rr + 16) * Math.cos(-a / 2), (rr + 16) * Math.sin(-a / 2), fmtTick(num(r.a)) + '°', 12, c));
    }
  });
  placeGroup(list, 'Zeigerdiagramm');
}

/* ======================================================================
   Diagramm-Vorlagen: Bode-Diagramm, Oszilloskop-Raster, Kennlinienfeld, Polarkoordinaten
   ====================================================================== */
function diagramMenu(anchor) {
  popupMenu(anchor, [
    { label: 'Bode-Diagramm (Betrag und Phase)', run: () => placeGroup(bodeObjs(), 'Bode-Diagramm') },
    { label: 'Oszilloskop-Raster (10 × 8 Teile)', run: () => placeGroup(scopeObjs(), 'Oszilloskop-Raster') },
    { label: 'Kennlinienfeld I(U)', run: () => placeGroup(axesObjs({ x0: 0, x1: 10, y0: 0, y1: 10, U: S.settings.pxPerCm, xl: 'U / V', yl: 'I / mA' }), 'Kennlinienfeld') },
    { label: 'Logarithmisches Papier (4 Dekaden)', run: () => placeGroup(logPaper(4, 9, 'f / Hz', ''), 'Log-Papier') },
    { label: 'Polarkoordinaten', run: () => placeGroup(polarObjs(), 'Polarkoordinaten') }]);
}
function logPaper(dec, hCm, xl, yl, yTicks) {             // x logarithmisch, y linear
  const D = 3.2 * S.settings.pxPerCm, H = hCm * S.settings.pxPerCm, W = dec * D, out = [], gc = '#9aa3ad';
  for (let d = 0; d < dec; d++) for (let m = 1; m < 10; m++) { const x = d * D + Math.log10(m) * D; out.push(G.line(x, 0, x, H, m === 1 ? 1.2 : 0.6, m === 1 ? '#6b7280' : gc)); }
  out.push(G.line(W, 0, W, H, 1.2, '#6b7280'));
  for (let d = 0; d <= dec; d++) out.push(G.text(d * D, H + 16, '$10^{' + d + '}$', 13));
  const ny = 8; for (let j = 0; j <= ny; j++) { const y = H * j / ny; out.push(G.line(0, y, W, y, j === 0 || j === ny ? 1.2 : 0.6, j === 0 || j === ny ? '#6b7280' : gc)); if (yTicks) out.push(G.text(-8, y, yTicks(j, ny), 12, '@ink', 'right')); }
  out.push(G.text(W / 2, H + 40, xl, 15)); if (yl) out.push(G.text(-12, -18, yl, 15, '@ink', 'left'));
  return out;
}
function bodeObjs() {
  const a = logPaper(5, 6, 'f / Hz', '|H| in dB', (j, n) => String(40 - j * 80 / n).replace('-', '−'));
  const b = logPaper(5, 4.5, 'f / Hz', 'φ in °', (j, n) => String(90 - j * 180 / n).replace('-', '−'));
  const off = 6 * S.settings.pxPerCm + 90; b.forEach(o => moveObj(o, 0, off));
  return [...a, ...b];
}
function scopeObjs() {
  const D = 1.0 * S.settings.pxPerCm, W = 10 * D, H = 8 * D, out = [], gc = '#9aa3ad';
  out.push({ type: 'rect', x: 0, y: 0, w: W, h: H, rot: 0, c: '@ink', sw: 2, ls: 'solid', fill: false });
  for (let i = 1; i < 10; i++) out.push(G.line(i * D, 0, i * D, H, i === 5 ? 1.2 : 0.7, i === 5 ? '#6b7280' : gc, i === 5 ? 'solid' : 'dotted'));
  for (let j = 1; j < 8; j++) out.push(G.line(0, j * D, W, j * D, j === 4 ? 1.2 : 0.7, j === 4 ? '#6b7280' : gc, j === 4 ? 'solid' : 'dotted'));
  for (let i = 1; i < 50; i++) if (i % 5) { out.push(G.line(i * D / 5, H / 2 - 4, i * D / 5, H / 2 + 4, 1, '#6b7280')); }
  for (let j = 1; j < 40; j++) if (j % 5) { out.push(G.line(W / 2 - 4, j * D / 5, W / 2 + 4, j * D / 5, 1, '#6b7280')); }
  out.push(G.text(0, H + 18, 'Y: ____ V/Teil', 13, '@ink', 'left'), G.text(W, H + 18, 'X: ____ ms/Teil', 13, '@ink', 'right'));
  return out;
}
function polarObjs() {
  const R = 4 * S.settings.pxPerCm, out = [], gc = '#9aa3ad';
  for (let k = 1; k <= 4; k++) out.push({ type: 'arc', cx: 0, cy: 0, r: R * k / 4, a0: 0, sweep: Math.PI * 2, c: k === 4 ? '#6b7280' : gc, w: k === 4 ? 1.2 : 0.7, ls: 'solid' });
  for (let d = 0; d < 360; d += 30) { const a = rad(d); out.push(G.line(0, 0, R * Math.cos(a), -R * Math.sin(a), d % 90 ? 0.7 : 1.2, d % 90 ? gc : '#6b7280')); out.push(G.text((R + 18) * Math.cos(a), -(R + 18) * Math.sin(a), d + '°', 12)); }
  return out;
}
