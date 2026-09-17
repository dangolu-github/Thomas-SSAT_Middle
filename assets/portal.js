(function () {
  'use strict';

  var root = document.documentElement;
  var themeKey = 'thomas-ssat-theme';
  var collapseKey = 'thomas-ssat-section-state';
  var plannerKey = 'thomas-ssat-weekly-review-plan-v1';
  var plannerSaveIdKey = plannerKey + '-save-id';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  }

  var portalSessionKey = 'thomas-portal-session-v1';
  var learnerService = 'https://script.google.com/macros/s/AKfycbzF6aQZPpbL34Of--5r8zRZGI8Av2e8zTp11D_w820I9fNzLEAyY_YtvzLZ0-OVPFFw/exec';
  var publicBase = 'https://dangolu-github.github.io/Thomas-SSAT_Middle/';
  function sessionGet(name) { try { return window[name].getItem(portalSessionKey) || ''; } catch (e) { return ''; } }
  function sessionSet(name,token) { try { window[name].setItem(portalSessionKey,token); } catch (e) {} }
  function sessionClear() { ['localStorage','sessionStorage'].forEach(function(name){try{window[name].removeItem(portalSessionKey);window[name].removeItem('thomas-ssat-access');}catch(e){}}); }
  function freshPortalToken(token) { try { var p=JSON.parse(atob(token.split('.')[0].replace(/-/g,'+').replace(/_/g,'/')));return p.aud==='thomas-learner-portal'&&p.expiresAt>Date.now()&&/^[A-Za-z0-9_-]+\.[a-f0-9]{64}$/.test(token); } catch(e){return false;} }
  function currentPortalToken() { var t=sessionGet('localStorage')||sessionGet('sessionStorage');return freshPortalToken(t)?t:''; }
  function setupAccessGate() {
    var fragment=new URLSearchParams(location.hash.slice(1));
    if(fragment.get('thomas-logout')==='1'){sessionClear();history.replaceState(null,'',location.pathname+location.search);}
    var incoming=fragment.get('thomas-session');
    if(incoming){if(freshPortalToken(incoming)){sessionSet('localStorage',incoming);sessionSet('sessionStorage',incoming);}var anchor=fragment.get('thomas-anchor');history.replaceState(null,'',location.pathname+location.search+(anchor?'#'+encodeURIComponent(anchor):''));}
    function resourceLink(event) {
      var a=event.target.closest&&event.target.closest('a[href]'),token=currentPortalToken();if(!a||!token)return;
      try {var u=new URL(a.href);if(u.origin+u.pathname!==learnerService||u.searchParams.get('view')==='portal-login')return;u.hash='thomas-session='+encodeURIComponent(token);a.href=u.href;}catch(e){}
    }
    ['click','auxclick','pointerdown','contextmenu'].forEach(function(type){document.addEventListener(type,resourceLink,true);});
    if(document.body.dataset.access!=='required')return true;
    if(currentPortalToken()) {
      document.body.dataset.access='granted';
      var nav=document.querySelector('header nav');if(nav){var logout=document.createElement('a');logout.href=learnerService+'?view=portal-login&logout=1';logout.textContent='退出登录';logout.addEventListener('click',sessionClear);nav.append(logout);}
      return true;
    }
    document.body.dataset.access='locked';
    var gate=document.createElement('main');gate.className='access-gate';
    gate.innerHTML='<div class="access-card"><span class="brand-mark" aria-hidden="true">T</span><p class="eyebrow">Thomas SSAT</p><h1>进入 Thomas 的学习空间</h1><p>登录一次，即可打开课堂讲义和学习资料。</p><a class="button button-primary" data-site-login>进入学习空间</a></div>';
    var next=location.pathname.indexOf('/Thomas-SSAT_Middle/')===0?location.pathname.slice('/Thomas-SSAT_Middle/'.length):'';
    gate.querySelector('[data-site-login]').href=learnerService+'?view=portal-login&next='+encodeURIComponent(next);
    document.body.prepend(gate);return false;
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
    container.innerHTML = planner.weeks.map(function (week, weekIndex) {
      var focus = planner.weeklyFocus && planner.weeklyFocus[weekIndex] ? planner.weeklyFocus[weekIndex] : {};
      var sessions = week.sessions.map(function (session) {
        number += 1;
        var taskState = planner.taskStates && planner.taskStates[session.id] ? planner.taskStates[session.id] : {
          state: '暂未布置', tone: 'pending', checkable: false, detail: '目前没有布置学生任务。'
        };
        var disabled = taskState.checkable ? '' : ' disabled aria-disabled="true"';
        return '<article class="session-card"><label class="check-item" for="' + escapeHtml(session.id) + '">' +
          '<input id="' + escapeHtml(session.id) + '" type="checkbox" data-planner-item' + disabled + '>' +
          '<span><small>Class ' + String(number).padStart(2, '0') + ' · ' + escapeHtml(session.date) + '</small><strong>' + escapeHtml(session.type) + '｜' + escapeHtml(session.title) + '</strong></span></label>' +
          '<ul class="session-bullets"><li><strong>状态：</strong><span class="status-pill status-' + escapeHtml(taskState.tone) + '">' + escapeHtml(taskState.state) + '</span> ' + escapeHtml(taskState.detail) + '</li>' +
          '<li><strong>课堂重点：</strong>' + escapeHtml(session.focus) + '</li></ul></article>';
      }).join('');
      var weeklyFocus = '<section class="weekly-focus"><h3>本周重点</h3><ul class="focus-list">' +
        '<li><strong>词汇重点：</strong>' + escapeHtml(focus.vocabulary || '根据课堂情况确定。') + '</li>' +
        '<li><strong>Reading 重点：</strong>' + escapeHtml(focus.reading || '根据课堂情况确定。') + '</li>' +
        '<li><strong>Verbal 重点：</strong>' + escapeHtml(focus.verbal || '根据课堂情况确定。') + '</li>' +
        '<li><strong>复盘重点：</strong>' + escapeHtml(focus.review || '根据本周练习情况确定。') + '</li></ul></section>' +
        '<section class="weekly-routine"><h3>本周固定安排</h3><ul><li><strong>生词本：</strong>' + escapeHtml(focus.vocabDays || '本周任选1–2天') + '。把本周课堂和已布置作业中所有不认识或不确定的词加入生词本；第二次整理时去重。</li></ul></section>';
      return '<section class="week-card"><header><p class="eyebrow">' + escapeHtml(week.label) + '</p><h2>' + escapeHtml(week.title) + '</h2><p>' + escapeHtml(week.note) + '</p></header>' + weeklyFocus + '<div class="session-list">' + sessions + '</div></section>';
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
    items.forEach(function (item) { item.checked = !item.disabled && saved.indexOf(item.id) !== -1; });

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
        renderStatus(result.ok ? '进度已保存 · 已完成 ' + checkedIds.length + ' / ' + items.length : '进度已保存在当前设备。');
      }).catch(function () { renderStatus('进度已保存在当前设备。'); });
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
