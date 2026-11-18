"use strict";
/* ===== Eingabe: Zeiger, Mausrad, Tastatur ===== */
let drag = null, spaceDown = false, pinch = null;
const touches = new Map();
const sp = p => ({ x: snapV(p.x), y: snapV(p.y) });
const scrToWorld = (sx, sy) => [(sx - S.view.x) / S.view.z, (sy - S.view.y) / S.view.z];

function pinWorld(o, i) { const sym = SYM[o.sym], [px, py] = sym.pins[i]; return fromLocal(o, (px / sym.w - 0.5) * o.w, (py / sym.h - 0.5) * o.h); }
function anchorOf(o) { if (o.type === 'symbol' && SYM[o.sym] && SYM[o.sym].pins.length) return pinWorld(o, 0); const b = objBounds(o); return [b[0], b[1]]; }
function makeSymObj(id, p, rotDeg) {
  const sym = SYM[id], o = { type: 'symbol', sym: id, x: p.x - sym.w / 2, y: p.y - sym.h / 2, w: sym.w, h: sym.h, rot: rad(rotDeg), c: S.style.color, sw: 2.5, ls: 'solid' };
  if (S.settings.snap && sym.pins.length) { const [qx, qy] = pinWorld(o, 0); o.x += snapV(qx) - qx; o.y += snapV(qy) - qy; }
  return o;
}

/* ---------- Einrasten: Anschlusspunkte (Magnet) vor Raster ---------- */
function magnetPoint(p, exclude) {
  let best = null, bd = 14 / S.view.z;
  const test = (x, y) => { const d = Math.hypot(x - p.x, y - p.y); if (d < bd) { bd = d; best = { x, y }; } };
  for (const o of S.objs) {
    if (o === exclude) continue;
    if (o.type === 'symbol' && SYM[o.sym]) SYM[o.sym].pins.forEach((_, i) => test(...pinWorld(o, i)));
    else if (o.type === 'line' || o.type === 'arrow') { test(o.x1, o.y1); test(o.x2, o.y2); }
  }
  return best;
}
function snapPoint(p, exclude) {                      // Anschlusspunkt in der Nähe, sonst Rasterpunkt
  if (!S.settings.snap) { S.snapHint = null; return { x: p.x, y: p.y }; }
  const m = magnetPoint(p, exclude);
  if (m) { S.snapHint = m; return m; }
  S.snapHint = null; return sp(p);
}

/* ---------- Lineal-Hilfen ---------- */
function rulerEdgeZone(sx, sy) { const [lx, ly] = rulerLocal(sx, sy), L = rulerLenPx(); return lx >= -6 && lx <= L + 6 && ly >= -24 && ly <= 12; }
function rulerSnapWorld(sx, sy) {
  const [lx] = rulerLocal(sx, sy), x = clamp(lx, 0, rulerLenPx()), [rx, ry] = rotPt(x, 0, S.ruler.a);
  return scrToWorld(S.ruler.x + rx, S.ruler.y + ry);
}
function rulerDown(sx, sy) {
  const [kx, ky] = rulerKnob();
  if (Math.hypot(sx - kx, sy - ky) <= 14) { drag = { k: 'rknob' }; return true; }
  const [lx, ly] = rulerLocal(sx, sy), L = rulerLenPx();
  const drawing = ['pen', 'line', 'arrow'].includes(S.tool);
  if (lx >= -6 && lx <= L + 6) {
    if (drawing && ly >= -24 && ly <= 12) return false;
    if (ly >= 0 && ly <= RULER_H) { drag = { k: 'rmove', ox: sx - S.ruler.x, oy: sy - S.ruler.y }; return true; }
  }
  return false;
}

