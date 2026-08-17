(() => {
  const SITE_PLAYBACK_KEY = "jahntellaSiteMusicV46";
  const album2Config = window.JAHNTELLA_ALBUM2 || {};
  const album2PreviewMode = album2Config.previewMode === true;
  const album2TrackConfig = key => album2Config.tracks?.[key] || {};
  const album2Url = path => new URL(path, document.baseURI).href;
  const album2Titles = {
    "sweet-dreams": "Sweet Dreams",
    "we-are-1": "We Are 1",
    "boots-smile-attitude": "Boots, Smile & Attitude"
  };

  const applyAlbum2PreviewMode = () => {
    document.documentElement.dataset.album2Playback = album2PreviewMode ? "preview" : "full";
    if (!album2PreviewMode) return;

    [
      ["sweet-dreams", "audioSweetDreams", "exp60SweetDreamsVideo"],
      ["we-are-1", "audioWeAre1", "exp61WeAre1Video"],
      ["boots-smile-attitude", "audioBootsSmileAttitude", "exp66BootsSmileAttitudeVideo"]
    ].forEach(([key, audioId, videoId]) => {
      const media = album2TrackConfig(key);
      const audio = document.getElementById(audioId);
      const audioSource = audio?.querySelector("source");
      if (audioSource && media.previewAudio) audioSource.src = album2Url(media.previewAudio);

      const video = document.getElementById(videoId);
      const videoSource = video?.querySelector("source");
      if (videoSource && media.previewVideo) {
        videoSource.src = album2Url(media.previewVideo);
        video.setAttribute("aria-label", `Play the ${album2Titles[key]} 60-second preview`);
        video.load();
      }
    });

    document.querySelectorAll(".exp60-shine-video-heading > span").forEach(label => {
      label.firstChild.textContent = "60-SECOND PREVIEW ";
    });
    document.querySelectorAll(".exp60-shine-video-note p").forEach(note => {
      note.innerHTML = "<strong>Listen to the preview.</strong> Hear the full song everywhere music is sold and streamed beginning August 27.";
    });
  };

  applyAlbum2PreviewMode();
  const order = ["fun-dipp", "pink-lips", "bite-lip", "gloss", "your-girl", "embrace-me", "we-come-together", "play-with-me", "carnival", "made-of-light", "candy-wrapper", "playground", "milk-shake", "tonight", "sweet-dreams", "we-are-1", "boots-smile-attitude"];
  const tracks = {
    "fun-dipp": {
      audio: document.getElementById("audioFunDipp"),
      title: "Fun Dipp",
      artwork: "assets/fun-dipp-cover.webp",
      recordWrap: document.getElementById("funDippRecordWrap"),
      card: document.querySelector('[data-card="fun-dipp"]')
    },
    "pink-lips": {
      audio: document.getElementById("audioPinkLips"),
      title: "Pink Lips Remix",
      artwork: "assets/pink-lips-remix.webp",
      recordWrap: document.getElementById("pinkLipsRecordWrap"),
      card: document.querySelector('[data-card="pink-lips"]')
    },
    "bite-lip": {
      audio: document.getElementById("audioBiteLip"),
      title: "Bite Lip",
      artwork: "assets/music-thumbs/bite-lip.webp",
      card: document.querySelector('[data-card="bite-lip"]')
    },
    "gloss": {
      audio: document.getElementById("audioGloss"),
      title: "Gloss",
      artwork: "assets/music-thumbs/gloss.webp",
      card: document.querySelector('[data-card="gloss"]')
    },
    "your-girl": {
      audio: document.getElementById("audioYourGirl"),
      title: "I Want To Be Your Girl",
      artwork: "assets/music-thumbs/i-want-to-be-your-girl.webp",
      card: document.querySelector('[data-card="your-girl"]')
    },
    "embrace-me": {
      audio: document.getElementById("audioEmbraceMe"),
      title: "Embrace Me",
      artwork: "assets/music-thumbs/embrace-me.webp",
      card: document.querySelector('[data-card="embrace-me"]')
    },
    "we-come-together": {
      audio: document.getElementById("audioWeComeTogether"),
      title: "We Come Together",
      artwork: "assets/music-thumbs/we-come-together.webp",
      card: document.querySelector('[data-card="we-come-together"]')
    },
    "play-with-me": {
      audio: document.getElementById("audioPlayWithMe"),
      title: "Play With Me",
      artwork: "assets/music-thumbs/play-with-me.webp",
      card: document.querySelector('[data-card="play-with-me"]')
    },
    carnival: {
      audio: document.getElementById("audioCarnival"),
      title: "Carnival",
      artwork: "assets/music-thumbs/carnival.webp",
      card: document.querySelector('[data-card="carnival"]')
    },
    "made-of-light": {
      audio: document.getElementById("audioMadeOfLight"),
      title: "Made of Light",
      artwork: "assets/music-thumbs/made-of-light.webp",
      card: document.querySelector('[data-card="made-of-light"]')
    },
    "candy-wrapper": {
      audio: document.getElementById("audioCandyWrapper"),
      title: "Candy Wrapper",
      artwork: "assets/music-thumbs/candy-wrapper.webp",
      card: document.querySelector('[data-card="candy-wrapper"]')
    },
    playground: {
      audio: document.getElementById("audioPlayground"),
      title: "Playground",
      artwork: "assets/music-thumbs/playground.webp",
      card: document.querySelector('[data-card="playground"]')
    },
    "milk-shake": {
      audio: document.getElementById("audioMilkShake"),
      title: "Milk Shake",
      artwork: "assets/music-thumbs/milk-shake.webp",
      card: document.querySelector('[data-card="milk-shake"]')
    },
    tonight: {
      audio: document.getElementById("audioTonight"),
      title: "Tonight",
      artwork: "assets/music-thumbs/tonight.webp",
      card: document.querySelector('[data-card="tonight"]')
    },
    "sweet-dreams": {
      audio: document.getElementById("audioSweetDreams"),
      title: "Sweet Dreams",
      artwork: "assets/album2/sweet-dreams-cover.webp",
      card: document.querySelector('[data-card="sweet-dreams"]')
    },
    "we-are-1": {
      audio: document.getElementById("audioWeAre1"),
      title: "We Are 1",
      artwork: "assets/album2/we-are-1-cover.webp",
      card: document.querySelector('[data-card="we-are-1"]')
    },
    "boots-smile-attitude": {
      audio: document.getElementById("audioBootsSmileAttitude"),
      title: "Boots, Smile & Attitude",
      artwork: "assets/album2/boots-smile-attitude-cover.webp",
      card: document.querySelector('[data-card="boots-smile-attitude"]')
    }
  };

  const player = document.getElementById("player");
  const toggle = document.getElementById("playerToggle");
  const prev = document.getElementById("playerPrev");
  const next = document.getElementById("playerNext");
  const title = document.getElementById("playerTitle");
  const artwork = document.getElementById("playerArtwork");
  const progress = document.getElementById("playerProgress");
  const time = document.getElementById("playerTime");
  const volume = document.getElementById("playerVolume");
  const scrollProgress = document.getElementById("scrollProgress");
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const heroVisual = document.getElementById("heroVisual");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const siteLoader = document.getElementById("siteLoader");

  const shootingStars = document.getElementById("shootingStars");
  const twinkleStars = document.getElementById("twinkleStars");

  const buildTwinkleStars = () => {
    if (!twinkleStars || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const amount = Math.min(55, Math.max(24, Math.floor(window.innerWidth / 30)));
    twinkleStars.innerHTML = "";
    for (let i = 0; i < amount; i += 1) {
      const star = document.createElement("i");
      star.className = "twinkle-star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${2.4 + Math.random() * 4.2}s`);
      star.style.setProperty("--delay", `${Math.random() * -7}s`);
      const scale = .45 + Math.random() * .9;
      star.style.transform = `scale(${scale})`;
      twinkleStars.appendChild(star);
    }
  };

  const launchShootingStar = () => {
    if (!shootingStars || document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const star = document.createElement("i");
    star.className = "shooting-star";
    const fromLeft = Math.random() > .22;
    star.style.left = `${fromLeft ? -8 : 58 + Math.random() * 35}%`;
    star.style.top = `${5 + Math.random() * 62}%`;
    star.style.setProperty("--angle", `${fromLeft ? -18 - Math.random() * 18 : 198 + Math.random() * 14}deg`);
    star.style.setProperty("--speed", `${1.1 + Math.random() * .9}s`);
    star.style.setProperty("--travel-x", `${fromLeft ? 125 + Math.random() * 35 : -120 - Math.random() * 30}vw`);
    star.style.setProperty("--travel-y", `${22 + Math.random() * 26}vh`);
    shootingStars.appendChild(star);
    window.setTimeout(() => star.remove(), 2400);
  };

  const scheduleShootingStar = () => {
    window.setTimeout(() => {
      launchShootingStar();
      if (Math.random() > .7) window.setTimeout(launchShootingStar, 420 + Math.random() * 650);
      scheduleShootingStar();
    }, 3600 + Math.random() * 5200);
  };

  buildTwinkleStars();
  scheduleShootingStar();
  window.addEventListener("resize", () => {
    window.clearTimeout(window.__jahntellaStarResize);
    window.__jahntellaStarResize = window.setTimeout(buildTwinkleStars, 250);
  });

  let currentKey = null;
  let currentCredited = false;
  let lastSavedSecond = -1;

  const readSitePlayback = () => {
    try {
      const value = JSON.parse(sessionStorage.getItem(SITE_PLAYBACK_KEY) || "{}");
      if (!tracks[value.track]) return {};
      if (album2PreviewMode && ["sweet-dreams", "we-are-1", "boots-smile-attitude"].includes(value.track) && value.album2Mode !== "preview") {
        return {...value, position: 0, playing: false, credited: false, album2Mode: "preview"};
      }
      return value;
    } catch {
      return {};
    }
  };

  const persistSitePlayback = (force = false) => {
    const track = currentTrack();
    if (!track?.audio || !currentKey) return;
    const second = Math.floor(track.audio.currentTime || 0);
    if (!force && second === lastSavedSecond) return;
    lastSavedSecond = second;
    try {
      sessionStorage.setItem(SITE_PLAYBACK_KEY, JSON.stringify({
        track: currentKey,
        position: track.audio.currentTime || 0,
        playing: !track.audio.paused && !track.audio.ended,
        credited: currentCredited,
        album2Mode: album2PreviewMode ? "preview" : "full",
        savedAt: Date.now()
      }));
    } catch {}
  };

  window.jahntellaMarkSiteCredit = key => {
    if (key === currentKey) {
      currentCredited = true;
      persistSitePlayback(true);
    }
  };

  window.jahntellaResetSiteCredit = key => {
    if (key === currentKey) {
      currentCredited = false;
      persistSitePlayback(true);
    }
  };

  const currentTrack = () => currentKey ? tracks[currentKey] : null;
  const formatTime = seconds => {
    if (!Number.isFinite(seconds)) return "0:00";
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
  };

  const setPlaying = playing => {
    toggle.textContent = playing ? "❚❚" : "▶";
    player.classList.toggle("playing", playing);
    Object.entries(tracks).forEach(([key, track]) => {
      const active = key === currentKey;
      track.recordWrap?.classList.toggle("is-spinning", playing && active);
      track.card?.classList.toggle("is-active", active);
      const button = track.card?.querySelector(".play-button");
      if (button) button.textContent = active && playing ? `❚❚ Pause ${track.title}` : `▶ Play ${track.title}`;
    });
    persistSitePlayback(true);
  };

  const stopOthers = selected => {
    Object.values(tracks).forEach(track => {
      if (track.audio !== selected) {
        track.audio.pause();
        track.audio.currentTime = 0;
        track.recordWrap?.classList.remove("is-spinning");
      }
    });
  };

  const selectTrack = (key, autoplay = true, options = {}) => {
    const track = tracks[key];
    if (!track?.audio) return;
    const changing = currentKey !== key;
    stopOthers(track.audio);
    currentKey = key;
    if (changing || options.fresh) currentCredited = false;
    if (typeof options.credited === "boolean") currentCredited = options.credited;
    title.textContent = track.title;
    artwork.src = track.artwork;
    artwork.alt = `${track.title} artwork`;
    player.classList.add("visible");
    Object.entries(tracks).forEach(([trackKey, item]) => item.card?.classList.toggle("is-active", trackKey === key));
    if (autoplay) track.audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else setPlaying(false);
  };

  window.jahntellaSelectSiteTrack = (key, autoplay = true, options = {}) => {
    selectTrack(key, autoplay, options);
  };

  const coverPlayStyles = document.createElement("style");
  coverPlayStyles.id = "jahntellaPlayableCoverStyles";
  coverPlayStyles.textContent = `
    .jahntella-playable-cover{cursor:pointer!important;transition:transform .22s ease,filter .22s ease,box-shadow .22s ease!important}
    .jahntella-playable-cover:hover{filter:brightness(1.08)!important}
    img.jahntella-playable-cover:hover{transform:scale(1.025)!important}
    .jahntella-playable-cover:focus-visible{outline:3px solid #ff8dcc!important;outline-offset:4px!important;box-shadow:0 0 0 7px rgba(255,79,183,.2)!important}
  `;
  document.head.appendChild(coverPlayStyles);

  const toggleCoverTrack = key => {
    const track = tracks[key];
    if (!track?.audio) return;
    if (currentKey === key && !track.audio.paused) {
      track.audio.pause();
      setPlaying(false);
      return;
    }
    if (currentKey === key) {
      track.audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }
    selectTrack(key);
  };

  const makeCoverPlayable = (element, key) => {
    const track = tracks[key];
    if (!element || !track || element.dataset.jahntellaCoverTrack) return;
    element.dataset.jahntellaCoverTrack = key;
    element.classList.add("jahntella-playable-cover");
    element.setAttribute("aria-label", `Play or pause ${track.title}`);
    element.title = `Play or pause ${track.title}`;

    const nativeControl = element.matches("button,a[href]");
    if (!nativeControl) {
      element.setAttribute("role", "button");
      element.tabIndex = 0;
    }

    element.addEventListener("click", event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleCoverTrack(key);
    });

    if (!nativeControl) {
      element.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleCoverTrack(key);
      });
    }
  };

  Object.entries(tracks).forEach(([key, track]) => {
    track.card?.querySelectorAll("img").forEach(image => makeCoverPlayable(image, key));
  });

  const galleryCoverTracks = {
    "fun-dipp-cover.png": "fun-dipp",
    "fun-dipp-cover.webp": "fun-dipp",
    "pink-lips-remix.png": "pink-lips",
    "pink-lips-remix.webp": "pink-lips",
    "bite-lip-cover.webp": "bite-lip",
    "gloss-cover.webp": "gloss",
    "i-want-to-be-your-girl-cover.webp": "your-girl",
    "embrace-me-cover.webp": "embrace-me",
    "we-come-together-cover.webp": "we-come-together",
    "play-with-me-cover.webp": "play-with-me",
    "carnival-cover.webp": "carnival",
    "made-of-light-cover.webp": "made-of-light",
    "candy-wrapper-cover.webp": "candy-wrapper",
    "playground-cover.webp": "playground",
    "milk-shake-cover.webp": "milk-shake",
    "tonight-cover.webp": "tonight",
    "sweet-dreams-cover.webp": "sweet-dreams",
    "we-are-1-cover.webp": "we-are-1",
    "boots-smile-attitude-cover.webp": "boots-smile-attitude"
  };

  document.querySelectorAll("#gallery [data-lightbox]").forEach(cover => {
    const path = cover.dataset.lightbox?.split(/[?#]/)[0] || "";
    const filename = decodeURIComponent(path.split("/").pop() || "").toLowerCase();
    const key = galleryCoverTracks[filename];
    if (key) makeCoverPlayable(cover, key);
  });

  const moveTrack = direction => {
    const index = currentKey ? order.indexOf(currentKey) : 0;
    selectTrack(order[(index + direction + order.length) % order.length]);
  };

  document.querySelectorAll(".play-button").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.track;
      const track = tracks[key];
      if (currentKey === key && track && !track.audio.paused) {
        track.audio.pause();
        setPlaying(false);
      } else selectTrack(key);
    });
  });

  toggle.addEventListener("click", () => {
    if (!currentKey) return selectTrack("fun-dipp");
    const track = currentTrack();
    if (track.audio.paused) track.audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { track.audio.pause(); setPlaying(false); }
  });

  prev.addEventListener("click", () => moveTrack(-1));
  next.addEventListener("click", () => moveTrack(1));

  volume.addEventListener("input", () => {
    const level = Number(volume.value);
    Object.values(tracks).forEach(track => track.audio.volume = level);
  });

  Object.values(tracks).forEach(track => {
    track.audio.volume = Number(volume.value);
    track.audio.addEventListener("play", () => { if (currentTrack() === track) setPlaying(true); });
    track.audio.addEventListener("pause", () => { if (currentTrack() === track && !track.audio.ended) setPlaying(false); });
    track.audio.addEventListener("timeupdate", () => {
      if (currentTrack() !== track) return;
      progress.value = track.audio.duration ? (track.audio.currentTime / track.audio.duration) * 100 : 0;
      time.textContent = formatTime(track.audio.currentTime);
      persistSitePlayback();
    });
    track.audio.addEventListener("ended", () => {
      if (currentTrack() === track) moveTrack(1);
    });
  });

  progress.addEventListener("input", () => {
    const track = currentTrack();
    if (!track || !track.audio.duration) return;
    track.audio.currentTime = (Number(progress.value) / 100) * track.audio.duration;
    persistSitePlayback(true);
  });

  const savedPlayback = readSitePlayback();
  if (savedPlayback.track) {
    selectTrack(savedPlayback.track, false, {credited: savedPlayback.credited === true});
    const restored = currentTrack()?.audio;
    const restorePosition = () => {
      const max = Number.isFinite(restored.duration) ? Math.max(0, restored.duration - .25) : savedPlayback.position;
      try { restored.currentTime = Math.max(0, Math.min(Number(savedPlayback.position) || 0, max)); } catch {}
      progress.value = restored.duration ? (restored.currentTime / restored.duration) * 100 : 0;
      time.textContent = formatTime(restored.currentTime);
      if (savedPlayback.playing) {
        restored.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };
    if (restored.readyState >= 1) restorePosition();
    else {
      restored.addEventListener("loadedmetadata", restorePosition, {once: true});
      // With preload disabled, explicitly request only the saved song when
      // playback or a saved position actually needs to be restored.
      if (savedPlayback.playing || Number(savedPlayback.position) > 0) restored.load();
    }
  }

  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download")) return;
    const url = new URL(link.href, document.baseURI);
    if (url.origin === location.origin) persistSitePlayback(true);
  }, true);

  window.addEventListener("pagehide", () => persistSitePlayback(true));

  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }, { passive: true });

  window.addEventListener("pointermove", event => {
    if (!heroVisual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = (event.clientX / window.innerWidth - .5) * 10;
    const y = (event.clientY / window.innerHeight - .5) * 10;
    heroVisual.style.transform = `translate3d(${x}px,${y}px,0)`;
  });

  document.querySelectorAll("[data-lightbox]").forEach(item => {
    item.addEventListener("click", () => {
      lightboxImage.src = item.dataset.lightbox;
      lightboxImage.alt = item.querySelector("img")?.alt || "Jahntella artwork";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });

  const sweetVaultCards = [
    { id:"001", title:"Bubblegum Queen", rarity:"Legendary", image:"sv-001-bubblegum-queen.png", weight:5 },
    { id:"002", title:"Fun Dipp", rarity:"Ultra Rare", image:"sv-002-fun-dipp.png", weight:6 },
    { id:"003", title:"Pink Lips", rarity:"Ultra Rare", image:"sv-003-pink-lips.png", weight:6 },
    { id:"004", title:"Candy Rebel", rarity:"Epic", image:"sv-004-candy-rebel.png", weight:10 },
    { id:"005", title:"Neon Sweetheart", rarity:"Epic", image:"sv-005-neon-sweetheart.png", weight:10 },
    { id:"006", title:"Donut District", rarity:"Rare", image:"sv-006-donut-district.png", weight:9 },
    { id:"007", title:"Melody Studio", rarity:"Rare", image:"sv-007-melody-studio.png", weight:9 },
    { id:"008", title:"Sparkle Lake", rarity:"Rare", image:"sv-008-sparkle-lake.png", weight:9 },
    { id:"009", title:"Pink Café", rarity:"Rare", image:"sv-009-pink-cafe.png", weight:9 },
    { id:"010", title:"Cotton Candy Clouds", rarity:"Rare", image:"sv-010-cotton-candy-clouds.png", weight:9 },
    { id:"011", title:"Stay Sweet", rarity:"Rare", image:"sv-011-stay-sweet.png", weight:9 },
    { id:"012", title:"XO Sweetie", rarity:"Secret Rare", image:"sv-012-xo-sweetie-secret.png", weight:5 }
  ];

  const STORAGE_KEY = "jahntellaSweetVaultV17";
  const BACK_IMAGE = "sweet-vault-card-back.png";
  const vaultGrid = document.getElementById("vaultGrid");
  const vaultCount = document.getElementById("vaultCount");
  const vaultPercent = document.getElementById("vaultPercent");
  const vaultProgressBar = document.getElementById("vaultProgressBar");
  const openPackButton = document.getElementById("openPackButton");
  const packStatus = document.getElementById("packStatus");
  const resetVaultButton = document.getElementById("resetVaultButton");
  const lastPulledCard = document.getElementById("lastPulledCard");
  const revealModal = document.getElementById("cardRevealModal");
  const revealCardImage = document.getElementById("revealCardImage");
  const revealTitle = document.getElementById("revealTitle");
  const revealRarity = document.getElementById("revealRarity");
  const revealMessage = document.getElementById("revealMessage");
  const revealDoneButton = document.getElementById("revealDoneButton");
  const closeRevealButton = document.getElementById("closeRevealButton");
  const confettiLayer = document.getElementById("confettiLayer");

  if (vaultGrid && vaultCount && vaultPercent && vaultProgressBar && openPackButton &&
      packStatus && resetVaultButton && lastPulledCard && revealModal && revealCardImage &&
      revealTitle && revealRarity && revealMessage && revealDoneButton && closeRevealButton &&
      confettiLayer) {
  const readVault = () => {
    const keys = [STORAGE_KEY, "jahntellaSweetVaultV18", "jahntellaSweetVaultV19"];
    for (const key of keys) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || "{}");
        if (Array.isArray(parsed.collected) || parsed.lastPulled) {
          return {
            collected: Array.isArray(parsed.collected) ? [...new Set(parsed.collected)] : [],
            lastPulled: parsed.lastPulled || null
          };
        }
      } catch {}
    }
    return { collected: [], lastPulled: null };
  };

  let vaultState = readVault();
  let activePull = null;
  let opening = false;

  const saveVault = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(vaultState));

  const rarityClass = rarity => `rarity-${rarity.replaceAll(" ", "-")}`;

  const renderLastPulled = () => {
    const card = sweetVaultCards.find(item => item.id === vaultState.lastPulled);
    if (!card) {
      lastPulledCard.innerHTML = '<p class="eyebrow">LAST PULLED</p><div class="last-pulled-placeholder">Your newest card will appear here.</div>';
      return;
    }
    lastPulledCard.innerHTML = `
      <p class="eyebrow">LAST PULLED</p>
      <div class="last-pulled-display">
        <img src="${card.image}" alt="${card.title} Sweet Vault card">
        <div>
          <span class="rarity-pill">${card.rarity}</span>
          <h3>${card.title}</h3>
          <p>Card ${card.id} is safely stored in your Sweet Vault.</p>
        </div>
      </div>`;
  };

  const renderVault = () => {
    vaultGrid.innerHTML = sweetVaultCards.map(card => {
      const unlocked = vaultState.collected.includes(card.id);
      return `
        <button class="vault-card-button ${unlocked ? "" : "is-locked"}" data-card-id="${card.id}" ${unlocked ? "" : "aria-disabled='true'"} aria-label="${unlocked ? `Flip ${card.title}` : `Locked card ${card.id}`}">
          <span class="vault-card-scene">
            <span class="vault-card-inner">
              <span class="vault-card-face vault-card-front">
                <img src="${unlocked ? card.image : BACK_IMAGE}" alt="${unlocked ? `${card.title} card front` : "Locked Sweet Vault card"}">
              </span>
              <span class="vault-card-face vault-card-back">
                <img src="${BACK_IMAGE}" alt="Sweet Vault card back">
              </span>
            </span>
          </span>
        </button>`;
    }).join("");

    vaultGrid.querySelectorAll(".vault-card-button:not(.is-locked)").forEach(button => {
      button.addEventListener("click", () => button.classList.toggle("is-flipped"));
    });

    const count = vaultState.collected.length;
    const percent = Math.round((count / sweetVaultCards.length) * 100);
    vaultCount.textContent = String(count);
    vaultPercent.textContent = `${percent}%`;
    vaultProgressBar.style.width = `${percent}%`;
    renderLastPulled();
  };

  const weightedPull = () => {
    const total = sweetVaultCards.reduce((sum, card) => sum + card.weight, 0);
    let roll = Math.random() * total;
    for (const card of sweetVaultCards) {
      roll -= card.weight;
      if (roll <= 0) return card;
    }
    return sweetVaultCards[sweetVaultCards.length - 1];
  };

  const createConfetti = amount => {
    confettiLayer.innerHTML = "";
    for (let i = 0; i < amount; i += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * .8}s`;
      piece.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
      confettiLayer.appendChild(piece);
    }
  };

  const closeReveal = () => {
    revealModal.className = "card-reveal-modal";
    revealModal.setAttribute("aria-hidden", "true");
    confettiLayer.innerHTML = "";
    activePull = null;
  };

  const commitPullToVault = card => {
    const isNew = !vaultState.collected.includes(card.id);
    if (isNew) vaultState.collected.push(card.id);
    vaultState.lastPulled = card.id;

    try {
      saveVault();
    } catch (error) {
      console.error("Sweet Vault could not save:", error);
    }

    renderVault();
if(window.innerWidth<769){setTimeout(()=>document.getElementById('vaultBinder')?.scrollIntoView({behavior:'smooth',block:'start'}),900);}

    if (isNew) {
      const slot = vaultGrid.querySelector(`[data-card-id="${card.id}"]`);
      slot?.classList.add("just-unlocked");
      window.setTimeout(() => slot?.classList.remove("just-unlocked"), 5200);
    }

    return isNew;
  };

  const showReveal = card => {
    activePull = card;
    const isNew = commitPullToVault(card);

    revealModal.className = `card-reveal-modal open ${rarityClass(card.rarity)}`;
    revealModal.setAttribute("aria-hidden", "false");
    revealCardImage.src = card.image;
    revealCardImage.alt = `${card.title} Sweet Vault card`;
    revealRarity.textContent = card.rarity.toUpperCase();
    revealTitle.textContent = card.title;
    revealMessage.textContent = isNew
      ? "New card unlocked and saved to your Sweet Vault."
      : "Duplicate pull — your previous copy remains safely stored.";
    revealDoneButton.textContent = "View My Vault";

    if (card.rarity === "Secret Rare") createConfetti(70);
    else if (card.rarity === "Legendary" || card.rarity === "Ultra Rare") createConfetti(35);

    window.setTimeout(() => revealModal.classList.add("is-revealed"), 850);
  };

  openPackButton.addEventListener("click", () => {
    if (opening) return;
    opening = true;
    packStatus.textContent = "The foil pack is opening...";
    openPackButton.classList.add("is-opening");
    window.setTimeout(() => {
      const card = weightedPull();
      showReveal(card);
      openPackButton.classList.remove("is-opening");
      packStatus.textContent = `${card.title} revealed!`;
      opening = false;
    }, 1050);
  });

  revealDoneButton.addEventListener("click", () => {
    closeReveal();
    document.getElementById("vaultGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  closeRevealButton.addEventListener("click", closeReveal);
  revealModal.addEventListener("click", event => {
    if (event.target.classList.contains("reveal-backdrop")) closeReveal();
  });

  resetVaultButton.addEventListener("click", () => {
    if (!window.confirm("Reset the entire Sweet Vault collection on this device?")) return;
    vaultState = { collected: [], lastPulled: null };
    saveVault();
    renderVault();
    packStatus.textContent = "Vault reset. Tap the pack to start again.";
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeReveal();
    }
  });

  renderVault();
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLightbox();
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach(section => observer.observe(section));
  document.getElementById("year").textContent = new Date().getFullYear();

  // Reveal as soon as the page structure is usable. Waiting for every image,
  // font and media request made the loader feel stuck on slower connections.
  window.setTimeout(() => siteLoader?.classList.add("is-hidden"), 120);
})();
