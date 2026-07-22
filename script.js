(() => {
  const trackOrder = ["fun-dipp", "pink-lips"];
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
  let currentKey = null;

  const formatTime = seconds => {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const currentTrack = () => currentKey ? tracks[currentKey] : null;

  const setPlaying = playing => {
    toggle.textContent = playing ? "❚❚" : "▶";
    player.classList.toggle("playing", playing);

    Object.entries(tracks).forEach(([key, track]) => {
      const active = key === currentKey;
      track.recordWrap?.classList.toggle("is-spinning", playing && active);
      track.card?.classList.toggle("is-active", active);
    });
  };

  const stopOtherTracks = selected => {
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

    stopOtherTracks(track.audio);
    currentKey = key;
    title.textContent = track.title;
    artwork.src = track.artwork;
    artwork.alt = `${track.title} artwork`;
    player.classList.add("visible");

    Object.entries(tracks).forEach(([trackKey, item]) => {
      item.card?.classList.toggle("is-active", trackKey === key);
    });

    if (autoplay) {
      track.audio.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      setPlaying(false);
    }
  };

  const moveTrack = direction => {
    const currentIndex = currentKey ? trackOrder.indexOf(currentKey) : 0;
    const nextIndex = (currentIndex + direction + trackOrder.length) % trackOrder.length;
    selectTrack(trackOrder[nextIndex]);
  };

  document.querySelectorAll(".play-button").forEach(button => {
    button.addEventListener("click", () => selectTrack(button.dataset.track));
  });

  toggle.addEventListener("click", () => {
    if (!currentKey) return selectTrack("fun-dipp");
    const track = currentTrack();
    if (track.audio.paused) {
      track.audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      track.audio.pause();
      setPlaying(false);
    }
  });

  prev.addEventListener("click", () => moveTrack(-1));
  next.addEventListener("click", () => moveTrack(1));

  volume.addEventListener("input", () => {
    const level = Number(volume.value);
    Object.values(tracks).forEach(track => {
      track.audio.volume = level;
    });
  });

  Object.values(tracks).forEach(track => {
    track.audio.volume = Number(volume.value);

    track.audio.addEventListener("play", () => {
      if (currentTrack() === track) setPlaying(true);
    });

    track.audio.addEventListener("pause", () => {
      if (currentTrack() === track && !track.audio.ended) setPlaying(false);
    });

    track.audio.addEventListener("timeupdate", () => {
      if (currentTrack() !== track) return;
      progress.value = track.audio.duration
        ? (track.audio.currentTime / track.audio.duration) * 100
        : 0;
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
})();
