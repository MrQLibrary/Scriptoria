"use strict";
/* ===== Oberfläche des Editors ===== */
const IC = {
  select: 'M5 3l12 8-5 1.5L9.5 18z', hand: 'M8 13V6a1.5 1.5 0 013 0v5m0-1V4.5a1.5 1.5 0 013 0V11m0-4a1.5 1.5 0 013 0v7a6 6 0 01-6 6h-1a6 6 0 01-5-3l-2-3.5a1.5 1.5 0 012.5-1.5L8 14',
  pen: 'M4 20l1-4L16 5a2 2 0 013 3L8 19z M14 7l3 3', eraser: 'M20 20H9L3.5 14.5a2 2 0 010-2.8L12 3.2a2 2 0 012.800 0l5 5a2 2 0 010 2.8L11 20',
  line: 'M5 19L19 5', arrow: 'M5 19L19 5 M10 5h9v9', rect: 'M4 6h16v12H4z', ellipse: 'M3 12a9 6 0 1 0 18 0a9 6 0 1 0 -18 0',
  text: 'M5 6V4h14v2 M12 4v16 M9 20h6', note: 'M4 4h16v11l-5 5H4z M15 20v-5h5', image: 'M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4 M9 9.5h.01',
  compass: 'M12 3v4 M12 7L6 21 M12 7l6 14 M8 16h8', ruler: 'M3 15L15 3l6 6L9 21z M7 13l2 2 M10 10l2 2 M13 7l2 2',
  laser: 'M12 8a4 4 0 100 8 4 4 0 000-8z M12 2v3 M12 19v3 M2 12h3 M19 12h3', chip: 'M7 7h10v10H7z M10 3v4 M14 3v4 M10 17v4 M14 17v4 M3 10h4 M3 14h4 M17 10h4 M17 14h4',
  undo: 'M9 14L4 9l5-5 M4 9h10a6 6 0 010 12h-3', redo: 'M15 14l5-5-5-5 M20 9H10a6 6 0 000 12h3', home: 'M3 11l9-8 9 8 M5 10v10h5v-6h4v6h5V10',
  grid: 'M4 4h16v16H4z M4 12h16 M12 4v16', snap: 'M5 5h4v4H5z M15 15h4v4h-4z M9 7h8v8', gear: 'M19.13 10.03 L21.86 10.31 L21.86 13.69 L19.13 13.97 L18.44 15.65 L20.17 17.77 L17.77 20.17 L15.65 18.44 L13.97 19.13 L13.69 21.86 L10.31 21.86 L10.03 19.13 L8.35 18.44 L6.23 20.17 L3.83 17.77 L5.56 15.65 L4.87 13.97 L2.14 13.69 L2.14 10.31 L4.87 10.03 L5.56 8.35 L3.83 6.23 L6.23 3.83 L8.35 5.56 L10.03 4.87 L10.31 2.14 L13.69 2.14 L13.97 4.87 L15.65 5.56 L17.77 3.83 L20.17 6.23 L18.44 8.35z M12 15a3 3 0 100-6 3 3 0 000 6z',
  moon: 'M20 14.500A8 8 0 019.500 4 8 8 0 1020 14.500z', sun: 'M12 8a4 4 0 100 8 4 4 0 000-8z M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.500 1.500 M17.500 17.500L19 19 M5 19l1.500-1.500 M17.500 6.500L19 5',
  export: 'M12 3v12 M7 8l5-5 5 5 M4 15v5h16v-5',
  full: 'M4 9V4h5 M15 4h5v5 M20 15v5h-5 M9 20H4v-5', fullx: 'M9 4v5H4 M20 9h-5V4 M15 20v-5h5 M4 15h5v5',
  panels: 'M3 4h18v16H3z M8 4v16 M16 4v16', panelsoff: 'M3 4h18v16H3z M3 3l18 18',
  info: 'M12 8h.01 M11 12h1v5h1 M12 3a9 9 0 100 18 9 9 0 000-18z', chev: 'M9 6l6 6-6 6',
  geo: 'M3 18h18L12 9z M12 18v-3', parab: 'M4 4c3 14 13 14 16 0 M3 18h18', wire: 'M3 17h6V7h6v10h6 M3 17h.01 M21 17h.01',
  latex: 'M4 6h7 M7.5 6v12 M13 9l7 9 M20 9l-7 9', play: 'M7 4l13 8-13 8z', present: 'M3 4h18v12H3z M8 20h8 M12 16v4', plot: 'M4 20V4 M4 20h16 M6 16c3-9 6-9 8-4s4 4 6-6', phasor: 'M4 19h16 M4 19L17 7 M17 7l-5 1 M17 7l-1 5 M4 19l9-1', diagram: 'M3 4h18v16H3z M3 9h18 M3 14h18 M9 4v16 M15 4v16', timer: 'M12 8v5l3 2 M10 2h4 M12 4a9 9 0 100 18 9 9 0 000-18z', scroll: 'M6 4h11a3 3 0 013 3v1h-4 M6 4a3 3 0 00-3 3v1h3 M6 4v13a3 3 0 003 3h9a3 3 0 003-3v-1H9v1a3 3 0 01-3 3', save: 'M5 3h12l4 4v14H5z M8 3v6h8V3 M8 21v-7h8v7', fit: 'M4 9V4h5 M20 9V4h-5 M4 15v5h5 M20 15v5h-5'
};
const ico = n => `<svg viewBox="0 0 24 24">${IC[n].split(' M').map((d, i) => `<path d="${i ? 'M' : ''}${d}"/>`).join('')}</svg>`;
const tbBtn = (icon, title, on, fn, extra) => h('button', { class: 'tb' + (on ? ' on' : ''), title, html: ico(icon) + (extra || ''), onclick: fn });