/* ---------- Zoom ---------- */
function zoomAt(f, cx, cy) {
  const nz = clamp(S.view.z * f, 0.1, 8), k = nz / S.view.z;
  S.view.x = cx - (cx - S.view.x) * k; S.view.y = cy - (cy - S.view.y) * k; S.view.z = nz;
  if (S.editing) layoutEditor(); markDirty(); render(); updateCursor();
}
function resetView() { S.view = { x: 0, y: 0, z: 1 }; markDirty(); render(); updateCursor(); }
function fitView() {
  const b = allBounds(S.objs); if (!b) return resetView();
  const w = Math.max(50, b[2] - b[0]), hh = Math.max(50, b[3] - b[1]), z = clamp(Math.min((innerWidth - 420) / w, (innerHeight - 260) / hh), 0.1, 2);
  S.view = { z, x: innerWidth / 2 - (b[0] + w / 2) * z, y: innerHeight / 2 - (b[1] + hh / 2) * z }; markDirty(); render(); updateCursor();
}

/* ---------- Zeiger unten ---------- */
function onDown(e) {
  e.preventDefault();
  const cv = $('#board'); cv.setPointerCapture(e.pointerId);
  const sx = e.clientX, sy = e.clientY;
  if (e.pointerType === 'touch') {
    touches.set(e.pointerId, { x: sx, y: sy });
    if (touches.size === 2) { drag = null; S.draft = null; const [a, b] = [...touches.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }; render(); return; }
  }
  if (S.editing) commitEdit();
  S.hover = { sx, sy };
  if (e.button === 1 || S.tool === 'hand' || spaceDown) { drag = { k: 'pan', sx, sy, vx: S.view.x, vy: S.view.y }; cv.style.cursor = 'grabbing'; return; }
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  if (S.tool === 'wire' && e.button === 2) { wireFinish(); return; }
  if (S.geo.on && geoDown(sx, sy)) return;
  if (S.ruler.on && rulerDown(sx, sy)) return;
  const p = toWorld(e), pre = snapshot(), pn = curPen();
  if (S.tool !== 'select' && S.sels.length) { S.sels = []; refreshUI(); }   // neues Zeichnen beendet die Auswahl
  switch (S.tool) {
    case 'pen': {
      let start = [p.x, p.y]; const snapR = instEdge(sx, sy);
      if (snapR) start = instSnapWorld(snapR, sx, sy);
      const pr = usePressure(e, pn);                       // Grafiktablett / Surface-Stift: Druckstärke mitschreiben
      if (pr) start = [start[0], start[1], +e.pressure.toFixed(3)];
      S.draft = { type: 'pen', pts: [start], c: pn.color, w: pn.width, kind: pn.kind, ls: pn.ls };
      if (pr) S.draft.pr = 1;
      drag = { k: 'draw', pre, snapR }; break;
    }
    case 'eraser': drag = { k: 'erase', pre }; erase(p); break;
    case 'line': case 'arrow': case 'rect': case 'ellipse': {
      const isLn = S.tool === 'line' || S.tool === 'arrow'; let q = isLn ? snapPoint(p) : sp(p); const snapR = isLn && instEdge(sx, sy);
      if (snapR) { const [wx, wy] = instSnapWorld(snapR, sx, sy); q = { x: wx, y: wy }; }
      drag = { k: 'shape', pre, x0: q.x, y0: q.y, snapR }; break;
    }
    case 'note': { const o = newNote(sp(p)); S.objs.push(o); startEdit(o, pre); break; }
    case 'text': {
      const t = hitTest(p);
      if (t && (t.type === 'text' || t.type === 'note')) startEdit(t, pre);
      else { const o = newText(sp(p)); S.objs.push(o); startEdit(o, pre); }
      break;
    }
    case 'place': {
      if (S.armedCirc) {                                  // ganze Schaltung absetzen
        const list = circGhost(p); list.forEach(o => S.objs.push(o)); S.ghost = null;
        setTool('select'); S.sels = list; record(pre); refreshUI(); toast(null); break;
      }
      if (!S.armed) break;
      const o = makeSymObj(S.armed, sp(p), S.armedRot); S.objs.push(o); S.sels = [];
      record(pre); toast(null); break;
    }
    case 'laser': break;                               // der Punkt folgt der Maus (siehe onMove)
    case 'parab': drag = { k: 'parab', pre, v: sp(p) }; break;
    case 'wire': wireDown(p, pre, e); break;
    case 'compass': compassDown(p, pre); break;
    case 'select': selectDown(e, p, pre); break;
  }
  render();
}

