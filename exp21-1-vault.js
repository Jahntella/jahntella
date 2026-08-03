/* EXP 21.1 — Mobile card reveal viewport fix */
(() => {
  'use strict';

  const modal = document.getElementById('cardRevealModal');
  const content = modal?.querySelector('.reveal-content');
  if (!modal || !content) return;

  const syncModal = () => {
    const open = modal.getAttribute('aria-hidden') === 'false' ||
                 modal.classList.contains('is-open') ||
                 getComputedStyle(modal).display !== 'none';

    document.body.classList.toggle('exp211-reveal-open', open);

    if (open) {
      modal.scrollTop = 0;
      content.scrollTop = 0;
      requestAnimationFrame(() => {
        modal.scrollTop = 0;
        content.scrollTop = 0;
        content.focus?.({preventScroll:true});
      });
    }
  };

  new MutationObserver(syncModal).observe(modal, {
    attributes:true,
    attributeFilter:['class','aria-hidden','style']
  });

  document.getElementById('openPackButton')?.addEventListener('click', () => {
    setTimeout(syncModal, 150);
    setTimeout(syncModal, 700);
  });

  ['closeRevealButton','revealDoneButton'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      setTimeout(() => document.body.classList.remove('exp211-reveal-open'), 50);
    });
  });

  modal.querySelector('.reveal-backdrop')?.addEventListener('click', () => {
    document.getElementById('closeRevealButton')?.click();
  });

  window.addEventListener('resize', () => {
    if (document.body.classList.contains('exp211-reveal-open')) {
      content.scrollTop = 0;
    }
  }, {passive:true});
})();
