(function () {
  'use strict';

  var endpoint = 'https://script.google.com/macros/s/AKfycbzF6aQZPpbL34Of--5r8zRZGI8Av2e8zTp11D_w820I9fNzLEAyY_YtvzLZ0-OVPFFw/exec';
  var indexKey = 'thomas-ssat-submission-sources-v1';
  var status = document.querySelector('[data-mistake-status]');
  var listNode = document.querySelector('[data-mistake-list]');
  var meter = document.querySelector('[data-mistake-meter]');
  var causes = ['待确认', '词义未知', '关系误判', '证据越界', '题型判断', '时间不足', '粗心'];
  var knownHomework = ['THO-SSAT-TRIAL-READING-HM01', 'THO-SSAT-TRIAL-VERBAL-HM01'];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  }

  function sources() {
    var items = [];
    try { items = JSON.parse(localStorage.getItem(indexKey) || '[]'); } catch (error) {}
    if (!Array.isArray(items)) items = [];
    knownHomework.forEach(function (assignmentId) {
      var stateKey = 'thomas-ssat-assignment-' + assignmentId;
      var state = {};
      try { state = JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch (error) {}
      var saveId = localStorage.getItem(stateKey + '-save-id');
      if (state.submitted && saveId && !items.some(function (item) { return item.assignmentId === assignmentId && item.saveId === saveId; })) items.push({ assignmentId: assignmentId, saveId: saveId });
    });
    return items.slice(-20);
  }

  function request(action, payload) {
    payload.action = action;
    payload.environment = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? 'qa' : 'production';
    return fetch(endpoint, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function (response) { return response.json(); });
  }

  function render(data) {
    var mistakes = data.mistakes || [];
    var reviewed = mistakes.filter(function (item) { return item.cause !== '待确认' && item.reviewed; }).length;
    if (meter) meter.textContent = '已确认 ' + reviewed + ' / ' + mistakes.length;
    if (!mistakes.length) {
      listNode.innerHTML = '<p class="empty-state"><strong>暂无错题记录。</strong><br>正式提交作业或 Mock 后，wrong 与 omitted 会出现在这里。</p>';
      status.textContent = '记录已更新。';
      return;
    }
    listNode.innerHTML = mistakes.map(function (item) {
      var options = causes.map(function (cause) { return '<option value="' + esc(cause) + '"' + (cause === item.cause ? ' selected' : '') + '>' + esc(cause) + '</option>'; }).join('');
      return '<article class="mistake-card" data-mistake-card data-assignment-id="' + esc(item.assignmentId) + '" data-save-id="' + esc(item.saveId) + '" data-item-id="' + esc(item.itemId) + '">' +
        '<header><span class="status-pill status-' + (item.result === 'omitted' ? 'conditional' : 'scheduled') + '">' + (item.result === 'omitted' ? 'omitted' : 'wrong') + '</span><h2>' + esc(item.assignmentTitle) + ' · ' + esc(item.label) + '</h2></header>' +
        '<p class="mistake-meta">' + esc(item.section) + (item.family ? ' · ' + esc(item.family) : '') + '</p>' +
        '<div class="mistake-controls"><label>错因<select data-mistake-cause>' + options + '</select></label>' +
        '<label class="review-check"><input type="checkbox" data-mistake-reviewed' + (item.reviewed ? ' checked' : '') + '> 已完成复盘</label>' +
        '<button class="button button-secondary" type="button" data-save-mistake>保存</button></div>' +
        '<p class="mistake-repair">巩固：' + esc(item.repairState || '待发布') + '</p></article>';
    }).join('');
    bindCards();
    status.textContent = '记录已更新。';
  }

  function bindCards() {
    document.querySelectorAll('[data-save-mistake]').forEach(function (button) {
      button.addEventListener('click', function () {
        var card = button.closest('[data-mistake-card]');
        button.disabled = true;
        status.textContent = '正在保存…';
        request('updateMistake', {
          assignmentId: card.dataset.assignmentId,
          saveId: card.dataset.saveId,
          itemId: card.dataset.itemId,
          cause: card.querySelector('[data-mistake-cause]').value,
          reviewed: card.querySelector('[data-mistake-reviewed]').checked
        }).then(function (result) {
          if (!result.ok) throw new Error(result.error || 'Save failed');
          load();
        }).catch(function () {
          button.disabled = false;
          status.textContent = '暂时未能保存，请稍后再试。';
        });
      });
    });
  }

  function load() {
    var savedSources = sources();
    if (!savedSources.length) { render({ mistakes: [] }); return; }
    status.textContent = '正在读取错题…';
    request('getMistakes', { sources: savedSources }).then(function (result) {
      if (!result.ok) throw new Error(result.error || 'Load failed');
      render(result);
    }).catch(function () { status.textContent = '暂时未能读取错题，请稍后再试。'; });
  }

  var refresh = document.querySelector('[data-refresh-mistakes]');
  if (refresh) refresh.addEventListener('click', load);
  load();
}());
