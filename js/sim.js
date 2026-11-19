"use strict";
/* ===== Schaltungssimulation nach dem Vorbild von Falstad =====
   Die gezeichnete Schaltung (Bauteile + Leitungen) wird in ein Netzwerk übersetzt und mit der modifizierten
   Knotenpotenzialanalyse (MNA) im Zeitbereich berechnet: Kondensatoren und Spulen mit der Trapezregel,
   Dioden und Transistoren nichtlinear mit dem Newton-Verfahren. Strom wird als wandernde Punkte gezeigt,
   Spannung als Farbe der Leitungen (grün = positiv, rot = negativ), Messgeräte zeigen ihren Wert und ihren
   Verlauf im Oszilloskop. */

const SIM = { on: false, run: true, t: 0, speed: 0.05, net: null, dirty: true, raf: 0, last: 0, traces: [], phase: new Map(), warn: '', scopeOn: true };
const VT = 0.025852;

/* ---------- Werte lesen: „4,7 kΩ“, „10µ“, „230 V 50 Hz“ ---------- */
const SI = { p: 1e-12, n: 1e-9, u: 1e-6, 'µ': 1e-6, 'μ': 1e-6, m: 1e-3, '': 1, k: 1e3, K: 1e3, M: 1e6, G: 1e9 };
function parseSI(str, def) {
  const m = /(-?\d+(?:[.,]\d+)?)\s*([pnuµμmkKMG](?![a-zA-Z]{2}))?/.exec(String(str || '').replace(/Ohm/gi, 'Ω'));
  if (!m) return def;
  const num = parseFloat(m[1].replace(',', '.')); return isFinite(num) ? num * (SI[m[2] || ''] ?? 1) : def;
}
function parseHz(str, def) { const m = /(\d+(?:[.,]\d+)?)\s*([kM]?)\s*Hz/i.exec(String(str || '')); return m ? parseFloat(m[1].replace(',', '.')) * (m[2] === 'k' ? 1e3 : m[2] === 'M' ? 1e6 : 1) : def; }
const fmtSI = (v, unit) => {
  const a = Math.abs(v); if (!isFinite(v)) return '—';
  const [k, p] = a >= 1e6 ? [1e-6, 'M'] : a >= 1e3 ? [1e-3, 'k'] : a >= 1 || a === 0 ? [1, ''] : a >= 1e-3 ? [1e3, 'm'] : a >= 1e-6 ? [1e6, 'µ'] : [1e9, 'n'];
  const x = v * k; return (Math.abs(x) >= 100 ? x.toFixed(0) : Math.abs(x) >= 10 ? x.toFixed(1) : x.toFixed(2)).replace('.', ',') + ' ' + p + unit;
};

/* ---------- Welche Symbole simuliert werden (Standardwerte in Klammern) ---------- */
const SIMDEF = {
  resistor: ['R', '1 kΩ'], resistor_us: ['R', '1 kΩ'], resistor_var: ['R', '1 kΩ'], ntc: ['R', '1 kΩ'], ptc: ['R', '1 kΩ'], ldr: ['R', '10 kΩ'],
  lamp: ['LAMP', '100 Ω'], fuse: ['R', '0,01 Ω'], motor: ['R', '10 Ω'], motor3: ['R', '10 Ω'], speaker: ['R', '8 Ω'], relay: ['R', '200 Ω'],
  capacitor: ['C', '10 µF'], cap_pol: ['C', '100 µF'], cap_var: ['C', '100 nF'], inductor: ['L', '100 mH'], inductor_core: ['L', '1 H'],
  vdc: ['V', '5 V'], battery: ['V', '9 V'], vac: ['AC', '5 V 50 Hz'], generator: ['AC', '10 V 50 Hz'], idc: ['I', '10 mA'], vcc: ['VCC', '12 V'],
  diode: ['D', ''], schottky: ['D', ''], photodiode: ['D', ''], led: ['LED', ''], zener: ['Z', '5,1 V'],
  switch: ['SW', ''], button: ['SW', ''], switch_spdt: ['SPDT', ''], pot: ['POT', '10 kΩ'],
  ammeter: ['AM', ''], voltmeter: ['VM', ''], ground: ['GND', ''], chassis: ['GND', ''],
  opamp: ['OA', '±15 V'], opamp2: ['OA', '±15 V'], comparator: ['CMP', ''], npn: ['BJT', 'β = 100'], pnp: ['BJT', 'β = 100'],
  and: ['GATE', ''], nand: ['GATE', ''], or: ['GATE', ''], nor: ['GATE', ''], xor: ['GATE', ''], xnor: ['GATE', ''], not: ['GATE', ''], buffer: ['GATE', ''], schmitt: ['GATE', '']
};
const SIM_IGNORE = new Set(['varrow', 'iarrow', 'junction', 'terminal', 'crossing', 'antenna']);   // nur Verbindungspunkte bzw. Beschriftung
function simValue(o) { return o.val || (o.label && !/\$/.test(o.label) && /\d\s*[pnuµμmkKMG]?\s*(Ω|F|H|V|A|Hz)/.test(o.label) ? o.label : ''); }
function simDefault(o) { const d = SIMDEF[o.sym]; return d ? d[1] : ''; }

