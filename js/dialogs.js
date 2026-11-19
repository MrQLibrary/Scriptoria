"use strict";
/* ===== Dialoge & Menüs ===== */
function dialog({ title, body, buttons, wide, onOpen }) {
  buttons = buttons || [{ label: 'OK', primary: true, value: true }];
  return new Promise(resolve => {
    const root = $('#modal-root');
    const close = v => { ov.remove(); document.removeEventListener('keydown', key, true); resolve(v); };
    const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(null); } };
    const bar = h('div', { class: 'df' }, buttons.map(b => h('button', { class: 'btn' + (b.primary ? ' primary' : '') + (b.danger ? ' danger' : ''), onclick: () => close(typeof b.value === 'function' ? b.value() : b.value) }, b.label)));
    const dlg = h('div', { class: 'dlg' + (wide ? ' wide' : ''), role: 'dialog' }, h('h2', {}, title), h('div', { class: 'db' }, body), bar);
    const ov = h('div', { class: 'ov', onmousedown: e => { if (e.target === ov) close(null); } }, dlg);
    root.append(ov); document.addEventListener('keydown', key, true);
    if (onOpen) onOpen(dlg, close);
    const first = dlg.querySelector('input[type=text],input[type=number]'); if (first) { first.focus(); first.select(); }
  });
}
async function askText(title, label, value = '', okLabel = 'OK') {
  const inp = h('input', { type: 'text', value });
  const res = await dialog({
    title, body: [h('label', {}, label), h('div', { class: 'frow' }, inp)],
    buttons: [{ label: 'Abbrechen', value: null }, { label: okLabel, primary: true, value: () => inp.value.trim() || null }],
    onOpen: (d, close) => inp.addEventListener('keydown', e => { if (e.key === 'Enter') close(inp.value.trim() || null); })
  });
  return res;
}
const confirmDlg = (title, msg, okLabel = 'OK', danger = false) =>
  dialog({ title, body: h('p', {}, msg), buttons: [{ label: 'Abbrechen', value: false }, { label: okLabel, primary: !danger, danger, value: true }] });

function popupMenu(anchor, items) {
  document.querySelectorAll('.menu').forEach(m => m.remove());
  const r = anchor.getBoundingClientRect();
  const m = h('div', { class: 'menu' }, items.map(it => it === '-' ? h('hr') : h('button', { onclick: () => { m.remove(); it.run(); } }, it.label)));
  document.body.append(m);
  const w = m.offsetWidth, hh = m.offsetHeight;
  m.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + 'px';
  m.style.top = (r.bottom + hh + 12 > innerHeight ? Math.max(8, r.top - hh - 4) : r.bottom + 4) + 'px';
  const off = e => { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('pointerdown', off, true); } };
  setTimeout(() => document.addEventListener('pointerdown', off, true), 0);
}

