/* EXP 63.0 — reinforce the permanent true-color artwork lightbox */
(() => {
  'use strict';

  const ready = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, {once:true});
    } else {
      callback();
    }
  };

  ready(() => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.add('exp63-true-color-lightbox');

    const clearGalleryMode = () => lightbox.classList.remove('exp57-gallery-lightbox');

    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        lightbox.classList.toggle('exp57-gallery-lightbox', Boolean(trigger.closest('#gallery')));
      });
    });

    document.getElementById('lightboxClose')?.addEventListener('click', clearGalleryMode);
    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) clearGalleryMode();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') clearGalleryMode();
    });
  });
})();