/* ---------- Netz aus der Zeichnung ableiten ---------- */
function buildNet() {
  const par = new Map(), K = (x, y) => Math.round(x * 2) / 2 + ',' + Math.round(y * 2) / 2;
  const find = k => { let r = k; while (par.get(r) !== r) r = par.get(r); let c = k; while (par.get(c) !== r) { const n = par.get(c); par.set(c, r); c = n; } return r; };
  const add = k => { if (!par.has(k)) par.set(k, k); return k; };
  const uni = (a, b) => { a = find(add(a)); b = find(add(b)); if (a !== b) par.set(a, b); };
  const pts = new Map();                                 // Schlüssel → Koordinaten
  const P = (x, y) => { const k = add(K(x, y)); if (!pts.has(k)) pts.set(k, [x, y]); return k; };
  const wires = S.objs.filter(o => o.type === 'line');
  const syms = S.objs.filter(o => o.type === 'symbol' && SYM[o.sym] && !['varrow', 'iarrow'].includes(o.sym));
  for (const w of wires) uni(P(w.x1, w.y1), P(w.x2, w.y2));
  const pinKeys = new Map();
  for (const o of syms) { const ks = SYM[o.sym].pins.map((_, i) => { const [x, y] = pinWorld(o, i); return P(x, y); }); pinKeys.set(o, ks); }
  for (const o of syms) if (o.sym === 'crossing') { const k = pinKeys.get(o); uni(k[0], k[1]); uni(k[2], k[3]); }
  // T-Abzweige: Punkte, die mitten auf einer Leitung liegen
  const onWire = new Map();
  for (const w of wires) for (const [k, [x, y]] of pts) {
    if (distSeg(x, y, w.x1, w.y1, w.x2, w.y2) < 0.75) { uni(k, K(w.x1, w.y1)); (onWire.get(w) || onWire.set(w, []).get(w)).push(k); }
  }
  const els = [], unsupported = new Set();
  let gndRoot = null;
  for (const o of syms) {
    const d = SIMDEF[o.sym], ks = pinKeys.get(o);
    if (!d) { if (!SIM_IGNORE.has(o.sym)) unsupported.add(SYM[o.sym].name); continue; }
    if (d[0] === 'GND') { gndRoot = gndRoot || find(ks[0]); uni(ks[0], gndRoot); gndRoot = find(gndRoot); continue; }
    els.push({ o, type: d[0], keys: ks });
  }
  if (!gndRoot) { const src = els.find(e => ['V', 'AC'].includes(e.type)) || els[0]; if (src) gndRoot = find(src.keys[src.keys.length > 1 ? 1 : 0]); }
  // Knotennummern: 0 = Masse
  const idx = new Map(); let n = 0;
  if (gndRoot) idx.set(find(gndRoot), 0);
  for (const k of par.keys()) { const r = find(k); if (!idx.has(r)) idx.set(r, ++n); }
  const node = k => idx.get(find(k));
  let m = 0;                                             // zusätzliche Unbekannte (Ströme in Spannungsquellen)
  for (const e of els) {
    e.n = e.keys.map(node); e.val = simValue(e.o);
    if (['V', 'AC', 'AM', 'VCC', 'OA', 'CMP', 'GATE'].includes(e.type)) e.k = m++;
    e.st = { v: 0, i: 0, vd: 0, vd2: 0, vbe: 0, vbc: 0, out: 0 };
  }
  // Leitungsabschnitte für die Strompunkte
  const segs = [];
  for (const w of wires) {
    const list = [...new Set([P(w.x1, w.y1), P(w.x2, w.y2), ...(onWire.get(w) || [])])], dx = w.x2 - w.x1, dy = w.y2 - w.y1, L2 = dx * dx + dy * dy || 1;
    list.sort((a, b) => ((pts.get(a)[0] - w.x1) * dx + (pts.get(a)[1] - w.y1) * dy) / L2 - ((pts.get(b)[0] - w.x1) * dx + (pts.get(b)[1] - w.y1) * dy) / L2);
    for (let i = 1; i < list.length; i++) if (list[i] !== list[i - 1]) segs.push({ a: list[i - 1], b: list[i], node: node(list[i]), I: 0, w });
  }
  return { els, n, m, node, pts, segs, unsupported: [...unsupported] };
}

