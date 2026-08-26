(() => {
  'use strict';
  if (window.__jahntellaShineUnifiedControls) return;
  window.__jahntellaShineUnifiedControls = true;

  const CORE = {
    'sweet-dreams': 'audioSweetDreams',
    'we-are-1': 'audioWeAre1',
    'boots-smile-attitude': 'audioBootsSmileAttitude'
  };
  const EXT = new Set(['midnight-rodeo','redline','smoke-show','chasing-me','coming-down','you-and-me']);
  const ALL = new Set([...Object.keys(CORE), ...EXT]);

  const getKey = target => target?.dataset?.shineTrack || target?.dataset?.card;

  const startCore = key => {
    const audio = document.getElementById(CORE[key]);
    const select = window.jahntellaSelectSiteTrack;
    if (!audio) return;
    if (typeof select === 'function') {
      select(key, true, {fresh:true});
    } else {
      audio.play().catch(() => {});
    }
  };

  const startExtended = key => {
    if (typeof window.jahntellaPlayShineEraTrack === 'function') {
      window.jahntellaPlayShineEraTrack(key, true, {playing:true});
    }
  };

  document.addEventListener('click', event => {
    const target = event.target.closest?.('[data-shine-track], .shine-era-song-card[data-card]');
    if (!target) return;
    const key = getKey(target);
    if (!ALL.has(key)) return;
    if (CORE[key]) startCore(key);
    else startExtended(key);
  }, true);
})();
