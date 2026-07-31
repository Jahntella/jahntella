(() => {
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];
  const home = $('#cinematicHome');
  const stars = $('#cinematicStars');
  if (stars) {
    for (let i=0;i<80;i++) {
      const star=document.createElement('i');
      star.style.left=Math.random()*100+'%'; star.style.top=Math.random()*75+'%';
      star.style.setProperty('--d',(1.5+Math.random()*4)+'s'); star.style.animationDelay=(-Math.random()*5)+'s';
      stars.append(star);
    }
  }
  const readState=()=>{try{return JSON.parse(localStorage.getItem('jahntellaSweetvilleV4'))||{}}catch{return {}}};
  const syncStats=()=>{
    const s=readState();
    const set=(sel,val)=>{const el=$(sel);if(el)el.textContent=val};
    set('#cinematicCollectibles',`${(s.collectibles||[]).length} / 5`);
    set('#cinematicQuests',`${(s.badges||[]).length} / 10`);
    set('#cinematicHearts',`${(s.hearts||[]).length} / 5`);
    set('#cinematicVisits',(s.visited||[]).length);
  };
  syncStats(); window.addEventListener('storage',syncStats); setInterval(syncStats,1800);
  $$('.district-card').forEach(card=>card.addEventListener('click',()=>{
    const slug=card.dataset.openLocation;
    if(slug){
      const target=$(`.world-location[data-location="${slug}"]`);
      $('#livingMap')?.scrollIntoView({behavior:'smooth'});
      setTimeout(()=>target?.click(),650);
    } else if(card.dataset.scrollTarget) $('#'+card.dataset.scrollTarget)?.scrollIntoView({behavior:'smooth'});
  }));
  $('#watchSweetvilleIntro')?.addEventListener('click',()=>{
    home.classList.add('intro-active');
    setTimeout(()=>home.classList.remove('intro-active'),4200);
    launchBurst(innerWidth*.68,innerHeight*.22,42);
    launchBurst(innerWidth*.82,innerHeight*.28,34);
  });

  const canvas=$('#fireworksCanvas'), ctx=canvas?.getContext('2d'); let particles=[];
  const resize=()=>{if(!canvas)return;canvas.width=canvas.clientWidth*devicePixelRatio;canvas.height=canvas.clientHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};
  resize(); addEventListener('resize',resize);
  function launchBurst(x,y,count=28){for(let i=0;i<count;i++){const a=Math.PI*2*i/count+Math.random()*.2,s=1.2+Math.random()*3.5;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,h:310+Math.random()*50})}}
  function animate(){if(!ctx)return;ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);particles=particles.filter(p=>p.life>.02);for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.018;p.vx*=.992;p.life*=.974;ctx.beginPath();ctx.arc(p.x,p.y,1.2,0,Math.PI*2);ctx.fillStyle=`hsla(${p.h},100%,70%,${p.life})`;ctx.shadowBlur=12;ctx.shadowColor=`hsl(${p.h},100%,60%)`;ctx.fill()}requestAnimationFrame(animate)}animate();
  setInterval(()=>{if(document.visibilityState==='visible'&&innerWidth>700)launchBurst(innerWidth*(.58+Math.random()*.34),80+Math.random()*220,18+Math.random()*22)},3000);
})();

// v4.0.5: connect the clean hero sound button to the existing world sound control.
document.getElementById('heroSoundButton')?.addEventListener('click',()=>document.getElementById('soundToggle')?.click());

// Sweetville v4.0.6 — Living World polish
(()=>{const hero=document.getElementById('cinematicHome');if(!hero||hero.dataset.polishReady==='true')return;hero.dataset.polishReady='true';const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const layer=document.createElement('div');layer.className='sv-ambient-layer';layer.setAttribute('aria-hidden','true');hero.appendChild(layer);if(!reduced){const sc=innerWidth<700?16:34;for(let i=0;i<sc;i++){const e=document.createElement('i');e.className='sv-spark';e.style.left=Math.random()*100+'%';e.style.top=(18+Math.random()*75)+'%';e.style.setProperty('--spark-size',(2+Math.random()*3)+'px');e.style.setProperty('--spark-duration',(6+Math.random()*8)+'s');e.style.setProperty('--spark-delay',(-Math.random()*12)+'s');e.style.setProperty('--spark-drift',(-35+Math.random()*70)+'px');layer.appendChild(e)}const pc=innerWidth<700?5:10;for(let i=0;i<pc;i++){const e=document.createElement('span');e.className='sv-heart-petal';e.textContent=i%3===0?'♡':'✦';e.style.left=Math.random()*100+'%';e.style.setProperty('--petal-size',(9+Math.random()*10)+'px');e.style.setProperty('--petal-duration',(10+Math.random()*10)+'s');e.style.setProperty('--petal-delay',(-Math.random()*16)+'s');e.style.setProperty('--petal-drift',(-70+Math.random()*140)+'px');layer.appendChild(e)}let raf=0;hero.addEventListener('pointermove',ev=>{if(innerWidth<900)return;cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const r=hero.getBoundingClientRect(),x=((ev.clientX-r.left)/r.width-.5)*-14,y=((ev.clientY-r.top)/r.height-.5)*-8;hero.style.setProperty('--sv-parallax-x',x.toFixed(2)+'px');hero.style.setProperty('--sv-parallax-y',y.toFixed(2)+'px')})},{passive:true});hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--sv-parallax-x','0px');hero.style.setProperty('--sv-parallax-y','0px')},{passive:true})}document.querySelectorAll('.location-card img').forEach(img=>{img.loading='lazy';img.decoding='async'})})();
