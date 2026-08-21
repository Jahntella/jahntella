(() => {
  'use strict';
  if (window.__jahntellaShineEraTransport) return;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;
  window.__jahntellaShineEraTransport = true;

  const EXT = {
    'midnight-rodeo': {
      title: 'Midnight Rodeo',
      audio: 'assets/album2/midnight-rodeo.mp3',
      artwork: 'assets/album2/midnight-rodeo-cover.webp',
      next: 'redline',
      prev: 'boots-smile-attitude'
    },
    redline: {
      title: 'Redline',
      audio: 'assets/album2/redline.mp3',
      artwork: 'assets/album2/redline-cover.webp',
      next: 'smoke-show',
      prev: 'midnight-rodeo'
    },
    'smoke-show': {
      title: 'Smoke Show',
      audio: 'assets/album2/smoke-show.mp3',
      artwork: 'assets/album2/smoke-show-cover.webp',
      next: 'chasing-me',
      prev: 'redline'
    },
    'chasing-me': {
      title: 'Chasing Me',
      audio: 'assets/album2/chasing-me.mp3',
      artwork: 'assets/album2/chasing-me-cover.webp',
      next: 'fun-dipp',
      prev: 'smoke-show'
    }
  };

  let audio = null;
  let originalSrc = '';
  let activeKey = null;
  let savedPosition = 0;

  const abs = p => new URL(p, document.baseURI).href;
  const getAudio = () => {
    if (!audio) audio = document.getElementById('audioBootsSmileAttitude');
    if (audio && !originalSrc) originalSrc = audio.currentSrc || audio.src || audio.querySelector('source')?.src || '';
    return audio;
  };

  const isActive = () => !!activeKey && !!EXT[activeKey];

  const stopOtherMedia = except => {
    document.querySelectorAll('audio,video').forEach(node => {
      if (node !== except && !node.paused) node.pause();
    });
  };

  const formatTime = sec => {
    const n = Number.isFinite(sec) ? Math.max(0, sec) : 0;
    return `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`;
  };

  const updatePlayer = (playing = false) => {
    if (!activeKey || !audio) return;
    const cfg = EXT[activeKey];
    const player = document.getElementById('player');
    const title = document.getElementById('playerTitle');
    const art = document.getElementById('playerArtwork');
    const toggle = document.getElementById('playerToggle');
    const progress = document.getElementById('playerProgress');
    const time = document.getElementById('playerTime');

    if (player) player.classList.add('visible');
    if (title) title.textContent = cfg.title;
    if (art) {
      art.src = abs(cfg.artwork);
      art.alt = `${cfg.title} artwork by Jahntella`;
    }
    if (toggle) {
      toggle.textContent = playing ? '❚❚' : '▶';
      toggle.setAttribute('aria-label', playing ? `Pause ${cfg.title}` : `Play ${cfg.title}`);
    }
    if (progress) progress.value = audio.duration > 0 ? String((audio.currentTime / audio.duration) * 100) : '0';
    if (time) time.textContent = formatTime(audio.currentTime);
  };

  const restoreNormalTransport = () => {
    const el = getAudio();
    if (!el || !originalSrc || !activeKey) return;
    el.pause();
    el.src = originalSrc;
    el.load();
    activeKey = null;
    savedPosition = 0;
  };

  const startExtension = (key, restart = true) => {
    const el = getAudio();
    const cfg = EXT[key];
    if (!el || !cfg) return;

    stopOtherMedia(el);
    activeKey = key;
    if (restart) savedPosition = 0;

    // Keep the site's original player logic pointed at the single BSA audio node;
    // we temporarily repurpose that node so the bottom player stays the transport.
    try { window.jahntellaSelectSiteTrack?.('boots-smile-attitude', false, {fresh:true}); } catch {}

    const target = abs(cfg.audio);
    const current = el.currentSrc || el.src || '';
    if (!current.includes(cfg.audio)) {
      el.pause();
      el.src = target;
      el.load();
    }

    const begin = () => {
      try { el.currentTime = restart ? 0 : savedPosition; } catch {}
      el.play().then(() => updatePlayer(true)).catch(() => updatePlayer(false));
    };
    if (el.readyState >= 1) begin();
    else el.addEventListener('loadedmetadata', begin, {once:true});
  };

  const playNext = () => {
    if (!activeKey) return;
    const next = EXT[activeKey].next;
    if (EXT[next]) startExtension(next, true);
    else {
      restoreNormalTransport();
      window.jahntellaSelectSiteTrack?.(next, true, {fresh:true});
    }
  };

  const playPrev = () => {
    if (!activeKey) return;
    const prev = EXT[activeKey].prev;
    if (EXT[prev]) startExtension(prev, true);
    else {
      restoreNormalTransport();
      window.jahntellaSelectSiteTrack?.(prev, true, {fresh:true});
    }
  };

  const handleEnded = event => {
    const el = getAudio();
    if (event.target !== el) return;

    if (!activeKey) {
      // The existing Boots, Smile & Attitude audio has reached its end.
      event.stopImmediatePropagation();
      startExtension('midnight-rodeo', true);
      return;
    }

    event.stopImmediatePropagation();
    const next = EXT[activeKey].next;
    if (EXT[next]) {
      startExtension(next, true);
    } else {
      const finished = activeKey;
      restoreNormalTransport();
      window.setTimeout(() => window.jahntellaSelectSiteTrack?.('fun-dipp', true, {fresh:true}), 0);
      void finished;
    }
  };

  document.addEventListener('ended', handleEnded, true);

  document.addEventListener('click', event => {
    const target = event.target.closest?.('#playerToggle,#playerNext,#playerPrev,.play-button[data-track],[data-jahntella-cover-track],#midnightRodeoAestheticCover,#redlineAestheticCover,#smokeShowAestheticCover,#chasingMeAestheticCover');
    if (!target || !activeKey || !audio) return;

    if (target.id === 'playerToggle') {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (audio.paused) audio.play().then(() => updatePlayer(true)).catch(() => updatePlayer(false));
      else audio.pause();
      return;
    }
    if (target.id === 'playerNext') {
      event.preventDefault();
      event.stopImmediatePropagation();
      playNext();
      return;
    }
    if (target.id === 'playerPrev') {
      event.preventDefault();
      event.stopImmediatePropagation();
      playPrev();
      return;
    }

    const coverKey = target.id === 'midnightRodeoAestheticCover' ? 'midnight-rodeo'
      : target.id === 'redlineAestheticCover' ? 'redline'
      : target.id === 'smokeShowAestheticCover' ? 'smoke-show'
      : target.id === 'chasingMeAestheticCover' ? 'chasing-me' : '';
    if (coverKey) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (activeKey === coverKey && !audio.paused) {
        savedPosition = audio.currentTime;
        audio.pause();
        updatePlayer(false);
      } else {
        startExtension(coverKey, activeKey !== coverKey);
      }
      return;
    }

    // Let normal site playback resume cleanly when another regular track is chosen.
    const otherTrack = target.dataset.track || target.dataset.jahntellaCoverTrack || '';
    if (otherTrack && otherTrack !== 'midnight-rodeo' && otherTrack !== 'redline' && otherTrack !== 'smoke-show' && otherTrack !== 'chasing-me') {
      restoreNormalTransport();
    }
  }, true);

  document.addEventListener('input', event => {
    if (!activeKey || !audio) return;
    const target = event.target;
    if (target?.id === 'playerProgress') {
      event.stopImmediatePropagation();
      if (audio.duration > 0) audio.currentTime = (Number(target.value) / 100) * audio.duration;
      savedPosition = audio.currentTime;
      updatePlayer(!audio.paused);
    }
    // The site's existing volume handler writes directly to this same audio node.
  }, true);

  const wire = () => {
    const el = getAudio();
    if (!el) return false;
    el.addEventListener('play', () => {
      if (activeKey) {
        stopOtherMedia(el);
        updatePlayer(true);
      }
    });
    el.addEventListener('pause', () => {
      if (activeKey) {
        savedPosition = el.currentTime || savedPosition;
        updatePlayer(false);
      }
    });
    el.addEventListener('timeupdate', () => {
      if (activeKey) {
        savedPosition = el.currentTime;
        updatePlayer(!el.paused);
      }
    });
    return true;
  };

  if (!wire()) {
    const timer = window.setInterval(() => {
      if (wire()) window.clearInterval(timer);
    }, 100);
    window.setTimeout(() => window.clearInterval(timer), 10000);
  }

  window.jahntellaPlayShineEraTrack = startExtension;
  window.jahntellaStopShineEraTrack = restoreNormalTransport;
})();
