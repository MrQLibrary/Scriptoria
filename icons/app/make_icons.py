import math, os, subprocess, sys
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

def spiral(cx, cy, r0, r1, turns, start=-90):
    pts=[]; n=int(60*turns)
    for i in range(n+1):
        t=i/n; a=math.radians(start+360*turns*t); r=r0+(r1-r0)*t
        pts.append(f"{cx+r*math.cos(a):.1f} {cy+r*math.sin(a):.1f}")
    return "M "+" L ".join(pts)

def quill(tx, ty, ang, L=330, ink='#000', bg='#fff', sw=14):
    # Federkiel, Spitze bei (tx,ty), zeigt nach unten, um ang Grad gedreht
    s = L/360
    vane = f"M 0 {-70*s} C {38*s} {-130*s}, {56*s} {-250*s}, {18*s} {-360*s} C {-24*s} {-292*s}, {-44*s} {-172*s}, 0 {-70*s} Z"
    barbs = " ".join(f"M {4*s} {-y*s} L {(30-abs(y-200)/9)*s} {-(y+26)*s}" for y in (130,190,250)) + " " + \
            " ".join(f"M {-1*s} {-y*s} L {-(26-abs(y-190)/9)*s} {-(y+22)*s}" for y in (150,215))
    return f'''<g transform="translate({tx} {ty}) rotate({ang})" stroke="{ink}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">
  <path d="{vane}" fill="{bg}"/>
  <path d="M {-10*s} {-74*s} L 0 0 L {10*s} {-74*s} Z" fill="{bg}"/>
  <path d="M 0 {-12*s} L 0 {-44*s} M 0 {-74*s} L {6*s} {-330*s} {barbs}" fill="none" stroke-width="{sw*0.75}"/>
</g>'''

def tile(bg, body, ink, maskable=False):
    inner = body if not maskable else f'<g transform="translate(256 256) scale(.8) translate(-256 -256)">{body}</g>'
    rect = f'<rect width="512" height="512" fill="{bg}"/>' if maskable else f'<rect x="8" y="8" width="496" height="496" rx="112" fill="{bg}"/>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{rect}
