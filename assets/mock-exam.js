(function () {
  'use strict';

  var registry = window.THOMAS_MOCKS;
  var number = new URLSearchParams(window.location.search).get('mock') || '2';
  var mock = registry && registry.items[number];
  if (!mock) return;

  var stateKey = 'thomas-ssat-mock-' + mock.id;
  var saveIdKey = stateKey + '-save-id';
  var sourceIndexKey = 'thomas-ssat-submission-sources-v1';
  var status = document.querySelector('[data-mock-status]');
  var receipt = document.querySelector('[data-mock-receipt]');
  var submitButton = document.querySelector('[data-submit-mock]');
  var saveButton = document.querySelector('[data-save-mock]');
  var tick = null;
  var saveTimer = null;

  function makeId() {
    return window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }

  function saveId() {
    var value = localStorage.getItem(saveIdKey);
    if (!value) { value = makeId(); localStorage.setItem(saveIdKey, value); }
    return value;
  }

  function initialTimers() {
    return {
      reading: { limit: 2400, remaining: 2400, running: false, startedAt: 0, finished: false },
      verbal: { limit: 1800, remaining: 1800, running: false, startedAt: 0, finished: false }
    };
  }

  function readState() {
    try {
      var state = JSON.parse(localStorage.getItem(stateKey) || '{}');
      if (!state || typeof state !== 'object') state = {};
      if (!state.answers) state.answers = {};
      if (!state.timers) state.timers = initialTimers();
      return state;
    } catch (error) {
      return { answers: {}, timers: initialTimers() };
    }
  }

  function effectiveRemaining(timer) {
    if (!timer.running) return Math.max(0, timer.remaining);
    return Math.max(0, timer.remaining - Math.floor((Date.now() - timer.startedAt) / 1000));
  }

  function normalizeTimers(timers) {
    ['reading', 'verbal'].forEach(function (section) {
      var timer = timers[section];
      var remaining = effectiveRemaining(timer);
      if (remaining <= 0) {
        timer.remaining = 0;
        timer.running = false;
        timer.startedAt = 0;
        timer.finished = true;
      }
    });
    return timers;
  }

  function collectAnswers() {
    var answers = {};
    document.querySelectorAll('[data-mock-question]').forEach(function (row) {
      var selected = row.querySelector('input:checked');
      if (selected) answers[row.dataset.mockQuestion] = { choice: selected.value, evidence: '' };
    });
    return answers;
  }

  function answeredCount(answers) { return Object.keys(answers).length; }

  function persist(submitted, receiptTime) {
    var current = readState();
    current.answers = collectAnswers();
    current.timers = normalizeTimers(current.timers);
    current.submitted = Boolean(submitted || current.submitted);
    current.receiptTime = receiptTime || current.receiptTime || '';
    localStorage.setItem(stateKey, JSON.stringify(current));
    return current;
  }

  function timerPayload(timers) {
    return {
      readingSecondsUsed: Math.min(timers.reading.limit, timers.reading.limit - effectiveRemaining(timers.reading)),
      verbalSecondsUsed: Math.min(timers.verbal.limit, timers.verbal.limit - effectiveRemaining(timers.verbal))
    };
  }

  function send(action, state) {
    return fetch(registry.endpoint, {
      method: 'POST',
      redirect: 'follow',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: action,
        assignmentId: mock.id,
        saveId: saveId(),
        actor: 'Thomas',
        environment: /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? 'qa' : 'production',
        answers: state.answers,
        timing: timerPayload(state.timers)
      })
    }).then(function (response) { return response.json(); });
  }

  function showStatus(message) { if (status) status.textContent = message; }

  function formatTime(seconds) {
    var safe = Math.max(0, seconds);
    return String(Math.floor(safe / 60)).padStart(2, '0') + ':' + String(safe % 60).padStart(2, '0');
  }

  function renderTimerState() {
    var state = readState();
    state.timers = normalizeTimers(state.timers);
    ['reading', 'verbal'].forEach(function (section) {
      var timer = state.timers[section];
      var display = document.querySelector('[data-timer="' + section + '"]');
      var button = document.querySelector('[data-start-timer="' + section + '"]');
      var fieldset = document.querySelector('[data-section-fieldset="' + section + '"]');
      var remaining = effectiveRemaining(timer);
      if (display) display.textContent = formatTime(remaining);
      if (button) {
        button.disabled = state.submitted || timer.running || timer.finished;
        button.textContent = timer.running ? '计时中' : (timer.finished ? '计时结束' : '开始 ' + (section === 'reading' ? 'Reading' : 'Verbal'));
      }
      if (fieldset) fieldset.disabled = state.submitted || (!timer.running && !timer.finished && remaining === timer.limit) || timer.finished;
    });
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  function startSection(section) {
    var state = readState();
    var other = section === 'reading' ? 'verbal' : 'reading';
    if (state.timers[other].running) {
      if (!window.confirm('另一部分仍在计时。现在结束另一部分并开始本部分吗？')) return;
      state.timers[other].remaining = effectiveRemaining(state.timers[other]);
      state.timers[other].running = false;
      state.timers[other].startedAt = 0;
      state.timers[other].finished = true;
    }
    var timer = state.timers[section];
    if (timer.running || timer.finished) return;
    timer.running = true;
    timer.startedAt = Date.now();
    localStorage.setItem(stateKey, JSON.stringify(state));
    renderTimerState();
    tickTimers();
  }

  function tickTimers() {
    window.clearInterval(tick);
    tick = window.setInterval(function () {
      var state = readState();
      var hadRunning = state.timers.reading.running || state.timers.verbal.running;
      normalizeTimers(state.timers);
      localStorage.setItem(stateKey, JSON.stringify(state));
      renderTimerState();
      if (hadRunning && !state.timers.reading.running && !state.timers.verbal.running) {
        showStatus('本部分计时结束；答案已保存。完成两部分后请正式提交。');
        saveDraft(true);
      }
    }, 1000);
  }

  function renderQuestions(section, count) {
    var container = document.querySelector('[data-answer-grid="' + section + '"]');
    if (!container) return;
    var prefix = section === 'reading' ? 'read-' : 'verb-';
    var letters = ['A', 'B', 'C', 'D', 'E'];
    var html = '';
    for (var index = 1; index <= count; index += 1) {
      var id = prefix + String(index).padStart(2, '0');
      html += '<div class="answer-row" data-mock-question="' + id + '"><span class="answer-number">' + index + '</span>' + letters.map(function (letter) {
        return '<label><input type="radio" name="' + id + '" value="' + letter + '"><span>' + letter + '</span></label>';
      }).join('') + '</div>';
    }
    container.innerHTML = html;
  }

  function registerSource() {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(sourceIndexKey) || '[]'); } catch (error) {}
    if (!Array.isArray(list)) list = [];
    if (!list.some(function (item) { return item.assignmentId === mock.id && item.saveId === saveId(); })) list.push({ assignmentId: mock.id, saveId: saveId() });
    localStorage.setItem(sourceIndexKey, JSON.stringify(list.slice(-20)));
  }

  function restore() {
    var state = readState();
    Object.keys(state.answers || {}).forEach(function (id) {
      var answer = state.answers[id];
      var input = document.querySelector('input[name="' + id + '"][value="' + answer.choice + '"]');
      if (input) input.checked = true;
    });
    if (state.submitted) lockSubmitted(state.receiptTime);
    renderTimerState();
  }

  function saveDraft(silent) {
    var state = persist(false, '');
    if (!silent) showStatus('正在保存…');
    return send('saveDraft', state).then(function (result) {
      showStatus(result.ok ? '进度已保存 · 已填写 ' + answeredCount(state.answers) + ' / 100。' : '进度已保存在当前设备。');
      return result;
    }).catch(function () {
      showStatus('进度已保存在当前设备。');
      return { ok: false };
    });
  }

  function lockSubmitted(receiptTime) {
    document.querySelectorAll('[data-mock-form] input, [data-start-timer]').forEach(function (control) { control.disabled = true; });
    if (saveButton) saveButton.disabled = true;
    if (submitButton) submitButton.disabled = true;
    if (receipt) receipt.textContent = '已提交 · ' + (receiptTime ? new Date(receiptTime).toLocaleString('zh-CN') : '已记录');
    showStatus('答题卡已成功提交。');
  }

  document.querySelector('[data-mock-label]').textContent = mock.label;
  document.querySelector('[data-mock-title]').textContent = mock.title;
  document.querySelector('[data-mock-due]').textContent = mock.due;
  document.querySelector('[data-mock-source]').textContent = mock.source;
  document.querySelector('[data-reading-label]').textContent = mock.readingLabel;
  document.querySelector('[data-verbal-label]').textContent = mock.verbalLabel;
  var sourceLink = document.querySelector('[data-mock-source-link]');
  if (sourceLink) {
    if (mock.sourceUrl) sourceLink.href = mock.sourceUrl;
    else sourceLink.hidden = true;
  }

  renderQuestions('reading', 40);
  renderQuestions('verbal', 60);
  restore();
  tickTimers();

  document.querySelectorAll('[data-start-timer]').forEach(function (button) { button.addEventListener('click', function () { startSection(button.dataset.startTimer); }); });
  document.querySelectorAll('[data-mock-form] input').forEach(function (input) {
    input.addEventListener('change', function () {
      persist(false, '');
      showStatus('答案已更新，正在保存…');
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(function () { saveDraft(true); }, 700);
    });
  });
  if (saveButton) saveButton.addEventListener('click', function () { saveDraft(false); });
  if (submitButton) submitButton.addEventListener('click', function () {
    var state = persist(false, '');
    var count = answeredCount(state.answers);
    if (count < 100 && !window.confirm('目前填写 ' + count + ' / 100 题，未填题会记为 omitted。仍要提交吗？')) return;
    submitButton.disabled = true;
    showStatus('正在提交…');
    send('submit', state).then(function (result) {
      if (!result.ok) throw new Error(result.error || 'Submit failed');
      persist(true, result.receiptTime || '');
      registerSource();
      if (window.ThomasSelfStudy) window.ThomasSelfStudy.markComplete(mock.taskId);
      lockSubmitted(result.receiptTime || '');
    }).catch(function () {
      submitButton.disabled = false;
      showStatus('暂时未能提交，答题卡已经保存，请稍后再试。');
    });
  });
}());
