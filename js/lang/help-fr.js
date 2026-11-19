"use strict";
HELP_L10N.fr = k => `
<p>Scriptoria est un tableau blanc numérique pour les cours. Il fonctionne dans le navigateur, hors ligne après le premier chargement, et enregistre tout automatiquement.</p>
<nav class="toc">${['Démarrage & enregistrement', 'PDF & pages', 'Stylos & gomme', 'Formes, texte & notes', 'Formules (LaTeX)', 'Instruments de tracé', 'Électronique', 'Présenter', 'Tableaux historiques', 'Affichage', 'Outils supplémentaires', 'Raccourcis clavier'].map((t, i) => `<a href="#hs${i}">${t}</a>`).join('')}</nav>

<h3 id="hs0">Démarrage & enregistrement</h3>
<ul>
<li><b>Nouveau tableau</b> crée une surface vide et illimitée. Les tableaux récents apparaissent sous forme de cartes ; via <b>⋯</b> on peut les renommer, dupliquer, enregistrer comme fichier ou supprimer.</li>
<li><b>Enregistrement automatique :</b> chaque modification est enregistrée dans le navigateur après environ une seconde, ainsi qu’à la fermeture de l’onglet ou au changement de fenêtre. « ✓ Enregistré » s’affiche à côté du nom.</li>
<li><b>Enregistrer comme fichier :</b> ${k('Ctrl+S')} télécharge le tableau en fichier <code>.owb</code> (images comprises). Important, car « effacer les données du site » supprime aussi les tableaux. Ouvrir via « Ouvrir un fichier … » ou par glisser-déposer.</li>
<li><b>Export :</b> via l’icône flèche en haut à droite, en PDF (A4 ou ajusté au contenu) ou en image PNG.</li>
</ul>

<h3 id="hs1">PDF & pages</h3>
<ul>
<li><b>Insérer un PDF ou une image :</b> icône image à gauche, glisser un fichier sur la surface ou ${k('Ctrl+V')}. Pour un PDF, vous choisissez <b>quelles pages</b> insérer (p. ex. ${k('5-20')} ou ${k('1-3, 7, 10-12')}), si elles sont <b>empilées</b> ou <b>chacune sur sa page</b>, et combien de pages PDF sont <b>côte à côte</b> (valeur par défaut dans les réglages). Le stylo est ensuite actif immédiatement.</li>
<li>Les pages PDF sont <b>verrouillées</b> : elles ne glissent pas pendant l’écriture ou la sélection. Un double-clic (outil sélection ou main) sélectionne quand même une page ; « Verrouillé » peut être désactivé à droite.</li>
<li>Glisser un PDF sur l’écran d’accueil crée directement un nouveau tableau avec ce PDF.</li>
<li><b>Pages :</b> naviguer en bas à droite (‹ ›, ${k('Pg ↑')}/${k('Pg ↓')}) ou ajouter une page avec ＋. Chaque page est une surface infinie. Un clic sur le numéro de page permet de la déplacer ou de la supprimer. L’export PDF peut sortir toutes les pages d’un coup.</li>
</ul>

<h3 id="hs2">Stylos & gomme</h3>
<ul>
<li>En bas : crayon, stylo à bille, stylo plume, marqueur et trois surligneurs – ou les touches ${k('1')}–${k('7')}. Couleur, épaisseur et type de trait de chaque stylo se règlent à droite et sont mémorisés.</li>
<li>Pendant l’écriture, le curseur montre un point de la couleur et de la taille du stylo. Avec une tablette graphique ou un stylet Surface, le trait est <b>sensible à la pression</b>.</li>
<li><b>Reconnaissance des formes :</b> garder le stylo immobile un instant à la fin du trait – ligne, cercle, ellipse, rectangle ou triangle sont tracés proprement.</li>
<li>${k('Maj')} pendant le tracé donne une ligne droite.</li>
<li><b>Gomme</b> (${k('E')}) : « Parties » n’efface que ce qui se trouve sous la gomme, « Traits entiers » efface tout le trait. Images et PDF sont conservés.</li>
</ul>

<h3 id="hs3">Formes, texte & notes</h3>
<ul>
<li>Ligne ${k('L')}, flèche ${k('A')}, rectangle ${k('R')}, ellipse ${k('O')} : tracer en tirant ; avec ${k('Maj')} horizontal/vertical ou carré/cercle.</li>
<li>Texte ${k('T')} : cliquer sur la surface et écrire. Note adhésive ${k('N')} : papillon coloré avec texte. Double-clic pour modifier un texte existant.</li>
<li><b>Sélection</b> ${k('V')} : cliquer ou tracer un cadre ; poignées pour redimensionner, poignée ronde pour pivoter. ${k('Suppr')} supprime, ${k('Ctrl+D')} duplique, ${k('Ctrl+C')}/${k('Ctrl+V')} copie, les flèches déplacent.</li>
</ul>

<h3 id="hs4">Formules (LaTeX)</h3>
<p>Dans les textes, notes et étiquettes de composants, les formules s’écrivent entre dollars, p. ex. ${k('Loi d’Ohm : $U = R \\cdot I$')} ou ${k('$f_g = \\frac{1}{2\\pi RC}$')}. Le texte autour garde la police choisie. Le rendu des formules (MathJax) est intégré et fonctionne hors ligne.</p>

<h3 id="hs5">Instruments de tracé</h3>
<ul>
<li>La <b>règle</b> ${k('U')} et l’<b>équerre</b> ${k('G')} s’affichent en taille réelle (calibrage dans les réglages). Tirer déplace, le bouton bleu fait pivoter (avec ${k('Maj')} par pas de 15°). En partant d’un bord avec le stylo ou la ligne, on obtient une droite exacte. L’équerre a une échelle en cm avec zéro au milieu et une échelle d’angles.</li>
<li><b>Compas</b> ${k('C')} : placer le centre, tirer le point rouge. L’angle d’ouverture et la longueur des branches donnent le rayon.</li>
<li><b>Parabole</b> ${k('K')} : partir du sommet et tirer vers un point de la courbe. L’équation (en cm) s’affiche pendant le tracé. Axe vertical ou horizontal ; ${k('Maj')} change.</li>
</ul>

<h3 id="hs6">Électronique</h3>
<ul>
<li><b>Boîte à électronique</b> ${k('B')} : plus de 70 symboles (CEI/DIN) répartis en composants de base, semi-conducteurs, sources & appareils de mesure, amplificateurs & logique. Cliquer un composant puis la surface. ${k('Q')} pivote de 90°, ${k('Échap')} termine.</li>
<li><b>Circuits prêts à l’emploi</b> (onglet « Circuits ») : diviseur de tension, filtres, circuits résonants, montages de base à ampli-op, redresseurs, étages à transistor, circuits de mesure, etc. Après un clic, le circuit suit le curseur, ${k('Q')} le pivote, un clic le pose.</li>
<li><b>Tracer un fil</b> ${k('W')} : cliquer sur une borne, placer les coins – le fil suit des angles droits et se termine automatiquement sur une borne ou un autre fil. Les nœuds aux dérivations sont placés automatiquement. Double-clic, clic droit ou ${k('Échap')} termine.</li>
<li>Les étiquettes des composants (champ « Étiquette » à droite) peuvent contenir des formules, p. ex. ${k('$R_1 = 10\\,\\mathrm{k\\Omega}$')}.</li>
<li><b>Simuler</b> (▶ dans la barre d’outils ou la boîte) : le circuit dessiné est calculé – comme dans le simulateur Falstad. Les points jaunes montrent le courant, la couleur des fils la tension (vert positif, rouge négatif). Ampèremètres et voltmètres affichent leur valeur et apparaissent dans l’<b>oscilloscope</b>. Un clic sur un composant ajoute sa tension à l’oscilloscope, un clic sur un interrupteur le bascule (aussi dans le dessin), un bouton-poussoir ferme tant qu’il est pressé, et sur un potentiomètre le clic place le curseur. <b>Circuits logiques :</b> toutes les entrées et sorties des portes affichent le niveau 0 ou 1 (vert = 1). Les bornes (○) qui n’alimentent que des entrées de portes sont des entrées : un toucher bascule entre 0 et 1. Les bornes en sortie de porte affichent le résultat. Les valeurs comme ${k('4,7 kΩ')}, ${k('100 µF')} ou ${k('10 V 50 Hz')} se saisissent à droite sous « Valeur ». Sont simulés : résistances, condensateurs, bobines, sources, diodes, LED, diodes Zener, transistors (NPN/PNP), ampli-op, portes logiques, interrupteurs, lampes et appareils de mesure. Les modifications agissent immédiatement.</li>
<li><b>Composants avancés :</b> thyristor, TRIAC, DIAC, MOSFET, JFET, transformateur (valeur p. ex. ${k('10:1')} ou ${k('230 V / 12 V')}), quartz, phototransistor, optocoupleur, cellule solaire, sources commandées, wattmètre, ohmmètre ainsi que bascules D et RS sont calculés avec des modèles simplifiés. Au démarrage, Scriptoria demande s’il faut les simuler (réglage « Simuler les composants avancés » : Demander, Toujours, Jamais). Le thyristor s’amorce au-delà de 1 mA de courant de gâchette et conduit jusqu’à ce que le courant passe sous 1 mA ; la bascule D recopie D au front montant de l’horloge.</li>
<li>Enregistrer ses circuits : tout sélectionner, « Enregistrer comme circuit … ». Des symboles personnels peuvent être importés en fichier JSON – voir « Guide » dans la boîte.</li>
</ul>

<h3 id="hs7">Présenter</h3>
<ul>
<li><b>Fenêtre de présentation</b> (icône écran en haut) : ouvre une seconde fenêtre pour projecteur ou second écran, qui n’affiche que la surface – en direct, même pendant l’écriture. Double-clic pour le plein écran.</li>
<li><b>Pointeur laser</b> ${k('J')} : le point suit la souris avec une courte traînée. Rien n’est enregistré.</li>
<li><b>Masquer les barres</b> (icône en bas à gauche ou ${k('Tab')}) : toute la surface pour écrire. Les outils restent accessibles au clavier.</li>
<li><b>Plein écran</b> (icône en bas à gauche ou ${k('F')}).</li>
<li>La barre d’outils à gauche et le panneau des propriétés à droite se réduisent avec la petite flèche en haut. À gauche restent alors main, stylo et gomme. Si tous les outils ne tiennent pas à l’écran, la barre défile à la molette ; une ombre au bord signale d’autres outils.</li>
</ul>

<h3 id="hs8">Tableaux historiques</h3>
<p>À activer dans les réglages sous « Modèles historiques ». Ils apparaissent ensuite sur l’écran d’accueil et dans la barre du haut (« Modèle »). Chaque modèle a ses propres instruments d’écriture :</p>
<ul>
<li><b>Tableau noir :</b> craie de six couleurs, éponge.</li>
<li><b>Rouleau de papyrus</b> (Égypte ancienne) : pinceau de jonc noir de suie et rouge ocre, chiffon humide.</li>
<li><b>Tablette de cire romaine :</b> quatre tablettes de bois reliées (changer à droite ou avec ${k('Pg ↑')}/${k('Pg ↓')}). Le stylet grave la cire avec sa pointe ; ${k('D')} le tourne sur le bout plat qui lisse la cire – même barres masquées. On n’écrit que sur la cire, pas sur le cadre ni sur la table (de même pour l’argile et l’ardoise).</li>
<li><b>Table de sable d’Archimède :</b> dessiner dans le sable avec un bâton, lisser à la main.</li>
<li><b>Tablette d’argile mésopotamienne :</b> le calame imprime des coins (point de départ = tête, tirer = direction et longueur), le stylet trace des lignes, le pouce lisse.</li>
<li><b>Ardoise :</b> avec lignes, crayon d’ardoise, craie, éponge et chiffon.</li>
<li><b>Parchemin et plume d’oie :</b> plume large à l’encre ferro-gallique, vermillon et bleu azurite, mine de plomb pour tracer les lignes ; les erreurs sont grattées au canif.</li>
</ul>
<p>Chaque époque a son propre contenu : en changeant de modèle, ce qui a été écrit avec le précédent disparaît – il revient quand on y retourne.</p>
<p>Selon le tableau, des instruments d’époque sont disponibles, p. ex. règle, compas et baguette au tableau noir, regula et circinus avec la tablette de cire, ou compas et règle chez Archimède. Les arcs de compas sont tracés avec l’instrument choisi. Avec <b>« Outils historiques uniquement »</b> dans les réglages, tous les outils modernes sont masqués.</p>

<h3 id="hs9">Affichage</h3>
<ul>
<li>La molette fait défiler, ${k('Ctrl')} + molette zoome ; sur écran tactile avec deux doigts. L’outil main ${k('H')} ou la ${k('barre d’espace')} maintenue déplace la vue.</li>
<li>En bas à gauche : « Tout afficher », zoom ; un clic sur le pourcentage revient à 100 %.</li>
<li>En haut : repères oui/non, alignement sur la grille, mode clair/sombre. Dans les réglages, on choisit le type de repères (points, carreaux ou lignes comme dans un cahier) et leur intensité.</li>
<li><b>Langue :</b> tout en haut des réglages – Deutsch, English, Français, 中文, Русский, हिन्दी ou Latina. La page se recharge ensuite.</li>
<li>Également dans les réglages : l’<b>icône de l’app</b> – tableau blanc (par défaut), électrotechnique, rouleau ou assortie à chaque tableau historique.</li>
<li><b>Changer l’icône de l’app installée :</b> le navigateur ne reprend l’icône qu’à l’installation. Pour qu’une nouvelle icône apparaisse dans le menu Démarrer et la barre des tâches, il faut réinstaller Scriptoria dans Edge :
<ol><li>Désinstaller l’app : dans la fenêtre de l’app en haut à droite ${k('…')} → « Désinstaller Scriptoria » (ou ouvrir ${k('edge://apps')}, chez Scriptoria ${k('…')} → « Désinstaller »). Ne <b>pas</b> cocher « Effacer les données », sinon les tableaux sont perdus.</li>
<li>Ouvrir Scriptoria dans un onglet Edge normal et choisir l’icône souhaitée dans les réglages.</li>
<li>Dans Edge, choisir ${k('…')} → « Applications » → « Installer ce site en tant qu’application ».</li></ol>
Dans l’onglet et la barre du navigateur, la nouvelle icône s’applique aussitôt.</li>
</ul>

<h3 id="hs10">Outils supplémentaires</h3>
<p>Masqués par défaut pour garder la barre claire. À activer dans les réglages sous « Outils dans la barre » :</p>
<ul>
<li><b>Traceur de fonctions & repère :</b> p. ex. ${k('2*sin(x - pi/4)')}, ${k('exp(-x)*cos(5x)')} ou ${k('x^2 - 1')} ; domaine, échelle et étiquettes d’axes au choix. Laissé vide, il crée un repère.</li>
<li><b>Diagramme de Fresnel :</b> vecteurs avec module et angle (p. ex. U et I), axes Re/Im et arcs d’angle.</li>
<li><b>Modèles de diagrammes :</b> repère vide, diagramme de Fresnel vide (axes Re/Im avec cercles d’aide pour dessiner), diagramme de Bode, grille d’oscilloscope, réseau de caractéristiques, papier logarithmique, coordonnées polaires. Les <b>étiquettes d’axes</b> se choisissent librement à l’insertion, formules entre ${k('$…$')}.</li>
<li><b>Chronomètre</b> avec compte à rebours (1–20 min) pour les exercices.</li>
<li><b>Petit Fourier :</b> saisir une fonction f(t) et une période T (p. ex. ${k('sgn(sin(2*pi*t/T))')} ou ${k('sin(2*pi*50*t)')} avec T = ${k('20m')}) ; il affiche fréquences, amplitudes Aₙ et phases φₙ des harmoniques, le spectre d’amplitude et la somme des harmoniques. Modèles : carré, triangle, dents de scie, redressement, etc. « Spectre sur le tableau » insère le spectre comme image.</li>
<li><b>Calculatrice</b> (scientifique) : opérations de base, puissances, racines, sin/cos/tan et réciproques (DEG ou RAD), ln, log, n!, π, e, ${k('EXP')} pour les puissances de dix et ${k('Ans')} pour le dernier résultat. Utilisable au clavier ; « Insérer » place le calcul et le résultat en texte sur le tableau.</li>
</ul>
<p>Les diagrammes sont un objet solide : déplacer, redimensionner, supprimer – sans les démonter par erreur. Double-clic (ou « Modifier le diagramme ») change fonction, domaine et étiquettes d’axes. On peut dessiner directement dedans au stylo, y compris des courbes à main levée dans un repère vide ou des vecteurs dans un diagramme de Fresnel vide ; la gomme laisse le diagramme intact.</p>

<h3 id="hs11">Raccourcis clavier</h3>
<table class="keys">
<tr><td>${k('V')} Sélection</td><td>${k('H')} Main</td><td>${k('P')} Stylo</td><td>${k('E')} Gomme</td></tr>
<tr><td>${k('L')} Ligne</td><td>${k('A')} Flèche</td><td>${k('R')} Rectangle</td><td>${k('O')} Ellipse</td></tr>
<tr><td>${k('T')} Texte</td><td>${k('N')} Note</td><td>${k('C')} Compas</td><td>${k('K')} Parabole</td></tr>
<tr><td>${k('U')} Règle</td><td>${k('G')} Équerre</td><td>${k('J')} Pointeur laser</td><td>${k('B')} Boîte</td></tr>
<tr><td>${k('W')} Fil</td><td>${k('Q')} Pivoter de 90°</td><td>${k('1')}–${k('9')} Choisir le stylo</td><td>${k('D')} Tourner le stylet</td></tr>
<tr><td>${k('Pg ↑/↓')} Page</td><td>${k('Tab')} Barres</td><td>${k('F')} Plein écran</td><td>${k('Ctrl+Z')} Annuler</td><td>${k('Ctrl+Y')} Rétablir</td></tr>
<tr><td>${k('Ctrl+S')} Enregistrer</td><td>${k('Ctrl+A')} Tout sélectionner</td><td>${k('Suppr')} Supprimer</td><td>${k('Échap')} Annuler</td></tr>
</table>
<p class="muted">Scriptoria est un logiciel libre (licence MIT). Formules : MathJax (licence Apache 2.0), PDF : pdf.js et jsPDF.</p>`;

