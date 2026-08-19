(() => {
  'use strict';
  if (window.__midnightRodeoSharedTransport) return;
  window.__midnightRodeoSharedTransport = true;

  const cfg = window.JAHNTELLA_ALBUM2?.tracks?.['midnight-rodeo'] || {};
  const audioPath = cfg.fullAudio || 'assets/album2/midnight-rodeo.mp3';
  const videoPath = cfg.fullVideo || 'assets/album2/midnight-rodeo-official-visualizer.mp4';
  const artworkPath = cfg.artwork || 'assets/album2/midnight-rodeo-cover.webp';
  const url = p => new URL(p, document.baseURI).href;
  const audioUrl = url(audioPath);
  const artUrl = url(artworkPath);
  const videoUrl = url(videoPath);
  const bootsId = 'audioBootsSmileAttitude';
  let audio = null;
  let bootsSrc = '';
  let midnightPlaying = false;
  let midnightTime = 0;

  const getAudio = () => {
    audio ||= document.getElementById(bootsId);
    if (audio && !bootsSrc) bootsSrc = audio.currentSrc || audio.querySelector('source')?.src || audio.src || '';
    return audio;
  };

  const stopOtherMedia = except => {
    document.querySelectorAll('audio,video').forEach(node => {
      if (node !== except && !node.paused) node.pause();
    });
  };

  const chrome = playing => {
    const player = document.getElementById('player');
    const title = document.getElementById('playerTitle');
    const artwork = document.getElementById('playerArtwork');
    const toggle = document.getElementById('playerToggle');
    const progress = document.getElementById('playerProgress');
    const time = document.getElementById('playerTime');
    if (title) title.textContent = 'Midnight Rodeo';
    if (artwork) { artwork.src = artUrl; artwork.alt = 'Midnight Rodeo artwork'; }
    if (toggle) { toggle.textContent = playing ? '❚❚' : '▶'; toggle.setAttribute('aria-label', playing ? 'Pause Midnight Rodeo' : 'Play Midnight Rodeo'); }
    if (player) player.classList.toggle('playing', Boolean(playing));
    if (audio && progress && Number.isFinite(audio.duration) && audio.duration > 0) progress.value = (audio.currentTime / audio.duration) * 100;
    if (audio && time) time.textContent = format(audio.currentTime);
  };

  const format = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2,'0')}` : '0:00';

  const startMidnight = (restart = false) => {
    getAudio();
    if (!audio) return;
    stopOtherMedia(audio);
    const current = audio.currentSrc || audio.src || '';
    if (!current.includes('midnight-rodeo')) {
      audio.pause();
      audio.src = audioUrl;
      audio.load();
    }
    midnightPlaying = true;
    if (restart) midnightTime = 0;
    const begin = () => {
      if (restart) { try { audio.currentTime = 0; } catch {} }
      else if (midnightTime > 0) { try { audio.currentTime = midnightTime; } catch {} }
      audio.play().then(() => chrome(true)).catch(() => chrome(false));
    };
    if (audio.readyState >= 1) begin(); else audio.addEventListener('loadedmetadata', begin, {once:true});
  };

  const restoreBoots = () => {
    if (!audio || !bootsSrc) return;
    audio.pause();
    audio.src = bootsSrc;
    audio.load();
    midnightPlaying = false;
    midnightTime = 0;
  };

  const removeWrongAesthetic = () => {
    document.querySelectorAll('#gallery .gallery-item').forEach(item => {
      const path = item.dataset.lightbox || '';
      const img = item.querySelector('img');
      const src = img?.getAttribute('src') || '';
      if (/jahntella-official-v1\.png/i.test(path + ' ' + src)) item.remove();
    });
    // Remove any obsolete Midnight caption/card text from previous patches.
    document.querySelectorAll('#gallery .mr-gallery-caption,[data-mr-cover-label],#midnightRodeoSweetvilleCard').forEach(n => n.remove());
  };

  const addAestheticCover = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('midnightRodeoAestheticCover')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'midnightRodeoAestheticCover';
    button.className = 'gallery-item mr-gallery-play-card';
    button.setAttribute('aria-label', 'Play or pause Midnight Rodeo');
    button.innerHTML = `<span class="mr-gallery-image-wrap"><img src="${url('assets/album2/midnight-rodeo-cover-thumb.webp')}" alt="Midnight Rodeo artwork by Jahntella" loading="lazy" decoding="async" width="420" height="420"></span>`;
    button.addEventListener('click', () => {
      getAudio();
      if (midnightPlaying && audio && !audio.paused) { midnightTime = audio.currentTime; audio.pause(); chrome(false); }
      else startMidnight(false);
    });
    grid.appendChild(button);
  };

  const addVisualizer = () => {
    const grid = document.querySelector('.exp66-shine-videos');
    if (!grid || document.getElementById('midnightRodeoInlineVisualizer')) return;
    grid.classList.add('mr-has-midnight');
    const card = document.createElement('article');
    card.id = 'midnightRodeoInlineVisualizer';
    card.className = 'exp60-shine-video-card mr-inline-midnight-card';
    card.innerHTML = `<div class="exp60-shine-video-heading"><span>NEW ERA <i aria-hidden="true"></i> OFFICIAL VISUALIZER</span><h3>Midnight Rodeo</h3></div><div class="exp60-shine-video-frame"><video controls playsinline preload="none" poster="${artUrl}" aria-label="Play the Midnight Rodeo official visualizer"><source src="${videoUrl}" type="video/mp4"></video></div><div class="exp60-shine-video-note"><span aria-hidden="true">◇</span><p><strong>Midnight Rodeo.</strong> Full song + visualizer from The Shine Era.</p></div>`;
    grid.appendChild(card);
    card.querySelector('video')?.addEventListener('play', () => {
      getAudio();
      if (audio && !audio.paused) audio.pause();
      if (midnightPlaying) { midnightTime = audio?.currentTime || 0; midnightPlaying = false; }
    });
  };

  const patchSharedControls = () => {
    getAudio();
    if (!audio) return;

    // Capture ended before the original player listener. This gives Midnight Rodeo
    // its place between Boots, Smile & Attitude and Fun Dipp without replacing the player.
    document.addEventListener('ended', event => {
      if (event.target !== audio || !midnightPlaying) return;
      event.stopPropagation();
      midnightTime = 0;
      midnightPlaying = false;
      chrome(false);
      window.setTimeout(() => {
        restoreBoots();
        if (typeof window.jahntellaSelectSiteTrack === 'function') window.jahntellaSelectSiteTrack('fun-dipp', true, {fresh:true});
      }, 0);
    }, true);

    audio.addEventListener('play', () => { if (midnightPlaying) { stopOtherMedia(audio); chrome(true); } });
    audio.addEventListener('pause', () => { if (midnightPlaying) { midnightTime = audio.currentTime; chrome(false); } });
    audio.addEventListener('timeupdate', () => { if (midnightPlaying) { midnightTime = audio.currentTime; chrome(true); } });
    audio.addEventListener('loadedmetadata', () => { if (midnightPlaying) chrome(!audio.paused); });

    // Volume and scrubber are the site's existing controls, both of which operate
    // on audioBootsSmileAttitude. Since Midnight Rodeo uses that same element,
    // they automatically control Midnight Rodeo too.
    const volume = document.getElementById('playerVolume');
    volume?.addEventListener('input', () => { if (midnightPlaying) audio.volume = Number(volume.value); });

    // Any other site track selection immediately ends Midnight Rodeo and lets the
    // original player own playback again.
    document.addEventListener('click', event => {
      const target = event.target.closest?.('.play-button[data-track],#playerPrev,#playerNext,[data-jahntella-cover-track]');
      if (!target || !midnightPlaying) return;
      const key = target.dataset.track || target.dataset.jahntellaCoverTrack || '';
      if (key === 'boots-smile-attitude' || key === 'midnight-rodeo') return;
      midnightTime = 0;
      midnightPlaying = false;
      restoreBoots();
    }, true);
  };

  const init = () => {
    removeWrongAesthetic();
    patchSharedControls();
    addVisualizer();
    addAestheticCover();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
