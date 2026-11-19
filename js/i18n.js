"use strict";
/* ===== Sprachen: Deutsch (Quelltext), English, Français, 中文, Русский, हिन्दी, Latina =====
   Die Oberfläche ist auf Deutsch geschrieben. Für andere Sprachen ersetzt ein Beobachter alle sichtbaren
   Texte (auch Tooltips und Platzhalter) anhand des Wörterbuchs I18N_TSV (js/lang/dict.js); dynamische Texte
   mit Zahlen oder Namen laufen über I18N_PATTERNS. Die Hilfe gibt es je Sprache vollständig (js/lang/help-*.js). */

const LANGS = [['de', 'Deutsch'], ['en', 'English'], ['fr', 'Français'], ['zh', '中文'], ['ru', 'Русский'], ['hi', 'हिन्दी'], ['la', 'Latina']];
const LANG = (() => { try { const l = localStorage.getItem('scriptoria-lang'); return LANGS.some(([k]) => k === l) ? l : 'de'; } catch (e) { return 'de'; } })();
const LOCALE = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR', zh: 'zh-CN', ru: 'ru-RU', hi: 'hi-IN', la: 'la' }[LANG];
const HELP_L10N = {};                                     // wird von js/lang/help-*.js gefüllt
let I18N = null;                                          // Map: deutscher Text → Übersetzung

function i18nLoad() {
  if (I18N || LANG === 'de' || typeof I18N_TSV === 'undefined') return I18N;
  const col = ['en', 'fr', 'zh', 'ru', 'hi', 'la'].indexOf(LANG) + 1; I18N = new Map();
  for (const line of I18N_TSV.split('\n')) { const p = line.split('§'); if (p.length > col && p[0] && p[col]) I18N.set(p[0], p[col]); }
  return I18N;
}
/* Übersetzen: exakter Treffer, sonst Muster (Teile mit Namen werden ihrerseits übersetzt) */
function tr(s) {
  if (LANG === 'de' || s == null) return s;
  const m = i18nLoad(); if (!m) return s;
  const str = String(s), t = str.trim(); if (!t) return str;
  let r = m.get(t);
  if (r == null && typeof I18N_PATTERNS !== 'undefined') {
    for (const [re, out] of I18N_PATTERNS) {
      const g = re.exec(t); if (!g) continue;
      const o = out[LANG]; if (o == null) continue;
      r = o.replace(/\$(\d)/g, (_, i) => { const v = g[+i] ?? ''; return m.get(v.trim()) ?? v; }); break;
    }
  }
  if (r == null) return str;
  const lead = str.match(/^\s*/)[0], trail = str.match(/\s*$/)[0];
  return lead + r + trail;
}
/* Beobachter: übersetzt neue und geänderte Texte im ganzen Dokument */
function i18nNode(n) {
  if (n.nodeType === 3) {
    const p = n.parentNode; if (!p || p.nodeName === 'SCRIPT' || p.nodeName === 'STYLE' || p.nodeName === 'CODE' || p.nodeName === 'PRE' || p.nodeName === 'TEXTAREA') return;
    if (p.closest && p.closest('.help')) return;
    const v = n.nodeValue; if (!v || !/[A-Za-zÄÖÜäöüß]/.test(v)) return;
    const t = tr(v); if (t !== v) n.nodeValue = t;
  } else if (n.nodeType === 1) {
    for (const a of ['title', 'placeholder', 'aria-label']) { const v = n.getAttribute(a); if (v) { const t = tr(v); if (t !== v) n.setAttribute(a, t); } }
    if (n.nodeName === 'TEXTAREA' || n.nodeName === 'SCRIPT' || n.nodeName === 'CODE' || n.nodeName === 'PRE') return;
    if (n.classList && n.classList.contains('help')) return;
    for (let c = n.firstChild; c; c = c.nextSibling) i18nNode(c);
  }
}
function i18nStart() {
  if (LANG === 'de') return;
  document.documentElement.lang = LANG === 'zh' ? 'zh-Hans' : LANG;
  i18nLoad(); i18nNode(document.body);
  new MutationObserver(list => {
    for (const r of list) {
      if (r.type === 'childList') r.addedNodes.forEach(i18nNode);
      else if (r.type === 'characterData') i18nNode(r.target);
      else if (r.type === 'attributes') i18nNode(r.target.nodeType === 1 ? Object.assign(r.target, {}) : r.target);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title', 'placeholder', 'aria-label'] });
}
function setLanguage(l) {
  try { localStorage.setItem('scriptoria-lang', l); } catch (e) { }
  if (typeof changeSetting === 'function') changeSetting('lang', l);
  setTimeout(() => location.reload(), 250);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', i18nStart); else i18nStart();
