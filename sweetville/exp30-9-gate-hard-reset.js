(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const staleCreativeDistricts = new Set(['create','photo','photo-booth','coloring','creative','gallery']);
  const district = (params.get('district') || '').toLowerCase();
  const staleCreativeRoute =
    staleCreativeDistricts.has(district) ||
    params.has('tool') ||
    ['#photoBooth','#createHub','#coloringStudio','#creativeStudio','#sweetvilleGallery'].includes(location.hash);

  const gatePresent = Boolean(document.getElementById('gateScreen'));

  // On the main Sweetville gate page, stale creative routes must be cleared.
  if (gatePresent && staleCreativeRoute) {
    history.replaceState(null, '', location.pathname);
  }

  const clearOldDestination = () => {
    if (gatePresent && (
      staleCreativeDistricts.has((new URLSearchParams(location.search).get('district') || '').toLowerCase()) ||
      ['#photoBooth','#createHub','#coloringStudio','#creativeStudio','#sweetvilleGallery'].includes(location.hash)
    )) {
      history.replaceState(null, '', location.pathname);
    }
  };

  const hardTop = () => {
    const home = document.getElementById('cinematicHome') || document.getElementById('exp260Hub');
    const top = home ? home.offsetTop : 0;
    document.documentElement.scrollTop = top;
    if (document.body) document.body.scrollTop = top;
    window.scrollTo(0, top);
  };

  const install = () => {
    const button = document.getElementById('openGates');
    const gate = document.getElementById('gateScreen');
    if (!button || !gate) return;

    const cleanButton = button.cloneNode(true);
    button.replaceWith(cleanButton);

    cleanButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      clearOldDestination();
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

      document.body.classList.remove('exp260-explore-mode','exp280-district-only');
      document.querySelectorAll('main > section').forEach(section => {
        section.style.removeProperty('display');
      });

      document.activeElement?.blur?.();
      hardTop();

      gate.classList.add('opening');
      sessionStorage.setItem('sweetvilleGatesOpened','yes');

      let ticks = 0;
      const lock = setInterval(() => {
        hardTop();
        ticks += 1;
        if (ticks >= 100) clearInterval(lock);
      }, 20);

      setTimeout(() => {
        gate.classList.add('opened');
        hardTop();
      }, 1700);

      setTimeout(() => {
        clearInterval(lock);
        hardTop();
        const home = document.getElementById('cinematicHome') || document.getElementById('exp260Hub');
        home?.scrollIntoView({block:'start',behavior:'auto'});
        history.replaceState(null,'',location.pathname);
      }, 2400);
    }, true);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, {once:true});
  } else {
    install();
  }
})();