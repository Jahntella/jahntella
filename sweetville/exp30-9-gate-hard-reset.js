(() => {
  'use strict';

  /*
   * EXP 31.3
   * Keep the cinematic intro, remove only the broken gate,
   * restore the full homepage, and land on Welcome + official map.
   */

  const STALE_HASHES = new Set([
    '#photoBooth',
    '#createHub',
    '#coloringStudio',
    '#creativeStudio',
    '#sweetvilleGallery',
    '#livingMap',
    '#locations',
    '#world',
    '#summerFestival'
  ]);

  const unlock = () => {
    document.documentElement.style.removeProperty('overflow');
    document.body?.style.removeProperty('overflow');
    document.documentElement.classList.remove(
      'sv-scroll-locked',
      'exp309-entering'
    );
    document.body?.classList.remove('sv-scroll-locked');
  };

  const clearStaleRoute = () => {
    const params = new URLSearchParams(location.search);
    const hasStaleQuery =
      params.has('district') ||
      params.has('tool') ||
      params.has('section') ||
      params.has('destination');

    if (STALE_HASHES.has(location.hash) || hasStaleQuery) {
      history.replaceState(null, '', location.pathname);
    }
  };

  const restoreHomepage = () => {
    unlock();

    document.body?.classList.remove(
      'exp260-explore-mode',
      'exp280-district-only',
      'exp312-tool-mode'
    );

    document.querySelectorAll('main > section').forEach(section => {
      section.style.removeProperty('display');
      section.style.removeProperty('visibility');
    });

    ['world','livingMap','locations','summerFestival'].forEach(id => {
      const section = document.getElementById(id);
      if (section) section.style.setProperty('display','none','important');
    });

    document.querySelector('#svNav a[href="#world"]')?.remove();
  };

  const welcomeHome = () => {
    clearStaleRoute();
    restoreHomepage();

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const welcome =
      document.getElementById('cinematicHome') ||
      document.getElementById('exp260Hub');

    requestAnimationFrame(() => {
      welcome?.scrollIntoView({
        block:'start',
        behavior:'auto'
      });
    });
  };

  const finishIntro = () => {
    const intro = document.getElementById('svCinematicIntro');

    if (intro && !intro.classList.contains('finished')) {
      intro.classList.add('finished');
      intro.setAttribute('aria-hidden','true');
    }

    welcomeHome();
    setTimeout(welcomeHome, 100);
    setTimeout(welcomeHome, 500);
  };

  const initialize = () => {
    clearStaleRoute();
    restoreHomepage();

    /* The old gate must not exist or receive old listeners. */
    document.getElementById('gateScreen')?.remove();

    const intro = document.getElementById('svCinematicIntro');
    const skip = document.getElementById('svCinemaSkip');

    if (!intro) {
      welcomeHome();
      return;
    }

    /*
     * Do not scroll while the cinematic intro is playing.
     * When the existing intro-carousel marks it finished, land at Welcome.
     */
    const observer = new MutationObserver(() => {
      if (intro.classList.contains('finished')) {
        observer.disconnect();
        welcomeHome();
      }
    });

    observer.observe(intro, {
      attributes:true,
      attributeFilter:['class','aria-hidden']
    });

    skip?.addEventListener('click', () => {
      setTimeout(finishIntro, 0);
    }, {capture:true});

    /*
     * Safety release if an older intro script fails.
     * The full sequence can run normally before this fallback.
     */
    setTimeout(() => {
      if (!intro.classList.contains('finished')) {
        finishIntro();
      }
    }, 22000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, {once:true});
  } else {
    initialize();
  }

  window.addEventListener('pageshow', () => {
    const intro = document.getElementById('svCinematicIntro');
    if (!intro || intro.classList.contains('finished')) {
      welcomeHome();
    }
  });
})();