/* ---------- Lineares Gleichungssystem (Gauß mit Spaltenpivotsuche) ---------- */
function solveLin(A, B, N) {
  for (let c = 0; c < N; c++) {
    let p = c, mx = Math.abs(A[c * N + c]);
    for (let r = c + 1; r < N; r++) { const v = Math.abs(A[r * N + c]); if (v > mx) { mx = v; p = r; } }
    if (mx < 1e-18) continue;
    if (p !== c) { for (let k = 0; k < N; k++) { const t = A[c * N + k]; A[c * N + k] = A[p * N + k]; A[p * N + k] = t; } const t = B[c]; B[c] = B[p]; B[p] = t; }
    const d = A[c * N + c];
    for (let r = c + 1; r < N; r++) { const f = A[r * N + c] / d; if (!f) continue; for (let k = c; k < N; k++) A[r * N + k] -= f * A[c * N + k]; B[r] -= f * B[c]; }
  }
  const x = new Float64Array(N);
  for (let r = N - 1; r >= 0; r--) { let s = B[r]; for (let k = r + 1; k < N; k++) s -= A[r * N + k] * x[k]; const d = A[r * N + r]; x[r] = Math.abs(d) < 1e-18 ? 0 : s / d; }
  return x;
}
function pnjlim(vn, vo, vt, vcrit) {                     // Spannungsbegrenzung für stabile Newton-Schritte
  if (vn > vcrit && Math.abs(vn - vo) > 2 * vt) { if (vo > 0) { const a = 1 + (vn - vo) / vt; vn = a > 0 ? vo + vt * Math.log(a) : vcrit; } else vn = vt * Math.log(vn / vt); }
  return vn;
}
const DIODE_P = { D: [1e-14, 1], LED: [1e-20, 2], Z: [1e-14, 1] };

