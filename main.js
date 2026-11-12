(function(){
 var d=document;
 // page transitions
 d.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
  var h=a.getAttribute('href');
  if(a.target==='_blank'||/^(mailto:|tel:|#|http)/.test(h)||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;
  e.preventDefault();d.body.classList.add('leaving');setTimeout(function(){location.href=a.href},260);
 });
 addEventListener('pageshow',function(e){if(e.persisted)d.body.classList.remove('leaving')});
 // marquee-style repeated words
 d.querySelectorAll('.strip').forEach(function(s){
  var w=s.dataset.word,sh=s.dataset.shifts.split(',');s.setAttribute('aria-hidden','true');
  sh.forEach(function(x){var r=d.createElement('span');r.style.setProperty('--s',x+'em');r.textContent=(w+' ').repeat(6);s.appendChild(r)});
 });
 // lookbook rotation: every 3s each photo crossfades to another image from its own section
 var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function show(sl,src){
  var imgs=sl.querySelectorAll('img'),vis=+(imgs[1].style.opacity==1),nx=imgs[1-vis],cu=imgs[vis];
  sl.dataset.cur=src;nx.src='images/'+src+'.webp';
  var go=function(){nx.style.opacity=1;cu.style.opacity=0};
  nx.complete&&nx.naturalWidth?go():nx.onload=go;
 }
 d.querySelectorAll('.sec[data-pool]').forEach(function(sec){
  var pool=sec.dataset.pool.split(','),slots=[].slice.call(sec.querySelectorAll('.rot'));
  pool.forEach(function(p){var i=new Image();i.src='images/'+p+'.webp'});
  if(reduce||pool.length<2)return;
  slots.forEach(function(sl,i){
   setTimeout(function(){setInterval(function(){
    if(d.hidden)return;
    var mine=sl.dataset.cur,shown=slots.map(function(s){return s.dataset.cur});
    var free=pool.filter(function(p){return shown.indexOf(p)<0});
    if(free.length){show(sl,free[Math.floor(Math.random()*free.length)]);return}
    // every image is on screen: trade places with a neighbouring photo
    var others=slots.filter(function(s){return s!==sl&&s.dataset.cur!==mine});
    if(!others.length)return;
    var o=others[Math.floor(Math.random()*others.length)],theirs=o.dataset.cur;
    show(sl,theirs);show(o,mine);
   },3000)},i*1000);
  });
 });
 // product page
 var P=window.PRODUCT;if(!P)return;
 var g=d.querySelector('.gal'),imgs=g.querySelectorAll('img'),sw=d.querySelector('.sw'),cur=0,order=[0,1,2];
 function paint(){imgs.forEach(function(im,i){var s='images/'+P.colors[cur].imgs[order[i]]+'.webp';if(im.getAttribute('src')!==s)im.src=s})}
 function setColor(i,instant){
  if(i===cur&&!instant)return;cur=i;order=[0,1,2];
  sw.querySelectorAll('button').forEach(function(b,k){b.setAttribute('aria-pressed',k===i)});
  var n=d.querySelector('.cname');if(n)n.textContent=P.colors[i].name;
  if(instant){paint();return}
  g.classList.add('fade');setTimeout(function(){paint();g.classList.remove('fade')},230);
 }
 P.colors.forEach(function(c,i){
  var b=d.createElement('button');b.type='button';b.style.setProperty('--c',c.hex);b.title=c.name;b.setAttribute('aria-label',c.name);b.setAttribute('aria-pressed',i===0);
  b.onclick=function(){setColor(i)};sw.appendChild(b);
 });
 g.querySelectorAll('.t').forEach(function(t,k){t.onclick=function(){
  g.classList.add('fade');setTimeout(function(){var m=order[0];order[0]=order[k+1];order[k+1]=m;paint();g.classList.remove('fade')},230)}});
 var h=location.hash.slice(1);P.colors.forEach(function(c,i){if(c.name.toLowerCase()===h)setColor(i,true)});
})();
