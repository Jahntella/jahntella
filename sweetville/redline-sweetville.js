  if (!/\/sweetville(?:\/|$)/i.test(location.pathname)) return;
(() => {
  'use strict';
  if (window.__jahntellaSweetvilleRedlineLoaded) return;
  window.__jahntellaSweetvilleRedlineLoaded = true;

  const audioUrl = new URL('../assets/album2/redline.mp3', document.baseURI).href;
  const artworkUrl = new URL('../assets/album2/redline-cover.webp', document.baseURI).href;
  const thumbUrl = new URL('../assets/album2/redline-cover-thumb.webp', document.baseURI).href;
  const PLAYBACK_KEY = 'jahntellaSiteMusicV46';
  let audio = null;
  let active = false;
  let redlinePosition = 0;

  const state = () => {
    try { return JSON.parse(sessionStorage.getItem(PLAYBACK_KEY) || '{}'); } catch { return {}; }
  };
  const save = (playing = false) => {
    const current = state();
    current.track = 'redline';
    current.position = audio?.currentTime || redlinePosition || 0;
    current.playing = !!playing;
    current.ended = false;
    current.credited = false;
    current.savedAt = Date.now();
    current.album2Mode = 'full';
    try { sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify(current)); } catch {}
  };
  const renderSpeaker = () => {
    const speaker = document.querySelector('[data-sv421-music-speaker], .sv421-speaker');
    if (!speaker) return;
    const title = speaker.querySelector('[data-sv421-title]');
    const toggle = speaker.querySelector('[data-sv421-toggle]');
    const status = speaker.querySelector('[data-sv421-status]');
    const time = speaker.querySelector('[data-sv421-time]');
    const progress = speaker.querySelector('[data-sv421-progress]');
    if (title) title.textContent = 'Redline';
    if (toggle) toggle.textContent = active && !audio.paused ? 'Pause' : 'Resume';
    if (status) status.textContent = active && !audio.paused ? 'Playing through Sweetville' : 'Paused';
    if (time) {
      const s = audio?.currentTime || redlinePosition || 0;
      time.textContent = `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
    }
    if (progress && audio?.duration) progress.style.width = `${Math.min(100, (audio.currentTime/audio.duration)*100)}%`;
  };
  const stopOthers = except => document.querySelectorAll('audio,video').forEach(node => { if (node !== except && !node.paused) node.pause(); });
  const start = () => {
    if (!audio) return;
    stopOthers(audio);
    if (audio.src !== audioUrl) { audio.pause(); audio.src = audioUrl; audio.load(); }
    active = true;
    const play = () => { try { audio.currentTime = redlinePosition || 0; } catch {} audio.play().then(() => { save(true); renderSpeaker(); }).catch(() => renderSpeaker()); };
    if (audio.readyState >= 1) play(); else audio.addEventListener('loadedmetadata', play, {once:true});
  };

  const addCard = () => {
    const grid = document.querySelector('.exp43-release-grid');
    if (!grid || document.getElementById('sweetvilleRedlineCard')) return;
    const article = document.createElement('article');
    article.id = 'sweetvilleRedlineCard';
    article.className = 'exp43-release-card redline-sweetville-card';
    article.dataset.redlineSweetville = 'true';
    article.innerHTML = `<figure class="exp43-cover redline-sweetville-cover"><button type="button" class="redline-sweetville-art" aria-label="Play Redline"><img src="${thumbUrl}" alt="Redline artwork by Jahntella" loading="lazy" decoding="async"></button><span>THE SHINE ERA</span></figure><div class="exp43-release-copy"><h3>Redline</h3><p>EDM / Rock · The Shine Era</p><button class="exp43-play redline-sweetville-play" type="button">▶ Play Redline</button><span class="exp43-now">CLICK THE COVER OR PLAY</span></div>`;
    grid.appendChild(article);
    article.querySelector('.redline-sweetville-art')?.addEventListener('click', start);
    article.querySelector('.redline-sweetville-play')?.addEventListener('click', start);
  };

  const hook = () => {
    audio = document.getElementById('sweetvilleContinuousMusic');
    if (!audio) return false;
    audio.addEventListener('play', () => { if (active) { stopOthers(audio); save(true); renderSpeaker(); } });
    audio.addEventListener('pause', () => { if (active) { redlinePosition = audio.currentTime; save(false); renderSpeaker(); } });
    audio.addEventListener('timeupdate', () => { if (active) { redlinePosition = audio.currentTime; save(true); renderSpeaker(); } });
    audio.addEventListener('volumechange', renderSpeaker);
    document.addEventListener('ended', event => {
      if (event.target !== audio) return;
      const current = state();
      if (active || current.track === 'redline' || (audio.currentSrc||'').includes('redline')) {
        event.stopImmediatePropagation();
        active = false;
        redlinePosition = 0;
        const fun = new URL('../fun-dipp-v430.mp4', document.baseURI).href;
        audio.src = fun;
        audio.load();
        try { sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify({track:'fun-dipp',position:0,playing:true,ended:false,credited:false,savedAt:Date.now()})); } catch {}
        audio.play().catch(()=>{});
      }
    }, true);
    const speaker = document.querySelector('[data-sv421-toggle]');
    speaker?.addEventListener('click', () => { if (active) { if (audio.paused) start(); else audio.pause(); } });
    return true;
  };

  const init = () => {
    addCard();
    if (!hook()) window.setTimeout(init, 250);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