/* ---------- Ein Zeitschritt ---------- */
function simStep(net, dt, t) {
  const n = net.n, N = n + net.m; if (!N) return;
  const A = new Float64Array(N * N), B = new Float64Array(N);
  let x = net.x || new Float64Array(N); const V = q => (q ? x[q - 1] : 0);
  const G = (a, b, g) => { if (a) A[(a - 1) * N + a - 1] += g; if (b) A[(b - 1) * N + b - 1] += g; if (a && b) { A[(a - 1) * N + b - 1] -= g; A[(b - 1) * N + a - 1] -= g; } };
  const Isrc = (a, b, i) => { if (a) B[a - 1] -= i; if (b) B[b - 1] += i; };          // Strom i fließt durch das Element von a nach b
  const Vsrc = (a, b, k, v) => { const r = n + k; if (a) { A[(a - 1) * N + r] += 1; A[r * N + a - 1] += 1; } if (b) { A[(b - 1) * N + r] -= 1; A[r * N + b - 1] -= 1; } B[r] = v; };
  const diode = (e, p, q, Is, nv, off, key) => {       // Diode von p nach q (mit Spannungsversatz off)
    const vt = nv * VT, vcrit = vt * Math.log(vt / (Math.SQRT2 * Is));
    let v = V(p) - V(q) - off; v = pnjlim(v, e.st[key], vt, vcrit); e.st[key] = v;
    const ex = Math.exp(Math.min(v / vt, 80)), id = Is * (ex - 1), gd = Is / vt * ex + 1e-12;
    G(p, q, gd); Isrc(p, q, id - gd * v - gd * off);
  };
  const logicIn = q => (q ? (net.xPrev ? net.xPrev[q - 1] : 0) : 0) > 2.5;
  let nonlin = false;
  for (let it = 0; it < 40; it++) {
    A.fill(0); B.fill(0);
    for (let i = 0; i < n; i++) A[i * N + i] += 1e-9;   // kleiner Leitwert gegen Masse: verhindert schwebende Knoten
    for (const e of net.els) {
      const [a, b, c] = e.n, val = e.val;
      switch (e.type) {
        case 'R': G(a, b, 1 / Math.max(1e-6, parseSI(val, 1000))); break;
        case 'LAMP': G(a, b, 1 / Math.max(1e-3, parseSI(val, 100))); break;
        case 'VM': G(a, b, 1e-7); break;
        case 'C': { const Cv = parseSI(val, 10e-6), g = 2 * Cv / dt, ieq = g * e.st.v + e.st.i; G(a, b, g); Isrc(a, b, -ieq); e.g = g; e.ieq = ieq; break; }
        case 'L': { const Lv = Math.max(1e-9, parseSI(val, 0.1)), g = dt / (2 * Lv), ieq = e.st.i + g * e.st.v; G(a, b, g); Isrc(a, b, ieq); e.g = g; e.ieq = ieq; break; }
        case 'V': Vsrc(a, b, e.k, parseSI(val, e.o.sym === 'battery' ? 9 : 5)); break;
        case 'VCC': Vsrc(a, 0, e.k, parseSI(val, 12)); break;
        case 'AC': Vsrc(a, b, e.k, parseSI(val, 5) * Math.sin(2 * Math.PI * parseHz(val, 50) * t)); break;
        case 'AM': Vsrc(a, b, e.k, 0); break;
        case 'I': Isrc(b, a, parseSI(val, 0.01)); break;
        case 'SW': G(a, b, e.o.closed ? 1e3 : 1e-12); break;
        case 'SPDT': G(a, e.o.pos ? c : b, 1e3); break;
        case 'POT': { const R = parseSI(val, 1e4), w = e.o.wiper ?? 0.5; G(a, c, 1 / Math.max(1, R * w)); G(c, b, 1 / Math.max(1, R * (1 - w))); break; }
        case 'D': case 'LED': { nonlin = true; const [Is, nn] = DIODE_P[e.type]; diode(e, a, b, e.o.sym === 'schottky' ? 1e-8 : Is, nn, 0, 'vd'); break; }
        case 'Z': { nonlin = true; diode(e, a, b, 1e-14, 1, 0, 'vd'); diode(e, b, a, 1e-14, 1, Math.max(0, parseSI(val, 5.1) - 0.6), 'vd2'); break; }
        case 'BJT': {
          nonlin = true; const s = e.o.sym === 'pnp' ? -1 : 1, beta = parseSI(val, 100) || 100, Is = 1e-14, bR = 1, vcrit = VT * Math.log(VT / (Math.SQRT2 * Is));
          const [nb, nc, ne] = e.n;
          let vbe = s * (V(nb) - V(ne)), vbc = s * (V(nb) - V(nc));
          vbe = pnjlim(vbe, e.st.vbe, VT, vcrit); vbc = pnjlim(vbc, e.st.vbc, VT, vcrit); e.st.vbe = vbe; e.st.vbc = vbc;
          const ef = Math.exp(Math.min(vbe / VT, 80)), er = Math.exp(Math.min(vbc / VT, 80)), iF = Is * (ef - 1), iR = Is * (er - 1), gf = Is / VT * ef + 1e-12, gr = Is / VT * er + 1e-12;
          const T = [[nc, iF - iR * (1 + 1 / bR), gf, -gr * (1 + 1 / bR)], [nb, iF / beta + iR / bR, gf / beta, gr / bR], [ne, -iF * (1 + 1 / beta) + iR, -gf * (1 + 1 / beta), gr]];
          for (const [q, I0, dbe, dbc] of T) {
            if (!q) continue; const r = (q - 1) * N;
            if (nb) A[r + nb - 1] += dbe + dbc; if (ne) A[r + ne - 1] -= dbe; if (nc) A[r + nc - 1] -= dbc;
            B[q - 1] -= s * (I0 - dbe * vbe - dbc * vbc);
          }
          break;
        }
        case 'OA': {
          nonlin = true; const plus = e.o.sym === 'opamp' ? b : a, minus = e.o.sym === 'opamp' ? a : b, out = c, r = n + e.k, Vmax = Math.abs(parseSI(val, 15)) || 15, gain = 1e5;
          if (out) A[(out - 1) * N + r] += 1;
          const want = gain * (V(plus) - V(minus));
          if (out) A[r * N + out - 1] += 1;
          if (Math.abs(want) < Vmax) { if (plus) A[r * N + plus - 1] -= gain; if (minus) A[r * N + minus - 1] += gain; B[r] = 0; }
          else B[r] = Math.sign(want) * Vmax;
          break;
        }
        case 'CMP': { const pv = q => (q && net.xPrev ? net.xPrev[q - 1] : 0); Vsrc(c, 0, e.k, pv(a) > pv(b) ? 5 : 0); break; }
        case 'GATE': {
          const sym = e.o.sym, one = ['not', 'buffer', 'schmitt'].includes(sym), out = one ? b : c;
          let y;
          if (sym === 'schmitt') { const vin = a ? (net.xPrev ? net.xPrev[a - 1] : 0) : 0; y = e.st.out ? vin > 1.7 : vin > 3.3; }
          else { const p = logicIn(a), q = one ? false : logicIn(b); y = { and: p && q, nand: !(p && q), or: p || q, nor: !(p || q), xor: p !== q, xnor: p === q, not: !p, buffer: p }[sym]; }
          e.st.out = y ? 1 : 0; Vsrc(out, 0, e.k, y ? 5 : 0); break;
        }
      }
    }
    const nx = solveLin(A, B, N);
    let conv = true; for (let i = 0; i < N; i++) if (Math.abs(nx[i] - x[i]) > 1e-6 + 1e-4 * Math.abs(nx[i])) { conv = false; break; }
    x = nx; if (!nonlin || (conv && it > 0)) break;
  }
  net.xPrev = x; net.x = x;
  // Zustände und Ströme übernehmen
  for (const e of net.els) {
    const [a, b, c] = e.n, va = V(a), vb = V(b);
    switch (e.type) {
      case 'R': e.I = (va - vb) * 1 / Math.max(1e-6, parseSI(e.val, 1000)); break;
      case 'LAMP': e.I = (va - vb) / Math.max(1e-3, parseSI(e.val, 100)); break;
      case 'VM': e.I = (va - vb) * 1e-7; e.meas = va - vb; break;
      case 'C': e.st.v = va - vb; e.st.i = e.g * e.st.v - e.ieq; e.I = e.st.i; break;
      case 'L': e.st.v = va - vb; e.st.i = e.g * e.st.v + e.ieq; e.I = e.st.i; break;
      case 'V': case 'AC': case 'AM': e.I = x[n + e.k]; if (e.type === 'AM') e.meas = e.I; break;
      case 'VCC': e.I = x[n + e.k]; break;
      case 'I': e.I = -parseSI(e.val, 0.01); break;
      case 'SW': e.I = (va - vb) * (e.o.closed ? 1e3 : 1e-12); break;
      case 'SPDT': e.I = (va - V(e.o.pos ? c : b)) * 1e3; break;
      case 'POT': { const R = parseSI(e.val, 1e4), w = e.o.wiper ?? 0.5, vc = V(c); e.Ipins = [(va - vc) / Math.max(1, R * w), (vb - vc) / Math.max(1, R * (1 - w))]; e.Ipins.push(-e.Ipins[0] - e.Ipins[1]); break; }
      case 'D': case 'LED': { const [Is, nn] = DIODE_P[e.type], v = va - vb; e.I = (e.o.sym === 'schottky' ? 1e-8 : Is) * (Math.exp(Math.min(v / (nn * VT), 80)) - 1); break; }
      case 'Z': { const v = va - vb, off = Math.max(0, parseSI(e.val, 5.1) - 0.6); e.I = 1e-14 * (Math.exp(Math.min(v / VT, 80)) - 1) - 1e-14 * (Math.exp(Math.min((-v - off) / VT, 80)) - 1); break; }
      case 'BJT': {
        const s = e.o.sym === 'pnp' ? -1 : 1, beta = parseSI(e.val, 100) || 100, Is = 1e-14, [nb, nc, ne] = e.n;
        const vbe = s * (V(nb) - V(ne)), vbc = s * (V(nb) - V(nc)), iF = Is * (Math.exp(Math.min(vbe / VT, 80)) - 1), iR = Is * (Math.exp(Math.min(vbc / VT, 80)) - 1);
        const Ic = s * (iF - 2 * iR), Ib = s * (iF / beta + iR); e.Ipins = [Ib, Ic, -(Ib + Ic)]; break;
      }
      case 'OA': case 'CMP': case 'GATE': { const out = e.type === 'GATE' && ['not', 'buffer', 'schmitt'].includes(e.o.sym) ? 1 : 2; e.Ipins = e.n.map((_, i) => i === out ? x[n + e.k] : 0); break; }
    }
    if (e.I != null) e.Ipins = [e.I, -e.I];
  }
}

