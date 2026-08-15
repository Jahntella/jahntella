(() => {
  'use strict';

  if (document.querySelector('[data-j46-site-player]')) return;

  const PLAYBACK_KEY = 'jahntellaSiteMusicV46';
  const ENERGY_KEY = 'jahntellaSweetEnergyV25';
  const ENERGY_GOAL = 10;
  const CREDIT_THRESHOLD = 0.90;
  const base = new URL('.', document.currentScript?.src || document.baseURI);
  const asset = path => new URL(path, base).href;
  const order = ['fun-dipp', 'pink-lips', 'bite-lip', 'gloss', 'your-girl', 'embrace-me', 'we-come-together', 'play-with-me', 'carnival', 'made-of-light', 'candy-wrapper', 'playground', 'milk-shake', 'tonight', 'sweet-dreams', 'we-are-1'];
  const tracks = {
    'fun-dipp': {
      title: 'Fun Dipp',
      src: asset('fun-dipp-v430.mp4'),
      artwork: asset('assets/fun-dipp-cover.webp')
    },
    'pink-lips': {
      title: 'Pink Lips Remix',
      src: asset('pink-lips-remix-v430.mp4'),
      artwork: asset('assets/pink-lips-remix.webp')
    },
    'bite-lip': {
      title: 'Bite Lip',
      src: asset('sweetville/bite-lip-remastered.mp3'),
      artwork: asset('sweetville/bite-lip-cover.webp')
    },
    gloss: {
      title: 'Gloss',
      src: asset('sweetville/gloss-remastered.mp3'),
      artwork: asset('sweetville/gloss-cover.webp')
    },
    'your-girl': {
      title: 'I Want To Be Your Girl',
      src: asset('sweetville/i-want-to-be-your-girl.mp3'),
      artwork: asset('sweetville/i-want-to-be-your-girl-cover.webp')
    },
    'embrace-me': {
      title: 'Embrace Me',
      src: asset('sweetville/embrace-me.mp3'),
      artwork: asset('sweetville/embrace-me-cover.webp')
    },
    'we-come-together': {
      title: 'We Come Together',
      src: asset('sweetville/we-come-together.mp3'),
      artwork: asset('sweetville/we-come-together-cover.webp')
    },
    'play-with-me': {
      title: 'Play With Me',
      src: asset('sweetville/play-with-me.mp3'),
      artwork: asset('sweetville/play-with-me-cover.webp')
    },
    carnival: {
      title: 'Carnival',
      src: asset('sweetville/carnival.mp3'),
      artwork: asset('sweetville/carnival-cover.webp')
    },
    'made-of-light': {
      title: 'Made of Light',
      src: asset('sweetville/made-of-light.mp3'),
      artwork: asset('sweetville/made-of-light-cover.webp')
    },
    'candy-wrapper': {
      title: 'Candy Wrapper',
      src: asset('sweetville/candy-wrapper.mp3'),
      artwork: asset('sweetville/candy-wrapper-cover.webp')
    },
    playground: {
      title: 'Playground',
      src: asset('sweetville/playground.mp3'),
      artwork: asset('sweetville/playground-cover.webp')
    },
    'milk-shake': {
      title: 'Milk Shake',
      src: asset('sweetville/milk-shake.mp3'),
      artwork: asset('sweetville/milk-shake-cover.webp')
    },
    tonight: {
      title: 'Tonight',
      src: asset('sweetville/tonight.mp3'),
      artwork: asset('sweetville/tonight-cover.webp')
    },
    'sweet-dreams': {
      title: 'Sweet Dreams',
      src: asset('sweetville/sweet-dreams.mp3'),
      artwork: asset('assets/album2/sweet-dreams-cover.webp')
    },
    'we-are-1': {
      title: 'We Are 1',
      src: asset('sweetville/we-are-1.mp3'),
      artwork: asset('assets/album2/we-are-1-cover.webp')
    }
  };

  const readPlayback = () => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(PLAYBACK_KEY) || '{}');
      return tracks[saved.track] ? saved : {};
    } catch {
      return {};
    }
  };

  const saved = readPlayback();
  let currentKey = tracks[saved.track] ? saved.track : 'fun-dipp';
  let credited = saved.track === currentKey && saved.credited === true;
  let lastSavedSecond = -1;
  let closed = false;

  const shell = document.createElement('aside');
  shell.className = 'j46-player';
  shell.dataset.j46SitePlayer = '';
  shell.setAttribute('aria-label', 'Jahntella music player');
  shell.innerHTML = `
    <img class="j46-player-art" data-j46-art alt="">
    <div class="j46-player-main">
      <div class="j46-player-heading">
        <div>
          <small data-j46-status>MUSIC ACROSS JAHNTELLA</small>
          <strong data-j46-title></strong>
        </div>
        <button class="j46-close" type="button" data-j46-close aria-label="Close music player">×</button>
      </div>
      <div class="j46-player-actions">
        <button type="button" data-j46-prev aria-label="Previous song">‹</button>
        <button class="j46-toggle" type="button" data-j46-toggle aria-label="Play song">▶ Play</button>
        <button type="button" data-j46-next aria-label="Next song">›</button>
      </div>
      <div class="j46-player-progress">
        <input data-j46-progress type="range" min="0" max="100" value="0" step="0.1" aria-label="Song progress">
        <span data-j46-time>0:00 / 0:00</span>
      </div>
    </div>`;
  document.body.appendChild(shell);

  const audio = document.createElement('audio');
  audio.preload = 'none';
  audio.dataset.j46Audio = '';
  document.body.appendChild(audio);

  const art = shell.querySelector('[data-j46-art]');
  const title = shell.querySelector('[data-j46-title]');
  const status = shell.querySelector('[data-j46-status]');
  const toggle = shell.querySelector('[data-j46-toggle]');
  const progress = shell.querySelector('[data-j46-progress]');
  const time = shell.querySelector('[data-j46-time]');
  const formatTime = seconds => {
    if (!Number.isFinite(seconds)) return '0:00';
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  };

  const persist = (force = false) => {
    if (closed) return;
    const second = Math.floor(audio.currentTime || 0);
    if (!force && second === lastSavedSecond) return;
    lastSavedSecond = second;
    try {
      sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify({
        track: currentKey,
        position: audio.currentTime || 0,
        playing: !audio.paused && !audio.ended,
        credited,
        savedAt: Date.now()
      }));
    } catch {}
  };

  const render = () => {
    const track = tracks[currentKey];
    art.src = track.artwork;
    art.alt = `${track.title} artwork`;
    title.textContent = track.title;
    toggle.textContent = audio.paused ? '▶ Play' : '❚❚ Pause';
    toggle.setAttribute('aria-label', audio.paused ? `Play ${track.title}` : `Pause ${track.title}`);
    shell.classList.toggle('is-playing', !audio.paused);
    time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    progress.value = audio.duration ? String((audio.currentTime / audio.duration) * 100) : '0';
  };

  const updateMediaSession = () => {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
    const track = tracks[currentKey];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: 'Jahntella',
      album: 'The World of Sweet',
      artwork: [{src: track.artwork}]
    });
  };

  const loadTrack = (key, options = {}) => {
    if (!tracks[key]) return;
    currentKey = key;
    credited = options.credited === true;
    lastSavedSecond = -1;
    audio.src = tracks[key].src;
    audio.load();
    render();
    updateMediaSession();
    persist(true);

    if (Number(options.position) > 0) {
      const restore = () => {
        const requested = Number(options.position) || 0;
        const maximum = Number.isFinite(audio.duration) ? Math.max(0, audio.duration - 0.25) : requested;
        try { audio.currentTime = Math.max(0, Math.min(requested, maximum)); } catch {}
        render();
        if (options.playing) playCurrent();
      };
      if (audio.readyState >= 1) restore();
      else audio.addEventListener('loadedmetadata', restore, {once: true});
    } else if (options.playing) {
      playCurrent();
    }
  };

  const playCurrent = () => {
    closed = false;
    shell.hidden = false;
    audio.play().then(() => {
      status.textContent = 'PLAYING ACROSS JAHNTELLA';
      render();
      persist(true);
    }).catch(() => {
      status.textContent = 'TAP PLAY TO KEEP THE MUSIC GOING';
      render();
      persist(true);
    });
  };

  const move = direction => {
    const index = order.indexOf(currentKey);
    loadTrack(order[(index + direction + order.length) % order.length], {playing: true});
  };

  const awardEnergy = () => {
    if (credited) return;
    credited = true;
    let count = Number(localStorage.getItem(ENERGY_KEY));
    if (!Number.isFinite(count)) count = 0;
    count = Math.min(ENERGY_GOAL, Math.max(0, count) + 1);
    try { localStorage.setItem(ENERGY_KEY, String(count)); } catch {}
    status.textContent = count >= ENERGY_GOAL
      ? 'SWEET EXPRESS POWERED — 10 / 10'
      : `+1 SWEET ENERGY — ${count} / ${ENERGY_GOAL}`;
    persist(true);
  };

  toggle.addEventListener('click', () => {
    if (audio.paused) playCurrent();
    else audio.pause();
  });
  shell.querySelector('[data-j46-prev]').addEventListener('click', () => move(-1));
  shell.querySelector('[data-j46-next]').addEventListener('click', () => move(1));
  shell.querySelector('[data-j46-close]').addEventListener('click', () => {
    closed = true;
    audio.pause();
    shell.hidden = true;
    try { sessionStorage.removeItem(PLAYBACK_KEY); } catch {}
  });
  progress.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = Number(progress.value) / 100 * audio.duration;
    if (audio.currentTime < 5) credited = false;
    render();
    persist(true);
  });
  audio.addEventListener('play', () => {
    if (audio.currentTime < 5) credited = false;
    status.textContent = 'PLAYING ACROSS JAHNTELLA';
    render();
    persist(true);
  });
  audio.addEventListener('pause', () => {
    if (!audio.ended) status.textContent = 'MUSIC ACROSS JAHNTELLA';
    render();
    persist(true);
  });
  audio.addEventListener('loadedmetadata', render);
  audio.addEventListener('timeupdate', () => {
    render();
    if (!credited && Number.isFinite(audio.duration) && audio.duration > 0 && audio.currentTime / audio.duration >= CREDIT_THRESHOLD) {
      awardEnergy();
    }
    persist();
  });
  audio.addEventListener('ended', () => {
    awardEnergy();
    move(1);
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download')) return;
    const url = new URL(link.href, document.baseURI);
    if (url.origin === location.origin) persist(true);
  }, true);
  window.addEventListener('pagehide', () => persist(true));

  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', playCurrent);
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => move(-1));
      navigator.mediaSession.setActionHandler('nexttrack', () => move(1));
    } catch {}
  }

  loadTrack(currentKey, {
    position: Number(saved.position) || 0,
    playing: saved.playing === true,
    credited
  });
})();
