(() => {
  'use strict';

  /*
   * EXP 31.4
   * District-only routing is allowed only when a real district query is
   * intentionally present. Normal homepage visits remain in homepage mode.
   */

  const params = new URLSearchParams(location.search);
  const district = params.get('district');
  const isMainPage =
    /\/sweetville\/(?:index\.html)?$/i.test(location.pathname);

  if (!isMainPage || !district) return;

  const aliases = {
    'bubblegum-bay':'exp254BubblegumBay',
    'garden-market':'gardenMarket',
    'sweeties-stage':'sweetiesStage',
    'sphere':'sweetvilleSphere',
    'sweetie-room':'bedroom',
    'create':'createHub',
    'passport':'exp270PassportHud'
  };

  const id = aliases[district] || district;
  const target = document.getElementById(id);

  if (!target) {
    history.replaceState(null,'',location.pathname);
    return;
  }

  document.body.classList.remove('exp314-home-mode');
  document.body.classList.add(
    'exp280-district-only',
    'exp260-explore-mode',
    'exp314-focus-mode'
  );

  document.querySelectorAll('main > section').forEach(section => {
    section.style.setProperty(
      'display',
      section === target ? 'block' : 'none',
      'important'
    );
  });

  document.getElementById('gateScreen')?.remove();
  document.documentElement.style.overflow='auto';
  document.body.style.overflow='auto';

  setTimeout(() => {
    target.scrollIntoView({block:'start',behavior:'auto'});
  },50);
})();