/* Midnight Rodeo — homepage card + continuous-play bridge + Shine Era visualizer */
(() => {
  'use strict';

  const loadStyle = () => {
    const href = 'midnight-rodeo-shine-visualizer.css?v=1';
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href.endsWith(href))) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  const injectVisualizer = () => {
    loadStyle();
    const host = document.querySelector('#shineEraSneakPeek');
    if (!host || host.querySelector('[data-midnight-rodeo-shine-visualizer]')) return;

    const section = document.createElement('section');
    section.className = 'midnight-rodeo-shine-visualizer';
    section.dataset.midnightRodeoShineVisualizer = '';
    section.setAttribute('aria-label', 'Midnight Rodeo full visualizer');
    section.innerHTML = `
      <div class="midnight-rodeo-shine-visualizer__shell">
        <div class="midnight-rodeo-shine-visualizer__header">
          <div>
            <p class="midnight-rodeo-shine-visualizer__kicker">💎 THE SHINE ERA · MIDNIGHT RODEO</p>
            <h3 class="midnight-rodeo-shine-visualizer__title">Wild ride. Body glide. Can't tame me. 🤠✨</h3>
            <p class="midnight-rodeo-shine-visualizer__subtitle">Watch the full Midnight Rodeo visualizer with Jahntella front and center, neon motion, and the complete song.</p>
          </div>
          <span class="midnight-rodeo-shine-visualizer__count">5:11 • FULL VISUALIZER</span>
        </div>

        <div class="midnight-rodeo-shine-visualizer__video-wrap">
          <video class="midnight-rodeo-shine-visualizer__video" controls playsinline preload="metadata" poster="assets/music-thumbs/midnight-rodeo.webp" aria-label="Midnight Rodeo full visualizer">
            <source src="assets/shine-era/midnight-rodeo-visualizer.mp4" type="video/mp4">
          </video>
          <span class="midnight-rodeo-shine-visualizer__sheen" aria-hidden="true"></span>
        </div>

        <div class="midnight-rodeo-shine-visualizer__actions">
          <button class="midnight-rodeo-shine-visualizer__button" type="button" data-midnight-focus-player>▶ Play Midnight Rodeo in the Jahntella player</button>
        </div>

        <div class="midnight-rodeo-shine-visualizer__glow" aria-hidden="true"></div>
      </div>`;

    host.appendChild(section);

    const visualizerVideo = section.querySelector('.midnight-rodeo-shine-visualizer__video');
    section.querySelector('[data-midnight-focus-player]').addEventListener('click', () => {
      const button = document.querySelector('.play-button[data-track="midnight-rodeo"]');
      if (button) {
        button.click();
        document.querySelector('#music')?.scrollIntoView({behavior:'smooth', block:'center'});
        return;
      }
      document.querySelector('[data-j46-toggle]')?.click();
    });

    visualizerVideo.addEventListener('play', () => {
      const shared = document.querySelector('audio[data-j46-audio]');
      if (shared) shared.pause();
    });
  };

  const root = document.querySelector('#newMusic .exp44-new-music-grid');
  if (root && !root.querySelector('[data-midnight-rodeo-card]')) {
    const card = document.createElement('article');
    card.className = 'midnight-rodeo-card';
    card.dataset.midnightRodeoCard = '';
    card.innerHTML = `
      <div class="midnight-rodeo-card__inner">
        <img src="assets/music-thumbs/midnight-rodeo.webp" alt="Midnight Rodeo cover by Jahntella" loading="lazy" decoding="async" width="1254" height="1254">
        <div class="midnight-rodeo-card__copy">
          <small>THE SHINE ERA · TEASER</small>
          <h3>Midnight Rodeo</h3>
          <p>Wild ride. Body glide. Can't tame me. The newest taste of Jahntella's next era.</p>
          <button class="midnight-rodeo-card__button" type="button">▶ Play Midnight Rodeo</button>
          <span class="midnight-rodeo-card__badge">💎 4-track Shine Era teaser</span>
        </div>
      </div>`;
    root.appendChild(card);

    const button = card.querySelector('button');
    const audio = new Audio('sweetville/midnight-rodeo.mp3');
    audio.preload = 'none';
    let active = false;
    const siteAudio = () => document.querySelector('audio[data-j46-audio]');
    const setPlaying = value => { active = value; button.classList.toggle('is-playing', value); button.textContent = value ? '❚❚ Pause Midnight Rodeo' : '▶ Play Midnight Rodeo'; };

    button.addEventListener('click', async () => {
      const shared = siteAudio();
      if (active) { audio.pause(); return; }
      if (shared && !shared.paused) shared.pause();
      try { await audio.play(); setPlaying(true); } catch { button.textContent = '▶ Tap to play Midnight Rodeo'; }
    });
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('ended', () => {
      setPlaying(false);
      document.querySelector('.play-button[data-track="fun-dipp"]')?.click();
    });

    const watch = () => {
      const shared = siteAudio();
      if (!shared || shared.dataset.midnightBridge === '1') return;
      shared.dataset.midnightBridge = '1';
      shared.addEventListener('timeupdate', () => {
        const src = shared.currentSrc || shared.src || '';
        if (!/we-are-1\\.mp3(?:$|[?#])/.test(src)) return;
        if (Number.isFinite(shared.duration) && shared.duration > 0 && shared.currentTime / shared.duration >= .985) {
          shared.pause();
          audio.currentTime = 0;
          audio.play().then(() => setPlaying(true)).catch(() => {});
        }
      });
    };
    const observer = new MutationObserver(watch);
    observer.observe(document.body, {childList:true,subtree:true});
    watch();
  }

  injectVisualizer();
  window.addEventListener('load', injectVisualizer, {once:true});
})();