/* ---------- Einstellungen ---------- */
function filterSettings(inp) {                          // Einstellungen durchsuchen
  const q = inp.value.trim().toLowerCase(), db = inp.closest('.db'); let head = null, any = false;
  const flush = () => { if (head) head.style.display = any || !q ? '' : 'none'; };
  for (const el of db.children) {
    if (el === inp) continue;
    if (el.tagName === 'H3') { flush(); head = el; any = false; continue; }
    const show = !q || el.textContent.toLowerCase().includes(q) || (head && head.textContent.toLowerCase().includes(q));
    el.style.display = show ? '' : 'none'; if (show) any = true;
  }
  flush();
}
function iconPicker() {
  const box = h('div', { class: 'iconpick' }), mk = () => box.replaceChildren(...APP_ICONS.map(([id, label]) =>
    h('button', { class: S.settings.appIcon === id ? 'on' : '', title: label, onclick: () => { changeSetting('appIcon', id); mk(); } }, h('img', { src: `icons/app/${id}.svg`, alt: '' }), label)));
  mk(); return box;
}
function segSetting(key, opts) {                       // kleine Umschaltfläche für eine Einstellung
  const seg = h('div', { class: 'seg', style: 'width:auto;flex:0 0 auto' }), mk = () => seg.replaceChildren(...opts.map(([l, v]) =>
    h('button', { class: S.settings[key] === v ? 'on' : '', style: 'padding:6px 12px', onclick: () => { changeSetting(key, v); mk(); } }, l)));
  mk(); return seg;
}
function switchRow(label, desc, checked, onchange) {
  const inp = h('input', { type: 'checkbox' }); inp.checked = checked; inp.onchange = () => onchange(inp.checked);
  return h('div', { class: 'frow' }, h('label', {}, h('div', {}, label), desc && S.settings.hints !== false ? h('div', { class: 'muted' }, desc) : null), h('label', { class: 'switch' }, inp, h('span')));
}
function openSettings() {
  const seg = h('div', { class: 'seg' }), mkSeg = () => {
    seg.replaceChildren(...[['light', 'Hell'], ['dark', 'Dunkel'], ['system', 'System']].map(([v, l]) =>
      h('button', { class: S.settings.theme === v ? 'on' : '', onclick: () => { changeSetting('theme', v); mkSeg(); } }, l)));
  }; mkSeg();
  const gridSeg = h('div', { class: 'seg', style: 'width:auto;flex:0 0 auto' }), mkGrid = () => {
    gridSeg.replaceChildren(...[['Fein', 10], ['Mittel', 20], ['Grob', 40]].map(([l, v]) => h('button', { class: S.settings.gridSize === v ? 'on' : '', style: 'padding:6px 12px', onclick: () => { changeSetting('gridSize', v); mkGrid(); } }, l)));
  }; mkGrid();
  const bar = h('div', { class: 'calbar' }), setBar = () => bar.style.width = S.settings.pxPerCm * 10 + 'px';
  setBar();
  const meas = h('input', { type: 'number', step: '0.1', min: '1', max: '30', value: '10', style: 'width:90px' });
  const tog = (key, label, desc) => switchRow(label, desc, S.settings.tools[key] !== false, v => { S.settings.tools = { ...S.settings.tools, [key]: v }; changeSetting('tools', S.settings.tools); });
  const body = [
    h('input', { class: 'search', type: 'search', placeholder: 'Einstellung suchen …', oninput: e => filterSettings(e.target) }),
    h('h3', {}, 'Darstellung'), seg,
    h('div', { class: 'frow', style: 'display:block' }, h('label', {}, 'App-Symbol'), iconPicker(),
      hint('Gilt sofort für Tab und Startbildschirm. Für die installierte App muss Scriptoria aus Edge neu installiert werden (siehe ⓘ Hilfe → Ansicht).')),
    switchRow('Hilfetexte anzeigen', 'Kurze Hinweise in der rechten Leiste und in Meldungen.', S.settings.hints !== false, v => changeSetting('hints', v)),
    h('h3', {}, 'Hilfslinien'),
    switchRow('Hilfslinien anzeigen', null, S.settings.grid, v => changeSetting('grid', v)),
    h('div', { class: 'frow' }, h('label', {}, 'Art'), segSetting('gridType', [['Punkte', 'dots'], ['Karos', 'squares'], ['Linien', 'lines']])),
    h('div', { class: 'frow' }, h('label', {}, 'Stärke'), segSetting('gridWeight', [['Fein', 'fein'], ['Mittel', 'mittel'], ['Kräftig', 'kraeftig']])),
    h('div', { class: 'frow' }, h('label', {}, 'Rastergröße'), gridSeg),
    switchRow('Am Raster einrasten', 'Linien, Formen und Bauteile rasten ein.', S.settings.snap, v => changeSetting('snap', v)),
    h('h3', {}, 'Schreiben'),
    switchRow('Druckempfindlicher Stift', 'Mit Grafiktablett oder Surface-Stift wird der Strich dicker, je fester man drückt.', S.settings.pressure !== false, v => changeSetting('pressure', v)),
    switchRow('Formen erkennen', 'Stift am Ende kurz stillhalten: Linie, Kreis, Ellipse, Rechteck oder Dreieck wird sauber gezogen.', S.settings.shapes !== false, v => changeSetting('shapes', v)),
    h('div', { class: 'frow' }, h('label', {}, 'PDF einfügen'), segSetting('pdfMode', [['Fragen', 'ask'], ['Untereinander', 'stack'], ['Je Seite', 'pages']])),
    h('div', { class: 'frow' }, h('label', {}, 'PDF-Seiten nebeneinander'), segSetting('pdfCols', [['1', 1], ['2', 2], ['3', 3], ['4', 4]])),
    h('h3', {}, 'Werkzeuge in der Leiste'),
    tog('ruler', 'Lineal'), tog('geo', 'Geodreieck'), tog('compass', 'Zirkel'), tog('parab', 'Parabel'), tog('laser', 'Laserpointer'),
    tog('plot', 'Funktionsplotter & Koordinatensystem'), tog('phasor', 'Zeigerdiagramm'), tog('diagram', 'Diagramm-Vorlagen', 'Bode-Diagramm, Oszilloskop-Raster, Kennlinienfeld …'), tog('timer', 'Stoppuhr'),
    h('h3', {}, 'Elektronik'),
    switchRow('Elektronik-Baukasten', 'Bauteile, Schaltungen und Leitungswerkzeug.', S.settings.electronics, v => changeSetting('electronics', v)),
    h('h3', {}, 'Historische Tafeln'),
    switchRow('Historische Vorlagen', 'Kreidetafel, Papyrus, Wachstafel, Sandtafel, Tontafel, Schiefertafel und Pergament anbieten.', S.settings.historic, v => changeSetting('historic', v)),
    switchRow('Nur historische Werkzeuge', 'Moderne Werkzeuge auf historischen Tafeln ausblenden.', S.settings.histPure, v => changeSetting('histPure', v)),
    h('h3', {}, 'Lineal-Kalibrierung (1:1)'),
    hint('Der blaue Balken soll genau 10 cm lang sein. Mit einem echten Lineal nachmessen und den Wert eintragen.'),
    bar,
    h('div', { class: 'frow' }, meas, h('span', {}, 'cm gemessen'), h('button', { class: 'btn sm', onclick: () => {
      const m = parseFloat(meas.value); if (!(m > 0.5)) return;
      changeSetting('pxPerCm', S.settings.pxPerCm * 10 / m); meas.value = '10'; setBar(); toast('Lineal kalibriert.');
    } }, 'Übernehmen'), h('button', { class: 'btn sm', onclick: () => { changeSetting('pxPerCm', 96 / 2.54); meas.value = '10'; setBar(); } }, 'Zurücksetzen'))
  ];
  return dialog({ title: 'Einstellungen', body, buttons: [{ label: 'Fertig', primary: true, value: true }] });
}

