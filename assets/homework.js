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
  var correctionActions = document.querySelector('[data-correction-actions]');
  var correctionSaveButton = document.querySelector('[data-save-correction]');
  var correctionSubmitButton = document.querySelector('[data-submit-correction]');
  var saveTimer = null;
  var sourceIndexKey = 'thomas-ssat-submission-sources-v1';
  var correctionMode = false;
  var correctionIds = [];

  function makeSaveId() { if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID(); return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2); }
  function saveId() { var value = localStorage.getItem(saveIdKey); if (!value) { value = makeSaveId(); localStorage.setItem(saveIdKey, value); } return value; }
  function registerSource() { var list = []; try { list = JSON.parse(localStorage.getItem(sourceIndexKey) || '[]'); } catch (error) {} if (!Array.isArray(list)) list = []; if (!list.some(function (item) { return item.assignmentId === assignment.id && item.saveId === saveId(); })) list.push({ assignmentId: assignment.id, saveId: saveId() }); localStorage.setItem(sourceIndexKey, JSON.stringify(list.slice(-20))); }
  function readState() { try { var value = JSON.parse(localStorage.getItem(stateKey) || '{}'); return value && typeof value === 'object' ? value : {}; } catch (error) { return {}; } }
  function writeState(value) { localStorage.setItem(stateKey, JSON.stringify(value)); }
  function collectState(ids) { var selectedIds = ids || assignment.items.map(function (item) { return item.id; }); var answers = {}; assignment.items.forEach(function (item) { if (selectedIds.indexOf(item.id) === -1) return; var selected = document.querySelector('input[name="' + item.id + '"]:checked'); var evidence = document.querySelector('[data-evidence-for="' + item.id + '"]'); answers[item.id] = { choice: selected ? selected.value : '', evidence: evidence ? evidence.value.trim() : '' }; }); return answers; }
  function answeredCount(answers, ids) { var selectedIds = ids || assignment.items.map(function (item) { return item.id; }); return selectedIds.filter(function (id) { return answers[id] && answers[id].choice; }).length; }
  function showStatus(message) { if (status) status.textContent = message; }
  function formatReceipt(value) { var parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? '已记录' : parsed.toLocaleString('zh-CN'); }

  function ensureCorrectionActions() {
    if (correctionActions) return;
    correctionActions = document.createElement('div'); correctionActions.className = 'assignment-actions'; correctionActions.dataset.correctionActions = ''; correctionActions.hidden = true;
    correctionActions.innerHTML = '<button class="button button-secondary" type="button" data-save-correction>保存改错</button><button class="button button-primary" type="button" data-submit-correction>提交改错</button>';
    var toolbar = document.querySelector('.assignment-toolbar'); if (toolbar) toolbar.insertBefore(correctionActions, receipt || null);
    correctionSaveButton = correctionActions.querySelector('[data-save-correction]'); correctionSubmitButton = correctionActions.querySelector('[data-submit-correction]'); bindCorrectionButtons();
  }

  function restoreAnswers(answers) { assignment.items.forEach(function (item) { var answer = answers && answers[item.id]; if (!answer) return; var selected = document.querySelector('input[name="' + item.id + '"][value="' + answer.choice + '"]'); var evidence = document.querySelector('[data-evidence-for="' + item.id + '"]'); if (selected) selected.checked = true; if (evidence && typeof answer.evidence === 'string') evidence.value = answer.evidence; }); }
  function restore() { var state = readState(); restoreAnswers(state.answers || {}); if (state.submitted) lockSubmitted(state.receiptTime || 'Recorded'); }
  function persistLocal(submitted, receiptTime) { var state = readState(); var answers = collectState(); state.answers = answers; state.submitted = Boolean(submitted || state.submitted); if (receiptTime) state.receiptTime = receiptTime; writeState(state); return answers; }
  function persistCorrectionLocal() { var state = readState(); state.correctionAnswers = collectState(correctionIds); writeState(state); return state.correctionAnswers; }

  function send(action, answers) { if (!assignment.endpoint) return Promise.resolve({ ok: false, localOnly: true }); return fetch(assignment.endpoint, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: action, assignmentId: assignment.id, saveId: saveId(), actor: 'Thomas', environment: 'production', answers: answers || {} }) }).then(function (response) { return response.json(); }); }
  function saveDraft(silent) { var answers = persistLocal(false, ''); if (!silent) showStatus('正在保存…'); return send('saveDraft', answers).then(function (result) { if (result.ok) showStatus('进度已保存 · 已完成 ' + answeredCount(answers) + ' / ' + assignment.items.length + ' 题。'); else if (!silent) showStatus('已保存在当前设备，可继续作答。'); return result; }).catch(function () { if (!silent) showStatus('已保存在当前设备，可继续作答。'); return { ok: false }; }); }

  function disableAll() { document.querySelectorAll('[data-assignment-form] input, [data-assignment-form] textarea').forEach(function (control) { control.disabled = true; }); document.querySelectorAll('.question-card').forEach(function (card) { card.setAttribute('aria-disabled', 'true'); card.classList.remove('correction-required'); }); }
  function lockSubmitted(receiptTime) { correctionMode = false; disableAll(); if (submitButton) submitButton.disabled = true; if (saveButton) saveButton.disabled = true; if (correctionActions) correctionActions.hidden = true; if (receipt) receipt.textContent = '首次提交已保留 · ' + formatReceipt(receiptTime); showStatus('作业已成功提交。'); }
  function openCorrection(data) { ensureCorrectionActions(); correctionMode = true; correctionIds = data.correctableItemIds || []; disableAll(); var saved = data.correctionAnswers || readState().correctionAnswers || {}; restoreAnswers(saved); correctionIds.forEach(function (id) { var card = document.querySelector('[data-item-id="' + id + '"]'); if (!card) return; card.classList.add('correction-required'); card.removeAttribute('aria-disabled'); card.querySelectorAll('input, textarea').forEach(function (control) { control.disabled = false; }); }); correctionActions.hidden = false; if (correctionSaveButton) correctionSaveButton.disabled = false; if (correctionSubmitButton) correctionSubmitButton.disabled = false; showStatus('改错已开放：请重新完成标记题目。首次提交不会被覆盖。'); }
  function lockCorrection(receiptTime) { correctionMode = false; disableAll(); ensureCorrectionActions(); correctionActions.hidden = true; if (receipt) receipt.textContent = '首次提交已保留 · 改错已提交 ' + formatReceipt(receiptTime); showStatus('改错已成功提交。'); }

  function refreshSubmissionState() { return send('getSubmissionState', {}).then(function (data) { if (!data.ok || !data.submitted) return data; var state = readState(); state.submitted = true; state.receiptTime = data.firstReceiptTime || state.receiptTime || 'Recorded'; writeState(state); lockSubmitted(state.receiptTime); if (!data.correctionEnabled) return data; if (data.correctionStatus === 'submitted') { lockCorrection(data.correctionReceiptTime || 'Recorded'); return data; } if (data.correctableItemIds && data.correctableItemIds.length) openCorrection(data); else showStatus('首次提交已保留；本次没有需要改错的题目。'); return data; }).catch(function () { return { ok: false }; }); }
  function saveCorrection(silent) { var answers = persistCorrectionLocal(); if (!silent) showStatus('正在保存改错…'); return send('saveCorrectionDraft', answers).then(function (result) { if (!result.ok) throw new Error(result.error || 'Save failed'); if (!silent) showStatus('改错进度已保存 · 已完成 ' + answeredCount(answers, correctionIds) + ' / ' + correctionIds.length + ' 题。'); return result; }).catch(function () { if (!silent) showStatus('改错已保存在当前设备，请稍后再试。'); return { ok: false }; }); }
  function submitCorrection() { var answers = persistCorrectionLocal(); var count = answeredCount(answers, correctionIds); if (count < correctionIds.length && !window.confirm('目前完成 ' + count + ' / ' + correctionIds.length + ' 道改错题，仍要提交吗？')) return; if (correctionSubmitButton) correctionSubmitButton.disabled = true; showStatus('正在提交改错…'); send('submitCorrection', answers).then(function (result) { if (!result.ok) throw new Error(result.error || 'Submit failed'); var state = readState(); state.correctionAnswers = answers; state.correctionSubmitted = true; state.correctionReceiptTime = result.receiptTime || 'Recorded'; writeState(state); lockCorrection(result.receiptTime || 'Recorded'); }).catch(function () { if (correctionSubmitButton) correctionSubmitButton.disabled = false; showStatus('暂时未能提交改错，答案已经保存，请稍后再试。'); }); }
  function bindCorrectionButtons() { if (correctionSaveButton && !correctionSaveButton.dataset.bound) { correctionSaveButton.dataset.bound = 'true'; correctionSaveButton.addEventListener('click', function () { saveCorrection(false); }); } if (correctionSubmitButton && !correctionSubmitButton.dataset.bound) { correctionSubmitButton.dataset.bound = 'true'; correctionSubmitButton.addEventListener('click', submitCorrection); } }

  document.querySelectorAll('[data-assignment-form] input, [data-assignment-form] textarea').forEach(function (control) { control.addEventListener('change', function () { window.clearTimeout(saveTimer); if (correctionMode) { persistCorrectionLocal(); showStatus('改错答案已更新，正在保存…'); saveTimer = window.setTimeout(function () { saveCorrection(true); }, 700); return; } persistLocal(false, ''); showStatus('答案已更新，正在保存…'); saveTimer = window.setTimeout(function () { saveDraft(true); }, 700); }); });
  if (saveButton) saveButton.addEventListener('click', function () { saveDraft(false); });
  if (submitButton) submitButton.addEventListener('click', function () { var answers = collectState(); var count = answeredCount(answers); if (count < assignment.items.length && !window.confirm('目前完成 ' + count + ' / ' + assignment.items.length + ' 题，仍要提交吗？')) return; submitButton.disabled = true; showStatus('正在提交…'); send('submit', answers).then(function (result) { if (!result.ok) throw new Error(result.error || 'Submit failed'); persistLocal(true, result.receiptTime || 'Recorded'); registerSource(); if (window.ThomasSelfStudy && assignment.taskId) window.ThomasSelfStudy.markComplete(assignment.taskId); lockSubmitted(result.receiptTime || 'Recorded'); return refreshSubmissionState(); }).catch(function () { submitButton.disabled = false; showStatus('暂时未能提交，答案已经保存，请稍后再试。'); }); });
  bindCorrectionButtons(); restore(); if (!readState().submitted) showStatus('答案会在每次修改后自动保存；全部完成后请点击“提交作业”。'); refreshSubmissionState();
}());