function compassDown(p, pre) {
  const k = S.compass, z = S.view.z, q = sp(p);
  if (k.cx == null) { k.cx = q.x; k.cy = q.y; k.tipA = 0; if (window.refreshUI) refreshUI(); return; }
  const [tx, ty] = compassTip();
  if (Math.hypot(p.x - tx, p.y - ty) <= 14 / z) {
    S.draft = { type: 'arc', cx: k.cx, cy: k.cy, r: compassRadius(), a0: k.tipA, sweep: 0, c: S.style.color, w: S.style.width, ls: S.style.ls };
    drag = { k: 'ctip', pre, last: k.tipA }; return;
  }
  if (Math.hypot(p.x - k.cx, p.y - k.cy) <= 14 / z) { drag = { k: 'cpivot' }; return; }
  k.cx = q.x; k.cy = q.y; if (window.refreshUI) refreshUI();           // Klick ins Leere setzt den Mittelpunkt neu
}

function selectDown(e, p, pre) {
  const z = S.view.z;
  if (S.sels.length === 1 && (S.sels[0].type === 'line' || S.sels[0].type === 'arrow')) {     // Endpunkte einer Linie ziehen
    const o = S.sels[0];
    if (Math.hypot(p.x - o.x1, p.y - o.y1) <= 10 / z) { drag = { k: 'lend', pre, o, which: 1 }; return; }
    if (Math.hypot(p.x - o.x2, p.y - o.y2) <= 10 / z) { drag = { k: 'lend', pre, o, which: 2 }; return; }
  }
  if (S.sels.length === 1 && isBox(S.sels[0])) {
    const o = S.sels[0], [lx, ly] = toLocal(o, p.x, p.y), tol = 9 / z;
    if (Math.hypot(lx, ly + o.h / 2 + ROT_DIST / z) <= tol + 2 / z) { drag = { k: 'rotate', pre, o }; return; }
    for (const [name, sx, sy] of handleDefs(o)) {
      if (Math.hypot(lx - sx * (o.w / 2 + 3 / z), ly - sy * (o.h / 2 + 3 / z)) <= tol) { drag = { k: 'resize', pre, o, o0: cloneObj(o), sx, sy }; return; }
    }
  }
  const t = hitTest(p);
  if (t) {
    if (e.shiftKey) S.sels = S.sels.includes(t) ? S.sels.filter(x => x !== t) : [...S.sels, t];
    else if (!S.sels.includes(t)) S.sels = [t];
    drag = { k: 'move', pre, start: p, anchor: anchorOf(S.sels[0] || t), applied: [0, 0] };
  } else {
    if (!e.shiftKey) S.sels = [];
    drag = { k: 'marq', x0: p.x, y0: p.y, base: S.sels.slice() };
  }
  if (window.refreshUI) refreshUI();
}

