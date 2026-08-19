(() => {
  'use strict';
  if (window.__midnightRodeoCompactInitialized) return;
  window.__midnightRodeoCompactInitialized = true;

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
    try { window.JahntellaPlayer?.pause?.(); } catch (_) {}
  };

  const playMidnight = async (restart = false) => {
    const audio = getAudio();
    stopOtherMedia(audio);
    if (restart) audio.currentTime = 0;
    try { await audio.play(); } catch (_) {}
    syncCoverButtons();
  };

  const syncCoverButtons = () => {
    const audio = document.getElementById(audioId);
    document.querySelectorAll('[data-mr-play-cover]').forEach(button => {
      const playing = audio && !audio.paused;
      button.setAttribute('aria-pressed', String(Boolean(playing)));
      const label = playing ? '❚❚ Pause Midnight Rodeo' : '▶ Play Midnight Rodeo';
      button.querySelector('[data-mr-cover-label]')?.replaceChildren(document.createTextNode(label));
    });
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
        <p><strong>The latest Shine Era teaser.</strong> Full song + visualizer. Tap play to watch and listen.</p>
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

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'midnightRodeoAestheticCover';
    button.className = 'gallery-item mr-gallery-play-card';
    button.setAttribute('aria-label', 'Play Midnight Rodeo');
    button.setAttribute('data-mr-play-cover', '');
    button.innerHTML = `
      <span class="mr-gallery-image-wrap">
        <img src="${url(config.artwork)}" alt="Midnight Rodeo artwork by Jahntella" loading="lazy" decoding="async">
        <span class="mr-gallery-play-badge"><span data-mr-cover-label>▶ Play Midnight Rodeo</span></span>
      </span>
      <span class="mr-gallery-caption"><small>THE SHINE ERA</small><strong>Midnight Rodeo</strong></span>
    `;
    grid.appendChild(button);

    button.addEventListener('click', () => {
      const audio = getAudio();
      if (!audio.paused) audio.pause();
      else playMidnight();
      syncCoverButtons();
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
      <img src="${url(config.artwork)}" alt="Midnight Rodeo artwork" loading="lazy" decoding="async">
      <div>
        <small>THE SHINE ERA</small>
        <h3>Midnight Rodeo</h3>
        <p>Tap to play the full song.</p>
        <button type="button" data-mr-sv-play>▶ Play Midnight Rodeo</button>
      </div>`;
    host.appendChild(card);
    card.querySelector('[data-mr-sv-play]')?.addEventListener('click', () => {
      const audio = getAudio();
      if (audio.paused) playMidnight(); else audio.pause();
    });
    return card;
  };

  const updateHomepageCount = () => {
    const heading = document.querySelector('.exp44-new-music-head h2');
    if (heading) heading.innerHTML = heading.innerHTML.replace(/\b15 new songs\b/i, '16 new songs');
  };

  const init = () => {
    getAudio();
    buildInlineVisualizer();
    addAestheticCover();
    addSweetvilleCard();
    if (!isSweetville) updateHomepageCount();
    const audio = document.getElementById(audioId);
    audio?.addEventListener('play', syncCoverButtons);
    audio?.addEventListener('pause', syncCoverButtons);
    audio?.addEventListener('ended', syncCoverButtons);
    syncCoverButtons();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
