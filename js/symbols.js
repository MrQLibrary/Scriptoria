"use strict";
/* ===== Elektronik-Symbole =====
   Jedes Symbol: { id, name, cat, w, h, pins:[[x,y],…], paths:[SVG-Pfade zum Zeichnen],
                   fills:[SVG-Pfade zum Ausfüllen], texts:[{t,x,y,s}] }
   Koordinaten: Einheiten = Board-Einheiten bei Größe 1:1, y zeigt nach unten.
   Anschlusspunkte (pins) liegen auf dem 10er-Raster, damit Leitungen sauber einrasten. */
const circ = (cx, cy, r) => `M${cx + r},${cy} A${r},${r} 0 1 0 ${cx - r},${cy} A${r},${r} 0 1 0 ${cx + r},${cy} Z`;
const DIODE = 'M0,20 H28 M52,20 H80 M28,6 V34 L52,20 Z M52,6 V34';
const AND_BODY = 'M25,10 H50 A30,30 0 0 1 50,70 H25 Z';
const OR_BODY = 'M20,10 H40 Q75,10 80,40 Q75,70 40,70 H20 Q35,40 20,10 Z';
const VSRC = 'M20,0 V24 M20,56 V80';
const NPN_BASE = 'M0,40 H24 M24,24 V56';

