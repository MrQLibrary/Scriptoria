"use strict";
HELP_L10N.en = k => `
<p>Scriptoria is a digital whiteboard for lectures and lessons. It runs in the browser, works offline after the first visit and saves everything automatically.</p>
<nav class="toc">${['Start & saving', 'PDF & pages', 'Pens & eraser', 'Shapes, text & notes', 'Formulas (LaTeX)', 'Drawing instruments', 'Electronics', 'Presenting', 'Historical boards', 'View', 'Extra tools', 'Keyboard shortcuts'].map((t, i) => `<a href="#hs${i}">${t}</a>`).join('')}</nav>

<h3 id="hs0">Start & saving</h3>
<ul>
<li><b>New whiteboard</b> creates an empty, unlimited canvas. Recently used boards appear as cards; via <b>⋯</b> you can rename, duplicate, save as a file or delete them.</li>
<li><b>Automatic saving:</b> every change is stored in the browser after about one second, and also when you close the tab or switch to another window. “✓ Saved” is shown next to the name.</li>
<li><b>Save as file:</b> ${k('Ctrl+S')} downloads the board as an <code>.owb</code> file (including images). This matters, because “clear site data” in the browser also removes the boards. Open files via “Open file …” or drag & drop.</li>
<li><b>Export:</b> via the arrow icon at the top right as PDF (A4 or fitted to the content) or PNG image.</li>
</ul>

<h3 id="hs1">PDF & pages</h3>
<ul>
<li><b>Insert a PDF or image:</b> image icon on the left, drag a file onto the canvas or ${k('Ctrl+V')}. For PDFs you choose <b>which pages</b> to insert (e.g. ${k('5-20')} or ${k('1-3, 7, 10-12')}), whether they appear <b>stacked</b> or <b>each as its own page</b>, and how many PDF pages stand <b>side by side</b> (default in the settings). The pen is active right away.</li>
<li>PDF pages are <b>locked</b>: they do not slip while writing or selecting. A double-click (with the select or hand tool) still selects a page; “Locked” can be switched off on the right.</li>
<li>Dragging a PDF onto the start screen creates a new whiteboard with it.</li>
<li><b>Pages:</b> browse at the bottom right (‹ ›, ${k('Page ↑')}/${k('Page ↓')}) or add a new page with ＋. Each page is its own infinite canvas. Click the page number to move or delete it. The PDF export can output all pages at once.</li>
</ul>

<h3 id="hs2">Pens & eraser</h3>
<ul>
<li>At the bottom choose pencil, ballpoint pen, fountain pen, marker and three highlighters – or use the number keys ${k('1')}–${k('7')}. Colour, thickness and line type of each pen are set on the right and remembered.</li>
<li>While writing, the cursor shows a dot in the pen’s colour and size. With a graphics tablet or Surface pen the stroke is <b>pressure-sensitive</b>.</li>
<li><b>Recognise shapes:</b> hold the pen still briefly at the end of a stroke – line, circle, ellipse, rectangle or triangle are drawn cleanly.</li>
<li>${k('Shift')} while drawing gives a straight line.</li>
<li><b>Eraser</b> (${k('E')}): “Parts” removes only what lies under the eraser, “Whole strokes” the entire stroke. Images and PDFs are kept when erasing.</li>
</ul>

<h3 id="hs3">Shapes, text & notes</h3>
<ul>
<li>Line ${k('L')}, arrow ${k('A')}, rectangle ${k('R')}, ellipse ${k('O')}: drag out; with ${k('Shift')} horizontal/vertical or square/circle.</li>
<li>Text ${k('T')}: click on the canvas and type. Sticky note ${k('N')}: coloured note with text. Double-click edits existing text.</li>
<li><b>Select</b> ${k('V')}: click or drag a frame; handles to resize, round handle to rotate. ${k('Del')} deletes, ${k('Ctrl+D')} duplicates, ${k('Ctrl+C')}/${k('Ctrl+V')} copies, arrow keys move.</li>
</ul>

<h3 id="hs4">Formulas (LaTeX)</h3>
<p>In text, sticky notes and component labels, formulas are typeset between dollar signs, e.g. ${k('Ohm’s law: $U = R \\cdot I$')} or ${k('$f_g = \\frac{1}{2\\pi RC}$')}. The surrounding text keeps the chosen font. Formula rendering (MathJax) is built in and works offline.</p>

<h3 id="hs5">Drawing instruments</h3>
<ul>
<li><b>Ruler</b> ${k('U')} and <b>set square</b> ${k('G')} appear at real size on the screen (calibration in the settings). Dragging moves, the blue knob rotates (with ${k('Shift')} in 15° steps). Start a pen or line at an edge to get an exactly straight line. The set square has a cm scale with zero in the middle and an angle scale.</li>
<li><b>Compass</b> ${k('C')}: set the centre, drag the red point. Opening angle and leg length determine the radius.</li>
<li><b>Parabola</b> ${k('K')}: start at the vertex and drag to a point on the curve. The equation (in cm) is shown while dragging. Axis vertical or horizontal; ${k('Shift')} switches.</li>
</ul>

<h3 id="hs6">Electronics</h3>
<ul>
<li><b>Kit</b> ${k('B')}: more than 70 circuit symbols (IEC/DIN) in the groups basic components, semiconductors, sources & meters and amplifiers & logic. Click a component, then click on the canvas. ${k('Q')} rotates by 90°, ${k('Esc')} finishes.</li>
<li><b>Ready-made circuits</b> (tab “Circuits”): voltage divider, filters, resonant circuits, basic op-amp circuits, rectifiers, transistor stages, measuring circuits and more. After clicking, the circuit hangs on the cursor, ${k('Q')} rotates it, a click places it.</li>
<li><b>Draw wire</b> ${k('W')}: click a terminal, set corner points – the wire runs at right angles and ends automatically at a terminal or another wire. Junction dots at branches are set automatically. Double-click, right-click or ${k('Esc')} finishes.</li>
<li>Component labels (field “Label” on the right) may contain formulas, e.g. ${k('$R_1 = 10\\,\\mathrm{k\\Omega}$')}.</li>
<li><b>Simulate</b> (▶ in the toolbar or in the kit): the drawn circuit is computed – as in the Falstad simulator. Yellow dots show the current, the wire colour the voltage (green positive, red negative). Ammeters and voltmeters show their value and appear in the <b>oscilloscope</b>. Clicking a component adds its voltage to the oscilloscope, clicking a switch toggles it (also in the drawing), a push button closes while pressed, and on a potentiometer the click sets the wiper. <b>Logic circuits:</b> all gate inputs and outputs show the level 0 or 1 (green = 1). Terminals (○) that only feed gate inputs are inputs: tapping switches between 0 and 1. Terminals at gate outputs show the result. Values such as ${k('4,7 kΩ')}, ${k('100 µF')} or ${k('10 V 50 Hz')} are entered on the right under “Value”. Resistors, capacitors, inductors, sources, diodes, LEDs, Zener diodes, transistors (NPN/PNP), op-amps, logic gates, switches, lamps and meters are simulated. Changes to the circuit take effect immediately.</li>
<li><b>Advanced components:</b> thyristor, TRIAC, DIAC, MOSFET, JFET, transformer (value e.g. ${k('10:1')} or ${k('230 V / 12 V')}), crystal, phototransistor, optocoupler, solar cell, controlled sources, wattmeter and ohmmeter as well as D and SR flip-flops are computed with simplified models. On start, Scriptoria asks whether to include them (setting “Simulate advanced components”: Ask, Always, Never). The thyristor fires at a gate current above 1 mA and keeps conducting until the current falls below 1 mA; the D flip-flop takes over D on the rising clock edge.</li>
<li>Save your own circuits: select everything, “Save as circuit …”. Custom symbols can be imported as a JSON file – see “Guide” in the kit.</li>
</ul>

<h3 id="hs7">Presenting</h3>
<ul>
<li><b>Presentation window</b> (screen icon at the top): opens a second window for a projector or second screen that shows only the canvas – live, even while you write. Double-click there for full screen.</li>
<li><b>Laser pointer</b> ${k('J')}: the dot follows the mouse with a short fading trail. Nothing is saved.</li>
<li><b>Hide bars</b> (icon at the bottom left or ${k('Tab')}): the whole canvas for writing. Tools remain available via keys.</li>
<li><b>Full screen</b> (icon at the bottom left or ${k('F')}).</li>
<li>The toolbar on the left and the properties panel on the right can be minimised with the small arrow at the top. Hand, pen and eraser then remain on the left. If not all tools fit on the screen, the bar scrolls with the mouse wheel; a shadow at the edge indicates more tools.</li>
</ul>

<h3 id="hs8">Historical boards</h3>
<p>Switch them on in the settings under “Historical templates”. They then appear on the start screen and in the top bar (“Template”). Each template has its own writing tools:</p>
<ul>
<li><b>Chalkboard:</b> chalk in six colours, sponge.</li>
<li><b>Papyrus scroll</b> (ancient Egypt): rush brush in soot black and ochre red, damp cloth.</li>
<li><b>Roman wax tablet:</b> four bound wooden tablets (switch on the right or with ${k('Page ↑')}/${k('Page ↓')}). The stylus scratches into the wax with its tip; ${k('D')} turns it to the flat end, which smooths the wax again – even with hidden bars. You can only write on the wax, not on the frame or the table (likewise for clay tablet and slate).</li>
<li><b>Archimedes’ sand table:</b> draw in the sand with a stick, smooth with your hand.</li>
<li><b>Mesopotamian clay tablet:</b> the reed presses wedges (starting point = head, dragging = direction and length), the stylus scratches lines, the thumb smooths.</li>
<li><b>Slate:</b> with ruled lines, slate pencil, chalk, sponge and cloth.</li>
<li><b>Parchment with quill:</b> broad-nib quill in iron gall ink, vermilion and azurite blue, lead point for ruling lines; mistakes are scraped off with the penknife.</li>
</ul>
<p>Each era has its own content: when you change the template, what was written with the previous one disappears – switch back and it is there again.</p>
<p>Depending on the board, suitable instruments of the period are available, e.g. board ruler, board compass and pointer at the chalkboard, regula and circinus with the wax tablet, or compass and ruler with Archimedes. Compass arcs are drawn with the chosen writing tool. With <b>“Historical tools only”</b> in the settings all modern tools are hidden.</p>

<h3 id="hs9">View</h3>
<ul>
<li>Mouse wheel scrolls, ${k('Ctrl')} + mouse wheel zooms; on touch devices with two fingers. The hand tool ${k('H')} or holding ${k('Space')} moves the view.</li>
<li>Bottom left: “Show all”, zoom, clicking the percentage resets to 100 %.</li>
<li>Top: guide lines on/off, snap to grid, light/dark mode. In the settings you choose the type of guide lines (dots, squares or lines like in an exercise book) and their strength.</li>
<li><b>Language:</b> at the top of the settings – Deutsch, English, Français, 中文, Русский, हिन्दी or Latina. The page then reloads.</li>
<li>Also in the settings: the <b>app icon</b> – whiteboard (default), electrical engineering, scroll or matching each historical board.</li>
<li><b>Changing the icon of the installed app:</b> the browser only takes over the icon during installation. For a new icon to appear in the Start menu and taskbar, Scriptoria must be reinstalled in Edge:
<ol><li>Uninstall the installed app: in the app window at the top right ${k('…')} → “Uninstall Scriptoria” (or open ${k('edge://apps')}, at Scriptoria ${k('…')} → “Uninstall”). Do <b>not</b> tick “Also clear data”, otherwise the boards are lost.</li>
<li>Open Scriptoria in a normal Edge tab and choose the desired app icon in the settings.</li>
<li>In Edge choose ${k('…')} → “Apps” → “Install this site as an app”.</li></ol>
In the tab and browser bar the new icon applies immediately.</li>
</ul>

<h3 id="hs10">Extra tools</h3>
<p>Hidden by default so that the toolbar stays clear. Switch them on in the settings under “Tools in the toolbar”:</p>
<ul>
<li><b>Function plotter & coordinate system:</b> e.g. ${k('2*sin(x - pi/4)')}, ${k('exp(-x)*cos(5x)')} or ${k('x^2 - 1')}; range, scale and axis labels selectable. Left empty, a coordinate system is created.</li>
<li><b>Phasor diagram:</b> phasors with magnitude and angle (e.g. U and I) with Re/Im axes and angle arcs.</li>
<li><b>Diagram templates:</b> blank coordinate system, blank phasor diagram (Re/Im axes with helper circles for drawing in), Bode plot, oscilloscope grid, characteristic curves, logarithmic paper, polar coordinates. You choose the <b>axis labels</b> freely when inserting, formulas between ${k('$…$')}.</li>
<li><b>Stopwatch</b> with countdown (1–20 min) for exercises.</li>
<li><b>Petit Fourier:</b> enter a function f(t) and period T (e.g. ${k('sgn(sin(2*pi*t/T))')} or ${k('sin(2*pi*50*t)')} with T = ${k('20m')}); it shows frequencies, amplitudes Aₙ and phases φₙ of the harmonics, the amplitude spectrum and the sum of the harmonics. Presets: square, triangle, sawtooth, rectification and more. “Spectrum to board” inserts the spectrum as an image.</li>
<li><b>Calculator</b> (scientific): basic arithmetic, powers, roots, sin/cos/tan and their inverses (DEG or RAD), ln, log, n!, π, e, ${k('EXP')} for powers of ten and ${k('Ans')} for the last result. Also works with the keyboard; “Insert” puts the calculation and result on the board as text.</li>
</ul>
<p>Diagrams are one solid object: move, scale, delete – but not accidentally take apart. Double-click (or “Edit diagram”) changes function, range and axis labels. You can draw into them directly with the pen, including freehand curves in a blank coordinate system or phasors in a blank phasor diagram (diagram templates); the eraser leaves the diagram itself untouched.</p>

<h3 id="hs11">Keyboard shortcuts</h3>
<table class="keys">
<tr><td>${k('V')} Select</td><td>${k('H')} Hand</td><td>${k('P')} Pen</td><td>${k('E')} Eraser</td></tr>
<tr><td>${k('L')} Line</td><td>${k('A')} Arrow</td><td>${k('R')} Rectangle</td><td>${k('O')} Ellipse</td></tr>
<tr><td>${k('T')} Text</td><td>${k('N')} Note</td><td>${k('C')} Compass</td><td>${k('K')} Parabola</td></tr>
<tr><td>${k('U')} Ruler</td><td>${k('G')} Set square</td><td>${k('J')} Laser pointer</td><td>${k('B')} Kit</td></tr>
<tr><td>${k('W')} Wire</td><td>${k('Q')} Rotate 90°</td><td>${k('1')}–${k('9')} Choose pen</td><td>${k('D')} Turn stylus</td></tr>
<tr><td>${k('Page ↑/↓')} Page</td><td>${k('Tab')} Bars</td><td>${k('F')} Full screen</td><td>${k('Ctrl+Z')} Undo</td><td>${k('Ctrl+Y')} Redo</td></tr>
<tr><td>${k('Ctrl+S')} Save file</td><td>${k('Ctrl+A')} Select all</td><td>${k('Del')} Delete</td><td>${k('Esc')} Cancel</td></tr>
</table>
<p class="muted">Scriptoria is free software (MIT licence). Formula typesetting: MathJax (Apache licence 2.0), PDF: pdf.js and jsPDF.</p>`;

