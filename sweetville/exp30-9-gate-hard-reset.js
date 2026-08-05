(() => {
  'use strict';

  /*
   * EXP 31.0 SAFE GATE FIX
   * This file intentionally keeps the same filename already loaded by the
   * current live Sweetville page. Replacing this one file cannot overwrite
   * newer HTML, map, district, Studio, contact, poster, or artwork changes.
   */

  const HOME_HASH = '#cinematicHome';
  const CREATIVE_HASHES = new Set([
    '#photoBooth',
    '#coloringStudio',
    '#creativeStudio',
    '#sweetvilleGallery',
    '#createHub'
  ]);

  let entranceActive = false;
  let scrollLockTimer = 0;

  const params = new URLSearchParams(location.search);
  const intentionalDestination =
    params.has('tool') ||
    params.has('district') ||
    params.has('section') ||
    params.has('destination');

  const unlockDocument = () => {
    document.documentElement.style.removeProperty('overflow');
    document.body?.style.removeProperty('overflow');
    document.documentElement.classList.remove('sv-scroll-locked');
    document.body?.classList.remove('sv-scroll-locked');
  };

  const getHome = () =>
    document.getElementById('cinematicHome') ||
    document.getElementById('exp260Hub') ||
    document.querySelector('main');

  const forceHome = () => {
    if (!entranceActive) return;

    const home = getHome();
    const top = home ? Math.max(0, home.getBoundingClientRect().top + window.scrollY) : 0;

    document.documentElement.scrollTop = top;
    if (document.body) document.body.scrollTop = top;
    window.scrollTo({ top, left: 0, behavior: 'auto' });
  };

  const clearCreativeDestination = () => {
    if (CREATIVE_HASHES.has(location.hash)) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  };

  const finishAtHome = () => {
    clearInterval(scrollLockTimer);
    entranceActive = false;
    unlockDocument();

    const home = getHome();
    if (home) {
      home.scrollIntoView({ block: 'start', behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    // Keep a harmless home hash so mobile browsers restore the correct area.
    if (location.hash !== HOME_HASH) {
      history.replaceState(null, '', location.pathname + location.search + HOME_HASH);
    }
  };

  const openAtHome = event => {
    /*
     * Critical difference from previous patches:
     * stop the older gate handler before it can restore Photo Booth state.
     */
    event?.preventDefault();
    event?.stopPropagation();
    event?.stopImmediatePropagation();

    entranceActive = true;
    clearCreativeDestination();

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const active = document.activeElement;
    active?.blur?.();

    document.querySelectorAll(
      '#photoBooth input, #photoBooth button, #photoBooth select, #photoBooth textarea, ' +
      '#createHub a, #coloringStudio input, #creativeStudio input'
    ).forEach(element => element.blur?.());

    document.body.classList.remove('exp260-explore-mode');

    const gate = document.getElementById('gateScreen');
    gate?.classList.add('opening');

    sessionStorage.setItem('sweetvilleGatesOpened', 'yes');

    forceHome();
    clearInterval(scrollLockTimer);
    scrollLockTimer = window.setInterval(forceHome, 20);

    window.setTimeout(() => {
      gate?.classList.add('opened');
      forceHome();
    }, 1700);

    window.setTimeout(finishAtHome, 2350);
  };

  const install = () => {
    const openButton = document.getElementById('openGates');

    if (openButton) {
      /*
       * Capture listeners run before the legacy onclick handler.
       * Pointerdown handles touch devices; click handles keyboard/desktop.
       */
      openButton.addEventListener('pointerdown', openAtHome, true);
      openButton.addEventListener('click', openAtHome, true);
    }

    // Keep the redundant World section and button removed.
    document.querySelector('#svNav a[href="#world"]')?.remove();
    const worldSection = document.getElementById('world');
    if (worldSection) worldSection.hidden = true;

    // A normal visit must not inherit an old Photo Booth hash.
    if (!intentionalDestination && CREATIVE_HASHES.has(location.hash)) {
      history.replaceState(null, '', location.pathname + location.search);
    }

    /*
     * When the gate was already opened in this tab, restore the homepage
     * instead of allowing the browser to restore Photo Booth scroll position.
     */
    if (
      !intentionalDestination &&
      sessionStorage.getItem('sweetvilleGatesOpened') === 'yes'
    ) {
      entranceActive = true;
      forceHome();
      window.setTimeout(finishAtHome, 120);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }

  window.addEventListener('pageshow', () => {
    if (intentionalDestination) return;

    if (CREATIVE_HASHES.has(location.hash)) {
      history.replaceState(null, '', location.pathname + location.search);
    }

    if (sessionStorage.getItem('sweetvilleGatesOpened') === 'yes') {
      entranceActive = true;
      window.setTimeout(finishAtHome, 50);
    }
  });
})();