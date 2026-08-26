(function(){
  'use strict';
  var config=window.THOMAS_MOCKS||{};
  var number=new URLSearchParams(window.location.search).get('mock')||'2';
  var item=config.items&&config.items[number];
  if(!item)return;
  document.querySelector('[data-mock-label]').textContent=item.label;
  document.querySelector('[data-mock-title]').textContent=item.title;
  document.querySelector('[data-mock-due]').textContent=item.due;
  document.querySelector('[data-mock-source]').textContent=item.source;
  var link=document.querySelector('[data-open-integrated-exam]');
  link.href=String(config.integratedExamBase||'')+encodeURIComponent(number);
  link.setAttribute('aria-label','进入 '+item.label+' 完整题目与作答页面');
}());
