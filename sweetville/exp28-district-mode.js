(() => {
  'use strict';

  /*
   * EXP 31.3
   * Do not let legacy district mode hide the main Sweetville homepage.
   * Dedicated district HTML pages remain separate and unchanged.
   */
  const isMainPage =
    /\/sweetville\/(?:index\.html)?$/i.test(location.pathname);

  if (!isMainPage) return;

  document.body.classList.remove(
    'exp280-district-only',
    'exp260-explore-mode'
  );

  document.querySelectorAll('main > section').forEach(section => {
    section.style.removeProperty('display');
  });

  ['world','livingMap','locations','summerFestival'].forEach(id => {
    const section = document.getElementById(id);
    if (section) section.style.setProperty('display','none','important');
  });
})();