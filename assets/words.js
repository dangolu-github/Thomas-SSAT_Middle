// Class Words / Vocabulary page. Lists come from the learner service after the central portal sign-in.
// Views: by unit (theme words / question-type words), by theme, by date; `?class=NN` shows one class's words.
// 已掌握 ticks are saved on the server by headword, so the same word is ticked everywhere.
// Copy and Download give the unchecked single words, one per line (扇贝 takes single words only).
(function () {
  'use strict';
  var endpoint = 'https://script.google.com/macros/s/AKfycbzF6aQZPpbL34Of--5r8zRZGI8Av2e8zTp11D_w820I9fNzLEAyY_YtvzLZ0-OVPFFw/exec';
  var tokenKey = 'thomas-portal-session-v1', returnKey = 'thomas-words-return', viewKey = 'thomas-words-view';
  var app = document.querySelector('[data-words-app]'), intro = document.querySelector('[data-words-intro]');
  var params = new URLSearchParams(location.search), qa = params.get('qa') === '1';
  var S = { units: [], themes: [], lists: [], known: new Set(), view: 'unit', query: '', unchecked: false, classNo: params.get('class') || '', open: new Set(), shown: new Set() };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function token() { var t = ''; ['localStorage', 'sessionStorage'].some(function (k) { try { t = window[k].getItem(tokenKey) || ''; } catch (e) {} return !!t; }); return t; }
  function shortDate(d) { return d.slice(5).replace('-', '/'); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function request(action, p) {
    p = p || {}; p.action = action; p.token = token(); if (qa) p.qa = true;
    var controller = new AbortController(), deadline = setTimeout(function () { controller.abort(); }, 45000);
    return fetch(endpoint, { method: 'POST', redirect: 'follow', signal: controller.signal, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(p) })
      .then(function (r) { if (!r.ok) throw new Error('暂时无法连接，请重试。'); return r.json(); })
      .then(function (r) { if (!r.ok) throw new Error(r.error || '暂时未能完成，请重试。'); return r; })
      .catch(function (e) { if (e.name === 'AbortError') throw new Error('读取时间较长，请稍后重试。'); throw e; })
      .finally(function () { clearTimeout(deadline); });
  }

  var unitById = function (id) { return S.units.filter(function (u) { return u.id === id; })[0] || { id: id, kind: 'theme', title: id, zh: '' }; };
  var unitLabel = function (u) { return (u.kind === 'type' ? '题型词' : '主题词') + ' · ' + u.title + (u.zh ? ' ' + u.zh : ''); };
  var classList = function () { return S.lists.filter(function (l) { return String(l.classNo) === String(Number(S.classNo)); })[0]; };

  // Groups for the current view. Unit and theme views show each headword once and name every class it came from.
  function groups() {
    if (S.classNo) { var one = classList(); return one ? [dateGroup(one)] : []; }
    if (S.view === 'date') return S.lists.slice().sort(function (a, b) { return b.date < a.date ? -1 : 1; }).map(dateGroup);
    var keyOf = S.view === 'unit' ? function (w) { return w.unit; } : function (w) { return w.theme; };
    var order = S.view === 'unit' ? S.units.map(function (u) { return u.id; }) : S.themes.slice();
    var byKey = {}, seen = {};
    S.lists.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (l) {
      l.words.forEach(function (w) {
        var k = keyOf(w), g = byKey[k] || (byKey[k] = {}), item = seen[k + '|' + w.id];
        if (!item) { item = seen[k + '|' + w.id] = { w: w, classes: [] }; g[w.id] = item; }
        if (!item.classes.some(function (c) { return c.classNo === l.classNo; })) item.classes.push({ classNo: l.classNo, date: l.date });
      });
    });
    Object.keys(byKey).forEach(function (k) { if (order.indexOf(k) < 0) order.push(k); });
    return order.filter(function (k) { return byKey[k]; }).map(function (k) {
      var items = Object.keys(byKey[k]).map(function (id) { return byKey[k][id]; });
      var title = S.view === 'unit' ? unitLabel(unitById(k)) : k;
      return { key: S.view + ':' + k, title: title, items: items };
    });
  }
  function dateGroup(l) {
    return { key: 'date:' + l.id, title: 'Class ' + pad(l.classNo) + ' · ' + shortDate(l.date) + ' · ' + l.title, items: l.words.map(function (w) { return { w: w, classes: [] }; }) };
  }
  function matches(item) {
    var w = item.w;
    if (S.unchecked && S.known.has(w.id)) return false;
    return !S.query || [w.word, w.en, w.zh, w.example].join(' ').toLowerCase().indexOf(S.query) >= 0;
  }
  var isPhrase = function (w) { return /\s/.test(w.word.trim()); };

  function row(item) {
    var w = item.w, known = S.known.has(w.id), zhOpen = S.shown.has(w.id);
    var tags = S.view === 'date' || S.classNo ? '<span class="word-tag">' + esc(unitById(w.unit).title) + '</span>'
      : item.classes.map(function (c) { return '<span class="word-tag">Class ' + pad(c.classNo) + ' · ' + shortDate(c.date) + '</span>'; }).join('');
    return '<li class="word-row' + (known ? ' is-known' : '') + '">' +
      '<label class="word-check"><input type="checkbox" data-known="' + esc(w.id) + '"' + (known ? ' checked' : '') + ' aria-label="已掌握 ' + esc(w.word) + '"><span>已掌握</span></label>' +
      '<div class="word-body"><p class="word-head"><strong lang="en">' + esc(w.word) + '</strong>' + (w.pos ? ' <span class="word-pos">' + esc(w.pos) + '</span>' : '') + '</p>' +
      (w.en ? '<p class="word-en" lang="en">' + esc(w.en) + '</p>' : '') +
      (w.zh ? '<p class="word-zh-line"><button type="button" class="word-zh-toggle" data-zh="' + esc(w.id) + '" aria-expanded="' + zhOpen + '">中文</button><span class="word-zh"' + (zhOpen ? '' : ' hidden') + '>' + esc(w.zh) + '</span></p>' : '') +
      (w.example ? '<p class="word-example" lang="en">' + esc(w.example) + '</p>' : '') +
      '<p class="word-tags">' + tags + '</p></div></li>';
  }

  function groupHtml(g) {
    var visible = g.items.filter(matches), checked = g.items.filter(function (i) { return S.known.has(i.w.id); }).length;
    if ((S.query || S.unchecked) && !visible.length) return '';
    var open = S.classNo || S.query || S.open.has(g.key) ? ' open' : '';
    return '<details class="word-group" data-group="' + esc(g.key) + '"' + open + '><summary><span class="word-group-title">' + esc(g.title) + '</span><small>' + g.items.length + ' words' + (checked ? ' · 已掌握 ' + checked : '') + '</small></summary>' +
      '<div class="word-group-body"><div class="word-actions">' +
      '<button class="button button-secondary" type="button" data-checkall="' + esc(g.key) + '"' + (checked === g.items.length ? ' disabled' : '') + '>Check all<small>全部勾选</small></button>' +
      '<button class="button button-secondary" type="button" data-uncheckall="' + esc(g.key) + '"' + (checked ? '' : ' disabled') + '>Uncheck all<small>全部取消</small></button>' +
      '<button class="button button-primary" type="button" data-copy="' + esc(g.key) + '">Copy unchecked words<small>复制没勾选的单词，可粘贴到扇贝</small></button>' +
      '<button class="button button-secondary" type="button" data-download="' + esc(g.key) + '">Download .txt<small>下载没勾选的单词</small></button></div>' +
      '<p class="word-msg" data-msg="' + esc(g.key) + '" role="status" aria-live="polite"></p>' +
      (visible.length ? '<ul class="word-list">' + visible.map(row).join('') + '</ul>' : '<p class="empty-state">这一组的单词都已掌握。</p>') + '</div></details>';
  }

  function listsHtml() {
    var all = groups(), html = all.map(groupHtml).join('');
    if (S.classNo && !all.length) return '<p class="empty-state">这节课没有单词表。</p>';
    return html || '<p class="empty-state">' + (S.query ? '没有找到这个词。' : '没有需要复习的单词了。') + '</p>';
  }
  function meter() {
    var ids = {}, one = S.classNo && classList(); (one ? [one] : S.lists).forEach(function (l) { l.words.forEach(function (w) { ids[w.id] = true; }); });
    var total = Object.keys(ids).length, known = Object.keys(ids).filter(function (id) { return S.known.has(id); }).length;
    return '共 ' + total + ' 个单词 · 已掌握 ' + known + ' 个';
  }

  function render() {
    var one = S.classNo && classList();
    if (one) intro.innerHTML = '<p class="eyebrow">Class ' + pad(one.classNo) + ' · ' + esc(one.date) + '</p><h1>Class Words · ' + esc(one.title) + '</h1><p><a href="../' + esc(one.date) + '/">← 返回 ' + esc(shortDate(one.date).replace('/', '')) + ' 课堂</a> · <a href="./">查看全部单词 →</a></p>';
    var tabs = S.classNo ? '' : '<div class="word-tabs" role="group" aria-label="查看方式">' + [['unit', 'By unit 按单元'], ['theme', 'By theme 按主题'], ['date', 'By date 按日期']].map(function (t) {
      return '<button type="button" class="word-tab" data-view="' + t[0] + '" aria-pressed="' + (S.view === t[0]) + '">' + t[1] + '</button>';
    }).join('') + '</div>';
    app.innerHTML = tabs + '<div class="word-tools"><label class="word-search">搜索<input type="search" data-search placeholder="Search words / 中文 / 例句" value="' + esc(S.query) + '"></label>' +
      '<label class="word-filter"><input type="checkbox" data-unchecked' + (S.unchecked ? ' checked' : '') + '> 只看未掌握</label><p class="word-meter" data-meter>' + meter() + '</p></div>' +
      '<div data-lists>' + listsHtml() + '</div>';
  }
  function redraw() { var box = app.querySelector('[data-lists]'); if (box) box.innerHTML = listsHtml(); var m = app.querySelector('[data-meter]'); if (m) m.textContent = meter(); }
  function say(key, text, kind) { var m = app.querySelector('[data-msg="' + key + '"]'); if (m) { m.textContent = text; m.className = 'word-msg' + (kind ? ' ' + kind : ''); } }
  function groupByKey(key) { return groups().filter(function (g) { return g.key === key; })[0]; }
  function exportWords(g) {
    var out = [], seen = {};
    g.items.forEach(function (i) { var w = i.w; if (!S.known.has(w.id) && !isPhrase(w) && !seen[w.id]) { seen[w.id] = true; out.push(w.word); } });
    return out;
  }
  function exportNote(g, n) {
    var checked = g.items.filter(function (i) { return S.known.has(i.w.id); }).length, phrases = g.items.filter(function (i) { return !S.known.has(i.w.id) && isPhrase(i.w); }).length;
    var skipped = [checked ? '已掌握的 ' + checked + ' 个' : '', phrases ? '词组 ' + phrases + ' 个（扇贝不能加词组）' : ''].filter(Boolean).join('、');
    return '已复制 ' + n + ' 个单词' + (skipped ? '，跳过' + skipped : '') + '，可以粘贴到扇贝。';
  }

  // Updates the page at once, then saves; puts the old ticks back if saving fails.
  function setKnown(ids, known, key) {
    var before = new Set(S.known);
    ids.forEach(function (id) { if (known) S.known.add(id); else S.known.delete(id); });
    redraw();
    return request('wordsSetKnown', { words: ids, known: known }).then(function (r) { S.known = new Set(r.known); redraw(); })
      .catch(function (e) { S.known = before; redraw(); say(key, '没有保存：' + (e.message || '请检查网络后重试。'), 'error'); });
  }

  app.addEventListener('input', function (e) {
    if (!e.target.matches('[data-search]')) return;
    S.query = e.target.value.trim().toLowerCase(); redraw();
  });
  app.addEventListener('toggle', function (e) {
    var d = e.target.closest && e.target.closest('details[data-group]');
    if (!d || S.query || S.classNo) return;
    if (d.open) S.open.add(d.dataset.group); else S.open.delete(d.dataset.group);
  }, true);
  app.addEventListener('change', function (e) {
    if (e.target.matches('[data-unchecked]')) { S.unchecked = e.target.checked; redraw(); return; }
    var box = e.target.closest('[data-known]');
    if (box) setKnown([box.dataset.known], box.checked, box.closest('[data-group]').dataset.group);
  });
  app.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.view) { S.view = t.dataset.view; try { localStorage.setItem(viewKey, S.view); } catch (x) {} render(); return; }
    if (t.dataset.zh) { if (S.shown.has(t.dataset.zh)) S.shown.delete(t.dataset.zh); else S.shown.add(t.dataset.zh); var open = S.shown.has(t.dataset.zh); t.setAttribute('aria-expanded', String(open)); t.nextElementSibling.hidden = !open; return; }
    var key = t.dataset.checkall || t.dataset.uncheckall || t.dataset.copy || t.dataset.download; if (!key) return;
    var g = groupByKey(key); if (!g) return;
    if (t.dataset.checkall || t.dataset.uncheckall) {
      var on = Boolean(t.dataset.checkall), ids = [];
      g.items.forEach(function (i) { if (S.known.has(i.w.id) !== on && ids.indexOf(i.w.id) < 0) ids.push(i.w.id); });
      if (ids.length) setKnown(ids, on, key);
      return;
    }
    var words = exportWords(g);
    if (!words.length) { say(key, '没有要导出的单词（都已掌握）。'); return; }
    if (t.dataset.copy) {
      navigator.clipboard.writeText(words.join('\n')).then(function () { say(key, exportNote(g, words.length), 'success'); })
        .catch(function () { say(key, '这里不能复制，请用 Download .txt。', 'error'); });
    } else {
      var link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([words.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' }));
      link.download = 'thomas-words-' + key.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() + '.txt';
      document.body.append(link); link.click(); link.remove();
      setTimeout(function () { URL.revokeObjectURL(link.href); }, 2000);
      say(key, '已下载 ' + words.length + ' 个单词。', 'success');
    }
  });
  window.addEventListener('beforeprint', function () { app.querySelectorAll('details.word-group').forEach(function (d) { d.open = true; }); app.querySelectorAll('.word-zh').forEach(function (z) { z.hidden = false; }); });

  function start() {
    if (document.body.dataset.access !== 'granted') {
      // The sign-in returns to the page path only; keep ?class= for the way back.
      try { if (location.search) sessionStorage.setItem(returnKey, location.search); } catch (e) {}
      return;
    }
    try { var back = sessionStorage.getItem(returnKey); sessionStorage.removeItem(returnKey); if (back && !location.search) { history.replaceState(null, '', location.pathname + back); params = new URLSearchParams(back); S.classNo = params.get('class') || ''; qa = params.get('qa') === '1'; } } catch (e) {}
    try { var v = localStorage.getItem(viewKey); if (['unit', 'theme', 'date'].indexOf(v) >= 0) S.view = v; } catch (e) {}
    request('wordsList').then(function (r) {
      S.units = r.units; S.themes = r.themes; S.lists = r.lists; S.known = new Set(r.known);
      if (S.classNo) document.title = 'Class ' + pad(S.classNo) + ' Words | Thomas SSAT';
      render();
    }).catch(function (e) {
      app.innerHTML = '<p class="empty-state">' + esc(e.message || '暂时无法读取单词。') + ' <a href="' + endpoint + '?view=portal-login&amp;next=words%2F">重新进入学习空间</a></p>';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
