(() => {
  'use strict';
  if (window.__jahntellaRedlinePresentation) return;
  window.__jahntellaRedlinePresentation = true;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;

  const cfg = window.JAHNTELLA_ALBUM2?.tracks?.redline || {};
  const abs = p => new URL(p, document.baseURI).href;
  const art = abs(cfg.artwork || 'assets/album2/redline-cover.webp');
  const thumb = abs(cfg.artworkThumb || 'assets/album2/redline-cover-thumb.webp');
  const video = abs(cfg.fullVideo || 'assets/album2/redline-official-visualizer.mp4');

  const addVisualizer = () => {
    const grid = document.querySelector('.exp66-shine-videos');
    if (!grid) return;
    const existing = Array.from(grid.querySelectorAll(':scope > article')).find(card => card.querySelector('h3')?.textContent?.trim().toLowerCase() === 'redline');
    if (existing) return;

    const card = document.createElement('article');
    card.id = 'redlineShineEraVisualizer';
    // Use the exact same card/frame classes as the original three Shine Era visualizers.
    card.className = 'exp60-shine-video-card';
    card.innerHTML = `<div class="exp60-shine-video-heading"><span>THE SHINE ERA <i aria-hidden="true"></i> OFFICIAL VISUALIZER</span><h3>Redline</h3></div><div class="exp60-shine-video-frame"><video controls playsinline preload="metadata" poster="${art}" aria-label="Play the Redline official visualizer"><source src="${video}" type="video/mp4"></video></div><div class="exp60-shine-video-note"><span aria-hidden="true">◇</span><p><strong>Redline.</strong> Full song + visualizer from The Shine Era.</p></div>`;

    const midnightCard = Array.from(grid.querySelectorAll(':scope > article')).find(card => card.querySelector('h3')?.textContent?.trim().toLowerCase() === 'midnight rodeo');
    if (midnightCard) grid.insertBefore(card, midnightCard.nextSibling);
    else grid.appendChild(card);

    card.querySelector('video')?.addEventListener('play', () => window.jahntellaStopShineEraTrack?.());
  };

  const addAestheticCover = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('redlineAestheticCover')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'redlineAestheticCover';
    button.className = 'gallery-item redline-gallery-play';
    button.setAttribute('aria-label', 'Play or pause Redline');
    button.innerHTML = `<span class="redline-gallery-image"><img src="${thumb}" alt="Redline artwork by Jahntella" width="420" height="420" loading="lazy" decoding="async"></span>`;
    button.addEventListener('click', () => window.jahntellaPlayShineEraTrack?.('redline', false));

    // Aesthetics order: Midnight Rodeo immediately before Redline.
    const midnight = grid.querySelector('#midnightRodeoAestheticCover');
    if (midnight) midnight.insertAdjacentElement('afterend', button);
    else grid.appendChild(button);
  };

  const init = () => { addVisualizer(); addAestheticCover(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
