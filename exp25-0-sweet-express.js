(() => {
  const KEY='jahntellaFunDippCompletedListensV25',GOAL=10;
  const countEl=document.getElementById('exp250PlayCount'),bar=document.getElementById('exp250ProgressBar'),status=document.getElementById('exp250Status'),listen=document.getElementById('exp250ListenButton'),board=document.getElementById('exp250BoardButton'),audio=document.getElementById('audioFunDipp'),play=document.querySelector('[data-track="fun-dipp"]');
  if(!countEl||!bar||!status||!listen||!board||!audio)return;
  let count=Math.max(0,Math.min(GOAL,Number(localStorage.getItem(KEY)||0)));
  const render=()=>{countEl.textContent=count;bar.style.width=`${count/GOAL*100}%`;if(count>=GOAL){status.textContent='The Sweet Express is fully powered. Your ticket is ready!';board.disabled=false;board.classList.add('is-unlocked');board.textContent='🚂 ALL ABOARD!'}else{const r=GOAL-count;status.textContent=`${r} completed listen${r===1?'':'s'} until Bubblegum Bay unlocks.`;board.disabled=true;board.classList.remove('is-unlocked');board.textContent='🚂 All Aboard — Locked'}};
  listen.addEventListener('click',()=>{document.getElementById('music')?.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>play?.click(),550)});
  audio.addEventListener('ended',()=>{if(count>=GOAL)return;count++;localStorage.setItem(KEY,String(count));render();document.getElementById('sweet-express')?.scrollIntoView({behavior:'smooth',block:'center'})});
  render();
})();