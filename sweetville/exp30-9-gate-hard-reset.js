(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const intentional = params.has('tool') || params.has('district') || params.has('section') || params.has('destination');
  if (intentional) return;

  const creativeHashes = new Set([
    '#photoBooth', '#coloringStudio', '#creativeStudio',
    '#sweetvilleGallery', '#createHub'
  ]);

  let entranceLock = false;
  let lockTimer = 0;

  const clearDestination = () => {
    if (location.hash || creativeHashes.has(location.hash)) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  };

  const absoluteTop = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  };

  const beginEntranceLock = () => {
    entranceLock = true;
    clearDestination();

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    document.documentElement.classList.add('exp309-entering');
    document.body.classList.remove('exp260-explore-mode');

    const active = document.activeElement;
    if (active && typeof active.blur === 'function') active.blur();

    absoluteTop();
    clearInterval(lockTimer);
    lockTimer = window.setInterval(absoluteTop, 30);

    window.setTimeout(() => {
      clearInterval(lockTimer);
      absoluteTop();

      const welcome = document.getElementById('cinematicHome') || document.getElementById('exp260Hub');
      if (welcome) {
        const hadTabindex = welcome.hasAttribute('tabindex');
        if (!hadTabindex) welcome.setAttribute('tabindex', '-1');
        welcome.focus({ preventScroll: true });
        absoluteTop();
        if (!hadTabindex) welcome.removeAttribute('tabindex');
      }

      document.documentElement.classList.remove('exp309-entering');
      entranceLock = false;
    }, 2600);
  };

  const style = document.createElement('style');
  style.textContent = `
    html.exp309-entering,
    html.exp309-entering body,
    html.exp309-entering main,
    html.exp309-entering main > section {
      overflow-anchor: none !important;
      scroll-behavior: auto !important;
    }
    #world { display: none !important; }
    #svNav a[href="#world"] { display: none !important; }
  `;
  document.head.appendChild(style);

  window.addEventListener('DOMContentLoaded', () => {
    const open = document.getElementById('openGates');
    open?.addEventListener('pointerdown', beginEntranceLock, { capture: true });
    open?.addEventListener('click', beginEntranceLock, { capture: true });

    document.getElementById('svNav')?.querySelectorAll('a').forEach(link => {
      if (link.textContent.trim() === 'World') link.remove();
    });
  });

  // Block late focus or hash events from pulling the page to Photo Booth during entry.
  window.addEventListener('hashchange', () => {
    if (entranceLock) {
      clearDestination();
      absoluteTop();
    }
  });

  document.addEventListener('focusin', event => {
    if (!entranceLock) return;
    const booth = event.target?.closest?.('#photoBooth, #createHub, #coloringStudio, #creativeStudio, #sweetvilleGallery');
    if (booth) {
      event.target.blur?.();
      absoluteTop();
    }
  }, true);

  window.addEventListener('pageshow', () => {
    clearDestination();
    absoluteTop();
  });
})();