/* ---------- Zeiger bewegt ---------- */
function onMove(e) {
  const sx = e.clientX, sy = e.clientY;
  if (touches.has(e.pointerId)) {
    touches.set(e.pointerId, { x: sx, y: sy });
    if (pinch && touches.size >= 2) {
      const [a, b] = [...touches.values()], d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      S.view.x += mx - pinch.mx; S.view.y += my - pinch.my; zoomAt(d / pinch.d, mx, my); pinch = { d, mx, my }; return;
    }
  }
  S.hover = { sx, sy };
  if (!drag) {
    if (S.tool === 'place' && S.armedCirc) { S.ghost = circGhost(toWorld(e)); renderOverlay(); }
    else if (S.tool === 'place' && S.armed) { const p = sp(toWorld(e)); S.ghost = makeSymObj(S.armed, p, S.armedRot); renderOverlay(); }
    else if (S.tool === 'eraser') renderOverlay();
    else if (S.tool === 'laser') {
      const L = S.laser, now = performance.now();
      for (const ev of coalesced(e)) { const lp = toWorld(ev); L.pts.push({ x: lp.x, y: lp.y, t: now }); L.pos = lp; }
      L.active = true; renderOverlay();
    }
    else if (window.hoverTools) hoverTools(e);
    return;
  }
  const p = toWorld(e), z = S.view.z;
  switch (drag.k) {
    case 'pan': S.view.x = drag.vx + (sx - drag.sx); S.view.y = drag.vy + (sy - drag.sy); break;
    case 'rmove': S.ruler.x = sx - drag.ox; S.ruler.y = sy - drag.oy; break;
    case 'rknob': { let a = Math.atan2(sy - S.ruler.y, sx - S.ruler.x); if (e.shiftKey || Math.abs(a - Math.round(a / rad(15)) * rad(15)) < rad(1.5)) a = Math.round(a / rad(15)) * rad(15); S.ruler.a = a; break; }
    case 'draw': {
      const pts = S.draft.pts;
      if (drag.snapR) { pts.length = 1; pts.push(instSnapWorld(drag.snapR, sx, sy)); }
      else if (e.shiftKey || S.draft.kind === 'wedge') { pts.length = 1; pts.push([p.x, p.y]); }   // Keil: nur Ansatz und Richtung
      else for (const ev of coalesced(e)) {             // alle Zwischenpunkte nutzen → glattere Striche
        const q = toWorld(ev), l = pts[pts.length - 1]; if (Math.hypot(q.x - l[0], q.y - l[1]) > 1.2 / z) pts.push(S.draft.pr ? [q.x, q.y, +(ev.pressure || 0.5).toFixed(3)] : [q.x, q.y]);
      }
      shapeHold(sx, sy);
      break;
    }
    case 'erase': erase(p); break;
    case 'shape': shapeMove(e, p, sx, sy); break;
    case 'move': {
      const tx = p.x - drag.start.x, ty = p.y - drag.start.y;
      let dx = tx, dy = ty;
      if (S.settings.snap) { dx = snapV(drag.anchor[0] + tx) - drag.anchor[0]; dy = snapV(drag.anchor[1] + ty) - drag.anchor[1]; }
      for (const o of S.sels) moveObj(o, dx - drag.applied[0], dy - drag.applied[1]);
      drag.applied = [dx, dy]; break;
    }
    case 'resize': { const o0 = drag.o0, flat = Math.abs(Math.sin(o0.rot || 0)) < 1e-3 && o0.type !== 'text'; resizeMove(e, S.settings.snap && flat ? sp(p) : p); break; }
    case 'lend': {
      const o = drag.o, ox = drag.which === 1 ? o.x2 : o.x1, oy = drag.which === 1 ? o.y2 : o.y1;
      let q = snapPoint(p, o);
      if (e.shiftKey) { const dx = q.x - ox, dy = q.y - oy, L = Math.hypot(dx, dy), a = Math.round(Math.atan2(dy, dx) / rad(15)) * rad(15); q = { x: ox + L * Math.cos(a), y: oy + L * Math.sin(a) }; }
      if (drag.which === 1) { o.x1 = q.x; o.y1 = q.y; } else { o.x2 = q.x; o.y2 = q.y; }
      break;
    }
    case 'rotate': {
      const o = drag.o, [cx, cy] = center(o); let a = Math.atan2(p.y - cy, p.x - cx) + Math.PI / 2;
      const step = rad(15), near = Math.round(a / step) * step;
      if (e.shiftKey || Math.abs(a - near) < rad(3)) a = near;
      o.rot = a; if (window.syncRot) syncRot(); break;
    }
    case 'marq': { S.marquee = { x1: Math.min(drag.x0, p.x), y1: Math.min(drag.y0, p.y), x2: Math.max(drag.x0, p.x), y2: Math.max(drag.y0, p.y) }; break; }
    case 'laser': S.laser.pts.push({ x: p.x, y: p.y, t: performance.now() }); break;
    case 'cpivot': { const k = S.compass, q = sp(p); k.cx = q.x; k.cy = q.y; break; }
    case 'gmove': case 'gknob': geoMove(sx, sy, e); break;
    case 'parab': { const horiz = ((S.style.parabAxis || 'v') === 'h') !== e.shiftKey; S.draft = makeParab(drag.v, p, horiz); break; }
    case 'ctip': {
      const k = S.compass, a = Math.atan2(p.y - k.cy, p.x - k.cx); let d = a - drag.last;
      while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      S.draft.sweep = clamp(S.draft.sweep + d, -2 * Math.PI, 2 * Math.PI); drag.last = a; k.tipA = a; break;
    }
  }
  if (S.editing) layoutEditor();
  if (OVERLAY_DRAGS.has(drag.k)) renderOverlay(); else render();
}
const OVERLAY_DRAGS = new Set(['draw', 'drawShape', 'shape', 'marq', 'laser', 'cpivot', 'ctip', 'rmove', 'rknob', 'gmove', 'gknob', 'parab']);
const coalesced = e => (e.getCoalescedEvents && e.getCoalescedEvents().length ? e.getCoalescedEvents() : [e]);

