(() => {
  'use strict';
  if (window.__jahntellaGalleryEraOrderFix) return;
  window.__jahntellaGalleryEraOrderFix = true;

  const isSweetville = /\/sweetville(?:\/|$)/i.test(location.pathname);
  if (isSweetville) return;

  const shineKeys = new Set(['sweet-dreams','we-are-1','boots-smile-attitude','midnight-rodeo','redline']);

  const galleryKey = item => {
    const id = item.id || '';
    if (id === 'midnightRodeoAestheticCover') return 'midnight-rodeo';
    if (id === 'redlineAestheticCover') return 'redline';
    const text = `${item.dataset.lightbox || ''} ${item.querySelector('img')?.getAttribute('src') || ''} ${item.querySelector('img')?.getAttribute('alt') || ''}`.toLowerCase();
    const pairs = [
      ['fun-dipp','fun-dipp'],['pink-lips-remix','pink-lips'],['bite-lip','bite-lip'],['gloss','gloss'],
      ['i-want-to-be-your-girl','your-girl'],['embrace-me','embrace-me'],['we-come-together','we-come-together'],
      ['play-with-me','play-with-me'],['carnival','carnival'],['made-of-light','made-of-light'],
      ['candy-wrapper','candy-wrapper'],['playground','playground'],['milk-shake','milk-shake'],['tonight','tonight'],
      ['sweet-dreams','sweet-dreams'],['we-are-1','we-are-1'],['boots-smile-attitude','boots-smile-attitude'],
      ['midnight-rodeo','midnight-rodeo'],['redline','redline']
    ];
    return pairs.find(([needle]) => text.includes(needle))?.[1] || null;
  };

  const getMusicOrder = () => {
    const keys = [];
    document.querySelectorAll('#music [data-card], #newMusic [data-card]').forEach(card => {
      const key = card.dataset.card;
      if (key && !keys.includes(key)) keys.push(key);
    });
    const shine = ['sweet-dreams','we-are-1','boots-smile-attitude','midnight-rodeo','redline'];
    shine.forEach(key => { if (!keys.includes(key)) keys.push(key); });
    return keys;
  };

  const injectStyles = () => {
    if (document.getElementById('jahntellaGalleryEraOrderFixStyles')) return;
    const style = document.createElement('style');
    style.id = 'jahntellaGalleryEraOrderFixStyles';
    style.textContent = `
      .gallery-section .gallery-grid{display:block!important}
      .gallery-era-block{width:100%;margin:1.35rem 0 2.35rem}
      .gallery-era-heading{margin:0 0 .9rem;padding:.7rem 0 .55rem;color:#ffd1f2;text-align:left;font-family:"Playfair Display",serif;font-size:clamp(1.15rem,2vw,1.55rem);letter-spacing:.03em;border-bottom:1px solid rgba(255,141,204,.22)}
      .gallery-era-heading::after{content:"";display:block;width:3.5rem;height:2px;margin-top:.42rem;background:linear-gradient(90deg,#ff8dcc,#79e8ff,transparent)}
      .gallery-era-row{display:flex;flex-wrap:nowrap;justify-content:center;align-items:flex-start;gap:clamp(.75rem,1.15vw,1.05rem);width:100%;overflow-x:auto;overflow-y:hidden;padding:.15rem .1rem 1rem;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;scrollbar-width:thin;box-sizing:border-box}
      .gallery-era-row>.gallery-item{flex:0 0 clamp(145px,13vw,190px);width:clamp(145px,13vw,190px);scroll-snap-align:start;box-sizing:border-box}
      .gallery-era-row>.gallery-item img{display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:cover}
      @media(max-width:900px){.gallery-era-row{justify-content:flex-start}.gallery-era-row>.gallery-item{flex-basis:155px;width:155px}}
      @media(max-width:700px){.gallery-era-block{margin-bottom:1.8rem}.gallery-era-row>.gallery-item{flex-basis:140px;width:140px}}
    `;
    document.head.appendChild(style);
  };

  const organize = () => {
    const grid = document.querySelector('.gallery-section .gallery-grid');
    if (!grid) return;
    injectStyles();

    const order = getMusicOrder();
    const itemByKey = new Map();
    grid.querySelectorAll(':scope > .gallery-item, :scope > .gallery-era-block .gallery-item').forEach(item => {
      const key = galleryKey(item);
      if (key && !itemByKey.has(key)) itemByKey.set(key, item);
    });

    const allItems = order.map(key => itemByKey.get(key)).filter(Boolean);
    if (!allItems.length) return;

    grid.querySelectorAll(':scope > .gallery-era-block').forEach(node => node.remove());
    const used = new Set(allItems);
    grid.querySelectorAll(':scope > .gallery-item').forEach(item => { if (used.has(item)) item.remove(); });

    const makeBlock = (id, label, items) => {
      const block = document.createElement('section');
      block.id = id;
      block.className = 'gallery-era-block';
      block.setAttribute('aria-label', label);
      const heading = document.createElement('h3');
      heading.className = 'gallery-era-heading';
      heading.textContent = label;
      const row = document.createElement('div');
      row.className = 'gallery-era-row';
      items.forEach(item => row.appendChild(item));
      block.append(heading, row);
      return block;
    };

    const sweet = allItems.filter(item => !shineKeys.has(galleryKey(item)));
    const shine = allItems.filter(item => shineKeys.has(galleryKey(item)));
    grid.appendChild(makeBlock('sweetEraGalleryRow','THE SWEET ERA — ALBUM I',sweet));
    grid.appendChild(makeBlock('shineEraGalleryRow','THE SHINE ERA — ALBUM II',shine));
  };

  const init = () => {
    let tries = 0;
    const tick = () => {
      tries += 1;
      organize();
      if (tries < 8) window.setTimeout(tick, 500);
    };
    tick();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
