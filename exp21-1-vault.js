/* EXP 21.4 */
(() => {
  const run=()=>{
    const m=document.getElementById('cardRevealModal');
    if(!m)return;
    if(m.parentElement!==document.body)document.body.appendChild(m);
    const c=m.querySelector('.reveal-content');
    const open=()=>{const s=getComputedStyle(m);return s.display!=='none'&&s.visibility!=='hidden'&&m.getBoundingClientRect().width>0};
    const unlock=()=>{
      document.body.classList.remove('exp211-reveal-open','exp213-reveal-open','exp214-reveal-open');
      document.documentElement.classList.remove('exp211-reveal-open','exp213-reveal-open','exp214-reveal-open');
      [document.body,document.documentElement].forEach(n=>['overflow','position','touch-action','height'].forEach(x=>n.style.removeProperty(x)));
    };
    const sync=()=>{if(!open())return unlock();document.body.classList.add('exp214-reveal-open');m.scrollTop=0;if(c)c.scrollTop=0;};
    new MutationObserver(sync).observe(m,{attributes:true,attributeFilter:['class','aria-hidden','style']});
    document.getElementById('openPackButton')?.addEventListener('click',()=>{setTimeout(sync,30);setTimeout(sync,250);setTimeout(sync,850)});
    ['closeRevealButton','revealDoneButton'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>{setTimeout(unlock,20);setTimeout(unlock,250)}));
    m.querySelector('.reveal-backdrop')?.addEventListener('click',()=>setTimeout(unlock,100));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setTimeout(unlock,50)});
    window.addEventListener('resize',sync,{passive:true});
    window.visualViewport?.addEventListener('resize',sync,{passive:true});
    window.addEventListener('pageshow',unlock);
    unlock();
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run,{once:true}):run();
})();