function shapeMove(e, p, sx, sy) {
  const t = S.tool, c = S.style.color; let q = (t === 'line' || t === 'arrow') ? snapPoint(p) : sp(p);
  if (t === 'line' || t === 'arrow') {
    if (drag.snapR) { const [wx, wy] = instSnapWorld(drag.snapR, sx, sy); q = { x: wx, y: wy }; }
    else if (e.shiftKey) { const dx = q.x - drag.x0, dy = q.y - drag.y0, L = Math.hypot(dx, dy), a = Math.round(Math.atan2(dy, dx) / rad(15)) * rad(15); q = { x: drag.x0 + L * Math.cos(a), y: drag.y0 + L * Math.sin(a) }; }
    S.draft = { type: t, x1: drag.x0, y1: drag.y0, x2: q.x, y2: q.y, c, w: S.style.width, ls: S.style.ls };
  } else {
    let w = q.x - drag.x0, hgt = q.y - drag.y0;
    if (e.shiftKey) { const m = Math.max(Math.abs(w), Math.abs(hgt)); w = Math.sign(w || 1) * m; hgt = Math.sign(hgt || 1) * m; }
    S.draft = { type: t, x: Math.min(drag.x0, drag.x0 + w), y: Math.min(drag.y0, drag.y0 + hgt), w: Math.abs(w), h: Math.abs(hgt), rot: 0, c, sw: S.style.width, ls: S.style.ls, fill: S.style.fill, fillC: S.style.fillColor };
  }
}

function resizeMove(e, p) {
  const { o, o0, sx, sy } = drag, [lx, ly] = toLocal(o0, p.x, p.y);
  let w = o0.w, hgt = o0.h, fx = 0, fy = 0;
  if (o0.type === 'text') {                           // Text: gleichmäßig skalieren (Ecke unten rechts)
    const s = clamp((lx + o0.w / 2) / o0.w, 0.25, 12);
    o.size = Math.max(6, Math.round(o0.size * s)); measureTextObj(o);
    const [fxw, fyw] = fromLocal(o0, -o0.w / 2, -o0.h / 2), [dx, dy] = rotPt(o.w / 2, o.h / 2, o0.rot || 0);
    o.x = fxw + dx - o.w / 2; o.y = fyw + dy - o.h / 2; if (window.syncProps) syncProps(); return;
  }
  if (sx) { fx = -sx * o0.w / 2; w = Math.max(8, sx * (lx - fx)); }
  if (sy) { fy = -sy * o0.h / 2; hgt = Math.max(8, sy * (ly - fy)); }
  const corner = sx && sy, keep = corner && ((o0.type === 'image') !== e.shiftKey);   // Bilder: Ecken proportional, Umschalt = frei
  if (keep) { const s = Math.max(w / o0.w, hgt / o0.h); w = o0.w * s; hgt = o0.h * s; }
  const [wcx, wcy] = fromLocal(o0, sx ? fx + sx * w / 2 : 0, sy ? fy + sy * hgt / 2 : 0);
  o.w = w; o.h = hgt; o.x = wcx - w / 2; o.y = wcy - hgt / 2;
}