HELP_L10N['en:elec'] = sym => `
<h3>1. Inserting components</h3>
<p>Open the kit with the chip icon in the left toolbar (key <code>B</code>). Choose a component and click on the canvas – it stays selected so you can place several. <code>Q</code> rotates it by 90° before placing, <code>Esc</code> stops placing. Switch on <b>snap to grid</b> in the settings or in the top bar so that terminals meet exactly.</p>
<h3>2. Connecting</h3>
<p>Draw wires with the <b>line</b> tool (key <code>L</code>) with snapping active, or with “Draw wire” (<code>W</code>). Hold <code>Shift</code> for horizontal/vertical lines. Set junctions with the component “Junction”. Labels with the text tool or – for components – in the “Label” field on the right.</p>
<h3>3. Ready-made circuits</h3>
<p>The <b>Circuits</b> tab contains standard circuits (voltage divider, filters, amplifiers, rectifiers, …). After a click the circuit hangs on the cursor: <code>Q</code> rotates it by 90°, a click on the canvas places it, <code>Esc</code> cancels. Afterwards you can move, rotate and change everything.</p>
<h3>4. Adding your own circuits</h3>
<p>Draw or build your circuit, select everything (Ctrl+A or drag a frame) and choose <b>“Save selection as circuit”</b> in the <b>Circuits</b> tab. It then appears permanently under “Custom circuits”. The buttons at the bottom of the kit export (to share), import or delete your own circuits.</p>
<h3>5. Adding your own components (symbols)</h3>
<p>Create a <code>.json</code> file and load it in the <b>Components</b> tab with “Import symbols …”. A file may contain one symbol or a list of symbols:</p>
<pre>${sym.replace(/</g, '&lt;')}</pre>
<ul>
<li><code>w</code>, <code>h</code>: size in board units; the origin is at the top left, y points down.</li>
<li><code>paths</code>: lines as SVG paths (<code>M</code> = move, <code>L</code> = line, <code>H</code>/<code>V</code> = horizontal/vertical, <code>A</code> = arc, <code>Z</code> = close).</li>
<li><code>fills</code>: filled areas (e.g. arrowheads), also as SVG paths.</li>
<li><code>pins</code>: connection points, preferably on the 10-unit grid.</li>
<li><code>texts</code>: letters in the symbol (<code>s</code> = font size).</li>
</ul>
<p>Tip: you can draw paths in any SVG editor (e.g. Inkscape) and paste the <code>d</code> values here.</p>
<h3>Keyboard shortcuts</h3>
<p><code>V</code> Select · <code>H</code> Hand · <code>P</code> Pen · <code>E</code> Eraser · <code>L</code> Line · <code>A</code> Arrow · <code>R</code> Rectangle · <code>O</code> Ellipse · <code>T</code> Text · <code>N</code> Note · <code>C</code> Compass · <code>J</code> Laser pointer · <code>U</code> Ruler · <code>B</code> Kit · <code>Q</code> Rotate 90° · Ctrl+Z/Y Undo/Redo · Ctrl+S Save</p>`;
