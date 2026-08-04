/* EXP 21.3 — Reveal positioning and guaranteed scroll recovery */
(() => {
  'use strict';

  const modal = document.getElementById('cardRevealModal');
  const content = modal?.querySelector('.reveal-content');
  if (!modal || !content) return;

  const isActuallyOpen = () => {
    const style = getComputedStyle(modal);
    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           style.opacity !== '0' &&
           modal.getBoundingClientRect().width > 0;
  };

  const unlockPage = () => {
    document.body.classList.remove('exp211-reveal-open', 'exp213-reveal-open');
    document.documentElement.classList.remove('exp211-reveal-open', 'exp213-reveal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('touch-action');
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('position');
    document.documentElement.style.removeProperty('touch-action');
  };

  const sync = () => {
    if (isActuallyOpen()) {
      document.body.classList.add('exp213-reveal-open');
      modal.scrollTop = 0;
      content.scrollTop = 0;
      requestAnimationFrame(() => {
        modal.scrollTop = 0;
        content.scrollTop = 0;
      });
    } else {
      unlockPage();
    }
  };

  new MutationObserver(sync).observe(modal, {
    attributes:true,
    attributeFilter:['class', 'aria-hidden', 'style']
  });

  document.getElementById('openPackButton')?.addEventListener('click', () => {
    setTimeout(sync, 30);
    setTimeout(sync, 250);
    setTimeout(sync, 900);
  });

  ['closeRevealButton', 'revealDoneButton'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      setTimeout(unlockPage, 20);
      setTimeout(unlockPage, 250);
    });
  });

  modal.querySelector('.reveal-backdrop')?.addEventListener('click', () => {
    setTimeout(unlockPage, 50);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setTimeout(unlockPage, 50);
  });

  window.addEventListener('pageshow', unlockPage);
  window.addEventListener('beforeunload', unlockPage);
  window.addEventListener('resize', () => {
    if (isActuallyOpen()) {
      modal.scrollTop = 0;
      content.scrollTop = 0;
    }
  }, {passive:true});

  // Repair any scroll lock left behind by an earlier broken build.
  unlockPage();
})();
