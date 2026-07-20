/*
 * Jahntella v7.0.1 — Sweet Era Restoration
 * Stabilizes the embedded player and reconnects the premium Sweet Vault.
 * Load AFTER script-v700.js.
 */
(() => {
  "use strict";

  window.JAHNTELLA_BUILD = "7.0.1-SWEET-ERA-RESTORATION";

  const tracks = {
    "fun-dipp": {
      title: "Fun Dipp",
      icon: "🍭",
      audio: document.getElementById("audioFunDipp")
    },
    "pink-lips": {
      title: "Pink Lips Remix",
      icon: "💋",
      audio: document.getElementById("audioPinkLips")
    }
  };

  const order = ["fun-dipp", "pink-lips"];
  let activeKey = "fun-dipp";
  let activeAudio = tracks[activeKey].audio;
  let seeking = false;

  const player = document.getElementById("jahntellaPlayer");
  const playerTrack = document.getElementById("playerTrack");
  const playerStatus = document.getElementById("playerStatus");
  const playerCurrent = document.getElementById("playerCurrent");
  const playerDuration = document.getElementById("playerDuration");
  const playerArt = player?.querySelector(".player-art");

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const replaceControl = (id) => {
    const oldNode = document.getElementById(id);
    if (!oldNode) return null;
    const newNode = oldNode.cloneNode(true);
    oldNode.replaceWith(newNode);
    return newNode;
  };

  // Remove legacy listeners from the persistent player controls.
  const playerToggle = replaceControl("playerToggle");
  const playerPrevious = replaceControl("playerPrevious");
  const playerNext = replaceControl("playerNext");
  const playerClose = replaceControl("playerClose");
  const playerProgress = replaceControl("playerProgress");

  const stopOtherTracks = (keep, reset = true) => {
    Object.values(tracks).forEach(({ audio }) => {
      if (!audio || audio === keep) return;
      audio.pause();
      if (reset) {
        try { audio.currentTime = 0; } catch (_) {}
      }
      audio.volume = 1;
    });
  };

  const showPlayer = () => {
    player?.classList.add("visible");
    document.body.classList.add("music-player-open");
  };

  const syncTurntables = () => {
    document.querySelectorAll(".v7-vinyl").forEach((vinyl) => {
      const card = vinyl.closest(".v7-turntable-card");
      const key = card?.classList.contains("pink-lips-turntable") ? "pink-lips" : "fun-dipp";
      vinyl.classList.toggle("is-playing", key === activeKey && activeAudio && !activeAudio.paused);
      // Existing CSS used .spinning continuously; neutralize it while paused.
      vinyl.style.animationPlayState =
        key === activeKey && activeAudio && !activeAudio.paused ? "running" : "paused";
    });

    const v51Vinyl = document.getElementById("v51Vinyl");
    if (v51Vinyl) {
      v51Vinyl.classList.toggle(
        "playing",
        activeKey === "fun-dipp" && activeAudio && !activeAudio.paused
      );
    }
  };

  const syncButtons = () => {
    document.querySelectorAll("[data-audio-track]").forEach((control) => {
      const key = control.dataset.audioTrack;
      const isCurrent = key === activeKey;
      const isPlaying = isCurrent && activeAudio && !activeAudio.paused;
      control.classList.toggle("is-playing", Boolean(isPlaying));
      control.classList.toggle("is-paused", Boolean(isCurrent && !isPlaying));

      if (control.matches("button.site-audio-button")) {
        const label = key === "pink-lips" ? "Pink Lips Remix" : "Fun Dipp";
        control.textContent = isPlaying ? `Pause ${label} Ⅱ` : `Play ${label} ▶`;
      }

      const stickLabel = control.querySelector?.(".stick-label");
      if (stickLabel) stickLabel.textContent = isPlaying ? "PAUSE Ⅱ" : "DIP IN ▶";
    });
  };

  const syncLegacyV51 = () => {
    const play = document.getElementById("v51Play");
    const current = document.getElementById("v51Current");
    const duration = document.getElementById("v51Duration");
    const progress = document.getElementById("v51Progress");
    const status = document.getElementById("v51Status");
    const visualizer = document.getElementById("v51Visualizer");

    const funAudio = tracks["fun-dipp"].audio;
    const isPlaying = activeKey === "fun-dipp" && funAudio && !funAudio.paused;

    if (play) play.textContent = isPlaying ? "❚❚" : "▶";
    if (current) current.textContent = formatTime(funAudio?.currentTime || 0);
    if (duration) duration.textContent = formatTime(funAudio?.duration || 0);
    if (progress && !seeking) {
      progress.value = funAudio?.duration
        ? String((funAudio.currentTime / funAudio.duration) * 100)
        : "0";
    }
    if (status) {
      status.textContent = isPlaying
        ? "Fun Dipp is playing"
        : (funAudio?.currentTime > 0 ? "Paused" : "Ready to dip in");
    }
    visualizer?.classList.toggle("active", Boolean(isPlaying));
  };

  const sync = () => {
    if (!activeAudio) return;

    if (playerTrack) playerTrack.textContent = tracks[activeKey].title;
    if (playerArt) playerArt.textContent = tracks[activeKey].icon;
    if (playerToggle) {
      playerToggle.textContent = activeAudio.paused ? "▶" : "Ⅱ";
      playerToggle.setAttribute(
        "aria-label",
        activeAudio.paused ? `Play ${tracks[activeKey].title}` : `Pause ${tracks[activeKey].title}`
      );
    }
    if (playerStatus) {
      playerStatus.textContent = activeAudio.paused
        ? (activeAudio.currentTime > 0 ? "PAUSED" : "READY TO PLAY")
        : "NOW PLAYING";
    }
    if (playerCurrent) playerCurrent.textContent = formatTime(activeAudio.currentTime);
    if (playerDuration) playerDuration.textContent = formatTime(activeAudio.duration);
    if (playerProgress && !seeking) {
      playerProgress.value = activeAudio.duration
        ? String((activeAudio.currentTime / activeAudio.duration) * 100)
        : "0";
    }

    player?.classList.toggle("is-playing", !activeAudio.paused);
    syncButtons();
    syncTurntables();
    syncLegacyV51();
  };

  const selectTrack = (key) => {
    if (!tracks[key]?.audio) return false;
    if (key !== activeKey) {
      stopOtherTracks(tracks[key].audio, true);
      activeKey = key;
      activeAudio = tracks[key].audio;
    }
    showPlayer();
    sync();
    return true;
  };

  const toggleTrack = async (key, forcePlay = false) => {
    if (!selectTrack(key)) return;
    try {
      if (activeAudio.paused || forcePlay) {
        stopOtherTracks(activeAudio, true);
        await activeAudio.play();
      } else {
        activeAudio.pause();
      }
    } catch (error) {
      console.error("Jahntella player could not start:", error);
      if (playerStatus) playerStatus.textContent = "TAP PLAY TO START";
    }
    sync();
  };

  const skip = (direction) => {
    const index = order.indexOf(activeKey);
    const nextKey = order[(index + direction + order.length) % order.length];
    toggleTrack(nextKey, true);
  };

  // Capture-phase handler prevents the old inline fallback and duplicate listeners.
  document.addEventListener("click", (event) => {
    const control = event.target.closest?.("[data-audio-track]");
    if (!control) return;
    const key = control.dataset.audioTrack;
    if (!tracks[key]) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const spotlight = control.closest(".fun-dipp-spotlight");
    if (spotlight) {
      spotlight.classList.remove("dipping");
      void spotlight.offsetWidth;
      spotlight.classList.add("dipping");
      window.setTimeout(() => spotlight.classList.remove("dipping"), 850);
    }

    toggleTrack(key);
  }, true);

  playerToggle?.addEventListener("click", () => toggleTrack(activeKey));
  playerPrevious?.addEventListener("click", () => skip(-1));
  playerNext?.addEventListener("click", () => skip(1));

  playerClose?.addEventListener("click", () => {
    activeAudio?.pause();
    player?.classList.remove("visible");
    document.body.classList.remove("music-player-open");
    sync();
  });

  playerProgress?.addEventListener("pointerdown", () => { seeking = true; });
  playerProgress?.addEventListener("pointerup", () => { seeking = false; sync(); });
  playerProgress?.addEventListener("change", () => { seeking = false; sync(); });
  playerProgress?.addEventListener("input", () => {
    if (!activeAudio?.duration) return;
    activeAudio.currentTime =
      (Number(playerProgress.value) / 100) * activeAudio.duration;
    if (playerCurrent) playerCurrent.textContent = formatTime(activeAudio.currentTime);
  });

  // Keep the legacy injected Fun Dipp controls synchronized without allowing a second engine.
  const replaceV51Control = (id) => {
    const oldNode = document.getElementById(id);
    if (!oldNode) return null;
    const newNode = oldNode.cloneNode(true);
    oldNode.replaceWith(newNode);
    return newNode;
  };

  const v51Play = replaceV51Control("v51Play");
  const v51Progress = replaceV51Control("v51Progress");
  const v51Volume = replaceV51Control("v51Volume");

  v51Play?.addEventListener("click", () => toggleTrack("fun-dipp"));
  v51Progress?.addEventListener("input", () => {
    const audio = tracks["fun-dipp"].audio;
    if (audio?.duration) audio.currentTime = (Number(v51Progress.value) / 100) * audio.duration;
  });
  v51Volume?.addEventListener("input", () => {
    const audio = tracks["fun-dipp"].audio;
    if (audio) audio.volume = Number(v51Volume.value);
  });

  Object.entries(tracks).forEach(([key, { audio }]) => {
    if (!audio) return;
    ["play", "pause", "timeupdate", "loadedmetadata", "durationchange", "seeking", "seeked"]
      .forEach((name) => audio.addEventListener(name, sync));

    audio.addEventListener("play", () => {
      activeKey = key;
      activeAudio = audio;
      stopOtherTracks(audio, false);
      showPlayer();
      sync();
    });

    audio.addEventListener("ended", () => {
      try { audio.currentTime = 0; } catch (_) {}
      sync();
    });
  });

  // Replace the temporary Vault bridge with direct calls into the preserved premium engine.
  const bindVaultButton = (id, action) => {
    const oldButton = document.getElementById(id);
    if (!oldButton) return;
    const button = oldButton.cloneNode(true);
    oldButton.replaceWith(button);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      action();
    });
  };

  bindVaultButton("v7OpenPack", () => {
    if (typeof window.spinSweetMachine === "function") {
      window.spinSweetMachine();
      return;
    }
    if (typeof spinSweetMachine === "function") {
      spinSweetMachine();
      return;
    }
    if (typeof revealSweetSurprise === "function" && typeof weightedSurprise === "function") {
      revealSweetSurprise(weightedSurprise());
      return;
    }
    console.error("Sweet Vault pack engine was not found.");
  });

  bindVaultButton("v7OpenVault", () => {
    if (typeof window.openVault === "function") {
      window.openVault();
      return;
    }
    if (typeof openVault === "function") {
      openVault();
      return;
    }
    const dialog = document.getElementById("collectionDialog");
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
  });

  // Expose one stable API for any future site control.
  window.JahntellaPlayer = Object.freeze({
    play: (key = activeKey) => toggleTrack(key, true),
    toggle: (key = activeKey) => toggleTrack(key),
    pause: () => { activeAudio?.pause(); sync(); },
    next: () => skip(1),
    previous: () => skip(-1),
    get activeTrack() { return activeKey; }
  });

  window.JahntellaPlayFallback = (key) => {
    toggleTrack(key || "fun-dipp");
    return false;
  };

  const badge = document.getElementById("buildBadge");
  if (badge) badge.textContent = "BUILD 7.0.1";

  sync();
})();
