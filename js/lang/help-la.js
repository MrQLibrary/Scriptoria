"use strict";
HELP_L10N.la = k => `
<p>Scriptoria est tabula alba digitalis ad lectiones et scholas. In navigatro currit, post primam onerationem etiam sine interreti operatur et omnia sponte servat.</p>
<nav class="toc">${['Initium & servatio', 'PDF & paginae', 'Stili & deletrix', 'Figurae, textus & schedulae', 'Formulae (LaTeX)', 'Instrumenta geometrica', 'Electronica', 'Praesentatio', 'Tabulae historicae', 'Aspectus', 'Instrumenta addita', 'Compendia claviaturae'].map((t, i) => `<a href="#hs${i}">${t}</a>`).join('')}</nav>

<h3 id="hs0">Initium & servatio</h3>
<ul>
<li><b>Nova tabula</b> superficiem vacuam et infinitam creat. Tabulae nuper adhibitae ut chartulae apparent; per <b>⋯</b> renominari, duplicari, ut fasciculus servari vel deleri possunt.</li>
<li><b>Servatio spontanea:</b> quaeque mutatio post unum fere secundum in navigatro servatur, item cum pagina clauditur vel ad aliam fenestram transitur. Iuxta nomen «✓ Servatum» legitur.</li>
<li><b>Ut fasciculum servare:</b> ${k('Ctrl+S')} tabulam ut fasciculum <code>.owb</code> (cum imaginibus) demittit. Hoc magni momenti est, nam «data situs delere» in navigatro tabulas quoque delet. Aperi per «Fasciculum aperire …» vel trahendo.</li>
<li><b>Exportatio:</b> per iconem sagittae supra dextra ut PDF (A4 vel ad contentum aptatum) aut imago PNG.</li>
</ul>

<h3 id="hs1">PDF & paginae</h3>
<ul>
<li><b>PDF vel imaginem inserere:</b> icon imaginis sinistra, fasciculum in superficiem trahe vel ${k('Ctrl+V')}. In PDF eligis <b>quas paginas</b> inseras (e.g. ${k('5-20')} vel ${k('1-3, 7, 10-12')}), utrum <b>sub se invicem</b> an <b>quaeque in sua pagina</b> appareant, et quot paginae PDF <b>iuxta</b> stent (praefinitum in optionibus). Deinde stilus statim paratus est.</li>
<li>Paginae PDF <b>fixae</b> sunt: scribendo vel eligendo non labuntur. Bis premendo (instrumento electionis vel manus) pagina tamen eligitur; dextra «Fixum» exstingui potest.</li>
<li>PDF in initium tractum statim novam tabulam cum eo creat.</li>
<li><b>Paginae:</b> infra dextra volve (‹ ›, ${k('Page ↑')}/${k('Page ↓')}) vel ＋ novam paginam adde. Quaeque pagina sua superficies infinita est. Numerum paginae preme ut eam moveas vel deleas. Exportatio PDF omnes paginas simul reddere potest.</li>
</ul>

<h3 id="hs2">Stili & deletrix</h3>
<ul>
<li>Infra elige plumbum, calamum globulosum, calamum fontanum, signatorem et tres illuminatores – vel litteras numerales ${k('1')}–${k('7')}. Color, crassitudo et genus lineae cuiusque stili dextra statuuntur et memoria tenentur.</li>
<li>Scribendo index punctum coloris et magnitudinis stili ostendit. Cum tabula graphica vel stilo Surface linea <b>pressioni sensibilis</b> est.</li>
<li><b>Figuras agnoscere:</b> in fine lineae stilum paulisper tene – linea, circulus, ellipsis, rectangulum vel triangulum pure ducuntur.</li>
<li>${k('Shift')} ducendo lineam rectam dat.</li>
<li><b>Deletrix</b> (${k('E')}): «Partes» solum quod sub deletrice iacet tollit, «Lineae totae» totam lineam. Imagines et PDF delendo manent.</li>
</ul>

<h3 id="hs3">Figurae, textus & schedulae</h3>
<ul>
<li>Linea ${k('L')}, sagitta ${k('A')}, rectangulum ${k('R')}, ellipsis ${k('O')}: trahendo duc; cum ${k('Shift')} horizontaliter/perpendiculariter vel quadratum/circulum.</li>
<li>Textus ${k('T')}: superficiem preme et scribe. Schedula ${k('N')}: chartula colorata cum textu. Bis premendo textum mutas.</li>
<li><b>Electio</b> ${k('V')}: preme vel quadrum trahe; ansae ad magnitudinem, ansa rotunda ad vertendum. ${k('Del')} delet, ${k('Ctrl+D')} duplicat, ${k('Ctrl+C')}/${k('Ctrl+V')} exscribit, sagittae claviaturae movent.</li>
</ul>

<h3 id="hs4">Formulae (LaTeX)</h3>
<p>In textu, schedulis et inscriptionibus partium formulae inter signa dollarii ponuntur, e.g. ${k('Lex Ohmii: $U = R \\cdot I$')} vel ${k('$f_g = \\frac{1}{2\\pi RC}$')}. Textus circumiacens litteras electas servat. Formularum species (MathJax) inclusa est et sine interreti operatur.</p>

<h3 id="hs5">Instrumenta geometrica</h3>
<ul>
<li><b>Regula</b> ${k('U')} et <b>norma</b> ${k('G')} in vera magnitudine apparent (aequatio in optionibus). Trahendo moventur, globulus caeruleus vertit (cum ${k('Shift')} per gradus 15°). Stilum vel lineam ad marginem incipiens lineam accurate rectam ducis. Norma scalam centimetrorum cum nihilo in medio et scalam angulorum habet.</li>
<li><b>Circinus</b> ${k('C')}: centrum pone, punctum rubrum trahe. Angulus aperturae et longitudo crurum radium definiunt.</li>
<li><b>Parabola</b> ${k('K')}: a vertice incipe et ad punctum curvae trahe. Aequatio (in cm) trahendo ostenditur. Axis perpendicularis vel horizontalis; ${k('Shift')} mutat.</li>
</ul>

<h3 id="hs6">Electronica</h3>
<ul>
<li><b>Arcula</b> ${k('B')}: plus quam septuaginta signa circuituum (IEC/DIN) in classibus partium fundamentalium, semiconductorum, fontium & instrumentorum mensurae, amplificatorum & logicae. Partem preme, deinde superficiem. ${k('Q')} per 90° vertit, ${k('Esc')} finit.</li>
<li><b>Circuitus parati</b> (tabella «Circuitus»): divisor tensionis, filtra, circuitus resonantes, circuitus fundamentales amplificatoris operationalis, rectificatores, gradus transistorum, circuitus mensurae aliaque. Post pressum circuitus indici adhaeret, ${k('Q')} vertit, pressus ponit.</li>
<li><b>Filum ducere</b> ${k('W')}: terminum preme, angulos pone – filum angulis rectis currit et sponte in termino vel alio filo desinit. Nodi in ramis sponte ponuntur. Bis premendo, dextro premendo vel ${k('Esc')} finis.</li>
<li>Inscriptiones partium (ager «Inscriptio» dextra) formulas continere possunt, e.g. ${k('$R_1 = 10\\,\\mathrm{k\\Omega}$')}.</li>
<li><b>Simulare</b> (▶ in tabella instrumentorum vel in arcula): circuitus pictus computatur – ut in simulatro Falstad. Puncta flava currentem ostendunt, color filorum tensionem (viridis positiva, rubra negativa). Amperometra et voltometra valorem suum ostendunt et in <b>oscilloscopio</b> apparent. Pressus in partem tensionem eius ad oscilloscopium addit, pressus in clausulam eam mutat (etiam in pictura), premendum claudit dum premitur, et in potentiometro pressus cursorem ponit. <b>Circuitus logici:</b> in omnibus introitibus et exitibus portarum gradus 0 vel 1 legitur (viridis = 1). Termini (○) qui solum introitus portarum alunt introitus sunt: tactus inter 0 et 1 mutat. Termini ad exitus portarum effectum ostendunt. Valores ut ${k('4,7 kΩ')}, ${k('100 µF')} vel ${k('10 V 50 Hz')} dextra sub «Valor» inscribuntur. Simulantur resistores, condensatores, inductores, fontes, diodi, LED, diodi Zener, transistores (NPN/PNP), amplificatores operationales, portae logicae, clausulae, lampades et instrumenta mensurae. Mutationes circuitus statim valent.</li>
<li><b>Partes provectae:</b> thyristor, TRIAC, DIAC, MOSFET, JFET, transformator (valor e.g. ${k('10:1')} vel ${k('230 V / 12 V')}), crystallus, phototransistor, optocopulator, cellula solaris, fontes recti, wattometrum et ohmometrum atque flip-flop D et RS exemplaribus simplicibus computantur. Initio Scriptoria rogat utrum simul simulentur (optio «Partes provectas simulare»: Rogare, Semper, Numquam). Thyristor accenditur cum currens portae 1 mA superat et conducit donec currens infra 1 mA cadit; flip-flop D valorem D in ascensu horologii accipit.</li>
<li>Circuitus proprios servare: omnia elige, «Ut circuitum servare …». Signa propria ut fasciculus JSON importari possunt – vide «Ductus» in arcula.</li>
</ul>

<h3 id="hs7">Praesentatio</h3>
<ul>
<li><b>Fenestra praesentationis</b> (icon scrinii supra): alteram fenestram pro proiectorio vel altero scrinio aperit, quae solam superficiem ostendit – vivo modo, etiam dum scribis. Ibi bis preme pro pleno scrinio.</li>
<li><b>Index laser</b> ${k('J')}: punctum murem sequitur cum brevi vestigio evanescente. Nihil servatur.</li>
<li><b>Tabellas celare</b> (icon infra sinistra vel ${k('Tab')}): tota superficies ad scribendum. Instrumenta per claviaturam praesto manent.</li>
<li><b>Plenum scrinium</b> (icon infra sinistra vel ${k('F')}).</li>
<li>Tabella instrumentorum sinistra et tabella proprietatum dextra parva sagitta supra minui possunt. Sinistra tum manus, stilus et deletrix manent. Si non omnia instrumenta in scrinium capiuntur, tabella rota muris volvitur; umbra in margine plura instrumenta indicat.</li>
</ul>

<h3 id="hs8">Tabulae historicae</h3>
<p>In optionibus sub «Exemplaria historica» accende. Tum in initio et in tabella superiore («Exemplar») apparent. Quodque exemplar sua instrumenta scribendi habet:</p>
<ul>
<li><b>Tabula cretacea:</b> creta sex colorum, spongia.</li>
<li><b>Volumen papyraceum</b> (Aegyptus antiqua): penicillus iunceus fuligine nigra et ochra rubra, linteum umidum.</li>
<li><b>Tabula cerata Romana:</b> quattuor tabulae ligneae coniunctae (dextra vel ${k('Page ↑')}/${k('Page ↓')} mutare). Stilus cuspide ceram incidit; ${k('D')} eum ad partem planam vertit, quae ceram iterum levat – etiam tabellis celatis. Solum in cera scribi potest, non in forma neque in mensa (item in tabula fictili et saxea).</li>
<li><b>Abacus Archimedis:</b> radio in harena describe, manu leva.</li>
<li><b>Tabula fictilis Mesopotamica:</b> calamus cuneos imprimit (punctum initii = caput, tractus = directio et longitudo), stilus lineas incidit, pollex levat.</li>
<li><b>Tabula saxea:</b> cum lineis, stilo, creta, spongia et panniculo.</li>
<li><b>Membrana cum penna anserina:</b> penna lata atramento gallico, minio et caeruleo azurite, plumbum ad lineas ducendas; errata scalpello raduntur.</li>
</ul>
<p>Quaeque aetas suum contentum habet: exemplari mutato, quae priore scripta sunt evanescunt – reverso iterum adsunt.</p>
<p>Pro tabula instrumenta aetatis praesto sunt, e.g. regula, circinus et radius ad tabulam cretaceam, regula et circinus ad tabulam ceratam, aut circinus et regula apud Archimedem. Arcus circini instrumento scribendi electo ducuntur. Optione <b>«Instrumenta historica tantum»</b> omnia instrumenta moderna celantur.</p>

<h3 id="hs9">Aspectus</h3>
<ul>
<li>Rota muris volvit, ${k('Ctrl')} + rota amplificat; in instrumentis tactilibus duobus digitis. Instrumentum manus ${k('H')} vel ${k('spatium')} pressum conspectum movet.</li>
<li>Infra sinistra: «Omnia monstrare», amplificatio; pressus in numerum centesimalem ad 100 % reducit.</li>
<li>Supra: lineae auxiliares on/off, ad cancellos adhaerere, modus clarus/obscurus. In optionibus genus linearum auxiliarium (puncta, quadrata vel lineae ut in libello) et robur eligis.</li>
<li><b>Lingua:</b> summo loco in optionibus – Deutsch, English, Français, 中文, Русский, हिन्दी vel Latina. Pagina deinde iterum oneratur.</li>
<li>Item in optionibus: <b>icon applicationis</b> – tabula alba (praefinitum), electrotechnica, volumen vel cuique tabulae historicae conveniens.</li>
<li><b>Iconem applicationis installatae mutare:</b> navigatrum iconem solum in installatione accipit. Ut nova icon in indice initii et in tabella operum appareat, Scriptoria in Edge iterum installanda est:
<ol><li>Applicationem installatam removere: in fenestra applicationis supra dextra ${k('…')} → «Scriptoria removere» (vel ${k('edge://apps')} aperi, apud Scriptoria ${k('…')} → «Removere»). «Data quoque delere» <b>noli</b> notare, alioquin tabulae pereunt.</li>
<li>Scriptoria in pagina Edge communi aperi et in optionibus iconem optatam elige.</li>
<li>In Edge elige ${k('…')} → «Applicationes» → «Hunc situm ut applicationem installare».</li></ol>
In pagina et in tabella navigatri nova icon statim valet.</li>
</ul>

<h3 id="hs10">Instrumenta addita</h3>
<p>Praefinito celata sunt, ut tabella perspicua maneat. In optionibus sub «Instrumenta in tabella» accende:</p>
<ul>
<li><b>Delineator functionum & systema coordinatarum:</b> e.g. ${k('2*sin(x - pi/4)')}, ${k('exp(-x)*cos(5x)')} vel ${k('x^2 - 1')}; ambitus, modulus et inscriptiones axium eligi possunt. Si vacuum relinquitur, systema coordinatarum fit.</li>
<li><b>Diagramma phasorum:</b> phasores cum magnitudine et angulo (e.g. U et I) cum axibus Re/Im et arcubus angulorum.</li>
<li><b>Exemplaria diagrammatum:</b> systema coordinatarum vacuum, diagramma phasorum vacuum (axes Re/Im cum circulis auxiliaribus ad pingendum), diagramma Bode, cancelli oscilloscopii, campus curvarum, charta logarithmica, coordinatae polares. <b>Inscriptiones axium</b> inserendo libere eligis, formulae inter ${k('$…$')}.</li>
<li><b>Horologium cursorium</b> cum numeratione retrograda (1–20 min) ad exercitationes.</li>
<li><b>Petit Fourier:</b> functionem f(t) et periodum T inscribe (e.g. ${k('sgn(sin(2*pi*t/T))')} vel ${k('sin(2*pi*50*t)')} cum T = ${k('20m')}); frequentiae, amplitudines Aₙ et phases φₙ harmonicarum, spectrum amplitudinis et summa harmonicarum ostenduntur. Exemplaria: quadratum, triangulum, serra, rectificatio aliaque. «Spectrum in tabulam» spectrum ut imaginem inserit.</li>
<li><b>Calculatrum</b> (scientificum): arithmetica, potestates, radices, sin/cos/tan earumque inversae (DEG vel RAD), ln, log, n!, π, e, ${k('EXP')} pro potestatibus decem et ${k('Ans')} pro ultimo exitu. Etiam claviatura operatur; «Inserere» computationem et exitum ut textum in tabulam ponit.</li>
</ul>
<p>Diagrammata unum obiectum solidum sunt: movere, scalare, delere – sed non casu dissolvere. Bis premendo (vel «Diagramma mutare») functionem, ambitum et inscriptiones axium mutas. Stilo directe in ea pingere potes, etiam curvas manu in systemate vacuo vel phasores in diagrammate phasorum vacuo; deletrix ipsum diagramma non tangit.</p>

<h3 id="hs11">Compendia claviaturae</h3>
<table class="keys">
<tr><td>${k('V')} Electio</td><td>${k('H')} Manus</td><td>${k('P')} Stilus</td><td>${k('E')} Deletrix</td></tr>
<tr><td>${k('L')} Linea</td><td>${k('A')} Sagitta</td><td>${k('R')} Rectangulum</td><td>${k('O')} Ellipsis</td></tr>
<tr><td>${k('T')} Textus</td><td>${k('N')} Schedula</td><td>${k('C')} Circinus</td><td>${k('K')} Parabola</td></tr>
<tr><td>${k('U')} Regula</td><td>${k('G')} Norma</td><td>${k('J')} Index laser</td><td>${k('B')} Arcula</td></tr>
<tr><td>${k('W')} Filum</td><td>${k('Q')} Per 90° vertere</td><td>${k('1')}–${k('9')} Stilum eligere</td><td>${k('D')} Stilum vertere</td></tr>
<tr><td>${k('Page ↑/↓')} Pagina</td><td>${k('Tab')} Tabellae</td><td>${k('F')} Plenum scrinium</td><td>${k('Ctrl+Z')} Revocare</td><td>${k('Ctrl+Y')} Iterare</td></tr>
<tr><td>${k('Ctrl+S')} Fasciculum servare</td><td>${k('Ctrl+A')} Omnia eligere</td><td>${k('Del')} Delere</td><td>${k('Esc')} Abrogare</td></tr>
</table>
<p class="muted">Scriptoria est programma liberum (licentia MIT). Formulae: MathJax (licentia Apache 2.0), PDF: pdf.js et jsPDF.</p>`;

