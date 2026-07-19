/* Jahntella v5.3.1 Production Patch
   Restores the dual-release music experience and moves Sweet Passport into navigation.
*/
(() => {
  'use strict';

  const VERSION = '5.3.1';

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  function addPatchStyles() {
    if (document.getElementById('v531PatchStyles')) return;
    const style = document.createElement('style');
    style.id = 'v531PatchStyles';
    style.textContent = `
      .sp53-nav-button {
        appearance:none;border:0;background:transparent;color:inherit;font:inherit;
        font-weight:700;cursor:pointer;padding:0;white-space:nowrap;
      }
      .sp53-nav-button:hover { color:#ff7fbd; }
      .music-v531 { position:relative;overflow:hidden; }
      .music-v531 .vinyl-stage { position:relative; }
      .music-v531 .release-panel { display:none; }
      .music-v531 .release-panel.active { display:grid; }
      .music-v531 .release-tab { position:relative; }
      .music-v531 .release-tab.active {
        border-color:#ff4fa3;
        box-shadow:0 0 0 2px rgba(255,79,163,.2),0 14px 34px rgba(255,79,163,.18);
      }
      .music-v531 .release-panel.is-playing .vinyl { animation:v531Spin 4s linear infinite; }
      .music-v531 .v531-status {
        display:inline-flex;align-items:center;gap:8px;margin-top:14px;color:#f6d9e8;
        font-size:.82rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
      }
      .music-v531 .v531-status::before {
        content:"";width:8px;height:8px;border-radius:50%;background:#ff4fa3;
        box-shadow:0 0 12px #ff4fa3;
      }
      @keyframes v531Spin { to { transform:rotate(360deg); } }
      @media (max-width:760px) {
        .sp53-nav-button { width:100%;text-align:left;padding:12px 0; }
      }
      @media (prefers-reduced-motion:reduce) {
        .music-v531 .release-panel.is-playing .vinyl { animation:none; }
      }
    `;
    document.head.appendChild(style);
  }

  function movePassportToNav() {
    const passportButton = document.querySelector('.sp53-button');
    const nav = document.getElementById('siteNav');
    if (!passportButton || !nav) return;

    passportButton.classList.remove('sp53-button');
    passportButton.classList.add('sp53-nav-button');
    passportButton.innerHTML = 'Passport';
    passportButton.setAttribute('aria-label', 'Open Sweet Passport');

    const sweetListLink = nav.querySelector('a[href="#sweet-list"]');
    if (sweetListLink) nav.insertBefore(passportButton, sweetListLink);
    else nav.appendChild(passportButton);
  }

  function restoreMusicExperience() {
    const section = document.getElementById('music');
    if (!section) return;

    section.className = 'section music-section music-v531';
    section.innerHTML = `
      <header class="section-heading reveal visible">
        <p class="eyebrow">THE SWEET ERA</p>
        <h2>Press play on <em>something sweet.</em></h2>
        <p>Choose a release and keep the soundtrack playing while you explore Jahntella's world.</p>
      </header>

      <div class="vinyl-stage reveal visible">
        <article class="release-panel active" data-release="fun-dipp">
          <div class="record-wrap">
            <div class="vinyl"><img src="fun-dipp-cover.png" alt="Fun Dipp artwork"></div>
          </div>
          <div class="release-copy">
            <p class="release-label">DEBUT SINGLE</p>
            <h3>Fun Dipp</h3>
            <p>Bright dance-pop, playful confidence and a chorus built to stay in your head.</p>
            <div class="release-actions">
              <button class="button button-primary v531-play" type="button" data-track="fun-dipp">Play Fun Dipp ▶</button>
              <a class="button button-glass" href="https://open.spotify.com/search/Jahntella" target="_blank" rel="noopener">Spotify ↗</a>
            </div>
            <span class="v531-status" data-status="fun-dipp">Ready to play</span>
          </div>
        </article>

        <article class="release-panel" data-release="pink-lips">
          <div class="record-wrap">
            <div class="vinyl"><img src="pink-lips-remix.png" alt="Pink Lips Remix artwork"></div>
          </div>
          <div class="release-copy">
            <p class="release-label">REMIX</p>
            <h3>Pink Lips Remix</h3>
            <p>A glossy after-dark remix with brighter synths, bigger sparkle and extra attitude.</p>
            <div class="release-actions">
              <button class="button button-primary v531-play" type="button" data-track="pink-lips">Play Remix ▶</button>
              <a class="button button-glass" href="https://www.youtube.com/@Jahntella" target="_blank" rel="noopener">YouTube ↗</a>
            </div>
            <span class="v531-status" data-status="pink-lips">Ready to play</span>
          </div>
        </article>

        <div class="release-tabs" role="tablist" aria-label="Choose a release">
          <button class="release-tab active" type="button" data-target="fun-dipp" role="tab" aria-selected="true">
            <img src="fun-dipp-cover.png" alt="">
            <span>Fun Dipp</span>
          </button>
          <button class="release-tab" type="button" data-target="pink-lips" role="tab" aria-selected="false">
            <img src="pink-lips-remix.png" alt="">
            <span>Pink Lips Remix</span>
          </button>
        </div>
      </div>
    `;

    const tracks = {
      'fun-dipp': {
        audio: document.getElementById('audioFunDipp'),
        name: 'Fun Dipp',
        icon: '🍭'
      },
      'pink-lips': {
        audio: document.getElementById('audioPinkLips'),
        name: 'Pink Lips Remix',
        icon: '💋'
      }
    };

    function selectRelease(trackKey) {
      section.querySelectorAll('.release-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.release === trackKey);
      });
      section.querySelectorAll('.release-tab').forEach(tab => {
        const active = tab.dataset.target === trackKey;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
    }

    function syncTrack(trackKey) {
      const track = tracks[trackKey];
      if (!track || !track.audio) return;
      const playing = !track.audio.paused;
      const panel = section.querySelector(`[data-release="${trackKey}"]`);
      const button = section.querySelector(`.v531-play[data-track="${trackKey}"]`);
      const status = section.querySelector(`[data-status="${trackKey}"]`);

      if (panel) panel.classList.toggle('is-playing', playing);
      if (button) {
        button.textContent = playing
          ? 'Pause ❚❚'
          : (trackKey === 'pink-lips' ? 'Play Remix ▶' : 'Play Fun Dipp ▶');
      }
      if (status) {
        status.textContent = playing
          ? `${track.name} is playing · ${formatTime(track.audio.currentTime)}`
          : (track.audio.currentTime > 0
              ? `Paused · ${formatTime(track.audio.currentTime)}`
              : 'Ready to play');
      }
    }

    function updateGlobalPlayer(trackKey) {
      const track = tracks[trackKey];
      const player = document.getElementById('jahntellaPlayer');
      const playerTrack = document.getElementById('playerTrack');
      const playerStatus = document.getElementById('playerStatus');
      const playerArt = player?.querySelector('.player-art');

      if (player) player.classList.add('visible');
      document.body.classList.add('music-player-open');
      if (playerTrack) playerTrack.textContent = track.name;
      if (playerStatus) playerStatus.textContent = 'NOW PLAYING';
      if (playerArt) playerArt.textContent = track.icon;
    }

    function toggleTrack(trackKey) {
      const track = tracks[trackKey];
      if (!track || !track.audio) return;
      selectRelease(trackKey);

      Object.entries(tracks).forEach(([key, item]) => {
        if (key !== trackKey && item.audio) item.audio.pause();
      });

      updateGlobalPlayer(trackKey);
      if (track.audio.paused) track.audio.play().catch(() => {});
      else track.audio.pause();
      syncTrack(trackKey);
    }

    section.querySelectorAll('.release-tab').forEach(tab => {
      tab.addEventListener('click', () => selectRelease(tab.dataset.target));
    });

    section.querySelectorAll('.v531-play').forEach(button => {
      button.addEventListener('click', () => toggleTrack(button.dataset.track));
    });

    Object.entries(tracks).forEach(([key, track]) => {
      if (!track.audio) return;
      ['play', 'pause', 'timeupdate', 'ended', 'loadedmetadata'].forEach(eventName => {
        track.audio.addEventListener(eventName, () => syncTrack(key));
      });
      syncTrack(key);
    });
  }

  function updateVersion() {
    const badge = document.getElementById('buildBadge');
    if (badge) badge.textContent = `BUILD ${VERSION}`;
    window.JAHNTELLA_BUILD = VERSION;
  }

  function init() {
    addPatchStyles();
    movePassportToNav();
    restoreMusicExperience();
    updateVersion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