HELP_L10N['fr:elec'] = sym => `
<h3>1. Insérer des composants</h3>
<p>Ouvrez la boîte avec l’icône puce dans la barre de gauche (touche <code>B</code>). Choisissez un composant et cliquez sur la surface – il reste sélectionné, vous pouvez en placer plusieurs. <code>Q</code> le pivote de 90° avant de le poser, <code>Échap</code> arrête. Activez l’<b>alignement sur la grille</b> (réglages ou barre du haut) pour que les bornes se rejoignent exactement.</p>
<h3>2. Relier</h3>
<p>Tracez les fils avec l’outil <b>ligne</b> (touche <code>L</code>) avec l’alignement actif, ou avec « Tracer un fil » (<code>W</code>). Maintenez <code>Maj</code> pour des lignes horizontales/verticales. Les nœuds se posent avec le composant « Nœud ». Les étiquettes avec l’outil texte ou – pour les composants – dans le champ « Étiquette » à droite.</p>
<h3>3. Circuits prêts à l’emploi</h3>
<p>L’onglet <b>Circuits</b> propose des montages standard (diviseur de tension, filtres, amplificateurs, redresseurs, …). Après un clic, le circuit suit le curseur : <code>Q</code> le pivote de 90°, un clic sur la surface le pose, <code>Échap</code> annule. Ensuite, tout peut être déplacé, pivoté et modifié.</p>
<h3>4. Ajouter ses propres circuits</h3>
<p>Dessinez ou construisez votre circuit, sélectionnez tout (Ctrl+A ou cadre) et choisissez <b>« Enregistrer la sélection comme circuit »</b> dans l’onglet <b>Circuits</b>. Il apparaît ensuite sous « Circuits personnels ». Les boutons en bas de la boîte permettent d’exporter (pour partager), d’importer ou de supprimer vos circuits.</p>
<h3>5. Ajouter ses propres composants (symboles)</h3>
<p>Créez un fichier <code>.json</code> et chargez-le dans l’onglet <b>Composants</b> avec « Importer des symboles … ». Un fichier peut contenir un symbole ou une liste de symboles :</p>
<pre>${sym.replace(/</g, '&lt;')}</pre>
<ul>
<li><code>w</code>, <code>h</code> : taille en unités du tableau ; l’origine est en haut à gauche, y vers le bas.</li>
<li><code>paths</code> : lignes en chemins SVG (<code>M</code> = aller, <code>L</code> = ligne, <code>H</code>/<code>V</code> = horizontal/vertical, <code>A</code> = arc, <code>Z</code> = fermer).</li>
<li><code>fills</code> : surfaces pleines (p. ex. pointes de flèche), aussi en chemins SVG.</li>
<li><code>pins</code> : points de connexion, de préférence sur la grille de 10.</li>
<li><code>texts</code> : lettres dans le symbole (<code>s</code> = taille de police).</li>
</ul>
<p>Astuce : dessinez les chemins dans un éditeur SVG (p. ex. Inkscape) et collez ici les valeurs <code>d</code>.</p>
<h3>Raccourcis clavier</h3>
<p><code>V</code> Sélection · <code>H</code> Main · <code>P</code> Stylo · <code>E</code> Gomme · <code>L</code> Ligne · <code>A</code> Flèche · <code>R</code> Rectangle · <code>O</code> Ellipse · <code>T</code> Texte · <code>N</code> Note · <code>C</code> Compas · <code>J</code> Pointeur laser · <code>U</code> Règle · <code>B</code> Boîte · <code>Q</code> Pivoter de 90° · Ctrl+Z/Y Annuler/Rétablir · Ctrl+S Enregistrer</p>`;
