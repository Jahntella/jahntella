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
  const shuffleToggle = document.getElementById("shuffleToggle");
  const repeatToggle = document.getElementById("repeatToggle");
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

  let currentKey = null;
  let shuffle = false;
  let repeat = false;

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
    if (autoplay) {
      track.audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      setPlaying(false);
    }
  };

  const moveTrack = direction => {
    if (shuffle) {
      const candidates = order.filter(key => key !== currentKey);
      return selectTrack(candidates[Math.floor(Math.random() * candidates.length)] || order[0]);
    }
    const index = currentKey ? order.indexOf(currentKey) : 0;
    selectTrack(order[(index + direction + order.length) % order.length]);
  };

  document.querySelectorAll(".play-button").forEach(button => {
    button.addEventListener("click", () => selectTrack(button.dataset.track));
  });

  toggle.addEventListener("click", () => {
    if (!currentKey) return selectTrack("fun-dipp");
    const track = currentTrack();
    if (track.audio.paused) track.audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { track.audio.pause(); setPlaying(false); }
  });

  prev.addEventListener("click", () => moveTrack(-1));
  next.addEventListener("click", () => moveTrack(1));

  shuffleToggle.addEventListener("click", () => {
    shuffle = !shuffle;
    shuffleToggle.classList.toggle("active", shuffle);
    shuffleToggle.setAttribute("aria-pressed", String(shuffle));
  });

  repeatToggle.addEventListener("click", () => {
    repeat = !repeat;
    repeatToggle.classList.toggle("active", repeat);
    repeatToggle.setAttribute("aria-pressed", String(repeat));
  });

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
      if (currentTrack() !== track) return;
      if (repeat) {
        track.audio.currentTime = 0;
        track.audio.play();
      } else {
        moveTrack(1);
      }
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
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeLightbox(); });

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
