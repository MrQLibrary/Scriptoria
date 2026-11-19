"use strict";
/* ===== Zusatzwerkzeuge: „Petit Fourier“ und wissenschaftlicher Taschenrechner =====
   Beide als verschiebbare Fenster über der Fläche; in den Einstellungen einzeln abschaltbar. */

/* ---------- verschiebbares Fenster ---------- */
function floatPanel(id, title, onClose) {
  let el = $('#' + id);
  if (el) return el;
  const head = h('div', { class: 'fphead' }, h('b', {}, title), h('button', { class: 'tb fpclose', title: 'Schließen', onclick: onClose }, '✕'));
  el = h('div', { id, class: 'fpanel' }, head, h('div', { class: 'fpbody' }));
  $('#editor').append(el);
  head.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    const r = el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top; head.setPointerCapture(e.pointerId);
    const mv = ev => { el.style.left = clamp(ev.clientX - dx, 0, innerWidth - 80) + 'px'; el.style.top = clamp(ev.clientY - dy, 0, innerHeight - 40) + 'px'; el.style.right = 'auto'; el.style.transform = 'none'; };
    const up = () => { head.removeEventListener('pointermove', mv); head.removeEventListener('pointerup', up); };
    head.addEventListener('pointermove', mv); head.addEventListener('pointerup', up);
  });
  return el;
}
const fmtCalc = (v, d = 6) => {
  if (!isFinite(v)) return isNaN(v) ? 'Fehler' : (v > 0 ? '∞' : '−∞');
  if (v !== 0 && (Math.abs(v) >= 1e10 || Math.abs(v) < 1e-6)) { const [m, ex] = v.toExponential(d - 1).split('e'); return String(+m).replace('.', ',') + ' · 10^' + (+ex); }
  return String(+v.toPrecision(Math.min(15, d))).replace('.', ',');
};

/* ======================================================================
   Petit Fourier: Fourier-Reihe einer periodischen Funktion
   ====================================================================== */
