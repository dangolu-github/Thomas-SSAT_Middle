(function () {
  'use strict';

  var body = document.body;
  var main = document.querySelector('main');
  var resourceId = body && body.dataset.resourceId;
  var endpoint = body && body.dataset.resourceEndpoint;
  if (!main || !resourceId || !endpoint) return;

  var currentVersion = '';
  var currentItems = [];
  var visibilityKey = 'thomas-class-annotations-visible-' + resourceId;
  var visible = localStorage.getItem(visibilityKey) !== 'false';

  var toolbar = document.createElement('aside');
  toolbar.className = 'class-annotation-toolbar';
  toolbar.hidden = true;
  toolbar.setAttribute('aria-label', '课堂批注');
  var count = document.createElement('span');
  var toggle = document.createElement('button');
  toggle.type = 'button';
  toolbar.appendChild(count);
  toolbar.appendChild(toggle);
  document.body.appendChild(toolbar);

  var dialog = document.createElement('dialog');
  dialog.className = 'class-annotation-dialog';
  dialog.innerHTML = '<div class="class-annotation-dialog-body"><h2>文字批注</h2><p data-class-annotation-quote></p><p data-class-annotation-note></p><button type="button">关闭</button></div>';
  document.body.appendChild(dialog);
  dialog.querySelector('button').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });

  var printNotes = document.createElement('section');
  printNotes.className = 'class-annotation-print-notes';
  printNotes.hidden = true;
  main.appendChild(printNotes);

  function textBlocks() {
    return Array.prototype.slice.call(main.querySelectorAll('p,li,h1,h2,h3,h4')).filter(function (block) {
      return !block.closest('[hidden],dialog,.class-annotation-print-notes') && block.textContent.trim();
    });
  }

  function clearMarks() {
    Array.prototype.slice.call(main.querySelectorAll('[data-class-annotation]')).forEach(function (mark) {
      var parent = mark.parentNode;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
      parent.normalize();
    });
  }

  function locate(item) {
    var blocks = textBlocks();
    var block = blocks.filter(function (candidate) { return candidate.textContent === item.blockText; })[0] || blocks[item.blockIndex];
    if (!block) return null;
    var text = block.textContent;
    var start = item.start;
    if (text !== item.blockText || text.slice(start, item.end) !== item.exact) {
      start = -1;
      var from = 0;
      while (from <= text.length) {
        var found = text.indexOf(item.exact, from);
        if (found < 0) break;
        var prefix = text.slice(Math.max(0, found - item.prefix.length), found);
        var suffix = text.slice(found + item.exact.length, found + item.exact.length + item.suffix.length);
        if ((!item.prefix || prefix === item.prefix) && (!item.suffix || suffix === item.suffix)) {
          start = found;
          break;
        }
        from = found + 1;
      }
    }
    return start < 0 ? null : { block: block, start: start, end: start + item.exact.length };
  }

  function openComment(item) {
    dialog.querySelector('[data-class-annotation-quote]').textContent = '“' + item.exact + '”';
    dialog.querySelector('[data-class-annotation-note]').textContent = item.comment;
    dialog.showModal();
  }

  function wrap(item) {
    var target = locate(item);
    if (!target) return false;
    var walker = document.createTreeWalker(target.block, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var offset = 0;
    var node;
    while ((node = walker.nextNode())) {
      var next = offset + node.nodeValue.length;
      nodes.push({ node: node, start: offset, end: next });
      offset = next;
    }
    nodes.filter(function (part) {
      return part.start < target.end && part.end > target.start;
    }).reverse().forEach(function (part) {
      var start = Math.max(target.start, part.start) - part.start;
      var end = Math.min(target.end, part.end) - part.start;
      if (end <= start) return;
      var range = document.createRange();
      range.setStart(part.node, start);
      range.setEnd(part.node, end);
      var mark = document.createElement(item.type === 'highlight' ? 'mark' : 'span');
      mark.dataset.classAnnotation = item.id;
      if (item.type === 'underline') mark.className = 'class-annotation-underline';
      if (item.type === 'comment') {
        mark.className = 'class-annotation-comment';
        mark.tabIndex = 0;
        mark.setAttribute('role', 'button');
        mark.setAttribute('aria-label', '查看文字批注');
        mark.addEventListener('click', function () { openComment(item); });
        mark.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openComment(item);
          }
        });
      }
      range.surroundContents(mark);
    });
    return true;
  }

  function renderPrintNotes(items) {
    var comments = items.filter(function (item) { return item.type === 'comment'; });
    printNotes.textContent = '';
    printNotes.hidden = !comments.length;
    if (!comments.length) return;
    var title = document.createElement('h2');
    title.textContent = '文字批注';
    var list = document.createElement('ol');
    comments.forEach(function (item) {
      var row = document.createElement('li');
      row.textContent = '“' + item.exact + '”：' + item.comment;
      list.appendChild(row);
    });
    printNotes.appendChild(title);
    printNotes.appendChild(list);
  }

  function render() {
    clearMarks();
    count.textContent = '课堂批注 ' + currentItems.length + ' 条';
    toggle.textContent = visible ? '隐藏' : '显示';
    toolbar.hidden = !currentItems.length;
    renderPrintNotes(currentItems);
    if (!visible) return;
    currentItems.slice().sort(function (a, b) {
      return b.blockIndex - a.blockIndex || b.start - a.start;
    }).forEach(wrap);
  }

  toggle.addEventListener('click', function () {
    visible = !visible;
    localStorage.setItem(visibilityKey, String(visible));
    render();
  });

  function refresh() {
    var url = endpoint + '?action=publishedAnnotations&resourceId=' + encodeURIComponent(resourceId) + '&t=' + Date.now();
    fetch(url, { cache: 'no-store', credentials: 'omit' }).then(function (response) {
      if (!response.ok) throw new Error('request failed');
      return response.json();
    }).then(function (data) {
      if (!data || !data.ok) throw new Error('data unavailable');
      var nextItems = data.available && Array.isArray(data.items) ? data.items : [];
      var nextVersion = String(data.version || '');
      if (nextVersion === currentVersion && nextItems.length === currentItems.length) return;
      currentVersion = nextVersion;
      currentItems = nextItems;
      render();
    }).catch(function () {
      /* Keep the last successfully loaded classroom notes visible. */
    });
  }

  refresh();
  window.setInterval(refresh, 10000);
}());
