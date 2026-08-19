(() => {
  'use strict';
  if (window.__midnightRodeoUnifiedInitialized) return;
  window.__midnightRodeoUnifiedInitialized = true;

  const config = window.JAHNTELLA_ALBUM2?.tracks?.['midnight-rodeo'] || {
    fullAudio: 'assets/album2/midnight-rodeo.mp3',
    fullVideo: 'assets/album2/midnight-rodeo-official-visualizer.mp4',
    artwork: 'assets/album2/midnight-rodeo-cover.webp'
  };
  const root = new URL('.', document.baseURI);
  const url = path => new URL(path, root).href;
  const midnightAudioUrl = url(config.fullAudio);
  const midnightArtwork = url(config.artwork);
  const isSweetville = location.pathname.toLowerCase().includes('/sweetville');
  const STATE_KEY = 'jahntellaMidnightRodeoTransportV1';
  const BOOTS_ID = 'audioBootsSmileAttitude';
  let boots = null;
  let originalBootsSrc = '';
  let midnightActive = false;
  let restoring = false;

  const findBoots = () => document.getElementById(BOOTS_ID);

  const rememberBootsSource = () => {
    boots = findBoots();
    if (!boots) return null;
    if (!originalBootsSrc) {
      originalBootsSrc = boots.querySelector('source')?.src || boots.currentSrc || boots.src || '';
    }
    return boots;
  };

  const stopVideos = except => {
    document.querySelectorAll('video').forEach(video => {
      if (video !== except && !video.paused) video.pause();
    });
  };

  const removeObsoleteMidnightUI = () => {
    [
      '#midnightRodeoSiteSection',
      '#midnightRodeoSweetvilleSection',
      '#midnightRodeoSweetvilleCard'
    ].forEach(selector => document.querySelector(selector)?.remove());

    document.querySelectorAll('.mr-gallery-caption,[data-mr-cover-label]').forEach(node => node.remove());

    // Remove the old non-music portrait that was added to the visual gallery.
    document.querySelectorAll('#gallery .gallery-item[data-lightbox*="jahntella-official-v1.png"]').forEach(node => node.remove());
  };

  const saveState = (playing = false) => {
    if (!midnightActive || !boots) return;
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify({
        active: true,
        playing: Boolean(playing && !boots.paused && !boots.ended),
        position: Number(boots.currentTime) || 0,
        savedAt: Date.now()
      }));
    } catch {}
  };

  const clearState = () => {
    try { sessionStorage.removeItem(STATE_KEY); } catch {}
  };

  const restoreBootsSource = () => {
    if (!boots || !originalBootsSrc || restoring) return;
    const current = boots.currentSrc || boots.src || '';
    if (!current.includes('midnight-rodeo')) return;
    restoring = true;
    const wasPlaying = !boots.paused && !boots.ended;
    boots.pause();
    boots.src = originalBootsSrc;
    boots.load();
    if (!wasPlaying) {
      try { boots.currentTime = 0; } catch {}
    }
    midnightActive = false;
    clearState();
    window.setTimeout(() => { restoring = false; }, 0);
  };

  const setPlayerChrome = playing => {
    if (isSweetville) return;
    const title = document.getElementById('playerTitle');
    const art = document.getElementById('playerArtwork');
    const toggle = document.getElementById('playerToggle');
    if (title) title.textContent = 'Midnight Rodeo';
    if (art) {
      art.src = midnightArtwork;
      art.alt = 'Midnight Rodeo artwork';
    }
    if (toggle) {
      toggle.textContent = playing ? '❚❚' : '▶';
      toggle.setAttribute('aria-label', playing ? 'Pause Midnight Rodeo' : 'Play Midnight Rodeo');
    }
    document.getElementById('player')?.classList.toggle('playing', Boolean(playing));
  };

  const startMidnight = async (restart = false) => {
    if (isSweetville) return;
    rememberBootsSource();
    if (!boots || !originalBootsSrc || typeof window.jahntellaSelectSiteTrack !== 'function') return;

    stopVideos();
    document.querySelectorAll('audio').forEach(audio => {
      if (audio !== boots && !audio.paused) audio.pause();
    });

    const wasMidnight = (boots.currentSrc || boots.src || '').includes('midnight-rodeo');
    if (!wasMidnight) {
      boots.pause();
      boots.src = midnightAudioUrl;
      boots.load();
      midnightActive = true;
    }
    if (restart) {
      try { boots.currentTime = 0; } catch {}
    }

    midnightActive = true;
    try { window.jahntellaSelectSiteTrack('boots-smile-attitude', true, {fresh: true}); } catch {}
    window.setTimeout(() => {
      setPlayerChrome(!boots.paused);
      saveState(!boots.paused);
    }, 20);
  };

  const patchUnifiedPlayer = () => {
    rememberBootsSource();
    if (!boots) return;

    boots.addEventListener('play', () => {
      const current = boots.currentSrc || boots.src || '';
      if (midnightActive && current.includes('midnight-rodeo')) {
        stopVideos();
        setPlayerChrome(true);
        saveState(true);
      }
    });

    boots.addEventListener('pause', () => {
      const current = boots.currentSrc || boots.src || '';
      if (midnightActive && current.includes('midnight-rodeo')) {
        setPlayerChrome(false);
        saveState(false);
      }
    });

    boots.addEventListener('timeupdate', () => {
      const current = boots.currentSrc || boots.src || '';
      if (midnightActive && current.includes('midnight-rodeo')) saveState(true);
    });

    boots.addEventListener('ended', () => {
      const current = boots.currentSrc || boots.src || '';
      if (!current.includes('midnight-rodeo')) return;
      // The existing player owns the next-track transition. Because its current
      // track key remains Boots, its normal next action is Fun Dipp.
      window.setTimeout(restoreBootsSource, 50);
    });

    window.addEventListener('pagehide', () => saveState(!boots.paused && !boots.ended));

    // If the visitor clicks another song while Midnight Rodeo is active,
    // restore the real Boots source before the existing player handles the click.
    document.addEventListener('click', event => {
      const playButton = event.target.closest?.('.play-button[data-track]');
      const playableCover = event.target.closest?.('[data-jahntella-cover-track]');
      const prevNext = event.target.closest?.('#playerPrev,#playerNext');
      const selectingOther = playButton && playButton.dataset.track !== 'boots-smile-attitude';
      const otherCover = playableCover && playableCover.dataset.jahntellaCoverTrack !== 'boots-smile-attitude';
      if (selectingOther || otherCover || prevNext) restoreBootsSource();
      if (playButton?.dataset.track === 'boots-smile-attitude') restoreBootsSource();
    }, true);

    // Prevent any video visualizer from ever playing over the music bar.
    document.addEventListener('play', event => {
      const video = event.target;
      if (!(video instanceof HTMLVideoElement)) return;
      document.querySelectorAll('audio').forEach(audio => {
        if (!audio.paused) audio.pause();
      });
      if (midnightActive) saveState(false);
    }, true);
  };

  const addInlineVisualizer = () => {
    if (isSweetville) return;
    const grid = document.querySelector('.exp66-shine-videos');
    if (!grid || document.getElementById('midnightRodeoInlineVisualizer')) return;
    grid.classList.add('mr-has-midnight');
    const card = document.createElement('article');
    card.id = 'midnightRodeoInlineVisualizer';
    card.className = 'exp60-shine-video-card mr-inline-midnight-card';
    card.innerHTML = `
      <div class="exp60-shine-video-heading">
        <span>NEW ERA <i aria-hidden="true"></i> OFFICIAL VISUALIZER</span>
        <h3>Midnight Rodeo</h3>
      </div>
      <div class="exp60-shine-video-frame">
        <video controls playsinline preload="none" poster="${midnightArtwork}" aria-label="Play the Midnight Rodeo official visualizer">
          <source src="${url(config.fullVideo)}" type="video/mp4">
        </video>
      </div>
      <div class="exp60-shine-video-note">
        <span aria-hidden="true">◇</span>
        <p><strong>Midnight Rodeo.</strong> Full song + visualizer from The Shine Era.</p>
      </div>`;
    grid.appendChild(card);
  };

  const addAestheticCover = () => {
    if (isSweetville) return;
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('midnightRodeoAestheticCover')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'midnightRodeoAestheticCover';
    button.className = 'gallery-item mr-gallery-play-card';
    button.setAttribute('aria-label', 'Play or pause Midnight Rodeo');
    button.innerHTML = `
      <span class="mr-gallery-image-wrap">
        <img src="${url('assets/album2/midnight-rodeo-cover-thumb.webp')}" alt="Midnight Rodeo artwork by Jahntella" loading="lazy" fetchpriority="low" decoding="async" width="420" height="420">
      </span>`;
    grid.appendChild(button);
    button.addEventListener('click', () => startMidnight(false));
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

  const restoreMidnightIfNeeded = () => {
    if (isSweetville) return;
    try {
      const state = JSON.parse(sessionStorage.getItem(STATE_KEY) || '{}');
      if (!state.active) return;
      rememberBootsSource();
      if (!boots || typeof window.jahntellaSelectSiteTrack !== 'function') return;
      boots.src = midnightAudioUrl;
      boots.load();
      midnightActive = true;
      const restore = () => {
        try { boots.currentTime = Math.max(0, Number(state.position) || 0); } catch {}
        try { window.jahntellaSelectSiteTrack('boots-smile-attitude', Boolean(state.playing), {fresh: true}); } catch {}
        setPlayerChrome(Boolean(state.playing));
      };
      if (boots.readyState >= 1) restore();
      else boots.addEventListener('loadedmetadata', restore, {once:true});
    } catch {}
  };

  const init = () => {
    removeObsoleteMidnightUI();
    patchUnifiedPlayer();
    addInlineVisualizer();
    addAestheticCover();
    optimizeAestheticLoading();
    restoreMidnightIfNeeded();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
