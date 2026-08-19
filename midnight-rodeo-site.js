(() => {
  'use strict';
  if (window.__midnightRodeoInitialized) return;
  window.__midnightRodeoInitialized = true;

  const config = window.JAHNTELLA_ALBUM2?.tracks?.['midnight-rodeo'] || {
    fullAudio: 'assets/album2/midnight-rodeo.mp3',
    fullVideo: 'assets/album2/midnight-rodeo-official-visualizer.mp4',
    artwork: 'assets/album2/midnight-rodeo-cover.webp'
  };
  const path = location.pathname.toLowerCase();
  const isSweetville = path.includes('/sweetville');
  const root = new URL('.', document.baseURI);
  const url = p => new URL(p, root).href;

  const buildMarkup = () => `
    <div class="mr-site-shell">
      <div class="mr-site-copy">
        <p class="mr-site-kicker">THE SHINE ERA • NEW TEASER</p>
        <h3>🤠 <em>Midnight Rodeo</em></h3>
        <p>Neon country heat, a sweaty dance-floor story, and the latest taste of Jahntella’s next era. Press play, then stay for the full visualizer.</p>
        <div class="mr-site-actions">
          <button class="mr-site-button" type="button" data-mr-play>▶ Play Midnight Rodeo</button>
          <button class="mr-site-button" type="button" data-mr-restart>↻ Restart</button>
        </div>
        <div class="mr-site-meta"><span>💎 THE SHINE ERA</span><span>🎵 FULL TRACK</span><span>🤠 COUNTRY × EDM × POP</span></div>
        <p class="mr-site-note">The full song is the website playback version. The teaser remains social-only.</p>
      </div>
      <div><img class="mr-site-art" src="${url(config.artwork)}" alt="Jahntella Midnight Rodeo cover artwork" loading="lazy" decoding="async"></div>
    </div>
    <video class="mr-site-video" controls playsinline preload="metadata" poster="${url(config.artwork)}" aria-label="Midnight Rodeo official visualizer">
      <source src="${url(config.fullVideo)}" type="video/mp4">
    </video>
    <audio class="mr-site-hidden-audio" data-mr-audio preload="none"><source src="${url(config.fullAudio)}" type="audio/mpeg"></audio>
  `;

  const mainSection = () => {
    const existing = document.getElementById('midnightRodeoSiteSection');
    if (existing) return existing;
    const host = document.getElementById('shineEraSneakPeek') || document.querySelector('.exp60-shine-sneak-peek');
    if (!host) return null;
    const section = document.createElement('section');
    section.id = 'midnightRodeoSiteSection';
    section.className = 'mr-site-section';
    section.setAttribute('aria-label', 'Midnight Rodeo official visualizer');
    section.innerHTML = buildMarkup();
    host.appendChild(section);
    return section;
  };

  const sweetvilleSection = () => {
    const existing = document.getElementById('midnightRodeoSweetvilleSection');
    if (existing) return existing;
    const host = document.querySelector('.cinematic-home') || document.querySelector('main');
    if (!host?.parentNode) return null;
    const section = document.createElement('section');
    section.id = 'midnightRodeoSweetvilleSection';
    section.className = 'mr-site-section';
    section.setAttribute('aria-label', 'Midnight Rodeo in Sweetville');
    section.innerHTML = buildMarkup();
    host.parentNode.insertBefore(section, host.nextSibling);
    return section;
  };

  const updateHomepageCount = () => {
    const heading = document.querySelector('.exp44-new-music-head h2');
    if (heading) heading.innerHTML = heading.innerHTML.replace(/\b15 new songs\b/i, '16 new songs');
  };

  const bindPlayer = section => {
    if (!section || section.dataset.mrBound === '1') return;
    section.dataset.mrBound = '1';
    const audio = section.querySelector('[data-mr-audio]');
    const video = section.querySelector('video');
    const play = section.querySelector('[data-mr-play]');
    const restart = section.querySelector('[data-mr-restart]');
    if (!audio || !play || !restart) return;

    const stopOtherSiteAudio = () => {
      document.querySelectorAll('audio').forEach(node => { if (node !== audio && !node.paused) node.pause(); });
      document.querySelectorAll('video').forEach(node => { if (node !== video && !node.paused) node.pause(); });
      try { window.JahntellaPlayer?.pause?.(); } catch (_) {}
    };

    const sync = () => {
      const playing = !audio.paused;
      play.textContent = playing ? '❚❚ Pause Midnight Rodeo' : '▶ Play Midnight Rodeo';
      play.classList.toggle('is-playing', playing);
    };

    play.addEventListener('click', async () => {
      if (audio.paused) {
        stopOtherSiteAudio();
        try { await audio.play(); } catch (_) {}
      } else {
        audio.pause();
      }
      sync();
    });

    restart.addEventListener('click', async () => {
      stopOtherSiteAudio();
      audio.currentTime = 0;
      try { await audio.play(); } catch (_) {}
      sync();
    });

    audio.addEventListener('play', sync);
    audio.addEventListener('pause', sync);
    audio.addEventListener('ended', sync);

    video?.addEventListener('play', () => {
      stopOtherSiteAudio();
      if (!audio.paused) audio.pause();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) video?.pause();
    });

    const boots = document.getElementById('audioBootsSmileAttitude');
    if (boots && boots.dataset.mrBridge !== '1') {
      boots.dataset.mrBridge = '1';
      boots.addEventListener('ended', async () => {
        try { audio.currentTime = 0; await audio.play(); } catch (_) {}
        sync();
      });
    }
  };

  const init = () => {
    const section = isSweetville ? sweetvilleSection() : mainSection();
    if (section) bindPlayer(section);
    if (!isSweetville) updateHomepageCount();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