/* ---------- Anleitung für den Elektronik-Baukasten ---------- */
function openElecHelp() {
  const sym = `{
  "id": "meinwiderstand",
  "name": "Mein Widerstand",
  "cat": "Eigene Symbole",
  "w": 80, "h": 40,
  "pins":  [[0, 20], [80, 20]],
  "paths": ["M0,20 H20 M60,20 H80 M20,10 H60 V30 H20 Z"],
  "fills": [],
  "texts": [{ "t": "R", "x": 40, "y": 21, "s": 14 }]
}`;
  const body = h('div', { html: `
<h3>1. Bauteile einfügen</h3>
<p>Öffnen Sie mit dem Chip-Symbol in der linken Leiste (Taste <code>B</code>) den Baukasten. Wählen Sie ein Bauteil und klicken Sie auf die Fläche – es bleibt ausgewählt, Sie können mehrere setzen. Mit <code>Q</code> drehen Sie es vor dem Platzieren um 90°, <code>Esc</code> beendet das Platzieren. Schalten Sie in den Einstellungen oder oben in der Leiste <b>Raster einrasten</b> ein, dann treffen sich die Anschlüsse exakt.</p>
<h3>2. Verbinden</h3>
<p>Leitungen zeichnen Sie mit dem <b>Linien</b>-Werkzeug (Taste <code>L</code>) bei aktivem Einrasten. Halten Sie <code>Umschalt</code> für waagerechte/senkrechte Linien. Knoten setzen Sie mit dem Bauteil „Knoten“. Beschriftungen mit dem Text-Werkzeug oder – bei Bauteilen – im Feld „Beschriftung“ rechts.</p>
<h3>3. Fertige Schaltungen</h3>
<p>Im Reiter <b>Schaltungen</b> finden Sie Standardschaltungen (Spannungsteiler, Filter, Verstärker, Gleichrichter, …). Nach einem Klick hängt die Schaltung am Mauszeiger: <code>Q</code> dreht sie um 90°, ein Klick auf die Fläche setzt sie ab, <code>Esc</code> bricht ab. Danach können Sie alles verschieben, drehen und ändern.</p>
<h3>4. Eigene Schaltungen hinzufügen</h3>
<p>Zeichnen oder bauen Sie Ihre Schaltung, markieren Sie alles (Strg+A oder Rahmen aufziehen) und wählen Sie im Reiter <b>Schaltungen</b> <b>„Auswahl als Schaltung speichern“</b>. Sie erscheint danach dauerhaft unter „Eigene Schaltungen“. Mit den Knöpfen unten im Baukasten lassen sich eigene Schaltungen exportieren (zum Weitergeben), importieren oder löschen.</p>
<h3>5. Eigene Bauteile (Symbole) hinzufügen</h3>
<p>Erstellen Sie eine <code>.json</code>-Datei und laden Sie sie im Reiter <b>Bauteile</b> mit „Symbole importieren …“. Eine Datei kann ein Symbol oder eine Liste von Symbolen enthalten:</p>
<pre>${sym.replace(/</g, '&lt;')}</pre>
<ul>
<li><code>w</code>, <code>h</code>: Größe in Board-Einheiten, der Ursprung ist links oben, y zeigt nach unten.</li>
<li><code>paths</code>: Linien als SVG-Pfade (<code>M</code> = hinfahren, <code>L</code> = Linie, <code>H</code>/<code>V</code> = waagerecht/senkrecht, <code>A</code> = Kreisbogen, <code>Z</code> = schließen).</li>
<li><code>fills</code>: ausgefüllte Flächen (z. B. Pfeilspitzen), ebenfalls als SVG-Pfade.</li>
<li><code>pins</code>: Anschlusspunkte, am besten auf dem 10er-Raster.</li>
<li><code>texts</code>: Buchstaben im Symbol (<code>s</code> = Schriftgröße).</li>
</ul>
<p>Tipp: Pfade können Sie in jedem SVG-Editor (z. B. Inkscape) zeichnen und die <code>d</code>-Werte hier einfügen.</p>
<h3>Tastenkürzel</h3>
<p><code>V</code> Auswahl · <code>H</code> Hand · <code>P</code> Stift · <code>E</code> Radierer · <code>L</code> Linie · <code>A</code> Pfeil · <code>R</code> Rechteck · <code>O</code> Ellipse · <code>T</code> Text · <code>N</code> Notiz · <code>C</code> Zirkel · <code>J</code> Laserpointer · <code>U</code> Lineal · <code>B</code> Baukasten · <code>Q</code> 90° drehen · Strg+Z/Y Rückgängig/Wiederholen · Strg+S Speichern</p>` });
  return dialog({ title: 'Anleitung: Elektronik-Baukasten', body, wide: true, buttons: [{ label: 'Schließen', primary: true, value: true }] });
}

