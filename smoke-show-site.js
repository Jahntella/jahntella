(() => {
  'use strict';
  if (window.__jahntellaSmokeShowPresentation) return;
  window.__jahntellaSmokeShowPresentation = true;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;

  const cfg = window.JAHNTELLA_ALBUM2?.tracks?.['smoke-show'] || {};
  const abs = path => new URL(path, document.baseURI).href;
  const thumb = abs(cfg.artworkThumb || 'assets/album2/smoke-show-cover-thumb.webp');

  const orderAesthetic = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    const redline = document.getElementById('redlineAestheticCover');
    const smoke = document.getElementById('smokeShowAestheticCover');
    if (grid && redline && smoke && redline.nextElementSibling !== smoke) grid.insertBefore(smoke, redline.nextSibling);
  };

  const addAestheticCover = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('smokeShowAestheticCover')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'smokeShowAestheticCover';
    button.className = 'gallery-item smoke-show-gallery-play';
    button.setAttribute('aria-label', 'Play or pause Smoke Show');
    button.innerHTML = `<span class="smoke-show-gallery-image"><img src="${thumb}" alt="Smoke Show artwork by Jahntella" width="420" height="420" loading="lazy" decoding="async"></span>`;
    button.addEventListener('click', () => window.jahntellaPlayShineEraTrack?.('smoke-show', false));
    grid.appendChild(button);
    orderAesthetic();
  };

  const init = () => { addAestheticCover(); orderAesthetic(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
  const observer = new MutationObserver(orderAesthetic);
  observer.observe(document.documentElement, {childList:true, subtree:true});
})();
