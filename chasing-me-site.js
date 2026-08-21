(() => {
  'use strict';
  if (window.__jahntellaChasingMePresentation) return;
  window.__jahntellaChasingMePresentation = true;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;

  const cfg = window.JAHNTELLA_ALBUM2?.tracks?.['chasing-me'] || {};
  const abs = path => new URL(path, document.baseURI).href;
  const thumb = abs(cfg.artworkThumb || 'assets/album2/chasing-me-cover-thumb.webp');

  const orderAesthetic = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    const smoke = document.getElementById('smokeShowAestheticCover');
    const chasing = document.getElementById('chasingMeAestheticCover');
    if (grid && smoke && chasing && smoke.nextElementSibling !== chasing) grid.insertBefore(chasing, smoke.nextSibling);
  };

  const addAestheticCover = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('chasingMeAestheticCover')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'chasingMeAestheticCover';
    button.className = 'gallery-item chasing-me-gallery-play';
    button.setAttribute('aria-label', 'Play or pause Chasing Me');
    button.innerHTML = `<span class="chasing-me-gallery-image"><img src="${thumb}" alt="Chasing Me artwork by Jahntella" width="420" height="420" loading="lazy" decoding="async"></span>`;
    button.addEventListener('click', () => window.jahntellaPlayShineEraTrack?.('chasing-me', false));
    grid.appendChild(button);
    orderAesthetic();
  };

  const init = () => { addAestheticCover(); orderAesthetic(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
  const observer = new MutationObserver(orderAesthetic);
  observer.observe(document.documentElement, {childList:true, subtree:true});
})();
