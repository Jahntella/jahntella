(() => {
  'use strict';
  if (window.__midnightRodeoOptimizedInitialized) return;
  window.__midnightRodeoOptimizedInitialized = true;

  const config = window.JAHNTELLA_ALBUM2?.tracks?.['midnight-rodeo'] || {
    fullAudio: 'assets/album2/midnight-rodeo.mp3',
    fullVideo: 'assets/album2/midnight-rodeo-official-visualizer.mp4',
    artwork: 'assets/album2/midnight-rodeo-cover.webp'
  };

  const root = new URL('.', document.baseURI);
  const url = path => new URL(path, root).href;
  const isSweetville = location.pathname.toLowerCase().includes('/sweetville');
  const audioId = 'midnightRodeoAudio';

  const getAudio = () => {
    let audio = document.getElementById(audioId);
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.id = audioId;
    audio.preload = 'none';
    audio.src = url(config.fullAudio);
    audio.setAttribute('aria-label', 'Midnight Rodeo full song');
    audio.style.position = 'absolute';
    audio.style.width = '1px';
    audio.style.height = '1px';
    audio.style.opacity = '0';
    audio.style.pointerEvents = 'none';
    document.body.appendChild(audio);
    return audio;
  };

  const stopOtherMedia = (except = null) => {
    document.querySelectorAll('audio').forEach(node => {
      if (node !== except && !node.paused) node.pause();
    });
    document.querySelectorAll('video').forEach(node => {
      if (node !== except && !node.paused) node.pause();
    });
  };

  const updatePlayerChrome = (playing = true) => {
    if (isSweetville) return;
    const title = document.getElementById('playerTitle');
    const art = document.getElementById('playerArtwork');
    const toggle = document.getElementById('playerToggle');
    if (title) title.textContent = 'Midnight Rodeo';
    if (art) {
      art.src = url(config.artwork);
      art.alt = 'Midnight Rodeo artwork';
    }
    if (toggle) {
      toggle.textContent = playing ? '❚❚' : '▶';
      toggle.setAttribute('aria-label', playing ? 'Pause Midnight Rodeo' : 'Play Midnight Rodeo');
    }
    document.getElementById('player')?.classList.toggle('playing', playing);
  };

  const playMidnight = async (restart = false) => {
    const audio = getAudio();
    stopOtherMedia(audio);
    if (restart) {
      try { audio.currentTime = 0; } catch (_) {}
    }
    try { await audio.play(); } catch (_) {}
    updatePlayerChrome(true);
  };

  const playFunDippAfterMidnight = () => {
    if (isSweetville) {
      const button = document.querySelector('[data-exp42-player="fun-dipp"] [data-exp42-play]');
      if (button) {
        button.click();
        return;
      }
      const legacy = document.querySelector('[data-radio*="Fun Dipp"], [data-exp254-track="fun"]');
      if (legacy) legacy.click();
      return;
    }
    if (typeof window.jahntellaSelectSiteTrack === 'function') {
      window.jahntellaSelectSiteTrack('fun-dipp', true, {fresh: true});
      return;
    }
    const button = document.querySelector('.play-button[data-track="fun-dipp"]');
    if (button) button.click();
  };

  const attachPlaylistBridge = () => {
    const audio = getAudio();
    if (audio.dataset.mrPlaylistBridge === '1') return;
    audio.dataset.mrPlaylistBridge = '1';

    audio.addEventListener('play', () => updatePlayerChrome(true));
    audio.addEventListener('pause', () => updatePlayerChrome(false));
    audio.addEventListener('ended', () => {
      updatePlayerChrome(false);
      playFunDippAfterMidnight();
    });

    const boots = document.getElementById('audioBootsSmileAttitude');
    if (boots && boots.dataset.mrAfterBoots !== '1') {
      boots.dataset.mrAfterBoots = '1';
      boots.addEventListener('ended', () => {
        window.setTimeout(() => playMidnight(true), 0);
      });
    }
  };

  const buildInlineVisualizer = () => {
    if (isSweetville) return null;
    const grid = document.querySelector('.exp66-shine-videos');
    if (!grid) return null;
    const existing = document.getElementById('midnightRodeoInlineVisualizer');
    if (existing) return existing;

    grid.classList.add('mr-has-midnight');
    const card = document.createElement('article');
    card.id = 'midnightRodeoInlineVisualizer';
    card.className = 'exp60-shine-video-card mr-inline-midnight-card';
    card.innerHTML = `
      <div class="exp60-shine-video-heading">
        <span><i aria-hidden="true"></i>FULL VISUALIZER</span>
        <h3>Midnight Rodeo</h3>
      </div>
      <div class="exp60-shine-video-frame">
        <video controls playsinline preload="metadata" poster="${url(config.artwork)}" aria-label="Midnight Rodeo official visualizer">
          <source src="${url(config.fullVideo)}" type="video/mp4">
        </video>
      </div>
      <div class="exp60-shine-video-note">
        <span aria-hidden="true">🤠</span>
        <p><strong>The latest Shine Era teaser.</strong> Full song + visualizer.</p>
      </div>
    `;
    grid.appendChild(card);

    const video = card.querySelector('video');
    video?.addEventListener('play', () => {
      const audio = document.getElementById(audioId);
      if (audio && !audio.paused) audio.pause();
      stopOtherMedia(video);
    });
    return card;
  };

  const addAestheticCover = () => {
    if (isSweetville) return null;
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('midnightRodeoAestheticCover')) return null;

    // Aesthetic gallery must be artwork-only: no caption, no label, no button text.
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'midnightRodeoAestheticCover';
    button.className = 'gallery-item mr-gallery-play-card';
    button.setAttribute('aria-label', 'Play or pause Midnight Rodeo');
    button.innerHTML = `
      <span class="mr-gallery-image-wrap">
        <img src="${url('assets/album2/midnight-rodeo-cover-thumb.webp')}"
             alt="Midnight Rodeo artwork by Jahntella"
             loading="lazy"
             fetchpriority="low"
             decoding="async"
             width="420"
             height="420">
      </span>
    `;

    // Insert into the same gallery grid; the cover itself is the only visual/interactive element.
    grid.appendChild(button);

    button.addEventListener('click', () => {
      const audio = getAudio();
      if (audio.paused) playMidnight();
      else audio.pause();
    });
    return button;
  };

  const addSweetvilleCard = () => {
    if (!isSweetville) return null;
    const host = document.querySelector('.exp42-music-drop') || document.querySelector('.exp42-music-section') || document.querySelector('main');
    if (!host || document.getElementById('midnightRodeoSweetvilleCard')) return null;
    const card = document.createElement('article');
    card.id = 'midnightRodeoSweetvilleCard';
    card.className = 'mr-sweetville-card';
    card.innerHTML = `
      <img src="${url('assets/album2/midnight-rodeo-cover-thumb.webp')}"
           alt="Midnight Rodeo artwork"
           loading="lazy"
           fetchpriority="low"
           decoding="async"
           width="420"
           height="420">
      <div><small>THE SHINE ERA</small><h3>Midnight Rodeo</h3><p>Tap the artwork to play.</p></div>`;
    host.appendChild(card);
    card.querySelector('img')?.addEventListener('click', () => {
      const audio = getAudio();
      if (audio.paused) playMidnight();
      else audio.pause();
    });
    return card;
  };

  const optimizeAestheticLoading = () => {
    const gallery = document.querySelector('.gallery-section');
    if (!gallery) return;
    gallery.classList.add('mr-gallery-optimized');
    gallery.querySelectorAll('img').forEach((img, index) => {
      if (index > 0) img.loading = 'lazy';
      img.decoding = 'async';
      img.fetchPriority = 'low';
    });
  };

  const updateHomepageCount = () => {
    const heading = document.querySelector('.exp44-new-music-head h2');
    if (heading) heading.innerHTML = heading.innerHTML.replace(/\b15 new songs\b/i, '16 new songs');
  };

  const init = () => {
    getAudio();
    attachPlaylistBridge();
    buildInlineVisualizer();
    addAestheticCover();
    addSweetvilleCard();
    optimizeAestheticLoading();
    if (!isSweetville) updateHomepageCount();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
