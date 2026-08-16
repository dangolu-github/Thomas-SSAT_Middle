(function () {
  'use strict';

  var assignment = window.THOMAS_ASSIGNMENT;
  if (!assignment) return;

  var stateKey = 'thomas-ssat-assignment-' + assignment.id;
  var saveIdKey = stateKey + '-save-id';
  var submitButton = document.querySelector('[data-submit-assignment]');
  var saveButton = document.querySelector('[data-save-assignment]');
  var status = document.querySelector('[data-assignment-status]');
  var receipt = document.querySelector('[data-submission-receipt]');
  var saveTimer = null;

  function makeSaveId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }

  function saveId() {
    var value = localStorage.getItem(saveIdKey);
    if (!value) {
      value = makeSaveId();
      localStorage.setItem(saveIdKey, value);
    }
    return value;
  }

  function readState() {
    try {
      var value = JSON.parse(localStorage.getItem(stateKey) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (error) {
      return {};
    }
  }

  function collectState() {
    var answers = {};
    assignment.items.forEach(function (item) {
      var selected = document.querySelector('input[name="' + item.id + '"]:checked');
      var evidence = document.querySelector('[data-evidence-for="' + item.id + '"]');
      answers[item.id] = {
        choice: selected ? selected.value : '',
        evidence: evidence ? evidence.value.trim() : ''
      };
    });
    return answers;
  }

  function answeredCount(answers) {
    return assignment.items.filter(function (item) {
      return answers[item.id] && answers[item.id].choice;
    }).length;
  }

  function showStatus(message) {
    if (status) status.textContent = message;
  }

  function formatReceipt(value) {
    var parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '已记录' : parsed.toLocaleString('zh-CN');
  }

  function restore() {
    var state = readState();
    assignment.items.forEach(function (item) {
      var answer = state.answers && state.answers[item.id];
      if (!answer) return;
      var selected = document.querySelector('input[name="' + item.id + '"][value="' + answer.choice + '"]');
      var evidence = document.querySelector('[data-evidence-for="' + item.id + '"]');
      if (selected) selected.checked = true;
      if (evidence) evidence.value = answer.evidence || '';
    });
    if (state.submitted) lockSubmitted(state.receiptTime || 'Recorded');
  }

  function persistLocal(submitted, receiptTime) {
    var answers = collectState();
    localStorage.setItem(stateKey, JSON.stringify({
      answers: answers,
      submitted: Boolean(submitted),
      receiptTime: receiptTime || ''
    }));
    return answers;
  }

  function send(action, answers) {
    if (!assignment.endpoint) return Promise.resolve({ ok: false, localOnly: true });
    return fetch(assignment.endpoint, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: action,
        assignmentId: assignment.id,
        saveId: saveId(),
        actor: 'Thomas',
        environment: 'production',
        answers: answers
      })
    }).then(function (response) { return response.json(); });
  }

  function saveDraft(silent) {
    var answers = persistLocal(false, '');
    if (!silent) showStatus('正在保存…');
    return send('saveDraft', answers).then(function (result) {
      if (result.ok) showStatus('进度已保存 · 已完成 ' + answeredCount(answers) + ' / ' + assignment.items.length + ' 题。');
      else if (!silent) showStatus('已保存，网络恢复后会再次同步。');
      return result;
    }).catch(function () {
      if (!silent) showStatus('已保存，网络恢复后会再次同步。');
      return { ok: false };
    });
  }

  function lockSubmitted(receiptTime) {
    document.querySelectorAll('[data-assignment-form] input, [data-assignment-form] textarea').forEach(function (control) {
      control.disabled = true;
    });
    document.querySelectorAll('.question-card').forEach(function (card) { card.setAttribute('aria-disabled', 'true'); });
    if (submitButton) submitButton.disabled = true;
    if (saveButton) saveButton.disabled = true;
    if (receipt) receipt.textContent = '已提交 · ' + formatReceipt(receiptTime);
    showStatus('作业已成功提交。');
  }

  document.querySelectorAll('[data-assignment-form] input, [data-assignment-form] textarea').forEach(function (control) {
    control.addEventListener('change', function () {
      persistLocal(false, '');
      showStatus('答案已更新，正在保存…');
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(function () { saveDraft(true); }, 700);
    });
  });

  if (saveButton) saveButton.addEventListener('click', function () { saveDraft(false); });

  if (submitButton) submitButton.addEventListener('click', function () {
    var answers = collectState();
    var count = answeredCount(answers);
    if (count < assignment.items.length && !window.confirm('目前完成 ' + count + ' / ' + assignment.items.length + ' 题，仍要提交吗？')) return;
    submitButton.disabled = true;
    showStatus('正在提交…');
    send('submit', answers).then(function (result) {
      if (!result.ok) throw new Error(result.error || 'Submit failed');
      persistLocal(true, result.receiptTime || 'Recorded');
      lockSubmitted(result.receiptTime || 'Recorded');
    }).catch(function () {
      submitButton.disabled = false;
      showStatus('暂时未能提交，答案已经保存，请稍后再试。');
    });
  });

  restore();
  if (!readState().submitted) showStatus('答案会在每次修改后自动保存；全部完成后请点击“提交作业”。');
}());
