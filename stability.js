/* SWEETVILLE EXP 7.1 — STABILITY & PERFORMANCE */
(() => {
  'use strict';

  const cleanupTasks = [];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const on = (target, type, handler, options) => {
    if (!target) return;
    target.addEventListener(type, handler, options);
    cleanupTasks.push(() => target.removeEventListener(type, handler, options));
  };

  const safeInterval = (fn, delay) => {
    let id = window.setInterval(() => {
      if (document.visibilityState === 'visible') fn();
    }, delay);
    cleanupTasks.push(() => clearInterval(id));
    return id;
  };

  const pauseAnimations = () => {
    document.documentElement.classList.toggle(
      'sv-page-hidden',
      document.visibilityState !== 'visible'
    );
  };

  on(document, 'visibilitychange', pauseAnimations);
  pauseAnimations();

  // Remove duplicate ambient layers accidentally created by earlier releases.
  const dedupeById = ids => {
    ids.forEach(id => {
      const nodes = document.querySelectorAll(`#${CSS.escape(id)}`);
      nodes.forEach((node, index) => {
        if (index > 0) node.remove();
      });
    });
  };

  dedupeById([
    'svLivingFireworks',
    'exp41EventLayer',
    'exp41Whisper',
    'exp41MochiRunner',
    'svSyncToast',
    'exp701PassportToast'
  ]);

  // Ensure expensive canvas/effect layers do not intercept input.
  document.querySelectorAll(
    '.sv-living-fireworks,.exp32-world-life,.ambient-life,.sv-cinema-sparkles'
  ).forEach(el => {
    el.setAttribute('aria-hidden', 'true');
    el.style.pointerEvents = 'none';
  });

  // Lazy-load all non-critical images and reduce decode blocking.
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.loading = 'lazy';
    img.decoding = 'async';
    img.fetchPriority = img.closest('.sv-cinematic-intro,.cinematic-home') ? 'high' : 'auto';
  });

  // Prevent repeated MutationObservers from rescanning the full document too often.
  let scheduled = false;
  const refreshInteractiveNodes = () => {
    scheduled = false;
    document.querySelectorAll('[data-location]').forEach(node => {
      node.dataset.svStable = 'true';
    });
  };

  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(refreshInteractiveNodes);
  });

  observer.observe(document.body, { childList:true, subtree:true });
  cleanupTasks.push(() => observer.disconnect());

  // Lightweight health check, far less frequent than prior polling loops.
  safeInterval(() => {
    window.dispatchEvent(new CustomEvent('sweetville:healthcheck'));
  }, 15000);

  // Release references during page navigation.
  on(window, 'pagehide', () => {
    cleanupTasks.splice(0).forEach(task => {
      try { task(); } catch {}
    });
  }, { once:true });

  if (reduced) {
    document.documentElement.classList.add('sv-reduced-effects');
  }

  window.SweetvilleStability = {
    cleanup: () => cleanupTasks.splice(0).forEach(task => task())
  };
})();
