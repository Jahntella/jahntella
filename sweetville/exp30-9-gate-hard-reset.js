(() => {
  'use strict';

  /*
   * EXP 31.4
   * Restores the cinematic intro and homepage without globally forcing every
   * section visible. Focused worlds may once again hide unrelated sections.
   */

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

  const hideApprovedRemovedSections = () => {
    REMOVED_IDS.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        section.hidden = true;
        section.style.setProperty('display', 'none', 'important');
      }
    });
  };

  const cleanFastPassDuplicates = () => {
    [
      '.exp290-fastpass-trigger',
      '.exp290-fastpass-panel',
      '.exp290-travel-fx'
    ].forEach(selector => {
      const items = [...document.querySelectorAll(selector)];
      items.forEach((item, index) => {
        item.classList.toggle('exp314-fastpass-duplicate', index > 0);
        if (index > 0) {
          item.setAttribute('aria-hidden', 'true');
        }
      });
    });
  };

  const enterHomeMode = () => {
    unlock();
    removeGate();
    hideApprovedRemovedSections();
    cleanFastPassDuplicates();

    document.body?.classList.remove(
      'exp280-district-only',
      'exp260-explore-mode',
      'exp312-tool-mode',
      'exp314-focus-mode'
    );
    document.body?.classList.add('exp314-home-mode');

    /*
     * Remove only inline styles left by district mode. Do not apply a global
     * CSS display override, because world scripts need control afterward.
     */
    document.querySelectorAll('main > section').forEach(section => {
      if (!REMOVED_IDS.has(section.id)) {
        section.style.removeProperty('display');
        section.style.removeProperty('visibility');
      }
    });

    const home =
      document.getElementById('cinematicHome') ||
      document.getElementById('exp260Hub');

    requestAnimationFrame(() => {
      home?.scrollIntoView({ block:'start', behavior:'auto' });
    });
  };

  const enterFocusMode = target => {
    if (!target) return;

    document.body?.classList.remove('exp314-home-mode');
    document.body?.classList.add('exp314-focus-mode');

    /*
     * A focused legacy world inside the homepage gets exclusive visibility.
     * Header, overlays, and separate district HTML pages remain unaffected.
     */
    document.querySelectorAll('main > section').forEach(section => {
      if (section === target) {
        section.style.setProperty('display', 'block', 'important');
      } else {
        section.style.setProperty('display', 'none', 'important');
      }
    });

    cleanFastPassDuplicates();
    requestAnimationFrame(() => {
      target.scrollIntoView({ block:'start', behavior:'smooth' });
    });
  };

  const finishIntro = () => {
    const intro = document.getElementById('svCinematicIntro');
    intro?.classList.add('finished');
    intro?.setAttribute('aria-hidden','true');
    enterHomeMode();
  };

  const installNavigationGuard = () => {
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const id = (link.getAttribute('href') || '').slice(1);
      if (!id) return;

      if (id === 'exp260Hub' || id === 'cinematicHome') {
        event.preventDefault();
        enterHomeMode();
        const target = document.getElementById(id);
        setTimeout(() => target?.scrollIntoView({
          block:'start',
          behavior:'smooth'
        }), 40);
        return;
      }

      if (REMOVED_IDS.has(id)) {
        event.preventDefault();
        enterHomeMode();
        setTimeout(() => {
          document.getElementById('exp260Hub')?.scrollIntoView({
            block:'start',
            behavior:'smooth'
          });
        }, 40);
        return;
      }

      const target = document.getElementById(id);
      if (target && FOCUS_IDS.has(id)) {
        event.preventDefault();
        enterFocusMode(target);
      }
    }, true);
  };

  const initialize = () => {
    removeGate();
    hideApprovedRemovedSections();
    cleanFastPassDuplicates();
    installNavigationGuard();

    const intro = document.getElementById('svCinematicIntro');
    const skip = document.getElementById('svCinemaSkip');

    if (!intro) {
      enterHomeMode();
      return;
    }

    const observer = new MutationObserver(() => {
      if (intro.classList.contains('finished')) {
        observer.disconnect();
        enterHomeMode();
      }
    });

    observer.observe(intro, {
      attributes:true,
      attributeFilter:['class','aria-hidden']
    });

    skip?.addEventListener('click', () => {
      setTimeout(finishIntro, 0);
    }, {capture:true});

    setTimeout(() => {
      if (!intro.classList.contains('finished')) {
        finishIntro();
      }
    }, 22000);

    /*
     * Watch for Fast Pass controls created late by older scripts and remove
     * duplicates without affecting the first working instance.
     */
    const passObserver = new MutationObserver(cleanFastPassDuplicates);
    passObserver.observe(document.body, {
      childList:true,
      subtree:true
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, {once:true});
  } else {
    initialize();
  }

  window.addEventListener('pageshow', () => {
    cleanFastPassDuplicates();
  });
})();