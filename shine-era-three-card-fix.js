(() => {
  'use strict';
  const TRACKS = {
    'sweet-dreams': 'audioSweetDreams',
    'we-are-1': 'audioWeAre1',
    'boots-smile-attitude': 'audioBootsSmileAttitude'
  };

  const bind = () => {
    Object.entries(TRACKS).forEach(([key, audioId]) => {
      const audio = document.getElementById(audioId);
      const buttons = document.querySelectorAll(`[data-shine-track="${key}"]`);
      if (!audio || !buttons.length) return;

      buttons.forEach(button => {
        if (button.dataset.threeCardFixBound === '1') return;
        button.dataset.threeCardFixBound = '1';
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          if (!audio.paused && !audio.ended) {
            audio.pause();
            return;
          }
          Object.values(TRACKS).forEach(otherId => {
            const other = document.getElementById(otherId);
            if (other && other !== audio) other.pause();
          });
          audio.play().catch(() => {});
        });
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
  window.setTimeout(bind, 500);
  window.setTimeout(bind, 1500);
})();
