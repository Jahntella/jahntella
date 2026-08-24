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
  const all = new Set([...Object.keys(CORE), ...EXT]);

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
    window.jahntellaSelectSiteTrack?.(key, true, {fresh:false});
    setButtonState(key, true);
  };

  const wrapExtensionTransport = () => {
    const original = window.jahntellaPlayShineEraTrack;
    if (typeof original !== 'function' || original.__jahntellaToggleWrapped) return false;
    const wrapped = function(key, restart = true, options = {}) {
      if (!EXT.has(key)) return original.call(this, key, restart, options);
      const audio = document.getElementById('audioBootsSmileAttitude');
      const expected = `/${key}.mp3`;
      if (audio && (audio.currentSrc || audio.src || '').includes(expected)) {
        if (!audio.paused && !audio.ended) {
          audio.pause();
          setButtonState(key, false);
          return;
        }
        audio.play().then(() => setButtonState(key, true)).catch(() => setButtonState(key, false));
        return;
      }
      return original.call(this, key, restart, options);
    };
    wrapped.__jahntellaToggleWrapped = true;
    window.jahntellaPlayShineEraTrack = wrapped;
    return true;
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
    wrapExtensionTransport();
    bindAudioState();
    const timer = setInterval(() => {
      wrapExtensionTransport();
      bindAudioState();
    }, 100);
    setTimeout(() => clearInterval(timer), 10000);
  };

  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-shine-track]');
    if (!button) return;
    const key = button.dataset.shineTrack;
    if (!all.has(key) || !CORE[key]) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    toggleCore(key);
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
