(() => {
  'use strict';

  /*
   * EXP 37 — SWEETVILLE DEEP-LINK ROUTING
   *
   * Normal new visit:
   *   Plays the cinematic introduction.
   *
   * Return from a Sweetville district:
   *   Skips the intro and opens the official interactive map.
   *
   * Arrival from Sweet Studio:
   *   Skips the intro and opens the exact creative tool selected.
   */

  const params = new URLSearchParams(location.search);
  const requestedDestination = (params.get('goto') || '').toLowerCase();
  const requestedMode = (params.get('mode') || '').toLowerCase();
  const requestedFrom = (params.get('from') || '').toLowerCase();

  const DESTINATIONS = {
    map: 'exp260Hub',
    coloring: 'coloringStudio',
    poster: 'creativeStudio',
    card: 'creativeStudio',
    wallpaper: 'creativeStudio',
    vip: 'creativeStudio',
    frames: 'photoBooth',
    photo: 'photoBooth',
    gallery: 'sweetvilleGallery',
    surprise: 'sweetvilleGallery'
  };

  const MODE_BY_DESTINATION = {
    poster: 'poster',
    card: 'card',
    wallpaper: 'wallpaper',
    vip: 'card'
  };

  const REMOVED_IDS = new Set([
    'world',
    'livingMap',
    'locations',
    'summerFestival'
  ]);

  const FOCUS_IDS = new Set([
    'photoBooth',
    'createHub',
    'coloringStudio',
    'creativeStudio',
    'sweetvilleGallery',
    'sweetvilleSphere',
    'bedroom',
    'passport',
    'exp270PassportHud',
    'gardenMarket',
    'sweetiesStage',
    'exp254BubblegumBay'
  ]);

  let protectingHomeMode = false;
  let deepLinkStyle = null;

  const sameOriginSweetvilleReturn = (() => {
    if (!document.referrer) return false;

    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin !== location.origin) return false;
      if (!referrer.pathname.includes('/sweetville/')) return false;

      const filename = referrer.pathname.split('/').pop() || '';
      return filename !== '' &&
             filename !== 'index.html' &&
             filename !== 'studio.html';
    } catch {
      return false;
    }
  })();

  const destinationId = DESTINATIONS[requestedDestination] || '';
  const shouldBypassIntro =
    Boolean(destinationId) ||
    sameOriginSweetvilleReturn;

  /*
   * Prevent even a brief intro flash for explicit destinations and
   * district-to-map returns.
   */
  if (shouldBypassIntro) {
    deepLinkStyle = document.createElement('style');
    deepLinkStyle.id = 'exp37DeepLinkStyle';
    deepLinkStyle.textContent = `
      #svCinematicIntro,
      .sv-cinematic-intro,
      #gateScreen,
      .gate-screen {
        display:none!important;
        visibility:hidden!important;
        pointer-events:none!important;
      }
    `;
    document.head.appendChild(deepLinkStyle);
  }

  const unlock = () => {
    document.documentElement.style.removeProperty('overflow');
    document.body?.style.removeProperty('overflow');
    document.documentElement.classList.remove(
      'sv-scroll-locked',
      'exp309-entering'
    );
    document.body?.classList.remove('sv-scroll-locked');
  };

  const removeGate = () => {
    document.getElementById('gateScreen')?.remove();
    document.querySelector('#svNav a[href="#world"]')?.remove();
  };

  const hideRemoved = () => {
    REMOVED_IDS.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;

      section.hidden = true;
      section.style.setProperty('display', 'none', 'important');
    });
  };

  const cleanPasses = () => {
    [
      '.exp290-fastpass-trigger',
      '.exp290-fastpass-panel',
      '.exp290-travel-fx'
    ].forEach(selector => {
      [...document.querySelectorAll(selector)].forEach((item, index) => {
        item.classList.toggle(
          'exp314-fastpass-duplicate',
          index > 0
        );

        if (index > 0) {
          item.setAttribute('aria-hidden', 'true');
        }
      });
    });
  };

  const finishIntroImmediately = () => {
    const intro = document.getElementById('svCinematicIntro');

    intro?.classList.add('finished');
    intro?.setAttribute('aria-hidden', 'true');
    intro?.remove();

    removeGate();
    unlock();
  };

  const enforceHomeClass = () => {
    if (!document.body?.classList.contains('exp314-home-mode')) {
      return;
    }

    if (document.body.classList.contains('exp260-explore-mode')) {
      return;
    }

    protectingHomeMode = true;
    document.body.classList.add('exp260-explore-mode');
    protectingHomeMode = false;
  };

  const restoreHomepageSections = () => {
    document.querySelectorAll('main > section').forEach(section => {
      if (!REMOVED_IDS.has(section.id)) {
        section.style.removeProperty('display');
        section.style.removeProperty('visibility');
        section.hidden = false;
      }
    });

    hideRemoved();
  };

  const enterHomeMode = ({
    targetId = 'cinematicHome',
    smooth = false
  } = {}) => {
    unlock();
    removeGate();
    cleanPasses();

    document.body?.classList.remove(
      'exp280-district-only',
      'exp312-tool-mode',
      'exp314-focus-mode',
      'exp37-tool-mode'
    );

    document.body?.classList.add(
      'exp314-home-mode',
      'exp260-explore-mode'
    );

    try {
      localStorage.setItem(
        'jahntellaExp26MapMode',
        'explore'
      );
    } catch {}

    restoreHomepageSections();

    const target =
      document.getElementById(targetId) ||
      document.getElementById('cinematicHome') ||
      document.getElementById('exp260Hub');

    requestAnimationFrame(() => {
      target?.scrollIntoView({
        block: 'start',
        behavior: smooth ? 'smooth' : 'auto'
      });
    });
  };

  const removeStudioReturn = () => {
    document.getElementById('exp37BackToStudio')?.remove();
  };

  const addStudioReturn = () => {
    removeStudioReturn();

    const button = document.createElement('a');
    button.id = 'exp37BackToStudio';
    button.href = 'studio.html';
    button.textContent = '← Back to Sweet Studio';
    button.setAttribute('aria-label', 'Back to Sweet Studio');

    Object.assign(button.style, {
      position: 'fixed',
      left: '16px',
      bottom: '18px',
      zIndex: '99998',
      padding: '12px 16px',
      border: '1px solid rgba(255,145,205,.6)',
      borderRadius: '999px',
      background: 'linear-gradient(135deg,#ff2f9f,#8d26ff)',
      color: '#fff',
      textDecoration: 'none',
      fontWeight: '800',
      boxShadow: '0 12px 34px rgba(0,0,0,.38)'
    });

    document.body.appendChild(button);
  };

  const activateCreativeMode = destination => {
    const mode =
      requestedMode ||
      MODE_BY_DESTINATION[destination] ||
      '';

    if (!mode) return;

    const selectors = [
      `[data-mode="${CSS.escape(mode)}"]`,
      `[data-creative-mode="${CSS.escape(mode)}"]`,
      `[data-tool="${CSS.escape(mode)}"]`,
      `button[value="${CSS.escape(mode)}"]`
    ];

    window.setTimeout(() => {
      for (const selector of selectors) {
        const control = document.querySelector(selector);

        if (control) {
          control.click();
          break;
        }
      }
    }, 450);
  };

  const enterFocusMode = (
    target,
    {
      fromStudio = false,
      destination = ''
    } = {}
  ) => {
    if (!target) return;

    unlock();
    removeGate();
    cleanPasses();

    document.body?.classList.remove('exp314-home-mode');

    document.body?.classList.add(
      'exp314-focus-mode',
      'exp260-explore-mode',
      'exp37-tool-mode'
    );

    const ownerSection =
      target.matches('main > section')
        ? target
        : target.closest('main > section');

    document.querySelectorAll('main > section').forEach(section => {
      section.style.setProperty(
        'display',
        section === ownerSection ? 'block' : 'none',
        'important'
      );
    });

    target.style.removeProperty('display');
    target.hidden = false;

    if (fromStudio) {
      addStudioReturn();
    } else {
      removeStudioReturn();
    }

    activateCreativeMode(destination);

    window.setTimeout(() => {
      target.scrollIntoView({
        block: 'start',
        behavior: 'auto'
      });

      target.animate(
        [
          { boxShadow: '0 0 0 rgba(255,80,180,0)' },
          { boxShadow: '0 0 45px rgba(255,80,180,.62)' },
          { boxShadow: '0 0 0 rgba(255,80,180,0)' }
        ],
        { duration: 1500 }
      );
    }, 100);
  };

  const routeRequestedDestination = () => {
    if (!destinationId) return false;

    finishIntroImmediately();

    if (requestedDestination === 'map') {
      enterHomeMode({
        targetId: 'exp260Hub',
        smooth: false
      });
      return true;
    }

    const target = document.getElementById(destinationId);

    if (!target) {
      enterHomeMode({
        targetId: 'exp260Hub',
        smooth: false
      });
      return true;
    }

    enterFocusMode(target, {
      fromStudio: requestedFrom === 'studio',
      destination: requestedDestination
    });

    return true;
  };

  const finishIntro = () => {
    const intro = document.getElementById('svCinematicIntro');

    intro?.classList.add('finished');
    intro?.setAttribute('aria-hidden', 'true');

    enterHomeMode({
      targetId: 'cinematicHome',
      smooth: false
    });
  };

  const installNavigation = () => {
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const id = (link.getAttribute('href') || '').slice(1);
      if (!id) return;

      if (id === 'exp260Hub' || id === 'cinematicHome') {
        event.preventDefault();
        removeStudioReturn();

        enterHomeMode({
          targetId: id,
          smooth: true
        });
        return;
      }

      if (REMOVED_IDS.has(id)) {
        event.preventDefault();
        removeStudioReturn();

        enterHomeMode({
          targetId: 'exp260Hub',
          smooth: true
        });
        return;
      }

      const target = document.getElementById(id);

      if (target && FOCUS_IDS.has(id)) {
        event.preventDefault();

        enterFocusMode(target, {
          fromStudio: false,
          destination: ''
        });
      }
    }, true);
  };

  const initialize = () => {
    removeGate();
    hideRemoved();
    cleanPasses();
    installNavigation();

    const classObserver = new MutationObserver(() => {
      if (!protectingHomeMode) {
        enforceHomeClass();
      }
    });

    classObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    /*
     * Studio deep links take first priority.
     */
    if (routeRequestedDestination()) {
      return;
    }

    /*
     * Existing district Back to Map links still point to index.html.
     * Same-origin referrer detection lets them bypass the intro and land
     * directly at the official map without editing every district page.
     */
    if (sameOriginSweetvilleReturn) {
      finishIntroImmediately();

      enterHomeMode({
        targetId: 'exp260Hub',
        smooth: false
      });
      return;
    }

    /*
     * A genuinely new visit keeps the cinematic entrance.
     */
    const intro = document.getElementById('svCinematicIntro');
    const skip = document.getElementById('svCinemaSkip');

    if (!intro) {
      enterHomeMode({
        targetId: 'cinematicHome',
        smooth: false
      });
      return;
    }

    const introObserver = new MutationObserver(() => {
      if (intro.classList.contains('finished')) {
        introObserver.disconnect();
        finishIntro();
      }
    });

    introObserver.observe(intro, {
      attributes: true,
      attributeFilter: ['class', 'aria-hidden']
    });

    skip?.addEventListener('click', () => {
      window.setTimeout(finishIntro, 0);
    }, { capture: true });

    window.setTimeout(() => {
      if (!intro.classList.contains('finished')) {
        finishIntro();
      }
    }, 22000);

    const passObserver = new MutationObserver(cleanPasses);

    passObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();