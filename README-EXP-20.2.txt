/* EXP 21.0 — Homepage Performance Optimization */
(() => {
  'use strict';

  const ready = fn => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, {once:true});
    } else {
      fn();
    }
  };

  ready(() => {
    const video = document.querySelector('.hero-v5-video');
    const source = video?.querySelector('source[data-src]');

    const startHeroVideo = () => {
      if (!video || !source || source.src) return;
      source.src = source.dataset.src;
      video.load();

      const promise = video.play();
      if (promise?.catch) promise.catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(startHeroVideo, {timeout:1800});
    } else {
      setTimeout(startHeroVideo, 900);
    }

    // Prevent decorative effects from initializing before first interaction on mobile.
    if (matchMedia('(max-width: 760px)').matches) {
      document.documentElement.classList.add('exp210-mobile-lite');
    }

    // Defer below-the-fold image fetching more aggressively.
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.decoding = 'async';
      if (!img.fetchPriority) img.fetchPriority = 'low';
    });

    // Pause hero video while offscreen or tab is hidden.
    if (video && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (document.hidden || !entry.isIntersecting) {
            video.pause();
          } else if (source?.src) {
            video.play().catch(() => {});
          }
        });
      }, {threshold:.15});
      observer.observe(video);
    }

    document.addEventListener('visibilitychange', () => {
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else if (source?.src && video.getBoundingClientRect().bottom > 0) {
        video.play().catch(() => {});
      }
    });

    // Delay noncritical animation classes until the browser is idle.
    const enablePolish = () => document.documentElement.classList.add('exp210-polish-ready');
    if ('requestIdleCallback' in window) {
      requestIdleCallback(enablePolish, {timeout:2500});
    } else {
      setTimeout(enablePolish, 1800);
    }
  });
})();