HELP_L10N['la:elec'] = sym => `
<h3>1. Partes inserere</h3>
<p>Arculam icone microcircuiti in tabella sinistra aperi (littera <code>B</code>). Partem elige et superficiem preme – electa manet, plures ponere potes. <code>Q</code> eam ante ponendum per 90° vertit, <code>Esc</code> ponere finit. In optionibus vel in tabella superiore <b>ad cancellos adhaerere</b> accende, ut termini accurate congruant.</p>
<h3>2. Coniungere</h3>
<p>Fila instrumento <b>lineae</b> (littera <code>L</code>) adhaesione accensa duc, vel «Filum ducere» (<code>W</code>). <code>Shift</code> tene pro lineis horizontalibus/perpendicularibus. Nodos parte «Nodus» pone. Inscriptiones instrumento textus vel – pro partibus – in agro «Inscriptio» dextra.</p>
<h3>3. Circuitus parati</h3>
<p>In tabella <b>Circuitus</b> circuitus usitati sunt (divisor tensionis, filtra, amplificatores, rectificatores, …). Post pressum circuitus indici adhaeret: <code>Q</code> per 90° vertit, pressus in superficiem ponit, <code>Esc</code> abrogat. Postea omnia moveri, verti et mutari possunt.</p>
<h3>4. Circuitus proprios addere</h3>
<p>Circuitum tuum pinge vel construe, omnia elige (Ctrl+A vel quadrum trahe) et in tabella <b>Circuitus</b> elige <b>«Electa ut circuitum servare»</b>. Deinde perpetuo sub «Circuitus proprii» apparet. Globuli infra in arcula circuitus proprios exportant (ad communicandum), important vel delent.</p>
<h3>5. Partes proprias (signa) addere</h3>
<p>Fasciculum <code>.json</code> crea et in tabella <b>Partes</b> per «Signa importare …» onera. Fasciculus unum signum vel indicem signorum continere potest:</p>
<pre>${sym.replace(/</g, '&lt;')}</pre>
<ul>
<li><code>w</code>, <code>h</code>: magnitudo in unitatibus tabulae; origo supra sinistra est, y deorsum spectat.</li>
<li><code>paths</code>: lineae ut viae SVG (<code>M</code> = movere, <code>L</code> = linea, <code>H</code>/<code>V</code> = horizontalis/perpendicularis, <code>A</code> = arcus, <code>Z</code> = claudere).</li>
<li><code>fills</code>: areae impletae (e.g. cuspides sagittarum), item viae SVG.</li>
<li><code>pins</code>: puncta nexus, optime in cancellis denariis.</li>
<li><code>texts</code>: litterae in signo (<code>s</code> = magnitudo litterarum).</li>
</ul>
<p>Consilium: vias in quolibet editore SVG (e.g. Inkscape) pinge et valores <code>d</code> hic insere.</p>
<h3>Compendia claviaturae</h3>
<p><code>V</code> Electio · <code>H</code> Manus · <code>P</code> Stilus · <code>E</code> Deletrix · <code>L</code> Linea · <code>A</code> Sagitta · <code>R</code> Rectangulum · <code>O</code> Ellipsis · <code>T</code> Textus · <code>N</code> Schedula · <code>C</code> Circinus · <code>J</code> Index laser · <code>U</code> Regula · <code>B</code> Arcula · <code>Q</code> Per 90° vertere · Ctrl+Z/Y Revocare/Iterare · Ctrl+S Servare</p>`;
