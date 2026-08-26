(() => {
  'use strict';
  if (window.__jahntellaShineUnifiedControls) return;
  window.__jahntellaShineUnifiedControls = true;

  const CORE = {
    'sweet-dreams': { id: 'audioSweetDreams', src: 'sweetville/sweet-dreams.mp3' },
    'we-are-1': { id: 'audioWeAre1', src: 'sweetville/we-are-1.mp3' },
    'boots-smile-attitude': { id: 'audioBootsSmileAttitude', src: 'sweetville/boots-smile-attitude.mp3' }
  };

  const cardFor = key => document.querySelector(`.shine-era-song-card[data-card="${key}"]`);

  const syncVisual = key => {
    const cfg = CORE[key];
    const audio = document.getElementById(cfg.id);
    const card = cardFor(key);
    if (!audio || !card) return;
    const playing = !audio.paused && !audio.ended;
    card.classList.toggle('is-active', playing);
    const cover = card.querySelector('.shine-era-cover-play');
    if (cover) {
      cover.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${key === 'sweet-dreams' ? 'Sweet Dreams' : key === 'we-are-1' ? 'We Are 1' : 'Boots, Smile & Attitude'}`);
      const icon = cover.querySelector('span');
      if (icon) icon.textContent = playing ? '❚❚' : '▶';
    }
    const playButton = card.querySelector('.shine-era-play-button');
    if (playButton) {
      const titles = {
        'sweet-dreams': 'Sweet Dreams',
        'we-are-1': 'We Are 1',
        'boots-smile-attitude': 'Boots, Smile & Attitude'
      };
      playButton.textContent = `${playing ? '❚❚ Pause' : '▶ Play'} ${titles[key]}`;
      playButton.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${titles[key]}`);
    }
  };

  const ensureSource = (audio, cfg) => {
    const current = audio.currentSrc || audio.src || audio.querySelector('source')?.src || '';
    if (current) return;
    const source = audio.querySelector('source');
    const url = new URL(cfg.src, document.baseURI).href;
    if (source) source.src = url;
    else audio.src = url;
    audio.load();
  };

  const toggleNative = key => {
    const cfg = CORE[key];
    const audio = document.getElementById(cfg.id);
    const select = window.jahntellaSelectSiteTrack;
    if (!audio) return;

    if (!audio.paused && !audio.ended) {
      audio.pause();
      return;
    }

    ensureSource(audio, cfg);

    // Keep the real site player as the source of truth. If a track's native
    // audio element has no usable source yet, the explicit Album II source
    // above gives it one before playback is requested.
    if (typeof select === 'function') {
      select(key, true, {fresh:false});
    } else {
      audio.play().catch(() => {});
    }
  };

  const handleClick = event => {
    const target = event.target.closest?.('[data-shine-track]');
    if (!target) return;
    const key = target.dataset.shineTrack;
    if (!CORE[key]) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    toggleNative(key);
  };

  const bindAudio = key => {
    const audio = document.getElementById(CORE[key].id);
    if (!audio || audio.__shineNativePlayerSync) return;
    audio.__shineNativePlayerSync = true;
    ['play', 'playing', 'pause', 'ended'].forEach(eventName => {
      audio.addEventListener(eventName, () => syncVisual(key));
    });
    syncVisual(key);
  };

  const init = () => Object.keys(CORE).forEach(bindAudio);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();

  // Only the three native-player tracks are handled here. The other six
  // continue through the existing Shine Era shared transport untouched.
  window.addEventListener('click', handleClick, true);

  const timer = setInterval(() => {
    Object.keys(CORE).forEach(bindAudio);
    Object.keys(CORE).forEach(syncVisual);
  }, 250);
  setTimeout(() => clearInterval(timer), 15000);
})();
