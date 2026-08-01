/* SWEETVILLE EXP 6.1.3 — INDEPENDENT CINEMATIC CAROUSEL */
(() => {
  'use strict';

  const initialize = () => {
    const intro = document.getElementById('svCinematicIntro');
    if (!intro || intro.dataset.carouselReady === 'true') return;

    intro.dataset.carouselReady = 'true';

    const scenes = Array.from(intro.querySelectorAll('.sv-cinema-scene'));
    const skip = document.getElementById('svCinemaSkip');
    const progress = document.getElementById('svCinemaProgress');
    const finale = intro.querySelector('.sv-cinema-finale');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!scenes.length) {
      intro.classList.add('finished');
      return;
    }

    let current = 0;
    let timer = 0;
    let finished = false;
    const sceneDuration = reduced ? 900 : 3400;
    const finaleDuration = reduced ? 300 : 1400;

    const unlockScroll = () => {
      document.documentElement.classList.remove('sv-scroll-locked');
      document.body.classList.remove('sv-scroll-locked');
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('height');
      document.body.style.removeProperty('height');
    };

    const updateProgress = () => {
      if (!progress) return;
      const amount = Math.min(100, ((current + 1) / scenes.length) * 100);
      progress.style.width = `${amount}%`;
    };

    const showScene = (index) => {
      scenes.forEach((scene, sceneIndex) => {
        const active = sceneIndex === index;
        scene.classList.toggle('active', active);
        scene.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      current = index;
      updateProgress();
    };

    const finish = (immediate = false) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);

      if (progress) progress.style.width = '100%';

      const closeIntro = () => {
        intro.classList.add('finished');
        intro.setAttribute('aria-hidden', 'true');
        intro.style.pointerEvents = 'none';
        unlockScroll();
      };

      if (immediate) {
        closeIntro();
        return;
      }

      scenes.forEach(scene => scene.classList.remove('active'));
      finale?.classList.add('show');
      timer = window.setTimeout(closeIntro, finaleDuration);
    };

    const advance = () => {
      if (finished) return;

      const next = current + 1;
      if (next >= scenes.length) {
        finish(false);
        return;
      }

      showScene(next);
      timer = window.setTimeout(advance, sceneDuration);
    };

    // Reset any state left by an older cached controller.
    finale?.classList.remove('show');
    intro.classList.remove('finished');
    intro.removeAttribute('aria-hidden');
    intro.style.removeProperty('pointer-events');
    showScene(0);

    skip?.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      finish(true);
    }, { capture: true });

    // Start independently after paint; this no longer depends on another Sweetville script.
    window.requestAnimationFrame(() => {
      timer = window.setTimeout(advance, sceneDuration);
    });

    // Absolute escape hatch: never trap a visitor.
    window.setTimeout(() => {
      if (!finished) finish(true);
    }, Math.max(45000, scenes.length * sceneDuration + 5000));

    window.sweetvilleFinishIntro = () => finish(true);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
