"use strict";
/* ===== Fertige Schaltungen ===== */
function circuitBuilder() {
  const items = [], inst = {};
  const ln = (a, b) => items.push({ type: 'line', x1: a[0], y1: a[1], x2: b[0], y2: b[1], c: '@ink', w: 2.5, ls: 'solid' });
  const api = {
    items,
    // Bauteil mit Mittelpunkt (x,y) und Drehung in Grad
    add(key, id, x, y, rot = 0) {
      const s = SYM[id], o = { type: 'symbol', sym: id, x: x - s.w / 2, y: y - s.h / 2, w: s.w, h: s.h, rot: rad(rot), c: '@ink', sw: 2.5, ls: 'solid' };
      items.push(o); inst[key] = o; return o;
    },
    // Bauteil, dessen Anschlüsse genau auf a und b liegen (Breite wird angepasst)
    between(key, id, a, b) {
      const s = SYM[id], d = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const o = { type: 'symbol', sym: id, x: (a[0] + b[0]) / 2 - d / 2, y: (a[1] + b[1]) / 2 - s.h / 2, w: d, h: s.h, rot: ang, c: '@ink', sw: 2.5, ls: 'solid' };
      items.push(o); inst[key] = o; return o;
    },
    pin: (key, i) => pinWorld(inst[key], i),
    // Leitung durch mehrere Punkte; schräge Stücke bekommen einen Knick (erst waagerecht, dann senkrecht)
    wire(...pts) {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        if (a[0] !== b[0] && a[1] !== b[1]) { const m = [b[0], a[1]]; ln(a, m); ln(m, b); } else ln(a, b);
      }
    },
    dot(p) { api.add('dot' + items.length, 'junction', p[0], p[1]); },
    term(p) { api.add('term' + items.length, 'terminal', p[0], p[1]); },
    text(x, y, t, size = 18) { const o = { type: 'text', x, y, w: 10, h: 10, rot: 0, text: t, c: '@ink', size }; measureTextObj(o); o.x = x - o.w / 2; o.y = y - o.h / 2; items.push(o); }
  };
  return api;
}

