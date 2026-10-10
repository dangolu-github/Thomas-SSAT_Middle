(function () {
  'use strict';
  // 错题重练：随机组题 → 一次完成并批改；闪卡自评单独记录。题目、答案和记录都来自已登录的私有服务。
  var endpoint='https://script.google.com/macros/s/AKfycbzF6aQZPpbL34Of--5r8zRZGI8Av2e8zTp11D_w820I9fNzLEAyY_YtvzLZ0-OVPFFw/exec';
  var tokenKey='thomas-ssat-review-session-v2',token='',pool=[],generation=0,detailCache={},pageCache={},run=null,flash=null,mode='full',timer=null;
  var TARGETS={full:{syn:30,ana:30,read:40},half:{syn:15,ana:15,read:20},light:{syn:5,ana:5,readPassages:2}};
  var MODE_NAMES={full:'正式',half:'中等',light:'轻量',flash:'闪卡'};
  var $=function(s){return document.querySelector(s);},$$=function(s){return Array.from(document.querySelectorAll(s));};
  var login=$('[data-practice-login]'),workspace=$('[data-practice-workspace]'),picker=$('[data-mode-picker]'),runSection=$('[data-practice-run]'),resultSection=$('[data-practice-result]'),flashSection=$('[data-flash-run]');
  var poolMeter=$('[data-pool-meter]'),poolStatus=$('[data-pool-status]'),modeStatus=$('[data-mode-status]'),runProgress=$('[data-run-progress]'),runStatus=$('[data-run-status]'),runList=$('[data-practice-list]'),resultList=$('[data-result-list]');
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function session(value){token=value;try{if(value)localStorage.setItem(tokenKey,value);else localStorage.removeItem(tokenKey);}catch(e){}}
  function ref(i){return {assignmentId:i.assignmentId,saveId:i.saveId,receiptTime:i.receiptTime,itemId:i.itemId};}
  function cacheKey(i){return [i.assignmentId,i.saveId,i.receiptTime,i.itemId].join('|');}
  function error(node,e){node.textContent=e&&e.message||'暂时未能完成，请重试。';}
  var requestQueue=[],activeRequests=0;
  function request(action,p){return new Promise(function(resolve,reject){requestQueue.push(function(){return sendRequest(action,p).then(resolve,reject);});drainRequests();});}
  function drainRequests(){while(activeRequests<4&&requestQueue.length){activeRequests++;requestQueue.shift()().finally(function(){activeRequests--;drainRequests();});}}
  function sendRequest(action,p){p=p||{};p.action=action;if(token)p.token=token;
    var controller=new AbortController(),deadline=setTimeout(function(){controller.abort();},60000);
    return fetch(endpoint,{method:'POST',redirect:'follow',signal:controller.signal,headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(p)}).then(function(r){if(!r.ok)throw new Error('暂时无法连接，请重试。');return r.json();}).then(function(r){if(!r.ok){if(/重新输入网站访问密码/.test(r.error||''))lock();throw new Error(r.error||'暂时未能完成，请重试。');}return r;}).catch(function(e){if(e.name==='AbortError')throw new Error('读取时间较长，请稍后重试。');throw e;}).finally(function(){clearTimeout(deadline);});
  }
  function lock(){stopTimer();run=null;flash=null;session('');generation++;pool=[];detailCache={};pageCache={};workspace.hidden=true;login.hidden=false;showOnly(picker);}
  function showOnly(section){[picker,runSection,resultSection,flashSection].forEach(function(s){s.hidden=s!==section;});}
  function kindOf(i){if(i.questionType==='Synonyms')return 'syn';if(i.questionType==='Analogies')return 'ana';return 'read';}
  function active(){var excludeStable=$('[data-opt-exclude-stable]').checked;return pool.filter(function(i){return !i.removed&&(!excludeStable||!i.stable);});}
  function shuffle(list){var a=list.slice();for(var n=a.length-1;n>0;n--){var j=Math.floor(Math.random()*(n+1)),t=a[n];a[n]=a[j];a[j]=t;}return a;}
  function rank(i){return (i.streak||0)>0?1:0;}
  function ordered(list){var s=shuffle(list);if($('[data-opt-priority]').checked)s.sort(function(a,b){return rank(a)-rank(b);});return s;}
  function questionNumber(i){var m=String(i.label||'').match(/(\d+)\s*$/);return m?Number(m[1]):0;}
  function passages(list){var groups={},order=[];list.forEach(function(i){var k=i.passageKey||('solo:'+i.itemId);if(!groups[k]){groups[k]=[];order.push(k);}groups[k].push(i);});
    return order.map(function(k){var items=groups[k].slice().sort(function(a,b){return questionNumber(a)-questionNumber(b);});return {key:k,items:items,rank:Math.min.apply(null,items.map(rank))};});}
  function pickReading(list,target){var ps=shuffle(passages(list));if($('[data-opt-priority]').checked)ps.sort(function(a,b){return a.rank-b.rank;});var out=[],count=0;
    for(var n=0;n<ps.length;n++){if(target.readPassages?out.length>=target.readPassages:count>=target.read)break;out.push(ps[n]);count+=ps[n].items.length;}return out;}
  function buildSet(m){var t=TARGETS[m],list=active(),syn=ordered(list.filter(function(i){return kindOf(i)==='syn';})).slice(0,t.syn),ana=ordered(list.filter(function(i){return kindOf(i)==='ana';})).slice(0,t.ana),read=pickReading(list.filter(function(i){return kindOf(i)==='read';}),t);
    var groups=[];if(syn.length)groups.push({title:'Synonyms · 同义词',items:syn});if(ana.length)groups.push({title:'Analogies · 类比',items:ana});read.forEach(function(p,n){groups.push({title:'Reading · 阅读 '+(n+1),items:p.items,passage:true});});
    var seq=0;groups.forEach(function(g){g.items.forEach(function(i){seq++;i._seq=seq;});});return {groups:groups,count:seq,shortfall:{syn:t.syn-syn.length,ana:t.ana-ana.length,read:t.readPassages?Math.max(0,t.readPassages-read.length):Math.max(0,t.read-read.reduce(function(n,p){return n+p.items.length;},0))}};}
  function describeCounts(){var list=active(),c={syn:0,ana:0,read:0},pk={};list.forEach(function(i){c[kindOf(i)]++;if(kindOf(i)==='read')pk[i.passageKey||i.itemId]=true;});var passageCount=Object.keys(pk).length;
    poolMeter.textContent='可抽题库：同义词 '+c.syn+' 题 · 类比 '+c.ana+' 题 · 阅读 '+c.read+' 题（'+passageCount+' 篇）';
    ['full','half','light'].forEach(function(m){var t=TARGETS[m],s=Math.min(t.syn,c.syn),a=Math.min(t.ana,c.ana),r=t.readPassages?Math.min(t.readPassages,passageCount)+' 篇':'约 '+Math.min(t.read,c.read)+' 题';var short=(s<t.syn||a<t.ana);$('[data-mode-count="'+m+'"]').textContent='本次：同义词 '+s+' · 类比 '+a+' · 阅读 '+r+(short?'（题库不足，用现有全部）':'');});
    $('[data-mode-count="flash"]').textContent='可用：同义词 '+c.syn+' 张 · 类比 '+c.ana+' 张';
  }
  function load(){var g=++generation;poolStatus.textContent='正在读取错题本…';return request('mistakeReviewList').then(function(r){if(g!==generation)return;pool=r.mistakes||[];login.hidden=true;workspace.hidden=false;describeCounts();poolStatus.textContent='已读取 '+pool.filter(function(i){return !i.removed;}).length+' 道清单中的错题。';}).catch(function(e){error(poolStatus,e);if(!token)$('[data-login-status]').textContent=e.message;});}
  function fetchDetails(items,withAnswer){var missing=items.filter(function(i){var k=cacheKey(i)+(withAnswer?'|a':'');return !detailCache[k];}),batches=[];for(var n=0;n<missing.length;n+=25)batches.push(missing.slice(n,n+25));
    return Promise.all(batches.map(function(batch){return request('mistakeReviewDetailMany',{items:batch.map(ref),withAnswer:withAnswer===true}).then(function(r){(r.details||[]).forEach(function(d,n){if(d&&d.ok!==false)detailCache[cacheKey(batch[n])+(withAnswer?'|a':'')]=d;});});})).then(function(){return items.map(function(i){return detailCache[cacheKey(i)+(withAnswer?'|a':'')]||null;});});}
  function fetchPage(i,pageKey){var k=cacheKey(i)+'|'+pageKey;if(pageCache[k])return Promise.resolve(pageCache[k]);return request('mistakeReviewPage',Object.assign(ref(i),{pageKey:pageKey})).then(function(r){pageCache[k]=r;return r;});}
  function passageHtml(d){return (d.passages||[]).map(function(p){return '<details class="review-passage" open><summary>阅读原文</summary><div class="review-passage-text">'+esc(p)+'</div></details>';}).join('');}
  function itemHtml(i,d,interactive){var opts=d?d.options:['','','','',''];
    return '<article class="practice-item" data-seq="'+i._seq+'" id="q'+i._seq+'"><h4><span class="practice-seq">'+i._seq+'.</span> <span lang="en">'+esc(d?d.prompt:'正在读取题目…')+'</span></h4><span class="practice-source">'+esc(i.assignmentTitle)+' · '+esc(i.label)+(d&&d.sourcePages&&d.sourcePages.length?' · 原书题号 '+esc(d.sourceNumber)+'，请在原文页中找到对应题目':'')+'</span><div data-pages></div>'
      +(interactive?'<fieldset><legend>第 '+i._seq+' 题的答案</legend>'+opts.map(function(o,n){var L='ABCDE'[n];return '<label class="practice-choice"><input type="radio" name="p-'+i._seq+'" value="'+L+'"><b>'+L+'</b><span lang="en">'+esc(o||'见原文页')+'</span></label>';}).join('')+'</fieldset>'
      :'<ol class="review-options" type="A" lang="en">'+opts.map(function(o){return '<li>'+esc(o||'见原文页')+'</li>';}).join('')+'</ol>')+'<div data-result-slot></div></article>';}
  function renderGroups(container,groups,interactive){container.innerHTML=groups.map(function(g){var first=g.items[0],d=detailCache[cacheKey(first)];
    return '<section class="practice-group"><h3>'+esc(g.title)+' <small>'+g.items.length+' 题</small></h3>'+(g.passage&&d?passageHtml(d):'')+g.items.map(function(i){return itemHtml(i,detailCache[cacheKey(i)],interactive);}).join('')+'</section>';}).join('');
    groups.forEach(function(g){g.items.forEach(function(i){var d=detailCache[cacheKey(i)];if(!d||!d.sourcePages||!d.sourcePages.length)return;var node=container.querySelector('#q'+i._seq+' [data-pages]');
      d.sourcePages.forEach(function(page,index){var el=document.createElement('div');node.appendChild(el);el.textContent='正在读取原文页…';function loadPage(){return fetchPage(i,page.key).then(function(r){el.innerHTML='<button type="button" class="review-source-link" aria-label="放大原文第 '+(index+1)+' 页"><img alt="原文与选项，第 '+(index+1)+' 页"></button>';el.querySelector('img').src=r.dataUrl;el.querySelector('button').onclick=function(){var dialog=document.createElement('dialog');dialog.className='review-zoom';dialog.innerHTML='<button type="button">关闭原文</button><div><img alt="放大的原文与选项"></div>';dialog.querySelector('img').src=r.dataUrl;document.body.appendChild(dialog);dialog.querySelector('button').onclick=function(){dialog.close();};dialog.addEventListener('close',function(){dialog.remove();});dialog.showModal();};}).catch(function(e){el.innerHTML='<p>'+esc(e.message)+'</p><button type="button" class="button button-secondary">重试原文页</button>';el.querySelector('button').onclick=loadPage;});}loadPage();});});});}
  function startTimer(){stopTimer();timer=setInterval(updateProgress,1000);}
  function stopTimer(){if(timer)clearInterval(timer);timer=null;}
  function elapsed(){return run?Math.floor((Date.now()-run.startedAt)/1000):0;}
  function mmss(s){return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);}
  function answered(){return run?run.items.filter(function(i){return runList.querySelector('input[name="p-'+i._seq+'"]:checked');}).length:0;}
  function updateProgress(){if(!run)return;runProgress.textContent='本组 '+run.items.length+' 题 · 已作答 '+answered()+' 题 · 用时 '+mmss(elapsed())+(run.submitting?' · 正在批改…':'');}
  function startPractice(m){var set=buildSet(m);if(!set.count){modeStatus.textContent='题库里没有可抽的题目。可以取消“不抽稳定题”，或先在错题本里恢复题目。';return;}
    run={mode:m,groups:set.groups,items:[].concat.apply([],set.groups.map(function(g){return g.items;})),startedAt:Date.now(),requestId:window.crypto.randomUUID(),submitting:false};
    var note=[];if(set.shortfall.syn>0)note.push('同义词少 '+set.shortfall.syn+' 题');if(set.shortfall.ana>0)note.push('类比少 '+set.shortfall.ana+' 题');if(set.shortfall.read>0)note.push('阅读不足');
    $('[data-run-title]').textContent=MODE_NAMES[m]+' · 本组 '+run.items.length+' 题'+(note.length?'（题库不足：'+note.join('，')+'，已用现有全部）':'');
    runStatus.textContent='正在读取题目…';$('[data-submit]').disabled=true;$('[data-submit-bottom]').disabled=true;resetAbandon();showOnly(runSection);renderGroups(runList,run.groups,true);updateProgress();startTimer();$('[data-run-title]').focus();
    var current=run;fetchDetails(current.items,false).then(function(){if(run!==current)return;renderGroups(runList,run.groups,true);runList.addEventListener('change',updateProgress);runStatus.textContent='';$('[data-submit]').disabled=false;$('[data-submit-bottom]').disabled=false;updateProgress();}).catch(function(e){if(run===current)error(runStatus,e);});
  }
  function resetAbandon(){$('[data-abandon]').hidden=false;$('[data-abandon-confirm]').hidden=true;$('[data-abandon-cancel]').hidden=true;}
  function submitPractice(){if(!run||run.submitting)return;var current=run,missing=current.items.find(function(i){return !runList.querySelector('input[name="p-'+i._seq+'"]:checked');});
    if(missing){runStatus.textContent='第 '+missing._seq+' 题还没作答，请完成后再批改。';var node=runList.querySelector('#q'+missing._seq);if(node){if(node.scrollIntoView)node.scrollIntoView({block:'center',behavior:'instant'});node.querySelector('input').focus();}return;}
    current.submitting=true;current.durationSec=elapsed();stopTimer();updateProgress();runStatus.textContent='正在批改本组 '+current.items.length+' 题…';$('[data-submit]').disabled=true;$('[data-submit-bottom]').disabled=true;$$('[data-practice-list] input').forEach(function(x){x.disabled=true;});
    var answers=current.items.map(function(i){return Object.assign(ref(i),{choice:runList.querySelector('input[name="p-'+i._seq+'"]:checked').value});});
    request('mistakeReviewPractice',{mode:current.mode,requestId:current.requestId,durationSec:current.durationSec,answers:answers}).then(function(r){if(run!==current)return;showResult(current,answers,r);}).catch(function(e){if(run!==current)return;current.submitting=false;$$('[data-practice-list] input').forEach(function(x){x.disabled=false;});$('[data-submit]').disabled=false;$('[data-submit-bottom]').disabled=false;$('[data-submit]').textContent='重试批改';$('[data-submit-bottom]').textContent='重试批改';runStatus.textContent=(e.message||'暂时未能完成')+' 答案已保留，请重试批改。';startTimer();});
  }
  function showResult(current,answers,r){run=null;stopTimer();$('[data-submit]').textContent='完成并批改';$('[data-submit-bottom]').textContent='完成并批改';
    var byItem={};(r.results||[]).forEach(function(x){byItem[x.assignmentId+'|'+x.itemId]=x;});
    current.items.forEach(function(i){var x=byItem[i.assignmentId+'|'+i.itemId];var p=pool.find(function(q){return q.assignmentId===i.assignmentId&&q.itemId===i.itemId;});if(x&&p){p.wrongTimes=x.wrongTimes;p.streak=x.streak;p.stable=Boolean(x.stable);p.redoCount=(p.redoCount||0)+1;p.lastRedo={correct:x.correct};}});
    $('[data-result-title]').textContent=MODE_NAMES[current.mode]+' · 本组批改结果';
    $('[data-result-summary]').textContent='本组 '+r.total+' 题，答对 '+r.correct+' 题，答错 '+r.wrong+' 题 · 用时 '+mmss(current.durationSec||0)+'。答错的题错误次数 +1，答对的题连对 +1；原作业成绩不变。'+(r.duplicate?'（本组之前已批改过，结果保持不变。）':'');
    renderGroups(resultList,current.groups,false);$('[data-show-all-answers]').setAttribute('aria-pressed','false');$('[data-show-all-answers]').textContent='显示全部答案';
    current.items.forEach(function(i){var x=byItem[i.assignmentId+'|'+i.itemId],node=resultList.querySelector('#q'+i._seq),slot=node&&node.querySelector('[data-result-slot]');if(!x||!slot)return;node.classList.add(x.correct?'is-correct':'is-wrong');
      slot.innerHTML='<p class="practice-result-line">'+(x.correct?'答对了':'答错了')+' · 你的选择：'+esc(x.choice)+'</p><p class="practice-counts">错 '+x.wrongTimes+' 次 · 连对 '+x.streak+' 次'+(x.stable?' · 已进入稳定题':'')+'</p><button class="button button-secondary" type="button" data-answer-toggle aria-expanded="false">显示答案</button><div class="practice-answer" hidden><p>正确答案：<strong>'+esc(x.correctAnswer)+'</strong> <span lang="en">'+esc(x.correctText)+'</span></p></div>';
      var btn=slot.querySelector('[data-answer-toggle]'),box=slot.querySelector('.practice-answer');btn.addEventListener('click',function(){var open=box.hidden;box.hidden=!open;btn.textContent=open?'隐藏答案':'显示答案';btn.setAttribute('aria-expanded',open?'true':'false');});});
    describeCounts();showOnly(resultSection);$('[data-result-title]').focus();
  }
  function startFlash(){var kind=$('[data-flash-kind]').value,size=$('[data-flash-size]').value,list=ordered(active().filter(function(i){var k=kindOf(i);return k!=='read'&&(kind==='both'||k===kind);}));
    if(size!=='all')list=list.slice(0,Number(size));if(!list.length){modeStatus.textContent='题库里没有可用的 Verbal 题目。';return;}
    flash={items:list,index:0,marks:[],requestId:window.crypto.randomUUID(),startedAt:Date.now(),saved:false};showOnly(flashSection);$('[data-flash-done]').hidden=true;$('[data-flash-status]').textContent='正在读取闪卡…';$('[data-flash-flip]').disabled=true;
    var current=flash;fetchDetails(list,true).then(function(){if(flash!==current)return;$('[data-flash-status]').textContent='';$('[data-flash-flip]').disabled=false;showCard();$('#flash-title').focus();}).catch(function(e){if(flash===current)error($('[data-flash-status]'),e);});
  }
  function showCard(){if(!flash)return;var i=flash.items[flash.index],d=detailCache[cacheKey(i)+'|a'];$('[data-flash-progress]').textContent='第 '+(flash.index+1)+' / '+flash.items.length+' 张 · 会了 '+flash.marks.filter(function(m){return m.known;}).length+' · 再练 '+flash.marks.filter(function(m){return !m.known;}).length;
    $('[data-flash-front]').innerHTML='<h3 lang="en">'+esc(d?d.prompt:i.prompt)+'</h3><span class="practice-source">'+esc(i.questionType)+' · '+esc(i.assignmentTitle)+' · '+esc(i.label)+'</span>';
    $('[data-flash-back]').innerHTML=d?'<p class="flash-key">正确答案：'+esc(d.correctAnswer)+' <span lang="en">'+esc(d.correctText)+'</span></p><ol type="A" lang="en">'+d.options.map(function(o,n){return '<li'+('ABCDE'[n]===d.correctAnswer?' class="is-key"':'')+'>'+esc(o)+'</li>';}).join('')+'</ol>':'<p>暂时读不到这张卡的答案，可以跳过。</p>';
    $('[data-flash-back]').hidden=true;$('[data-flash-flip]').hidden=false;$('[data-flash-known]').hidden=true;$('[data-flash-again]').hidden=true;$('[data-flash-flip]').focus();}
  function flipCard(){$('[data-flash-back]').hidden=false;$('[data-flash-flip]').hidden=true;$('[data-flash-known]').hidden=false;$('[data-flash-again]').hidden=false;$('[data-flash-known]').focus();}
  function markCard(known){if(!flash)return;var i=flash.items[flash.index];flash.marks.push(Object.assign(ref(i),{known:known}));flash.index++;if(flash.index<flash.items.length){showCard();return;}
    var k=flash.marks.filter(function(m){return m.known;}).length;$('[data-flash-progress]').textContent='这组闪卡已看完。';$('[data-flash-card]').hidden=true;$('[data-flash-flip]').hidden=true;$('[data-flash-known]').hidden=true;$('[data-flash-again]').hidden=true;
    $('[data-flash-summary]').textContent='共 '+flash.items.length+' 张：会了 '+k+' 张，再练 '+(flash.items.length-k)+' 张。点“完成并记录”保存这组自评。';$('[data-flash-done]').hidden=false;$('[data-flash-save]').disabled=false;$('[data-flash-save]').focus();}
  function saveFlash(){if(!flash||flash.saved)return;var current=flash;$('[data-flash-save]').disabled=true;$('[data-flash-status]').textContent='正在记录…';
    request('mistakeReviewFlash',{requestId:current.requestId,durationSec:Math.floor((Date.now()-current.startedAt)/1000),marks:current.marks}).then(function(r){if(flash!==current)return;current.saved=true;$('[data-flash-status]').textContent='已记录：会了 '+r.known+' 张，再练 '+r.again+' 张。闪卡自评不计入错误次数和连对次数。';current.items.forEach(function(i,n){var p=pool.find(function(q){return q.assignmentId===i.assignmentId&&q.itemId===i.itemId;}),m=current.marks[n];if(p&&m){p.flash=p.flash||{known:0,again:0};if(m.known)p.flash.known++;else p.flash.again++;}});}).catch(function(e){if(flash!==current)return;error($('[data-flash-status]'),e);$('[data-flash-save]').disabled=false;});}
  function resetFlashView(){$('[data-flash-card]').hidden=false;$('[data-flash-done]').hidden=true;$('[data-flash-status]').textContent='';}
  $$('[data-mode]').forEach(function(b){b.addEventListener('click',function(){mode=b.dataset.mode;$$('[data-mode]').forEach(function(x){x.setAttribute('aria-checked',x===b?'true':'false');});$('[data-flash-options]').hidden=mode!=='flash';modeStatus.textContent='';});});
  $('[data-start]').addEventListener('click',function(){modeStatus.textContent='';if(mode==='flash')startFlash();else startPractice(mode);});
  $('[data-submit]').addEventListener('click',submitPractice);$('[data-submit-bottom]').addEventListener('click',submitPractice);
  $('[data-abandon]').addEventListener('click',function(){$('[data-abandon]').hidden=true;$('[data-abandon-confirm]').hidden=false;$('[data-abandon-cancel]').hidden=false;runStatus.textContent='放弃后本组不会记录。';$('[data-abandon-confirm]').focus();});
  $('[data-abandon-cancel]').addEventListener('click',function(){resetAbandon();runStatus.textContent='';});
  $('[data-abandon-confirm]').addEventListener('click',function(){if(run&&run.submitting)return;run=null;stopTimer();resetAbandon();runStatus.textContent='';runList.innerHTML='';showOnly(picker);modeStatus.textContent='已放弃上一组，没有记录。';$('[data-start]').focus();});
  $('[data-again]').addEventListener('click',function(){startPractice(mode==='flash'?'light':mode);});
  $('[data-back-modes]').addEventListener('click',function(){showOnly(picker);$('[data-start]').focus();});
  $('[data-show-all-answers]').addEventListener('click',function(){var b=$('[data-show-all-answers]'),open=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',open?'true':'false');b.textContent=open?'隐藏全部答案':'显示全部答案';$$('[data-result-list] .practice-answer').forEach(function(x){x.hidden=!open;});$$('[data-result-list] [data-answer-toggle]').forEach(function(x){x.textContent=open?'隐藏答案':'显示答案';x.setAttribute('aria-expanded',open?'true':'false');});});
  $('[data-flash-flip]').addEventListener('click',flipCard);$('[data-flash-known]').addEventListener('click',function(){markCard(true);});$('[data-flash-again]').addEventListener('click',function(){markCard(false);});
  $('[data-flash-save]').addEventListener('click',saveFlash);$('[data-flash-restart]').addEventListener('click',function(){resetFlashView();startFlash();});
  $('[data-flash-quit]').addEventListener('click',function(){flash=null;resetFlashView();showOnly(picker);$('[data-start]').focus();});
  login.addEventListener('submit',function(e){e.preventDefault();var input=login.querySelector('input'),button=login.querySelector('button'),msg=$('[data-login-status]'),password=input.value;button.disabled=true;msg.textContent='正在打开…';
    request('mistakeReviewLogin',{password:password}).then(function(r){session(r.token);input.value='';msg.textContent='';return load();}).catch(function(e){error(msg,e);}).finally(function(){password='';button.disabled=false;});});
  $('[data-practice-lock]').addEventListener('click',lock);
  try{token=localStorage.getItem(tokenKey)||'';}catch(e){}
  if(token){workspace.hidden=false;login.hidden=true;showOnly(picker);load();}else{login.hidden=false;workspace.hidden=true;}
}());
