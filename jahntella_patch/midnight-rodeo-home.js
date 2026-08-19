/* Midnight Rodeo — homepage additive card + continuous-play bridge */
(() => {
  'use strict';
  const root = document.querySelector('#newMusic .exp44-new-music-grid');
  if (!root || root.querySelector('[data-midnight-rodeo-card]')) return;
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
    // Continue seamlessly into the site's first playlist track.
    document.querySelector('.play-button[data-track="fun-dipp"]')?.click();
  });

  // If the site's final existing track is about to end, hand off to Midnight Rodeo.
  const watch = () => {
    const shared = siteAudio();
    if (!shared || shared.dataset.midnightBridge === '1') return;
    shared.dataset.midnightBridge = '1';
    shared.addEventListener('timeupdate', () => {
      const src = shared.currentSrc || shared.src || '';
      if (!/we-are-1\.mp3(?:$|[?#])/.test(src)) return;
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
})();
