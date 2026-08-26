(() => {
  'use strict';
  if (window.__jahntellaShineUnifiedControls) return;
  window.__jahntellaShineUnifiedControls = true;

  const CORE = {
    'sweet-dreams': 'audioSweetDreams',
    'we-are-1': 'audioWeAre1',
    'boots-smile-attitude': 'audioBootsSmileAttitude'
  };

  const cardFor = key => document.querySelector(`[data-card="${key}"]`);
  const buttonFor = key => cardFor(key)?.querySelector('.play-button, .shine-era-play-button');

  const syncVisual = (key) => {
    const audio = document.getElementById(CORE[key]);
    const card = cardFor(key);
    const button = buttonFor(key);
    if (!audio) return;
    const playing = !audio.paused && !audio.ended;
    card?.classList.toggle('is-active', playing);
    if (button) {
      const title = button.dataset.shineTitle || button.dataset.trackTitle || button.textContent.replace(/^[▶❚❚]\s*(?:Play|Pause)\s*/i, '').trim();
      button.dataset.shineTitle = title;
      button.textContent = `${playing ? '❚❚ Pause' : '▶ Play'} ${title}`;
    }
    const player = document.getElementById('player');
    const playerToggle = document.getElementById('playerToggle');
    if (player && player.classList.contains('visible')) player.classList.toggle('playing', playing);
    if (playerToggle) playerToggle.textContent = playing ? '❚❚' : '▶';
  };

  const bind = () => {
    Object.entries(CORE).forEach(([key, id]) => {
      const audio = document.getElementById(id);
      if (!audio || audio.__shineVisualSyncBound) return;
      audio.__shineVisualSyncBound = true;
      ['play','playing','pause','ended'].forEach(name => audio.addEventListener(name, () => syncVisual(key)));
      syncVisual(key);
    });
  };

  const init = () => {
    bind();
    const timer = setInterval(bind, 100);
    setTimeout(() => clearInterval(timer), 10000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