const TOOLS = [
  ['select', 'select', 'Auswahl (V)'], ['hand', 'hand', 'Verschieben (H)'], '-',
  ['pen', 'pen', 'Stift (P)'], ['eraser', 'eraser', 'Radierer (E)'], '-',
  ['line', 'line', 'Linie (L)'], ['arrow', 'arrow', 'Pfeil (A)'], ['rect', 'rect', 'Rechteck (R)'], ['ellipse', 'ellipse', 'Ellipse (O)'], '-',
  ['text', 'text', 'Text (T)'], ['note', 'note', 'Haftnotiz (N)'], ['img', 'image', 'Bild oder PDF einfügen'], '-',
  ['compass', 'compass', 'Zirkel (C)'], ['ruler', 'ruler', 'Lineal 1:1 (U)'], ['geo', 'geo', 'Geodreieck (G)'], ['parab', 'parab', 'Parabel (K)'], ['laser', 'laser', 'Laserpointer (J)'], '-',
  ['plot', 'plot', 'Funktionsplotter & Koordinatensystem'], ['phasor', 'phasor', 'Zeigerdiagramm'], ['diagram', 'diagram', 'Diagramm-Vorlagen'], ['timer', 'timer', 'Stoppuhr'], '-',
  ['elec', 'chip', 'Elektronik-Baukasten (B)'], ['wire', 'wire', 'Leitung ziehen (W)'], ['sim', 'play', 'Schaltung simulieren']
];
const PALETTE = (() => {
  const hues = [['991b1b', 'dc2626', 'f87171', 'fca5a5', 'fecaca'], ['9a3412', 'ea580c', 'fb923c', 'fdba74', 'fed7aa'], ['a16207', 'eab308', 'facc15', 'fde047', 'fef08a'], ['166534', '16a34a', '4ade80', '86efac', 'bbf7d0'],
    ['115e59', '0d9488', '2dd4bf', '5eead4', '99f6e4'], ['1e3a8a', '2563eb', '60a5fa', '93c5fd', 'bfdbfe'], ['581c87', '9333ea', 'c084fc', 'd8b4fe', 'e9d5ff'], ['9d174d', 'db2777', 'f472b6', 'f9a8d4', 'fbcfe8']];
  const out = ['@ink', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff', '#78350f'];
  for (let r = 0; r < 5; r++) for (const hu of hues) out.push('#' + hu[r]);
  return out;
})();
const LS = [['solid', 'Durchgezogen', '<line x1="2" y1="8" x2="98" y2="8"/>'], ['dashed', 'Gestrichelt', '<line x1="2" y1="8" x2="98" y2="8" stroke-dasharray="12 7"/>'],
  ['dotted', 'Gepunktet', '<line x1="2" y1="8" x2="98" y2="8" stroke-dasharray="1 7" stroke-linecap="round"/>'], ['dashdot', 'Strich-Punkt', '<line x1="2" y1="8" x2="98" y2="8" stroke-dasharray="14 6 1 6" stroke-linecap="round"/>']];

/* ---------- Stifte (Leiste unten) ---------- */
function penSVG(p, on) {
  if (window.histPenSVG) { const s = histPenSVG(p); if (s) return s; }
  const ink = p.color === '@ink' ? (themeDark() ? '#f2f2f2' : '#1b1b1b') : p.color, k = p.kind;
  const tip = `<path d="M17 44h8l-4 14z" fill="${ink}"/>`;
  const bodies = {
    pencil: `<rect x="14" y="8" width="14" height="30" rx="1" fill="#f6c453"/><path d="M14 8h14v6H14z" fill="#e57373"/><path d="M14 38l7 14 7-14z" fill="#f0d8b0"/><path d="M18.500 47l2.500 5 2.500-5z" fill="${ink}"/>`,
    ballpoint: `<rect x="15" y="6" width="12" height="36" rx="3" fill="#e5e7eb" stroke="#9ca3af"/><rect x="15" y="6" width="12" height="9" rx="3" fill="${ink}"/><path d="M17 42h8l-2 12h-4z" fill="#9ca3af"/><circle cx="21" cy="55" r="1.500" fill="${ink}"/>`,
    fountain: `<rect x="14" y="6" width="14" height="34" rx="4" fill="#1f2a44"/><rect x="14" y="30" width="14" height="4" fill="#d4af37"/><path d="M15 40h12l-6 17z" fill="#d4af37"/><path d="M21 46v7" stroke="#1f2a44"/><circle cx="21" cy="51" r="1.200" fill="${ink}"/>`,
    marker: `<rect x="13" y="4" width="16" height="22" rx="3" fill="${ink}"/><rect x="12" y="24" width="18" height="22" rx="3" fill="#f3f4f6" stroke="#9ca3af"/><path d="M14 46h14l-3 10h-8z" fill="${ink}"/>`,
    highlighter: `<rect x="12" y="6" width="18" height="30" rx="3" fill="#e5e7eb" stroke="#9ca3af"/><rect x="12" y="6" width="18" height="8" rx="3" fill="${ink}" opacity=".8"/><path d="M13 36h16l-1 6H14z" fill="#9ca3af"/><path d="M14 42h14l-2 14H16z" fill="${ink}"/>`
  };
  return `<svg viewBox="0 0 42 68">${bodies[k] || bodies.ballpoint}</svg>`;
}
function savePens() { clearTimeout(savePens.t); savePens.t = setTimeout(() => saveSettings(), 500); }

/* ---------- Eigenschaftswerte ---------- */
function propCtx() { return S.sels.length && !['pen', 'eraser', 'hand'].includes(S.tool) ? 'sel' : S.tool === 'pen' ? 'pen' : 'style'; }
function getVal(key) {
  const m = propCtx();
  if (m === 'sel') {
    const o = S.sels[0];
    if (key === 'color') return o.c; if (key === 'ls') return o.ls || 'solid'; if (key === 'fill') return !!o.fill;
    if (key === 'size') return o.size || (o.type === 'note' ? 18 : S.style.size);
    if (key === 'font') return o.font || 'Segoe UI'; if (key === 'bold') return !!o.bold; if (key === 'italic') return !!o.italic;
    if (key === 'noteSize') return o.w; if (key === 'noteW') return Math.round(o.w); if (key === 'noteH') return Math.round(o.h);
    if (key === 'width') { const k = widthKey(o); return k ? o[k] : S.style.width; }
  }
  if (m === 'pen') { const p = curPen(); return { color: p.color, width: p.width, ls: p.ls }[key]; }
  return key === 'size' && S.tool === 'note' ? S.style.noteText : S.style[key];
}
const STYLE_KEYS = ['color', 'width', 'ls', 'fill', 'size', 'font', 'bold', 'italic', 'noteSize'];
function setVal(key, val) {
  const m = propCtx();
  if (m === 'sel') {
    applyProp(key, val);                                   // gilt sofort für das ausgewählte bzw. gerade bearbeitete Objekt …
    const noteCtx = S.sels.length && S.sels.every(o => o.type === 'note');
    if (STYLE_KEYS.includes(key)) { if (key === 'size' && noteCtx) S.style.noteText = val; else S.style[key] = val; }   // … und als Vorgabe für das nächste
    if (S.editing) layoutEditor();
  } else if (m === 'pen') { const p = curPen(); if (key === 'color') p.color = val; else if (key === 'width') p.width = val; else if (key === 'ls') p.ls = val; savePens(); updateCursor(); }
  else { if (key === 'size' && S.tool === 'note') S.style.noteText = val; else S.style[key] = val; if (key === 'color' && S.tool === 'laser') S.laser.color = val; }
  render();
}

/* ---------- Eigenschaften-Leiste ---------- */
function secColor(label = 'Farbe') {
  const cur = getVal('color');
  const pal = h('div', { class: 'pal' }, PALETTE.map(c => h('button', { class: 'sw' + (cur === c ? ' on' : ''), title: c === '@ink' ? 'Automatisch (schwarz/weiß)' : c,
    style: c === '@ink' ? 'background:linear-gradient(135deg,#1b1b1b 50%,#f2f2f2 50%)' : `background:${c}`, onclick: () => { setVal('color', c); refreshUI(); } })));
  const pick = h('input', { type: 'color', value: /^#[0-9a-f]{6}$/i.test(cur) ? cur : '#000000', style: 'width:100%;height:28px;margin-top:6px;padding:0;border:1px solid var(--line);border-radius:6px;background:transparent', title: 'Eigene Farbe', oninput: e => setVal('color', e.target.value), onchange: () => refreshUI() });
  return [h('h3', {}, label), pal, pick];
}
function secWidth(label = 'Dicke') {
  const out = h('span', {}, String(getVal('width'))), r = h('input', { type: 'range', min: '1', max: '40', value: getVal('width'), oninput: e => { out.textContent = e.target.value; setVal('width', +e.target.value); } });
  return [h('h3', {}, label), h('div', { class: 'row' }, r, out)];
}
function secLs() {
  const cur = getVal('ls'), dis = propCtx() === 'pen' && curPen().kind === 'fountain';
  return [h('h3', {}, 'Linientyp'), h('div', { class: 'seg' }, LS.map(([v, t, svg]) => h('button', { class: 'lsb' + (cur === v ? ' on' : ''), title: dis ? 'Beim Füllfederhalter nicht verfügbar' : t, disabled: dis, html: `<svg viewBox="0 0 100 16">${svg}</svg>`, onclick: () => { setVal('ls', v); refreshUI(); } })))];
}
function syncRot() { const i = $('#p-rot'); if (i && S.sels[0]) i.value = Math.round(((deg(S.sels[0].rot || 0) % 360) + 360) % 360); }
function syncProps() {}
function syncHist() { const u = $('#b-undo'), r = $('#b-redo'); if (u) u.disabled = !S.hist.length; if (r) r.disabled = !S.fut.length; }

function buildProps() {
  const P = $('#props'), t = S.tool, o = S.sels[0], many = S.sels.length > 1, kids = [];
  P.onmousedown = e => { if (S.editing && !/^(INPUT|SELECT|TEXTAREA|OPTION)$/.test(e.target.tagName)) e.preventDefault(); };   // Eingabefokus beim Farbwechsel behalten
  const title = { select: S.sels.length ? (many ? S.sels.length + ' Objekte' : 'Auswahl') : 'Auswahl', hand: 'Verschieben', pen: curPen().name, eraser: 'Radierer', line: 'Linie', arrow: 'Pfeil', rect: 'Rechteck', ellipse: 'Ellipse',
    text: 'Text', note: 'Haftnotiz', compass: 'Zirkel', laser: 'Laserpointer', place: 'Bauteil platzieren', parab: 'Parabel', wire: 'Leitung ziehen' }[t] || '';
  const htool = curTpl() && curTpl().tools && curTpl().tools[t];
  kids.push(h('div', { class: 'phead' }, h('h3', {}, htool ? htool.replace(/ \(.\)$/, '') : title), h('button', { class: 'tb pcol', title: S.ui.propsCollapsed ? 'Eigenschaften aufklappen' : 'Eigenschaften einklappen', html: ico('chev'), onclick: () => { S.ui.propsCollapsed = !S.ui.propsCollapsed; saveUI(); refreshUI(); } })));
  P.classList.toggle('collapsed', !!S.ui.propsCollapsed);
  if (S.ui.propsCollapsed) { P.replaceChildren(...kids.filter(Boolean)); return; }
  if (curTpl() && curTpl().objects === 'wax') kids.push(h('h3', {}, 'Wachstafeln'), h('div', { class: 'seg' }, ['I', 'II', 'III', 'IV'].map((l, i) => h('button', { class: (S.tablet || 0) === i ? 'on' : '', title: 'Tafel ' + l + ' anzeigen (Bild ↑/↓)', onclick: () => goTablet(i) }, l))));
  if (curTpl() && t === 'pen') kids.push(hint(curTpl().desc), ...secColor(), ...secWidth());
  else if (t === 'pen') kids.push(...secColor(), ...secWidth(), ...secLs());
  else if (t === 'eraser') {
    kids.push(h('h3', {}, 'Größe'), h('div', { class: 'seg' }, [['Klein', 6], ['Mittel', 14], ['Groß', 28], ['Sehr groß', 50]].map(([l, v]) => h('button', { class: S.eraser.size === v ? 'on' : '', onclick: () => { S.eraser.size = v; refreshUI(); } }, l))),
      h('h3', {}, 'Modus'), h('div', { class: 'seg' }, [['Teile', 'pixel'], ['Ganze Striche', 'object']].map(([l, v]) => h('button', { class: S.eraser.mode === v ? 'on' : '', onclick: () => { S.eraser.mode = v; refreshUI(); } }, l))),
      hint('Bilder und PDFs bleiben beim Radieren erhalten.'));
  } else if (['line', 'arrow', 'rect', 'ellipse', 'parab'].includes(t) || (t === 'select' && S.sels.length && S.sels.some(x => widthKey(x)))) {
    kids.push(...secColor('Linienfarbe'), ...secWidth(), ...secLs());
    if (t === 'rect' || t === 'ellipse' || (t === 'select' && S.sels.some(x => x.type === 'rect' || x.type === 'ellipse'))) {
      const fill = !!getVal('fill'), cb = h('input', { type: 'checkbox' }); cb.checked = fill; cb.onchange = () => { setVal('fill', cb.checked); refreshUI(); };
      kids.push(h('h3', {}, 'Füllung'), h('label', { class: 'row' }, cb, 'Form füllen (in Linienfarbe)'));
    }
  } else if (t === 'text' || t === 'note' || (S.sels.length && S.sels.every(x => x.type === 'text' || x.type === 'note'))) {
    const isNote = t === 'note' || (o && o.type === 'note'), isText = t === 'text' || (o && o.type === 'text');
    kids.push(...secColor(isNote ? 'Notizfarbe' : 'Textfarbe'), h('h3', {}, 'Schrift'));
    const fsel = h('select', { onchange: e => setVal('font', e.target.value) }, Object.entries(FONTS).map(([k, l]) => { const op = h('option', { value: k }, l); if (getVal('font') === k) op.selected = true; return op; }));
    kids.push(h('div', { class: 'row' }, fsel));
    const sz = h('input', { type: 'number', min: '8', max: '200', value: getVal('size'), onchange: e => setVal('size', clamp(+e.target.value || 26, 8, 200)) });
    kids.push(h('div', { class: 'row' }, sz, 'px',
      h('button', { class: 'btn sm' + (getVal('bold') ? ' primary' : ''), style: 'font-weight:700', title: 'Fett', onclick: () => { setVal('bold', !getVal('bold')); refreshUI(); } }, 'F'),
      h('button', { class: 'btn sm' + (getVal('italic') ? ' primary' : ''), style: 'font-style:italic', title: 'Kursiv', onclick: () => { setVal('italic', !getVal('italic')); refreshUI(); } }, 'K')));
    if (isNote) {
      kids.push(h('h3', {}, 'Notizgröße'), h('div', { class: 'seg' }, [['Klein', 140], ['Mittel', 200], ['Groß', 280], ['Sehr groß', 380]].map(([l, v]) =>
        h('button', { class: Math.round(getVal('noteSize') || 0) === v ? 'on' : '', onclick: () => { setVal('noteSize', v); refreshUI(); } }, l))));
      if (S.sels.length === 1 && o.type === 'note') kids.push(h('div', { class: 'row' }, 'B ', h('input', { type: 'number', min: '60', max: '2000', value: Math.round(o.w), onchange: e => setVal('noteW', +e.target.value || 200) }), ' H ', h('input', { type: 'number', min: '60', max: '2000', value: Math.round(o.h), onchange: e => setVal('noteH', +e.target.value || 200) })));
    }
  } else if (t === 'compass') {
    const k = S.compass, rcm = () => (compassRadius() * S.view.z / S.settings.pxPerCm).toFixed(1), ro = h('b', {}, rcm() + ' cm');
    const ang = h('input', { type: 'range', min: '5', max: '120', value: k.angle, oninput: e => { k.angle = +e.target.value; av.textContent = k.angle + '°'; ro.textContent = rcm() + ' cm'; render(); } }), av = h('span', {}, k.angle + '°');
    const leg = h('input', { type: 'number', min: '2', max: '30', step: '0.5', value: k.leg, onchange: e => { k.leg = clamp(+e.target.value || 10, 2, 30); ro.textContent = rcm() + ' cm'; render(); } });
    kids.push(h('h3', {}, 'Öffnungswinkel'), h('div', { class: 'row' }, ang, av), h('h3', {}, 'Schenkellänge'), h('div', { class: 'row' }, leg, 'cm'), h('div', { class: 'row' }, 'Radius: ', ro),
      hint(k.cx == null ? 'Mittelpunkt setzen, dann den roten Punkt ziehen.' : 'Roten Punkt ziehen zeichnet den Bogen.'),
      ...secColor('Strichfarbe'), ...secWidth(), ...secLs());
  } else if (t === 'laser' && htool) {
    kids.push(null);
  } else if (t === 'laser') {
    kids.push(h('h3', {}, 'Farbe'), h('div', { class: 'pal', style: 'grid-template-columns:repeat(4,1fr)' }, ['#ff2d2d', '#22c55e', '#3b82f6', '#f59e0b'].map(c => h('button', { class: 'sw' + (S.laser.color === c ? ' on' : ''), style: `background:${c}`, onclick: () => { S.laser.color = c; refreshUI(); } }))),
      null);
  } else if (t === 'place') {
    if (S.armedCirc) kids.push(h('p', {}, S.armedCirc.name), hint('Klick setzt ab · Q dreht · Esc bricht ab'));
    else { const s = SYM[S.armed]; kids.push(h('p', {}, s ? s.name : '—'), hint('Klick setzt · Q dreht · Esc beendet'), ...secColor('Farbe')); }
  } else if (t === 'select' && !S.sels.length) kids.push(hint('Anklicken oder Rahmen aufziehen.'));
  else if (t === 'hand') kids.push(hint('Ziehen verschiebt die Ansicht.'));
  if (t === 'select' && S.sels.length) {
    if (S.sels.length === 1 && isBox(o)) {
      const r = h('input', { type: 'number', id: 'p-rot', value: Math.round(((deg(o.rot || 0) % 360) + 360) % 360), step: '5', onchange: e => applyProp('rot', +e.target.value || 0) });
      kids.push(h('h3', {}, 'Drehung'), h('div', { class: 'row' }, r, '°', h('button', { class: 'btn sm', onclick: () => { applyProp('rot', 0); refreshUI(); } }, 'Zurücksetzen')));
    }
    if (S.sels.length === 1 && o.type === 'symbol') {
      if (SIMDEF[o.sym] && SIMDEF[o.sym][1]) kids.push(h('h3', {}, 'Wert (Simulation)'), h('div', { class: 'row' }, h('input', { type: 'text', value: o.val || '', placeholder: simDefault(o), style: 'width:100%;background:var(--panel2);border:1px solid var(--line);border-radius:6px;padding:4px 6px', onchange: e => applyProp('val', e.target.value) })));
      kids.push(h('h3', {}, 'Beschriftung'), h('div', { class: 'row' }, h('input', { type: 'text', value: o.label || '', placeholder: 'z. B. R₁', style: 'width:100%;background:var(--panel2);border:1px solid var(--line);border-radius:6px;padding:4px 6px', onchange: e => applyProp('label', e.target.value) })));
      kids.push(...secColor('Farbe'), ...secWidth('Strichstärke'));
    }
    kids.push(h('h3', {}, 'Anordnen'), h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: () => orderSel(true) }, 'Nach vorn'), h('button', { class: 'btn sm', onclick: () => orderSel(false) }, 'Nach hinten')),
      h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: duplicateSel }, 'Duplizieren'), h('button', { class: 'btn sm danger', onclick: deleteSel }, 'Löschen')));
    if (S.settings.electronics) kids.push(h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: saveSelectionAsCircuit }, 'Als Schaltung speichern …')));
  }
  if (t === 'select' && S.sels.length === 1 && S.sels[0].type === 'graph' && (['plot', 'phasor'].includes(S.sels[0].spec.kind) || TPL_FIELDS[S.sels[0].spec.kind]))
    kids.push(h('button', { class: 'btn sm', style: 'margin-top:8px', onclick: () => editGraph(S.sels[0]) }, 'Diagramm bearbeiten …'));
  if (t === 'select' && S.sels.length && S.sels.every(x => x.type === 'image')) {
    const cb = h('input', { type: 'checkbox', checked: S.sels.every(x => x.lock), onchange: e => { const pre = snapshot(); S.sels.forEach(x => { x.lock = e.target.checked; }); record(pre); refreshUI(); } });
    kids.push(h('label', { class: 'chk', style: 'margin-top:8px' }, cb, ' Fixiert'), hint('Fixierte Bilder und PDF-Seiten lassen sich nicht versehentlich verschieben. Doppelklick wählt sie aus.'));
  }
  kids.push(...extraProps());
  if (S.ruler.on) {
    const r = S.ruler, ov = h('span', {}, r.len + ' cm');
    kids.push(h('h3', {}, 'Lineal'), h('div', { class: 'row' }, h('input', { type: 'range', min: '10', max: '50', value: r.len, oninput: e => { r.len = +e.target.value; ov.textContent = r.len + ' cm'; render(); } }), ov),
      hint('An der Kante entlang zeichnen ergibt gerade Linien. Blauer Knopf dreht.'));
  }
  P.replaceChildren(...kids.filter(Boolean));
}

