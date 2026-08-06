(() => {
  'use strict';

  const REMOVED_IDS = new Set(['world','livingMap','locations','summerFestival']);
  const FOCUS_IDS = new Set([
    'photoBooth','createHub','coloringStudio','creativeStudio',
    'sweetvilleGallery','sweetvilleSphere','bedroom','passport',
    'exp270PassportHud','gardenMarket','sweetiesStage','exp254BubblegumBay'
  ]);

  let protectingHomeMode = false;

  const unlock = () => {
    document.documentElement.style.removeProperty('overflow');
    document.body?.style.removeProperty('overflow');
    document.documentElement.classList.remove('sv-scroll-locked','exp309-entering');
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
      section.style.setProperty('display','none','important');
    });
  };

  const cleanPasses = () => {
    ['.exp290-fastpass-trigger','.exp290-fastpass-panel','.exp290-travel-fx']
      .forEach(selector => {
        [...document.querySelectorAll(selector)].forEach((item,index) => {
          item.classList.toggle('exp314-fastpass-duplicate', index > 0);
          if (index > 0) item.setAttribute('aria-hidden','true');
        });
      });
  };

  const enforceHomeClass = () => {
    if (!document.body?.classList.contains('exp314-home-mode')) return;
    if (document.body.classList.contains('exp260-explore-mode')) return;
    protectingHomeMode = true;
    document.body.classList.add('exp260-explore-mode');
    protectingHomeMode = false;
  };

  const enterHomeMode = () => {
    unlock();
    removeGate();
    cleanPasses();

    document.body?.classList.remove(
      'exp280-district-only',
      'exp312-tool-mode',
      'exp314-focus-mode'
    );

    document.body?.classList.add(
      'exp314-home-mode',
      'exp260-explore-mode'
    );

    try {
      localStorage.setItem('jahntellaExp26MapMode','explore');
    } catch {}

    document.querySelectorAll('main > section').forEach(section => {
      if (!REMOVED_IDS.has(section.id)) {
        section.style.removeProperty('display');
        section.style.removeProperty('visibility');
      }
    });

    hideRemoved();

    const home = document.getElementById('cinematicHome') ||
                 document.getElementById('exp260Hub');

    requestAnimationFrame(() => {
      home?.scrollIntoView({block:'start',behavior:'auto'});
    });
  };

  const enterFocusMode = target => {
    if (!target) return;

    document.body?.classList.remove('exp314-home-mode');
    document.body?.classList.add('exp314-focus-mode','exp260-explore-mode');

    document.querySelectorAll('main > section').forEach(section => {
      section.style.setProperty(
        'display',
        section === target ? 'block' : 'none',
        'important'
      );
    });

    cleanPasses();
    requestAnimationFrame(() => {
      target.scrollIntoView({block:'start',behavior:'smooth'});
    });
  };

  const finishIntro = () => {
    const intro = document.getElementById('svCinematicIntro');
    intro?.classList.add('finished');
    intro?.setAttribute('aria-hidden','true');
    enterHomeMode();
  };

  const installNav = () => {
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const id = (link.getAttribute('href') || '').slice(1);
      if (!id) return;

      if (id === 'exp260Hub' || id === 'cinematicHome') {
        event.preventDefault();
        enterHomeMode();
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({
            block:'start',
            behavior:'smooth'
          });
        },40);
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
        },40);
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
    hideRemoved();
    cleanPasses();
    installNav();

    const classObserver = new MutationObserver(() => {
      if (!protectingHomeMode) enforceHomeClass();
    });
    classObserver.observe(document.body, {
      attributes:true,
      attributeFilter:['class']
    });

    const intro = document.getElementById('svCinematicIntro');
    const skip = document.getElementById('svCinemaSkip');

    if (!intro) {
      enterHomeMode();
      return;
    }

    const introObserver = new MutationObserver(() => {
      if (intro.classList.contains('finished')) {
        introObserver.disconnect();
        enterHomeMode();
      }
    });

    introObserver.observe(intro, {
      attributes:true,
      attributeFilter:['class','aria-hidden']
    });

    skip?.addEventListener('click', () => {
      setTimeout(finishIntro,0);
    }, {capture:true});

    setTimeout(() => {
      if (!intro.classList.contains('finished')) finishIntro();
    },22000);

    const passObserver = new MutationObserver(cleanPasses);
    passObserver.observe(document.body,{childList:true,subtree:true});
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',initialize,{once:true});
  } else {
    initialize();
  }

  window.addEventListener('pageshow',() => {
    cleanPasses();
    const intro = document.getElementById('svCinematicIntro');
    if (!intro || intro.classList.contains('finished')) enterHomeMode();
  });
})();