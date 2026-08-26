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

  const toggleCore = key => {
    const audio = document.getElementById(CORE[key]);
    if (!audio) return;

    if (!audio.paused && !audio.ended) {
      audio.pause();
      setButtonState(key, false);
      return;
    }

    // Use the exact same site-player selection path as the other music cards.
    // Passing true is what makes the artwork click immediately start playback.
    if (typeof window.jahntellaSelectSiteTrack === 'function') {
      window.jahntellaSelectSiteTrack(key, true, {fresh:false});
    } else {
      audio.play().catch(() => {});
    }
  };

  const bindAudioState = () => {
    Object.entries(CORE).forEach(([key, id]) => {
      const audio = document.getElementById(id);
      if (!audio || audio.__shineButtonStateBound) return;
      audio.__shineButtonStateBound = true;
      ['play','playing','pause','ended'].forEach(eventName => {
        audio.addEventListener(eventName, () => syncCoreButton(key));
      });
      syncCoreButton(key);
    });
  };

  const init = () => {
    bindAudioState();
    const timer = setInterval(bindAudioState, 100);
    setTimeout(() => clearInterval(timer), 10000);
  };

  // The three special Shine Era cards use data-card rather than the normal
  // play-button wiring. Capture the artwork/card click before the generic
  // card handler can merely load the track into the player bar.
  document.addEventListener('click', event => {
    const card = event.target.closest?.('[data-card="sweet-dreams"],[data-card="we-are-1"],[data-card="boots-smile-attitude"]');
    if (!card) return;

    const key = card.dataset.card;
    const clickedPlayButton = event.target.closest('.shine-era-play-button,.play-button');
    if (clickedPlayButton) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    toggleCore(key);
  }, true);

  document.addEventListener('click', event => {
    const button = event.target.closest?.('.shine-era-play-button[data-shine-track]');
    if (!button) return;
    const key = button.dataset.shineTrack;
    if (!CORE[key]) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    toggleCore(key);
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
