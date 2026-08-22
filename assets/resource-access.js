(function () {
  'use strict';
  var resourceAccessScript = document.currentScript;
  var body = document.body;
  var resourceId = body.dataset.resourceId;
  var endpoint = body.dataset.resourceEndpoint;
  var content = document.querySelector('[data-resource-content]') || document.querySelector('main:not(.access-gate)');
  if (!resourceId || !endpoint || !content) return;

  function loadClassAnnotations() {
    if (body.dataset.annotations === 'off' || document.querySelector('script[data-class-annotations],script[src*="class-annotations.js"]')) return;
    var assetBase = resourceAccessScript && resourceAccessScript.src ? new URL('./', resourceAccessScript.src) : new URL('../assets/', window.location.href);
    if (!document.querySelector('link[href*="class-annotations.css"]')) {
      var stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = new URL('class-annotations.css', assetBase).href;
      stylesheet.dataset.classAnnotations = 'true';
      document.head.appendChild(stylesheet);
    }
    var script = document.createElement('script');
    script.src = new URL('class-annotations.js', assetBase).href;
    script.defer = true;
    script.dataset.classAnnotations = 'true';
    document.head.appendChild(script);
  }

  loadClassAnnotations();

  function showNotice(title, message) {
    content.innerHTML = '';
    var notice = document.createElement('section');
    notice.className = 'resource-notice';
    var heading = document.createElement('h1');
    heading.textContent = title;
    var copy = document.createElement('p');
    copy.textContent = message;
    notice.append(heading, copy);
    content.append(notice);
  }

  function addLine(parent, label, value) {
    var line = document.createElement('p');
    var strong = document.createElement('strong');
    strong.textContent = label;
    line.append(strong, document.createTextNode(value));
    parent.append(line);
  }

  function renderReveal(data, panel, list) {
    list.textContent = '';
    (data.items || []).forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'resource-reveal-card';
      var heading = document.createElement('h3');
      heading.textContent = item.label;
      card.append(heading);
      addLine(card, '答案：', item.answer);
      addLine(card, '思路：', item.reasoning);
      addLine(card, '最接近的干扰项：', item.closestTrap);
      list.append(card);
    });
    panel.querySelector('[data-resource-reveal-status]').textContent = '讲解已载入。';
    list.hidden = false;
    panel.querySelector('[data-resource-reveal-button]').hidden = true;
  }

  function addRevealPanel() {
    var panel = document.createElement('section');
    panel.className = 'resource-reveal';
    panel.innerHTML = '<div class="resource-reveal-heading"><div><p class="eyebrow">课堂复盘</p><h2>答案与讲解</h2></div><button class="button button-secondary" type="button" data-resource-reveal-button>查看讲解</button></div><p data-resource-reveal-status>讲解已开放。</p><div class="resource-reveal-list" data-resource-reveal-list hidden></div>';
    content.append(panel);
    var button = panel.querySelector('[data-resource-reveal-button]');
    var list = panel.querySelector('[data-resource-reveal-list]');
    button.addEventListener('click', function () {
      button.disabled = true;
      panel.querySelector('[data-resource-reveal-status]').textContent = '正在载入讲解…';
      fetch(endpoint, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getResourceReveal', resourceId: resourceId })
      }).then(function (response) { return response.json(); }).then(function (data) {
        if (!data.ok || !data.available) throw new Error('Not available');
        renderReveal(data, panel, list);
      }).catch(function () {
        panel.querySelector('[data-resource-reveal-status]').textContent = '暂时无法载入，请稍后再试。';
      }).finally(function () { button.disabled = false; });
    });
  }

  fetch(endpoint + '?action=resourceState&resourceId=' + encodeURIComponent(resourceId), { redirect: 'follow' })
    .then(function (response) { return response.json(); })
    .then(function (state) {
      if (!state.ok || !state.accessEnabled) {
        showNotice('暂未开放', '这份学习资料暂未开放。');
        return;
      }
      if (state.revealAvailable) addRevealPanel();
    })
    .catch(function () { showNotice('暂时无法打开', '请稍后再试。'); })
    .finally(function () { body.dataset.resourceReady = 'true'; });
}());
