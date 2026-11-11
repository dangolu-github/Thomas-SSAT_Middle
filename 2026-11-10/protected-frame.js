document.addEventListener('DOMContentLoaded',function(){var token='';['localStorage','sessionStorage'].some(function(k){try{token=window[k].getItem('thomas-portal-session-v1')||'';}catch(e){}return !!token;});
// Load each protected page only when its frame is on screen: a frame that starts loading off screen can stay blank.
function load(f){f.dataset.loadedAt=String(Date.now());f.src=f.dataset.protectedSrc+(token?'#thomas-session='+encodeURIComponent(token):'');}
var frames=[].slice.call(document.querySelectorAll('iframe[data-protected-src]'));
if(!('IntersectionObserver' in window)){frames.forEach(load);return;}
var io=new IntersectionObserver(function(entries){entries.forEach(function(e){var f=e.target;
if(e.isIntersecting){if(!f.dataset.loadedAt||f.dataset.reload){delete f.dataset.reload;load(f);}}
else if(f.dataset.loadedAt&&Date.now()-Number(f.dataset.loadedAt)<8000){f.dataset.reload='1';}});});
frames.forEach(function(f){io.observe(f);});});
