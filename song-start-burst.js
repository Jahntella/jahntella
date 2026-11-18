/* One celebratory cover spin per confirmed new song start. Never handles clicks or audio. */
(function(){
  'use strict';
  const palettes={
    sweet:['#ff79c7','#ffe6f4','rgba(255,121,199,.42)'],
    shine:['#bb74ff','#f3dcff','rgba(187,116,255,.40)'],
    sparkle:['#66d4f7','#e5fbff','rgba(102,212,247,.38)'],
    siren:['#7ed4b7','#e0fff1','rgba(126,212,183,.39)'],
    surge:['#ff964f','#fff1ce','rgba(255,150,79,.40)']
  };
  const sectionEras={
    sweetEraAlbum:'sweet',shineEraSneakPeek:'shine',sparkleEraAlbum:'sparkle',
    sirenEraAlbum:'siren',surgeEraAlbum:'surge'
  };
  const trackEra=(data)=>{
    if(typeof data.era==='string'&&palettes[data.era.toLowerCase()])return data.era.toLowerCase();
    const card=document.querySelector('[data-card="'+CSS.escape(data.key||'')+'"]');
    const section=card?.closest('#sweetEraAlbum,#shineEraSneakPeek,#sparkleEraAlbum,#sirenEraAlbum,#surgeEraAlbum');
    if(section&&sectionEras[section.id])return sectionEras[section.id];
    if((window.JAHNTELLA_EXTRA_TRACKS||[]).some(t=>t.key===data.key&&t.era)){
      const item=window.JAHNTELLA_EXTRA_TRACKS.find(t=>t.key===data.key);
      const era=(item?.era||'').toLowerCase();if(palettes[era])return era;
    }
    return 'sweet';
  };
  let active=null;
  let cleanupId=0;
  const remove=()=>{
    window.clearTimeout(cleanupId);
    active?.remove();
    active=null;
  };
  window.addEventListener('jahntella:trackstarted',(event)=>{
    const data=event.detail||{};
    // The VS battle has its own two-cover showdown. Never stack the usual
    // spinning single-cover effect on top of that selected song.
    if(window.__jahntellaBattleSuppressKey===data.key){
      window.__jahntellaBattleSuppressKey=null;
      if(Date.now()<Number(window.__jahntellaBattleSuppressUntil||0))return;
    }
    if(!data.artwork||document.hidden)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    remove();
    const era=trackEra(data);
    const colors=palettes[era];
    const root=document.createElement('div');
    root.id='jahntella-song-burst';
    root.setAttribute('aria-hidden','true');
    root.style.setProperty('--burst',colors[0]);
    root.style.setProperty('--burst-soft',colors[1]);
    root.style.setProperty('--burst-glow',colors[2]);
    const halo=document.createElement('span');halo.className='jsb-halo';
    const record=document.createElement('div');record.className='jsb-record';
    const img=document.createElement('img');
    img.alt='';img.decoding='async';img.src=data.artwork;
    img.onerror=()=>{
      if(img.dataset.tried)return;
      img.dataset.tried='1';
      // The main player uses the same thumbnail fallback convention.
      const p=data.artwork;
      if(p.endsWith('.webp')&&!p.endsWith('-thumb.webp'))img.src=p.slice(0,-5)+'-thumb.webp';
      else img.src='assets/fun-dipp-cover.webp';
    };
    const flare=document.createElement('span');flare.className='jsb-flare';
    record.append(img,flare);
    const offsets=[[0,-155],[115,-95],[165,0],[120,115],[0,165],[-130,110],[-170,0],[-110,-100],[-45,-175],[65,175],[170,-75],[-175,75]];
    for(let i=0;i<offsets.length;i++){
      const s=document.createElement('span');s.className='jsb-spark';
      s.textContent=i%3===0?'✦':'✧';
      s.style.setProperty('--dx',offsets[i][0]+'px');
      s.style.setProperty('--dy',offsets[i][1]+'px');
      s.style.setProperty('--delay',(i%5)*.055+'s');
      record.appendChild(s);
    }
    const label=document.createElement('div');label.className='jsb-label';
    label.textContent=data.title||'Now playing';
    root.append(halo,record,label);
    document.body.appendChild(root);
    active=root;
    cleanupId=window.setTimeout(()=>{if(active===root)remove()},2450);
  });
  window.addEventListener('jahntella:battle-showdown',remove);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)remove()});
})();