/* ---------- Ströme in den Leitungen (für die wandernden Punkte) ---------- */
function wireCurrents(net) {
  const inj = new Map(), add = (k, v) => inj.set(k, (inj.get(k) || 0) + v);
  for (const e of net.els) if (e.Ipins) e.keys.forEach((k, i) => add(k, -(e.Ipins[i] || 0)));   // Strom, der aus dem Bauteil in die Leitung fließt
  const adj = new Map(); const link = (k, s) => (adj.get(k) || adj.set(k, []).get(k)).push(s);
  for (const s of net.segs) { s.I = 0; link(s.a, s); link(s.b, s); }
  const seen = new Set();
  for (const start of adj.keys()) {
    if (seen.has(start)) continue;
    const order = [], parent = new Map(); seen.add(start); order.push(start); parent.set(start, null);
    for (let i = 0; i < order.length; i++) for (const s of adj.get(order[i])) { const o = s.a === order[i] ? s.b : s.a; if (!seen.has(o)) { seen.add(o); parent.set(o, s); order.push(o); } }
    const sum = new Map(order.map(k => [k, inj.get(k) || 0]));
    for (let i = order.length - 1; i > 0; i--) {         // von den Blättern zur Wurzel
      const k = order[i], s = parent.get(k), up = s.a === k ? s.b : s.a, f = sum.get(k);
      s.I = s.a === k ? f : -f; sum.set(up, sum.get(up) + f);
    }
  }
}