/* ---------- Gesamte Oberfläche ---------- */
function refreshUI() {
  if (S.screen !== 'editor') return;
  // Obere Leiste
  const tb = $('#topbar'), title = h('input', { class: 'title', value: S.project ? S.project.name : '', title: 'Namen des Whiteboards ändern', spellcheck: 'false', onchange: e => renameProject(e.target.value), onkeydown: e => { if (e.key === 'Enter') e.target.blur(); e.stopPropagation(); } });
  const pres = tbBtn('present', 'Präsentationsfenster für Beamer/zweiten Bildschirm öffnen', presentActive(), () => openPresentation());
  const exp = tbBtn('export', 'Exportieren', false, ev => popupMenu(ev.currentTarget, [{ label: 'Als PDF …', run: () => exportPDFDialog() }, { label: 'Als PNG-Bild', run: exportPNG }, '-',
    { label: 'Whiteboard-Datei speichern (.owb)\tStrg+S', run: () => saveFile(false) }, { label: 'Speichern unter …', run: () => saveFile(true) }]));
  tb.replaceChildren(tbBtn('home', 'Zur Übersicht', false, goHome), title, h('span', { id: 'savest', class: 'savest' }), h('span', { class: 'vsep' }),
    Object.assign(tbBtn('undo', 'Rückgängig (Strg+Z)', false, undo), { id: 'b-undo', disabled: !S.hist.length }), Object.assign(tbBtn('redo', 'Wiederholen (Strg+Y)', false, redo), { id: 'b-redo', disabled: !S.fut.length }),
    h('span', { class: 'vsep' }), tbBtn('snap', 'Am Raster einrasten', S.settings.snap, () => { changeSetting('snap', !S.settings.snap); }), tbBtn('grid', 'Hilfslinien anzeigen (Art und Stärke in den Einstellungen)', S.settings.grid, () => { changeSetting('grid', !S.settings.grid); }),
    h('span', { class: 'sp' }), ...((S.settings.historic || S.bg) ? [h('button', { class: 'tb' + (S.bg ? ' on' : ''), title: 'Vorlage wählen (historische Tafeln)', html: ico('scroll') + '<span class="tbl">' + (curTpl() ? curTpl().name : 'Vorlage') + '</span>', onclick: e => templateMenu(e.currentTarget) })] : []), pres, exp, tbBtn(themeDark() ? 'sun' : 'moon', themeDark() ? 'Heller Modus' : 'Dunkler Modus', false, () => changeSetting('theme', themeDark() ? 'light' : 'dark')),
    tbBtn('info', 'Funktionen & Hilfe', false, openHelp), tbBtn('gear', 'Einstellungen', false, openSettings));
  // Werkzeugleiste
  const tools = $('#tools'); tools.replaceChildren();
  const tc = !!S.ui.toolsCollapsed; tools.classList.toggle('collapsed', tc);
  tools.append(h('button', { class: 'tb tcol', title: tc ? 'Werkzeugleiste aufklappen' : 'Werkzeugleiste minimieren', html: ico('chev'), onclick: () => { S.ui.toolsCollapsed = !tc; saveUI(); refreshUI(); } }), h('div', { class: 'hsep' }));
  enforcePure(); let lastSep = true;
  for (const t of TOOLS) {
    if (tc && t !== '-' && !['pen', 'eraser', 'hand'].includes(t[0]) && !(S.tool === t[0] && t[0] !== 'select')) continue;   // minimiert: nur Stift, Radierer, Hand (+ aktives Werkzeug)
    if (t === '-') { if (!lastSep) tools.append(h('div', { class: 'hsep' })); lastSep = true; continue; }
    const [id, icon, tip0] = t, tip = toolTip(id, tip0);
    if ((id === 'elec' || id === 'wire' || id === 'sim') && !S.settings.electronics) continue;
    if (!toolAllowed(id === 'img' ? 'image' : id) || S.settings.tools[id] === false) continue;
    lastSep = false;
    const on = id === 'sim' ? SIM.on : id === 'timer' ? !!S.timerOpen : id === 'ruler' ? S.ruler.on : id === 'geo' ? S.geo.on : id === 'elec' ? S.elecOpen : id === 'img' ? false : (S.tool === id || (id === 'select' && S.tool === 'place' && false));
    tools.append(tbBtn(icon, tip, on, ev => { if (id === 'img') $('#f-img').click(); else if (id === 'ruler') toggleRuler(); else if (id === 'geo') toggleGeo(); else if (id === 'elec') toggleElec(); else if (id === 'plot') openPlotDialog(); else if (id === 'phasor') openPhasorDialog(); else if (id === 'diagram') diagramMenu(ev.currentTarget); else if (id === 'timer') toggleTimer(); else if (id === 'sim') { SIM.on ? stopSim() : startSim(); } else if (S.tool === id && ['compass', 'laser', 'parab', 'wire'].includes(id)) toggleOffTool(); else setTool(id); }));
  }
  while (tools.lastChild && tools.lastChild.classList.contains('hsep')) tools.lastChild.remove();
  // Stiftleiste
  const pens = $('#pens'); pens.replaceChildren(...pensList().map((p, i) => h('button', { class: 'pen' + (penOn(i) ? ' on' : ''), title: p.name + (i < 9 ? ` (${i + 1})` : ''), html: penSVG(p), onclick: () => selectPen(i) })));
  pens.classList.toggle('hist', !!curTpl());
  buildPagebar();
  // Zoomleiste
  const zb = $('#zoombar'); zb.replaceChildren(
    tbBtn(S.ui.hidePanels ? 'panels' : 'panelsoff', S.ui.hidePanels ? 'Leisten einblenden (Tab)' : 'Leisten ausblenden – ganze Fläche zum Schreiben (Tab)', S.ui.hidePanels, togglePanels),
    tbBtn(document.fullscreenElement ? 'fullx' : 'full', document.fullscreenElement ? 'Vollbild beenden (F)' : 'Vollbild (F)', !!document.fullscreenElement, toggleFullscreen), h('span', { class: 'vsep' }),
    tbBtn('fit', 'Alles anzeigen', false, fitView), h('button', { class: 'tb', title: 'Verkleinern', onclick: () => zoomAt(0.8, innerWidth / 2, innerHeight / 2) }, '−'), h('span', { id: 'zl', title: 'Auf 100 % zurücksetzen', style: 'cursor:pointer', onclick: resetView }, Math.round(S.view.z * 100) + ' %'), h('button', { class: 'tb', title: 'Vergrößern', onclick: () => zoomAt(1.25, innerWidth / 2, innerHeight / 2) }, '+'));
  buildProps();
  const el = $('#elec'); el.hidden = !(S.elecOpen && S.settings.electronics); if (!el.hidden) buildElec();
  document.body.classList.toggle('dark', themeDark()); document.body.classList.toggle('light', !themeDark());
  updateCursor(); setSaveState(S.saveState || 'saved');
}
/* ---------- Leisten ausblenden & Vollbild ---------- */
function saveUI() { saveSettings(); }
function togglePanels() { S.ui.hidePanels = !S.ui.hidePanels; document.body.classList.toggle('nopanels', S.ui.hidePanels); if (S.ui.hidePanels) S.elecOpen = false; saveUI(); refreshUI(); toast(S.ui.hidePanels ? 'Leisten ausgeblendet. Werkzeuge per Taste (P, E, L …), Stifte mit 1–7. Tab blendet wieder ein.' : null, 4500); }
async function toggleFullscreen() {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch (e) { toast('Vollbild ist hier nicht möglich. Alternativ F11 drücken.'); }
}
document.addEventListener('fullscreenchange', () => { if (S.screen === 'editor') { refreshUI(); setTimeout(resizeBoard, 50); } });
function toggleRuler() {
  S.ruler.on = !S.ruler.on;
  if (S.ruler.on && (S.ruler.x < -50 || S.ruler.x > innerWidth || S.ruler.y < 0 || S.ruler.y > innerHeight)) { S.ruler.x = 200; S.ruler.y = innerHeight / 2; }
  markDirty(); refreshUI(); render();
}
function toggleElec() { if (!S.settings.electronics) return; S.elecOpen = !S.elecOpen; refreshUI(); }

