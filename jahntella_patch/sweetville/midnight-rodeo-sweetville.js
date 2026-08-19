/* Midnight Rodeo — Sweetville additive music card */
(() => {
  'use strict';
  const anchor = document.querySelector('#exp260Hub') || document.querySelector('main');
  if (!anchor || document.querySelector('[data-midnight-rodeo-sweetville]')) return;
  const section = document.createElement('section');
  section.id = 'midnightRodeoSweetville';
  section.dataset.midnightRodeoSweetville = '';
  section.innerHTML = `
    <div class="midnight-rodeo-sv-shell">
      <div class="midnight-rodeo-sv-art"><img src="midnight-rodeo-cover.webp" alt="Midnight Rodeo by Jahntella" width="1254" height="1254"></div>
      <div class="midnight-rodeo-sv-copy">
        <small>NEW · THE SHINE ERA</small>
        <h2>Midnight Rodeo</h2>
        <p>Step out of Sweetville's candy lights and into Jahntella's neon country night. This is the newest Shine Era teaser.</p>
        <button type="button" class="midnight-rodeo-sv-play">▶ Play Midnight Rodeo</button>
      </div>
    </div>`;
  anchor.parentNode.insertBefore(section, anchor);
  const audio = new Audio('midnight-rodeo.mp3'); audio.preload = 'none';
  const btn = section.querySelector('button');
  let playing = false;
  const render = () => { playing = !audio.paused; btn.textContent = playing ? '❚❚ Pause Midnight Rodeo' : '▶ Play Midnight Rodeo'; btn.classList.toggle('is-playing', playing); };
  btn.addEventListener('click', async () => {
    if (playing) { audio.pause(); return; }
    document.querySelector('audio[data-j46-audio]')?.pause();
    try { await audio.play(); } catch {}
    render();
  });
  audio.addEventListener('play', render); audio.addEventListener('pause', render);
})();
