/*
 * The Shine Era preview switch
 *
 * Keep `previewMode` false until the planned manual activation on August 26,
 * 2026. Changing this single value to true switches the prepared Shine Era
 * teaser audio/video assets into preview mode.
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
    })
  })
});

/* Load the Midnight Rodeo presentation on both the main site and Sweetville. */
(() => {
  const load = () => {
    if (window.__midnightRodeoSiteLoaded) return;
    window.__midnightRodeoSiteLoaded = true;
    const script = document.createElement('script');
    script.src = new URL('midnight-rodeo-site.js?v=2026.08.19.4', document.baseURI).href;
    script.defer = true;
    document.head.appendChild(script);
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('midnight-rodeo-site.css?v=2026.08.19.4', document.baseURI).href;
    document.head.appendChild(css);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, {once:true});
  else load();
})();

/* Small homepage presentation updates for the current release count + gallery hint. */
(() => {
  const apply = () => {
    document.querySelectorAll('#newMusicTitle').forEach(node => {
      node.innerHTML = node.innerHTML.replace(/\b15 new songs\b/i, '16 new songs');
    });

    const heading = document.querySelector('#gallery .section-heading');
    if (heading && !document.getElementById('galleryListenPrompt')) {
      const prompt = document.createElement('p');
      prompt.id = 'galleryListenPrompt';
      prompt.className = 'gallery-listen-prompt';
      prompt.textContent = 'Click Your Favorite Cover Art to Listen';
      heading.appendChild(prompt);

      const style = document.createElement('style');
      style.id = 'galleryListenPromptStyle';
      style.textContent = `
        .gallery-listen-prompt{margin:.45rem auto 0;color:rgba(255,255,255,.82);font-size:.9rem;font-weight:700;letter-spacing:.04em;text-align:center}
        @media(max-width:600px){.gallery-listen-prompt{font-size:.82rem}}
      `;
      document.head.appendChild(style);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();
})();