function buildTemplates() {
  const T = [];
  const mk = (name, desc, fn) => { const b = circuitBuilder(); fn(b); T.push({ id: 'b_' + T.length, name, desc, items: b.items }); };
  const gnd = (b, x, y) => b.add('g' + b.items.length, 'ground', x, y + 20);          // Erdung, Anschluss oben bei (x,y)

  mk('Spannungsteiler', 'Zwei Widerstände teilen die Spannung U₀ in U₂.', b => {
    b.add('V', 'vdc', 0, 0); b.add('R1', 'resistor', 80, -40); b.add('R2', 'resistor', 120, 20, 90);
    b.wire(b.pin('V', 0), b.pin('R1', 0)); b.wire(b.pin('R1', 1), b.pin('R2', 0));
    b.dot([120, -40]); b.term([200, -40]); b.wire([120, -40], [200, -40]);
    b.wire(b.pin('V', 1), [0, 80], [120, 80]); b.wire(b.pin('R2', 1), [120, 80]); b.dot([120, 80]); gnd(b, 120, 80);
    b.text(-48, 0, 'U₀'); b.text(80, -72, 'R₁'); b.text(158, 20, 'R₂'); b.text(226, -40, 'U₂');
  });

  const rcFilter = (hp) => b => {
    b.add('V', 'vac', 0, 0);
    if (hp) { b.add('C', 'capacitor', 100, -40); b.add('R', 'resistor', 140, 20, 90); b.wire(b.pin('V', 0), b.pin('C', 0)); b.wire(b.pin('C', 1), b.pin('R', 0)); }
    else { b.add('R', 'resistor', 100, -40); b.add('C', 'capacitor', 140, 20, 90); b.wire(b.pin('V', 0), b.pin('R', 0)); b.wire(b.pin('R', 1), b.pin('C', 0)); }
    b.dot([140, -40]); b.wire([140, -40], [220, -40]); b.term([220, -40]);
    b.wire(b.pin('V', 1), [0, 80], [220, 80]); b.wire(hp ? b.pin('R', 1) : b.pin('C', 1), [140, 80]); b.dot([140, 80]); b.term([220, 80]); gnd(b, 140, 80);
    b.text(-48, 0, 'Uₑ'); b.text(100, -72, hp ? 'C' : 'R'); b.text(180, 20, hp ? 'R' : 'C'); b.text(252, 20, 'Uₐ');
  };
  mk('RC-Tiefpass', 'Passive Filterschaltung 1. Ordnung, Grenzfrequenz f = 1/(2πRC).', rcFilter(false));
  mk('RC-Hochpass', 'Passive Filterschaltung 1. Ordnung, Grenzfrequenz f = 1/(2πRC).', rcFilter(true));

  mk('RLC-Reihenschwingkreis', 'Reihenschaltung aus R, L und C an einer Wechselspannungsquelle.', b => {
    b.add('V', 'vac', 0, 0); b.add('R', 'resistor', 80, -80); b.add('L', 'inductor', 200, -80); b.add('C', 'capacitor', 280, 0, 90);
    b.wire(b.pin('V', 0), [0, -80], b.pin('R', 0)); b.wire(b.pin('R', 1), b.pin('L', 0)); b.wire(b.pin('L', 1), [280, -80], b.pin('C', 0));
    b.wire(b.pin('C', 1), [280, 80], [0, 80], b.pin('V', 1));
    b.text(80, -112, 'R'); b.text(200, -112, 'L'); b.text(322, 0, 'C'); b.text(-40, 0, 'u(t)');
  });

  const inverting = (name, desc, inSym, fbSym, inL, fbL) => mk(name, desc, b => {
    b.add('A', 'opamp', 160, 0); b.add('Rin', inSym, 20, -20); b.add('Rf', fbSym, 160, -80);
    b.term([-60, -20]); b.wire([-60, -20], b.pin('Rin', 0)); b.wire(b.pin('Rin', 1), b.pin('A', 0));
    b.dot([80, -20]); b.wire([80, -20], [80, -80], b.pin('Rf', 0));
    b.wire(b.pin('A', 2), [240, 0]); b.dot([240, 0]); b.wire([240, 0], [240, -80], b.pin('Rf', 1)); b.wire([240, 0], [300, 0]); b.term([300, 0]);
    b.wire(b.pin('A', 1), [80, 20], [80, 60]); gnd(b, 80, 60);
    b.text(20, -52, inL); b.text(160, -112, fbL); b.text(-60, -48, 'Uₑ'); b.text(300, -30, 'Uₐ');
  });
  inverting('Invertierender Verstärker', 'Verstärkung v = −R₂/R₁.', 'resistor', 'resistor', 'R₁', 'R₂');
  inverting('Integrierer (Op-Amp)', 'Ausgang ist das Integral der Eingangsspannung.', 'resistor', 'capacitor', 'R', 'C');
  inverting('Differenzierer (Op-Amp)', 'Ausgang ist die Ableitung der Eingangsspannung.', 'capacitor', 'resistor', 'C', 'R');

  mk('Nichtinvertierender Verstärker', 'Verstärkung v = 1 + R₂/R₁.', b => {
    b.add('A', 'opamp2', 160, 0); b.add('Rf', 'resistor', 160, 100); b.add('R1', 'resistor', 20, 100, 90);
    b.term([-60, -20]); b.wire([-60, -20], b.pin('A', 0));
    b.wire(b.pin('A', 2), [240, 0]); b.dot([240, 0]); b.wire([240, 0], [240, 100], b.pin('Rf', 1)); b.wire([240, 0], [300, 0]); b.term([300, 0]);
    b.wire(b.pin('A', 1), [60, 20], [60, 100], b.pin('Rf', 0)); b.dot([60, 60]); b.wire([60, 60], [20, 60]); b.wire([20, 60], b.pin('R1', 0));
    b.wire(b.pin('R1', 1), [20, 160]); gnd(b, 20, 160);
    b.text(160, 132, 'R₂'); b.text(-14, 100, 'R₁'); b.text(-60, -48, 'Uₑ'); b.text(300, -30, 'Uₐ');
  });

  mk('Einweggleichrichter mit Glättung', 'Eine Diode lässt nur eine Halbwelle durch, C glättet.', b => {
    b.add('V', 'vac', 0, 0); b.add('D', 'diode', 100, -40); b.add('R', 'resistor', 180, 20, 90); b.add('C', 'cap_pol', 260, 20, 90);
    b.wire(b.pin('V', 0), b.pin('D', 0)); b.wire(b.pin('D', 1), [180, -40]); b.dot([180, -40]); b.wire([180, -40], b.pin('R', 0)); b.wire([180, -40], [260, -40], b.pin('C', 0));
    b.wire(b.pin('V', 1), [0, 80], [260, 80]); b.wire(b.pin('R', 1), [180, 80]); b.dot([180, 80]); b.wire(b.pin('C', 1), [260, 80]);
    b.text(100, -72, 'D'); b.text(216, 20, 'R'); b.text(300, 20, 'C'); b.text(-48, 0, 'u(t)');
  });

  mk('Brückengleichrichter (Graetz)', 'Vier Dioden richten beide Halbwellen gleich.', b => {
    const L = [0, 0], Tp = [56.57, -56.57], Rr = [113.14, 0], Bt = [56.57, 56.57];
    b.between('D1', 'diode', L, Tp); b.between('D2', 'diode', Rr, Tp); b.between('D3', 'diode', Bt, L); b.between('D4', 'diode', Bt, Rr);
    b.wire(L, [-40, 0]); b.term([-40, 0]); b.wire(Rr, [153.14, 0]); b.term([153.14, 0]);
    b.add('R', 'resistor', 220, 0, 90); b.add('C', 'cap_pol', 300, 0, 90);
    b.wire(Tp, [220, -56.57], b.pin('R', 0)); b.wire(Bt, [220, 56.57], b.pin('R', 1));
    b.dot([220, -56.57]); b.dot([220, 56.57]); b.wire([220, -56.57], [300, -56.57], b.pin('C', 0)); b.wire([220, 56.57], [300, 56.57], b.pin('C', 1));
    b.text(-52, -24, '~'); b.text(170, -24, '~'); b.text(258, 0, 'R'); b.text(340, 0, 'C');
  });

  mk('Z-Dioden-Stabilisierung', 'Die Z-Diode hält die Ausgangsspannung konstant.', b => {
    b.add('R', 'resistor', 40, -40); b.add('Z', 'zener', 140, 20, -90);
    b.term([-60, -40]); b.wire([-60, -40], b.pin('R', 0)); b.wire(b.pin('R', 1), [140, -40]); b.dot([140, -40]); b.wire([140, -40], b.pin('Z', 1));
    b.wire([140, -40], [220, -40]); b.term([220, -40]); b.wire(b.pin('Z', 0), [140, 80]); gnd(b, 140, 80);
    b.wire([-60, 80], [220, 80]); b.term([-60, 80]); b.term([220, 80]); b.dot([140, 80]);
    b.text(40, -72, 'Vorwiderstand'); b.text(-60, -70, 'Uₑ'); b.text(250, 20, 'Uₐ');
  });

  mk('LED mit Vorwiderstand', 'R = (U₀ − U_LED) / I_LED.', b => {
    b.add('V', 'vdc', 0, 0); b.add('R', 'resistor', 100, -40); b.add('D', 'led', 145, 20, 90);
    b.wire(b.pin('V', 0), b.pin('R', 0)); b.wire(b.pin('R', 1), b.pin('D', 0)); b.wire(b.pin('D', 1), [140, 80], [0, 80], b.pin('V', 1));
    b.text(100, -72, 'R'); b.text(-48, 0, 'U₀'); b.text(190, 20, 'LED');
  });

  mk('Emitterschaltung (NPN)', 'Verstärkerstufe mit Basisspannungsteiler und Emitterwiderstand.', b => {
    b.add('Vcc', 'vcc', 50, -145); b.wire([0, -120], [80, -120]); b.dot([50, -120]);
    b.add('R1', 'resistor', 0, -60, 90); b.add('R2', 'resistor', 0, 60, 90); b.add('Q', 'npn', 65, 0);
    b.add('Rc', 'resistor', 80, -80, 90); b.add('Re', 'resistor', 80, 80, 90);
    b.wire([0, -120], b.pin('R1', 0)); b.wire(b.pin('R1', 1), b.pin('R2', 0)); b.dot([0, 0]); b.wire([0, 0], b.pin('Q', 0));
    b.wire([80, -120], b.pin('Rc', 0)); b.wire(b.pin('R2', 1), [0, 140], [80, 140]); b.wire(b.pin('Re', 1), [80, 140]); gnd(b, 80, 140); b.dot([80, 140]);
    b.add('Cin', 'capacitor', -60, 0); b.term([-140, 0]); b.wire([-140, 0], b.pin('Cin', 0)); b.wire(b.pin('Cin', 1), [0, 0]);
    b.dot([80, -40]); b.add('Cout', 'capacitor', 200, -40); b.wire([80, -40], b.pin('Cout', 0)); b.wire(b.pin('Cout', 1), [280, -40]); b.term([280, -40]);
    b.text(-30, -60, 'R₁'); b.text(-30, 60, 'R₂'); b.text(112, -80, '$R_C$'); b.text(112, 80, '$R_E$'); b.text(-60, -26, 'C₁'); b.text(200, -72, 'C₂');
  });

  mk('MOSFET als Schalter', 'N-MOSFET schaltet eine Last gegen Erde.', b => {
    b.add('Vcc', 'vcc', 100, -120); b.add('R', 'resistor', 100, -40, 90); b.add('Q', 'nmos', 85, 40);
    b.wire(b.pin('Vcc', 0), b.pin('R', 0)); b.dot([100, 0]); b.wire([100, 0], [180, 0]); b.term([180, 0]);
    b.term([0, 40]); b.wire([0, 40], b.pin('Q', 0)); b.wire(b.pin('Q', 2), [100, 100]); gnd(b, 100, 100);
    b.text(140, -40, 'Last'); b.text(0, 10, 'Uₛₑₜ'); b.text(210, 0, 'Uₐ');
  });

  mk('Halbaddierer', 'Summe S = A ⊕ B, Übertrag C = A · B.', b => {
    b.add('X', 'xor', 200, -60); b.add('N', 'and', 200, 60);
    b.term([50, -70]); b.wire([50, -70], b.pin('X', 0)); b.dot([100, -70]); b.wire([100, -70], [100, 50], b.pin('N', 0));
    b.term([50, 70]); b.wire([50, 70], b.pin('N', 1)); b.dot([80, 70]); b.wire([80, 70], [80, -50], b.pin('X', 1));
    b.wire(b.pin('X', 2), [290, -60]); b.term([290, -60]); b.wire(b.pin('N', 2), [290, 60]); b.term([290, 60]);
    b.text(30, -70, 'A'); b.text(30, 70, 'B'); b.text(315, -60, 'S'); b.text(318, 60, 'C');
  });
  mk('Spannungsfolger (Impedanzwandler)', 'Verstärkung 1, sehr hoher Eingangs-, kleiner Ausgangswiderstand.', b => {
    b.add('A', 'opamp2', 160, 0);
    b.term([-20, -20]); b.wire([-20, -20], b.pin('A', 0));
    b.wire(b.pin('A', 2), [240, 0]); b.dot([240, 0]); b.wire([240, 0], [300, 0]); b.term([300, 0]);
    b.wire([240, 0], [240, 60], [80, 60], [80, 20], b.pin('A', 1));
    b.text(-20, -48, 'Uₑ'); b.text(300, -30, 'Uₐ');
  });

  mk('Summierer (Addierer)', 'Uₐ = −R_f · (U₁/R₁ + U₂/R₂).', b => {
    b.add('A', 'opamp', 160, 0); b.add('R1', 'resistor', 20, -20); b.add('R2', 'resistor', 20, 40); b.add('Rf', 'resistor', 160, -80);
    b.term([-60, -20]); b.wire([-60, -20], b.pin('R1', 0)); b.term([-60, 40]); b.wire([-60, 40], b.pin('R2', 0));
    b.wire(b.pin('R1', 1), b.pin('A', 0)); b.dot([80, -20]); b.wire(b.pin('R2', 1), [80, 40], [80, -20]);
    b.wire([80, -20], [80, -80], b.pin('Rf', 0));
    b.wire(b.pin('A', 2), [240, 0]); b.dot([240, 0]); b.wire([240, 0], [240, -80], b.pin('Rf', 1)); b.wire([240, 0], [300, 0]); b.term([300, 0]);
    b.wire(b.pin('A', 1), [90, 20], [90, 80]); gnd(b, 90, 80);
    b.text(20, -52, 'R₁'); b.text(20, 72, 'R₂'); b.text(160, -112, '$R_f$'); b.text(-60, -48, 'U₁'); b.text(-60, 68, 'U₂'); b.text(300, -30, 'Uₐ');
  });

  mk('Subtrahierer (Differenzverstärker)', 'Bei R₁ = R₂ und R_f = R₄: Uₐ = R_f/R₁ · (U₂ − U₁).', b => {
    b.add('A', 'opamp', 160, 0); b.add('R1', 'resistor', 20, -20); b.add('R2', 'resistor', 20, 60); b.add('Rf', 'resistor', 160, -80); b.add('R4', 'resistor', 80, 120, 90);
    b.term([-60, -20]); b.wire([-60, -20], b.pin('R1', 0)); b.wire(b.pin('R1', 1), b.pin('A', 0)); b.dot([80, -20]);
    b.wire([80, -20], [80, -80], b.pin('Rf', 0));
    b.wire(b.pin('A', 2), [240, 0]); b.dot([240, 0]); b.wire([240, 0], [240, -80], b.pin('Rf', 1)); b.wire([240, 0], [300, 0]); b.term([300, 0]);
    b.term([-60, 60]); b.wire([-60, 60], b.pin('R2', 0)); b.wire(b.pin('R2', 1), [80, 60]); b.dot([80, 60]); b.wire([80, 60], [80, 20], b.pin('A', 1));
    b.wire([80, 60], b.pin('R4', 0)); gnd(b, 80, 160);
    b.text(20, -52, 'R₁'); b.text(20, 92, 'R₂'); b.text(160, -112, '$R_f$'); b.text(116, 120, 'R₄'); b.text(-60, -48, 'U₁'); b.text(-60, 88, 'U₂'); b.text(300, -30, 'Uₐ');
  });

  mk('Schmitt-Trigger (nicht invertierend)', 'Mitkopplung über R₂ erzeugt eine Hysterese mit zwei Schaltschwellen.', b => {
    b.add('A', 'opamp2', 160, 0); b.add('R1', 'resistor', 20, -20); b.add('R2', 'resistor', 160, -80);
    b.term([-60, -20]); b.wire([-60, -20], b.pin('R1', 0)); b.wire(b.pin('R1', 1), b.pin('A', 0)); b.dot([80, -20]);
    b.wire([80, -20], [80, -80], b.pin('R2', 0));
    b.wire(b.pin('A', 2), [240, 0]); b.dot([240, 0]); b.wire([240, 0], [240, -80], b.pin('R2', 1)); b.wire([240, 0], [300, 0]); b.term([300, 0]);
    b.wire(b.pin('A', 1), [80, 20], [80, 60]); gnd(b, 80, 60);
    b.text(20, -52, 'R₁'); b.text(160, -112, 'R₂'); b.text(-60, -48, 'Uₑ'); b.text(300, -30, 'Uₐ');
  });

  mk('Wheatstone-Brücke', 'Abgeglichen (U_d = 0), wenn R₁/R₂ = R₃/R₄.', b => {
    b.add('V', 'vdc', 0, 0); b.add('R1', 'resistor', 100, -60, 90); b.add('R2', 'resistor', 100, 60, 90); b.add('R3', 'resistor', 260, -60, 90); b.add('R4', 'resistor', 260, 60, 90);
    b.add('M', 'voltmeter', 180, 0);
    b.wire(b.pin('V', 0), [0, -120], [260, -120], b.pin('R3', 0)); b.dot([100, -120]); b.wire([100, -120], b.pin('R1', 0));
    b.wire(b.pin('R1', 1), b.pin('R2', 0)); b.wire(b.pin('R3', 1), b.pin('R4', 0)); b.dot([100, 0]); b.dot([260, 0]);
    b.wire([100, 0], b.pin('M', 0)); b.wire(b.pin('M', 1), [260, 0]);
    b.wire(b.pin('R4', 1), [260, 120], [0, 120], b.pin('V', 1)); b.wire(b.pin('R2', 1), [100, 120]); b.dot([100, 120]);
    b.text(-40, 0, 'U₀'); b.text(66, -60, 'R₁'); b.text(66, 60, 'R₂'); b.text(296, -60, 'R₃'); b.text(296, 60, 'R₄'); b.text(180, -32, '$U_d$');
  });

  const rlFilter = (hp) => b => {
    b.add('V', 'vac', 0, 0);
    if (hp) { b.add('R', 'resistor', 100, -40); b.add('L', 'inductor', 140, 20, 90); b.wire(b.pin('V', 0), b.pin('R', 0)); b.wire(b.pin('R', 1), b.pin('L', 0)); }
    else { b.add('L', 'inductor', 100, -40); b.add('R', 'resistor', 140, 20, 90); b.wire(b.pin('V', 0), b.pin('L', 0)); b.wire(b.pin('L', 1), b.pin('R', 0)); }
    b.dot([140, -40]); b.wire([140, -40], [220, -40]); b.term([220, -40]);
    b.wire(b.pin('V', 1), [0, 80], [220, 80]); b.wire(hp ? b.pin('L', 1) : b.pin('R', 1), [140, 80]); b.dot([140, 80]); b.term([220, 80]); gnd(b, 140, 80);
    b.text(-48, 0, 'Uₑ'); b.text(100, -72, hp ? 'R' : 'L'); b.text(180, 20, hp ? 'L' : 'R'); b.text(252, 20, 'Uₐ');
  };
  mk('RL-Tiefpass', 'Grenzfrequenz f = R/(2πL).', rlFilter(false));
  mk('RL-Hochpass', 'Grenzfrequenz f = R/(2πL).', rlFilter(true));

  mk('LC-Parallelschwingkreis', 'Resonanzfrequenz f₀ = 1/(2π√(LC)).', b => {
    b.add('V', 'vac', 0, 0); b.add('L', 'inductor', 120, 0, 90); b.add('C', 'capacitor', 220, 0, 90);
    b.wire(b.pin('V', 0), [0, -80], [220, -80], b.pin('C', 0)); b.dot([120, -80]); b.wire([120, -80], b.pin('L', 0));
    b.wire(b.pin('V', 1), [0, 80], [220, 80], b.pin('C', 1)); b.dot([120, 80]); b.wire(b.pin('L', 1), [120, 80]);
    b.text(-40, 0, 'u(t)'); b.text(84, 0, 'L'); b.text(256, 0, 'C');
  });

  mk('Strom- und Spannungsmessung', 'Amperemeter in Reihe, Voltmeter parallel zum Verbraucher.', b => {
    b.add('V', 'vdc', 0, 0); b.add('I', 'ammeter', 80, -80); b.add('R', 'resistor', 200, 0, 90); b.add('U', 'voltmeter', 300, 0, 90);
    b.wire(b.pin('V', 0), [0, -80], b.pin('I', 0)); b.wire(b.pin('I', 1), [300, -80], b.pin('U', 0)); b.dot([200, -80]); b.wire([200, -80], b.pin('R', 0));
    b.wire(b.pin('U', 1), [300, 80], [0, 80], b.pin('V', 1)); b.wire(b.pin('R', 1), [200, 80]); b.dot([200, 80]);
    b.text(-40, 0, 'U₀'); b.text(164, 0, 'R');
  });

  mk('Kollektorschaltung (Emitterfolger)', 'Spannungsverstärkung ≈ 1, Uₐ ≈ Uₑ − 0,7 V.', b => {
    b.add('Q', 'npn', 65, 0); b.add('Vcc', 'vcc', 80, -125); b.add('Re', 'resistor', 80, 100, 90);
    b.wire(b.pin('Q', 1), b.pin('Vcc', 0)); b.wire(b.pin('Q', 2), b.pin('Re', 0)); b.dot([80, 50]); b.wire([80, 50], [200, 50]); b.term([200, 50]);
    gnd(b, 80, 140); b.term([-60, 0]); b.wire([-60, 0], b.pin('Q', 0));
    b.text(-60, -28, 'Uₑ'); b.text(200, 22, 'Uₐ'); b.text(116, 100, '$R_E$');
  });

  mk('Stromspiegel (NPN)', 'T₂ spiegelt den Referenzstrom: I_aus ≈ I_ref.', b => {
    b.add('Q1', 'npn', 65, 0); b.add('Q2', 'npn', 165, 0); b.add('R', 'resistor', 80, -120, 90); b.add('Vcc', 'vcc', 80, -185);
    b.wire(b.pin('Vcc', 0), b.pin('R', 0)); b.wire(b.pin('R', 1), b.pin('Q1', 1)); b.dot([80, -60]);
    b.wire(b.pin('Q1', 0), [40, -60], [80, -60]); b.wire(b.pin('Q2', 0), [120, 0], [120, -60], [80, -60]);
    b.wire(b.pin('Q2', 1), [180, -110]); b.term([180, -110]);
    b.wire(b.pin('Q1', 2), [80, 80], [180, 80], b.pin('Q2', 2)); b.dot([130, 80]); gnd(b, 130, 80);
    b.text(20, -100, '$I_\\text{ref}$'); b.text(220, -110, '$I_\\text{aus}$'); b.text(105, 30, 'T₁'); b.text(205, 30, 'T₂');
  });

  return T;
}