/* ---------- PDF-Export ---------- */
function openPdfExport() {
  const fmt = h('select', {}, h('option', { value: 'fit' }, 'An den Inhalt angepasst (eine Seite)'), h('option', { value: 'a4l' }, 'A4 quer'), h('option', { value: 'a4p' }, 'A4 hoch'));
  const sel = h('input', { type: 'checkbox' }); sel.disabled = !S.sels.length;
  const all = h('input', { type: 'checkbox', checked: S.pages && S.pages.length > 1 }); all.disabled = !(S.pages && S.pages.length > 1);
  return dialog({
    title: 'Als PDF exportieren',
    body: [h('div', { class: 'frow' }, h('label', {}, 'Seitenformat'), fmt),
      h('div', { class: 'frow' }, h('label', {}, 'Alle Seiten (je Seite eine PDF-Seite)'), all),
      h('div', { class: 'frow' }, h('label', {}, 'Nur die Auswahl exportieren'), sel)],
    buttons: [{ label: 'Abbrechen', value: null }, { label: 'Exportieren', primary: true, value: () => ({ format: fmt.value, onlySel: sel.checked, allPages: all.checked && !sel.checked }) }]
  });
}

/* ---------- Hilfe: alle Funktionen auf einen Blick ---------- */
function openHelp() {
  const k = s => `<code>${s}</code>`;
  const body = h('div', { class: 'help', html: `
<input class="search" type="search" placeholder="In der Hilfe suchen …">
<p>Scriptoria ist ein digitales Whiteboard für Vorlesung und Unterricht. Es läuft im Browser, funktioniert nach dem ersten Laden auch ohne Internet und speichert alles automatisch.</p>
<nav class="toc">${['Start & Speichern', 'PDF & Seiten', 'Stifte & Radierer', 'Formen, Text & Notizen', 'Formeln (LaTeX)', 'Zeichengeräte', 'Elektronik', 'Präsentieren', 'Historische Tafeln', 'Ansicht', 'Zusatzwerkzeuge', 'Tastenkürzel'].map((t, i) => `<a href="#hs${i}">${t}</a>`).join('')}</nav>

<h3 id="hs0">Start & Speichern</h3>
<ul>
<li><b>Neues Whiteboard</b> legt eine leere, unbegrenzte Fläche an. Zuletzt verwendete Boards erscheinen als Karten; über <b>⋯</b> lassen sie sich umbenennen, duplizieren, als Datei sichern oder löschen.</li>
<li><b>Automatisches Speichern:</b> Jede Änderung wird nach etwa einer Sekunde im Browser gespeichert, ebenso beim Schließen des Tabs oder beim Wechsel in ein anderes Fenster. Oben neben dem Namen steht „✓ Gespeichert“.</li>
<li><b>Als Datei sichern:</b> ${k('Strg+S')} lädt das Board als <code>.owb</code>-Datei herunter (inklusive Bilder). Wichtig, denn „Websitedaten löschen“ im Browser entfernt auch die Boards. Öffnen über „Datei öffnen …“ oder per Drag & Drop.</li>
<li><b>Export:</b> Über das Pfeil-Symbol oben rechts als PDF (A4 oder passend zum Inhalt) oder PNG-Bild.</li>
</ul>

<h3 id="hs1">PDF & Seiten</h3>
<ul>
<li><b>PDF oder Bild einfügen:</b> Bild-Symbol links, Datei auf die Fläche ziehen oder ${k('Strg+V')}. Bei PDFs wählen Sie, <b>welche Seiten</b> eingefügt werden (z. B. ${k('5-20')} oder ${k('1-3, 7, 10-12')}), ob sie <b>untereinander</b> oder <b>jede als eigene Seite</b> erscheinen und wie viele PDF-Seiten <b>nebeneinander</b> stehen (Voreinstellung in den Einstellungen). Danach ist sofort der Stift aktiv.</li>
<li>PDF-Seiten sind <b>fixiert</b>: Beim Schreiben und Auswählen verrutschen sie nicht. Doppelklick (mit Auswahl- oder Hand-Werkzeug) wählt eine Seite trotzdem aus; rechts lässt sich „Fixiert“ ausschalten.</li>
<li>Ein PDF auf den Startbildschirm ziehen legt direkt ein neues Whiteboard damit an.</li>
<li><b>Seiten:</b> Unten rechts blättern (‹ ›, ${k('Bild ↑')}/${k('Bild ↓')}) oder mit ＋ eine neue Seite anlegen. Jede Seite ist eine eigene unendliche Fläche. Klick auf die Seitenzahl: verschieben oder löschen. Der PDF-Export kann alle Seiten auf einmal ausgeben.</li>
</ul>

<h3 id="hs2">Stifte & Radierer</h3>
<ul>
<li>Unten wählen Sie zwischen Bleistift, Kugelschreiber, Füllfederhalter, Edding und drei Textmarkern – oder mit den Zifferntasten ${k('1')}–${k('7')}. Farbe, Dicke und Linientyp jedes Stifts stellen Sie rechts ein; sie bleiben gespeichert.</li>
<li>Beim Schreiben zeigt der Mauszeiger einen Punkt in Farbe und Größe des Stifts. Mit Grafiktablett oder Surface-Stift ist der Strich <b>druckempfindlich</b>.</li>
<li><b>Formen erkennen:</b> Am Ende des Strichs den Stift kurz stillhalten – Linie, Kreis, Ellipse, Rechteck oder Dreieck werden sauber gezogen.</li>
<li>${k('Umschalt')} beim Zeichnen ergibt eine gerade Linie.</li>
<li><b>Radierer</b> (${k('E')}): „Teile“ entfernt nur, was unter dem Radierer liegt, „Ganze Striche“ den ganzen Strich. Bilder und PDFs bleiben beim Radieren erhalten.</li>
</ul>

<h3 id="hs3">Formen, Text & Notizen</h3>
<ul>
<li>Linie ${k('L')}, Pfeil ${k('A')}, Rechteck ${k('R')}, Ellipse ${k('O')}: aufziehen; mit ${k('Umschalt')} waagerecht/senkrecht bzw. Quadrat/Kreis.</li>
<li>Text ${k('T')}: auf die Fläche klicken und schreiben. Haftnotiz ${k('N')}: farbiger Zettel mit Text. Doppelklick bearbeitet vorhandenen Text.</li>
<li><b>Auswahl</b> ${k('V')}: anklicken oder Rahmen aufziehen; Griffe zum Vergrößern, runder Griff zum Drehen. ${k('Entf')} löscht, ${k('Strg+D')} dupliziert, ${k('Strg+C')}/${k('Strg+V')} kopiert, Pfeiltasten verschieben.</li>
</ul>

<h3 id="hs4">Formeln (LaTeX)</h3>
<p>In Text, Haftnotizen und Bauteil-Beschriftungen werden Formeln zwischen Dollarzeichen gesetzt, z. B. ${k('Ohmsches Gesetz: $U = R \\cdot I$')} oder ${k('$f_g = \\frac{1}{2\\pi RC}$')}. Der Text daneben bleibt in der gewählten Schrift. Die Formeldarstellung (MathJax) ist eingebaut und funktioniert auch offline.</p>

<h3 id="hs5">Zeichengeräte</h3>
<ul>
<li><b>Lineal</b> ${k('U')} und <b>Geodreieck</b> ${k('G')} erscheinen in Originalgröße auf dem Bildschirm (Kalibrierung in den Einstellungen). Ziehen verschiebt, der blaue Knopf dreht (mit ${k('Umschalt')} in 15°-Schritten). Setzen Sie Stift oder Linie an einer Kante an, entsteht eine exakt gerade Linie. Das Geodreieck hat eine cm-Skala mit Nullpunkt in der Mitte und eine Winkelskala.</li>
<li><b>Zirkel</b> ${k('C')}: Mittelpunkt setzen, roten Punkt ziehen. Öffnungswinkel und Schenkellänge bestimmen den Radius.</li>
<li><b>Parabel</b> ${k('K')}: Am Scheitelpunkt ansetzen und zu einem Kurvenpunkt ziehen. Die Gleichung (in cm) wird beim Ziehen angezeigt. Achse senkrecht oder waagerecht; ${k('Umschalt')} wechselt.</li>
</ul>

<h3 id="hs6">Elektronik</h3>
<ul>
<li><b>Baukasten</b> ${k('B')}: über 70 Schaltsymbole (IEC/DIN) in den Gruppen Grundbauteile, Halbleiter, Quellen & Messgeräte sowie Verstärker & Logik. Bauteil anklicken, dann auf die Fläche klicken. ${k('Q')} dreht um 90°, ${k('Esc')} beendet.</li>
<li><b>Fertige Schaltungen</b> (Reiter „Schaltungen“): Spannungsteiler, Filter, Schwingkreise, Operationsverstärker-Grundschaltungen, Gleichrichter, Transistorstufen, Messschaltungen u. v. m. Die Schaltung hängt nach dem Anklicken am Mauszeiger, ${k('Q')} dreht sie, ein Klick setzt sie ab.</li>
<li><b>Leitung ziehen</b> ${k('W')}: Am Anschluss klicken, Eckpunkte setzen – die Leitung verläuft rechtwinklig und endet automatisch an einem Anschluss oder einer anderen Leitung. Knotenpunkte an Abzweigungen werden selbst gesetzt. Doppelklick, Rechtsklick oder ${k('Esc')} beendet.</li>
<li>Beschriftungen von Bauteilen (rechts im Feld „Beschriftung“) dürfen Formeln enthalten, z. B. ${k('$R_1 = 10\\,\\mathrm{k\\Omega}$')}.</li>
<li><b>Simulieren</b> (▶ in der Werkzeugleiste oder im Baukasten): Die gezeichnete Schaltung wird berechnet – wie beim Falstad-Simulator. Gelbe Punkte zeigen den Strom, die Farbe der Leitungen die Spannung (grün positiv, rot negativ). Amperemeter und Voltmeter zeigen ihren Wert und erscheinen im <b>Oszilloskop</b>. Ein Klick auf ein Bauteil nimmt seine Spannung ins Oszilloskop auf, ein Klick auf einen Schalter legt ihn um (auch in der Zeichnung), ein Taster schließt, solange er gedrückt wird, und am Potentiometer setzt der Klick den Schleifer. <b>Logikschaltungen:</b> An allen Gatter-Ein- und -Ausgängen steht der Pegel 0 oder 1 (grün = 1). Anschlüsse (○), die nur Gatter-Eingänge speisen, sind Eingänge: Antippen schaltet zwischen 0 und 1. Anschlüsse an Gatter-Ausgängen zeigen das Ergebnis. Werte wie ${k('4,7 kΩ')}, ${k('100 µF')} oder ${k('10 V 50 Hz')} stehen rechts unter „Wert“. Simuliert werden Widerstände, Kondensatoren, Spulen, Quellen, Dioden, LEDs, Z-Dioden, Transistoren (NPN/PNP), Operationsverstärker, Logikgatter, Schalter, Lampen und Messgeräte. Änderungen an der Schaltung wirken sofort.</li>
<li>Eigene Schaltungen speichern: alles markieren, „Als Schaltung speichern …“. Eigene Symbole lassen sich als JSON-Datei importieren – siehe „Anleitung“ im Baukasten.</li>
</ul>

<h3 id="hs7">Präsentieren</h3>
<ul>
<li><b>Präsentationsfenster</b> (Bildschirm-Symbol oben): öffnet ein zweites Fenster für Beamer oder zweiten Bildschirm, das nur die Fläche zeigt – live, auch während Sie schreiben. Dort doppelklicken für Vollbild.</li>
<li><b>Laserpointer</b> ${k('J')}: Der Punkt folgt der Maus mit kurzer, auslaufender Spur. Es wird nichts gespeichert.</li>
<li><b>Leisten ausblenden</b> (Symbol unten links oder ${k('Tab')}): die ganze Fläche zum Schreiben. Werkzeuge bleiben über Tasten erreichbar.</li>
<li><b>Vollbild</b> (Symbol unten links oder ${k('F')}).</li>
<li>Die Werkzeugleiste links und die Eigenschaften-Leiste rechts lassen sich mit dem kleinen Pfeil oben minimieren. Links bleiben dann Hand, Stift und Radierer.</li>
</ul>

<h3 id="hs8">Historische Tafeln</h3>
<p>In den Einstellungen unter „Historische Vorlagen“ einschalten. Danach erscheinen sie auf dem Startbildschirm und oben in der Leiste („Vorlage“). Jede Vorlage hat eigene Schreibgeräte:</p>
<ul>
<li><b>Kreidetafel:</b> Kreide in sechs Farben, Schwamm.</li>
<li><b>Papyrusrolle</b> (Altes Ägypten): Binsenpinsel in Ruß-Schwarz und Ocker-Rot, feuchtes Tuch.</li>
<li><b>Römische Wachstafel:</b> vier gebundene Holztafeln (umschalten rechts oder mit ${k('Bild ↑')}/${k('Bild ↓')}). Der Stilus ritzt mit der Spitze ins Wachs; ${k('D')} dreht ihn auf das flache Ende, das das Wachs wieder glättet – auch bei ausgeblendeten Leisten. Geschrieben wird nur auf dem Wachs, nicht auf dem Rahmen oder dem Tisch (ebenso bei Ton- und Schiefertafel).</li>
<li><b>Archimedes’ Sandtafel:</b> mit dem Stab in den Sand zeichnen, mit der Hand glattstreichen.</li>
<li><b>Mesopotamische Tontafel:</b> Das Schreibrohr drückt Keile ein (Ansatzpunkt = Kopf, Ziehen = Richtung und Länge), der Griffel ritzt Linien, der Daumen glättet.</li>
<li><b>Schiefertafel:</b> mit Schreiblinien, Griffel, Kreide, Schwamm und Läppchen.</li>
<li><b>Pergament mit Gänsekiel:</b> Breitfeder in Eisengallustinte, Zinnoberrot und Azuritblau, Bleigriffel zum Vorziehen von Linien; Fehler werden mit dem Federmesser abgeschabt.</li>
</ul>
<p>Jede Epoche hat ihren eigenen Inhalt: Beim Wechsel der Vorlage verschwindet, was mit der vorigen geschrieben wurde – wechselt man zurück, ist es wieder da.</p>
<p>Je nach Tafel stehen passende Hilfsmittel der Zeit bereit, z. B. Tafellineal, Tafelzirkel und Zeigestock an der Kreidetafel, Regula und Circinus bei der Wachstafel oder Zirkel und Lineal bei Archimedes. Zirkelbögen werden mit dem gewählten Schreibgerät gezogen. Mit <b>„Nur historische Werkzeuge“</b> in den Einstellungen blenden Sie alle modernen Werkzeuge aus.</p>

<h3 id="hs9">Ansicht</h3>
<ul>
<li>Mausrad scrollt, ${k('Strg')} + Mausrad zoomt; auf Touch-Geräten mit zwei Fingern. Hand-Werkzeug ${k('H')} oder gedrückte ${k('Leertaste')} verschiebt die Ansicht.</li>
<li>Unten links: „Alles anzeigen“, Zoom, Klick auf die Prozentzahl setzt auf 100 % zurück.</li>
<li>Oben: Hilfslinien ein/aus, Einrasten am Raster, heller/dunkler Modus. In den Einstellungen wählen Sie die Art der Hilfslinien (Punkte, Karos oder Linien wie im Schreibheft) und ihre Stärke.</li>
<li>Ebenfalls in den Einstellungen: das <b>App-Symbol</b> – Whiteboard (Standard), Elektrotechnik, Schriftrolle oder passend zu jeder historischen Tafel.</li>
<li><b>App-Symbol der installierten App wechseln:</b> Der Browser übernimmt das Symbol nur bei der Installation. Damit ein neues Symbol in Startmenü und Taskleiste erscheint, muss Scriptoria in Edge neu installiert werden:
<ol><li>Installierte App deinstallieren: im App-Fenster oben rechts auf ${k('…')} → „Scriptoria deinstallieren“ (oder ${k('edge://apps')} öffnen, bei Scriptoria ${k('…')} → „Deinstallieren“). Haken bei „Daten löschen“ <b>nicht</b> setzen, sonst gehen die Boards verloren.</li>
<li>Scriptoria in einem normalen Edge-Tab öffnen und in den Einstellungen das gewünschte App-Symbol wählen.</li>
<li>In Edge ${k('…')} → „Apps“ → „Diese Website als App installieren“ wählen.</li></ol>
In Tab und Browser-Leiste gilt das neue Symbol sofort.</li>
</ul>

<h3 id="hs10">Zusatzwerkzeuge</h3>
<p>Standardmäßig ausgeblendet, damit die Leiste übersichtlich bleibt. In den Einstellungen unter „Werkzeuge in der Leiste“ einschalten:</p>
<ul>
<li><b>Funktionsplotter & Koordinatensystem:</b> z. B. ${k('2*sin(x - pi/4)')}, ${k('exp(-x)*cos(5x)')} oder ${k('x^2 - 1')}; Bereich, Maßstab und Achsenbeschriftung wählbar. Leer gelassen entsteht ein Koordinatensystem.</li>
<li><b>Zeigerdiagramm:</b> Zeiger mit Betrag und Winkel (z. B. U und I) mit Re/Im-Achsen und Winkelbögen.</li>
<li><b>Diagramm-Vorlagen:</b> leeres Koordinatensystem, leeres Zeigerdiagramm (Re/Im-Achsen mit Hilfskreisen zum Hineinzeichnen), Bode-Diagramm, Oszilloskop-Raster, Kennlinienfeld, logarithmisches Papier, Polarkoordinaten. Die <b>Achsenbeschriftungen</b> wählen Sie beim Einfügen frei, Formeln zwischen ${k('$…$')}.</li>
<li><b>Stoppuhr</b> mit Countdown (1–20 min) für Übungsaufgaben.</li>
</ul>
<p>Diagramme sind ein festes Objekt: verschieben, skalieren, löschen – aber nicht versehentlich zerlegen. Doppelklick (oder „Diagramm bearbeiten“) ändert Funktion, Bereich und Achsenbeschriftung. Mit dem Stift kann man direkt hineinzeichnen, auch Freihand-Kurven in ein leeres Koordinatensystem oder Zeiger in ein leeres Zeigerdiagramm (Diagramm-Vorlagen); der Radierer lässt das Diagramm selbst unberührt.</p>

<h3 id="hs11">Tastenkürzel</h3>
<table class="keys">
<tr><td>${k('V')} Auswahl</td><td>${k('H')} Hand</td><td>${k('P')} Stift</td><td>${k('E')} Radierer</td></tr>
<tr><td>${k('L')} Linie</td><td>${k('A')} Pfeil</td><td>${k('R')} Rechteck</td><td>${k('O')} Ellipse</td></tr>
<tr><td>${k('T')} Text</td><td>${k('N')} Notiz</td><td>${k('C')} Zirkel</td><td>${k('K')} Parabel</td></tr>
<tr><td>${k('U')} Lineal</td><td>${k('G')} Geodreieck</td><td>${k('J')} Laserpointer</td><td>${k('B')} Baukasten</td></tr>
<tr><td>${k('W')} Leitung</td><td>${k('Q')} 90° drehen</td><td>${k('1')}–${k('9')} Stift wählen</td><td>${k('D')} Stilus drehen</td></tr>
<tr><td>${k('Bild ↑/↓')} Seite</td><td>${k('Tab')} Leisten</td><td>${k('F')} Vollbild</td><td>${k('Strg+Z')} Rückgängig</td><td>${k('Strg+Y')} Wiederholen</td></tr>
<tr><td>${k('Strg+S')} Datei sichern</td><td>${k('Strg+A')} Alles wählen</td><td>${k('Entf')} Löschen</td><td>${k('Esc')} Abbrechen</td></tr>
</table>
<p class="muted">Scriptoria ist freie Software (MIT-Lizenz). Formelsatz: MathJax (Apache-Lizenz 2.0), PDF: pdf.js und jsPDF.</p>` });
  body.querySelector('input.search').addEventListener('input', e => {     // Hilfe durchsuchen
    const q = e.target.value.trim().toLowerCase();
    body.querySelectorAll('li, p, tr').forEach(el => { el.style.display = !q || el.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    body.querySelectorAll('li li').forEach(el => { if (el.parentElement.closest('li').style.display !== 'none') el.style.display = ''; });   // Teilschritte gehören zum Eintrag
    body.querySelectorAll('h3').forEach(hd => { let n = hd.nextElementSibling, any = !q; for (; n && n.tagName !== 'H3'; n = n.nextElementSibling) if ((n.tagName === 'P' && n.style.display !== 'none') || [...n.querySelectorAll('li,tr')].some(x => x.style.display !== 'none')) any = true; hd.style.display = any ? '' : 'none'; });
    body.querySelector('.toc').style.display = q ? 'none' : '';
  });
  body.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); body.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' }); }));
  return dialog({ title: 'Scriptoria – Funktionen & Hilfe', body, wide: true, buttons: [{ label: 'Schließen', primary: true, value: true }] });
}
