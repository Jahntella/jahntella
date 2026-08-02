/* SWEETVILLE EXP 18.1.1 — CRITICAL MOBILE MENU + PERFORMANCE FIX */
(() => {
  'use strict';

  const init = () => {
    const originalButton = document.getElementById('menuButton');
    const nav = document.getElementById('svNav');
    const originalClose = document.getElementById('svNavClose');

    if (originalButton && nav) {
      // Cloning removes every older click listener attached by previous EXP builds.
      const button = originalButton.cloneNode(true);
      originalButton.replaceWith(button);

      let closeButton = originalClose;
      if (originalClose) {
        closeButton = originalClose.cloneNode(true);
        originalClose.replaceWith(closeButton);
      }

      const setOpen = open => {
        nav.classList.toggle('open', open);
        nav.setAttribute('aria-hidden', String(!open));
        button.setAttribute('aria-expanded', String(open));
        document.documentElement.classList.toggle('sv-menu-open', open);
        document.body.classList.toggle('sv-menu-open', open);
      };

      button.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        setOpen(!nav.classList.contains('open'));
      };

      closeButton?.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
      });

      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
      });

      document.addEventListener('pointerdown', event => {
        if (!nav.classList.contains('open')) return;
        if (nav.contains(event.target) || button.contains(event.target)) return;
        setOpen(false);
      });

      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setOpen(false);
      });

      setOpen(false);
    }

    // Keep the page responsive while visitors scroll through the large world.
    document.querySelectorAll('.sv-panel').forEach(panel => {
      panel.style.contentVisibility = 'auto';
      panel.style.containIntrinsicSize = '900px';
    });

    document.querySelectorAll('img').forEach((img, index) => {
      img.decoding = 'async';
      if (!img.closest('.sv-cinematic-intro,.cinematic-home') && index > 1) {
        img.loading = 'lazy';
        img.fetchPriority = 'low';
      }
    });

    if (matchMedia('(max-width: 760px)').matches) {
      document.documentElement.classList.add('sv-mobile-critical-lite');

      // Remove decorative layers that add work but do not affect features.
      document.querySelectorAll(
        '.floating-world,.ambient-life,.exp32-world-life,.shooting-star'
      ).forEach(layer => layer.remove());

      // Stop autoplay-style ambient effects until the user reaches them.
      document.querySelectorAll('[style*="animation"]').forEach(node => {
        if (!node.closest('#svNav,.sv-cinematic-intro')) {
          node.style.animationPlayState = 'paused';
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
