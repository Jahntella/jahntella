(() => {
  const video = document.getElementById("exp60SweetDreamsVideo");
  if (!video) return;

  const musicTracks = Array.from(document.querySelectorAll("audio"));

  video.addEventListener("play", () => {
    musicTracks.forEach(track => {
      if (!track.paused) track.pause();
    });
  });

  musicTracks.forEach(track => {
    track.addEventListener("play", () => {
      if (!video.paused) video.pause();
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !video.paused) video.pause();
  });
})();
