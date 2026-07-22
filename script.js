(() => {
  const order = ["fun-dipp", "pink-lips"];
  const tracks = {
    "fun-dipp": {
      audio: document.getElementById("audioFunDipp"),
      title: "Fun Dipp",
      artwork: "https://raw.githubusercontent.com/Jahntella/jahntella/8cfaca00c38476cb9df062b724c8e9104d3001bb/assets/fun-dipp-cover.png",
      recordWrap: document.getElementById("funDippRecordWrap"),
      card: document.querySelector('[data-card="fun-dipp"]')
    },
    "pink-lips": {
      audio: document.getElementById("audioPinkLips"),
      title: "Pink Lips Remix",
      artwork: "https://raw.githubusercontent.com/Jahntella/jahntella/8cfaca00c38476cb9df062b724c8e9104d3001bb/assets/pink-lips-remix.png",
      recordWrap: document.getElementById("pinkLipsRecordWrap"),
      card: document.querySelector('[data-card="pink-lips"]')
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

  const selectTrack = (key, autoplay = true) => {
    const track = tracks[key];
    if (!track?.audio) return;
    stopOthers(track.audio);
    currentKey = key;
    title.textContent = track.title;
    artwork.src = track.artwork;
    artwork.alt = `${track.title} artwork`;
    player.classList.add("visible");
    Object.entries(tracks).forEach(([trackKey, item]) => item.card?.classList.toggle("is-active", trackKey === key));
    if (autoplay) track.audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else setPlaying(false);
  };

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
    });
    track.audio.addEventListener("ended", () => {
      if (currentTrack() === track) moveTrack(1);
    });
  });

  progress.addEventListener("input", () => {
    const track = currentTrack();
    if (!track || !track.audio.duration) return;
    track.audio.currentTime = (Number(progress.value) / 100) * track.audio.duration;
  });

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
      closeLightbox();
      closeReveal();
    }
  });

  renderVault();

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

  window.addEventListener("load", () => {
    window.setTimeout(() => siteLoader?.classList.add("is-hidden"), 250);
  });
})();
