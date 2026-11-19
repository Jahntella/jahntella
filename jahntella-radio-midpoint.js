/* Jahntella Radio: one tasteful halfway-through cover celebration per playback.
   Separate from song-start bursts, VS battles, lyrics and the player queue. */
(function(){
  'use strict';
  const palettes={
    sweet:['#ff79c7','#ffe6f4','rgba(255,121,199,.42)'],
    shine:['#bb74ff','#f3dcff','rgba(187,116,255,.40)'],
    sparkle:['#66d4f7','#e5fbff','rgba(102,212,247,.38)'],
    siren:['#7ed4b7','#e0fff1','rgba(126,212,183,.39)'],
    surge:['#ff964f','#fff1ce','rgba(255,150,79,.40)']
  };
  const sectionEras={sweetEraAlbum:'sweet',shineEraSneakPeek:'shine',sparkleEraAlbum:'sparkle',sirenEraAlbum:'siren',surgeEraAlbum:'surge'};
  const states=new WeakMap();
  let lastStarted=null,active=null,clearTimer=0;
  const player=()=>document.getElementById('player');
  const titleElement=()=>document.getElementById('playerTitle');
  const coverElement=()=>document.getElementById('playerArtwork');
  const reduceMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const remove=()=>{
    window.clearTimeout(clearTimer);
    if(active){active.remove();active=null}
  };
  const eraFor=(meta)=>{
    const raw=String(meta.era||'').toLowerCase();
    if(palettes[raw])return raw;
    for(const [section,era] of Object.entries(sectionEras)){
      if(raw.toLowerCase()===section.toLowerCase()||raw.includes(era))return era;
    }
    if(meta.key){
      const card=Array.from(document.querySelectorAll('[data-card]')).find(x=>x.dataset.card===meta.key);
      const section=card?.closest('#sweetEraAlbum,#shineEraSneakPeek,#sparkleEraAlbum,#sirenEraAlbum,#surgeEraAlbum');
      if(section&&sectionEras[section.id])return sectionEras[section.id];
      const extra=(window.JAHNTELLA_EXTRA_TRACKS||[]).find(x=>x.key===meta.key);
      if(extra&&palettes[extra.era])return extra.era;
    }
    return 'sweet';
  };
  const currentMeta=()=>{
    const title=titleElement()?.textContent?.trim()||'Your song';
    const art=coverElement()?.getAttribute('src')||'';
    const known=(lastStarted&&lastStarted.title===title)?lastStarted:null;
    const card=Array.from(document.querySelectorAll('[data-card]')).find(x=>x.querySelector('h3')?.textContent?.trim()===title);
    return {key:known?.key||card?.dataset.card||'',title,artwork:known?.artwork||art,era:known?.era||card?.closest('#sweetEraAlbum,#shineEraSneakPeek,#sparkleEraAlbum,#sirenEraAlbum,#surgeEraAlbum')?.id||''};
  };
  function show(meta){
    if(document.hidden||reduceMotion()||document.getElementById('sweetie-battle-showdown'))return;
    if(!meta.artwork)return;
    remove();
    const colors=palettes[eraFor(meta)]||palettes.sweet;
    const root=document.createElement('div');
    root.id='jahntella-radio-midpoint';
    root.setAttribute('aria-hidden','true');
    root.style.setProperty('--radio-color',colors[0]);
    root.style.setProperty('--radio-soft',colors[1]);
    root.style.setProperty('--radio-glow',colors[2]);
    const halo=document.createElement('span');halo.className='jrm-halo';
    const stage=document.createElement('div');stage.className='jrm-stage';
    const img=document.createElement('img');img.alt='';img.decoding='async';img.src=meta.artwork;
    img.onerror=()=>{
      if(img.dataset.fallback)return;
      img.dataset.fallback='1';
      const src=meta.artwork;
      img.src=src.endsWith('.webp')&&!src.endsWith('-thumb.webp')?src.slice(0,-5)+'-thumb.webp':'assets/fun-dipp-cover.webp';
    };
    const flare=document.createElement('span');flare.className='jrm-flare';
    stage.append(img,flare);
    const offsets=[[0,-145],[110,-95],[145,0],[110,105],[0,140],[-110,100],[-150,0],[-105,-95]];
    offsets.forEach(([dx,dy],i)=>{
      const sparkle=document.createElement('span');sparkle.className='jrm-spark';
      sparkle.textContent=i%3?'✦':'✧';
      sparkle.style.setProperty('--dx',dx+'px');sparkle.style.setProperty('--dy',dy+'px');
      sparkle.style.setProperty('--delay',(i%4)*.08+'s');stage.appendChild(sparkle);
    });
    const message=document.createElement('div');message.className='jrm-caption';
    const heading=document.createElement('strong');heading.textContent='You’re listening to “'+meta.title+'”';
    const station=document.createElement('span');station.textContent='on Jahntella Radio ♡';
    const thanks=document.createElement('small');thanks.textContent='Thank you for being here, Sweetie!';
    message.append(heading,station,thanks);
    root.append(halo,stage,message);document.body.appendChild(root);
    active=root;
    clearTimer=window.setTimeout(()=>{if(active===root)remove()},3900);
  }
  // Driven by the main music player's active-track timeupdate event.
  // This keeps the radio moment synced through playlists and next-song changes.
  window.addEventListener('jahntella:radio-midpoint',({detail})=>{
    if(!detail)return;
    lastStarted=detail;
    show(detail);
  });
  window.addEventListener('jahntella:trackstarted',(e)=>{
    lastStarted=e.detail||null;
    remove();
  });
  document.addEventListener('pause',(e)=>{
    if(e.target instanceof HTMLAudioElement)remove();
  },true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)remove()});
  window.addEventListener('jahntella:battle-showdown',remove);
})();
