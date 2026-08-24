(() => {
  'use strict';

  // Fix the visible pink Play buttons in the Shine Era section.
  // The cover art already routes through the shared Shine Era transport;
  // these buttons need to call that same transport explicitly.
  const shineTracks = new Set(['sweet-dreams', 'we-are-1', 'boots-smile-attitude']);

  const wire = () => {
    document.querySelectorAll('.play-button[data-track]').forEach(button => {
      const key = button.dataset.track;
      if (!shineTracks.has(key) || button.dataset.shineButtonFixed === 'true') return;
      button.dataset.shineButtonFixed = 'true';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (typeof window.jahntellaPlayShineEraTrack === 'function') {
          window.jahntellaPlayShineEraTrack(key, true);
        }
      }, true);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire, {once: true});
  } else {
    wire();
  }

  // The Shine Era cards can be inserted/updated after page load.
  new MutationObserver(wire).observe(document.body, {childList: true, subtree: true});
})();
