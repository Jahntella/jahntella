(() => {
  'use strict';
  if (window.__jahntellaSweetvilleShineExtensions) return;
  window.__jahntellaSweetvilleShineExtensions = true;

  const EXT = {
    'midnight-rodeo': {
      title: 'Midnight Rodeo',
      audio: '../assets/album2/midnight-rodeo.mp3',
      artwork: '../assets/album2/midnight-rodeo-cover.webp',
      next: 'redline',
      prev: 'boots-smile-attitude'
    },
    redline: {
      title: 'Redline',
      audio: '../assets/album2/redline.mp3',
      artwork: '../assets/album2/redline-cover.webp',
      next: 'fun-dipp',
      prev: 'midnight-rodeo'
    }
  };
  const PLAYBACK_KEY = 'jahntellaSiteMusicV46';
  let audio = null;
  let activeKey = null;
  let savedPosition = 0;
  let originalSrc = '';

  const abs = p => new URL(p, document.baseURI).href;
  const getAudio = () => {
    audio ||= document.getElementById('sweetvilleContinuousMusic');
    if (audio && !originalSrc) originalSrc = audio.currentSrc || audio.src || '';
    return audio;
  };
  const saveState = playing => {
    const current = (() => { try { return JSON.parse(sessionStorage.getItem(PLAYBACK_KEY) || '{}'); } catch { return {}; } })();
    current.track = activeKey || current.track || '';
    current.position = audio?.currentTime || savedPosition || 0;
    current.playing = Boolean(playing);
    current.ended = false;
    current.savedAt = Date.now();
    try { sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify(current)); } catch {}
  };
  const stopOtherMedia = except => {
    document.querySelectorAll('audio,video').forEach(node => { if (node !== except && !node.paused) node.pause(); });
  };
  const renderSpeaker = () => {
    const speaker = document.querySelector('[data-sv421-music-speaker], .sv421-speaker');
    if (!speaker || !activeKey || !audio) return;
    const cfg = EXT[activeKey];
    const title = speaker.querySelector('[data-sv421-title]');
    const toggle = speaker.querySelector('[data-sv421-toggle]');
    const status = speaker.querySelector('[data-sv421-status]');
    const time = speaker.querySelector('[data-sv421-time]');
    const progress = speaker.querySelector('[data-sv421-progress]');
    if (title) title.textContent = cfg.title;
    if (toggle) toggle.textContent = audio.paused ? 'Resume' : 'Pause';
    if (status) status.textContent = audio.paused ? 'Paused' : 'Playing through Sweetville';
    if (time) time.textContent = `${Math.floor((audio.currentTime || 0) / 60)}:${String(Math.floor((audio.currentTime || 0) % 60)).padStart(2,'0')}`;
    if (progress && Number.isFinite(audio.duration) && audio.duration > 0) progress.style.width = `${Math.min(100, (audio.currentTime / audio.duration) * 100)}%`;
  };
  const writeVolume = level => { if (audio) audio.volume = Math.max(0, Math.min(1, Number(level))); };

  const restoreNormal = () => {
    if (!audio || !activeKey) return;
    audio.pause();
    if (originalSrc) { audio.src = originalSrc; audio.load(); }
    activeKey = null;
    savedPosition = 0;
  };

  const start = (key, restart = true) => {
    const el = getAudio();
    const cfg = EXT[key];
    if (!el || !cfg) return;
    stopOtherMedia(el);
    activeKey = key;
    if (restart) savedPosition = 0;
    const src = abs(cfg.audio);
    if (!el.currentSrc.includes(cfg.audio)) {
      el.pause();
      el.src = src;
      el.load();
    }
    const begin = () => {
      try { el.currentTime = restart ? 0 : savedPosition; } catch {}
      el.play().then(() => { saveState(true); renderSpeaker(); }).catch(() => renderSpeaker());
    };
    if (el.readyState >= 1) begin(); else el.addEventListener('loadedmetadata', begin, {once:true});
  };

  const addCard = (key) => {
    const grid = document.querySelector('.exp43-release-grid');
    const cfg = EXT[key];
    if (!grid || !cfg || document.getElementById(`${key}SweetvilleCard`)) return;
    const article = document.createElement('article');
    article.id = `${key}SweetvilleCard`;
    article.className = 'exp43-release-card redline-sweetville-card';
    article.innerHTML = `
      <figure class="exp43-cover redline-sweetville-cover">
        <button type="button" class="redline-sweetville-art" aria-label="Play or pause ${cfg.title}">
          <img src="${abs(cfg.artwork)}" alt="${cfg.title} artwork by Jahntella" loading="lazy" decoding="async">
        </button>
        <span>THE SHINE ERA</span>
      </figure>
      <div class="exp43-release-copy">
        <h3>${cfg.title}</h3>
        <p>Shine Era · full song</p>
        <button class="exp43-play redline-sweetville-play" type="button">▶ Play ${cfg.title}</button>
        <span class="exp43-now">CLICK THE COVER OR PLAY</span>
      </div>`;
    grid.appendChild(article);
    article.querySelector('.redline-sweetville-art')?.addEventListener('click', () => start(key, activeKey !== key));
    article.querySelector('.redline-sweetville-play')?.addEventListener('click', () => start(key, activeKey !== key));
  };

  const handleEnded = event => {
    const el = getAudio();
    if (!el || event.target !== el) return;
    if (!activeKey) {
      try {
        const state = JSON.parse(sessionStorage.getItem(PLAYBACK_KEY) || '{}');
        if (state.track !== 'boots-smile-attitude') return;
      } catch { return; }
      event.stopImmediatePropagation();
      start('midnight-rodeo', true);
      return;
    }
    event.stopImmediatePropagation();
    const next = EXT[activeKey].next;
    if (EXT[next]) { start(next, true); return; }
    restoreNormal();
    window.setTimeout(() => {
      const fun = new URL('../fun-dipp-v430.mp4', document.baseURI).href;
      const a = getAudio();
      if (!a) return;
      a.src = fun;
      a.load();
      try { sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify({track:'fun-dipp',position:0,playing:true,ended:false,credited:false,savedAt:Date.now()})); } catch {}
      a.play().catch(() => {});
    }, 0);
  };

  const bind = () => {
    audio = getAudio();
    if (!audio) return false;
    audio.addEventListener('play', () => { if (activeKey) { stopOtherMedia(audio); saveState(true); renderSpeaker(); } });
    audio.addEventListener('pause', () => { if (activeKey) { savedPosition = audio.currentTime || savedPosition; saveState(false); renderSpeaker(); } });
    audio.addEventListener('timeupdate', () => { if (activeKey) { savedPosition = audio.currentTime; saveState(true); renderSpeaker(); } });
    document.addEventListener('ended', handleEnded, true);

    document.addEventListener('click', event => {
      const target = event.target.closest?.('[data-sv421-toggle],#redlineAestheticCover,#midnightRodeoAestheticCover,.play-button[data-track],.exp42-play');
      if (!target || !activeKey) return;
      if (target.matches('[data-sv421-toggle]')) {
        event.preventDefault(); event.stopImmediatePropagation();
        if (audio.paused) audio.play().then(() => renderSpeaker()); else audio.pause();
        return;
      }
      const title = target.closest('[data-exp42-player]')?.dataset?.exp42Player || '';
      if (title && !EXT[title]) restoreNormal();
    }, true);

    return true;
  };

  const init = () => {
    addCard('midnight-rodeo');
    addCard('redline');
    if (!bind()) window.setTimeout(init, 250);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
