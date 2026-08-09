/* Sweetville shared music, progress, and world-title polish */
(() => {
  'use strict';

  const ENERGY_KEY = 'jahntellaSweetEnergyV25';
  const LEGACY_ENERGY_KEY = 'jahntellaFunDippCompletedListensV25';
  const PLAYBACK_KEY = 'jahntellaSweetvilleMusicV421';
  const VISIT_KEY = 'jahntellaSweetvilleVisitsV421';
  const DISTRICT_KEY = 'jahntellaExp291DistrictVisits';
  const ENERGY_GOAL = 10;
  const DISTRICT_GOAL = 13;
  const CHALLENGE_GOAL = 12;
  const CREDIT_THRESHOLD = 0.9;
  const isTopWindow = window.top === window.self;

  const TRACKS = {
    'fun-dipp': {
      title: 'Fun Dipp',
      src: new URL('../fun-dipp-v430.mp4', document.baseURI).href,
      destination: 'fun-dipp-splash.html',
      artwork: new URL('assets/exp42/fun-dipp-waterpark.webp', document.baseURI).href
    },
    'pink-lips': {
      title: 'Pink Lips Remix',
      src: new URL('../pink-lips-remix-v430.mp4', document.baseURI).href,
      destination: 'pink-lips-after-dark.html',
      artwork: new URL('assets/exp42/popstar-yacht-fireworks.webp', document.baseURI).href
    },
    'bite-lip': {
      title: 'Bite Lip',
      src: new URL('bite-lip-remastered.mp3', document.baseURI).href,
      destination: 'melody-studio.html#latestMusic',
      artwork: new URL('bite-lip-cover.webp', document.baseURI).href
    },
    gloss: {
      title: 'Gloss',
      src: new URL('gloss-remastered.mp3', document.baseURI).href,
      destination: 'melody-studio.html#latestMusic',
      artwork: new URL('gloss-cover.webp', document.baseURI).href
    },
    'your-girl': {
      title: 'I Want To Be Your Girl',
      src: new URL('i-want-to-be-your-girl.mp3', document.baseURI).href,
      destination: 'melody-studio.html#latestMusic',
      artwork: new URL('i-want-to-be-your-girl-cover.webp', document.baseURI).href
    },
    'embrace-me': {
      title: 'Embrace Me',
      src: new URL('embrace-me.mp3', document.baseURI).href,
      destination: 'melody-studio.html#latestMusic',
      artwork: new URL('embrace-me-cover.webp', document.baseURI).href
    },
    'we-come-together': {
      title: 'We Come Together',
      src: new URL('we-come-together.mp3', document.baseURI).href,
      destination: 'melody-studio.html#latestMusic',
      artwork: new URL('we-come-together-cover.webp', document.baseURI).href
    }
  };

  const TRACK_ORDER = ['fun-dipp', 'pink-lips', 'bite-lip', 'gloss', 'your-girl', 'embrace-me', 'we-come-together'];

  const safeJSON = (value, fallback) => {
    try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const readEnergy = () => {
    const currentRaw = localStorage.getItem(ENERGY_KEY);
    const current = Number(currentRaw);
    const legacy = Number(localStorage.getItem(LEGACY_ENERGY_KEY));
    const value = currentRaw !== null && Number.isFinite(current)
      ? current
      : (Number.isFinite(legacy) ? legacy : 0);
    return clamp(value, 0, ENERGY_GOAL);
  };

  let energy = readEnergy();
  let toastTimer;

  const showToast = message => {
    let toast = document.querySelector('.exp42-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'exp42-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 4200);
  };

  const energyStatus = () => {
    if (energy >= ENERGY_GOAL) return 'The Sweet Express is fully powered. Your ticket is ready!';
    const remaining = ENERGY_GOAL - energy;
    return `${remaining} completed listen${remaining === 1 ? '' : 's'} until the Sweet Express is fully powered.`;
  };

  const renderEnergy = (message = '') => {
    document.querySelectorAll('[data-exp42-count]').forEach(node => {
      node.textContent = String(energy);
    });
    document.querySelectorAll('[data-exp42-progress]').forEach(node => {
      node.style.width = `${(energy / ENERGY_GOAL) * 100}%`;
    });
    document.querySelectorAll('[data-exp42-status]').forEach(node => {
      node.textContent = message || energyStatus();
    });
    document.querySelectorAll('[data-exp42-express-link]').forEach(link => {
      link.classList.toggle('is-unlocked', energy >= ENERGY_GOAL);
      link.textContent = energy >= ENERGY_GOAL
        ? '🚂 Ride the Sweet Express — Ready!'
        : '🚂 Visit the Sweet Express';
    });
  };

  const awardEnergy = title => {
    if (energy >= ENERGY_GOAL) return;
    energy += 1;
    localStorage.setItem(ENERGY_KEY, String(energy));
    const message = energy >= ENERGY_GOAL
      ? `${title} added the final Sweet Energy! The Sweet Express is ready.`
      : `${title} added +1 Sweet Energy! ${ENERGY_GOAL - energy} remaining.`;
    renderEnergy(message);
    renderWorldProgress();
    showToast(message);
    window.dispatchEvent(new CustomEvent('jahntella:sweet-energy', {
      detail: {count: energy, goal: ENERGY_GOAL, title}
    }));
  };

  const readPlayback = () => {
    const saved = safeJSON(sessionStorage.getItem(PLAYBACK_KEY), {});
    return {
      track: TRACKS[saved.track] ? saved.track : '',
      position: Number.isFinite(Number(saved.position)) ? Math.max(0, Number(saved.position)) : 0,
      playing: saved.playing === true,
      credited: saved.credited === true,
      ended: saved.ended === true,
      savedAt: Number(saved.savedAt) || Date.now()
    };
  };

  let playback = readPlayback();
  let audio = null;
  let wantsPlayback = playback.playing;
  let needsTap = false;
  let hydrating = false;
  let speaker = null;
  let destinationFrame = null;

  const writePlayback = () => {
    playback.savedAt = Date.now();
    try { sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify(playback)); } catch {}
  };

  const broadcastState = () => {
    writePlayback();
    if (destinationFrame?.contentWindow) {
      destinationFrame.contentWindow.postMessage({
        type: 'sweetville:music-state',
        playback,
        energy
      }, location.origin);
    }
  };

  const formatTime = seconds => {
    const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    return `${Math.floor(safe / 60)}:${String(Math.floor(safe % 60)).padStart(2, '0')}`;
  };

  const updateMediaSession = () => {
    const track = TRACKS[playback.track];
    if (!track || !('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: 'Jahntella',
        album: 'Sweetville',
        artwork: [{src: track.artwork, sizes: '1254x1254', type: track.artwork.endsWith('.webp') ? 'image/webp' : 'image/jpeg'}]
      });
    } catch {}
  };

  const setMediaPlaybackState = value => {
    if (!('mediaSession' in navigator)) return;
    try { navigator.mediaSession.playbackState = value; } catch {}
  };

  const renderTrackControls = () => {
    const activeTrack = playback.track;
    const isPlaying = playback.playing && !needsTap;

    document.querySelectorAll('[data-exp42-player]').forEach(player => {
      const track = player.dataset.exp42Player || '';
      const active = track === activeTrack;
      const title = TRACKS[track]?.title || 'Jahntella';
      player.querySelectorAll('[data-exp42-play]').forEach(button => {
        button.dataset.exp42IdleLabel ||= button.textContent.trim();
        button.classList.toggle('is-playing', active && isPlaying);
        button.setAttribute('aria-pressed', String(active && isPlaying));
        if (active && isPlaying) button.textContent = `❚❚ Pause ${title}`;
        else if (active && playback.position > 0 && !playback.ended) button.textContent = `▶ Resume ${title}`;
        else button.textContent = button.dataset.exp42IdleLabel;
      });
      player.querySelectorAll('[data-exp42-now]').forEach(node => {
        node.textContent = active
          ? (needsTap ? 'TAP TO CONTINUE' : (isPlaying ? 'NOW PLAYING' : (playback.ended ? 'PLAY COMPLETE' : 'PAUSED')))
          : 'READY TO PLAY';
      });
    });

    document.querySelectorAll('[data-radio]').forEach(button => {
      const track = button.dataset.radio?.toLowerCase().includes('remix') ? 'pink-lips' : 'fun-dipp';
      const active = track === activeTrack;
      button.classList.toggle('active', active);
      button.textContent = active && isPlaying
        ? `❚❚ ${button.dataset.radio}`
        : `${track === 'pink-lips' ? '💋' : '🍭'} ${button.dataset.radio}`;
    });

    document.querySelectorAll('[data-exp254-track]').forEach(button => {
      const track = button.dataset.exp254Track === 'pink' ? 'pink-lips' : 'fun-dipp';
      button.classList.toggle('active', button.dataset.exp254Track !== 'stop' && track === activeTrack && isPlaying);
    });

    const driveTitle = document.getElementById('exp1618RadioTitle');
    if (driveTitle && TRACKS[activeTrack]) driveTitle.textContent = TRACKS[activeTrack].title;
    const bayNow = document.getElementById('exp254NowPlaying');
    if (bayNow && TRACKS[activeTrack]) {
      bayNow.textContent = isPlaying ? TRACKS[activeTrack].title : `${TRACKS[activeTrack].title} paused`;
    }

    renderSpeaker();
  };

  const injectStyles = () => {
    if (document.getElementById('sweetvilleSharedPlayerStyles')) return;
    const style = document.createElement('style');
    style.id = 'sweetvilleSharedPlayerStyles';
    style.textContent = `
      .sv421-speaker{position:fixed;right:18px;bottom:18px;z-index:2147483647;width:min(390px,calc(100vw - 28px));padding:12px;border:1px solid rgba(255,255,255,.42);border-radius:20px;background:linear-gradient(135deg,rgba(54,4,41,.96),rgba(139,18,91,.96));box-shadow:0 20px 55px rgba(39,0,27,.4);color:#fff;font-family:"DM Sans",system-ui,sans-serif;backdrop-filter:blur(18px)}
      .sv421-speaker[hidden]{display:none!important}.sv421-speaker-main{display:grid;grid-template-columns:42px 1fr auto auto;gap:9px;align-items:center}.sv421-speaker-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#ff7ac8,#8d51ff);font-size:20px}.sv421-speaker-copy{min-width:0}.sv421-speaker-copy small{display:block;font-size:9px;font-weight:900;letter-spacing:.14em;color:#ffd8ef}.sv421-speaker-copy strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px}.sv421-speaker button{border:0;cursor:pointer}.sv421-speaker-toggle{min-height:38px;padding:0 13px;border-radius:999px;background:#fff;color:#76044e;font-weight:900}.sv421-speaker-stop{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.13);color:#fff;font-size:19px}.sv421-speaker-progress{height:4px;margin-top:9px;border-radius:99px;overflow:hidden;background:rgba(255,255,255,.17)}.sv421-speaker-progress i{display:block;width:0;height:100%;background:linear-gradient(90deg,#ff92d0,#e0b7ff)}.sv421-speaker-meta{display:flex;justify-content:space-between;gap:12px;margin-top:6px;font-size:10px;color:#ffe8f6}.sv421-speaker.needs-tap{animation:sv421Pulse 1.7s ease-in-out infinite}@keyframes sv421Pulse{50%{box-shadow:0 20px 60px rgba(255,64,177,.72)}}
      .sv421-destination-shell{position:fixed;inset:0;z-index:2147483000;display:grid;grid-template-rows:46px 1fr;background:#13000d}.sv421-shell-bar{display:flex;align-items:center;gap:10px;padding:6px 12px;background:linear-gradient(90deg,#3a0229,#8d155e);color:#fff;font:800 12px/1.2 "DM Sans",system-ui,sans-serif}.sv421-shell-bar span{flex:1;text-align:center}.sv421-shell-bar button{border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:7px 12px;background:rgba(255,255,255,.12);color:#fff;font:inherit;cursor:pointer}.sv421-destination-shell iframe{display:block;width:100%;height:100%;border:0;background:#fff}.sv421-frame-open{overflow:hidden!important}
      .exp42-toast{position:fixed;left:50%;bottom:24px;z-index:2147483646;max-width:min(560px,calc(100vw - 32px));padding:13px 18px;border-radius:999px;background:#4a0635;color:#fff;font:800 13px/1.35 "DM Sans",system-ui,sans-serif;box-shadow:0 14px 45px rgba(51,0,34,.35);opacity:0;pointer-events:none;transform:translate(-50%,18px);transition:.25s ease}.exp42-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:600px){.sv421-speaker{right:10px;bottom:10px;width:calc(100vw - 20px);border-radius:17px}.sv421-speaker-main{grid-template-columns:38px 1fr auto auto}.sv421-speaker-icon{width:38px;height:38px}.sv421-speaker-toggle{padding:0 10px;font-size:11px}.sv421-shell-bar span{font-size:10px}.sv421-shell-bar button{padding:6px 9px}}
    `;
    document.head.appendChild(style);
  };

  const ensureSpeaker = () => {
    if (!isTopWindow || speaker) return speaker;
    speaker = document.createElement('aside');
    speaker.className = 'sv421-speaker';
    speaker.hidden = true;
    speaker.setAttribute('aria-label', 'Sweetville music player');
    speaker.innerHTML = `
      <div class="sv421-speaker-main">
        <span class="sv421-speaker-icon" aria-hidden="true">🎵</span>
        <div class="sv421-speaker-copy"><small>MUSIC ACROSS SWEETVILLE</small><strong data-sv421-title></strong></div>
        <button class="sv421-speaker-toggle" type="button" data-sv421-toggle>Pause</button>
        <button class="sv421-speaker-stop" type="button" data-sv421-stop aria-label="Stop music">×</button>
      </div>
      <div class="sv421-speaker-progress" aria-hidden="true"><i data-sv421-progress></i></div>
      <div class="sv421-speaker-meta"><span data-sv421-status>Playing through Sweetville</span><span data-sv421-time>0:00</span></div>`;
    document.body.appendChild(speaker);
    speaker.querySelector('[data-sv421-toggle]').addEventListener('click', () => {
      if (!playback.track) return;
      toggleTrack(playback.track);
    });
    speaker.querySelector('[data-sv421-stop]').addEventListener('click', stopTrack);
    return speaker;
  };

  const renderSpeaker = () => {
    if (!isTopWindow) return;
    const node = ensureSpeaker();
    if (!node) return;
    const track = TRACKS[playback.track];
    node.hidden = !track;
    if (!track) return;
    const duration = audio && Number.isFinite(audio.duration) ? audio.duration : 0;
    const position = audio && Number.isFinite(audio.currentTime) ? audio.currentTime : playback.position;
    const progress = duration > 0 ? clamp((position / duration) * 100, 0, 100) : 0;
    node.classList.toggle('needs-tap', needsTap);
    node.querySelector('[data-sv421-title]').textContent = track.title;
    node.querySelector('[data-sv421-toggle]').textContent = needsTap
      ? '▶ Keep Playing'
      : (playback.playing ? 'Pause' : (playback.ended ? 'Replay' : 'Resume'));
    node.querySelector('[data-sv421-status]').textContent = needsTap
      ? 'Tap once to continue on this page'
      : (playback.playing ? 'Playing through Sweetville' : (playback.ended ? 'Song complete' : 'Paused'));
    node.querySelector('[data-sv421-time]').textContent = `${formatTime(position)}${duration ? ` / ${formatTime(duration)}` : ''}`;
    node.querySelector('[data-sv421-progress]').style.width = `${progress}%`;
  };

  const maybeCredit = force => {
    if (!audio || playback.credited || !playback.track) return;
    const complete = force || (
      Number.isFinite(audio.duration) &&
      audio.duration > 0 &&
      (audio.currentTime / audio.duration) >= CREDIT_THRESHOLD
    );
    if (!complete) return;
    playback.credited = true;
    writePlayback();
    awardEnergy(TRACKS[playback.track].title);
  };

  const savePosition = () => {
    if (!audio || !playback.track || !Number.isFinite(audio.currentTime)) return;
    playback.position = audio.currentTime;
    playback.playing = wantsPlayback && !playback.ended;
    writePlayback();
    renderTrackControls();
    broadcastState();
  };

  const ensureAudio = () => {
    if (!isTopWindow) return null;
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.id = 'sweetvilleContinuousMusic';
    audio.preload = 'auto';
    audio.playsInline = true;
    audio.hidden = true;
    document.body.appendChild(audio);

    audio.addEventListener('play', () => {
      if (hydrating) return;
      wantsPlayback = true;
      needsTap = false;
      playback.playing = true;
      playback.ended = false;
      updateMediaSession();
      setMediaPlaybackState('playing');
      renderTrackControls();
      broadcastState();
    });
    audio.addEventListener('pause', () => {
      if (hydrating || audio.ended) return;
      if (!needsTap) wantsPlayback = false;
      playback.playing = wantsPlayback;
      playback.position = audio.currentTime || playback.position;
      setMediaPlaybackState('paused');
      renderTrackControls();
      broadcastState();
    });
    audio.addEventListener('timeupdate', () => {
      playback.position = audio.currentTime;
      playback.playing = true;
      maybeCredit(false);
      writePlayback();
      renderSpeaker();
      if (destinationFrame?.contentWindow) broadcastState();
    });
    audio.addEventListener('ended', () => {
      maybeCredit(true);
      needsTap = false;
      playback.playing = false;
      playback.ended = true;
      playback.position = 0;
      renderTrackControls();
      broadcastState();
      const currentIndex = TRACK_ORDER.indexOf(playback.track);
      const nextTrack = TRACK_ORDER[(currentIndex + 1 + TRACK_ORDER.length) % TRACK_ORDER.length];
      showToast(`${TRACKS[playback.track].title} complete — now playing ${TRACKS[nextTrack].title}.`);
      playTrack(nextTrack, {fresh: true});
    });
    audio.addEventListener('loadedmetadata', renderSpeaker);
    return audio;
  };

  const loadTrack = (track, position = 0) => {
    const player = ensureAudio();
    if (!player || !TRACKS[track]) return;
    hydrating = true;
    player.src = TRACKS[track].src;
    player.load();
    const setPosition = () => {
      const max = Number.isFinite(player.duration) ? Math.max(0, player.duration - 0.2) : position;
      try { player.currentTime = clamp(position, 0, max); } catch {}
      hydrating = false;
      renderSpeaker();
    };
    if (player.readyState >= 1) setPosition();
    else player.addEventListener('loadedmetadata', setPosition, {once: true});
  };

  const playTrack = async (track, {fresh = false} = {}) => {
    if (!TRACKS[track]) return;
    const player = ensureAudio();
    const changing = playback.track !== track;
    if (changing || fresh || playback.ended) {
      playback = {
        track,
        position: 0,
        playing: true,
        credited: false,
        ended: false,
        savedAt: Date.now()
      };
      loadTrack(track, 0);
    } else if (!player.src) {
      loadTrack(track, playback.position);
    }

    wantsPlayback = true;
    playback.playing = true;
    playback.ended = false;
    needsTap = false;
    updateMediaSession();
    writePlayback();

    const begin = async () => {
      try {
        await player.play();
        needsTap = false;
      } catch {
        needsTap = true;
        wantsPlayback = true;
        playback.playing = true;
        showToast('Tap Keep Playing once to continue the music on this page.');
      }
      renderTrackControls();
      broadcastState();
    };

    if (hydrating && player.readyState < 1) {
      player.addEventListener('loadedmetadata', begin, {once: true});
    } else {
      await begin();
    }
  };

  const pauseTrack = () => {
    if (!audio) return;
    wantsPlayback = false;
    needsTap = false;
    playback.playing = false;
    playback.position = audio.currentTime || playback.position;
    setMediaPlaybackState('paused');
    audio.pause();
    renderTrackControls();
    broadcastState();
  };

  const stopTrack = () => {
    if (audio) {
      wantsPlayback = false;
      needsTap = false;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
    playback = {track: '', position: 0, playing: false, credited: false, ended: false, savedAt: Date.now()};
    setMediaPlaybackState('none');
    renderTrackControls();
    broadcastState();
  };

  const toggleTrack = track => {
    if (!isTopWindow) {
      window.parent.postMessage({type: 'sweetville:music-command', command: 'toggle', track}, location.origin);
      return;
    }
    if (playback.track === track && playback.playing && !needsTap && audio && !audio.paused) pauseTrack();
    else playTrack(track, {fresh: playback.track === track && playback.ended});
  };

  const skipTrack = direction => {
    const currentIndex = Math.max(0, TRACK_ORDER.indexOf(playback.track));
    const nextTrack = TRACK_ORDER[(currentIndex + direction + TRACK_ORDER.length) % TRACK_ORDER.length];
    playTrack(nextTrack, {fresh: true});
  };

  const handleMusicButton = event => {
    const exp42Button = event.target.closest('[data-exp42-play]');
    const radioButton = event.target.closest('[data-radio]');
    const bayButton = event.target.closest('[data-exp254-track]');
    if (!exp42Button && !radioButton && !bayButton) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (bayButton?.dataset.exp254Track === 'stop') {
      if (isTopWindow) pauseTrack();
      else window.parent.postMessage({type: 'sweetville:music-command', command: 'pause'}, location.origin);
      return;
    }

    let track = 'fun-dipp';
    if (exp42Button) track = exp42Button.closest('[data-exp42-player]')?.dataset.exp42Player || track;
    if (radioButton?.dataset.radio?.toLowerCase().includes('remix')) track = 'pink-lips';
    if (bayButton?.dataset.exp254Track === 'pink') track = 'pink-lips';

    if (radioButton) {
      const title = document.getElementById('exp1618RadioTitle');
      const message = document.getElementById('exp1618CruiseMessage');
      if (title) title.textContent = radioButton.dataset.radio;
      if (message) message.textContent = track === 'pink-lips'
        ? '“Pink lights, city nights, and the remix turned all the way up.”'
        : '“Turn up the radio and ride through the pink city lights.”';
    }
    toggleTrack(track);
  };

  const openDestinationFrame = url => {
    if (!isTopWindow) return;
    let shell = document.querySelector('.sv421-destination-shell');
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'sv421-destination-shell';
      shell.setAttribute('role', 'dialog');
      shell.setAttribute('aria-label', 'Sweetville destination');
      shell.innerHTML = `
        <div class="sv421-shell-bar">
          <button type="button" data-sv421-close>← Close destination</button>
          <span>🎵 Your music stays on while you explore</span>
          <button type="button" data-sv421-map>World Map</button>
        </div>
        <iframe title="Sweetville destination" allow="autoplay"></iframe>`;
      document.body.appendChild(shell);
      document.documentElement.classList.add('sv421-frame-open');
      document.body.classList.add('sv421-frame-open');
      destinationFrame = shell.querySelector('iframe');
      shell.querySelector('[data-sv421-close]').addEventListener('click', () => {
        shell.remove();
        destinationFrame = null;
        document.documentElement.classList.remove('sv421-frame-open');
        document.body.classList.remove('sv421-frame-open');
      });
      shell.querySelector('[data-sv421-map]').addEventListener('click', () => {
        destinationFrame.src = new URL('index.html?goto=map', document.baseURI).href;
      });
      destinationFrame.addEventListener('load', () => {
        broadcastState();
        destinationFrame.focus();
      });
    }
    destinationFrame = shell.querySelector('iframe');
    destinationFrame.src = url.href;
  };

  const keepMusicDuringNavigation = event => {
    if (!isTopWindow || !playback.track || !playback.playing || event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target && link.target !== '_self' || link.hasAttribute('download')) return;
    const url = new URL(link.href, document.baseURI);
    if (url.origin !== location.origin || !url.pathname.includes('/sweetville/')) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    savePosition();
    openDestinationFrame(url);
  };

  const stripWorldPrefix = value => {
    if (!value || !/^(?:\s*SWEETVILLE\s+)?\s*EXP\s*\d/i.test(value)) return value;
    const hadSweetville = /^\s*SWEETVILLE\s+/i.test(value);
    let clean = value.replace(/^\s*(?:SWEETVILLE\s+)?EXP\s*\d+(?:\.\d+)?\s*(?:—|–|-|:)?\s*/i, '');
    if (!clean) clean = hadSweetville ? 'Sweetville' : '';
    if (clean && clean === clean.toUpperCase()) {
      clean = clean.toLowerCase().replace(/\b([a-z])/g, letter => letter.toUpperCase());
    }
    return clean;
  };

  const cleanWorldTitles = root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const changes = [];
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || /^(SCRIPT|STYLE|TEXTAREA|CODE|PRE)$/.test(parent.tagName)) continue;
      const next = stripWorldPrefix(node.nodeValue);
      if (next !== node.nodeValue) changes.push([node, next]);
    }
    changes.forEach(([textNode, value]) => { textNode.nodeValue = value; });
    document.title = document.title
      .replace(/\s*EXP\s*\d+(?:\.\d+)?\s*(?:—|–|-|:)?\s*/i, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  const countCompletedChallenges = () => {
    let count = 0;
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith('sweetvilleGame:') && localStorage.getItem(key) === 'complete') count += 1;
    }
    return clamp(count, 0, CHALLENGE_GOAL);
  };

  const readDistricts = () => {
    const visits = safeJSON(localStorage.getItem(DISTRICT_KEY), []);
    return Array.isArray(visits) ? clamp(new Set(visits).size, 0, DISTRICT_GOAL) : 0;
  };

  const readVisits = () => {
    const value = Number(localStorage.getItem(VISIT_KEY));
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  };

  function renderWorldProgress() {
    const set = (id, value) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value;
    };
    set('sv421Districts', `${readDistricts()} / ${DISTRICT_GOAL}`);
    set('sv421Challenges', `${countCompletedChallenges()} / ${CHALLENGE_GOAL}`);
    set('sv421Energy', `${readEnergy()} / ${ENERGY_GOAL}`);
    set('sv421Visits', String(readVisits()));
  }

  const fixWelcomeActions = () => {
    const explore = document.querySelector('.journey-button');
    const room = document.querySelector('.intro-button');
    if (explore) explore.href = '#exp260Hub';
    if (room) room.href = 'sweetie-room.html';
  };

  const addMusicFastPass = () => {
    document.querySelectorAll('.exp290-fastpass-links').forEach(nav => {
      if (nav.querySelector('a[href^="melody-studio.html"]')) return;
      const link = document.createElement('a');
      link.href = 'melody-studio.html#latestMusic';
      link.innerHTML = '<span>🎧</span><strong>Melody Studio</strong><small>Play Jahntella’s newest songs</small>';
      const afterDark = nav.querySelector('a[href^="pink-lips-after-dark.html"]');
      if (afterDark) afterDark.insertAdjacentElement('afterend', link);
      else nav.appendChild(link);
    });
  };

  const setupMediaSession = () => {
    if (!isTopWindow || !('mediaSession' in navigator)) return;
    const setHandler = (action, handler) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
    };
    setHandler('play', () => { if (playback.track) playTrack(playback.track); });
    setHandler('pause', pauseTrack);
    setHandler('stop', stopTrack);
    setHandler('previoustrack', () => skipTrack(-1));
    setHandler('nexttrack', () => skipTrack(1));
    setHandler('seekbackward', details => {
      if (audio) audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10));
    });
    setHandler('seekforward', details => {
      if (audio) audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + (details.seekOffset || 10));
    });
    setHandler('seekto', details => {
      if (audio && Number.isFinite(details.seekTime)) audio.currentTime = details.seekTime;
    });
  };

  const recordVisit = () => {
    const current = readVisits();
    try { localStorage.setItem(VISIT_KEY, String(current + 1)); } catch {}
  };

  const restorePlayback = () => {
    if (!isTopWindow || !playback.track) return;
    const shouldResume = playback.playing;
    wantsPlayback = shouldResume;
    loadTrack(playback.track, playback.position);
    renderTrackControls();
    if (!shouldResume) return;
    const resume = () => playTrack(playback.track);
    if (audio.readyState >= 1 && !hydrating) resume();
    else audio.addEventListener('loadedmetadata', resume, {once: true});
  };

  const init = () => {
    injectStyles();
    recordVisit();
    fixWelcomeActions();
    addMusicFastPass();
    cleanWorldTitles(document.body);
    renderEnergy();
    renderWorldProgress();
    renderTrackControls();

    document.addEventListener('click', handleMusicButton, true);
    document.addEventListener('click', keepMusicDuringNavigation, true);
    document.addEventListener('click', event => {
      if (event.target.closest('.exp291-hotspot,.sv-game')) window.setTimeout(renderWorldProgress, 80);
    });

    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(added => {
        if (added.nodeType === Node.ELEMENT_NODE) cleanWorldTitles(added);
      }));
    });
    observer.observe(document.body, {childList: true, subtree: true});

    window.addEventListener('storage', event => {
      if (event.key === ENERGY_KEY) {
        energy = readEnergy();
        renderEnergy();
      }
      renderWorldProgress();
    });

    window.addEventListener('message', event => {
      if (event.origin !== location.origin) return;
      const data = event.data || {};
      if (isTopWindow && data.type === 'sweetville:music-command') {
        if (data.command === 'pause') pauseTrack();
        if (data.command === 'toggle' && TRACKS[data.track]) toggleTrack(data.track);
      }
      if (!isTopWindow && data.type === 'sweetville:music-state') {
        playback = {...playback, ...data.playback};
        energy = clamp(Number(data.energy) || 0, 0, ENERGY_GOAL);
        needsTap = false;
        renderEnergy();
        renderTrackControls();
      }
    });

    window.addEventListener('pagehide', () => {
      if (isTopWindow && audio && playback.track) savePosition();
    });

    if (!isTopWindow) {
      window.parent.postMessage({type: 'sweetville:music-ready'}, location.origin);
    } else {
      ensureSpeaker();
      setupMediaSession();
      restorePlayback();
    }

    if (document.getElementById('sv421Visits')) window.setInterval(renderWorldProgress, 1800);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
