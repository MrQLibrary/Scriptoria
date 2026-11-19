"use strict";
/* ===== Historische Vorlagen: Kreidetafel, Papyrus, Wachstafel, Sandtafel, Tontafel, Schiefertafel, Pergament =====
   Jede Vorlage bringt Hintergrund (Textur oder Gegenstände), passende Schreibgeräte und ein passendes „Radiergerät“ mit.
   Alle Texturen werden beim ersten Gebrauch per Zufallsrauschen erzeugt – es werden keine Bilddateien benötigt. */

const HIST = {
  chalk: {
    name: 'Kreidetafel', era: 'Schulzimmer, 19./20. Jh.', desc: 'Grüne Schultafel mit Kreide in sechs Farben und Schwamm.', tex: 'chalk', frame: 'woodframe',
    pens: [
      { kind: 'chalk', name: 'Kreide weiß', color: '#f3f3ee', width: 5 }, { kind: 'chalk', name: 'Kreide gelb', color: '#f6e27c', width: 5 },
      { kind: 'chalk', name: 'Kreide rosa', color: '#f3a6b8', width: 5 }, { kind: 'chalk', name: 'Kreide blau', color: '#9fcaf1', width: 5 },
      { kind: 'chalk', name: 'Kreide grün', color: '#aee7a5', width: 5 }, { kind: 'chalk', name: 'Kreide orange', color: '#f6b878', width: 5 },
      { kind: 'sponge', name: 'Schwamm', erase: 46 }],
    tools: { ruler: 'Tafellineal (U)', geo: 'Tafeldreieck (G)', compass: 'Tafelzirkel (C)', laser: 'Zeigestock (J)' }
  },
  papyrus: {
    name: 'Papyrusrolle', era: 'Altes Ägypten, ab ca. 3000 v. Chr.', desc: 'Schriftrolle aus Papyrus, beschrieben mit Binsenpinsel in Ruß-Schwarz und Ocker-Rot.', tex: 'papyrus', frame: 'scroll',
    pens: [{ kind: 'reed', name: 'Binse – Ruß (schwarz)', color: '#1d1812', width: 4 }, { kind: 'reed', name: 'Binse – Ocker (rot)', color: '#a3321e', width: 4 },
      { kind: 'cloth', name: 'Feuchtes Tuch', erase: 26 }],
    tools: { ruler: 'Richtschnur (U)', compass: 'Messschnur für Kreise (C)', laser: 'Zeigestab (J)' }
  },
  wax: {
    name: 'Römische Wachstafel', era: 'Römisches Reich', desc: 'Gebundene Wachstafeln (Polyptychon) aus Holz. Mit der Spitze des Stilus schreiben, mit dem flachen Ende glätten – Taste D dreht den Stilus.', tex: 'table', objects: 'wax',
    pens: [{ kind: 'stylus', name: 'Stilus – Spitze zum Schreiben (D dreht)', color: '#c9a468', width: 3.5 }, { kind: 'spatula', name: 'Stilus – flaches Ende zum Glätten (D dreht)', erase: 16 }],
    flip: [0, 1],
    tools: { ruler: 'Regula – Lineal (U)', compass: 'Circinus – Zirkel (C)' }
  },
  sand: {
    name: 'Archimedes’ Sandtafel', era: 'Antikes Griechenland, 3. Jh. v. Chr.', desc: 'Mit einem Stab Figuren in feinen Sand zeichnen – wie Archimedes. Mit der Hand glattstreichen.', tex: 'sand', frame: 'tray',
    pens: [{ kind: 'stick', name: 'Zeichenstab', color: '#b89660', width: 4 }, { kind: 'stick', name: 'Stab (dick)', color: '#b89660', width: 9 },
      { kind: 'hand', name: 'Hand (glattstreichen)', erase: 42 }],
    tools: { ruler: 'Lineal (U)', compass: 'Zirkel (C)', laser: 'Zeigestab (J)' }
  },
  clay: {
    name: 'Mesopotamische Tontafel', era: 'Mesopotamien, ab ca. 3300 v. Chr.', desc: 'Weicher Ton. Das Schreibrohr drückt Keile ein (ziehen gibt Richtung und Länge), der Griffel ritzt Linien. Mit dem Daumen glätten.', tex: 'table', objects: 'clay',
    pens: [{ kind: 'wedge', name: 'Schreibrohr (Keil eindrücken)', color: '#5a3418', width: 6 }, { kind: 'stickclay', name: 'Griffel (ritzen)', color: '#8f5b33', width: 3 },
      { kind: 'thumb', name: 'Daumen (glätten)', erase: 20 }],
    tools: { ruler: 'Schilfrohr als Lineal (U)' }
  },
  slate: {
    name: 'Schiefertafel', era: 'Schule, 19. Jh.', desc: 'Schiefertafel im Holzrahmen mit Schreiblinien, Griffel, Kreide, Schwamm und Läppchen.', tex: 'table', objects: 'slate',
    pens: [{ kind: 'slate', name: 'Griffel', color: '#dfe2de', width: 2.5 }, { kind: 'chalk', name: 'Kreide', color: '#f3f3ee', width: 4 },
      { kind: 'sponge', name: 'Schwamm', erase: 34 }, { kind: 'cloth', name: 'Läppchen', erase: 14 }],
    tools: { ruler: 'Lineal (U)', laser: 'Zeigestock (J)' }
  },
  parchment: {
    name: 'Pergament mit Gänsekiel', era: 'Mittelalterliches Skriptorium', desc: 'Pergament mit Gänsekiel in Eisengallustinte, Zinnoberrot und Azuritblau. Fehler werden mit dem Federmesser abgeschabt.', tex: 'parchment', frame: 'vignette',
    pens: [{ kind: 'quill', name: 'Gänsekiel – Eisengallustinte', color: '#2a1c10', width: 6 }, { kind: 'quill', name: 'Gänsekiel – Zinnoberrot', color: '#b0261c', width: 6 },
      { kind: 'quill', name: 'Gänsekiel – Azuritblau', color: '#29509b', width: 6 }, { kind: 'lead', name: 'Bleigriffel (Linien vorziehen)', color: '#707070', width: 1.5 },
      { kind: 'knife', name: 'Federmesser (abschaben)', erase: 10 }],
    tools: { ruler: 'Lineal (U)', compass: 'Zirkel (C)' }
  }
};
function curTpl() { return (S.bg && HIST[S.bg]) || null; }
function pensList() { const t = curTpl(); return t ? t.pens : S.pens; }

