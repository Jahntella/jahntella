(() => {
  'use strict';
  if (window.__jahntellaShineUnifiedControls) return;
  window.__jahntellaShineUnifiedControls = true;

  const CORE = {
    'sweet-dreams': 'audioSweetDreams',
    'we-are-1': 'audioWeAre1',
    'boots-smile-attitude': 'audioBootsSmileAttitude'
  };
  const SPECIAL = new Set(Object.keys(CORE));

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

  // Keep the existing working play-button behavior for the three special cards.
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

  // Only the artwork/card click for these three tracks gets this bridge.
  // We do not intercept the event; the site's normal card handler runs first.
  // We remember whether the requested track was playing before the click, then
  // make the final state match the other Shine Era cards: first click plays,
  // second click pauses.
  document.addEventListener('click', event => {
    const card = event.target.closest?.('[data-card]');
    if (!card) return;
    const key = card.getAttribute('data-card');
    if (!SPECIAL.has(key)) return;
    if (event.target.closest('.shine-era-play-button, .play-button, button, a')) return;

    const audio = document.getElementById(CORE[key]);
    if (!audio) return;
    const wasPlaying = !audio.paused && !audio.ended;

    window.setTimeout(() => {
      const select = window.jahntellaSelectSiteTrack;
      if (wasPlaying) {
        audio.pause();
        syncCoreButton(key);
        return;
      }
      if (typeof select === 'function') {
        select(key, true, {fresh:false});
      } else {
        audio.play().catch(() => {});
      }
      syncCoreButton(key);
    }, 0);
  }, false);

  const init = () => {
    bindAudioState();
    const timer = setInterval(bindAudioState, 100);
    setTimeout(() => clearInterval(timer), 10000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
