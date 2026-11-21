/* Battle showdown overlay: event-driven and independent of the audio queue. */
(function(){
  'use strict';
  const palette={
    sweet:['#ff79c7','#ffe0f2','rgba(255,121,199,.45)'],
    shine:['#bb74ff','#f3dcff','rgba(187,116,255,.44)'],
    sparkle:['#66d4f7','#e5fbff','rgba(102,212,247,.44)'],
    siren:['#7ed4b7','#e0fff1','rgba(126,212,183,.44)'],
    surge:['#ff964f','#fff1ce','rgba(255,150,79,.44)'],
    synergy:['#ee345d','#ffe2e9','rgba(238,52,93,.48)']
  };
  let active=null,cleanupTimer=0;
  const clear=()=>{
    window.clearTimeout(cleanupTimer);
    active?.remove();active=null;
  };
  window.addEventListener('jahntella:battle-showdown',({detail:d})=>{
    if(!d||!Array.isArray(d.pair)||d.pair.length!==2||![0,1].includes(d.winnerIndex))return;
    if(document.hidden||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    clear();
    const winner=d.pair[d.winnerIndex];
    const colors=palette[String(winner.era||'sweet').toLowerCase()]||palette.sweet;
    const root=document.createElement('div');
    root.id='sweetie-battle-showdown';root.setAttribute('aria-hidden','true');
    root.style.setProperty('--sbs-win-color',colors[0]);
    root.style.setProperty('--sbs-win-soft',colors[1]);
    root.style.setProperty('--sbs-win-glow',colors[2]);
    const wash=document.createElement('div');wash.className='sbs-wash';
    const stage=document.createElement('div');stage.className='sbs-stage';
    const pairColors=d.pair.map(t=>palette[String(t.era||'sweet').toLowerCase()]||palette.sweet);
    d.pair.forEach((t,i)=>{
      const cover=document.createElement('div');
      cover.className='sbs-cover '+(i===0?'is-left':'is-right')+' '+(i===d.winnerIndex?'is-winner':'is-loser');
      cover.style.setProperty('--sbs-color',pairColors[i][0]);
      cover.style.setProperty('--sbs-glow',pairColors[i][2]);
      const img=document.createElement('img');
      img.alt='';img.decoding='async';img.src=t.art||'';
      img.onerror=()=>{if(img.dataset.fallback)return;img.dataset.fallback='yes';if(img.src.endsWith('.webp')&&!img.src.endsWith('-thumb.webp'))img.src=img.src.slice(0,-5)+'-thumb.webp';else img.src='assets/fun-dipp-cover.webp';};
      cover.appendChild(img);stage.appendChild(cover);
    });
    const flash=document.createElement('div');flash.className='sbs-flash';
    const burst=document.createElement('div');burst.className='sbs-burst';
    stage.append(flash,burst);
    const offsets=[[0,-210],[135,-160],[205,-50],[175,135],[0,210],[-170,140],[-205,-45],[-135,-175],[70,225],[-70,225],[235,55],[-235,55]];
    for(let i=0;i<offsets.length;i++){
      const s=document.createElement('span');s.className='sbs-particle';
      s.textContent=i%3?'✦':'✧';
      s.style.setProperty('--sbs-dx',offsets[i][0]+'px');
      s.style.setProperty('--sbs-dy',offsets[i][1]+'px');
      stage.appendChild(s);
    }
    const label=document.createElement('div');label.className='sbs-victory';
    const title=document.createElement('strong');title.textContent=winner.title||'Your pick';
    const subtitle=document.createElement('small');subtitle.textContent='♡ YOUR SWEETIE SONG WINNER ♡';
    label.append(title,subtitle);stage.appendChild(label);
    root.append(wash,stage);document.body.appendChild(root);
    active=root;
    cleanupTimer=window.setTimeout(()=>{if(active===root)clear()},4250);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
})();
