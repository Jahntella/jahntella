(() => {
  'use strict';
  if (window.__jahntellaShineUnifiedControls) return;
  window.__jahntellaShineUnifiedControls = true;

  const CORE = {
    'sweet-dreams': 'audioSweetDreams',
    'we-are-1': 'audioWeAre1',
    'boots-smile-attitude': 'audioBootsSmileAttitude'
  };

  const CARD_SELECTORS = {
    'sweet-dreams': '#sweetDreamsPreviewTitle',
    'we-are-1': '#weAre1PreviewTitle',
    'boots-smile-attitude': '#bootsSmileAttitudePreviewTitle'
  };

  const findCard = key => {
    const heading = document.querySelector(CARD_SELECTORS[key]);
    return heading?.closest('.exp60-shine-video-card') || null;
  };

  const syncVisual = key => {
    const audio = document.getElementById(CORE[key]);
    const card = findCard(key);
    if (!audio || !card) return;
    const playing = !audio.paused && !audio.ended;
    card.classList.toggle('is-active', playing);
    const playButton = card.querySelector('.play-button, .shine-era-play-button');
    if (playButton) {
      const title = playButton.dataset.shineTitle || playButton.textContent.replace(/^[▶❚❚]\s*(?:Play|Pause)\s*/i, '').trim();
      playButton.dataset.shineTitle = title;
      playButton.textContent = `${playing ? '❚❚ Pause' : '▶ Play'} ${title}`;
    }
  };

  const toggle = key => {
    const audio = document.getElementById(CORE[key]);
    const select = window.jahntellaSelectSiteTrack;
    if (!audio || typeof select !== 'function') return;

    if (!audio.paused && !audio.ended) {
      audio.pause();
      return;
    }

    select(key, true, {fresh:false});
  };

  const bindCard = (key) => {
    const card = findCard(key);
    if (!card || card.dataset.jahntellaNativePlayerBound) return;
    card.dataset.jahntellaNativePlayerBound = 'true';

    // The picture itself is the play/pause surface, matching the other music cards.
    const image = card.querySelector('.exp60-shine-video-frame img, img');
    const surface = image || card.querySelector('.exp60-shine-video-frame');
    if (surface) {
      surface.style.cursor = 'pointer';
      surface.setAttribute('role', 'button');
      surface.setAttribute('tabindex', '0');
      surface.setAttribute('aria-label', `Play or pause ${CORE[key] ? key.replaceAll('-', ' ') : key}`);
      surface.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        toggle(key);
      });
      surface.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        toggle(key);
      });
    }
  };

  const bindAudio = (key) => {
    const audio = document.getElementById(CORE[key]);
    if (!audio || audio.__shineNativePlayerSync) return;
    audio.__shineNativePlayerSync = true;
    ['play','playing','pause','ended'].forEach(eventName => audio.addEventListener(eventName, () => syncVisual(key)));
    syncVisual(key);
  };

  const init = () => {
    Object.keys(CORE).forEach(key => {
      bindCard(key);
      bindAudio(key);
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
