(() => {
  const videos = Array.from(document.querySelectorAll(".exp60-shine-video-card video"));
  if (!videos.length) return;

  const musicTracks = Array.from(document.querySelectorAll("audio"));

  videos.forEach(video => {
    video.addEventListener("play", () => {
      musicTracks.forEach(track => {
        if (!track.paused) track.pause();
      });
      videos.forEach(otherVideo => {
        if (otherVideo !== video && !otherVideo.paused) otherVideo.pause();
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

  const loadThreeCardFix = () => {
    if (document.querySelector('script[data-jahntella-three-card-fix]')) return;
    const script = document.createElement('script');
    script.src = 'shine-era-three-card-fix.js?v=1';
    script.dataset.jahntellaThreeCardFix = '1';
    document.head.appendChild(script);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadThreeCardFix, {once:true});
  else loadThreeCardFix();
})();
