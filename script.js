(() => {
  const tracks = {
    "fun-dipp": {
      audio: document.getElementById("audioFunDipp"),
      title: "Fun Dipp",
      artwork: "https://raw.githubusercontent.com/Jahntella/jahntella/8cfaca00c38476cb9df062b724c8e9104d3001bb/assets/fun-dipp-cover.png"
    },
    "pink-lips": {
      audio: document.getElementById("audioPinkLips"),
      title: "Pink Lips Remix",
      artwork: "https://raw.githubusercontent.com/Jahntella/jahntella/8cfaca00c38476cb9df062b724c8e9104d3001bb/assets/pink-lips-remix.png"
    }
  };

  const player = document.getElementById("player");
  const toggle = document.getElementById("playerToggle");
  const title = document.getElementById("playerTitle");
  const artwork = document.getElementById("playerArtwork");
  const progress = document.getElementById("playerProgress");
  const time = document.getElementById("playerTime");
  let current = null;

  const formatTime = seconds => {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const stopOtherTracks = selected => {
    Object.values(tracks).forEach(track => {
      if (track.audio !== selected) {
        track.audio.pause();
        track.audio.currentTime = 0;
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
    player.classList.add("visible");

    track.audio.play()
      .then(() => { toggle.textContent = "❚❚"; })
      .catch(() => { toggle.textContent = "▶"; });
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
        .then(() => { toggle.textContent = "❚❚"; })
        .catch(() => { toggle.textContent = "▶"; });
    } else {
      current.audio.pause();
      toggle.textContent = "▶";
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
        toggle.textContent = "▶";
        progress.value = 0;
      }
    });
  });

  progress.addEventListener("input", () => {
    if (!current || !current.audio.duration) return;
    current.audio.currentTime = (Number(progress.value) / 100) * current.audio.duration;
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
