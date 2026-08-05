(() => {
  'use strict';

  /*
   * EXP 31.2 CLEAN ENTRANCE
   *
   * This replaces the gate-reset file already loaded by the CURRENT live
   * Sweetville index. No index.html replacement is necessary.
   */

  const CREATIVE_HASHES = new Set([
    '#photoBooth',
    '#createHub',
    '#coloringStudio',
    '#creativeStudio',
    '#sweetvilleGallery'
  ]);

  const TOOL_TARGETS = {
    coloring: 'coloringStudio',
    creative: 'creativeStudio',
    gallery: 'sweetvilleGallery',
    photo: 'photoBooth'
  };

  const params = new URLSearchParams(location.search);
  const requestedTool = params.get('tool');
  const validTool = requestedTool && TOOL_TARGETS[requestedTool];

  const unlock = () => {
    document.documentElement.style.removeProperty('overflow');
    document.body?.style.removeProperty('overflow');
    document.documentElement.classList.remove(
      'sv-scroll-locked',
      'exp309-entering'
    );
    document.body?.classList.remove('sv-scroll-locked');
  };

  const restoreAllHomepageSections = () => {
    document.body?.classList.remove(
      'exp260-explore-mode',
      'exp280-district-only'
    );

    document.querySelectorAll('main > section').forEach(section => {
      section.style.removeProperty('display');
      section.hidden = false;
    });

    const world = document.getElementById('world');
    if (world) world.hidden = true;
  };

  const removeEntranceLayers = () => {
    document.getElementById('gateScreen')?.remove();
    document.getElementById('svCinematicIntro')?.remove();
    document.querySelector('#svNav a[href="#world"]')?.remove();
  };

  const goHome = () => {
    unlock();
    restoreAllHomepageSections();
    removeEntranceLayers();

    if (CREATIVE_HASHES.has(location.hash)) {
      history.replaceState(null, '', location.pathname);
    }

    /*
     * Clear stale routing parameters responsible for the Photo Booth landing.
     * A valid intentional Sweet Studio tool is handled separately below.
     */
    if (!validTool && (params.has('district') || params.has('tool'))) {
      history.replaceState(null, '', location.pathname);
    }

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const home =
      document.getElementById('cinematicHome') ||
      document.getElementById('exp260Hub') ||
      document.querySelector('main');

    if (home) {
      home.scrollIntoView({ block: 'start', behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  };

  const openRequestedTool = () => {
    if (!validTool) return false;

    unlock();
    removeEntranceLayers();
    restoreAllHomepageSections();
    document.body?.classList.add('exp312-tool-mode', 'exp260-explore-mode');

    const target = document.getElementById(TOOL_TARGETS[requestedTool]);
    if (!target) return false;

    window.setTimeout(() => {
      target.scrollIntoView({ block: 'start', behavior: 'auto' });
    }, 100);

    return true;
  };

  const initialize = () => {
    /*
     * Remove the gate and cinematic intro before any legacy listeners can
     * restore focus or scroll position to Photo Booth.
     */
    removeEntranceLayers();
    unlock();

    if (!openRequestedTool()) {
      goHome();

      // Repeat after late-loading legacy scripts finish.
      window.setTimeout(goHome, 100);
      window.setTimeout(goHome, 500);
      window.setTimeout(goHome, 1400);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

  window.addEventListener('pageshow', () => {
    if (validTool) {
      openRequestedTool();
    } else {
      goHome();
    }
  });

  window.addEventListener('load', () => {
    if (!validTool) {
      goHome();
      window.setTimeout(goHome, 250);
    }
  });
})();