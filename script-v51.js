(() => {
  'use strict';

  window.JAHNTELLA_BUILD = '5.1-MUSIC-EXPERIENCE';

  const section = document.getElementById('music');
  if (!section) return;

  const stylesheet = document.createElement('style');
  stylesheet.textContent = `
    .music-section-v51{position:relative;overflow:hidden;isolation:isolate;background:radial-gradient(circle at 18% 20%,rgba(255,79,163,.19),transparent 28%),radial-gradient(circle at 86% 70%,rgba(139,61,255,.18),transparent 31%)}
    .music-section-v51:before,.music-section-v51:after{content:"♪";position:absolute;z-index:-1;font-size:clamp(8rem,18vw,18rem);opacity:.035;animation:v51Drift 12s ease-in-out infinite}
    .music-section-v51:before{left:-2%;top:8%}.music-section-v51:after{content:"✦";right:2%;bottom:2%;animation-delay:-5s}
    @keyframes v51Drift{50%{transform:translateY(-22px) rotate(7deg)}}
    .music-v51-heading{text-align:center;margin-inline:auto;max-width:850px}
    .music-v51-shell{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(340px,.95fr);gap:28px;align-items:stretch}
    .music-v51-panel{position:relative;border:1px solid rgba(255,255,255,.14);border-radius:32px;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025));box-shadow:0 35px 90px rgba(0,0,0,.34);backdrop-filter:blur(16px);overflow:hidden}
    .music-v51-art-panel{display:grid;place-items:center;min-height:640px;padding:48px}
    .music-v51-glow{position:absolute;width:68%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(255,79,163,.38),rgba(139,61,255,.13) 45%,transparent 72%);filter:blur(15px);animation:v51Glow 4s ease-in-out infinite}
    @keyframes v51Glow{50%{transform:scale(1.08);opacity:.78}}
    .music-v51-vinyl{position:relative;width:min(470px,76vw);aspect-ratio:1;border-radius:50%;padding:36px;background:repeating-radial-gradient(circle,#171119 0 4px,#08060a 5px 8px);box-shadow:0 30px 80px rgba(0,0,0,.58),0 0 70px rgba(255,79,163,.2);transition:transform .35s}
    .music-v51-vinyl.playing{animation:v51Spin 7s linear infinite}
    @keyframes v51Spin{to{transform:rotate(360deg)}}
    .music-v51-vinyl img{width:100%;height:100%;object-fit:cover;border-radius:50%;box-shadow:inset 0 0 0 5px rgba(255,255,255,.22)}
    .music-v51-vinyl:after{content:"";position:absolute;inset:46%;border-radius:50%;background:#fff;box-shadow:0 0 0 8px rgba(255,79,163,.85),0 0 24px rgba(255,79,163,.8)}
    .music-v51-art-caption{position:absolute;left:26px;right:26px;bottom:24px;display:flex;justify-content:space-between;align-items:end;gap:20px;padding:18px 20px;border:1px solid rgba(255,255,255,.13);border-radius:22px;background:rgba(9,0,15,.72);backdrop-filter:blur(14px)}
    .music-v51-art-caption small,.music-v51-kicker{display:block;color:#ff90c7;font-size:.73rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase}
    .music-v51-art-caption strong{display:block;margin-top:4px;font-family:"Playfair Display",serif;font-size:clamp(1.7rem,3vw,2.5rem)}
    .music-v51-art-caption span{font-size:.8rem;color:#d8cfdd;text-align:right}
    .music-v51-player{padding:42px;display:flex;flex-direction:column;justify-content:center}
    .music-v51-player h3{margin:10px 0 6px;font-family:"Playfair Display",serif;font-size:clamp(3rem,6vw,5.6rem);line-height:.92}
    .music-v51-subtitle{margin:0 0 22px;color:#d7ccdc;line-height:1.7}
    .music-v51-now{display:flex;align-items:center;gap:10px;margin:10px 0 18px;color:#fff;font-weight:700}
    .music-v51-dot{width:9px;height:9px;border-radius:50%;background:#ff4fa3;box-shadow:0 0 14px #ff4fa3;animation:v51Pulse 1.2s infinite}
    @keyframes v51Pulse{50%{opacity:.35;transform:scale(.75)}}
    .music-v51-controls{display:flex;align-items:center;gap:14px;margin:12px 0 18px}
    .music-v51-play{width:68px;height:68px;border:0;border-radius:50%;cursor:pointer;color:white;background:linear-gradient(135deg,#ff4fa3,#8b3dff);font-size:1.35rem;box-shadow:0 18px 42px rgba(255,79,163,.35);transition:.25s}
    .music-v51-play:hover{transform:scale(1.06)}
    .music-v51-time{font-variant-numeric:tabular-nums;color:#d8cfdd;font-size:.86rem}
    .music-v51-progress{width:100%;height:8px;accent-color:#ff4fa3;cursor:pointer}
    .music-v51-volume-row{display:flex;align-items:center;gap:12px;margin:12px 0 22px;color:#d8cfdd}
    .music-v51-volume-row input{width:150px;accent-color:#ff4fa3}
    .music-v51-visualizer{height:48px;display:flex;align-items:end;gap:5px;margin:8px 0 22px}
    .music-v51-visualizer i{display:block;width:7px;height:18%;border-radius:999px;background:linear-gradient(#fff,#ff4fa3,#8b3dff);animation:v51Bars .75s ease-in-out infinite alternate;animation-play-state:paused}
    .music-v51-visualizer.active i{animation-play-state:running}
    .music-v51-visualizer i:nth-child(2n){animation-delay:-.2s}.music-v51-visualizer i:nth-child(3n){animation-delay:-.45s}.music-v51-visualizer i:nth-child(5n){animation-delay:-.6s}
    @keyframes v51Bars{to{height:100%}}
    .music-v51-actions{display:flex;flex-wrap:wrap;gap:10px}
    .music-v51-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin-top:28px}
    .music-v51-info{padding:32px;min-height:290px}
    .music-v51-info h3{margin:8px 0 12px;font-family:"Playfair Display",serif;font-size:2rem}
    .music-v51-info p{color:#d2c7d7;line-height:1.72}
    .music-v51-video{grid-column:span 2;min-height:360px;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 50% 30%,rgba(255,79,163,.2),transparent 40%),linear-gradient(135deg,rgba(139,61,255,.14),rgba(255,79,163,.08))}
    .music-v51-video-icon{font-size:4rem;filter:drop-shadow(0 0 20px rgba(255,79,163,.7))}
    .music-v51-streaming{margin-top:28px;padding:34px}
    .music-v51-streaming h3{margin:0 0 22px;font-family:"Playfair Display",serif;font-size:2.2rem;text-align:center}
    .music-v51-stream-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
    .music-v51-stream-card{min-height:110px;display:grid;place-items:center;gap:4px;padding:16px;border:1px solid rgba(255,255,255,.13);border-radius:20px;background:rgba(255,255,255,.035);text-align:center;transition:.25s}
    .music-v51-stream-card:hover{transform:translateY(-5px);border-color:#ff4fa3;box-shadow:0 18px 40px rgba(255,79,163,.17)}
    .music-v51-stream-card b{font-size:1rem}.music-v51-stream-card span{font-size:.75rem;color:#cfc3d4}
    .music-v51-cta{margin-top:28px;padding:42px;text-align:center;background:linear-gradient(135deg,rgba(255,79,163,.17),rgba(139,61,255,.16))}
    .music-v51-cta h3{margin:8px 0 10px;font-family:"Playfair Display",serif;font-size:clamp(2rem,4vw,3.5rem)}
    .music-v51-cta p{color:#d8cfdd;margin-bottom:22px}
    @media(max-width:980px){.music-v51-shell{grid-template-columns:1fr}.music-v51-art-panel{min-height:540px}.music-v51-stream-grid{grid-template-columns:repeat(2,1fr)}.music-v51-stream-card:last-child{grid-column:span 2}}
    @media(max-width:680px){.music-v51-art-panel{padding:25px;min-height:430px}.music-v51-vinyl{width:min(330px,78vw);padding:26px}.music-v51-art-caption{left:14px;right:14px;bottom:14px}.music-v51-player,.music-v51-info,.music-v51-streaming,.music-v51-cta{padding:25px}.music-v51-grid{grid-template-columns:1fr}.music-v51-video{grid-column:auto}.music-v51-player h3{font-size:3.4rem}}
    @media(prefers-reduced-motion:reduce){.music-section-v51:before,.music-section-v51:after,.music-v51-glow,.music-v51-vinyl.playing,.music-v51-dot,.music-v51-visualizer i{animation:none!important}}
  `;
  document.head.appendChild(stylesheet);

  section.classList.add('music-section-v51');
  section.innerHTML = `
    <header class="section-heading music-v51-heading reveal visible">
      <p class="eyebrow">THE SWEET ERA</p>
      <h2>Turn up <em>something sweet.</em></h2>
      <p>Step inside the official Fun Dipp music experience. Listen, explore and keep the soundtrack playing while you travel through Jahntella's world.</p>
    </header>

    <div class="music-v51-shell">
      <div class="music-v51-panel music-v51-art-panel reveal visible">
        <div class="music-v51-glow" aria-hidden="true"></div>
        <div class="music-v51-vinyl" id="v51Vinyl"><img src="fun-dipp-cover.png" alt="Fun Dipp cover artwork"></div>
        <div class="music-v51-art-caption">
          <div><small>FEATURED SINGLE</small><strong>Fun Dipp</strong></div>
          <span>Sweet. Bold.<br>Addictive.</span>
        </div>
      </div>

      <div class="music-v51-panel music-v51-player reveal visible">
        <span class="music-v51-kicker">NOW PLAYING</span>
        <h3>Fun Dipp</h3>
        <p class="music-v51-subtitle">Bright dance-pop, playful confidence and a chorus made to stay in your head.</p>
        <div class="music-v51-now"><i class="music-v51-dot"></i><span id="v51Status">Ready to dip in</span></div>
        <div class="music-v51-visualizer" id="v51Visualizer" aria-hidden="true">${'<i></i>'.repeat(24)}</div>
        <input class="music-v51-progress" id="v51Progress" type="range" min="0" max="100" value="0" aria-label="Song progress">
        <div class="music-v51-controls">
          <button class="music-v51-play" id="v51Play" type="button" aria-label="Play Fun Dipp">▶</button>
          <span class="music-v51-time"><span id="v51Current">0:00</span> / <span id="v51Duration">0:00</span></span>
        </div>
        <label class="music-v51-volume-row">🔊 Volume <input id="v51Volume" type="range" min="0" max="1" step="0.01" value="0.85"></label>
        <div class="music-v51-actions">
          <a class="button button-primary" href="https://open.spotify.com/search/Jahntella" target="_blank" rel="noopener">Spotify ↗</a>
          <a class="button button-glass" href="https://www.youtube.com/@Jahntella" target="_blank" rel="noopener">YouTube ↗</a>
          <button class="button button-glass" id="v51Share" type="button">Share Song</button>
        </div>
      </div>
    </div>

    <div class="music-v51-grid">
      <article class="music-v51-panel music-v51-info reveal visible"><span class="music-v51-kicker">LYRICS</span><h3>Sing it sweet.</h3><p>Official lyrics are coming soon. Join The Sweet List and be first to unlock them when they drop.</p><a class="button button-glass" href="#sweet-list">Join The Sweet List</a></article>
      <article class="music-v51-panel music-v51-info reveal visible"><span class="music-v51-kicker">BEHIND THE SONG</span><h3>Every hook has a story.</h3><p>Come back for the inspiration, studio memories and creative details behind Fun Dipp.</p><a class="button button-glass" href="#sweet-list">Get the story first</a></article>
      <article class="music-v51-panel music-v51-video reveal visible"><div><div class="music-v51-video-icon">▶</div><span class="music-v51-kicker">OFFICIAL MUSIC VIDEO</span><h3>Premiering Soon</h3><p>The lights are warming up. Follow Jahntella on YouTube so you do not miss the premiere.</p><a class="button button-primary" href="https://www.youtube.com/@Jahntella" target="_blank" rel="noopener">Visit YouTube ↗</a></div></article>
    </div>

    <div class="music-v51-panel music-v51-streaming reveal visible">
      <h3>Listen your way.</h3>
      <div class="music-v51-stream-grid">
        <a class="music-v51-stream-card" href="https://open.spotify.com/search/Jahntella" target="_blank" rel="noopener"><b>Spotify</b><span>Open platform ↗</span></a>
        <a class="music-v51-stream-card" href="https://music.apple.com/us/search?term=Jahntella" target="_blank" rel="noopener"><b>Apple Music</b><span>Open platform ↗</span></a>
        <a class="music-v51-stream-card" href="https://www.youtube.com/@Jahntella" target="_blank" rel="noopener"><b>YouTube Music</b><span>Open channel ↗</span></a>
        <a class="music-v51-stream-card" href="https://music.amazon.com/search/Jahntella" target="_blank" rel="noopener"><b>Amazon Music</b><span>Open platform ↗</span></a>
        <a class="music-v51-stream-card" href="https://soundcloud.com/search?q=Jahntella" target="_blank" rel="noopener"><b>SoundCloud</b><span>Open platform ↗</span></a>
      </div>
    </div>

    <div class="music-v51-panel music-v51-cta reveal visible"><span class="music-v51-kicker">NEVER MISS A RELEASE</span><h3>Join The Sweet List.</h3><p>Get early music, behind-the-scenes moments and exclusive drops delivered first.</p><a class="button button-primary" href="#sweet-list">Join The Sweet List</a></div>
  `;

  const audio = document.getElementById('audioFunDipp');
  const play = document.getElementById('v51Play');
  const progress = document.getElementById('v51Progress');
  const volume = document.getElementById('v51Volume');
  const current = document.getElementById('v51Current');
  const duration = document.getElementById('v51Duration');
  const status = document.getElementById('v51Status');
  const vinyl = document.getElementById('v51Vinyl');
  const visualizer = document.getElementById('v51Visualizer');

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const sync = () => {
    if (!audio) return;
    const isPlaying = !audio.paused;
    play.textContent = isPlaying ? '❚❚' : '▶';
    play.setAttribute('aria-label', isPlaying ? 'Pause Fun Dipp' : 'Play Fun Dipp');
    status.textContent = isPlaying ? 'Fun Dipp is playing' : (audio.currentTime > 0 ? 'Paused' : 'Ready to dip in');
    vinyl.classList.toggle('playing', isPlaying);
    visualizer.classList.toggle('active', isPlaying);
    current.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
    progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  };

  if (audio) {
    audio.volume = Number(volume.value);
    ['play','pause','timeupdate','loadedmetadata','durationchange','ended'].forEach(evt => audio.addEventListener(evt, sync));
    play.addEventListener('click', () => {
      document.querySelectorAll('audio').forEach(other => { if (other !== audio) other.pause(); });
      if (audio.paused) {
        audio.play().catch(() => { status.textContent = 'Tap play again to begin'; });
      } else audio.pause();
    });
    progress.addEventListener('input', () => { if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration; });
    volume.addEventListener('input', () => { audio.volume = Number(volume.value); });
    sync();
  } else {
    play.disabled = true;
    status.textContent = 'Audio file is not connected';
  }

  document.getElementById('v51Share').addEventListener('click', async () => {
    const shareData = { title: 'Fun Dipp by Jahntella', text: 'I am listening to Fun Dipp in the World of Jahntella 🍭', url: window.location.href.split('#')[0] + '#music' };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        status.textContent = 'Share link copied!';
      }
    } catch (_) {}
  });

  const badge = document.getElementById('buildBadge');
  if (badge) badge.textContent = 'BUILD 5.1';
})();
