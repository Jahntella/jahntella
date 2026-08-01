/* SWEETVILLE EXP 9.3 — CREATE WITH JAHNTELLA */
(() => {
  'use strict';

  const stage = document.getElementById('exp93Stage');
  if (!stage) return;

  const galleryKey = 'sweetvilleExp90Gallery';
  const modeTabs = document.getElementById('exp93ModeTabs');
  const bgButtons = document.getElementById('exp93Backgrounds');
  const stickerPalette = document.getElementById('exp93StickerPalette');
  const quoteSelect = document.getElementById('exp93QuoteSelect');
  const customText = document.getElementById('exp93CustomText');
  const stageQuote = document.getElementById('exp93StageQuote');
  const formatLabel = document.getElementById('exp93FormatLabel');
  const projectTitle = document.getElementById('exp93ProjectTitle');
  const hostTitle = document.getElementById('exp93HostTitle');
  const hostMessage = document.getElementById('exp93HostMessage');
  const selectionStatus = document.getElementById('exp93SelectionStatus');

  let mode = 'poster';
  let selected = null;
  let history = [];
  let future = [];
  let drag = null;

  const modeNames = {
    poster:['POSTER CREATOR','Sweetville Poster'],
    wallpaper:['WALLPAPER CREATOR','Sweetville Wallpaper'],
    card:['SWEET CARD CREATOR','Sweetville Card'],
    stickers:['STICKER STUDIO','Sweetville Sticker Scene']
  };

  const encouragement = {
    poster:['That feels like a real Sweetville poster.','I love how bold you made it.'],
    wallpaper:['I would absolutely use this as my wallpaper.','The colors feel so peaceful.'],
    card:['Someone is going to smile when they see this.','A little kindness looks beautiful here.'],
    stickers:['Mochi says it needs one more sticker.','Honestly, he always says that.']
  };

  const snapshot = () => {
    history.push(stage.innerHTML);
    if (history.length > 30) history.shift();
    future = [];
  };

  const restore = html => {
    stage.innerHTML = html;
    bindStageItems();
    selected = null;
    updateSelection();
  };

  const announce = (title,message) => {
    if (hostTitle) hostTitle.textContent = title;
    if (hostMessage) hostMessage.textContent = message;
  };

  const updateSelection = () => {
    stage.querySelectorAll('.exp93-sticker-item').forEach(item => {
      item.classList.toggle('selected', item === selected);
    });
    if (selectionStatus) {
      selectionStatus.textContent = selected ? `Selected ${selected.textContent}` : 'Tap a sticker to add it';
    }
  };

  const bindStageItems = () => {
    stage.querySelectorAll('.exp93-sticker-item').forEach(item => {
      if (item.dataset.bound === 'true') return;
      item.dataset.bound = 'true';

      item.addEventListener('pointerdown', event => {
        event.preventDefault();
        selected = item;
        updateSelection();
        const rect = stage.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        drag = {
          pointerId:event.pointerId,
          offsetX:event.clientX-itemRect.left,
          offsetY:event.clientY-itemRect.top,
          stageRect:rect
        };
        item.setPointerCapture?.(event.pointerId);
      });

      item.addEventListener('pointermove', event => {
        if (!drag || drag.pointerId !== event.pointerId || selected !== item) return;
        const x = event.clientX - drag.stageRect.left - drag.offsetX;
        const y = event.clientY - drag.stageRect.top - drag.offsetY;
        const maxX = drag.stageRect.width - item.offsetWidth;
        const maxY = drag.stageRect.height - item.offsetHeight;
        item.style.left = `${Math.max(0,Math.min(maxX,x))}px`;
        item.style.top = `${Math.max(0,Math.min(maxY,y))}px`;
      });

      item.addEventListener('pointerup', event => {
        if (!drag) return;
        try { item.releasePointerCapture?.(event.pointerId); } catch {}
        drag = null;
        snapshot();
      });

      item.addEventListener('click', event => {
        event.stopPropagation();
        selected = item;
        updateSelection();
      });
    });
  };

  stage.addEventListener('click', event => {
    if (event.target === stage || event.target.classList.contains('exp93-stage-glow')) {
      selected = null;
      updateSelection();
    }
  });

  modeTabs?.addEventListener('click', event => {
    const button = event.target.closest('button[data-mode]');
    if (!button) return;
    mode = button.dataset.mode;
    modeTabs.querySelectorAll('button').forEach(el => el.classList.toggle('active',el===button));
    stage.className = stage.className.replace(/mode-\w+/g,'').trim();
    stage.classList.add(`mode-${mode}`);
    const [label,title] = modeNames[mode];
    if (formatLabel) formatLabel.textContent = label;
    if (projectTitle) projectTitle.textContent = title;
    const [h,m] = encouragement[mode];
    announce(h,m);
    snapshot();
  });

  bgButtons?.addEventListener('click', event => {
    const button = event.target.closest('button[data-bg]');
    if (!button) return;
    bgButtons.querySelectorAll('button').forEach(el => el.classList.toggle('active',el===button));
    [...stage.classList].filter(c => c.startsWith('bg-')).forEach(c => stage.classList.remove(c));
    stage.classList.add(`bg-${button.dataset.bg}`);
    snapshot();
  });

  const updateQuoteFromSelect = () => {
    if (customText) customText.value = '';
    if (stageQuote) stageQuote.textContent = quoteSelect?.value || 'Welcome home, Sweetie.';
  };

  const updateQuoteFromInput = () => {
    const value = customText?.value ?? '';
    if (stageQuote) stageQuote.textContent = value.length ? value : ' ';
  };

  quoteSelect?.addEventListener('change', () => {
    updateQuoteFromSelect();
    snapshot();
  });

  customText?.addEventListener('input', updateQuoteFromInput);
  customText?.addEventListener('keyup', updateQuoteFromInput);
  customText?.addEventListener('change', () => {
    updateQuoteFromInput();
    snapshot();
  });

  stickerPalette?.addEventListener('click', event => {
    const button = event.target.closest('button[data-sticker]');
    if (!button) return;

    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'exp93-sticker-item';
    item.textContent = button.dataset.sticker;
    item.style.left = `${35 + Math.random()*30}%`;
    item.style.top = `${28 + Math.random()*38}%`;
    item.style.setProperty('--scale','1');
    item.style.setProperty('--rotate','0deg');
    stage.appendChild(item);
    bindStageItems();
    selected = item;
    updateSelection();
    snapshot();
    announce('That one belongs there.','I love how your creation is coming together.');
  });

  document.getElementById('exp93RotateLeft')?.addEventListener('click', () => {
    if (!selected) return;
    const current = Number(selected.dataset.rotate || 0) - 15;
    selected.dataset.rotate = String(current);
    selected.style.setProperty('--rotate',`${current}deg`);
    snapshot();
  });

  document.getElementById('exp93Grow')?.addEventListener('click', () => {
    if (!selected) return;
    const scale = Math.min(2.5,Number(selected.dataset.scale || 1)+.15);
    selected.dataset.scale = String(scale);
    selected.style.setProperty('--scale',String(scale));
    snapshot();
  });

  document.getElementById('exp93Shrink')?.addEventListener('click', () => {
    if (!selected) return;
    const scale = Math.max(.45,Number(selected.dataset.scale || 1)-.15);
    selected.dataset.scale = String(scale);
    selected.style.setProperty('--scale',String(scale));
    snapshot();
  });

  document.getElementById('exp93Delete')?.addEventListener('click', () => {
    if (!selected) return;
    selected.remove();
    selected = null;
    updateSelection();
    snapshot();
  });

  document.getElementById('exp93Undo')?.addEventListener('click', () => {
    if (history.length <= 1) return;
    future.push(history.pop());
    restore(history[history.length-1]);
  });

  document.getElementById('exp93Redo')?.addEventListener('click', () => {
    if (!future.length) return;
    const next = future.pop();
    history.push(next);
    restore(next);
  });

  document.getElementById('exp93Clear')?.addEventListener('click', () => {
    if (!window.confirm('Clear this creation and start again?')) return;
    stage.querySelectorAll('.exp93-sticker-item').forEach(item => item.remove());
    selected = null;
    updateSelection();
    snapshot();
    announce('Fresh canvas, fresh idea.','Sometimes the best creations begin twice.');
  });

  const renderToCanvas = () => {
    const rect = stage.getBoundingClientRect();
    const width = mode === 'wallpaper' ? 1080 : mode === 'card' ? 1200 : 1200;
    const height = mode === 'wallpaper' ? 1920 : mode === 'card' ? 800 : 1500;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const bg = getComputedStyle(stage).backgroundImage;
    const fallback = {
      poster:['#7b2f87','#ff6ca8'],
      wallpaper:['#3d1c67','#d05da8'],
      card:['#fff3f8','#f4d8ff'],
      stickers:['#ff9acb','#9f74e8']
    }[mode];

    const gradient = ctx.createLinearGradient(0,0,width,height);
    gradient.addColorStop(0,fallback[0]);
    gradient.addColorStop(1,fallback[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,width,height);

    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.lineWidth = 6;
    ctx.strokeRect(42,42,width-84,height-84);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.round(width*.032)}px sans-serif`;
    ctx.fillText('THE WORLD OF SWEET',width/2,height*.18);

    ctx.font = `700 ${Math.round(width*.07)}px serif`;
    const quote = stageQuote?.textContent || 'Welcome home, Sweetie.';
    const words = quote.split(' ');
    const lines = [];
    let line = '';
    words.forEach(word => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > width*.74) {
        lines.push(line);
        line = word;
      } else line = test;
    });
    if (line) lines.push(line);
    lines.slice(0,4).forEach((text,i) => {
      ctx.fillText(text,width/2,height*.36+i*width*.08);
    });

    ctx.font = `400 ${Math.round(width*.045)}px cursive`;
    ctx.fillText('Jahntella 💋',width/2,height*.72);

    const stageRect = stage.getBoundingClientRect();
    stage.querySelectorAll('.exp93-sticker-item').forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const x = ((itemRect.left-stageRect.left)+itemRect.width/2)/stageRect.width*width;
      const y = ((itemRect.top-stageRect.top)+itemRect.height/2)/stageRect.height*height;
      const scale = Number(item.dataset.scale || 1);
      const rotate = Number(item.dataset.rotate || 0)*Math.PI/180;
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(rotate);
      ctx.font = `${Math.round(width*.07*scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.textContent,0,0);
      ctx.restore();
    });

    ctx.font = `600 ${Math.round(width*.022)}px sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.fillText('Created together by You & Jahntella 💖',width/2,height*.93);
    return canvas;
  };

  const saveToGallery = () => {
    const canvas = renderToCanvas();
    let gallery = [];
    try { gallery = JSON.parse(localStorage.getItem(galleryKey)) || []; } catch {}
    gallery.unshift({
      id:Date.now(),
      title:modeNames[mode][1],
      date:new Date().toLocaleDateString(),
      data:canvas.toDataURL('image/png')
    });
    gallery = gallery.slice(0,8);
    try { localStorage.setItem(galleryKey,JSON.stringify(gallery)); }
    catch {
      gallery = gallery.slice(0,3);
      try { localStorage.setItem(galleryKey,JSON.stringify(gallery)); } catch {}
    }
    window.dispatchEvent(new CustomEvent('sweetville:gallery-changed',{detail:gallery}));
    announce('Saved to your gallery.','I framed it for you.');
    window.sweetvilleLaunchFireworks?.(innerWidth*.5,innerHeight*.25,18);
  };

  document.getElementById('exp93SaveGallery')?.addEventListener('click', saveToGallery);

  document.getElementById('exp93Download')?.addEventListener('click', () => {
    const canvas = renderToCanvas();
    const link = document.createElement('a');
    link.download = `sweetville-${mode}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    announce('Your creation is ready.','I hope it makes you smile every time you see it.');
  });

  bindStageItems();
  snapshot();
})();
