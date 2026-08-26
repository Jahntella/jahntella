(() => {
  'use strict';
  if (window.__jahntellaShineUnifiedControls) return;
  window.__jahntellaShineUnifiedControls = true;

  const CORE = {
    'sweet-dreams': 'audioSweetDreams',
    'we-are-1': 'audioWeAre1',
    'boots-smile-attitude': 'audioBootsSmileAttitude'
  };

  const cardFor = key => document.querySelector(`.shine-era-song-card[data-card="${key}"]`);

  const syncVisual = key => {
    const audio = document.getElementById(CORE[key]);
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

  const toggleNative = key => {
    const audio = document.getElementById(CORE[key]);
    const select = window.jahntellaSelectSiteTrack;
    if (!audio || typeof select !== 'function') return;

    if (!audio.paused && !audio.ended) {
      audio.pause();
      return;
    }

    // Use the site's real player for these three tracks. This updates the
    // bottom player and starts/resumes without resetting the current position.
    select(key, true, {fresh:false});
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
    const audio = document.getElementById(CORE[key]);
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

  // Window capture runs before the album card router's document-capture handler,
  // so the first three cards cannot be accidentally routed into the extension transport.
  window.addEventListener('click', handleClick, true);

  const timer = setInterval(() => {
    Object.keys(CORE).forEach(bindAudio);
    Object.keys(CORE).forEach(syncVisual);
  }, 250);
  setTimeout(() => clearInterval(timer), 15000);
})();
