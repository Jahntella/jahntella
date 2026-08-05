(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const district = params.get('district');
  if (!district) return;

  /*
   * EXP 31.1:
   * Never enter district-only mode for stale creative routes on the main
   * Sweetville page while the gate exists.
   */
  const blocked = new Set(['create','photo','photo-booth','coloring','creative','gallery']);
  if (document.getElementById('gateScreen') && blocked.has(district.toLowerCase())) {
    history.replaceState(null,'',location.pathname);
    return;
  }

  const aliases = {
    'bubblegum-bay':'exp254BubblegumBay',
    'garden-market':'gardenMarket',
    'sweeties-stage':'sweetiesStage',
    'living-world':'livingMap',
    'sphere':'sweetvilleSphere',
    'sweetie-room':'bedroom',
    'create':'createHub',
    'passport':'exp270PassportHud'
  };

  const id = aliases[district] || district;
  const target = document.getElementById(id);
  if (!target) return;

  document.body.classList.add('exp280-district-only','exp260-explore-mode');
  document.querySelectorAll('main > section').forEach(section => {
    section.style.display = section === target ? 'block' : 'none';
  });
  target.style.display = 'block';
  document.getElementById('svCinematicIntro')?.remove();
  document.getElementById('gateScreen')?.remove();
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  setTimeout(() => target.scrollIntoView({block:'start'}),50);
})();