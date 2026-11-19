"use strict";
/* ===== Seiten: mehrere unendliche Boards in einem Whiteboard (z. B. eine Seite pro Vorlesungsteil oder PDF-Seite) ===== */
function initPages(data) {
  const src = Array.isArray(data.pages) && data.pages.length ? data.pages : [{ objs: Array.isArray(data.objs) ? data.objs : [], view: data.view }];
  S.pages = src.map(pg => ({ objs: Array.isArray(pg.objs) ? pg.objs : [], view: pg.view || emptyView(), hist: [], fut: [], histSize: 0 }));
  S.page = clamp(data.page || 0, 0, S.pages.length - 1);
  const pg = S.pages[S.page]; S.objs = pg.objs; S.view = pg.view;
}
function syncPage() { const pg = S.pages && S.pages[S.page]; if (!pg) return; pg.objs = S.objs; pg.view = S.view; pg.hist = S.hist; pg.fut = S.fut; pg.histSize = S.histSize; }
function allObjs() { syncPage(); return S.pages ? S.pages.flatMap(pg => pg.objs) : S.objs; }
function pagesJSON() { syncPage(); return S.pages.map(pg => ({ objs: pg.objs, view: pg.view })); }
function gotoPage(i) {
  if (!S.pages || i < 0 || i >= S.pages.length || i === S.page) return;
  if (S.editing) commitEdit(); if (S.wire) wireFinish();
  syncPage(); S.page = i; const pg = S.pages[i];
  S.objs = pg.objs; S.view = pg.view; S.hist = pg.hist || []; S.fut = pg.fut || []; S.histSize = pg.histSize || 0;
  S.sels = []; S.draft = null; markDirty(); presentDirty(); simDirty(); if (window.syncHist) syncHist(); refreshUI(); render(); updateCursor();
}
function addPage(objs = [], view) {
  syncPage(); S.pages.splice(S.page + 1, 0, { objs, view: view || emptyView(), hist: [], fut: [], histSize: 0 });
  S.dirty = true; gotoPage(S.page + 1);
}
async function deletePage() {
  if (S.pages.length < 2) return;
  if (S.objs.length && !await confirmDlg('Seite löschen', `Seite ${S.page + 1} mit allem Inhalt löschen?`, 'Löschen', true)) return;
  const i = S.page; S.pages.splice(i, 1); S.page = -1; gotoPage(Math.min(i, S.pages.length - 1));
}
function movePage(d) {
  const i = S.page, j = i + d; if (j < 0 || j >= S.pages.length) return;
  syncPage(); [S.pages[i], S.pages[j]] = [S.pages[j], S.pages[i]]; S.page = j; markDirty(); refreshUI();
}
function buildPagebar() {
  const pb = $('#pagebar'); if (!pb || !S.pages) return;
  const n = S.pages.length, i = S.page;
  pb.replaceChildren(
    h('button', { class: 'tb', title: 'Vorherige Seite (Bild ↑)', disabled: i === 0, onclick: () => gotoPage(i - 1) }, '‹'),
    h('span', { class: 'pg', title: 'Seitenmenü', onclick: e => popupMenu(e.currentTarget, [
      { label: 'Neue Seite danach', run: () => addPage() }, '-',
      ...(n > 1 ? [{ label: 'Seite nach vorne', run: () => movePage(-1) }, { label: 'Seite nach hinten', run: () => movePage(1) }, '-', { label: 'Seite löschen …', run: deletePage }] : [])]) }, `${i + 1} / ${n}`),
    h('button', { class: 'tb', title: 'Nächste Seite (Bild ↓)', disabled: i === n - 1, onclick: () => gotoPage(i + 1) }, '›'),
    h('button', { class: 'tb', title: 'Neue Seite', onclick: () => addPage() }, '＋'));
}
