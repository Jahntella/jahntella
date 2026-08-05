(() => {
  'use strict';

  /*
   * EXP 31.2
   * The main Sweetville homepage now opens directly. Stale district routing
   * must not hide the homepage. Dedicated district HTML pages remain intact.
   */
  const params = new URLSearchParams(location.search);
  const district = params.get('district');

  if (!district) return;

  const isMainSweetvillePage =
    /\/sweetville\/(?:index\.html)?$/i.test(location.pathname);

  if (isMainSweetvillePage) {
    history.replaceState(null, '', location.pathname);
    document.body.classList.remove('exp280-district-only');
    document.querySelectorAll('main > section').forEach(section => {
      section.style.removeProperty('display');
    });
    return;
  }
})();