/* ---------- Zeiger los ---------- */
function onUp(e) {
  touches.delete(e.pointerId); if (touches.size < 2) pinch = null;
  if (!drag) return;
  const d = drag; drag = null;
  switch (d.k) {
    case 'pan': drag = null; updateCursor(); markDirty(); break;
    case 'rmove': case 'rknob': case 'gmove': case 'gknob': markDirty(); break;
    case 'parab': { const o = S.draft; S.draft = null; S.parabInfo = null; if (o) { S.objs.push(o); S.sels = [o]; } record(d.pre); if (window.refreshUI) refreshUI(); break; }
    case 'draw': clearTimeout(d.ht); S.objs.push(S.draft); S.draft = null; record(d.pre); break;
    case 'drawShape': S.objs.push(S.draft); S.draft = null; record(d.pre); break;   // erkannte Form
    case 'erase': record(d.pre); if (window.refreshUI) refreshUI(); break;
    case 'shape': {
      const o = S.draft; S.draft = null;
      const ok = o && (o.type === 'line' || o.type === 'arrow' ? Math.hypot(o.x2 - o.x1, o.y2 - o.y1) > 3 : o.w > 3 || o.h > 3);
      if (ok) { S.objs.push(o); S.sels = [o]; } S.snapHint = null; record(d.pre); if (window.refreshUI) refreshUI(); break;
    }
    case 'move': case 'resize': case 'rotate': case 'lend': S.snapHint = null; record(d.pre); if (window.refreshUI) refreshUI(); break;
    case 'marq': {
      const m = S.marquee; S.marquee = null;
      if (m) { const hit = S.objs.filter(o => { if (o.lock) return false; const b = objBounds(o); return b[2] >= m.x1 && b[0] <= m.x2 && b[3] >= m.y1 && b[1] <= m.y2; }); S.sels = [...new Set([...d.base, ...hit])]; }
      if (window.refreshUI) refreshUI(); break;
    }
    case 'laser': S.laser.active = false; break;
    case 'ctip': { let a = S.draft; S.draft = null; if (a && Math.abs(a.sweep) > 0.02) { if (curTpl()) a = arcToPen(a); S.objs.push(a); S.sels = [a]; } record(d.pre); if (window.refreshUI) refreshUI(); break; }
  }
  render();
}

function onDbl(e) {
  const p = toWorld(e), t = hitTest(p);
  if (!t && (S.tool === 'select' || S.tool === 'hand')) { const l = hitTest(p, true); if (l && l.lock) { setTool('select'); S.sels = [l]; refreshUI(); render(); return; } }
  if (S.tool === 'select' && t && (t.type === 'text' || t.type === 'note')) startEdit(t, snapshot());
}
function onWheel(e) {
  e.preventDefault();
  const m = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? innerHeight : 1;          // Firefox meldet Mausrad-Schritte oft in Zeilen statt Pixeln
  const dx = e.deltaX * m, dy = e.deltaY * m;
  if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-dy * (e.deltaMode ? 0.003 : 0.01)), e.clientX, e.clientY);
  else { S.view.x -= dx; S.view.y -= dy; if (S.editing) layoutEditor(); markDirty(); render(); }
}