/* ---------- Steuerung ---------- */
function simDirty() { SIM.dirty = true; }
function startSim() {
  if (S.editing) commitEdit();
  SIM.on = true; SIM.run = true; SIM.t = 0; SIM.dirty = true; SIM.traces = []; SIM.phase.clear(); SIM.last = performance.now();
  rebuildSim(true); SIM.speed = autoSpeed();
  if (!SIM.net || !SIM.net.els.length) { toast('Keine simulierbare Schaltung gefunden. Bauteile mit Leitungen verbinden (Taste W).', 5000); SIM.on = false; return; }
  setTool('select'); S.sels = [];
  SIM.traces = SIM.net.els.filter(e => e.type === 'AM' || e.type === 'VM').map(e => newTrace(e.o, e.type === 'AM' ? 'I' : 'U'));
  buildSimbar(); cancelAnimationFrame(SIM.raf); SIM.raf = requestAnimationFrame(simFrame); refreshUI();
}
function stopSim() { SIM.on = false; cancelAnimationFrame(SIM.raf); const b = $('#simbar'); if (b) b.remove(); const sc = $('#scope'); if (sc) sc.remove(); renderOverlay(); refreshUI(); }
function autoSpeed() {
  const ac = SIM.net && SIM.net.els.find(e => e.type === 'AC'); if (ac) return 1 / parseHz(ac.val, 50) / 1.5;   // etwa 1,5 Perioden pro Sekunde
  let tau = 0; const R = SIM.net ? SIM.net.els.filter(e => e.type === 'R').map(e => parseSI(e.val, 1000)) : [];
  const Rm = R.length ? Math.max(...R) : 1000;
  for (const e of SIM.net ? SIM.net.els : []) { if (e.type === 'C') tau = Math.max(tau, Rm * parseSI(e.val, 1e-5)); if (e.type === 'L') tau = Math.max(tau, parseSI(e.val, 0.1) / Math.max(1, Math.min(...R, 1e3))); }
  return tau ? clamp(tau * 1.2, 1e-5, 5) : 0.05;
}
function rebuildSim(reset) {
  const old = SIM.net; SIM.net = buildNet(); SIM.dirty = false;
  if (old && !reset) for (const e of SIM.net.els) { const p = old.els.find(q => q.o === e.o); if (p) e.st = p.st; }
  SIM.warn = SIM.net.unsupported.length ? 'Nicht simuliert: ' + SIM.net.unsupported.join(', ') : '';
  const w = $('#simwarn'); if (w) w.textContent = SIM.warn;
}
function simFrame(now) {
  if (!SIM.on) return;
  const real = clamp((now - SIM.last) / 1000, 0, 0.05); SIM.last = now;
  if (SIM.dirty) rebuildSim(false);
  const net = SIM.net;
  if (SIM.run && net && net.n + net.m > 0 && real > 0) {
    const adv = SIM.speed * real, steps = clamp(Math.ceil(adv / (SIM.speed / 1200)), 1, 200), dt = adv / steps;
    try {
      for (let i = 0; i < steps; i++) {
        SIM.t += dt; simStep(net, dt, SIM.t);
        if (i % Math.max(1, Math.floor(steps / 8)) === 0) sampleTraces();
      }
      wireCurrents(net);
    } catch (e) { console.error(e); }
  }
  // Punkte weiterwandern lassen
  if (net) {
    const Imax = Math.max(1e-9, ...net.segs.map(s => Math.abs(s.I)), ...net.els.flatMap(e => (e.Ipins || []).map(Math.abs)));
    SIM.Imax = Imax; const spd = I => (SIM.run ? 1 : 0) * 110 * Math.sign(I) * Math.sqrt(Math.min(1, Math.abs(I) / Imax)) * real;
    for (const s of net.segs) SIM.phase.set(s, ((SIM.phase.get(s) || 0) + spd(s.I)));
    for (const e of net.els) if (e.Ipins) e.Ipins.forEach((I, i) => { const k = e.o; const m = SIM.phase.get(k) || []; m[i] = (m[i] || 0) + spd(I); SIM.phase.set(k, m); });
  }
  drawScope(); updateSimbar(); renderOverlay();
  SIM.raf = requestAnimationFrame(simFrame);
}

