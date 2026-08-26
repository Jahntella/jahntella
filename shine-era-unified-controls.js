(() => {
  'use strict';
  if (window.__jahntellaShineUnifiedControls) return;
  window.__jahntellaShineUnifiedControls = true;

  const CORE = {
    'sweet-dreams': 'audioSweetDreams',
    'we-are-1': 'audioWeAre1',
    'boots-smile-attitude': 'audioBootsSmileAttitude'
  };

  const buttonFor = key => document.querySelector(`.shine-era-play-button[data-shine-track="${key}"]`);
  const setButtonState = (key, playing) => {
    const button = buttonFor(key);
    if (!button) return;
    const title = button.dataset.shineTitle || button.textContent.replace(/^[▶❚❚]\s*(?:Play|Pause)\s*/i, '').trim();
    button.dataset.shineTitle = title;
    button.textContent = `${playing ? '❚❚ Pause' : '▶ Play'} ${title}`;
  };

  const syncCoreButton = key => {
    const audio = document.getElementById(CORE[key]);
    if (audio) setButtonState(key, !audio.paused && !audio.ended);
  };

  const bindAudioState = () => {
    Object.entries(CORE).forEach(([key, id]) => {
      const audio = document.getElementById(id);
      if (!audio || audio.__shineButtonStateBound) return;
      audio.__shineButtonStateBound = true;
      ['play','playing','pause','ended'].forEach(eventName => audio.addEventListener(eventName, () => syncCoreButton(key)));
      syncCoreButton(key);
    });
  };

  const init = () => {
    bindAudioState();
    const timer = setInterval(bindAudioState, 100);
    setTimeout(() => clearInterval(timer), 10000);
  };

  document.addEventListener('click', event => {
    const button = event.target.closest?.('.shine-era-play-button[data-shine-track]');
    if (!button) return;
    const key = button.dataset.shineTrack;
    if (!CORE[key]) return;
    const audio = document.getElementById(CORE[key]);
    if (!audio) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (audio.paused || audio.ended) audio.play().catch(() => {});
    else audio.pause();
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
