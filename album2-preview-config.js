/*
 * The Shine Era preview switch + shared Album II presentation hooks
 */
window.JAHNTELLA_ALBUM2 = Object.freeze({
  previewMode: false,
  plannedManualActivation: "2026-08-26",
  releaseDate: "2026-08-27",
  tracks: Object.freeze({
    "sweet-dreams": Object.freeze({
      fullAudio: "sweetville/sweet-dreams.mp3",
      previewAudio: "sweetville/previews/sweet-dreams-preview.mp3",
      fullVideo: "assets/album2/sweet-dreams-official-visualizer.mp4",
      previewVideo: "assets/album2/previews/sweet-dreams-preview.mp4"
    }),
    "we-are-1": Object.freeze({
      fullAudio: "sweetville/we-are-1.mp3",
      previewAudio: "sweetville/previews/we-are-1-preview.mp3",
      fullVideo: "assets/album2/we-are-1-official-visualizer.mp4",
      previewVideo: "assets/album2/previews/we-are-1-preview.mp4"
    }),
    "boots-smile-attitude": Object.freeze({
      fullAudio: "sweetville/boots-smile-attitude.mp3",
      previewAudio: "sweetville/previews/boots-smile-attitude-preview.mp3",
      fullVideo: "assets/album2/boots-smile-attitude-official-visualizer.mp4",
      previewVideo: "assets/album2/previews/boots-smile-attitude-preview.mp4"
    }),
    "midnight-rodeo": Object.freeze({
      fullAudio: "assets/album2/midnight-rodeo.mp3",
      fullVideo: "assets/album2/midnight-rodeo-official-visualizer.mp4",
      artwork: "assets/album2/midnight-rodeo-cover.webp"
    }),
    "redline": Object.freeze({
      fullAudio: "assets/album2/redline.mp3",
      fullVideo: "assets/album2/redline-official-visualizer.mp4",
      artwork: "assets/album2/redline-cover.webp",
      artworkThumb: "assets/album2/redline-cover-thumb.webp"
    })
  })
});

(() => {
  const load = (src, css) => {
    const s = document.createElement('script');
    s.src = new URL(src, document.baseURI).href;
    s.defer = true;
    document.head.appendChild(s);
    if (css) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = new URL(css, document.baseURI).href;
      document.head.appendChild(l);
    }
  };
  const run = () => {
    if (!window.__jahntellaRedlineLoader) {
      window.__jahntellaRedlineLoader = true;
      load('redline-site.js?v=2026.08.19.1', 'redline-site.css?v=2026.08.19.1');
      if (/\/sweetville(?:\/|$)/i.test(location.pathname)) {
        load('sweetville/redline-sweetville.js?v=2026.08.19.1', null);
        const sl = document.createElement('link');
        sl.rel = 'stylesheet';
        sl.href = new URL('sweetville/redline-sweetville.css?v=2026.08.19.1', document.baseURI).href;
        document.head.appendChild(sl);
      }
      // Midnight stays loaded after Redline so Redline captures Midnight's ended event first.
      load('midnight-rodeo-site.js?v=2026.08.19.7', 'midnight-rodeo-site.css?v=2026.08.19.7');
    }
    const count = document.getElementById('newMusicTitle');
    if (count) count.innerHTML = count.innerHTML.replace(/\b(?:15|16) new songs\b/gi, '17 new songs');
    const gallery = document.getElementById('gallery');
    const story = document.getElementById('about');
    if (gallery && story && story.parentNode && gallery !== story.previousElementSibling) story.parentNode.insertBefore(gallery, story);
    const shineIntro = Array.from(document.querySelectorAll('p')).find(node => node.textContent.includes('Get your first look at') && node.textContent.includes('The Shine Era'));
    if (shineIntro) shineIntro.innerHTML = 'Get your first look at <strong>The Shine Era</strong>—front and back—and step inside <strong>Sweet Dreams</strong>, <strong>We Are 1</strong>, <strong>Boots, Smile &amp; Attitude</strong>, <strong>Midnight Rodeo</strong>, and <strong>Redline</strong>—five glimpses of the sound, light, and world of Album II.';
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true}); else run();
})();
