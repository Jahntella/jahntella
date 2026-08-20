(() => {
  'use strict';
  if (window.__jahntellaMidnightPresentation) return;
  window.__jahntellaMidnightPresentation = true;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;

  const cfg = window.JAHNTELLA_ALBUM2?.tracks?.['midnight-rodeo'] || {};
  const abs = p => new URL(p, document.baseURI).href;
  const art = abs(cfg.artwork || 'assets/album2/midnight-rodeo-cover.webp');
  const thumb = abs(cfg.artworkThumb || 'assets/album2/midnight-rodeo-cover-thumb.webp');
  const video = abs(cfg.fullVideo || 'assets/album2/midnight-rodeo-official-visualizer.mp4');

  const orderAesthetic = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    const midnight = document.getElementById('midnightRodeoAestheticCover');
    const redline = document.getElementById('redlineAestheticCover');
    if (grid && midnight && redline && midnight.nextElementSibling !== redline) grid.insertBefore(midnight, redline);
  };

  const addVisualizer = () => {
    const grid = document.querySelector('.exp66-shine-videos');
    if (!grid) return;
    if (Array.from(grid.querySelectorAll(':scope > article')).some(card => card.querySelector('h3')?.textContent?.trim().toLowerCase() === 'midnight rodeo')) return;

    const card = document.createElement('article');
    card.id = 'midnightRodeoShineEraVisualizer';
    card.className = 'exp60-shine-video-card';
    card.innerHTML = `<div class="exp60-shine-video-heading"><span>THE SHINE ERA <i aria-hidden="true"></i> OFFICIAL VISUALIZER</span><h3>Midnight Rodeo</h3></div><div class="exp60-shine-video-frame"><video controls playsinline preload="none" poster="${art}" aria-label="Play the Midnight Rodeo official visualizer"><source src="${video}" type="video/mp4"></video></div><div class="exp60-shine-video-note"><span aria-hidden="true">◇</span><p><strong>Midnight Rodeo.</strong> Full song + visualizer from The Shine Era.</p></div>`;
    const redline = document.getElementById('redlineShineEraVisualizer');
    if (redline && redline.parentElement === grid) grid.insertBefore(card, redline);
    else grid.appendChild(card);
    card.querySelector('video')?.addEventListener('play', () => window.jahntellaStopShineEraTrack?.());
  };

  const addAestheticCover = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('midnightRodeoAestheticCover')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'midnightRodeoAestheticCover';
    button.className = 'gallery-item midnight-gallery-play';
    button.setAttribute('aria-label', 'Play or pause Midnight Rodeo');
    button.innerHTML = `<span class="midnight-gallery-image"><img src="${thumb}" alt="Midnight Rodeo artwork by Jahntella" width="420" height="420" loading="lazy" decoding="async"></span>`;
    button.addEventListener('click', () => window.jahntellaPlayShineEraTrack?.('midnight-rodeo', false));
    grid.appendChild(button);
    orderAesthetic();
  };

  const init = () => { addVisualizer(); addAestheticCover(); orderAesthetic(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
  const observer = new MutationObserver(orderAesthetic);
  observer.observe(document.documentElement, {childList:true, subtree:true});
})();
