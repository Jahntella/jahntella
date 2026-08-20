/* The Shine Era presentation + shared play transport */
window.JAHNTELLA_ALBUM2 = Object.freeze({
  previewMode: false,
  plannedManualActivation: '2026-08-26',
  releaseDate: '2026-08-27',
  tracks: Object.freeze({
    'sweet-dreams': Object.freeze({
      fullAudio: 'sweetville/sweet-dreams.mp3',
      previewAudio: 'sweetville/previews/sweet-dreams-preview.mp3',
      fullVideo: 'assets/album2/sweet-dreams-official-visualizer.mp4',
      previewVideo: 'assets/album2/previews/sweet-dreams-preview.mp4'
    }),
    'we-are-1': Object.freeze({
      fullAudio: 'sweetville/we-are-1.mp3',
      previewAudio: 'sweetville/previews/we-are-1-preview.mp3',
      fullVideo: 'assets/album2/we-are-1-official-visualizer.mp4',
      previewVideo: 'assets/album2/previews/we-are-1-preview.mp4'
    }),
    'boots-smile-attitude': Object.freeze({
      fullAudio: 'sweetville/boots-smile-attitude.mp3',
      previewAudio: 'sweetville/previews/boots-smile-attitude-preview.mp3',
      fullVideo: 'assets/album2/boots-smile-attitude-official-visualizer.mp4',
      previewVideo: 'assets/album2/previews/boots-smile-attitude-preview.mp4'
    }),
    'midnight-rodeo': Object.freeze({
      fullAudio: 'assets/album2/midnight-rodeo.mp3',
      fullVideo: 'assets/album2/midnight-rodeo-official-visualizer.mp4',
      artwork: 'assets/album2/midnight-rodeo-cover.webp',
      artworkThumb: 'assets/album2/midnight-rodeo-cover-thumb.webp'
    }),
    redline: Object.freeze({
      fullAudio: 'assets/album2/redline.mp3',
      fullVideo: 'assets/album2/redline-official-visualizer.mp4',
      artwork: 'assets/album2/redline-cover.webp',
      artworkThumb: 'assets/album2/redline-cover-thumb.webp'
    })
  })
});

(() => {
  const addScript = (src, version) => {
    const s = document.createElement('script');
    s.src = new URL(`${src}?v=${version}`, document.baseURI).href;
    s.defer = true;
    document.head.appendChild(s);
  };
  const addCss = (href, version) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = new URL(`${href}?v=${version}`, document.baseURI).href;
    document.head.appendChild(l);
  };

  const run = () => {
    const sweetville = /\/sweetville(?:\/|$)/i.test(location.pathname);
    if (sweetville) {
      if (!window.__jahntellaSweetEraExtensionsLoaded) {
        window.__jahntellaSweetEraExtensionsLoaded = true;
        addScript('sweetville/shine-era-sweetville-extensions.js', '20260819.1');
        addCss('sweetville/redline-sweetville.css', '20260819.1');
      }
      return;
    }

    if (!window.__jahntellaShineEraExtensionsLoaded) {
      window.__jahntellaShineEraExtensionsLoaded = true;
      addScript('shine-era-shared-transport.js', '20260819.1');
      addScript('redline-site.js', '20260819.2');
      addScript('midnight-rodeo-site.js', '20260819.2');
      addCss('redline-site.css', '20260819.2');
      addCss('midnight-rodeo-site.css', '20260819.7');
    }

    const count = document.getElementById('newMusicTitle');
    if (count) count.innerHTML = count.innerHTML.replace(/\b(?:15|16) new songs\b/gi, '17 new songs');

    const gallery = document.getElementById('gallery');
    const story = document.getElementById('about');
    if (gallery && story && story.parentNode && gallery !== story.previousElementSibling) story.parentNode.insertBefore(gallery, story);

    const shineIntro = Array.from(document.querySelectorAll('p')).find(node =>
      node.textContent.includes('Get your first look at') && node.textContent.includes('The Shine Era')
    );
    if (shineIntro) {
      shineIntro.innerHTML = 'Get your first look at <strong>The Shine Era</strong>—front and back—and step inside <strong>Sweet Dreams</strong>, <strong>We Are 1</strong>, <strong>Boots, Smile &amp; Attitude</strong>, <strong>Midnight Rodeo</strong>, and <strong>Redline</strong>—five glimpses of the sound, light, and world of Album II.';
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
