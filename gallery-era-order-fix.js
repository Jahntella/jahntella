(() => {
  'use strict';

  // Keep the homepage Aesthetics gallery in the same album order as Music.
  // The DOM order is authoritative; the existing gallery CSS controls the layout.
  const ORDER = [
    'fun-dipp-cover.webp',
    'pink-lips-remix.webp',
    'bite-lip-cover.webp',
    'i-want-to-be-your-girl-cover.webp',
    'gloss-cover.webp',
    'embrace-me-cover.webp',
    'we-come-together-cover.webp',
    'play-with-me-cover.webp',
    'carnival-cover.webp',
    'made-of-light-cover.webp',
    'candy-wrapper-cover.webp',
    'playground-cover.webp',
    'milk-shake-cover.webp',
    'tonight-cover.webp',
    'sweet-dreams-cover.webp',
    'we-are-1-cover.webp',
    'boots-smile-attitude-cover.webp',
    'midnight-rodeo-cover.webp',
    'redline-cover.webp'
  ];

  const normalize = value => decodeURIComponent(String(value || ''))
    .split(/[?#]/)[0]
    .split('/').pop()
    .toLowerCase();

  const getFilename = item => {
    const img = item.querySelector('img');
    return normalize(img?.getAttribute('src') || item.getAttribute('data-lightbox') || '');
  };

  const orderMap = new Map(ORDER.map((name, index) => [name, index]));
  let busy = false;
  let scheduled = false;

  const sortGallery = () => {
    const grid = document.querySelector('#gallery .gallery-grid');
    if (!grid || busy) return;

    const items = Array.from(grid.children).filter(el => el.classList.contains('gallery-item'));
    if (items.length < 2) return;

    const ranked = items.map((item, index) => ({
      item,
      index,
      rank: orderMap.has(getFilename(item)) ? orderMap.get(getFilename(item)) : 10000 + index
    }));

    ranked.sort((a, b) => a.rank - b.rank || a.index - b.index);

    if (ranked.every((entry, index) => entry.item === items[index])) return;

    busy = true;
    const fragment = document.createDocumentFragment();
    ranked.forEach(entry => fragment.appendChild(entry.item));
    grid.appendChild(fragment);
    busy = false;
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      sortGallery();
    });
  };

  const start = () => {
    sortGallery();
    const gallery = document.querySelector('#gallery');
    if (!gallery) return;
    const observer = new MutationObserver(schedule);
    observer.observe(gallery, { childList: true, subtree: true });
    window.setTimeout(sortGallery, 100);
    window.setTimeout(sortGallery, 500);
    window.setTimeout(sortGallery, 1500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
