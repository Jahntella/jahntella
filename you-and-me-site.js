(() => {
  'use strict';
  if (window.__jahntellaYouAndMePresentation) return;
  window.__jahntellaYouAndMePresentation = true;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;

  const cfg = window.JAHNTELLA_ALBUM2?.tracks?.['you-and-me'] || {};
  const abs = path => new URL(path, document.baseURI).href;
  const thumb = abs(cfg.artworkThumb || 'assets/album2/you-and-me-cover-thumb.webp');

  const orderAesthetic = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    const coming = document.getElementById('comingDownAestheticCover');
    const youAndMe = document.getElementById('youAndMeAestheticCover');
    if (grid && coming && youAndMe && coming.nextElementSibling !== youAndMe) grid.insertBefore(youAndMe, coming.nextSibling);
  };

  const addAestheticCover = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('youAndMeAestheticCover')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'youAndMeAestheticCover';
    button.className = 'gallery-item you-and-me-gallery-play';
    button.setAttribute('aria-label', 'Play or pause You and Me');
    button.innerHTML = `<span class="you-and-me-gallery-image"><img src="${thumb}" alt="You and Me artwork by Jahntella" width="420" height="420" loading="lazy" decoding="async"></span>`;
    button.addEventListener('click', () => window.jahntellaPlayShineEraTrack?.('you-and-me', false));
    grid.appendChild(button);
    orderAesthetic();
  };

  const init = () => { addAestheticCover(); orderAesthetic(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
  const observer = new MutationObserver(orderAesthetic);
  observer.observe(document.documentElement, {childList:true, subtree:true});
})();
