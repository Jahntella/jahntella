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

  const removeOldRedlineCards = grid => {
    grid.querySelectorAll(':scope > article').forEach(card => {
      const id = card.id || '';
      const marked = card.dataset.redlineShine === 'true';
      const title = card.querySelector('h3')?.textContent?.trim().toLowerCase() || '';
      if (id === 'redlineInlineVisualizer' || id === 'redlineShineCard' || marked || title === 'redline') card.remove();
    });
  };

  const addVisualizer = () => {
    const grid = document.querySelector('.exp66-shine-videos');
    if (!grid) return;
    removeOldRedlineCards(grid);
    if (grid.querySelector('[data-redline-shine="true"]')) return;

    const card = document.createElement('article');
    card.className = 'exp60-shine-video-card redline-inline-card';
    card.dataset.redlineShine = 'true';
    card.innerHTML = `
      <div class="exp60-shine-video-heading">
        <span>THE SHINE ERA <i aria-hidden="true"></i> OFFICIAL VISUALIZER</span>
        <h3>Redline</h3>
      </div>
      <div class="exp60-shine-video-frame redline-video-frame">
        <video controls playsinline preload="metadata" poster="${art}" aria-label="Play the Redline official visualizer">
          <source src="${video}" type="video/mp4">
        </video>
      </div>
      <div class="exp60-shine-video-note">
        <span aria-hidden="true">◇</span>
        <p><strong>Redline.</strong> Full song + visualizer from The Shine Era.</p>
      </div>`;
    grid.appendChild(card);

    const player = card.querySelector('video');
    player?.addEventListener('play', () => window.jahntellaStopShineEraTrack?.());
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
    button.addEventListener('click', () => {
      window.jahntellaPlayShineEraTrack?.('redline', false);
    });
    grid.appendChild(button);
  };

  const loadGalleryOrderFix = () => {
    if (window.__jahntellaGalleryEraOrderFixLoaded) return;
    window.__jahntellaGalleryEraOrderFixLoaded = true;
    const script = document.createElement('script');
    script.defer = true;
    script.src = new URL('gallery-era-order-fix.js?v=20260819.1', document.baseURI).href;
    document.head.appendChild(script);
  };

  const init = () => {
    addVisualizer();
    addAestheticCover();
    window.setTimeout(loadGalleryOrderFix, 350);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