<g fill="none" stroke="{ink}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">{inner}</g></svg>'''

I = {}
# 1) Standard: Schriftrolle in S-Form, oben eingerollt, mit Federkiel
bg, ink = '#fbf7ee', '#1f2b4d'
I['scroll'] = (bg, ink, f'''
<path d="M 156 186 C 118 252, 172 318, 112 398 L 352 380 C 400 300, 344 222, 378 154 Z" fill="{bg}"/>
<path d="M 112 398 C 100 414, 104 428, 120 426 L 360 406 C 374 404, 372 388, 352 380" fill="{bg}"/>
<path d="M 150 116 L 380 84 M 150 184 L 380 152"/>
<path d="M 380 84 A 20 34 -8 0 1 380 152" />
<ellipse cx="150" cy="150" rx="22" ry="34" transform="rotate(-8 150 150)" fill="{bg}"/>
<path d="{spiral(150, 150, 20, 4, 1.6, -90)}" stroke-width="10"/>
<g stroke-width="9" opacity=".55"><path d="M 172 226 L 336 208 M 176 262 L 350 243 M 172 298 L 300 284 M 162 334 L 250 324"/></g>
{quill(318, 360, 30, 300, ink, bg, 14)}''')
# 2) Schlichtes Whiteboard mit Stift
bg, ink = '#ffffff', '#1f2b4d'
I['board'] = (bg, ink, f'''
<rect x="84" y="96" width="344" height="236" rx="18"/>
<path d="M 120 362 H 392 M 170 332 L 136 440 M 342 332 L 376 440"/>
<path d="M 130 262 C 160 170, 206 170, 226 238 S 292 300, 318 196" stroke-width="12"/>
<path d="M 128 152 H 236 M 128 184 H 196" stroke-width="10" opacity=".5"/>
<g transform="translate(330 270) rotate(-38)"><rect x="-18" y="-100" width="36" height="150" rx="9" fill="{bg}"/><path d="M -18 -60 H 18"/><path d="M -12 50 L 0 82 L 12 50" fill="{bg}"/></g>''')
# 3) Kreidetafel
bg, ink = '#2e4a3a', '#f1f1e8'
I['chalk'] = (bg, ink, f'''
<rect x="72" y="100" width="368" height="262" rx="14"/>
<path d="M 92 390 H 420"/>
<path d="M 140 320 L 140 170 L 300 320 Z M 140 290 H 170 V 320" stroke-width="12"/>
<circle cx="350" cy="196" r="44" stroke-width="12"/>
<rect x="300" y="372" width="70" height="20" rx="6" stroke-width="10"/>''')
# 4) Papyrusrolle
bg, ink = '#e7d09a', '#5a3a17'
I['papyrus'] = (bg, ink, f'''
<path d="M 138 122 C 200 112, 310 132, 374 120 M 138 392 C 200 402, 310 382, 374 394"/>
<rect x="96" y="104" width="44" height="306" rx="22" fill="{bg}"/><rect x="372" y="104" width="44" height="306" rx="22" fill="{bg}"/>
<path d="M 118 104 V 82 M 118 410 V 432 M 394 104 V 82 M 394 410 V 432"/>
<g stroke-width="11"><path d="M 182 178 H 230 M 252 178 H 330 M 182 228 H 300 M 182 278 H 214 M 236 278 H 330 M 182 328 H 270"/>
<ellipse cx="300" cy="326" rx="12" ry="14"/><path d="M 300 340 V 366 M 286 350 H 314"/></g>''')
# 5) Römische Wachstafel (Diptychon mit Stilus)
bg, ink = '#3b2b1e', '#e6c690'
I['wax'] = (bg, ink, f'''
<rect x="62" y="122" width="186" height="268" rx="12"/><rect x="88" y="148" width="134" height="216" rx="4" stroke-width="10"/>
<rect x="264" y="122" width="186" height="268" rx="12"/><rect x="290" y="148" width="134" height="216" rx="4" stroke-width="10"/>
<path d="M 240 190 Q 256 206 272 190 M 240 322 Q 256 338 272 322" stroke-width="12"/>
<path d="M 108 196 H 196 M 108 236 H 176 M 108 276 H 200 M 108 316 H 160" stroke-width="9"/>
<g transform="translate(372 300) rotate(30)"><path d="M -6 -150 H 6 L 6 90 L 0 120 L -6 90 Z" fill="{bg}"/><path d="M -20 -176 H 20 L 8 -150 H -8 Z" fill="{bg}"/></g>''')
# 6) Archimedes' Sandtafel: Kugel im Zylinder
bg, ink = '#dcc28e', '#6b4a22'
I['sand'] = (bg, ink, f'''
<rect x="62" y="62" width="388" height="388" rx="40" stroke-width="14"/>
<ellipse cx="256" cy="150" rx="104" ry="26"/>
<path d="M 152 150 V 360 M 360 150 V 360 M 152 360 A 104 26 0 0 0 360 360"/>
<path d="M 152 360 A 104 26 0 0 1 360 360" stroke-dasharray="14 16" stroke-width="10"/>
<circle cx="256" cy="255" r="104"/>
<ellipse cx="256" cy="255" rx="104" ry="26" stroke-width="10" stroke-dasharray="14 16"/>''')
# 7) Mesopotamische Tontafel mit Keilschrift
bg, ink = '#c9935f', '#4a2810'
def wedge(x, y, rot=0, s=1):
    return f'<g transform="translate({x} {y}) rotate({rot}) scale({s})"><path d="M -16 -14 L 16 0 L -16 14 Z M 16 0 H 52" stroke-width="10"/></g>'
ws = "".join(wedge(x, y, r) for x, y, r in [(160,170,0),(240,170,0),(330,170,90),(170,250,0),(250,250,45),(330,250,0),(160,330,90),(240,330,0),(320,330,0)])
I['clay'] = (bg, ink, f'''
<rect x="94" y="76" width="324" height="360" rx="70"/>
<path d="M 120 210 H 392 M 120 290 H 392" stroke-width="7" opacity=".6"/>{ws}''')
# 8) Schiefertafel mit Griffel
bg, ink = '#3b4245', '#e9ebe7'
I['slate'] = (bg, ink, f'''
<rect x="84" y="110" width="344" height="296" rx="18"/><rect x="118" y="144" width="276" height="228" rx="4" stroke-width="10"/>
<circle cx="256" cy="80" r="16"/><path d="M 256 96 V 110"/>
<path d="M 138 200 H 374 M 138 246 H 374 M 138 292 H 374 M 138 338 H 374" stroke-width="5" opacity=".55"/>
<path d="M 150 240 C 170 196, 190 196, 196 240 C 202 280, 224 280, 236 236" stroke-width="10"/>
<g transform="translate(350 310) rotate(35)"><rect x="-10" y="-120" width="20" height="150" rx="5" fill="{bg}"/><path d="M -10 30 L 0 56 L 10 30"/></g>''')
# 9) Pergament mit Gänsekiel
bg, ink = '#f2e5c4', '#3a2614'
I['parchment'] = (bg, ink, f'''
<path d="M 100 80 H 330 L 392 142 V 432 H 100 Z M 330 80 V 142 H 392"/>
<rect x="132" y="124" width="60" height="60" rx="6" stroke-width="10"/><path d="M 148 170 L 162 138 L 176 170 M 152 160 H 172" stroke-width="8"/>
<path d="M 208 140 H 300 M 208 170 H 290 M 132 214 H 360 M 132 248 H 330 M 132 282 H 356 M 132 316 H 260" stroke-width="9" opacity=".65"/>
{quill(300, 420, 28, 300, ink, bg, 13)}''')

def coil(x0=272, x1=360, y=250, loops=3, d=21):
    r = (x1 - x0 - 2*d) / (2*math.pi*loops) if False else None
    # verkürzte Zykloide: x = a + r*t - d*sin(t), y = yc - d*cos(t); Start/Ende auf der Leitung
    t0, t1 = math.pi/2, math.pi/2 + 2*math.pi*loops
    r = ((x1 - x0) - 0) / (t1 - t0)
    a = x0 - (r*t0 - d*math.sin(t0))
    pts = []
    n = 60*loops
    for i in range(n+1):
        t = t0 + (t1-t0)*i/n
        pts.append(f"{a + r*t - d*math.sin(t):.1f} {y - d*math.cos(t):.1f}")
    return "M 252 250 L " + " L ".join(pts) + " L 384 250"
# 10) Elektrotechnik: Federkiel schreibt eine Schaltung
bg, ink = '#17233f', '#f2c46d'
I['circuit'] = (bg, ink, f'''
<circle cx="214" cy="270" r="112"/>
<path d="M 86 270 H 186 M 186 212 V 328 M 186 238 L 268 184 V 120 M 186 302 L 268 356 V 420"/>
<path d="M 268 356 L 236 352 L 252 326 Z" fill="{ink}" stroke-width="8"/>
<circle cx="86" cy="270" r="13" fill="{bg}"/><circle cx="268" cy="120" r="13" fill="{bg}"/><circle cx="268" cy="420" r="13" fill="{bg}"/>
<g transform="translate(372 300) rotate(30)"><rect x="-19" y="-226" width="38" height="170" rx="10" fill="{bg}"/><path d="M -19 -180 H 19"/><path d="M -14 -56 L 0 -16 L 14 -56 Z" fill="{bg}"/></g>''')

for k, (bg, ink, body) in I.items():
    open(f"{OUT}/{k}.svg", "w").write(tile(bg, body, ink))
    open(f"/tmp/{k}-m.svg", "w").write(tile(bg, body, ink, True))
    for sz in (192, 512):
        subprocess.run(["rsvg-convert", "-w", str(sz), "-h", str(sz), f"{OUT}/{k}.svg", "-o", f"{OUT}/{k}-{sz}.png"], check=True)
    subprocess.run(["rsvg-convert", "-w", "512", "-h", "512", f"/tmp/{k}-m.svg", "-o", f"{OUT}/{k}-maskable-512.png"], check=True)
print(" ".join(I))
