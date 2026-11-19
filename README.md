# Scriptoria

Digitales Whiteboard für Vorlesung und Unterricht – mit Elektronik-Baukasten, Zeichengeräten, Formelsatz und historischen Tafeln.
Läuft **im Browser** (Firefox, Edge, Chrome), ohne Installation und nach dem ersten Laden auch **offline**.

## Funktionen
- Stifte (Bleistift, Kugelschreiber, Füllfederhalter, Edding, Textmarker), **druckempfindlich** mit Grafiktablett/Surface-Stift, Radierer, Linien, Pfeile, Formen, Text, Haftnotizen
- **PDFs und Bilder** einfügen (untereinander oder je PDF-Seite eine eigene Seite), PDF-Seiten fixiert zum Beschriften
- **Seiten**: mehrere unendliche Flächen pro Whiteboard, Export aller Seiten als PDF
- **Formerkennung**: Stift kurz stillhalten → saubere Linie, Kreis, Rechteck, Dreieck
- **Formeln in LaTeX** zwischen `$…$` in Text, Notizen und Bauteil-Beschriftungen (MathJax, offline eingebaut)
- Zeichengeräte in Originalgröße: **Lineal**, **Geodreieck**, **Zirkel**, **Parabel**
- **Schaltungssimulation** wie bei Falstad: Strom als wandernde Punkte, Spannung als Farbe, Messgeräte mit Oszilloskop, Schalter zum Anklicken
- **Elektronik-Baukasten**: über 70 Schaltsymbole, 26 fertige Schaltungen (am Mauszeiger platzieren und drehen), **Leitungen ziehen** mit automatischen Knotenpunkten
- **Präsentieren**: Präsentationsfenster für Beamer (live), Laserpointer, Leisten ausblenden (Tab), Vollbild (F)
- Diagramme als feste Objekte (verschieben/skalieren, Doppelklick bearbeitet); optional (Einstellungen): Funktionsplotter, Zeigerdiagramm, Diagramm-Vorlagen (Bode, Oszilloskop …), Stoppuhr
- **Historische Tafeln** (in den Einstellungen einschalten): Kreidetafel, Papyrusrolle, römische Wachstafel, Archimedes’ Sandtafel, mesopotamische Tontafel, Schiefertafel, Pergament mit Gänsekiel – jeweils mit eigenen Schreibgeräten
- **Automatisches Speichern** im Browser (IndexedDB); zusätzlich mit **Strg+S** als `.owb`-Datei sichern
- Hilfslinien als Punkte, Karos oder Schreibheft-Linien, Stärke einstellbar
- Neun App-Symbole zur Auswahl (Einstellungen)
- Export als PDF oder PNG
- Alle Funktionen sind in der App unter **ⓘ Hilfe** erklärt.

> Die Boards gehören zum Browser und zur Adresse der Seite. Wer „Websitedaten löschen“ wählt, verliert die Boards im Browser – daher wichtige Boards regelmäßig als `.owb` sichern.

## Installieren
In **Edge/Chrome** lässt sich Scriptoria als eigenes Programmfenster installieren („App installieren“ auf dem Startbildschirm oder Symbol in der Adressleiste). Firefox kann Webseiten nicht als App installieren – dort läuft Scriptoria in einem normalen Tab, voll funktionsfähig.

## Veröffentlichen – GitHub Pages
1. Inhalt dieses Ordners in ein öffentliches GitHub-Repository hochladen (der Ordner `.github` muss mit).
2. Repository → Settings → Pages → *Source*: **GitHub Actions**. Nach etwa einer Minute steht die Adresse da.

Alternative: jeder andere statische Webspace mit **HTTPS**.

## Lokal ausprobieren
```
python -m http.server 8000      # dann http://localhost:8000 im Browser öffnen
```

## Aufbau
`index.html`, `style.css`, `js/` (Programm), `lib/` (pdf.js, jsPDF, MathJax), `sw.js` (Offline), `manifest.webmanifest`, `icons/`.
Bei Änderungen an Dateien in `sw.js` die `VERSION` hochzählen, damit Browser neu laden.

Lizenz: MIT (siehe LICENSE). MathJax: Apache-Lizenz 2.0 (`lib/mathjax/LICENSE`).
