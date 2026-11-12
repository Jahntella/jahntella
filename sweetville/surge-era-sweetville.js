(() => {
 const init=()=>{
  const grid=document.querySelector('.exp43-release-grid');if(!grid)return;
  (window.JAHNTELLA_EXTRA_TRACKS||[]).filter(t=>t.era==='Surge').forEach(track=>{
   if(document.getElementById(`${track.key}SweetvilleCard`))return;
   const card=document.createElement('article');card.id=`${track.key}SweetvilleCard`;
   card.dataset.eraTrack=track.key;card.className='exp43-release-card redline-sweetville-card surge-sweetville-card';
   card.innerHTML=`<figure class="exp43-cover redline-sweetville-cover"><button type="button" aria-label="Play ${track.title}"><img src="../${track.artwork}" alt="${track.title} artwork" loading="lazy"></button><span>THE SURGE ERA</span></figure><div class="exp43-release-copy"><h3>${track.title}</h3><p>Surge Era · full song</p><button class="exp43-play" type="button">▶ Play ${track.title}</button></div>`;
   card.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>window.jahntellaSweetvilleToggleTrack?.(track.key)));
   grid.appendChild(card);
  });
  const rank=new Map((window.JAHNTELLA_TRACK_ORDER||[]).map((key,i)=>[key,i]));
  Array.from(grid.querySelectorAll(':scope > [data-era-track]')).sort((a,b)=>(rank.get(a.dataset.eraTrack)??999)-(rank.get(b.dataset.eraTrack)??999)).forEach(node=>grid.appendChild(node));
 };
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
