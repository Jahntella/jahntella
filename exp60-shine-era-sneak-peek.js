(() => {
  const videos = Array.from(document.querySelectorAll(".exp60-shine-video-frame video"));
  if (!videos.length) return;

  const musicTracks = Array.from(document.querySelectorAll("audio"));

  videos.forEach(activeVideo => {
    activeVideo.addEventListener("play", () => {
      musicTracks.forEach(track => {
        if (!track.paused) track.pause();
      });

      videos.forEach(otherVideo => {
        if (otherVideo !== activeVideo && !otherVideo.paused) otherVideo.pause();
      });
    });
  });

  musicTracks.forEach(track => {
    track.addEventListener("play", () => {
      videos.forEach(video => {
        if (!video.paused) video.pause();
      });
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) return;
    videos.forEach(video => {
      if (!video.paused) video.pause();
    });
  });
})();
