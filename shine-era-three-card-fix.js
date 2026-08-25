(() => {
  'use strict';

  const TRACKS = {
    'sweet-dreams': 'audioSweetDreams',
    'we-are-1': 'audioWeAre1',
    'boots-smile-attitude': 'audioBootsSmileAttitude'
  };

  // The homepage's card click handler routes these three Album II cards
  // through jahntellaPlayShineEraTrack(). Give that route the same player
  // used by the working music cards instead of attaching a competing audio
  // controller to the buttons.
  const installTransportBridge = () => {
    if (typeof window.jahntellaSelectSiteTrack !== 'function') return false;

    window.jahntellaPlayShineEraTrack = (key, autoplay = true) => {
      if (!TRACKS[key]) return;
      window.jahntellaSelectSiteTrack(key, autoplay, { fresh: true });
    };
    return true;
  };

  const bind = () => {
    // The transport bridge is the only wiring needed here. The homepage's
    // existing capture handler remains responsible for the actual buttons.
    installTransportBridge();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }

  window.setTimeout(bind, 100);
  window.setTimeout(bind, 500);
  window.setTimeout(bind, 1500);
})();