/* ---------- Anzeige auf der Fläche ---------- */
function vColor(v, vmax) {
  const k = clamp(v / vmax, -1, 1), g = [148, 163, 184];
  const tgt = k >= 0 ? [22, 163, 74] : [220, 38, 38], a = Math.abs(k);
  return `rgb(${Math.round(g[0] + (tgt[0] - g[0]) * a)},${Math.round(g[1] + (tgt[1] - g[1]) * a)},${Math.round(g[2] + (tgt[2] - g[2]) * a)})`;
}
function dotsAlong(c, x1, y1, x2, y2, ph, z) {
  const L = Math.hypot(x2 - x1, y2 - y1); if (L < 1) return; const sp = 16, off = ((ph % sp) + sp) % sp;
  for (let d = off; d < L; d += sp) { const t = d / L; c.beginPath(); c.arc(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 2.6, 0, 7); c.fill(); }
}
function drawSim(c, z) {
  const net = SIM.net; if (!SIM.on || !net) return;
  const x = net.x, V = q => (q && x ? x[q - 1] : 0);
  let vmax = 1; for (let i = 0; i < net.n && x; i++) vmax = Math.max(vmax, Math.abs(x[i]));
  c.save(); c.lineCap = 'round';
  for (const s of net.segs) { const [ax, ay] = net.pts.get(s.a), [bx, by] = net.pts.get(s.b); c.strokeStyle = vColor(V(s.node), vmax); c.lineWidth = 3.2; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); }
  c.fillStyle = '#facc15';
  for (const s of net.segs) if (Math.abs(s.I) > SIM.Imax * 1e-3 && Math.abs(s.I) > 1e-9) { const [ax, ay] = net.pts.get(s.a), [bx, by] = net.pts.get(s.b); dotsAlong(c, ax, ay, bx, by, SIM.phase.get(s) || 0, z); }
  for (const e of net.els) {
    if (!e.Ipins) continue; const ph = SIM.phase.get(e.o) || [], [cx, cy] = center(e.o);
    if (e.keys.length === 2 && e.type !== 'VM') { const p0 = net.pts.get(e.keys[0]), p1 = net.pts.get(e.keys[1]); if (Math.abs(e.Ipins[0]) > SIM.Imax * 1e-3 && Math.abs(e.Ipins[0]) > 1e-9) dotsAlong(c, p0[0], p0[1], p1[0], p1[1], ph[0] || 0, z); }
    else e.keys.forEach((k, i) => { const p = net.pts.get(k); if (Math.abs(e.Ipins[i] || 0) > SIM.Imax * 1e-3 && Math.abs(e.Ipins[i]) > 1e-9) dotsAlong(c, p[0], p[1], cx, cy, ph[i] || 0, z); });
  }
  // Leuchten, Schalterstellung, Messwerte
  for (const e of net.els) {
    const [cx, cy] = center(e.o);
    if ((e.type === 'LED' || e.type === 'LAMP') && e.I > 1e-4) {
      const k = clamp(e.type === 'LED' ? e.I / 0.02 : Math.abs(e.I) / 0.2, 0, 1.2), r = 18 + 30 * k, col = e.type === 'LED' ? colorOf(e.o.c === '@ink' ? '#ef4444' : e.o.c) : '#fde047';
      const g = c.createRadialGradient(cx, cy, 2, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, col + '00');
      c.globalAlpha = Math.min(0.9, 0.25 + 0.6 * k); c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill(); c.globalAlpha = 1;
    }
    if (e.type === 'SW' && e.o.closed) { const [ax, ay] = fromLocal(e.o, (22 / 80 - 0.5) * e.o.w, 0), [bx, by] = fromLocal(e.o, (58 / 80 - 0.5) * e.o.w, 0); c.strokeStyle = '#16a34a'; c.lineWidth = 3; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); }
    if (e.meas != null) {
      const t = fmtSI(e.meas, e.type === 'AM' ? 'A' : 'V'); c.font = `600 ${15}px ${FONT}`; const tw = c.measureText(t).width, y0 = objBounds(e.o)[3] + 8;
      c.fillStyle = themeDark() ? 'rgba(20,22,26,.9)' : 'rgba(255,255,255,.95)'; c.fillRect(cx - tw / 2 - 6, y0, tw + 12, 22);
      c.strokeStyle = '#2563eb'; c.lineWidth = 1; c.strokeRect(cx - tw / 2 - 6, y0, tw + 12, 22);
      c.fillStyle = '#2563eb'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, cx, y0 + 11);
      c.fillStyle = '#facc15';
    }
  }
  c.restore();
}
function simClick(p) {                                     // während der Simulation: Schalter umlegen, Bauteil ins Oszilloskop
  const o = hitTest(p); if (!o || o.type !== 'symbol') return false;
  if (o.sym === 'switch' || o.sym === 'button') { o.closed = !o.closed; return true; }
  if (o.sym === 'switch_spdt') { o.pos = o.pos ? 0 : 1; return true; }
  if (o.sym === 'pot') { const [lx] = toLocal(o, p.x, p.y); o.wiper = clamp(lx / o.w + 0.5, 0.02, 0.98); return true; }
  if (SIMDEF[o.sym] && SIMDEF[o.sym][0] !== 'GND') {
    const i = SIM.traces.findIndex(t => t.o === o);
    if (i >= 0) SIM.traces.splice(i, 1); else SIM.traces.push(newTrace(o, o.sym === 'ammeter' ? 'I' : 'U'));
    SIM.scopeOn = true; buildSimbar(); return true;
  }
  return false;
}

