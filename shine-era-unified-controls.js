(() => {
  'use strict';
  if (window.__jahntellaShineUnifiedControls) return;
  window.__jahntellaShineUnifiedControls = true;

  const CORE = {
    'sweet-dreams': 'audioSweetDreams',
    'we-are-1': 'audioWeAre1',
    'boots-smile-attitude': 'audioBootsSmileAttitude'
  };

  const EXT = new Set([
    'midnight-rodeo',
    'redline',
    'smoke-show',
    'chasing-me',
    'coming-down',
    'you-and-me'
  ]);

  const installTransportWrapper = () => {
    const original = window.jahntellaPlayShineEraTrack;
    if (typeof original !== 'function' || original.__jahntellaUnifiedToggle) return false;

    const wrapped = function(key, restart = true, options = {}) {
      // The first three Shine Era tracks belong to the site's native player.
      // Route them through that player so the bottom bar, artwork, and card
      // state all stay synchronized.
      if (Object.prototype.hasOwnProperty.call(CORE, key)) {
        const audio = document.getElementById(CORE[key]);
        const select = window.jahntellaSelectSiteTrack;
        if (!audio || typeof select !== 'function') return;

        if (!audio.paused && !audio.ended) {
          audio.pause();
          // selectTrack(..., false) updates the native player's visual state
          // without resetting the current playback position.
          select(key, false, {fresh:false});
          return;
        }

        select(key, true, {fresh:false});
        return;
      }

      // The remaining six use the existing shared Shine Era transport.
      // Preserve their current position when toggling pause/resume instead
      // of restarting the song on every card click.
      if (EXT.has(key)) {
        const audio = document.getElementById('audioBootsSmileAttitude');
        const cfg = window.JAHNTELLA_ALBUM2?.tracks?.[key];
        if (audio && cfg) {
          const src = audio.currentSrc || audio.src || audio.querySelector('source')?.src || '';
          const sameTrack = src.includes(cfg.fullAudio);

          if (sameTrack && !audio.paused && !audio.ended) {
            audio.pause();
            return;
          }

          if (sameTrack && audio.paused) {
            return original.call(this, key, false, {
              ...options,
              position: audio.currentTime || 0,
              playing: true
            });
          }
        }
      }

      return original.call(this, key, restart, options);
    };

    wrapped.__jahntellaUnifiedToggle = true;
    window.jahntellaPlayShineEraTrack = wrapped;
    return true;
  };

  const init = () => {
    if (installTransportWrapper()) return;
    const timer = setInterval(() => {
      if (installTransportWrapper()) clearInterval(timer);
    }, 50);
    setTimeout(() => clearInterval(timer), 10000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