/* ---------- Elektronik-Baukasten ---------- */
let builtinCircuits = null; S.userCircuits = [];
function buildElec() {
  const el = $('#elec'), tab = S.elecTab || 'parts';
  const head = h('div', { class: 'eh' }, h('b', {}, 'Elektronik-Baukasten'), h('button', { class: 'btn sm primary', title: 'Gezeichnete Schaltung berechnen und animieren', onclick: () => { SIM.on ? stopSim() : startSim(); } }, SIM.on ? '■ Stopp' : '▶ Simulieren'), h('button', { class: 'btn sm', onclick: openElecHelp }, 'Anleitung'), h('button', { class: 'tb', title: 'Schließen', onclick: toggleElec }, '✕'));
  const tabs = h('div', { class: 'tabs' }, [['parts', 'Bauteile'], ['circuits', 'Schaltungen']].map(([v, l]) => h('button', { class: tab === v ? 'on' : '', onclick: () => { S.elecTab = v; buildElec(); } }, l)));
  const body = h('div', { class: 'eb' });
  const search = h('input', { class: 'search', type: 'search', placeholder: tab === 'parts' ? 'Bauteil suchen …' : 'Schaltung suchen …', value: S.elecQuery || '',
    oninput: e => { S.elecQuery = e.target.value; fillElecBody(body, tab); } });
  el.replaceChildren(head, tabs, search, body); fillElecBody(body, tab);
}
const matchQ = (q, ...txt) => !q || q.toLowerCase().split(/\s+/).every(w => txt.join(' ').toLowerCase().includes(w));
function fillElecBody(body, tab) {
  const q = (S.elecQuery || '').trim(); body.replaceChildren();
  if (tab === 'parts') {
    const cats = [...new Set(SYMBOLS.map(s => s.cat))];
    for (const c of cats) {
      const list = SYMBOLS.filter(s => s.cat === c && matchQ(q, s.name, s.cat)); if (!list.length) continue;
      body.append(h('h4', {}, c));
      body.append(h('div', { class: 'sgrid' }, list.map(s => {
        const cv = h('canvas', { width: 150, height: 90 }); drawSymbolThumb(cv, s);
        return h('div', { class: 'sitem' + (S.armed === s.id && S.tool === 'place' ? ' on' : ''), title: s.name, onclick: () => { S.armedCirc = null; S.armed = s.id; S.armedRot = 0; setTool('place'); hintToast('„' + s.name + '“: Klick setzt, Q dreht, Esc beendet.', 3000); } }, cv, s.name);
      })));
    }
    body.append(h('div', { class: 'row', style: 'margin-top:14px;display:flex;gap:6px;flex-wrap:wrap' }, ...libButtons('symbols'), h('button', { class: 'btn sm', onclick: async () => { await loadUserLibrary(true); buildElec(); } }, 'Neu laden')));
  } else {
    if (!builtinCircuits) builtinCircuits = buildTemplates();
    const entry = t => { const cv = h('canvas', { width: 192, height: 124 }); drawCircuitThumb(cv, t.items); return h('div', { class: 'titem', onclick: () => armCircuit(t) }, cv, h('div', {}, h('div', { class: 'tt' }, t.name), h('div', { class: 'td' }, t.desc || ''))); };
    const bl = builtinCircuits.filter(t => matchQ(q, t.name, t.desc || '')), ul = S.userCircuits.filter(t => matchQ(q, t.name, t.desc || ''));
    if (bl.length) body.append(h('h4', {}, 'Standardschaltungen'), ...bl.map(entry));
    if (ul.length) body.append(h('h4', {}, 'Eigene Schaltungen'), ...ul.map(entry));
    if (!bl.length && !ul.length) body.append(h('p', { class: 'muted' }, 'Nichts gefunden.'));
    body.append(h('div', { style: 'margin-top:12px;display:flex;gap:6px;flex-wrap:wrap' }, h('button', { class: 'btn sm', onclick: saveSelectionAsCircuit }, 'Auswahl als Schaltung speichern'), ...libButtons('circuits')));
  }
}
function libButtons(kind) {                      // Desktop: Ordner öffnen · Web: importieren / exportieren / löschen
  if (api.isDesktop || !api.isWeb) return [h('button', { class: 'btn sm', onclick: () => api.openUserFolder(kind) }, kind === 'symbols' ? 'Symbol-Ordner öffnen' : 'Schaltungs-Ordner öffnen')];
  const label = kind === 'symbols' ? 'Symbole' : 'Schaltungen';
  return [
    h('button', { class: 'btn sm', onclick: async () => {
      const fs = await api.pickFiles('.json,application/json', true); let n = 0;
      for (const f of fs) { try { const d = JSON.parse(await f.text()); const list = Array.isArray(d) ? d : [d]; if (!list.length) continue;
        if (kind === 'circuits' && !list.every(c => c && Array.isArray(c.items))) throw new Error('keine Schaltung');
        await api.saveUser(kind, f.name.replace(/\.json$/i, ''), d); n++; } catch (e) { toast('„' + f.name + '“ ist keine gültige Datei.', 5000); } }
      if (n) { await loadUserLibrary(kind === 'symbols'); buildElec(); toast(n + ' Datei(en) importiert.'); }
    } }, label + ' importieren …'),
    h('button', { class: 'btn sm', onclick: async () => {
      const l = await api.listUser(kind); if (!l.length) { toast('Noch nichts Eigenes vorhanden.'); return; }
      download('openboard-' + kind + '.json', JSON.stringify(l.map(x => x.data), null, 1), 'application/json');
    } }, 'Exportieren'),
    h('button', { class: 'btn sm', onclick: async () => { const l = await api.listUser(kind); if (!l.length) return;
      if (await confirmDlg('Eigene ' + label + ' löschen', 'Alle selbst hinzugefügten ' + label + ' entfernen?', 'Löschen', true)) { await api.clearUser(kind); await loadUserLibrary(false); if (kind === 'symbols') location.reload(); else buildElec(); } } }, 'Alle löschen')
  ];
}
async function saveSelectionAsCircuit() {
  if (!S.sels.length) { toast('Markieren Sie zuerst die Teile der Schaltung (Rahmen aufziehen oder Strg+A).', 4500); return; }
  const name = await askText('Schaltung speichern', 'Name der Schaltung', 'Meine Schaltung', 'Speichern'); if (!name) return;
  const c = circuitFromSelection(name); if (!c) return;
  await api.saveUser('circuits', name, c); await loadUserLibrary(false);
  S.elecOpen = true; S.elecTab = 'circuits'; refreshUI(); toast('Gespeichert unter „Eigene Schaltungen“.');
}
async function loadUserLibrary(report) {
  try {
    const syms = await api.listUser('symbols'), r = addUserSymbols(syms);
    const circ = await api.listUser('circuits'); S.userCircuits = circ.flatMap(c => Array.isArray(c.data) ? c.data : [c.data]).filter(c => c && Array.isArray(c.items));
    if (report) toast(r.bad.length ? 'Fehler in Symbol-Datei: ' + r.bad[0] : `${r.ok} eigene Symbole geladen.`, 5000);
  } catch (e) { console.error(e); }
}
