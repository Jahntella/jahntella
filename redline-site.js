(() => {
  'use strict';
  if (window.__jahntellaRedlineLoaded) return;
  window.__jahntellaRedlineLoaded = true;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;

  const cfg = window.JAHNTELLA_ALBUM2?.tracks?.redline || {};
  const audioUrl = new URL(cfg.fullAudio || 'assets/album2/redline.mp3', document.baseURI).href;
  const artUrl = new URL(cfg.artwork || 'assets/album2/redline-cover.webp', document.baseURI).href;
  const thumbUrl = new URL(cfg.artworkThumb || 'assets/album2/redline-cover-thumb.webp', document.baseURI).href;
  const videoUrl = new URL(cfg.fullVideo || 'assets/album2/redline-official-visualizer.mp4', document.baseURI).href;
  const audioId = 'audioBootsSmileAttitude';
  let audio = null;
  let originalBootsSrc = '';
  let redlineActive = false;
  let redlineTime = 0;

  const getAudio = () => {
    audio ||= document.getElementById(audioId);
    if (audio && !originalBootsSrc) originalBootsSrc = audio.currentSrc || audio.querySelector('source')?.src || audio.src || '';
    return audio;
  };
  const isRedlineSource = () => ((audio?.currentSrc || audio?.src || '').toLowerCase().includes('redline'));
  const isMidnightSource = () => ((audio?.currentSrc || audio?.src || '').toLowerCase().includes('midnight-rodeo'));
  const midnightUrl = new URL('assets/album2/midnight-rodeo.mp3', document.baseURI).href;
  const stopOtherMedia = except => {
    document.querySelectorAll('audio,video').forEach(node => {
      if (node !== except && !node.paused) node.pause();
    });
  };
  const format = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';

  const updateChrome = playing => {
    document.getElementById('playerTitle')?.replaceChildren(document.createTextNode('Redline'));
    const art = document.getElementById('playerArtwork');
    if (art) { art.src = artUrl; art.alt = 'Redline artwork by Jahntella'; }
    const toggle = document.getElementById('playerToggle');
    if (toggle) {
      toggle.textContent = playing ? '❚❚' : '▶';
      toggle.setAttribute('aria-label', playing ? 'Pause Redline' : 'Play Redline');
    }
    const time = document.getElementById('playerTime');
    if (time && audio) time.textContent = format(audio.currentTime);
    document.getElementById('player')?.classList.toggle('playing', !!playing);
  };

  const restoreBootsTransport = () => {
    if (!audio || !originalBootsSrc || !isRedlineSource()) return;
    audio.pause();
    audio.src = originalBootsSrc;
    audio.load();
    redlineActive = false;
    redlineTime = 0;
  };

  const startRedline = (restart = false) => {
    getAudio();
    if (!audio) return;
    if (typeof window.jahntellaSelectSiteTrack === 'function') {
      window.jahntellaSelectSiteTrack('boots-smile-attitude', false, {fresh: true});
    }
    stopOtherMedia(audio);
    if (!isRedlineSource()) {
      audio.pause();
      audio.src = audioUrl;
      audio.load();
    }
    redlineActive = true;
    if (restart) redlineTime = 0;
    const begin = () => {
      try { audio.currentTime = restart ? 0 : redlineTime; } catch {}
      audio.play().then(() => updateChrome(true)).catch(() => updateChrome(false));
    };
    if (audio.readyState >= 1) begin();
    else audio.addEventListener('loadedmetadata', begin, {once:true});
    window.__jahntellaRedlineStart = startRedline;

  const startMidnight = (restart = false) => {
    getAudio();
    if (!audio) return;
    if (typeof window.jahntellaSelectSiteTrack === 'function') window.jahntellaSelectSiteTrack('boots-smile-attitude', false, {fresh:true});
    stopOtherMedia(audio);
    if (!isMidnightSource()) { audio.pause(); audio.src = midnightUrl; audio.load(); }
    redlineActive = false;
    const begin = () => { try { audio.currentTime = restart ? 0 : redlineTime; } catch {} audio.play().then(()=>{ const title=document.getElementById('playerTitle'); if(title) title.textContent='Midnight Rodeo'; const art=document.getElementById('playerArtwork'); if(art){ art.src=new URL('assets/album2/midnight-rodeo-cover.webp', document.baseURI).href; art.alt='Midnight Rodeo artwork'; } }).catch(()=>{}); };
    if (audio.readyState >= 1) begin(); else audio.addEventListener('loadedmetadata', begin, {once:true});
  };
  };

  window.__jahntellaRedlineStart = startRedline;

  const startMidnight = (restart = false) => {
    getAudio();
    if (!audio) return;
    if (typeof window.jahntellaSelectSiteTrack === 'function') window.jahntellaSelectSiteTrack('boots-smile-attitude', false, {fresh:true});
    stopOtherMedia(audio);
    if (!isMidnightSource()) { audio.pause(); audio.src = midnightUrl; audio.load(); }
    redlineActive = false;
    const begin = () => { try { audio.currentTime = restart ? 0 : redlineTime; } catch {} audio.play().then(()=>{ const title=document.getElementById('playerTitle'); if(title) title.textContent='Midnight Rodeo'; const art=document.getElementById('playerArtwork'); if(art){ art.src=new URL('assets/album2/midnight-rodeo-cover.webp', document.baseURI).href; art.alt='Midnight Rodeo artwork'; } }).catch(()=>{}); };
    if (audio.readyState >= 1) begin(); else audio.addEventListener('loadedmetadata', begin, {once:true});
  };

  // One transport: Midnight Rodeo -> Redline -> Fun Dipp.
  document.addEventListener('ended', event => {
    const target = event.target;
    if (target !== getAudio()) return;
    if (isMidnightSource()) {
      event.stopImmediatePropagation();
      startRedline(true);
      return;
    }
    if (isRedlineSource() || redlineActive) {
      event.stopImmediatePropagation();
      redlineActive = false;
      redlineTime = 0;
      updateChrome(false);
      restoreBootsTransport();
      window.setTimeout(() => {
        if (typeof window.jahntellaSelectSiteTrack === 'function') {
          window.jahntellaSelectSiteTrack('fun-dipp', true, {fresh: true});
        }
      }, 0);
    }
  }, true);

  audio = getAudio();
  audio?.addEventListener('play', () => {
    if (redlineActive) { stopOtherMedia(audio); updateChrome(true); }
  });
  audio?.addEventListener('pause', () => {
    if (redlineActive) { redlineTime = audio.currentTime || redlineTime; updateChrome(false); }
  });
  audio?.addEventListener('timeupdate', () => {
    if (redlineActive) { redlineTime = audio.currentTime; updateChrome(!audio.paused); }
  });

  // Keep the existing bottom play bar fully functional while Redline reuses the Boots audio element.
  document.addEventListener('click', event => {
    const target = event.target.closest?.('#playerToggle,#playerNext,#playerPrev,.play-button[data-track],[data-jahntella-cover-track]');
    if (!target) return;
    if (redlineActive) {
      if (target.id === 'playerToggle') {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (audio.paused) audio.play().then(() => updateChrome(true)).catch(() => updateChrome(false));
        else audio.pause();
        return;
      }
      if (target.id === 'playerNext') {
        event.preventDefault();
        event.stopImmediatePropagation();
        redlineActive = false; restoreBootsTransport();
        window.jahntellaSelectSiteTrack?.('fun-dipp', true, {fresh:true});
        return;
      }
      if (target.id === 'playerPrev') {
        event.preventDefault();
        event.stopImmediatePropagation();
        redlineActive = false; restoreBootsTransport();
        window.setTimeout(() => startMidnight(true), 0);
        return;
      }
      if (target.id === 'midnightRodeoAestheticCover') {
        redlineActive = false;
        restoreBootsTransport();
        return;
      }
      const otherTrack = target.dataset.track || target.dataset.jahntellaCoverTrack || '';
      if (otherTrack && otherTrack !== 'boots-smile-attitude') {
        redlineActive = false;
        restoreBootsTransport();
      }
    }
  }, true);

  const addAestheticCover = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid || document.getElementById('redlineAestheticCover')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'redlineAestheticCover';
    button.className = 'gallery-item redline-gallery-play';
    button.setAttribute('aria-label', 'Play or pause Redline');
    button.innerHTML = `<span class="redline-gallery-image"><img src="${thumbUrl}" alt="Redline artwork by Jahntella" width="420" height="420" loading="lazy" decoding="async" fetchpriority="low"></span>`;
    button.addEventListener('click', () => {
      if (redlineActive && audio && !audio.paused) { redlineTime = audio.currentTime; audio.pause(); updateChrome(false); }
      else startRedline(false);
    });
    grid.appendChild(button);
  };

  const addVisualizer = () => {
    const grid = document.querySelector('.exp66-shine-videos');
    if (!grid || document.getElementById('redlineInlineVisualizer')) return;
    const card = document.createElement('article');
    card.id = 'redlineInlineVisualizer';
    card.className = 'exp60-shine-video-card redline-inline-card';
    card.innerHTML = `
      <div class="exp60-shine-video-heading"><span>THE SHINE ERA <i aria-hidden="true"></i> OFFICIAL VISUALIZER</span><h3>Redline</h3></div>
      <div class="exp60-shine-video-frame redline-video-frame"><video controls playsinline preload="none" poster="${artUrl}" aria-label="Play the Redline official visualizer"><source src="${videoUrl}" type="video/mp4"></video></div>
      <div class="exp60-shine-video-note"><span aria-hidden="true">◇</span><p><strong>Redline.</strong> Full song + visualizer from The Shine Era.</p></div>`;
    grid.appendChild(card);
    card.querySelector('video')?.addEventListener('play', () => {
      if (audio && !audio.paused) audio.pause();
      if (redlineActive) { redlineTime = audio?.currentTime || 0; redlineActive = false; }
    });
  };

  const optimize = () => {
    const gallery = document.querySelector('.gallery-section');
    if (gallery) {
      gallery.classList.add('redline-gallery-optimized');
      gallery.querySelectorAll('img').forEach((img, i) => {
        img.loading = i < 2 ? 'eager' : 'lazy';
        img.decoding = 'async';
        img.fetchPriority = i < 2 ? 'auto' : 'low';
      });
    }
  };

  const init = () => { addAestheticCover(); addVisualizer(); optimize(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
