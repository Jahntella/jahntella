(() => {
  'use strict';
  if (window.__jahntellaShineEraTransport) return;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;
  window.__jahntellaShineEraTransport = true;

  const EXT = {
    'midnight-rodeo': {title:'Midnight Rodeo',audio:'assets/album2/midnight-rodeo.mp3',artwork:'assets/album2/midnight-rodeo-cover.webp',next:'redline',prev:'boots-smile-attitude'},
    redline: {title:'Redline',audio:'assets/album2/redline.mp3',artwork:'assets/album2/redline-cover.webp',next:'fun-dipp',prev:'midnight-rodeo'}
  };
  let audio = null, originalSrc = '', activeKey = null, savedPosition = 0;
  const abs = p => new URL(p, document.baseURI).href;
  const getAudio = () => {
    if (!audio) audio = document.getElementById('audioBootsSmileAttitude');
    if (audio && !originalSrc) originalSrc = audio.currentSrc || audio.src || audio.querySelector('source')?.src || '';
    return audio;
  };
  const stopOtherMedia = except => document.querySelectorAll('audio,video').forEach(n => { if (n !== except && !n.paused) n.pause(); });
  const fmt = s => `${Math.floor((Number(s)||0)/60)}:${String(Math.floor((Number(s)||0)%60)).padStart(2,'0')}`;
  const updatePlayer = playing => {
    if (!activeKey || !audio) return;
    const cfg = EXT[activeKey];
    document.getElementById('player')?.classList.add('visible');
    const title = document.getElementById('playerTitle'); if (title) title.textContent = cfg.title;
    const art = document.getElementById('playerArtwork'); if (art) { art.src = abs(cfg.artwork); art.alt = `${cfg.title} artwork by Jahntella`; }
    const toggle = document.getElementById('playerToggle'); if (toggle) { toggle.textContent = playing ? '❚❚' : '▶'; toggle.setAttribute('aria-label', playing ? `Pause ${cfg.title}` : `Play ${cfg.title}`); }
    const progress = document.getElementById('playerProgress'); if (progress) progress.value = audio.duration > 0 ? String(audio.currentTime / audio.duration * 100) : '0';
    const time = document.getElementById('playerTime'); if (time) time.textContent = fmt(audio.currentTime);
  };
  const restore = () => {
    if (!audio || !activeKey) return;
    audio.pause();
    if (originalSrc) { audio.src = originalSrc; audio.load(); }
    activeKey = null; savedPosition = 0;
  };
  const start = (key, restart=true) => {
    const el = getAudio(), cfg = EXT[key]; if (!el || !cfg) return;
    stopOtherMedia(el); activeKey = key; if (restart) savedPosition = 0;
    try { window.jahntellaSelectSiteTrack?.('boots-smile-attitude', false, {fresh:true}); } catch {}
    const target = abs(cfg.audio), current = el.currentSrc || el.src || '';
    if (!current.includes(cfg.audio)) { el.pause(); el.src = target; el.load(); }
    const begin = () => { try { el.currentTime = restart ? 0 : savedPosition; } catch {} el.play().then(()=>updatePlayer(true)).catch(()=>updatePlayer(false)); };
    if (el.readyState >= 1) begin(); else el.addEventListener('loadedmetadata', begin, {once:true});
  };
  const next = () => { if (!activeKey) return; const n=EXT[activeKey].next; if (EXT[n]) start(n,true); else { restore(); window.jahntellaSelectSiteTrack?.(n,true,{fresh:true}); } };
  const prev = () => { if (!activeKey) return; const p=EXT[activeKey].prev; if (EXT[p]) start(p,true); else { restore(); window.jahntellaSelectSiteTrack?.(p,true,{fresh:true}); } };

  document.addEventListener('ended', e => {
    const el=getAudio(); if (e.target!==el) return;
    e.stopImmediatePropagation();
    if (!activeKey) return start('midnight-rodeo',true);
    const n=EXT[activeKey].next;
    if (EXT[n]) return start(n,true);
    restore(); window.setTimeout(()=>window.jahntellaSelectSiteTrack?.('fun-dipp',true,{fresh:true}),0);
  }, true);

  document.addEventListener('click', e => {
    const t=e.target.closest?.('#playerToggle,#playerNext,#playerPrev,#midnightRodeoAestheticCover,#redlineAestheticCover,.play-button[data-track],[data-jahntella-cover-track]');
    if (!t || !activeKey || !audio) return;
    if (t.id==='playerToggle') { e.preventDefault(); e.stopImmediatePropagation(); audio.paused ? audio.play().then(()=>updatePlayer(true)).catch(()=>{}) : audio.pause(); return; }
    if (t.id==='playerNext') { e.preventDefault(); e.stopImmediatePropagation(); next(); return; }
    if (t.id==='playerPrev') { e.preventDefault(); e.stopImmediatePropagation(); prev(); return; }
    if (t.id==='midnightRodeoAestheticCover' || t.id==='redlineAestheticCover') { e.preventDefault(); e.stopImmediatePropagation(); const k=t.id==='redlineAestheticCover'?'redline':'midnight-rodeo'; if(activeKey===k && !audio.paused){savedPosition=audio.currentTime;audio.pause();updatePlayer(false);}else start(k,activeKey!==k); return; }
    const other=t.dataset.track || t.dataset.jahntellaCoverTrack || ''; if(other && other!=='midnight-rodeo' && other!=='redline') restore();
  }, true);

  document.addEventListener('input', e => {
    if (!activeKey || !audio || e.target?.id!=='playerProgress') return;
    e.stopImmediatePropagation(); if(audio.duration>0) audio.currentTime=(Number(e.target.value)/100)*audio.duration; savedPosition=audio.currentTime; updatePlayer(!audio.paused);
  }, true);

  const wire = () => {
    const el=getAudio(); if(!el) return false;
    el.addEventListener('play',()=>{if(activeKey){stopOtherMedia(el);updatePlayer(true);}});
    el.addEventListener('pause',()=>{if(activeKey){savedPosition=el.currentTime||savedPosition;updatePlayer(false);}});
    el.addEventListener('timeupdate',()=>{if(activeKey){savedPosition=el.currentTime;updatePlayer(!el.paused);}});
    return true;
  };
  if(!wire()){const timer=setInterval(()=>{if(wire())clearInterval(timer);},100);setTimeout(()=>clearInterval(timer),10000);}
  window.jahntellaPlayShineEraTrack=start;
  window.jahntellaStopShineEraTrack=restore;
})();