const FOURIER = { f: 'sgn(sin(2*pi*t/T))', T: '1', N: 10, res: null };
const FOURIER_PRESETS = [
  ['Rechteck', 'sgn(sin(2*pi*t/T))'], ['Dreieck', '1-4*abs(frac(t/T+0.25)-0.5)'], ['Sägezahn', '2*frac(t/T)-1'],
  ['Einweg-Gleichrichtung', 'max0(sin(2*pi*t/T))'], ['Zweiweg-Gleichrichtung', 'abs(sin(2*pi*t/T))'],
  ['Sinus mit 3. Oberwelle', 'sin(2*pi*t/T)+0.3*sin(2*pi*3*t/T)'], ['Rechteckpuls (25 %)', 'frac(t/T)<0.25']
];
function toggleFourier() { S.fourierOpen = !S.fourierOpen; buildFourier(); refreshUI(); }
function fourierFn(src, T) {                             // f(t) mit Periode T; Vergleich „a<b“ liefert 1 oder 0
  const txt = src.replace(/\bT\b/g, '(' + T + ')').trim(), cmp = /^(.*?)(<=|>=|<|>)(.*)$/.exec(txt);
  if (cmp) { const a = parseExpr(cmp[1]), b = parseExpr(cmp[3]), op = cmp[2]; return t => { const x = a(t), y = b(t); return (op === '<' ? x < y : op === '>' ? x > y : op === '<=' ? x <= y : x >= y) ? 1 : 0; }; }
  return parseExpr(txt);
}
function fourierCoeffs(f, T, N) {
  const M = 4096, a = new Float64Array(N + 1), b = new Float64Array(N + 1), ys = new Float64Array(M);
  for (let j = 0; j < M; j++) { const v = f((j + 0.5) * T / M); ys[j] = isFinite(v) ? v : 0; }
  for (let k = 0; k <= N; k++) {
    let sa = 0, sb = 0; const w = 2 * Math.PI * k / M;
    for (let j = 0; j < M; j++) { const ph = w * (j + 0.5); sa += ys[j] * Math.cos(ph); sb += ys[j] * Math.sin(ph); }
    a[k] = (k ? 2 : 1) * sa / M; b[k] = k ? 2 * sb / M : 0;
  }
  const rows = [];
  for (let k = 0; k <= N; k++) {
    const A = k ? Math.hypot(a[k], b[k]) : a[0]; let phi = k ? Math.atan2(-b[k], a[k]) * 180 / Math.PI : 0; if (Math.abs(phi) < 1e-6 || Math.abs(Math.abs(phi) - 180) < 1e-6 && false) phi = Math.round(phi);
    if (Math.abs(a[k]) < 1e-9 * Math.max(1, Math.abs(A))) a[k] = 0; if (Math.abs(b[k]) < 1e-9 * Math.max(1, Math.abs(A))) b[k] = 0;
    rows.push({ k, f: k / T, a: a[k], b: b[k], A: Math.abs(A) < 1e-9 ? 0 : A, phi: Math.abs(A) < 1e-9 ? 0 : phi });
  }
  return { rows, ys, T };
}
function buildFourier() {
  if (!S.fourierOpen) { const el = $('#fourier'); if (el) el.remove(); return; }
  const el = floatPanel('fourier', 'Petit Fourier', toggleFourier), body = el.querySelector('.fpbody');
  const fIn = h('input', { type: 'text', value: FOURIER.f, spellcheck: false, style: 'width:100%' });
  const TIn = h('input', { type: 'text', value: FOURIER.T, style: 'width:90px' });
  const NIn = h('input', { type: 'number', min: 1, max: 50, value: FOURIER.N, style: 'width:64px' });
  const pre = h('select', { onchange: e => { if (e.target.value) { fIn.value = e.target.value; run(); } e.target.value = ''; } },
    h('option', { value: '' }, 'Vorlage …'), ...FOURIER_PRESETS.map(([l, v]) => h('option', { value: v }, l)));
  const err = h('p', { class: 'err' }), cv = h('canvas', { class: 'fcv' }), cv2 = h('canvas', { class: 'fcv' }), tbl = h('div', { class: 'ftbl' }), info = h('div', { class: 'muted' });
  const run = () => {
    FOURIER.f = fIn.value; FOURIER.T = TIn.value; FOURIER.N = clamp(parseInt(NIn.value) || 10, 1, 50);
    try {
      const T = parseSI(TIn.value.replace(/s\s*$/, ''), 1); if (!(T > 0)) throw new Error('Periode T muss größer als 0 sein.');
      const f = fourierFn(fIn.value, T); FOURIER.res = fourierCoeffs(f, T, FOURIER.N); err.textContent = '';
      drawFourier(cv, cv2, FOURIER.res); fillFourierTable(tbl, FOURIER.res);
      info.textContent = `Grundfrequenz f₁ = 1/T = ${fmtSI(1 / T, 'Hz')}`;
    } catch (e) { err.textContent = e.message; FOURIER.res = null; tbl.replaceChildren(); }
  };
  fIn.addEventListener('keydown', e => { if (e.key === 'Enter') run(); e.stopPropagation(); });
  [TIn, NIn].forEach(x => x.addEventListener('keydown', e => { if (e.key === 'Enter') run(); e.stopPropagation(); }));
  body.replaceChildren(
    h('div', { class: 'frow' }, h('label', {}, 'f(t) ='), fIn),
    h('div', { class: 'frow' }, h('label', {}, 'Periode T'), TIn, h('label', {}, 'Harmonische'), NIn, pre),
    hint('Variable t, Periode T. Erlaubt: sin, cos, exp, abs, sgn, frac, floor, pi … Beispiel: sin(2*pi*50*t) mit T = 20m'),
    h('div', { class: 'frow' }, h('button', { class: 'btn sm primary', onclick: run }, 'Berechnen'), h('button', { class: 'btn sm', onclick: () => insertFourier(cv2) }, 'Spektrum ins Board'), info),
    err, h('div', { class: 'fcap' }, 'Zeitverlauf (grau) und Summe der Harmonischen (blau)'), cv, h('div', { class: 'fcap' }, 'Amplitudenspektrum'), cv2, tbl);
  run();
}
function drawFourier(cv, cv2, R) {
  const d = window.devicePixelRatio || 1, W = 380, H = 120;
  for (const c of [cv, cv2]) { c.width = W * d; c.height = H * d; c.style.width = W + 'px'; c.style.height = H + 'px'; }
  const dark = themeDark(), fg = dark ? '#e5e7eb' : '#1f2937', gr = dark ? '#374151' : '#e5e7eb';
  // Zeitverlauf über zwei Perioden + Teilsumme
  let c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, W, H);
  const M = R.ys.length, synth = t => R.rows.reduce((s, r) => s + (r.k ? r.a * Math.cos(2 * Math.PI * r.k * t / R.T) + r.b * Math.sin(2 * Math.PI * r.k * t / R.T) : r.a), 0);
  let mx = 1e-9; for (const v of R.ys) mx = Math.max(mx, Math.abs(v)); mx *= 1.15;
  const X = t => 8 + (W - 16) * t / (2 * R.T), Y = v => H / 2 - v / mx * (H / 2 - 6);
  c.strokeStyle = gr; c.beginPath(); c.moveTo(8, H / 2); c.lineTo(W - 8, H / 2); c.moveTo(X(R.T), 4); c.lineTo(X(R.T), H - 4); c.stroke();
  c.strokeStyle = '#9ca3af'; c.lineWidth = 2; c.beginPath();
  for (let j = 0; j < 2 * M; j += 4) { const t = (j + 0.5) * R.T / M, v = R.ys[j % M]; j ? c.lineTo(X(t), Y(v)) : c.moveTo(X(t), Y(v)); } c.stroke();
  c.strokeStyle = '#2563eb'; c.lineWidth = 1.6; c.beginPath();
  for (let j = 0; j <= 400; j++) { const t = j / 400 * 2 * R.T; j ? c.lineTo(X(t), Y(synth(t))) : c.moveTo(X(t), Y(synth(t))); } c.stroke();
  // Spektrum
  c = cv2.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, W, H);
  const rows = R.rows, amax = Math.max(1e-9, ...rows.map(r => Math.abs(r.A))), n = rows.length, bw = (W - 30) / n;
  c.strokeStyle = gr; c.beginPath(); c.moveTo(20, H - 18); c.lineTo(W - 6, H - 18); c.stroke();
  c.font = `10px ${FONT}`; c.textAlign = 'center'; c.fillStyle = fg;
  rows.forEach((r, i) => {
    const x = 22 + i * bw + bw / 2, hh = Math.abs(r.A) / amax * (H - 34);
    c.fillStyle = r.k ? '#2563eb' : '#9ca3af'; c.fillRect(x - Math.max(2, bw * 0.3), H - 18 - hh, Math.max(4, bw * 0.6), hh);
    c.fillStyle = fg; if (n <= 26 || i % 2 === 0) c.fillText(String(r.k), x, H - 6);
  });
  c.textAlign = 'left'; c.fillText('n', W - 14, H - 6);
}
function fillFourierTable(tbl, R) {
  const amax = Math.max(1e-9, ...R.rows.map(r => Math.abs(r.A)));
  const rows = R.rows.filter(r => Math.abs(r.A) > amax * 1e-4);
  tbl.replaceChildren(h('table', {},
    h('tr', {}, h('th', {}, 'n'), h('th', {}, 'f'), h('th', {}, 'Amplitude Aₙ'), h('th', {}, 'Phase φₙ'), h('th', {}, 'aₙ'), h('th', {}, 'bₙ')),
    ...rows.map(r => h('tr', {}, h('td', {}, String(r.k)), h('td', {}, r.k ? fmtSI(r.f, 'Hz') : '0 (Gleichanteil)'), h('td', {}, fmtCalc(r.A, 4)), h('td', {}, r.k ? fmtCalc(r.phi, 3) + '°' : '—'),
      h('td', {}, fmtCalc(Math.abs(r.a) < amax * 1e-6 ? 0 : r.a, 4)), h('td', {}, fmtCalc(Math.abs(r.b) < amax * 1e-6 ? 0 : r.b, 4))))),
    h('p', { class: 'muted' }, 'f(t) = A₀ + Σ Aₙ · cos(2π·n·t/T + φₙ) = a₀ + Σ [aₙ cos(…) + bₙ sin(…)]'));
}
function insertFourier(cv2) {
  if (!FOURIER.res) return;
  const W = 760, H = 360, c = h('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
  const rows = FOURIER.res.rows, amax = Math.max(1e-9, ...rows.map(r => Math.abs(r.A))), n = rows.length, bw = (W - 90) / n;
  g.strokeStyle = '#111'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(60, 20); g.lineTo(60, H - 50); g.lineTo(W - 20, H - 50); g.stroke();
  g.font = '15px Segoe UI, sans-serif'; g.fillStyle = '#111'; g.textAlign = 'right';
  for (let q = 0; q <= 4; q++) { const y = H - 50 - q / 4 * (H - 80); g.fillText(fmtCalc(amax * q / 4, 3), 54, y + 5); g.strokeStyle = '#e5e7eb'; g.beginPath(); g.moveTo(61, y); g.lineTo(W - 20, y); g.stroke(); }
  g.textAlign = 'center';
  rows.forEach((r, i) => { const x = 66 + i * bw + bw / 2, hh = Math.abs(r.A) / amax * (H - 80); g.fillStyle = r.k ? '#2563eb' : '#9ca3af'; g.fillRect(x - bw * 0.3, H - 50 - hh, bw * 0.6, hh); g.fillStyle = '#111'; g.fillText(String(r.k), x, H - 30); });
  g.fillText('n  (f = n / T)', W / 2, H - 8); g.save(); g.translate(16, H / 2 - 20); g.rotate(-Math.PI / 2); g.fillText('Aₙ', 0, 0); g.restore();
  g.textAlign = 'left'; g.fillText('f(t) = ' + FOURIER.f + ',  T = ' + FOURIER.T, 70, 16);
  const pre = snapshot(), vc = viewCenter(), o = makeImgObj(c.toDataURL('image/png'), W, H, vc.x - W / 2, vc.y - H / 2, W);
  S.objs.push(o); S.sels = [o]; record(pre); render(); refreshUI(); toast('Spektrum eingefügt.');
}

/* ======================================================================
   Wissenschaftlicher Taschenrechner
   ====================================================================== */
const CALC = { expr: '', ans: 0, deg: true, hist: [] };
function toggleCalc() { S.calcOpen = !S.calcOpen; buildCalc(); refreshUI(); }
function calcEval(src) {
  if (!src.trim()) return NaN;
  const s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/EXP/g, '*10^');
  return parseExpr(s, { deg: CALC.deg, vars: { ans: CALC.ans } })(0);
}
function buildCalc() {
  if (!S.calcOpen) { const el = $('#calc'); if (el) el.remove(); return; }
  const el = floatPanel('calc', 'Taschenrechner', toggleCalc), body = el.querySelector('.fpbody');
  const inp = h('input', { type: 'text', class: 'cin', value: CALC.expr, spellcheck: false, placeholder: '0' });
  const out = h('div', { class: 'cout' }), hist = h('div', { class: 'chist' });
  const preview = () => { CALC.expr = inp.value; try { const v = calcEval(inp.value); out.textContent = isNaN(v) ? '' : '= ' + fmtCalc(v, 10); out.classList.remove('err'); } catch (e) { out.textContent = ''; } };
  const showHist = () => hist.replaceChildren(...CALC.hist.slice(-4).map(([e, v]) => h('div', { onclick: () => { inp.value = e; preview(); } }, e + ' = ' + fmtCalc(v, 10))));
  const equals = () => {
    try { const v = calcEval(inp.value); if (isNaN(v)) throw new Error('Kein Ergebnis'); CALC.hist.push([inp.value, v]); CALC.ans = v; inp.value = String(+v.toPrecision(12)).replace('.', ','); out.textContent = '= ' + fmtCalc(v, 10); showHist(); }
    catch (e) { out.textContent = e.message; out.classList.add('err'); }
    CALC.expr = inp.value; inp.focus();
  };
  const ins = t => { const a = inp.selectionStart ?? inp.value.length, b = inp.selectionEnd ?? a; inp.value = inp.value.slice(0, a) + t + inp.value.slice(b); const p = a + t.length - (t.endsWith('()') ? 1 : 0); inp.focus(); inp.setSelectionRange(p, p); preview(); };
  inp.addEventListener('input', preview);
  inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); } else if (e.key === 'Escape') { inp.value = ''; preview(); } });
  const degBtn = h('button', { class: 'btn sm', onclick: () => { CALC.deg = !CALC.deg; degBtn.textContent = CALC.deg ? 'DEG' : 'RAD'; preview(); } }, CALC.deg ? 'DEG' : 'RAD');
  const K = (l, act, cls = '') => h('button', { class: 'ck ' + cls, onclick: act }, l);
  const keys = [
    ['sin', () => ins('sin()')], ['cos', () => ins('cos()')], ['tan', () => ins('tan()')], ['π', () => ins('π')], ['e', () => ins('e')],
    ['sin⁻¹', () => ins('asin()')], ['cos⁻¹', () => ins('acos()')], ['tan⁻¹', () => ins('atan()')], ['(', () => ins('(')], [')', () => ins(')')],
    ['ln', () => ins('ln()')], ['log', () => ins('log()')], ['√', () => ins('sqrt()')], ['x²', () => ins('^2')], ['xʸ', () => ins('^')],
    ['eˣ', () => ins('exp()')], ['10ˣ', () => ins('10^')], ['n!', () => ins('!')], ['|x|', () => ins('abs()')], ['EXP', () => ins('EXP')],
    ['7', () => ins('7'), 'n'], ['8', () => ins('8'), 'n'], ['9', () => ins('9'), 'n'], ['⌫', () => { const a = inp.selectionStart ?? inp.value.length; if (a > 0) { inp.value = inp.value.slice(0, a - 1) + inp.value.slice(a); inp.setSelectionRange(a - 1, a - 1); } inp.focus(); preview(); }, 'op'], ['C', () => { inp.value = ''; inp.focus(); preview(); }, 'op'],
    ['4', () => ins('4'), 'n'], ['5', () => ins('5'), 'n'], ['6', () => ins('6'), 'n'], ['×', () => ins('×'), 'op'], ['÷', () => ins('÷'), 'op'],
    ['1', () => ins('1'), 'n'], ['2', () => ins('2'), 'n'], ['3', () => ins('3'), 'n'], ['+', () => ins('+'), 'op'], ['−', () => ins('−'), 'op'],
    ['0', () => ins('0'), 'n'], [',', () => ins(','), 'n'], ['Ans', () => ins('ans'), 'n'], ['Einfügen', () => calcToBoard(inp.value), 'op sm'], ['=', equals, 'eq']
  ];
  body.replaceChildren(h('div', { class: 'cdisp' }, hist, inp, out), h('div', { class: 'crow' }, degBtn, hint('Tastatur geht auch: Enter rechnet, Esc löscht')), h('div', { class: 'ckeys' }, ...keys.map(([l, a, c]) => K(l, a, c))));
  preview(); showHist(); setTimeout(() => inp.focus(), 0);
}
function calcToBoard(src) {
  let v; try { v = calcEval(src); } catch (e) { return; } if (isNaN(v)) return;
  const pre = snapshot(), vc = viewCenter(), o = { ...newText({ x: vc.x, y: vc.y }), text: src.replace(/\*/g, '·') + ' = ' + fmtCalc(v, 10) };
  measureTextObj(o); S.objs.push(o); S.sels = [o]; record(pre); render(); refreshUI();
}
