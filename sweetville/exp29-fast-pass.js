(() => {
  'use strict';

  const trigger=document.getElementById('exp290FastPassTrigger');
  const panel=document.getElementById('exp290FastPassPanel');
  const close=document.getElementById('exp290FastPassClose');
  const backTop=document.getElementById('exp290BackTop');
  const fx=document.getElementById('exp290TravelFx');

  if(!trigger||!panel)return;

  const setOpen=open=>{
    panel.classList.toggle('open',open);
    panel.setAttribute('aria-hidden',String(!open));
    trigger.setAttribute('aria-expanded',String(open));
    document.body.style.overflow=open?'hidden':'';
  };

  const reveal=()=>{
    const show=window.scrollY>260 || document.documentElement.scrollHeight<=window.innerHeight+300;
    trigger.classList.toggle('is-visible',show);
  };

  const playWhistle=()=>{
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return;
    const ctx=new Ctx();
    const now=ctx.currentTime;
    [620,780].forEach((freq,i)=>{
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.type='sine';
      osc.frequency.setValueAtTime(freq,now+i*.08);
      gain.gain.setValueAtTime(.0001,now+i*.08);
      gain.gain.exponentialRampToValueAtTime(.045,now+i*.08+.03);
      gain.gain.exponentialRampToValueAtTime(.0001,now+i*.08+.55);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now+i*.08);
      osc.stop(now+i*.08+.6);
    });
    setTimeout(()=>ctx.close(),900);
  };

  trigger.addEventListener('click',()=>setOpen(true));
  close?.addEventListener('click',()=>setOpen(false));
  panel.addEventListener('click',event=>{
    if(event.target===panel)setOpen(false);
  });

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&panel.classList.contains('open'))setOpen(false);
  });

  backTop?.addEventListener('click',()=>{
    setOpen(false);
    playWhistle();
    fx?.classList.add('active');
    setTimeout(()=>fx?.classList.remove('active'),1000);
    window.scrollTo({top:0,behavior:'smooth'});
  });

  panel.querySelectorAll('a').forEach(link=>{
    const current=location.pathname.split('/').pop()||'index.html';
    const href=(link.getAttribute('href')||'').split('#')[0];
    if(href===current){
      link.setAttribute('aria-current','page');
      link.style.borderColor='#ffd56c';
    }
  });

  window.addEventListener('scroll',reveal,{passive:true});
  window.addEventListener('load',reveal);
  reveal();
})();