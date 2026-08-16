(function () {
  'use strict';

  var root = document.documentElement;
  var themeKey = 'thomas-ssat-theme';
  var collapseKey = 'thomas-ssat-section-state';
  var accessKey = 'thomas-ssat-access';
  var accessHash = '70369e3c';
  var plannerKey = 'thomas-ssat-weekly-review-plan-v1';
  var plannerSaveIdKey = plannerKey + '-save-id';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  }

  function hashWord(value) {
    var hash = 2166136261;
    for (var index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }

  function setupAccessGate() {
    if (document.body.dataset.access !== 'required') return true;
    if (sessionStorage.getItem(accessKey) === accessHash) {
      document.body.dataset.access = 'granted';
      return true;
    }

    document.body.dataset.access = 'locked';
    var gate = document.createElement('main');
    gate.className = 'access-gate';
    gate.innerHTML = '<form class="access-card" data-access-form>' +
      '<span class="brand-mark" aria-hidden="true">T</span>' +
      '<p class="eyebrow">Thomas SSAT</p>' +
      '<h1>进入 Thomas 的学习空间</h1>' +
      '<p>请输入访问密码。</p>' +
      '<label for="portal-access">访问密码</label>' +
      '<input id="portal-access" name="access" type="password" autocomplete="current-password" required>' +
      '<button class="button button-primary" type="submit">进入学习空间</button>' +
      '<p class="access-error" role="alert" aria-live="polite"></p>' +
      '</form>';
    document.body.prepend(gate);
    var form = gate.querySelector('[data-access-form]');
    var input = form.elements.access;
    var error = gate.querySelector('.access-error');
    input.focus();
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (hashWord(input.value.trim()) !== accessHash) {
        error.textContent = '密码不正确，请再试一次。';
        input.select();
        return;
      }
      sessionStorage.setItem(accessKey, accessHash);
      document.body.dataset.access = 'granted';
      gate.remove();
    });
    return false;
  }

  function preferredTheme() {
    var saved = localStorage.getItem(themeKey);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.textContent = theme === 'dark' ? '浅色' : '深色';
      button.setAttribute('aria-label', theme === 'dark' ? '使用浅色配色' : '使用深色配色');
    });
  }

  function readSectionState() {
    try { return JSON.parse(localStorage.getItem(collapseKey) || '{}'); }
    catch (error) { return {}; }
  }

  function setupTheme() {
    applyTheme(preferredTheme());
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(themeKey, next);
        applyTheme(next);
      });
    });
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var sidebar = document.getElementById('site-navigation');
    if (!button || !sidebar) return;
    button.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? '关闭' : '菜单';
    });
  }

  function setupSections() {
    var state = readSectionState();
    document.querySelectorAll('[data-section-toggle]').forEach(function (button) {
      var id = button.dataset.sectionToggle;
      var body = document.getElementById(id);
      if (!body) return;
      var open = state[id] !== false;
      body.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? '收起' : '展开';
      button.addEventListener('click', function () {
        var nextOpen = button.getAttribute('aria-expanded') !== 'true';
        body.hidden = !nextOpen;
        button.setAttribute('aria-expanded', String(nextOpen));
        button.textContent = nextOpen ? '收起' : '展开';
        state[id] = nextOpen;
        localStorage.setItem(collapseKey, JSON.stringify(state));
      });
    });
  }

  function setupPrint() {
    document.querySelectorAll('[data-print]').forEach(function (button) {
      button.addEventListener('click', function () { window.print(); });
    });
  }

  function readPlannerState() {
    try {
      var saved = JSON.parse(localStorage.getItem(plannerKey) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function plannerSaveId() {
    var value = localStorage.getItem(plannerSaveIdKey);
    if (!value) {
      value = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      localStorage.setItem(plannerSaveIdKey, value);
    }
    return value;
  }

  function renderPlannerWeeks() {
    var planner = window.THOMAS_PLANNER;
    var container = document.querySelector('[data-planner-weeks]');
    if (!planner || !container) return;
    var number = 0;
    container.innerHTML = planner.weeks.map(function (week) {
      var sessions = week.sessions.map(function (session) {
        number += 1;
        return '<article class="session-card"><label class="check-item" for="' + escapeHtml(session.id) + '">' +
          '<input id="' + escapeHtml(session.id) + '" type="checkbox" data-planner-item>' +
          '<span><small>Class ' + String(number).padStart(2, '0') + ' · ' + escapeHtml(session.date) + '</small><strong>' + escapeHtml(session.type) + '｜' + escapeHtml(session.title) + '</strong></span></label>' +
          '<dl class="task-list"><div><dt>课前准备</dt><dd>' + escapeHtml(session.before) + '</dd></div><div><dt>本课重点</dt><dd>' + escapeHtml(session.focus) + '</dd></div><div><dt>课后任务</dt><dd>' + escapeHtml(session.after) + '</dd></div><div><dt>家长协助</dt><dd>' + escapeHtml(session.parent) + '</dd></div></dl></article>';
      }).join('');
      return '<section class="week-card"><header><p class="eyebrow">' + escapeHtml(week.label) + '</p><h2>' + escapeHtml(week.title) + '</h2><p>' + escapeHtml(week.note) + '</p></header><div class="session-list">' + sessions + '</div></section>';
    }).join('');
  }

  function setupPlanner() {
    renderPlannerWeeks();
    var planner = window.THOMAS_PLANNER;
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-planner-item]'));
    var saveButton = document.querySelector('[data-planner-save]');
    var clearButton = document.querySelector('[data-planner-clear]');
    var status = document.querySelector('[data-planner-status]');
    var meter = document.querySelector('[data-planner-meter]');
    if (!planner || !items.length || !saveButton || !status || !meter) return;

    var saved = readPlannerState();
    var saveTimer = null;
    items.forEach(function (item) { item.checked = saved.indexOf(item.id) !== -1; });

    function renderStatus(message) {
      var checked = items.filter(function (item) { return item.checked; }).length;
      meter.textContent = '已完成 ' + checked + ' / ' + items.length;
      meter.style.setProperty('--planner-progress', String((checked / items.length) * 100) + '%');
      if (message) status.textContent = message;
    }

    function collectIds() {
      return items.filter(function (item) { return item.checked; }).map(function (item) { return item.id; });
    }

    function persistLocal() {
      var checkedIds = collectIds();
      localStorage.setItem(plannerKey, JSON.stringify(checkedIds));
      return checkedIds;
    }

    function sendProgress(checkedIds) {
      var answers = {};
      items.forEach(function (item) { answers[item.id] = { choice: checkedIds.indexOf(item.id) !== -1 ? 'A' : '', evidence: '' }; });
      return fetch(planner.endpoint, {
        method: 'POST',
        redirect: 'follow',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'saveDraft', assignmentId: planner.id, saveId: plannerSaveId(), actor: 'Thomas', environment: /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? 'qa' : 'production', answers: answers })
      }).then(function (response) { return response.json(); });
    }

    function saveProgress(silent) {
      var checkedIds = items.filter(function (item) { return item.checked; }).map(function (item) { return item.id; });
      localStorage.setItem(plannerKey, JSON.stringify(checkedIds));
      if (!silent) renderStatus('正在保存…');
      return sendProgress(checkedIds).then(function (result) {
        renderStatus(result.ok ? '进度已保存 · 已完成 ' + checkedIds.length + ' / ' + items.length : '已保存在当前设备，稍后会再次同步。');
      }).catch(function () { renderStatus('已保存在当前设备，稍后会再次同步。'); });
    }

    items.forEach(function (item) {
      item.addEventListener('change', function () {
        persistLocal();
        renderStatus('进度已更新，正在保存…');
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(function () { saveProgress(true); }, 500);
      });
    });

    saveButton.addEventListener('click', function () { saveProgress(false); });

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        if (!window.confirm('确定清除全部 30 项勾选吗？')) return;
        items.forEach(function (item) { item.checked = false; });
        localStorage.removeItem(plannerKey);
        saveProgress(false);
      });
    }

    window.addEventListener('pagehide', function () { if (saveTimer) saveProgress(true); });
    renderStatus(saved.length ? '已载入上次保存的进度。' : '勾选完成的课时，进度会自动保存。');
  }

  setupAccessGate();
  setupTheme();
  setupMenu();
  setupSections();
  setupPrint();
  setupPlanner();
}());