/* ---------- Oszilloskop ---------- */
const TRACE_COLS = ['#16a34a', '#2563eb', '#dc2626', '#d97706', '#9333ea', '#0891b2'];
function newTrace(o, q) { const k = SIM.traces.length; return { o, q, col: TRACE_COLS[k % TRACE_COLS.length], data: [], name: (o.label && !/\$/.test(o.label) ? o.label : SYM[o.sym].name) + (q === 'I' ? ' (Strom)' : ' (Spannung)') }; }
function traceValue(tr) {
  const e = SIM.net && SIM.net.els.find(x => x.o === tr.o); if (!e) return NaN;
  if (tr.q === 'I') return e.Ipins ? e.Ipins[0] : NaN;
  const x = SIM.net.x, V = q => (q && x ? x[q - 1] : 0);
  if (e.type === 'VCC') return V(e.n[0]);
  if (e.type === 'OA' || e.type === 'CMP') return V(e.n[2]);
  return V(e.n[0]) - V(e.n[1] || 0);
}
function sampleTraces() {
  const win = SIM.speed * 4;
  for (const tr of SIM.traces) { tr.data.push([SIM.t, traceValue(tr)]); while (tr.data.length && tr.data[0][0] < SIM.t - win) tr.data.shift(); if (tr.data.length > 4000) tr.data.splice(0, tr.data.length - 4000); }
}
function drawScope() {
  let el = $('#scope');
  if (!SIM.on || !SIM.scopeOn || !SIM.traces.length) { if (el) el.remove(); return; }
  if (!el) { el = h('div', { id: 'scope' }, h('canvas', { id: 'scopecv' }), h('div', { id: 'scopeleg' })); $('#editor').append(el); }
  const cv = $('#scopecv'), d = window.devicePixelRatio || 1, W = el.clientWidth, H = 150;
  if (cv.width !== Math.round(W * d)) { cv.width = Math.round(W * d); cv.height = Math.round(H * d); cv.style.height = H + 'px'; }
  const c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.fillStyle = '#0b1220'; c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(148,163,184,.18)'; c.lineWidth = 1; c.beginPath();
  for (let i = 1; i < 10; i++) { c.moveTo(i * W / 10, 0); c.lineTo(i * W / 10, H); } for (let j = 1; j < 6; j++) { c.moveTo(0, j * H / 6); c.lineTo(W, j * H / 6); } c.stroke();
  c.strokeStyle = 'rgba(148,163,184,.4)'; c.beginPath(); c.moveTo(0, H / 2); c.lineTo(W, H / 2); c.stroke();
  const win = SIM.speed * 4, t0 = SIM.t - win, leg = [];
  for (const tr of SIM.traces) {
    let mx = 1e-12; for (const [, v] of tr.data) if (isFinite(v)) mx = Math.max(mx, Math.abs(v));
    const sc = (H / 2 - 8) / mx; c.strokeStyle = tr.col; c.lineWidth = 1.8; c.beginPath(); let st = false;
    for (const [t, v] of tr.data) { if (!isFinite(v)) continue; const X = (t - t0) / win * W, Y = H / 2 - v * sc; st ? c.lineTo(X, Y) : (c.moveTo(X, Y), st = true); }
    c.stroke();
    const last = tr.data.length ? tr.data[tr.data.length - 1][1] : NaN, unit = tr.q === 'I' ? 'A' : 'V';
    leg.push(`<span style="color:${tr.col}">● ${tr.name}: <b>${fmtSI(last, unit)}</b> <small>(max ${fmtSI(mx, unit)})</small></span>`);
  }
  c.fillStyle = '#94a3b8'; c.font = `11px ${FONT}`; c.fillText(fmtSI(win / 10, 's') + ' / Teil', 6, H - 6);
  $('#scopeleg').innerHTML = leg.join('');
}

/* ---------- Bedienleiste ---------- */
function buildSimbar() {
  let el = $('#simbar'); if (!el) { el = h('div', { id: 'simbar' }); $('#editor').append(el); }
  const speeds = [1e-5, 3e-5, 1e-4, 3e-4, 1e-3, 3e-3, 0.01, 0.03, 0.1, 0.3, 1, 3];
  const sl = h('input', { type: 'range', min: 0, max: speeds.length - 1, step: 1, value: speeds.reduce((bi, v, i) => Math.abs(Math.log(v / SIM.speed)) < Math.abs(Math.log(speeds[bi] / SIM.speed)) ? i : bi, 0),
    oninput: e => { SIM.speed = speeds[+e.target.value]; SIM.traces.forEach(t => t.data = []); updateSimbar(); } });
  el.replaceChildren(
    h('button', { class: 'btn sm primary', id: 'simplay', onclick: () => { SIM.run = !SIM.run; updateSimbar(); } }, SIM.run ? '⏸ Pause' : '▶ Weiter'),
    h('button', { class: 'btn sm', title: 'Zurücksetzen (Kondensatoren entladen)', onclick: () => { SIM.t = 0; rebuildSim(true); SIM.traces.forEach(t => t.data = []); } }, '⟲'),
    h('span', { class: 'simlbl' }, 'Zeit'), sl, h('span', { id: 'simspeed', class: 'simlbl' }),
    h('button', { class: 'btn sm' + (SIM.scopeOn ? ' on' : ''), onclick: () => { SIM.scopeOn = !SIM.scopeOn; buildSimbar(); } }, 'Oszilloskop'),
    h('span', { id: 'simt', class: 'simlbl' }),
    h('button', { class: 'btn sm danger', onclick: stopSim }, '■ Beenden'),
    h('div', { id: 'simwarn' }, SIM.warn), hint('Schalter anklicken schaltet um · Bauteil anklicken zeigt es im Oszilloskop · Werte rechts unter „Wert“'));
  updateSimbar();
}
function updateSimbar() {
  const s = $('#simspeed'), p = $('#simplay'), t = $('#simt');
  if (s) s.textContent = fmtSI(SIM.speed, 's') + ' pro Sekunde'; if (p) p.textContent = SIM.run ? '⏸ Pause' : '▶ Weiter'; if (t) t.textContent = 't = ' + fmtSI(SIM.t, 's');
}