/* ---------- Tastatur ---------- */
const KEYTOOL = { v: 'select', h: 'hand', p: 'pen', e: 'eraser', l: 'line', a: 'arrow', r: 'rect', o: 'ellipse', n: 'note', t: 'text', c: 'compass', j: 'laser', k: 'parab' };
function onKey(e) {
  if (S.screen !== 'editor') return;
  if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if (document.querySelector('#modal-root .ov')) return;
  const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
  if (e.code === 'Space') { if (!spaceDown) { spaceDown = true; $('#board').style.cursor = 'grab'; } e.preventDefault(); return; }
  if (mod) {
    if (k === 'z') { e.shiftKey ? redo() : undo(); e.preventDefault(); }
    else if (k === 'y') { redo(); e.preventDefault(); }
    else if (k === 'a') { selectAll(); e.preventDefault(); }
    else if (k === 'c') { copySel(); }
    else if (k === 'x') { copySel(); deleteSel(); }
    else if (k === 'd') { duplicateSel(); e.preventDefault(); }
    return;
  }
  if (k === 'delete' || k === 'backspace') { deleteSel(); return; }
  if (k === 'escape' && S.wire) { wireFinish(); return; }
  if (k === 'escape') { if (S.tool === 'place' || S.tool === 'compass') setTool('select'); else { S.sels = []; if (window.refreshUI) refreshUI(); render(); } return; }
  if (k === 'q') {                                      // 90° drehen
    if (S.tool === 'place' && S.armedCirc) { S.armedCirc.rot = (S.armedCirc.rot + 90) % 360; if (S.hover) S.ghost = circGhost({ x: (S.hover.sx - S.view.x) / S.view.z, y: (S.hover.sy - S.view.y) / S.view.z }); renderOverlay(); }
    else if (S.tool === 'place') { S.armedRot = (S.armedRot + 90) % 360; if (S.hover) { S.ghost = makeSymObj(S.armed, sp({ x: (S.hover.sx - S.view.x) / S.view.z, y: (S.hover.sy - S.view.y) / S.view.z }), S.armedRot); } render(); }
    else if (S.sels.length) { const pre = snapshot(); S.sels.forEach(o => { if (isBox(o)) o.rot = (o.rot || 0) + Math.PI / 2; }); record(pre); }
    return;
  }
  if (k.startsWith('arrow') && S.sels.length) {
    const st = e.shiftKey ? 10 : 1, pre = snapshot(); e.preventDefault();
    const dx = k === 'arrowleft' ? -st : k === 'arrowright' ? st : 0, dy = k === 'arrowup' ? -st : k === 'arrowdown' ? st : 0;
    S.sels.forEach(o => moveObj(o, dx, dy)); record(pre); return;
  }
  if (e.key === 'Tab') { e.preventDefault(); togglePanels(); return; }
  if (k === 'f') { toggleFullscreen(); return; }
  if (/^[1-9]$/.test(k) && +k <= pensList().length) { selectPen(+k - 1); return; }
  if (k === 'd' && flipStylus()) return;
  if ((k === 'pagedown' || k === 'pageup') && curTpl() && curTpl().objects === 'wax') { goTablet((S.tablet || 0) + (k === 'pagedown' ? 1 : -1)); e.preventDefault(); return; }
  if (k === 'pagedown' || k === 'pageup') { gotoPage(S.page + (k === 'pagedown' ? 1 : -1)); e.preventDefault(); return; }
  const KEYID = { ...KEYTOOL, u: 'ruler', g: 'geo', b: 'elec', w: 'wire' };
  if (KEYID[k] && (!toolAllowed(KEYID[k]) || S.settings.tools[KEYID[k]] === false)) return;                       // nur historische Werkzeuge
  if (k === 'u' && window.toggleRuler) { toggleRuler(); return; }
  if (k === 'g') { toggleGeo(); return; }
  if (k === 'w' && S.settings.electronics) { setTool('wire'); return; }
  if (k === 'b' && window.toggleElec) { toggleElec(); return; }
  if (KEYTOOL[k]) { setTool(KEYTOOL[k]); e.preventDefault(); }
}
function initInput() {
  const cv = $('#board');
  cv.addEventListener('pointerdown', onDown); cv.addEventListener('pointermove', onMove);
  cv.addEventListener('pointerup', onUp); cv.addEventListener('pointercancel', onUp);
  cv.addEventListener('dblclick', onDbl); cv.addEventListener('wheel', onWheel, { passive: false });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('pointerleave', () => { S.laser.active = false; if (!drag) { S.hover = null; renderOverlay(); } });
  addEventListener('keydown', onKey);
  addEventListener('keyup', e => { if (e.code === 'Space') { spaceDown = false; updateCursor(); } });
  addEventListener('paste', e => { if (S.screen !== 'editor' || e.target === $('#ed')) return; const fs = [...((e.clipboardData && e.clipboardData.files) || [])]; if (fs.length) { e.preventDefault(); addFiles(fs, viewCenter()); } else if (pasteClip()) e.preventDefault(); });
  addEventListener('dragover', e => e.preventDefault());
  addEventListener('drop', e => { e.preventDefault(); if (S.screen === 'editor' && e.dataTransfer && e.dataTransfer.files.length) addFiles([...e.dataTransfer.files], toWorld(e)); });
  addEventListener('resize', () => { if (S.screen === 'editor') resizeBoard(); });
  initEditor();
}

function usePressure(e, pn) {
  return S.settings.pressure !== false && e.pointerType === 'pen' && e.pressure > 0 && !['highlighter', 'wedge'].includes(pn.kind) && !(pn.ls && pn.ls !== 'solid');
}
