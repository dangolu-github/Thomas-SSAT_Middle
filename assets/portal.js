(function () {
  'use strict';

  var root = document.documentElement;
  var themeKey = 'thomas-ssat-theme';
  var collapseKey = 'thomas-ssat-section-state';
  var accessKey = 'thomas-ssat-access';
  var accessHash = '70369e3c';
  var plannerKey = 'thomas-ssat-weekly-review-plan-v1';

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
      '<h1>Open your workspace</h1>' +
      '<p>Enter the lowercase access word to continue.</p>' +
      '<label for="portal-access">Access word</label>' +
      '<input id="portal-access" name="access" type="password" autocomplete="current-password" required>' +
      '<button class="button button-primary" type="submit">Open workspace</button>' +
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
        error.textContent = 'Access word not recognized. Please try again.';
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
      button.textContent = theme === 'dark' ? 'Light' : 'Dark';
      button.setAttribute('aria-label', theme === 'dark' ? 'Use light theme' : 'Use dark theme');
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
      button.textContent = open ? 'Close' : 'Menu';
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
      button.textContent = open ? 'Hide' : 'Show';
      button.addEventListener('click', function () {
        var nextOpen = button.getAttribute('aria-expanded') !== 'true';
        body.hidden = !nextOpen;
        button.setAttribute('aria-expanded', String(nextOpen));
        button.textContent = nextOpen ? 'Hide' : 'Show';
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

  function setupPlanner() {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-planner-item]'));
    var saveButton = document.querySelector('[data-planner-save]');
    var clearButton = document.querySelector('[data-planner-clear]');
    var status = document.querySelector('[data-planner-status]');
    var meter = document.querySelector('[data-planner-meter]');
    if (!items.length || !saveButton || !status || !meter) return;

    var saved = readPlannerState();
    items.forEach(function (item) { item.checked = saved.indexOf(item.id) !== -1; });

    function renderStatus(message) {
      var checked = items.filter(function (item) { return item.checked; }).length;
      meter.textContent = checked + ' / ' + items.length + ' checked';
      meter.style.setProperty('--planner-progress', String((checked / items.length) * 100) + '%');
      if (message) status.textContent = message;
    }

    items.forEach(function (item) {
      item.addEventListener('change', function () {
        renderStatus('Checkmarks changed. Use Save progress to keep them on this device.');
      });
    });

    saveButton.addEventListener('click', function () {
      var checkedIds = items.filter(function (item) { return item.checked; }).map(function (item) { return item.id; });
      localStorage.setItem(plannerKey, JSON.stringify(checkedIds));
      renderStatus('Progress saved on this device. Nothing was sent to the teacher.');
    });

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        items.forEach(function (item) { item.checked = false; });
        localStorage.removeItem(plannerKey);
        renderStatus('Saved checkmarks cleared from this device.');
      });
    }

    renderStatus(saved.length ? 'Saved checkmarks loaded from this device.' : 'No saved checkmarks on this device yet.');
  }

  setupAccessGate();
  setupTheme();
  setupMenu();
  setupSections();
  setupPrint();
  setupPlanner();
}());
