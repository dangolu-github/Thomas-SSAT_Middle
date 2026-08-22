(function () {
  'use strict';

  var plan = window.THOMAS_SELF_STUDY;
  if (!plan) return;

  var stateKey = 'thomas-ssat-self-study-v2';
  var saveIdKey = stateKey + '-save-id';
  var saveTimer = null;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  }

  function readState() {
    try {
      var value = JSON.parse(localStorage.getItem(stateKey) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function saveId() {
    var value = localStorage.getItem(saveIdKey);
    if (!value) {
      value = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      localStorage.setItem(saveIdKey, value);
    }
    return value;
  }

  function allTasks() {
    return plan.weeks.reduce(function (tasks, week) { return tasks.concat(week.tasks); }, []);
  }

  function taskState(task) {
    return plan.states[task.state] || plan.states.pending;
  }

  function taskCard(task) {
    var state = taskState(task);
    var disabled = state.checkable ? '' : ' disabled aria-disabled="true"';
    var onReadingPage = Boolean(document.querySelector('[data-reading-tasks]'));
    var link = task.href && !(onReadingPage && task.type === 'Reading Skill Booster') ? '<a class="task-link" href="' + esc(task.href) + '">打开任务</a>' : '';
    var resources = (task.resources || []).map(function (resource) {
      return '<a class="task-resource" href="' + esc(resource.href) + '" target="_blank" rel="noopener noreferrer">' + esc(resource.label) + '</a>';
    }).join('');
    var resourceBlock = link || resources ? '<div class="task-resources">' + link + resources + '</div>' : '';
    return '<article class="study-task" id="' + esc(task.id) + '">' +
      '<label class="task-check" for="check-' + esc(task.id) + '">' +
      '<input id="check-' + esc(task.id) + '" type="checkbox" data-study-task="' + esc(task.id) + '"' + disabled + '>' +
      '<span><small>' + esc(task.date) + ' · ' + esc(task.type) + '</small><strong>' + esc(task.title) + '</strong></span></label>' +
      '<div class="task-detail"><span class="status-pill status-' + esc(state.tone) + '">' + esc(state.label) + '</span>' +
      '<ul>' + task.bullets.map(function (bullet) { return '<li>' + esc(bullet) + '</li>'; }).join('') + '</ul>' + resourceBlock + '</div></article>';
  }

  function renderPlanner() {
    var container = document.querySelector('[data-study-weeks]');
    if (!container) return;
    var start = new Date('2026-08-19T00:00:00+08:00');
    var today = new Date();
    var currentWeek = Math.max(0, Math.min(plan.weeks.length - 1, Math.floor((today.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000))));
    container.innerHTML = plan.weeks.map(function (week, index) {
      var opened = index === currentWeek ? ' open' : '';
      return '<details class="week-card" data-study-week' + opened + '><summary class="week-summary"><span><span class="eyebrow">' + esc(week.label) + '</span><strong>' + esc(week.title) + '</strong></span><span class="week-task-count">' + week.tasks.length + ' 项任务</span></summary><div class="week-body">' +
        '<section class="weekly-focus"><h3>本周重点</h3><ul class="focus-list">' + week.focus.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul></section>' +
        '<div class="study-task-list">' + week.tasks.map(taskCard).join('') + '</div></div></details>';
    }).join('');
  }

  function renderReading() {
    var container = document.querySelector('[data-reading-tasks]');
    if (!container) return;
    var reading = allTasks().filter(function (task) { return task.type === 'Reading Skill Booster'; });
    container.innerHTML = reading.map(taskCard).join('');
  }

  function controls() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-study-task]'));
  }

  function completedIds() {
    return controls().filter(function (input) { return input.checked; }).map(function (input) { return input.dataset.studyTask; });
  }

  function setStatus(message) {
    document.querySelectorAll('[data-study-status]').forEach(function (node) { node.textContent = message; });
  }

  function renderMeter() {
    var checkable = allTasks().filter(function (task) { return taskState(task).checkable; });
    var completed = readState().filter(function (id) { return checkable.some(function (task) { return task.id === id; }); });
    document.querySelectorAll('[data-study-meter]').forEach(function (meter) {
      meter.textContent = '已完成 ' + completed.length + ' / ' + checkable.length;
      meter.style.setProperty('--planner-progress', String(checkable.length ? (completed.length / checkable.length) * 100 : 0) + '%');
    });
  }

  function persistLocal(ids) {
    localStorage.setItem(stateKey, JSON.stringify(ids));
    renderMeter();
  }

  function send(ids) {
    if (!plan.endpoint) return Promise.resolve({ ok: false });
    return fetch(plan.endpoint, {
      method: 'POST',
      redirect: 'follow',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'saveTaskProgress',
        planId: plan.id,
        saveId: saveId(),
        actor: 'Thomas',
        environment: /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? 'qa' : 'production',
        completedTaskIds: ids
      })
    }).then(function (response) { return response.json(); });
  }

  function save(silent) {
    var ids = completedIds();
    persistLocal(ids);
    if (!silent) setStatus('正在保存…');
    return send(ids).then(function (result) {
      setStatus(result.ok ? '进度已保存。' : '进度已保存在当前设备。');
      return result;
    }).catch(function () {
      setStatus('进度已保存在当前设备。');
      return { ok: false };
    });
  }

  function restore() {
    var saved = readState();
    controls().forEach(function (input) { input.checked = !input.disabled && saved.indexOf(input.dataset.studyTask) !== -1; });
    renderMeter();
  }

  function markComplete(taskId) {
    if (!taskId) return Promise.resolve({ ok: false });
    var ids = readState();
    if (ids.indexOf(taskId) === -1) ids.push(taskId);
    persistLocal(ids);
    return send(ids).catch(function () { return { ok: false }; });
  }

  renderPlanner();
  renderReading();
  restore();

  controls().forEach(function (input) {
    input.addEventListener('change', function () {
      persistLocal(completedIds());
      setStatus('进度已更新，正在保存…');
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(function () { save(true); }, 500);
    });
  });

  document.querySelectorAll('[data-study-save]').forEach(function (button) { button.addEventListener('click', function () { save(false); }); });
  document.querySelectorAll('[data-study-expand]').forEach(function (button) {
    button.addEventListener('click', function () { document.querySelectorAll('[data-study-week]').forEach(function (week) { week.open = true; }); });
  });
  document.querySelectorAll('[data-study-collapse]').forEach(function (button) {
    button.addEventListener('click', function () { document.querySelectorAll('[data-study-week]').forEach(function (week) { week.open = false; }); });
  });
  document.querySelectorAll('[data-study-clear]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!window.confirm('确定清除全部自学任务勾选吗？')) return;
      controls().forEach(function (input) { if (!input.disabled) input.checked = false; });
      save(false);
    });
  });

  window.ThomasSelfStudy = { markComplete: markComplete, readState: readState };
  window.addEventListener('pagehide', function () { if (saveTimer) save(true); });
  setStatus(readState().length ? '已载入上次保存的进度。' : '完成后勾选，进度会自动保存。');
}());