/* ---------- Benutzer-Schaltungen ---------- */
function circuitFromSelection(name) {
  const list = S.sels.map(cloneObj), b = allBounds(list); if (!b) return null;
  const ox = Math.round(b[0] / GRID) * GRID, oy = Math.round(b[1] / GRID) * GRID;
  list.forEach(o => moveObj(o, -ox, -oy));
  return { name, desc: 'Eigene Schaltung', items: list };
}
function viewCenter() { return { x: (innerWidth / 2 - S.view.x) / S.view.z, y: (innerHeight / 2 - S.view.y) / S.view.z }; }
function placeCircuit(items) {
  const pre = snapshot(), list = items.map(cloneObj), b = allBounds(list), c = viewCenter();
  const dx = Math.round((c.x - (b[0] + b[2]) / 2) / GRID) * GRID, dy = Math.round((c.y - (b[1] + b[3]) / 2) / GRID) * GRID;
  list.forEach(o => { moveObj(o, dx, dy); S.objs.push(o); });
  setTool('select'); S.sels = list; record(pre); refreshUI();
}
function drawCircuitThumb(cv, items) {
  const b = allBounds(items); if (!b) return;
  const w = cv.width, h = cv.height, pad = 8, s = Math.min((w - 2 * pad) / (b[2] - b[0]), (h - 2 * pad) / (b[3] - b[1]));
  const c = cv.getContext('2d'); RT.dark = false;
  c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#fff'; c.fillRect(0, 0, w, h);
  c.setTransform(s, 0, 0, s, pad - b[0] * s + (w - 2 * pad - (b[2] - b[0]) * s) / 2, pad - b[1] * s + (h - 2 * pad - (b[3] - b[1]) * s) / 2);
  const keep = S.editing; S.editing = null; items.forEach(o => drawObj(c, o)); S.editing = keep;
}
function drawSymbolThumb(cv, sym) {
  const w = cv.width, h = cv.height, s = Math.min((w - 12) / sym.w, (h - 12) / sym.h), c = cv.getContext('2d');
  RT.dark = themeDark(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, h);
  c.setTransform(s, 0, 0, s, (w - sym.w * s) / 2, (h - sym.h * s) / 2);
  drawBox(c, { type: 'symbol', sym: sym.id, w: sym.w, h: sym.h, c: '@ink', sw: 2.2 / s * 1.2 });
}
