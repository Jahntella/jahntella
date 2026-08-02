/* SWEETVILLE EXP 18.1 — STABILITY, SPEED & MOBILE MENU HOTFIX */
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
    const button = document.getElementById('menuButton');
    const nav = document.getElementById('svNav');
    const close = document.getElementById('svNavClose');

    if (button && nav) {
      const openMenu = event => {
        event?.preventDefault();
        event?.stopPropagation();
        nav.classList.add('open');
        document.body.classList.add('sv-menu-open');
        button.setAttribute('aria-expanded', 'true');
      };

      const closeMenu = event => {
        event?.preventDefault();
        event?.stopPropagation();
        nav.classList.remove('open');
        document.body.classList.remove('sv-menu-open');
        button.setAttribute('aria-expanded', 'false');
      };

      const toggleMenu = event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        nav.classList.contains('open') ? closeMenu() : openMenu();
      };

      button.addEventListener('click', toggleMenu, {capture:true});
      close?.addEventListener('click', closeMenu, {capture:true});

      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('open');
          document.body.classList.remove('sv-menu-open');
          button.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', event => {
        if (!nav.classList.contains('open')) return;
        if (nav.contains(event.target) || button.contains(event.target)) return;
        closeMenu();
      });

      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu();
      });
    }

    document.querySelectorAll('img').forEach((img, index) => {
      if (!img.closest('.sv-cinematic-intro,.cinematic-home') && index > 1) {
        img.loading = 'lazy';
        img.fetchPriority = 'low';
      }
      img.decoding = 'async';
    });

    if (matchMedia('(max-width: 760px)').matches) {
      document.documentElement.classList.add('sv-mobile-lite');
      document.querySelectorAll('.ambient-life span,.floating-world span').forEach((node, index) => {
        if (index % 2) node.remove();
      });
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('sv-offscreen', !entry.isIntersecting);
      });
    }, {rootMargin:'160px 0px'});

    document.querySelectorAll('.sv-panel,.exp1618-panel').forEach(section => observer.observe(section));
  });
})();
