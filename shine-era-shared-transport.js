(() => {
  'use strict';
  if (window.__jahntellaShineEraTransport) return;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;
  window.__jahntellaShineEraTransport = true;

  const PLAYBACK_KEY = 'jahntellaShineEraPlaybackV74';
  const SPOTIFY_ARTIST_URL = 'https://open.spotify.com/artist/49N5q7aQ2NOM68dZwdU9jK';

  const EXT = {
    'midnight-rodeo': {
      title: 'Midnight Rodeo',
      audio: 'assets/album2/midnight-rodeo.mp3',
      artwork: 'assets/album2/midnight-rodeo-cover.webp?v=77.0',
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
      next: 'coming-down',
      prev: 'smoke-show'
    },
    'coming-down': {
      title: 'Coming Down',
      audio: 'assets/album2/coming-down.mp3',
      artwork: 'assets/album2/coming-down-cover.webp',
      next: 'you-and-me',
      prev: 'chasing-me'
    },
    'you-and-me': {
      title: 'You and Me',
      audio: 'assets/album2/you-and-me.mp3',
      artwork: 'assets/album2/you-and-me-cover.webp',
      next: 'fun-dipp',
      prev: 'coming-down'
    }
  };

  let audio = null;
  let originalSrc = '';
  let activeKey = null;
  let savedPosition = 0;
  let lastSavedSecond = -1;

  const readPlayback = () => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(PLAYBACK_KEY) || '{}');
      return EXT[saved.track] ? saved : {};
    } catch {
      return {};
    }
  };

  const persistPlayback = (force = false) => {
    if (!activeKey || !audio || !EXT[activeKey]) return;
    const second = Math.floor(audio.currentTime || savedPosition || 0);
    if (!force && second === lastSavedSecond) return;
    lastSavedSecond = second;
    try {
      sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify({
        track: activeKey,
        position: audio.currentTime || savedPosition || 0,
        playing: !audio.paused && !audio.ended,
        savedAt: Date.now()
      }));
    } catch {}
  };

  const clearPlayback = () => {
    try { sessionStorage.removeItem(PLAYBACK_KEY); } catch {}
    lastSavedSecond = -1;
  };

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
    clearPlayback();
  };

  const startExtension = (key, restart = true, options = {}) => {
    const el = getAudio();
    const cfg = EXT[key];
    if (!el || !cfg) return;

    stopOtherMedia(el);
    activeKey = key;
    if (restart) savedPosition = 0;
    else if (Number(options.position) >= 0) savedPosition = Number(options.position) || 0;
    lastSavedSecond = -1;

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
      if (options.playing === false) {
        updatePlayer(false);
        persistPlayback(true);
        return;
      }
      el.play().then(() => {
        updatePlayer(true);
        persistPlayback(true);
      }).catch(() => {
        updatePlayer(false);
        persistPlayback(true);
      });
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
    const target = event.target.closest?.('#playerToggle,#playerNext,#playerPrev,.play-button[data-track],[data-jahntella-cover-track],#midnightRodeoAestheticCover,#redlineAestheticCover,#smokeShowAestheticCover,#chasingMeAestheticCover,#comingDownAestheticCover,#youAndMeAestheticCover');
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
      : target.id === 'chasingMeAestheticCover' ? 'chasing-me'
      : target.id === 'comingDownAestheticCover' ? 'coming-down'
      : target.id === 'youAndMeAestheticCover' ? 'you-and-me' : '';
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

    const otherTrack = target.dataset.track || target.dataset.jahntellaCoverTrack || '';
    if (otherTrack && otherTrack !== 'midnight-rodeo' && otherTrack !== 'redline' && otherTrack !== 'smoke-show' && otherTrack !== 'chasing-me' && otherTrack !== 'coming-down' && otherTrack !== 'you-and-me') {
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
  }, true);

  const wire = () => {
    const el = getAudio();
    if (!el) return false;
    el.addEventListener('play', () => {
      if (activeKey) {
        stopOtherMedia(el);
        updatePlayer(true);
        persistPlayback(true);
      }
    });
    el.addEventListener('pause', () => {
      if (activeKey) {
        savedPosition = el.currentTime || savedPosition;
        updatePlayer(false);
        persistPlayback(true);
      }
    });
    el.addEventListener('timeupdate', () => {
      if (activeKey) {
        savedPosition = el.currentTime;
        updatePlayer(!el.paused);
        persistPlayback();
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

  const restoreSavedPlayback = () => {
    const saved = readPlayback();
    if (!saved.track) return;
    startExtension(saved.track, false, {
      position: Number(saved.position) || 0,
      playing: saved.playing === true
    });
  };
  if (getAudio()) restoreSavedPlayback();
  else window.setTimeout(restoreSavedPlayback, 150);

  window.addEventListener('pagehide', () => persistPlayback(true));

  const addSpotifyLink = (section, label) => {
    if (!section || section.querySelector('.jahntella-spotify-link')) return;
    const link = document.createElement('a');
    link.className = 'primary-button jahntella-spotify-link';
    link.href = SPOTIFY_ARTIST_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `🎧 ${label}`;
    const anchor = section.querySelector('.section-heading, .exp44-new-music-head, .exp60-shine-heading, .exp53-album-head');
    if (anchor) anchor.appendChild(link);
    else section.insertBefore(link, section.firstChild);
  };

  const connectSpotifyEverywhere = () => {
    document.querySelectorAll('a[href="https://open.spotify.com/search/Jahntella"],a[href="https://open.spotify.com/search/Jahntella/"]').forEach(link => {
      link.href = SPOTIFY_ARTIST_URL;
    });
    addSpotifyLink(document.getElementById('sweetEraAlbum'), 'Listen on Spotify');
    addSpotifyLink(document.getElementById('music'), 'Jahntella on Spotify');
    addSpotifyLink(document.getElementById('newMusic'), 'The Sweet Era on Spotify');
    addSpotifyLink(document.getElementById('shineEraSneakPeek'), 'The Shine Era on Spotify');
  };

  const spotifyStyle = document.createElement('style');
  spotifyStyle.textContent = `
    .jahntella-spotify-link{display:inline-flex!important;align-items:center;justify-content:center;gap:.35rem;margin:.8rem auto 0;text-decoration:none!important;}
    .section-heading .jahntella-spotify-link,.exp44-new-music-head .jahntella-spotify-link,.exp60-shine-heading .jahntella-spotify-link,.exp53-album-head .jahntella-spotify-link{width:auto;min-width:210px;}
    @media(max-width:640px){.jahntella-spotify-link{width:100%!important;max-width:330px;margin:.9rem auto 0;}}
  `;
  document.head.appendChild(spotifyStyle);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectSpotifyEverywhere, {once:true});
  else connectSpotifyEverywhere();

  window.jahntellaPlayShineEraTrack = startExtension;
  window.jahntellaStopShineEraTrack = restoreNormalTransport;
})();
