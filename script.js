(() => {
  const tracks = {
    "fun-dipp": {
      audio: document.getElementById("audioFunDipp"),
      title: "Fun Dipp",
      artwork: "https://raw.githubusercontent.com/Jahntella/jahntella/8cfaca00c38476cb9df062b724c8e9104d3001bb/assets/fun-dipp-cover.png",
      record: document.getElementById("funDippRecord")
    },
    "pink-lips": {
      audio: document.getElementById("audioPinkLips"),
      title: "Pink Lips Remix",
      artwork: "https://raw.githubusercontent.com/Jahntella/jahntella/8cfaca00c38476cb9df062b724c8e9104d3001bb/assets/pink-lips-remix.png",
      record: document.getElementById("pinkLipsRecord")
    }
  };

  const player = document.getElementById("player");
  const toggle = document.getElementById("playerToggle");
  const title = document.getElementById("playerTitle");
  const artwork = document.getElementById("playerArtwork");
  const progress = document.getElementById("playerProgress");
  const time = document.getElementById("playerTime");
  const equalizer = document.getElementById("equalizer");
  let current = null;

  const formatTime = seconds => {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const setPlayingState = isPlaying => {
    toggle.textContent = isPlaying ? "❚❚" : "▶";
    equalizer.classList.toggle("playing", isPlaying);
    if (current?.record) current.record.classList.toggle("is-spinning", isPlaying);
  };

  const stopOtherTracks = selected => {
    Object.values(tracks).forEach(track => {
      if (track.audio !== selected) {
        track.audio.pause();
        track.audio.currentTime = 0;
        if (track.record) track.record.classList.remove("is-spinning");
      }
    });
  };

  const selectTrack = key => {
    const track = tracks[key];
    if (!track || !track.audio) return;

    stopOtherTracks(track.audio);
    current = track;
    title.textContent = track.title;
    artwork.src = track.artwork;
    artwork.alt = `${track.title} artwork`;
    player.classList.add("visible");

    track.audio.play()
      .then(() => setPlayingState(true))
      .catch(() => setPlayingState(false));
  };

  document.querySelectorAll(".play-button").forEach(button => {
    button.addEventListener("click", () => selectTrack(button.dataset.track));
  });

  toggle.addEventListener("click", () => {
    if (!current) {
      selectTrack("fun-dipp");
      return;
    }

    if (current.audio.paused) {
      current.audio.play()
        .then(() => setPlayingState(true))
        .catch(() => setPlayingState(false));
    } else {
      current.audio.pause();
      setPlayingState(false);
    }
  });

  Object.values(tracks).forEach(track => {
    track.audio.addEventListener("timeupdate", () => {
      if (current !== track) return;
      const ratio = track.audio.duration
        ? (track.audio.currentTime / track.audio.duration) * 100
        : 0;
      progress.value = ratio;
      time.textContent = formatTime(track.audio.currentTime);
    });

    track.audio.addEventListener("ended", () => {
      if (current === track) {
        progress.value = 0;
        time.textContent = "0:00";
        setPlayingState(false);
      }
    });
  });

  progress.addEventListener("input", () => {
    if (!current || !current.audio.duration) return;
    current.audio.currentTime = (Number(progress.value) / 100) * current.audio.duration;
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