/* ---------- Gegenstände in Board-Koordinaten (Wachstafeln, Tontafel, Schiefertafel) ---------- */
const WAX = { W: 1000, H: 680, F: 46, GAP: 90, N: 4 };
const OBJ_RECTS = {
  wax: () => Array.from({ length: WAX.N }, (_, i) => [i * (WAX.W + WAX.GAP), 0, i * (WAX.W + WAX.GAP) + WAX.W, WAX.H]),
  clay: () => [[0, 0, 1400, 950]],
  slate: () => [[0, 0, 1300, 880]]
};
function tplHomeRect(i = 0) { const t = curTpl(); if (!t || !t.objects) return null; const r = OBJ_RECTS[t.objects](); return r[clamp(i, 0, r.length - 1)]; }
function fitRect(b) {
  const w = b[2] - b[0], hh = b[3] - b[1], z = clamp(Math.min((innerWidth - 180) / w, (innerHeight - 200) / hh), 0.1, 3);
  S.view = { z, x: innerWidth / 2 - (b[0] + w / 2) * z, y: innerHeight / 2 - (b[1] + hh / 2) * z + 10 }; markDirty(); render(); updateCursor();
}
function goTablet(i) { const r = tplHomeRect(i); if (r) { S.tablet = i; fitRect(r); if (window.refreshUI) refreshUI(); } }