const SYMBOLS = [
  // --- Grundbauteile ---
  { id: 'resistor', name: 'Widerstand', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80 M20,10 H60 V30 H20 Z'] },
  { id: 'resistor_us', name: 'Widerstand (US)', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H10 L16,6 L28,34 L40,6 L52,34 L64,6 L70,20 H80'] },
  { id: 'pot', name: 'Potentiometer', cat: 'Grundbauteile', w: 80, h: 60, pins: [[0, 20], [80, 20], [40, 60]], paths: ['M0,20 H20 M60,20 H80 M20,10 H60 V30 H20 Z M40,60 V31 M35,38 L40,31 L45,38'] },
  { id: 'capacitor', name: 'Kondensator', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H34 M46,20 H80 M34,6 V34 M46,6 V34'] },
  { id: 'cap_pol', name: 'Elko (gepolt)', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H34 M46,20 H80 M34,6 V34 M50,6 Q42,20 50,34 M22,9 H30 M26,5 V13'] },
  { id: 'inductor', name: 'Spule', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H12 A7,7 0 0 1 26,20 A7,7 0 0 1 40,20 A7,7 0 0 1 54,20 A7,7 0 0 1 68,20 H80'] },
  { id: 'transformer', name: 'Transformator', cat: 'Grundbauteile', w: 80, h: 80, pins: [[0, 10], [0, 70], [80, 10], [80, 70]],
    paths: ['M0,10 H20 A7,7 0 0 1 20,24 A7,7 0 0 1 20,38 A7,7 0 0 1 20,52 A7,7 0 0 1 20,66 L20,70 H0 M80,10 H60 A7,7 0 0 0 60,24 A7,7 0 0 0 60,38 A7,7 0 0 0 60,52 A7,7 0 0 0 60,66 L60,70 H80 M38,8 V72 M42,8 V72'] },
  { id: 'fuse', name: 'Sicherung', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80 M20,12 H60 V28 H20 Z M20,20 H60'] },
  { id: 'crystal', name: 'Quarz', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H30 M50,20 H80 M30,6 V34 M50,6 V34 M36,10 H44 V30 H36 Z'] },
  { id: 'switch', name: 'Schalter', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H22 M58,20 H80 M22,20 L54,6'], fills: [circ(22, 20, 3), circ(58, 20, 3)] },
  { id: 'button', name: 'Taster', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H22 M58,20 H80 M22,14 H58 M40,14 V4 M32,4 H48'] },
  { id: 'lamp', name: 'Glühlampe', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80', circ(40, 20, 20), 'M26,6 L54,34 M54,6 L26,34'] },
  { id: 'junction', name: 'Knoten', cat: 'Grundbauteile', w: 20, h: 20, pins: [[10, 10]], paths: [], fills: [circ(10, 10, 4)] },
  { id: 'terminal', name: 'Anschluss', cat: 'Grundbauteile', w: 20, h: 20, pins: [[10, 10]], paths: [circ(10, 10, 4)] },

  // --- Halbleiter ---
  { id: 'diode', name: 'Diode', cat: 'Halbleiter', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: [DIODE] },
  { id: 'led', name: 'LED', cat: 'Halbleiter', w: 80, h: 50, pins: [[0, 30], [80, 30]],
    paths: ['M0,30 H28 M52,30 H80 M28,16 V44 L52,30 Z M52,16 V44 M46,14 L58,2 M54,18 L66,6 M58,2 L53,3 M58,2 L57,7 M66,6 L61,7 M66,6 L65,11'] },
  { id: 'zener', name: 'Z-Diode', cat: 'Halbleiter', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H28 M52,20 H80 M28,6 V34 L52,20 Z M47,31 L52,34 V6 L57,9'] },
  { id: 'thyristor', name: 'Thyristor', cat: 'Halbleiter', w: 80, h: 50, pins: [[0, 20], [80, 20], [70, 50]], paths: [DIODE, 'M52,30 L70,50'] },
  { id: 'npn', name: 'NPN-Transistor', cat: 'Halbleiter', w: 50, h: 80, pins: [[0, 40], [40, 0], [40, 80]],
    paths: [NPN_BASE, 'M24,32 L40,16 V0 M24,48 L40,64 V80'], fills: ['M36.8,60.8 L27.6,57.2 L33.2,51.6 Z'] },
  { id: 'pnp', name: 'PNP-Transistor', cat: 'Halbleiter', w: 50, h: 80, pins: [[0, 40], [40, 0], [40, 80]],
    paths: [NPN_BASE, 'M24,32 L40,16 V0 M24,48 L40,64 V80'], fills: ['M27.2,28.8 L36.4,25.2 L30.8,19.6 Z'] },
  { id: 'nmos', name: 'N-MOSFET', cat: 'Halbleiter', w: 50, h: 80, pins: [[0, 40], [40, 0], [40, 80]],
    paths: ['M0,40 H16 M16,24 V56 M24,16 V32 M24,36 V44 M24,48 V64 M24,20 H40 V0 M24,60 H40 V80 M24,40 H40 V60'], fills: ['M24,40 L31,36.5 V43.5 Z'] },
  { id: 'pmos', name: 'P-MOSFET', cat: 'Halbleiter', w: 50, h: 80, pins: [[0, 40], [40, 0], [40, 80]],
    paths: ['M0,40 H16 M16,24 V56 M24,16 V32 M24,36 V44 M24,48 V64 M24,20 H40 V0 M24,60 H40 V80 M24,40 H40 V20'], fills: ['M32,40 L25,36.5 V43.5 Z'] },

  // --- Quellen & Messgeräte ---
  { id: 'vdc', name: 'Spannungsquelle', cat: 'Quellen & Messgeräte', w: 40, h: 80, pins: [[20, 0], [20, 80]], paths: ['M20,0 V80', circ(20, 40, 16)] },
  { id: 'battery', name: 'Batterie', cat: 'Quellen & Messgeräte', w: 40, h: 80, pins: [[20, 0], [20, 80]], paths: ['M20,0 V32 M20,48 V80 M6,32 H34 M12,48 H28'], texts: [{ t: '+', x: 32, y: 24, s: 12 }] },
  { id: 'vac', name: 'Wechselspannungsquelle', cat: 'Quellen & Messgeräte', w: 40, h: 80, pins: [[20, 0], [20, 80]], paths: [VSRC, circ(20, 40, 16), 'M9,40 Q14.5,28 20,40 T31,40'] },
  { id: 'idc', name: 'Stromquelle', cat: 'Quellen & Messgeräte', w: 40, h: 80, pins: [[20, 0], [20, 80]], paths: [VSRC, circ(20, 40, 16), 'M4,40 H36'] },
  { id: 'ground', name: 'Erdung', cat: 'Quellen & Messgeräte', w: 40, h: 40, pins: [[20, 0]], paths: ['M20,0 V20 M6,20 H34 M11,27 H29 M16,34 H24'] },
  { id: 'vcc', name: 'Versorgung (+Vcc)', cat: 'Quellen & Messgeräte', w: 40, h: 50, pins: [[20, 50]], paths: ['M20,50 V22 M8,22 H32'], texts: [{ t: '+Vcc', x: 20, y: 11, s: 13 }] },
  { id: 'ammeter', name: 'Amperemeter', cat: 'Quellen & Messgeräte', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80', circ(40, 20, 20)], texts: [{ t: 'A', x: 40, y: 21, s: 20 }] },
  { id: 'voltmeter', name: 'Voltmeter', cat: 'Quellen & Messgeräte', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80', circ(40, 20, 20)], texts: [{ t: 'V', x: 40, y: 21, s: 20 }] },
  { id: 'motor', name: 'Motor', cat: 'Quellen & Messgeräte', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80', circ(40, 20, 20)], texts: [{ t: 'M', x: 40, y: 21, s: 20 }] },
  { id: 'varrow', name: 'Spannungspfeil', cat: 'Quellen & Messgeräte', w: 80, h: 20, pins: [[0, 10], [80, 10]], paths: ['M0,10 H80 M70,4 L80,10 L70,16'] },

  // --- Verstärker & Logik ---
  { id: 'opamp', name: 'Operationsverstärker', cat: 'Verstärker & Logik', w: 120, h: 80, pins: [[0, 20], [0, 60], [120, 40]],
    paths: ['M0,20 H20 M0,60 H20 M20,0 V80 L100,40 Z M100,40 H120 M26,20 H34 M26,60 H34 M30,56 V64'] },
  { id: 'opamp2', name: 'Operationsverstärker (+ oben)', cat: 'Verstärker & Logik', w: 120, h: 80, pins: [[0, 20], [0, 60], [120, 40]],
    paths: ['M0,20 H20 M0,60 H20 M20,0 V80 L100,40 Z M100,40 H120 M26,20 H34 M30,16 V24 M26,60 H34'] },
  { id: 'and', name: 'UND (AND)', cat: 'Verstärker & Logik', w: 100, h: 80, pins: [[0, 30], [0, 50], [100, 40]], paths: ['M0,30 H25 M0,50 H25 M80,40 H100', AND_BODY] },
  { id: 'nand', name: 'NAND', cat: 'Verstärker & Logik', w: 110, h: 80, pins: [[0, 30], [0, 50], [110, 40]], paths: ['M0,30 H25 M0,50 H25 M90,40 H110', AND_BODY, circ(85, 40, 5)] },
  { id: 'or', name: 'ODER (OR)', cat: 'Verstärker & Logik', w: 100, h: 80, pins: [[0, 30], [0, 50], [100, 40]], paths: ['M0,30 H26 M0,50 H26 M80,40 H100', OR_BODY] },
  { id: 'nor', name: 'NOR', cat: 'Verstärker & Logik', w: 110, h: 80, pins: [[0, 30], [0, 50], [110, 40]], paths: ['M0,30 H26 M0,50 H26 M90,40 H110', OR_BODY, circ(85, 40, 5)] },
  { id: 'xor', name: 'XOR', cat: 'Verstärker & Logik', w: 100, h: 80, pins: [[0, 30], [0, 50], [100, 40]], paths: ['M0,30 H22 M0,50 H22 M80,40 H100', OR_BODY, 'M12,10 Q27,40 12,70'] },
  { id: 'not', name: 'NICHT (NOT)', cat: 'Verstärker & Logik', w: 100, h: 80, pins: [[0, 40], [100, 40]], paths: ['M0,40 H20 M80,40 H100 M20,10 V70 L70,40 Z', circ(75, 40, 5)] },
  { id: 'buffer', name: 'Puffer', cat: 'Verstärker & Logik', w: 100, h: 80, pins: [[0, 40], [100, 40]], paths: ['M0,40 H20 M80,40 H100 M20,10 V70 L80,40 Z'] },
  // --- Weitere Grundbauteile ---
  { id: 'resistor_var', name: 'Einstellbarer Widerstand', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80 M20,10 H60 V30 H20 Z M22,38 L56,4'], fills: ['M58,2 L49,5 L55,11 Z'] },
  { id: 'ntc', name: 'Heißleiter (NTC)', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80 M20,10 H60 V30 H20 Z M12,38 H24 L62,2'], texts: [{ t: '−ϑ', x: 70, y: 34, s: 11 }] },
  { id: 'ptc', name: 'Kaltleiter (PTC)', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80 M20,10 H60 V30 H20 Z M12,38 H24 L62,2'], texts: [{ t: '+ϑ', x: 70, y: 34, s: 11 }] },
  { id: 'ldr', name: 'Fotowiderstand (LDR)', cat: 'Grundbauteile', w: 80, h: 50, pins: [[0, 30], [80, 30]], paths: ['M0,30 H20 M60,30 H80 M20,20 H60 V40 H20 Z M16,0 L27,11 M28,0 L39,11'], fills: ['M29,13 L22.6,11.1 L27.1,6.6 Z', 'M41,13 L34.6,11.1 L39.1,6.6 Z'] },
  { id: 'cap_var', name: 'Drehkondensator', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H34 M46,20 H80 M34,6 V34 M46,6 V34 M24,38 L54,4'], fills: ['M56,2 L47.5,5.5 L53.5,10.5 Z'] },
  { id: 'inductor_core', name: 'Spule mit Eisenkern', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H12 A7,7 0 0 1 26,20 A7,7 0 0 1 40,20 A7,7 0 0 1 54,20 A7,7 0 0 1 68,20 H80 M12,8 H68 M12,5 H68'] },
  { id: 'transformer2', name: 'Transformator (Kreise)', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H14 M66,20 H80', circ(30, 20, 16), circ(50, 20, 16)] },
  { id: 'switch_spdt', name: 'Wechselschalter', cat: 'Grundbauteile', w: 80, h: 40, pins: [[0, 20], [80, 10], [80, 30]], paths: ['M0,20 H22 M22,20 L57,8 M60,10 H80 M60,30 H80'], fills: [circ(22, 20, 3), circ(60, 10, 3), circ(60, 30, 3)] },
  { id: 'relay', name: 'Relais (Spule)', cat: 'Grundbauteile', w: 40, h: 80, pins: [[20, 0], [20, 80]], paths: ['M20,0 V25 M20,55 V80 M5,25 H35 V55 H5 Z M5,55 L35,25'] },
  { id: 'speaker', name: 'Lautsprecher', cat: 'Grundbauteile', w: 60, h: 60, pins: [[0, 20], [0, 40]], paths: ['M0,20 H14 M0,40 H14 M14,14 H26 V46 H14 Z M26,14 L44,0 V60 L26,46'] },
  { id: 'antenna', name: 'Antenne', cat: 'Grundbauteile', w: 40, h: 60, pins: [[20, 60]], paths: ['M20,60 V16 M6,2 L20,18 L34,2'] },
  { id: 'chassis', name: 'Masse (Gehäuse)', cat: 'Grundbauteile', w: 40, h: 40, pins: [[20, 0]], paths: ['M20,0 V20 M6,20 H34 M6,20 L0,30 M20,20 L14,30 M34,20 L28,30'] },
  { id: 'crossing', name: 'Kreuzung ohne Verbindung', cat: 'Grundbauteile', w: 40, h: 40, pins: [[0, 20], [40, 20], [20, 0], [20, 40]], paths: ['M0,20 H12 A8,8 0 0 1 28,20 H40 M20,0 V40'] },

  // --- Weitere Halbleiter ---
  { id: 'schottky', name: 'Schottky-Diode', cat: 'Halbleiter', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H28 M52,20 H80 M28,6 V34 L52,20 Z M46,10 V6 H52 V34 H58 V30'] },
  { id: 'photodiode', name: 'Fotodiode', cat: 'Halbleiter', w: 80, h: 50, pins: [[0, 30], [80, 30]], paths: ['M0,30 H28 M52,30 H80 M28,16 V44 L52,30 Z M52,16 V44 M10,0 L20,10 M22,0 L32,10'], fills: ['M22,12 L15.6,10.1 L20.1,5.6 Z', 'M34,12 L27.6,10.1 L32.1,5.6 Z'] },
  { id: 'phototrans', name: 'Fototransistor', cat: 'Halbleiter', w: 50, h: 80, pins: [[40, 0], [40, 80]],
    paths: ['M24,24 V56 M24,32 L40,16 V0 M24,48 L40,64 V80 M0,14 L12,26 M0,28 L12,40'], fills: ['M36.8,60.8 L27.6,57.2 L33.2,51.6 Z', 'M14,28 L7.6,26.1 L12.1,21.6 Z', 'M14,42 L7.6,40.1 L12.1,35.6 Z'] },
  { id: 'njfet', name: 'N-Kanal-JFET', cat: 'Halbleiter', w: 50, h: 80, pins: [[0, 60], [40, 0], [40, 80]], paths: ['M24,14 V66 M24,20 H40 V0 M24,60 H40 V80 M0,60 H24'], fills: ['M24,60 L15,55.5 V64.5 Z'] },
  { id: 'triac', name: 'TRIAC', cat: 'Halbleiter', w: 80, h: 60, pins: [[0, 30], [80, 30], [60, 60]], paths: ['M0,30 H30 M50,30 H80 M30,8 V52 M50,8 V52 M30,10 L50,20 L30,30 Z M50,30 L30,40 L50,50 Z M50,50 L60,60'] },
  { id: 'diac', name: 'DIAC', cat: 'Halbleiter', w: 80, h: 60, pins: [[0, 30], [80, 30]], paths: ['M0,30 H30 M50,30 H80 M30,8 V52 M50,8 V52 M30,10 L50,20 L30,30 Z M50,30 L30,40 L50,50 Z'] },
  { id: 'opto', name: 'Optokoppler', cat: 'Halbleiter', w: 100, h: 80, pins: [[0, 20], [0, 60], [100, 20], [100, 60]],
    paths: ['M0,20 H25 V30 M0,60 H25 V50 M15,30 H35 L25,50 Z M15,50 H35 M38,36 H52 M38,44 H52 M62,24 V56 M62,32 L76,20 H100 M62,48 L76,60 H100'], fills: ['M56,36 L49,32.5 V39.5 Z', 'M56,44 L49,40.5 V47.5 Z', 'M75,59 L66,57 L70.5,51.5 Z'] },

  // --- Weitere Quellen & Messgeräte ---
  { id: 'vcvs', name: 'Gesteuerte Spannungsquelle', cat: 'Quellen & Messgeräte', w: 40, h: 80, pins: [[20, 0], [20, 80]], paths: ['M20,0 V80 M20,20 L40,40 L20,60 L0,40 Z'] },
  { id: 'cccs', name: 'Gesteuerte Stromquelle', cat: 'Quellen & Messgeräte', w: 40, h: 80, pins: [[20, 0], [20, 80]], paths: ['M20,0 V20 M20,60 V80 M20,20 L40,40 L20,60 L0,40 Z M0,40 H40'] },
  { id: 'solar', name: 'Solarzelle', cat: 'Quellen & Messgeräte', w: 60, h: 80, pins: [[20, 0], [20, 80]], paths: ['M20,0 V32 M20,48 V80 M6,32 H34 M12,48 H28 M58,20 L46,32 M58,32 L46,44'], fills: ['M44,34 L46.1,27.6 L50.4,31.9 Z', 'M44,46 L46.1,39.6 L50.4,43.9 Z'], texts: [{ t: '+', x: 32, y: 24, s: 12 }] },
  { id: 'generator', name: 'Generator', cat: 'Quellen & Messgeräte', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80', circ(40, 20, 20)], texts: [{ t: 'G', x: 40, y: 21, s: 20 }] },
  { id: 'motor3', name: 'Drehstrommotor', cat: 'Quellen & Messgeräte', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80', circ(40, 20, 20)], texts: [{ t: 'M', x: 40, y: 14, s: 15 }, { t: '3~', x: 40, y: 29, s: 11 }] },
  { id: 'wattmeter', name: 'Leistungsmesser', cat: 'Quellen & Messgeräte', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80', circ(40, 20, 20)], texts: [{ t: 'W', x: 40, y: 21, s: 18 }] },
  { id: 'ohmmeter', name: 'Ohmmeter', cat: 'Quellen & Messgeräte', w: 80, h: 40, pins: [[0, 20], [80, 20]], paths: ['M0,20 H20 M60,20 H80', circ(40, 20, 20)], texts: [{ t: 'Ω', x: 40, y: 21, s: 18 }] },
  { id: 'iarrow', name: 'Strompfeil', cat: 'Quellen & Messgeräte', w: 40, h: 20, pins: [[0, 10], [40, 10]], paths: ['M0,10 H40'], fills: ['M30,10 L18,4 V16 Z'] },

  // --- Weitere Logik ---
  { id: 'xnor', name: 'XNOR', cat: 'Verstärker & Logik', w: 110, h: 80, pins: [[0, 30], [0, 50], [110, 40]], paths: ['M0,30 H22 M0,50 H22 M90,40 H110', OR_BODY, 'M12,10 Q27,40 12,70', circ(85, 40, 5)] },
  { id: 'schmitt', name: 'Schmitt-Trigger', cat: 'Verstärker & Logik', w: 100, h: 80, pins: [[0, 40], [100, 40]], paths: ['M0,40 H20 M80,40 H100 M20,10 V70 L80,40 Z M30,46 H44 V34 M38,46 V34 H52'] },
  { id: 'comparator', name: 'Komparator', cat: 'Verstärker & Logik', w: 120, h: 80, pins: [[0, 20], [0, 60], [120, 40]],
    paths: ['M0,20 H20 M0,60 H20 M20,0 V80 L100,40 Z M100,40 H120 M26,20 H34 M30,16 V24 M26,60 H34 M50,46 H60 V34 M56,46 V34 H66'] },
  { id: 'dff', name: 'D-Flipflop', cat: 'Verstärker & Logik', w: 80, h: 100, pins: [[0, 30], [0, 70], [80, 30], [80, 70]],
    paths: ['M0,30 H20 M0,70 H20 M60,30 H80 M60,70 H80 M20,10 H60 V90 H20 Z M20,63 L28,70 L20,77 M45,61 H55'], texts: [{ t: 'D', x: 28, y: 30, s: 12 }, { t: 'Q', x: 51, y: 30, s: 12 }, { t: 'Q', x: 50, y: 70, s: 12 }] },
  { id: 'srff', name: 'RS-Flipflop', cat: 'Verstärker & Logik', w: 80, h: 100, pins: [[0, 30], [0, 70], [80, 30], [80, 70]],
    paths: ['M0,30 H20 M0,70 H20 M60,30 H80 M60,70 H80 M20,10 H60 V90 H20 Z M45,61 H55'], texts: [{ t: 'S', x: 28, y: 30, s: 12 }, { t: 'R', x: 28, y: 70, s: 12 }, { t: 'Q', x: 51, y: 30, s: 12 }, { t: 'Q', x: 50, y: 70, s: 12 }] }
];
const SYM = Object.fromEntries(SYMBOLS.map(s => [s.id, s]));
/* Schaltzustände: Schalter, Taster und Wechselschalter zeigen ihre Stellung auch in der Zeichnung */
const SYM_STATE = {
  'switch:1': { id: 'switch:1', paths: ['M0,20 H22 M58,20 H80 M22,20 L58,17'], fills: [circ(22, 20, 3), circ(58, 20, 3)] },
  'button:1': { id: 'button:1', paths: ['M0,20 H22 M58,20 H80 M22,20 H58 M40,20 V10 M32,10 H48'] },
  'switch_spdt:1': { id: 'switch_spdt:1', paths: ['M0,20 H22 M22,20 L57,32 M60,10 H80 M60,30 H80'], fills: [circ(22, 20, 3), circ(60, 10, 3), circ(60, 30, 3)] }
};
function symStateGeo(o, sym) {
  if (o.sym === 'pot' && o.wiper != null && Math.abs(o.wiper - 0.5) > 0.01) {     // Schleifer an der eingestellten Stelle
    const x = Math.round(20 + 40 * o.wiper);
    return { id: 'pot@' + x, paths: ['M0,20 H20 M60,20 H80 M20,10 H60 V30 H20 Z', `M40,60 V48 H${x} V31 M${x - 5},38 L${x},31 L${+x + 5},38`] };
  }
  const st = (o.sym === 'switch' || o.sym === 'button') ? (o.closed ? 1 : 0) : o.sym === 'switch_spdt' ? (o.pos ? 1 : 0) : 0;
  return st ? SYM_STATE[o.sym + ':' + st] : sym;
}
const symPaths = new Map();                        // Path2D-Cache
function symP2D(sym) {
  let c = symPaths.get(sym.id);
  if (!c) { c = { s: (sym.paths || []).map(d => new Path2D(d)), f: (sym.fills || []).map(d => new Path2D(d)) }; symPaths.set(sym.id, c); }
  return c;
}

/* Eigene Symbole (JSON-Dateien im Ordner „symbols“) hinzufügen – fehlerhafte Einträge werden übersprungen */
function addUserSymbols(list) {
  let ok = 0, bad = [];
  for (const { file, data } of list) {
    const arr = Array.isArray(data) ? data : [data];
    for (const s of arr) {
      try {
        if (!s || typeof s.id !== 'string' || !(s.w > 0) || !(s.h > 0) || !Array.isArray(s.paths)) throw new Error('Pflichtfelder fehlen');
        s.paths.concat(s.fills || []).forEach(d => { if (typeof d !== 'string') throw new Error('Pfad ist kein Text'); new Path2D(d); });
        const sym = { id: 'u_' + s.id, name: s.name || s.id, cat: s.cat || 'Eigene Symbole', w: +s.w, h: +s.h, pins: s.pins || [], paths: s.paths, fills: s.fills || [], texts: s.texts || [] };
        if (SYM[sym.id]) { const i = SYMBOLS.indexOf(SYM[sym.id]); SYMBOLS.splice(i, 1); symPaths.delete(sym.id); }
        SYMBOLS.push(sym); SYM[sym.id] = sym; ok++;
      } catch (e) { bad.push(`${file}: ${e.message}`); }
    }
  }
  return { ok, bad };
}
