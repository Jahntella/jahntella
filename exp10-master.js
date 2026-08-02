/* SWEETVILLE EXP 10.0 — MASTER WORLD HEALTH */
(() => {
  'use strict';

  const required = [
    ['littleMoments', 'Little Moments'],
    ['coloringStudio', 'Coloring Studio'],
    ['sweetvilleGallery', 'Sweetville Gallery'],
    ['creativeStudio', 'Creative Studio'],
    ['photoBooth', 'Photo Booth'],
    ['livingMap', 'World Map'],
    ['bedroom', 'My Sweetie Room'],
    ['passport', 'Passport']
  ];

  const runHealthCheck = () => {
    const missing = required.filter(([id]) => !document.getElementById(id));
    document.documentElement.dataset.sv10Ready = missing.length ? 'partial' : 'true';

    if (!missing.length) return;

    console.error('[Sweetville EXP 10.0] Missing sections:', missing);

    let notice = document.getElementById('exp100HealthNotice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'exp100HealthNotice';
      notice.className = 'exp100-health-notice';
      document.body.appendChild(notice);
    }

    notice.innerHTML = `
      <strong>Sweetville needs one more upload step.</strong>
      <span>Missing: ${missing.map(([,name]) => name).join(', ')}</span>`;
  };

  const markPhotoBooth = () => {
    const section = document.getElementById('photoBooth');
    const canvas = document.getElementById('exp94Canvas');
    if (!section) return;

    section.classList.toggle('exp100-module-ready', Boolean(canvas));
    section.dataset.moduleStatus = canvas ? 'ready' : 'missing-canvas';
  };

  const closeMobileMenu = event => {
    const link = event.target.closest('#svNav a');
    if (!link) return;
    document.getElementById('svNav')?.classList.remove('open');
    document.getElementById('menuButton')?.setAttribute('aria-expanded','false');
  };

  document.addEventListener('click', closeMobileMenu);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      runHealthCheck();
      markPhotoBooth();
    }, {once:true});
  } else {
    runHealthCheck();
    markPhotoBooth();
  }

  window.addEventListener('pageshow', () => {
    runHealthCheck();
    markPhotoBooth();
  });
})();