/* ---------- Zufall mit festem Startwert, damit Texturen immer gleich aussehen ---------- */
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const TEX = new Map();
function texCanvas(id) {
  let cv = TEX.get(id); if (cv) return cv;
  const N = 512; cv = document.createElement('canvas'); cv.width = cv.height = N; const c = cv.getContext('2d'), R = rng(id.length * 7919 + id.charCodeAt(0));
  const wrap = (x, y, r, fn) => { for (const dx of [-N, 0, N]) for (const dy of [-N, 0, N]) if (x + dx > -r && x + dx < N + r && y + dy > -r && y + dy < N + r) fn(x + dx, y + dy); };
  const blob = (x, y, r, col, a) => wrap(x, y, r, (X, Y) => { const g = c.createRadialGradient(X, Y, 0, X, Y, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0)); c.fillStyle = g; c.fillRect(X - r, Y - r, 2 * r, 2 * r); });
  const grains = (n, cols, a0, a1, s0 = 1, s1 = 1) => { for (let i = 0; i < n; i++) { c.globalAlpha = a0 + R() * (a1 - a0); c.fillStyle = cols[Math.floor(R() * cols.length)]; const s = s0 + R() * (s1 - s0); c.fillRect(R() * N, R() * N, s, s); } c.globalAlpha = 1; };
  const fibers = (n, horiz, cols, a0, a1, w0, w1) => {
    for (let i = 0; i < n; i++) {
      const p = R() * N, amp = R() * 2, ph = R() * 6; c.globalAlpha = a0 + R() * (a1 - a0); c.strokeStyle = cols[Math.floor(R() * cols.length)]; c.lineWidth = w0 + R() * (w1 - w0);
      for (const off of [-N, 0, N]) { c.beginPath(); for (let t = 0; t <= N; t += 16) { const q = p + off + Math.sin(t / 60 + ph) * amp; horiz ? (t ? c.lineTo(t, q) : c.moveTo(t, q)) : (t ? c.lineTo(q, t) : c.moveTo(q, t)); } c.stroke(); }
    }
    c.globalAlpha = 1;
  };
  const base = col => { c.fillStyle = col; c.fillRect(0, 0, N, N); };
  switch (id) {
    case 'chalk':
      base('#263a30'); for (let i = 0; i < 26; i++) blob(R() * N, R() * N, 40 + R() * 120, 'rgba(230,240,230,A)', 0.035 + R() * 0.03);
      grains(9000, ['#ffffff', '#c9d6cc', '#10201a'], 0.03, 0.10); break;
    case 'papyrus':
      base('#e3cd98'); fibers(150, true, ['#c8a866', '#f1e1b2', '#d9bd80', '#b8935a'], 0.25, 0.55, 1, 3.5);
      fibers(70, false, ['#c8a866', '#efdcaa'], 0.10, 0.22, 1, 2.5); grains(1500, ['#8a6a35', '#5d4521'], 0.08, 0.25, 1, 2);
      for (let i = 0; i < 12; i++) blob(R() * N, R() * N, 30 + R() * 80, 'rgba(160,120,60,A)', 0.05); break;
    case 'wax':
      base('#2c2416'); for (let i = 0; i < 40; i++) blob(R() * N, R() * N, 20 + R() * 70, 'rgba(70,58,36,A)', 0.25 + R() * 0.2);
      grains(4000, ['#4a3d26', '#1a140b'], 0.15, 0.35); c.strokeStyle = '#6d5a38'; c.lineWidth = 1;
      for (let i = 0; i < 40; i++) { c.globalAlpha = 0.05 + R() * 0.06; const x = R() * N, y = R() * N, l = 10 + R() * 60, a = R() * 6.28; c.beginPath(); c.moveTo(x, y); c.lineTo(x + l * Math.cos(a), y + l * Math.sin(a)); c.stroke(); }
      c.globalAlpha = 1; break;
    case 'sand':
      base('#d8bf8a'); grains(42000, ['#c4a46a', '#ead7a9', '#b38f56', '#f4e6c3', '#a4834f'], 0.35, 0.85);
      c.strokeStyle = '#a8864f'; for (let y = 0; y < N; y += 18) { c.globalAlpha = 0.05; c.beginPath(); for (let x = 0; x <= N; x += 8) { const q = y + Math.sin(x / 40 + y) * 4; x ? c.lineTo(x, q) : c.moveTo(x, q); } c.stroke(); }
      c.globalAlpha = 1; break;
    case 'clay':
      base('#b58457'); for (let i = 0; i < 30; i++) blob(R() * N, R() * N, 30 + R() * 90, R() < 0.5 ? 'rgba(120,75,40,A)' : 'rgba(215,170,120,A)', 0.12 + R() * 0.12);
      grains(9000, ['#8c5d36', '#d6a679', '#6e4526'], 0.15, 0.45, 1, 2); break;
    case 'slate':
      base('#353b3e'); for (let i = 0; i < 30; i++) blob(R() * N, R() * N, 30 + R() * 90, R() < 0.5 ? 'rgba(80,88,92,A)' : 'rgba(20,24,26,A)', 0.15);
      grains(14000, ['#596266', '#22282a', '#6d777b'], 0.12, 0.35); fibers(30, true, ['#4a5357'], 0.12, 0.25, 0.6, 1.4); break;
    case 'parchment':
      base('#efe0bc'); for (let i = 0; i < 40; i++) blob(R() * N, R() * N, 30 + R() * 120, R() < 0.6 ? 'rgba(210,185,130,A)' : 'rgba(250,240,215,A)', 0.18 + R() * 0.15);
      grains(2500, ['#b89a62', '#8c6b3c'], 0.05, 0.18, 1, 2.5); for (let i = 0; i < 9; i++) blob(R() * N, R() * N, 3 + R() * 6, 'rgba(140,95,45,A)', 0.25);
      fibers(40, true, ['#d9c493'], 0.08, 0.15, 0.6, 1.2); break;
    case 'wood': case 'table': {
      const light = id === 'wood';
      base(light ? '#8d5c2e' : '#3a2a1d');
      fibers(220, true, light ? ['#6e4420', '#a8743f', '#7c4e26', '#b98549'] : ['#2c1f15', '#4a3626', '#33251a', '#56402c'], 0.25, 0.6, 1, 4);
      grains(2500, [light ? '#5b3818' : '#1e150e'], 0.1, 0.3, 1, 3); break;
    }
    case 'woodlight':
      base('#b98d55'); fibers(220, true, ['#9c7038', '#d1a76b', '#a87c44', '#c99c60'], 0.25, 0.6, 1, 4); break;
  }
  TEX.set(id, cv); return cv;
}
let PAT = new WeakMap();
function resetTextures() { TEX.clear(); CHALK.clear(); PAT = new WeakMap(); }   // nach Verlust der Grafikkarten-Daten neu erzeugen
function pattern(c, id) {                                // Muster pro Zeichenfläche zwischenspeichern
  let m = PAT.get(c); if (!m) { m = new Map(); PAT.set(c, m); }
  let p = m.get(id); if (!p) { p = c.createPattern(texCanvas(id), 'repeat'); m.set(id, p); }
  return p;
}
const CHALK = new Map();
function chalkTex(color, density) {                     // Kreide-/Griffelstruktur: körnige, unregelmäßige Deckung
  const key = color + density; let cv = CHALK.get(key); if (cv) return cv;
  cv = document.createElement('canvas'); cv.width = cv.height = 64; const c = cv.getContext('2d'), img = c.createImageData(64, 64), R = rng(7);
  const [r, g, b] = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
  for (let i = 0; i < 64 * 64; i++) { const v = R(); img.data[i * 4] = r; img.data[i * 4 + 1] = g; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = v < density ? 200 + R() * 55 : v < density + 0.15 ? 70 : 0; }
  c.putImageData(img, 0, 0); CHALK.set(key, cv); return cv;
}
function chalkPattern(c, color, density) {
  let m = PAT.get(c); if (!m) { m = new Map(); PAT.set(c, m); }
  const key = 'k' + color + density; let p = m.get(key); if (!p) { p = c.createPattern(chalkTex(/^#[0-9a-f]{6}$/i.test(color) ? color : '#ffffff', density), 'repeat'); m.set(key, p); }
  return p;
}

/* ---------- Hintergrund zeichnen (wird von drawBase aufgerufen) ---------- */
function rrect(c, x, y, w, hh, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + hh, r); c.arcTo(x + w, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function drawBackground(c, d, v, opt) {
  const t = curTpl(); if (!t) return false;
  c.setTransform(d * v.z, 0, 0, d * v.z, d * v.x, d * v.y);
  const vr = viewRect(v, opt.w, opt.h, d);
  const pat = pattern(c, t.tex);
  if (pat.setTransform) pat.setTransform(new DOMMatrix([1 / v.z, 0, 0, 1 / v.z, 0, 0]));   // Struktur bleibt beim Zoomen gleich groß (kein Kachelmuster)
  c.fillStyle = pat; c.fillRect(vr[0], vr[1], vr[2] - vr[0], vr[3] - vr[1]);
  if (t.objects === 'wax') drawWax(c);
  else if (t.objects === 'clay') drawClay(c);
  else if (t.objects === 'slate') drawSlate(c);
  return true;
}
function frameBox(c, x0, y0, x1, y1, F, wood, inner) {
  c.save(); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 30; c.shadowOffsetY = 10;
  rrect(c, x0 - F, y0 - F, x1 - x0 + 2 * F, y1 - y0 + 2 * F, 14); c.fillStyle = pattern(c, wood); c.fill(); c.restore();
  c.fillStyle = pattern(c, inner); c.fillRect(x0, y0, x1 - x0, y1 - y0);
  const g = (x, y, w, hh, dir) => { const gr = dir === 'h' ? c.createLinearGradient(x, y, x, y + hh) : c.createLinearGradient(x, y, x + w, y); gr.addColorStop(0, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(x, y, w, hh); };
  g(x0, y0, x1 - x0, 16, 'h'); g(x0, y0, 16, y1 - y0, 'v');                // Innenschatten: Fläche liegt tiefer als der Rahmen
  c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 1.5; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
}
function drawWax(c) {
  const rs = OBJ_RECTS.wax(), F = WAX.F;
  rs.forEach(([x0, y0, x1, y1], i) => {
    frameBox(c, x0, y0, x1, y1, F, 'wood', 'wax');
    c.save(); c.fillStyle = 'rgba(40,22,8,.55)'; c.font = `bold 26px "Times New Roman", serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(['I', 'II', 'III', 'IV', 'V', 'VI'][i], (x0 + x1) / 2, y0 - F / 2); c.restore();
  });
  for (let i = 0; i < rs.length - 1; i++) {                          // Lederbänder, die die Tafeln verbinden
    const xa = rs[i][2] + F - 10, xb = rs[i + 1][0] - F + 10;
    for (const y of [WAX.H * 0.27, WAX.H * 0.73]) {
      c.save(); c.lineCap = 'round'; c.strokeStyle = '#3d2412'; c.lineWidth = 9; c.beginPath(); c.moveTo(xa - 12, y); c.bezierCurveTo(xa + 20, y + 14, xb - 20, y + 14, xb + 12, y); c.stroke();
      c.strokeStyle = '#7a4a26'; c.lineWidth = 4; c.stroke();
      c.fillStyle = '#140b04'; for (const x of [xa - 12, xb + 12]) { c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); }
      c.restore();
    }
  }
}
function drawClay(c) {
  const [x0, y0, x1, y1] = OBJ_RECTS.clay()[0];
  c.save(); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 40; c.shadowOffsetY = 16; rrect(c, x0, y0, x1 - x0, y1 - y0, 110); c.fillStyle = pattern(c, 'clay'); c.fill(); c.restore();
  c.save(); rrect(c, x0, y0, x1 - x0, y1 - y0, 110); c.clip();
  const g = c.createRadialGradient((x0 + x1) / 2, (y0 + y1) / 2 - 80, 100, (x0 + x1) / 2, (y0 + y1) / 2, Math.max(x1 - x0, y1 - y0) * 0.62);
  g.addColorStop(0, 'rgba(255,225,190,.20)'); g.addColorStop(0.7, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(50,25,8,.45)'); c.fillStyle = g; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  c.restore(); c.strokeStyle = 'rgba(70,40,15,.6)'; c.lineWidth = 2; rrect(c, x0, y0, x1 - x0, y1 - y0, 110); c.stroke();
}
function drawSlate(c) {
  const [x0, y0, x1, y1] = OBJ_RECTS.slate()[0];
  frameBox(c, x0, y0, x1, y1, 52, 'woodlight', 'slate');
  c.save(); c.strokeStyle = 'rgba(205,120,110,.32)'; c.lineWidth = 1.4; c.beginPath();      // eingeritzte Schreiblinien
  for (let y = y0 + 80; y < y1 - 30; y += 70) { c.moveTo(x0 + 20, y); c.lineTo(x1 - 20, y); c.moveTo(x0 + 20, y - 26); c.lineTo(x1 - 20, y - 26); }
  c.stroke(); c.restore();
}

/* ---------- Rahmen am Bildschirmrand (Kreidetafel, Papyrusrolle, Sandkasten, Pergament) ---------- */
function drawTplFrame(c) {
  const t = curTpl(); if (!t || !t.frame) return; const W = innerWidth, H = innerHeight;
  c.save();
  if (t.frame === 'woodframe' || t.frame === 'tray') {
    const F = t.frame === 'tray' ? 24 : 18;
    c.fillStyle = pattern(c, t.frame === 'tray' ? 'woodlight' : 'wood');
    c.fillRect(0, 0, W, F); c.fillRect(0, H - F, W, F); c.fillRect(0, 0, F, H); c.fillRect(W - F, 0, F, H);
    c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = 2; c.strokeRect(F, F, W - 2 * F, H - 2 * F);
    const g = c.createLinearGradient(0, F, 0, F + 14); g.addColorStop(0, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(F, F, W - 2 * F, 14);
    if (t.frame === 'woodframe') {                                    // Kreideablage unten
      c.fillStyle = pattern(c, 'wood'); c.fillRect(F + 40, H - F - 10, W - 2 * F - 80, 12);
      c.fillStyle = 'rgba(255,255,255,.18)'; for (let x = F + 60; x < W - F - 60; x += 37) c.fillRect(x, H - F - 8, 2 + (x % 5), 2);
    }
  } else if (t.frame === 'scroll') {                                  // aufgerollte Enden mit Holzstäben
    for (const side of [0, 1]) {
      const x = side ? W - 34 : 0, g = c.createLinearGradient(side ? W - 90 : 34, 0, side ? W - 34 : 90, 0);
      g.addColorStop(side ? 1 : 0, 'rgba(80,55,20,.55)'); g.addColorStop(side ? 0 : 1, 'rgba(80,55,20,0)'); c.fillStyle = g; c.fillRect(side ? W - 90 : 34, 0, 56, H);
      const r = c.createLinearGradient(x, 0, x + 34, 0); r.addColorStop(0, '#5a3a1c'); r.addColorStop(0.45, '#b98a4e'); r.addColorStop(1, '#4a2e15');
      c.fillStyle = r; c.fillRect(x + 4, 0, 26, H);
      c.fillStyle = '#e1cb93'; c.fillRect(side ? x : x + 30, 0, 4, H);
    }
  } else if (t.frame === 'vignette') {
    const g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, 'rgba(120,80,30,0)'); g.addColorStop(1, 'rgba(110,70,25,.38)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  c.restore();
}

/* ---------- Striche der historischen Schreibgeräte ---------- */
function groove(c, o, shadow, mid, hl) {                 // eingeritzte Rille: Schatten, Grund, Lichtkante
  const p = o.pts, w = o.w, off = Math.max(0.8, w * 0.28);
  c.lineCap = 'round'; c.lineJoin = 'round';
  const pass = (dx, col, a, lw) => { c.save(); c.translate(dx, dx); c.globalAlpha = a; c.strokeStyle = col; c.lineWidth = lw; smoothPath(c, p); c.stroke(); c.restore(); };
  pass(-off * 0.6, shadow, 0.75, w); pass(0, mid, 1, w * 0.78); pass(off * 0.55, hl, 0.55, Math.max(0.6, w * 0.28));
}
function waxGroove(c, o) {                                // Ritzspur im Wachs: aufgeworfener Rand, dunkle Kante, raue helle Rille
  const p = o.pts, w = o.w; c.lineCap = 'round'; c.lineJoin = 'round';
  const pass = (dx, dy, style, a, lw) => { c.save(); c.translate(dx, dy); c.globalAlpha = a; c.strokeStyle = style; c.lineWidth = lw; smoothPath(c, p); c.stroke(); c.restore(); };
  pass(0, 0, '#5c4a2c', 0.55, w * 2.6);                   // aufgeworfenes Wachs neben der Rille
  pass(w * 0.25, w * 0.25, '#7a6440', 0.35, w * 1.9);      // Licht auf dem Wulst
  pass(-w * 0.18, -w * 0.18, '#070402', 0.9, w * 1.15);    // Schattenkante der Rille
  pass(0, 0, chalkPattern(c, o.c, 0.94), 1, w * 0.8);      // Rillengrund: leicht raues, helleres Wachs
  pass(w * 0.15, w * 0.15, '#f1dcaa', 0.3, Math.max(0.5, w * 0.22));
}
function nibStroke(c, o, nibDeg, k0, k1, alpha) {        // Breitfeder/Pinsel: Strichstärke hängt von der Richtung ab
  const p = o.pts, nib = rad(nibDeg); let prev = o.w * 0.5; c.globalAlpha = alpha; c.strokeStyle = o.c; c.lineCap = 'round';
  for (let i = 1; i < p.length; i++) {
    const a = Math.atan2(p[i][1] - p[i - 1][1], p[i][0] - p[i - 1][0]), taper = Math.min(1, (i + 2) / 6, (p.length - i + 2) / 6);
    prev = prev * 0.7 + o.w * (k0 + k1 * Math.abs(Math.sin(a - nib))) * taper * 0.3; c.lineWidth = Math.max(0.6, prev);
    c.beginPath(); c.moveTo(p[i - 1][0], p[i - 1][1]); c.lineTo(p[i][0], p[i][1]); c.stroke();
  }
}
function drawWedge(c, o) {                               // Keilschrift-Eindruck: Kopf am Ansatzpunkt, Schwanz in Zugrichtung
  const A = o.pts[0], B = o.pts[o.pts.length - 1]; let dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
  if (L < o.w * 2) { dx = 1; dy = 0; L = o.w * 6; } else { dx /= L; dy /= L; }
  const Bx = A[0] + dx * L, By = A[1] + dy * L, nx = -dy, ny = dx, hw = o.w * 1.25, hd = o.w * 1.6;
  const P1 = [A[0] + nx * hw, A[1] + ny * hw], P2 = [A[0] - nx * hw, A[1] - ny * hw], M = [A[0] + dx * hd, A[1] + dy * hd];
  const poly = (pts, col, a) => { c.globalAlpha = a; c.fillStyle = col; c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); };
  poly([P1, M, [Bx, By]], '#4a2810', 0.75); poly([P2, M, [Bx, By]], '#8a5a34', 0.75); poly([P1, P2, M], '#2e1808', 0.85);
  c.globalAlpha = 0.5; c.strokeStyle = '#e3b98c'; c.lineWidth = Math.max(0.6, o.w * 0.12); c.beginPath(); c.moveTo(P2[0], P2[1]); c.lineTo(Bx, By); c.stroke();
  c.globalAlpha = 1;
}
function drawHistPen(c, o) {
  const k = o.kind, p = o.pts;
  if (!['chalk', 'slate', 'reed', 'quill', 'stylus', 'stick', 'stickclay', 'wedge', 'lead'].includes(k)) return false;
  if (k === 'wedge') { drawWedge(c, o); return true; }
  if (p.length < 2) { c.globalAlpha = 0.9; c.fillStyle = k === 'chalk' || k === 'slate' ? chalkPattern(c, o.c, 0.6) : k === 'stylus' ? o.c : o.c; c.beginPath(); c.arc(p[0][0], p[0][1], o.w / 2, 0, 7); c.fill(); return true; }
  c.lineCap = 'round'; c.lineJoin = 'round';
  switch (k) {
    case 'chalk': c.globalAlpha = 0.95; c.strokeStyle = chalkPattern(c, o.c, 0.58); c.lineWidth = o.w; smoothPath(c, p); c.stroke(); break;
    case 'slate': c.globalAlpha = 0.9; c.strokeStyle = chalkPattern(c, o.c, 0.7); c.lineWidth = o.w; smoothPath(c, p); c.stroke(); break;
    case 'reed': nibStroke(c, o, 10, 0.55, 0.45, 0.9); break;
    case 'quill': nibStroke(c, o, -40, 0.22, 0.95, 0.94); break;
    case 'stylus': waxGroove(c, o); break;
    case 'stick': groove(c, o, '#7c5c2e', '#bd9a62', '#f7e9c8'); break;
    case 'stickclay': groove(c, o, '#4a2810', o.c, '#e3b98c'); break;
    case 'lead': c.globalAlpha = 0.5; c.strokeStyle = o.c; c.lineWidth = o.w; smoothPath(c, p); c.stroke(); break;
  }
  return true;
}

/* ---------- Radiergeräte: Form des Mauszeigers ---------- */
function drawEraserSkin(c, x, y, r) {
  const k = S.eraserSkin; c.save(); c.translate(x, y);
  const blob = (w, hh, rad0, fill, stroke) => { rrect(c, -w / 2, -hh / 2, w, hh, rad0); c.fillStyle = fill; c.fill(); c.strokeStyle = stroke; c.lineWidth = 1.2; c.stroke(); };
  if (k === 'sponge') { blob(r * 2, r * 1.35, r * 0.25, 'rgba(242,211,107,.55)', '#9b7a1c'); c.fillStyle = 'rgba(155,122,28,.45)'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(((i * 37) % 17 - 8) / 8 * r * 0.75, ((i * 23) % 13 - 6) / 6 * r * 0.45, 2, 0, 7); c.fill(); } }
  else if (k === 'cloth') blob(r * 2, r * 1.6, r * 0.5, 'rgba(240,230,205,.55)', '#8f7f5c');
  else if (k === 'hand' || k === 'thumb') { c.beginPath(); c.ellipse(0, 0, r, r * 0.8, 0, 0, 7); c.fillStyle = 'rgba(224,170,125,.35)'; c.fill(); c.strokeStyle = '#a06a40'; c.stroke(); }
  else if (k === 'spatula') blob(r * 2, r * 0.7, 3, 'rgba(176,141,87,.6)', '#6e5530');
  else if (k === 'knife') { c.beginPath(); c.moveTo(-r, -r * 0.35); c.lineTo(r, -r * 0.35); c.lineTo(r * 0.6, r * 0.35); c.lineTo(-r, r * 0.35); c.closePath(); c.fillStyle = 'rgba(205,212,218,.7)'; c.fill(); c.strokeStyle = '#6b7279'; c.stroke(); }
  else { c.beginPath(); c.arc(0, 0, r, 0, 7); c.strokeStyle = '#000'; c.stroke(); }
  c.restore();
}

/* ---------- Symbole der Schreibgeräte in der Leiste unten ---------- */
function histPenSVG(p) {
  const ink = p.color || '#000';
  const B = {
    chalk: `<rect x="15" y="12" width="12" height="46" rx="4" fill="${ink}" stroke="#0004"/><rect x="15" y="12" width="12" height="8" rx="4" fill="#fff6"/>`,
    slate: `<rect x="15" y="4" width="12" height="24" rx="2" fill="#a77b45" stroke="#6b4a24"/><path d="M17 28h8v22l-4 8-4-8z" fill="#8f979c" stroke="#5c6266"/>`,
    sponge: `<rect x="5" y="22" width="32" height="36" rx="7" fill="#f2d36b" stroke="#a8861f"/><rect x="5" y="16" width="32" height="10" rx="4" fill="#3f8f4a"/><circle cx="14" cy="36" r="2" fill="#c9a43a"/><circle cx="26" cy="44" r="2.5" fill="#c9a43a"/><circle cx="20" cy="51" r="1.8" fill="#c9a43a"/>`,
    reed: `<path d="M19 2h4l1 46-3 10-3-10z" fill="#cdae6c" stroke="#8a6a35"/><path d="M19 52l2 6 2-6z" fill="${ink}"/>`,
    quill: `<path d="M31 2C13 9 11 31 19.5 48h3C25 32 33 15 31 2z" fill="#f6f2ea" stroke="#9a978f"/><path d="M27 6C20 18 20 34 21 48" stroke="#b9b5aa" fill="none"/><path d="M19.5 48h3l-1.5 12z" fill="${ink}"/>`,
    stylus: `<path d="M18.5 6h5v4h-5z" fill="#8c6c3e" stroke="#5a4426"/><path d="M19.5 10h3v30l-1.5 14-1.5-14z" fill="#d7b06b" stroke="#6e5530"/><path d="M21 46v8" stroke="#fff3c8" stroke-width="1.2"/>`,
    spatula: `<path d="M20 6l1-6 1 6z" fill="#8c6c3e" stroke="#5a4426"/><path d="M19.5 6h3v30h-3z" fill="#b48f55" stroke="#6e5530"/><path d="M19 36h4l6 16H13z" fill="#d7b06b" stroke="#6e5530"/><path d="M14 51h14" stroke="#fff3c8" stroke-width="1.2"/>`,
    stick: `<path d="M18 2h6l-1 52-2 6-2-6z" fill="#9b7442" stroke="#5e4320"/><path d="M19 12h4M19 30h4" stroke="#6e5230"/>`,
    stickclay: `<path d="M18 2h6l-1 52-2 6-2-6z" fill="#cdae6c" stroke="#8a6a35"/>`,
    wedge: `<path d="M16 2h10v44l-5 12-5-12z" fill="#cdae6c" stroke="#8a6a35"/><path d="M16 46l5 12 5-12z" fill="#8a6a35"/>`,
    hand: `<path d="M11 62V32a3 3 0 016 0V18a3 3 0 016 0v4a3 3 0 016 0v12a3 3 0 015 2l-1 26z" fill="#e7b98f" stroke="#a87350"/>`,
    thumb: `<path d="M14 62V30c0-8 14-8 14 0v32z" fill="#e7b98f" stroke="#a87350"/><path d="M16 30c2-4 8-4 10 0" fill="#f3d6bd" stroke="#c9906a"/>`,
    cloth: `<path d="M7 24q7-7 14 0q7-7 14 0v30q-7 7-14 0q-7 7-14 0z" fill="#efe6d2" stroke="#a89670"/><path d="M12 32h18M12 40h18" stroke="#d8cba9"/>`,
    lead: `<path d="M19 2h4v50l-2 8-2-8z" fill="#8a8d90" stroke="#55585b"/><path d="M19 12h4" stroke="#55585b"/>`,
    knife: `<rect x="18" y="2" width="7" height="30" rx="2" fill="#6b4a2a"/><path d="M18 32h7l-1 18-5 8z" fill="#cfd4d9" stroke="#7b8288"/>`
  };
  return B[p.kind] ? `<svg viewBox="0 0 42 68">${B[p.kind]}</svg>` : null;
}

/* ---------- Auswahl der Schreibgeräte ---------- */
function selectPen(i) {
  const t = curTpl();
  if (!t) { S.penIdx = clamp(i, 0, S.pens.length - 1); setTool('pen'); return; }
  const p = t.pens[i]; if (!p) return; S.tplIdx = i;
  if (p.erase) { S.eraser.size = p.erase; S.eraser.mode = 'pixel'; setTool('eraser'); S.eraserSkin = p.kind; }
  else { setTool('pen'); }
  if (window.refreshUI) refreshUI();
}
function penOn(i) {
  const t = curTpl(); if (!t) return S.tool === 'pen' && S.penIdx === i;
  const p = t.pens[i]; return (S.tplIdx || 0) === i && (p.erase ? S.tool === 'eraser' : S.tool === 'pen');
}
function flipStylus() {                                  // Wachstafel: Stilus umdrehen (Spitze ↔ flaches Ende)
  const t = curTpl(); if (!t || !t.flip) return false;
  const [a, b] = t.flip; selectPen(S.tool === 'eraser' && S.tplIdx === b ? a : (S.tool === 'pen' && S.tplIdx === a ? b : a));
  toast(S.tool === 'eraser' ? 'Stilus gedreht: flaches Ende zum Glätten.' : 'Stilus gedreht: Spitze zum Schreiben.', 1800); return true;
}

/* ---------- Vorlage wählen ---------- */
function setTemplate(id) {
  if (S.editing) commitEdit();
  S.bg = id && HIST[id] ? id : null; S.tplIdx = 0; S.tablet = 0; markDirty(); presentDirty();
  if (S.bg) { const r = tplHomeRect(0); if (r) fitRect(r); selectPen(0); } else setTool('pen');
  refreshUI(); render();
}
function templateMenu(anchor) {
  popupMenu(anchor, [{ label: (S.bg ? '' : '✓ ') + 'Modernes Whiteboard', run: () => setTemplate(null) }, '-',
    ...Object.entries(HIST).map(([id, t]) => ({ label: (S.bg === id ? '✓ ' : '') + t.name + ' – ' + t.era, run: () => setTemplate(id) }))]);
}
function newTemplateProject(id) { newProject(); setTemplate(id); S.project.name = HIST[id].name; refreshUI(); doSave(true); }
function tplPreview(id) {                                // kleines Vorschaubild für den Startbildschirm
  const t = HIST[id], cv = document.createElement('canvas'); cv.width = 320; cv.height = 200; const c = cv.getContext('2d');
  c.fillStyle = pattern(c, t.objects ? (t.objects === 'clay' ? 'clay' : t.objects) : t.tex); c.fillRect(0, 0, 320, 200);
  if (t.objects === 'wax' || t.objects === 'slate') { c.lineWidth = 16; c.strokeStyle = pattern(c, t.objects === 'wax' ? 'wood' : 'woodlight'); c.strokeRect(8, 8, 304, 184); }
  if (t.frame === 'scroll') { c.fillStyle = '#8b5e30'; c.fillRect(0, 0, 14, 200); c.fillRect(306, 0, 14, 200); }
  if (t.frame === 'woodframe' || t.frame === 'tray') { c.lineWidth = 12; c.strokeStyle = pattern(c, t.frame === 'tray' ? 'woodlight' : 'wood'); c.strokeRect(6, 6, 308, 188); }
  const o = { pts: [], c: t.pens[0].color, w: (t.pens[0].width || 4) * 1.4, kind: t.pens[0].kind };
  for (let i = 0; i <= 60; i++) o.pts.push([60 + i * 3.4, 100 - Math.sin(i / 60 * Math.PI * 2) * 40]);
  if (o.kind === 'wedge') { [[90, 80], [130, 80], [110, 120], [170, 95], [210, 95]].forEach(([x, y], i) => drawWedge(c, { pts: [[x, y], [x + (i === 2 ? 0 : 26), y + (i === 2 ? 30 : 0)]], w: 8 })); }
  else { const keep = RT.dark; RT.dark = false; c.save(); drawHistPen(c, o) || drawPen(c, o); c.restore(); RT.dark = keep; }
  return cv.toDataURL('image/jpeg', 0.8);
}

/* ---------- Nur historische Werkzeuge (Einstellung) ---------- */
function histPure() { return !!(curTpl() && S.settings.histPure); }
function toolAllowed(id) {
  if (!histPure()) return true;
  return id === 'hand' || id === 'pen' || id === 'eraser' || id in (curTpl().tools || {});
}
function toolTip(id, tip) { const t = curTpl(); return (t && t.tools && t.tools[id]) || tip; }
function enforcePure() {                                 // nicht erlaubte Hilfsmittel ausschalten
  if (!histPure()) return;
  if (S.ruler.on && !toolAllowed('ruler')) S.ruler.on = false;
  if (S.geo.on && !toolAllowed('geo')) S.geo.on = false;
  if (S.elecOpen) S.elecOpen = false;
  if (!toolAllowed(S.tool)) selectPen(0);
}
function arcToPen(a) {                                    // Zirkelbogen als Strich des aktuellen Schreibgeräts
  const p = curPen(), n = Math.max(12, Math.ceil(Math.abs(a.sweep) * a.r / 3)), pts = [];
  for (let i = 0; i <= n; i++) { const t = a.a0 + a.sweep * i / n; pts.push([a.cx + a.r * Math.cos(t), a.cy + a.r * Math.sin(t)]); }
  return { type: 'pen', kind: p.kind === 'wedge' ? 'stickclay' : p.kind, pts, c: p.color, w: p.width, ls: 'solid' };
}
function drawPointerStick(c, z) {                         // Zeigestock statt Laserpointer
  const L = S.laser; if (!L.active || !L.pos) return;
  const x = L.pos.x, y = L.pos.y, ex = x + 260 / z, ey = y + 380 / z;
  c.save(); c.lineCap = 'round';
  c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 9 / z; c.beginPath(); c.moveTo(x + 4 / z, y + 6 / z); c.lineTo(ex + 4 / z, ey + 6 / z); c.stroke();
  const g = c.createLinearGradient(x, y, ex, ey); g.addColorStop(0, '#e8d3a8'); g.addColorStop(0.08, '#b7884f'); g.addColorStop(1, '#6b4422');
  c.strokeStyle = g; c.lineWidth = 7 / z; c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
  c.restore();
}

/* ---------- Nur auf der Tafel schreiben (Wachstafel, Tontafel, Schiefertafel) ---------- */
function tplAreas() {                                      // beschreibbare Flächen in Board-Koordinaten
  const t = curTpl(); if (!t || !t.objects) return null;
  if (t.objects === 'wax') return OBJ_RECTS.wax().map(r => ({ r, rad: 0 }));
  if (t.objects === 'clay') return [{ r: OBJ_RECTS.clay()[0], rad: 110 }];
  if (t.objects === 'slate') return [{ r: OBJ_RECTS.slate()[0], rad: 0 }];
  return null;
}
function clipToAreas(c) { const A = tplAreas(); if (!A) return false; c.beginPath(); for (const a of A) { const [x0, y0, x1, y1] = a.r; a.rad ? rrectPath(c, x0, y0, x1 - x0, y1 - y0, a.rad) : c.rect(x0, y0, x1 - x0, y1 - y0); } c.clip(); return true; }
function rrectPath(c, x, y, w, hh, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + hh, r); c.arcTo(x + w, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function inAreas(p) { const A = tplAreas(); return !A || A.some(a => p.x >= a.r[0] && p.x <= a.r[2] && p.y >= a.r[1] && p.y <= a.r[3]); }
