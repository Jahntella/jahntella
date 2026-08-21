(() => {
  'use strict';
  if (window.__jahntellaComingDownPresentation) return;
  window.__jahntellaComingDownPresentation = true;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;

  const cfg = window.JAHNTELLA_ALBUM2?.tracks?.['coming-down'] || {};
  const abs = path => new URL(path, document.baseURI).href;
  const thumb = abs(cfg.artworkThumb || 'assets/album2/coming-down-cover-thumb.webp');

  const orderAesthetic = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    const chasing = document.getElementById('chasingMeAestheticCover');
    const coming = document.getElementById('comingDownAestheticCover');
    if (grid && chasing && coming && chasing.nextElementSibling !== coming) grid.insertBefore(coming, chasing.nextSibling);
  };

  const addAestheticCover = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('comingDownAestheticCover')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'comingDownAestheticCover';
    button.className = 'gallery-item coming-down-gallery-play';
    button.setAttribute('aria-label', 'Play or pause Coming Down');
    button.innerHTML = `<span class="coming-down-gallery-image"><img src="${thumb}" alt="Coming Down artwork by Jahntella" width="420" height="420" loading="lazy" decoding="async"></span>`;
    button.addEventListener('click', () => window.jahntellaPlayShineEraTrack?.('coming-down', false));
    grid.appendChild(button);
    orderAesthetic();
  };

  const init = () => { addAestheticCover(); orderAesthetic(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
  const observer = new MutationObserver(orderAesthetic);
  observer.observe(document.documentElement, {childList:true, subtree:true});
})();
