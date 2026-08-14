/* EXP 56.0 — reveal the hero only after a real video frame is ready */
(() => {
  'use strict';

  const ready = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, {once:true});
    } else {
      callback();
    }
  };

  ready(() => {
    const video = document.querySelector('.hero-v5-video');
    if (!video) return;

    const revealVideo = () => video.classList.add('exp56-video-ready');

    video.addEventListener('loadeddata', revealVideo, {once:true});
    video.addEventListener('playing', revealVideo, {once:true});

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      revealVideo();
    }
  });
})();
