(() => {
  'use strict';
  if (window.__midnightRodeoUnifiedPlayerInitialized) return;
  window.__midnightRodeoUnifiedPlayerInitialized = true;

  const config = window.JAHNTELLA_ALBUM2?.tracks?.['midnight-rodeo'] || {
    fullAudio: 'assets/album2/midnight-rodeo.mp3',
    fullVideo: 'assets/album2/midnight-rodeo-official-visualizer.mp4',
    artwork: 'assets/album2/midnight-rodeo-cover.webp'
  };

  const root = new URL('.', document.baseURI);
  const url = path => new URL(path, root).href;
  const isSweetville = location.pathname.toLowerCase().includes('/sweetville');
  const audioId = 'midnightRodeoAudio';

  const getMidnightAudio = () => {
    let audio = document.getElementById(audioId);
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.id = audioId;
    audio.preload = 'none';
    audio.src = url(config.fullAudio);
    audio.setAttribute('aria-label', 'Midnight Rodeo full song');
    audio.hidden = true;
    document.body.appendChild(audio);
    return audio;
  };

  const mainPlayer = () => document.getElementById('player');
  const playerToggle = () => document.getElementById('playerToggle');
  const playerPrev = () => document.getElementById('playerPrev');
  const playerNext = () => document.getElementById('playerNext');
  const playerTitle = () => document.getElementById('playerTitle');
  const playerArtwork = () => document.getElementById('playerArtwork');
  const playerProgress = () => document.getElementById('playerProgress');
  const playerTime = () => document.getElementById('playerTime');
  const playerVolume = () => document.getElementById('playerVolume');

  let midnightPlaying = false;
  let midnightActive = false;
  let controlsBound = false;
  let visualizerVideo = null;

  const formatTime = seconds => {
    if (!Number.isFinite(seconds)) return '0:00';
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  };

  const stopOtherMedia = (exceptAudio = null, exceptVideo = null) => {
    document.querySelectorAll('audio').forEach(node => {
      if (node !== exceptAudio && !node.paused) node.pause();
    });
    document.querySelectorAll('video').forEach(node => {
      if (node !== exceptVideo && !node.paused) node.pause();
    });
  };

  const syncPlayer = () => {
    const audio = getMidnightAudio();
    const player = mainPlayer();
    if (!player) return;
    const playing = !audio.paused && !audio.ended;
    midnightPlaying = playing;
    const title = playerTitle();
    const art = playerArtwork();
    const toggle = playerToggle();
    const progress = playerProgress();
    const time = playerTime();
    if (title) title.textContent = 'Midnight Rodeo';
    if (art) {
      art.src = url(config.artwork);
      art.alt = 'Midnight Rodeo artwork';
    }
    if (toggle) {
      toggle.textContent = playing ? '❚❚' : '▶';
      toggle.setAttribute('aria-label', playing ? 'Pause Midnight Rodeo' : 'Play Midnight Rodeo');
    }
    if (progress) progress.value = audio.duration ? String((audio.currentTime / audio.duration) * 100) : '0';
    if (time) time.textContent = formatTime(audio.currentTime);
    player.classList.add('visible');
    player.classList.toggle('playing', playing);
  };

  const pauseMidnight = () => {
    const audio = document.getElementById(audioId);
    if (!audio) return;
    if (!audio.paused) audio.pause();
    midnightPlaying = false;
    midnightActive = true;
    if (!isSweetville) syncPlayer();
  };

  const playMidnight = async (restart = false) => {
    const audio = getMidnightAudio();
    midnightActive = true;
    stopOtherMedia(audio, visualizerVideo);
    if (restart) {
      try { audio.currentTime = 0; } catch (_) {}
    }
    if (!isSweetville) {
      syncPlayer();
      const volume = playerVolume();
      if (volume) audio.volume = Number(volume.value);
    }
    try { await audio.play(); } catch (_) {}
    syncPlayer();
  };

  const playFunDipp = () => {
    if (typeof window.jahntellaSelectSiteTrack === 'function') {
      window.jahntellaSelectSiteTrack('fun-dipp', true, {fresh: true});
      return;
    }
    const button = document.querySelector('.play-button[data-track="fun-dipp"],[data-exp42-player="fun-dipp"] [data-exp42-play]');
    button?.click();
  };

  const playBoots = () => {
    if (typeof window.jahntellaSelectSiteTrack === 'function') {
      window.jahntellaSelectSiteTrack('boots-smile-attitude', true, {fresh: true});
      return;
    }
    const button = document.querySelector('.play-button[data-track="boots-smile-attitude"],[data-exp42-player="boots-smile-attitude"] [data-exp42-play]');
    button?.click();
  };

  const attachAudioGuards = rootNode => {
    const nodes = rootNode?.matches?.('audio') ? [rootNode] : Array.from(rootNode?.querySelectorAll?.('audio') || []);
    nodes.forEach(audio => {
      if (audio.dataset.mrGuard === '1') return;
      audio.dataset.mrGuard = '1';
      audio.addEventListener('play', () => {
        if (audio !== getMidnightAudio()) { midnightActive = false; pauseMidnight(); }
        if (visualizerVideo && !visualizerVideo.paused) visualizerVideo.pause();
      });
    });
  };

  const removeNonMusicArtwork = () => {
    document.querySelectorAll('#gallery [data-lightbox], #gallery .gallery-item').forEach(item => {
      const lightbox = item.getAttribute('data-lightbox') || '';
      const img = item.querySelector('img');
      const src = img?.getAttribute('src') || '';
      if (/jahntella-official-v1\.png(?:\?|$)/i.test(lightbox) || /jahntella-official-v1\.png(?:\?|$)/i.test(src)) {
        item.remove();
      }
    });
  };

  const optimizeGalleryLoading = gallery => {
    if (!gallery) return;
    gallery.classList.add('mr-gallery-optimized');
    gallery.querySelectorAll('img').forEach((img, index) => {
      img.decoding = 'async';
      img.fetchPriority = index < 2 ? 'auto' : 'low';
      if (index > 1) img.loading = 'lazy';
    });
  };

  const addPlayableAestheticCover = () => {
    if (isSweetville) return;
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid) return;

    document.getElementById('midnightRodeoAestheticCover')?.remove();

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'midnightRodeoAestheticCover';
    button.className = 'gallery-item mr-gallery-play-card';
    button.setAttribute('aria-label', 'Play or pause Midnight Rodeo');
    button.innerHTML = `
      <span class="mr-gallery-image-wrap">
        <img src="${url(config.artwork)}" alt="Midnight Rodeo artwork" loading="lazy" decoding="async" fetchpriority="low">
      </span>
    `;
    grid.appendChild(button);

    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const audio = getMidnightAudio();
      if (audio.paused) playMidnight();
      else pauseMidnight();
    });

    optimizeGalleryLoading(grid);
  };

  const addInlineVisualizer = () => {
    if (isSweetville) return;
    const grid = document.querySelector('.exp66-shine-videos');
    if (!grid) return;
    document.getElementById('midnightRodeoInlineVisualizer')?.remove();

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
    grid.classList.add('mr-has-midnight');

    visualizerVideo = card.querySelector('video');
    visualizerVideo?.addEventListener('play', () => {
      stopOtherMedia(null, visualizerVideo);
      pauseMidnight();
    });

    visualizerVideo?.addEventListener('pause', () => {
      if (!isSweetville) syncPlayer();
    });
  };

  const bindUnifiedPlayerControls = () => {
    if (controlsBound || isSweetville) return;
    const player = mainPlayer();
    if (!player) return;
    controlsBound = true;

    player.addEventListener('click', event => {
      if (!midnightActive) return;
      const target = event.target.closest('#playerToggle,#playerPrev,#playerNext');
      if (!target) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (target.id === 'playerToggle') {
        const audio = getMidnightAudio();
        if (audio.paused) playMidnight(); else pauseMidnight();
      } else if (target.id === 'playerPrev') {
        playBoots();
      } else if (target.id === 'playerNext') {
        playFunDipp();
      }
    }, true);

    player.addEventListener('input', event => {
      const target = event.target;
      if (!midnightPlaying || !(target instanceof HTMLInputElement)) return;
      const audio = getMidnightAudio();
      if (target.id === 'playerProgress' && audio.duration) {
        event.preventDefault();
        event.stopImmediatePropagation();
        audio.currentTime = (Number(target.value) / 100) * audio.duration;
        const time = playerTime();
        if (time) time.textContent = formatTime(audio.currentTime);
      }
      if (target.id === 'playerVolume') {
        event.preventDefault();
        event.stopImmediatePropagation();
        audio.volume = Number(target.value);
      }
    }, true);
  };

  const attachPlaylistBridge = () => {
    const audio = getMidnightAudio();
    if (audio.dataset.mrPlaylistBridge === '1') return;
    audio.dataset.mrPlaylistBridge = '1';
    audio.addEventListener('play', syncPlayer);
    audio.addEventListener('pause', syncPlayer);
    audio.addEventListener('loadedmetadata', syncPlayer);
    audio.addEventListener('timeupdate', syncPlayer);
    audio.addEventListener('ended', () => {
      midnightPlaying = false;
      midnightActive = false;
      syncPlayer();
      playFunDipp();
    });

    const boots = document.getElementById('audioBootsSmileAttitude');
    if (boots && boots.dataset.mrAfterBoots === '1') return;
    if (boots) {
      boots.dataset.mrAfterBoots = '1';
      boots.addEventListener('ended', () => {
        window.setTimeout(() => playMidnight(true), 0);
      });
    }
  };

  const init = () => {
    removeNonMusicArtwork();
    addPlayableAestheticCover();
    addInlineVisualizer();
    bindUnifiedPlayerControls();
    attachPlaylistBridge();
    attachAudioGuards(document.body);

    const observer = new MutationObserver(records => {
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          attachAudioGuards(node);
          if (node.matches?.('.gallery-section') || node.querySelector?.('.gallery-section')) {
            removeNonMusicArtwork();
            addPlayableAestheticCover();
          }
        });
      });
    });
    observer.observe(document.body, {childList: true, subtree: true});

    if (!isSweetville) {
      const volume = playerVolume();
      if (volume) getMidnightAudio().volume = Number(volume.value);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
