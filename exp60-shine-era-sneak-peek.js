(() => {
  const PLAYBACK_KEY = "jahntellaSiteMusicV46";
  const player = document.getElementById("player");
  const entries = [
    {
      key: "sweet-dreams",
      next: "we-are-1",
      video: document.getElementById("exp60SweetDreamsVideo"),
      audio: document.getElementById("audioSweetDreams")
    },
    {
      key: "we-are-1",
      next: "fun-dipp",
      video: document.getElementById("exp61WeAre1Video"),
      audio: document.getElementById("audioWeAre1")
    }
  ].filter(entry => entry.video && entry.audio);

  if (!entries.length) return;

  const musicTracks = Array.from(document.querySelectorAll("audio"));
  let activeEntry = null;
  let lastSavedSecond = -1;
  let handingOff = false;

  const readPlayback = () => {
    try { return JSON.parse(sessionStorage.getItem(PLAYBACK_KEY) || "{}"); }
    catch { return {}; }
  };

  const persistVideo = (entry, playing, force = false) => {
    const second = Math.floor(entry.video.currentTime || 0);
    if (!force && entry === activeEntry && second === lastSavedSecond) return;
    lastSavedSecond = second;
    const saved = readPlayback();
    try {
      sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify({
        track: entry.key,
        position: entry.video.currentTime || 0,
        playing,
        credited: saved.track === entry.key && saved.credited === true,
        savedAt: Date.now()
      }));
    } catch {}
  };

  const syncAudioPosition = entry => {
    const apply = () => {
      const maximum = Number.isFinite(entry.audio.duration)
        ? Math.max(0, entry.audio.duration - .25)
        : entry.video.currentTime;
      try { entry.audio.currentTime = Math.max(0, Math.min(entry.video.currentTime || 0, maximum)); }
      catch {}
    };

    if (entry.audio.readyState >= 1) apply();
    else {
      entry.audio.addEventListener("loadedmetadata", apply, {once:true});
      entry.audio.load();
    }
  };

  entries.forEach(entry => {
    entry.video.addEventListener("loadedmetadata", () => {
      const saved = readPlayback();
      if (saved.track !== entry.key || !(Number(saved.position) > 0)) return;
      const maximum = Number.isFinite(entry.video.duration)
        ? Math.max(0, entry.video.duration - .25)
        : Number(saved.position);
      try { entry.video.currentTime = Math.max(0, Math.min(Number(saved.position), maximum)); }
      catch {}
    }, {once:true});

    entry.video.addEventListener("play", () => {
      handingOff = false;
      activeEntry = entry;
      lastSavedSecond = -1;
      musicTracks.forEach(track => {
        if (!track.paused) track.pause();
      });

      entries.forEach(otherEntry => {
        if (otherEntry !== entry && !otherEntry.video.paused) otherEntry.video.pause();
      });

      window.jahntellaSelectSiteTrack?.(entry.key, false, {fresh:false});
      if (player) player.hidden = true;
      window.setTimeout(() => persistVideo(entry, true, true), 0);
    });

    entry.video.addEventListener("timeupdate", () => {
      if (activeEntry === entry && !entry.video.paused) persistVideo(entry, true);
    });

    entry.video.addEventListener("pause", () => {
      if (entry.video.ended) return;
      syncAudioPosition(entry);
      persistVideo(entry, handingOff, true);
      if (player) player.hidden = false;
    });

    entry.video.addEventListener("ended", () => {
      activeEntry = null;
      if (player) player.hidden = false;
      window.jahntellaSelectSiteTrack?.(entry.next, true, {fresh:true});
    });
  });

  musicTracks.forEach(track => {
    track.addEventListener("play", () => {
      entries.forEach(entry => {
        if (!entry.video.paused) entry.video.pause();
      });
      if (player) player.hidden = false;
    });
  });

  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || !activeEntry || activeEntry.video.paused) return;
    const url = new URL(link.href, document.baseURI);
    const leavesPage = url.origin === location.origin
      && (url.pathname !== location.pathname || url.search !== location.search);
    if (leavesPage) {
      handingOff = true;
      persistVideo(activeEntry, true, true);
    }
  }, true);

  window.addEventListener("beforeunload", () => {
    handingOff = true;
    if (activeEntry && !activeEntry.video.paused) persistVideo(activeEntry, true, true);
  });

  window.addEventListener("pagehide", () => {
    handingOff = true;
    if (activeEntry && !activeEntry.video.paused) persistVideo(activeEntry, true, true);
  });
})();
