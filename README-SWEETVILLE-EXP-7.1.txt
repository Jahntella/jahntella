/* SWEETVILLE EXP 9.4 — PHOTO BOOTH */
(() => {
  'use strict';

  const canvas = document.getElementById('exp94Canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const upload = document.getElementById('exp94Upload');
  const zoom = document.getElementById('exp94Zoom');
  const frames = document.getElementById('exp94Frames');
  const captionSelect = document.getElementById('exp94Caption');
  const customCaption = document.getElementById('exp94CustomCaption');
  const empty = document.getElementById('exp94EmptyPhoto');
  const hostTitle = document.getElementById('exp94HostTitle');
  const hostText = document.getElementById('exp94HostText');

  const background = new Image();
  background.src = 'assets/JPhotobooth1.webp?v=9.4';

  let userImage = null;
  let frame = 'glow';
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let dragStart = null;
  let imageStart = null;

  const frameBox = { x:70, y:155, w:625, h:700 };

  const roundedPath = (x,y,w,h,r) => {
    const rr = Math.min(r,w/2,h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr,y);
    ctx.lineTo(x+w-rr,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+rr);
    ctx.lineTo(x+w,y+h-rr);
    ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
    ctx.lineTo(x+rr,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-rr);
    ctx.lineTo(x,y+rr);
    ctx.quadraticCurveTo(x,y,x+rr,y);
    ctx.closePath();
  };

  const currentCaption = () => {
    const custom = customCaption?.value.trim();
    return custom || captionSelect?.value || 'Visiting Sweetville with Jahntella 💖';
  };

  const drawCover = (img,x,y,w,h) => {
    const baseScale = Math.max(w/img.width,h/img.height);
    const drawW = img.width*baseScale*scale;
    const drawH = img.height*baseScale*scale;
    const drawX = x+(w-drawW)/2+offsetX;
    const drawY = y+(h-drawH)/2+offsetY;
    ctx.drawImage(img,drawX,drawY,drawW,drawH);
  };

  const drawFrame = () => {
    ctx.save();

    if (frame === 'polaroid') {
      ctx.fillStyle = '#ffffff';
      roundedPath(frameBox.x-24,frameBox.y-24,frameBox.w+48,frameBox.h+100,24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,85,178,.55)';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.fillStyle = '#8b3368';
      ctx.font = '700 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SWEETVILLE 💖',frameBox.x+frameBox.w/2,frameBox.y+frameBox.h+52);
    } else if (frame === 'hearts') {
      ctx.strokeStyle = '#ff72b9';
      ctx.lineWidth = 18;
      roundedPath(frameBox.x-8,frameBox.y-8,frameBox.w+16,frameBox.h+16,42);
      ctx.stroke();
      ctx.fillStyle = '#ff91ca';
      ctx.font = '46px sans-serif';
      [['♡',frameBox.x-5,frameBox.y+20],['♡',frameBox.x+frameBox.w-20,frameBox.y+20],
       ['♡',frameBox.x-5,frameBox.y+frameBox.h],['♡',frameBox.x+frameBox.w-20,frameBox.y+frameBox.h]]
       .forEach(([t,x,y])=>ctx.fillText(t,x,y));
    } else if (frame === 'glow') {
      ctx.shadowColor = '#ff4fad';
      ctx.shadowBlur = 36;
      ctx.strokeStyle = '#ff91cb';
      ctx.lineWidth = 14;
      roundedPath(frameBox.x-7,frameBox.y-7,frameBox.w+14,frameBox.h+14,42);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,.75)';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,.9)';
      ctx.lineWidth = 7;
      roundedPath(frameBox.x-4,frameBox.y-4,frameBox.w+8,frameBox.h+8,36);
      ctx.stroke();
    }

    ctx.restore();
  };

  const draw = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (background.complete && background.naturalWidth) {
      ctx.drawImage(background,0,0,canvas.width,canvas.height);
    } else {
      const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
      g.addColorStop(0,'#2d092e');
      g.addColorStop(1,'#d34891');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    // Visitor frame panel.
    ctx.save();
    roundedPath(frameBox.x,frameBox.y,frameBox.w,frameBox.h,34);
    ctx.clip();
    if (userImage) {
      drawCover(userImage,frameBox.x,frameBox.y,frameBox.w,frameBox.h);
    } else {
      ctx.fillStyle = 'rgba(26,4,29,.66)';
      ctx.fillRect(frameBox.x,frameBox.y,frameBox.w,frameBox.h);
    }
    ctx.restore();

    drawFrame();

    // Caption ribbon.
    const caption = currentCaption();
    ctx.save();
    ctx.fillStyle = 'rgba(33,3,34,.78)';
    roundedPath(110,900,1316,78,30);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,151,211,.7)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 34px sans-serif';
    ctx.fillText(caption,768,939,1230);
    ctx.restore();

    // Sweetville mark.
    ctx.save();
    ctx.font = '48px cursive';
    ctx.fillStyle = '#ff9bd2';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#ff42ad';
    ctx.shadowBlur = 18;
    ctx.fillText('Jahntella♡',90,100);
    ctx.restore();
  };

  background.onload = draw;

  upload?.addEventListener('change', () => {
    const file = upload.files?.[0];
    if (!file) return;

    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      window.alert('Please choose a JPG, PNG, or WebP image.');
      upload.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        userImage = img;
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        if (zoom) zoom.value = '1';
        empty?.classList.add('hidden');
        if (hostTitle) hostTitle.textContent = 'You look perfect beside me!';
        if (hostText) hostText.textContent = 'Drag your photo until the pose feels just right.';
        draw();
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

  zoom?.addEventListener('input', () => {
    scale = Number(zoom.value);
    draw();
  });

  frames?.addEventListener('click', event => {
    const button = event.target.closest('button[data-frame]');
    if (!button) return;
    frame = button.dataset.frame;
    frames.querySelectorAll('button').forEach(el => el.classList.toggle('active',el===button));
    draw();
  });

  captionSelect?.addEventListener('change', () => {
    if (customCaption) customCaption.value = '';
    draw();
  });
  customCaption?.addEventListener('input', draw);

  const point = event => {
    const rect = canvas.getBoundingClientRect();
    return {
      x:(event.clientX-rect.left)*canvas.width/rect.width,
      y:(event.clientY-rect.top)*canvas.height/rect.height
    };
  };

  canvas.addEventListener('pointerdown', event => {
    if (!userImage) return;
    const p = point(event);
    if (p.x < frameBox.x || p.x > frameBox.x+frameBox.w || p.y < frameBox.y || p.y > frameBox.y+frameBox.h) return;
    dragging = true;
    dragStart = p;
    imageStart = {x:offsetX,y:offsetY};
    canvas.setPointerCapture?.(event.pointerId);
  });

  canvas.addEventListener('pointermove', event => {
    if (!dragging) return;
    const p = point(event);
    offsetX = imageStart.x + (p.x-dragStart.x);
    offsetY = imageStart.y + (p.y-dragStart.y);
    draw();
  });

  const stopDrag = event => {
    dragging = false;
    try { canvas.releasePointerCapture?.(event.pointerId); } catch {}
  };
  canvas.addEventListener('pointerup',stopDrag);
  canvas.addEventListener('pointercancel',stopDrag);

  document.getElementById('exp94ResetPhoto')?.addEventListener('click', () => {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    if (zoom) zoom.value = '1';
    draw();
  });

  const requirePhoto = () => {
    if (userImage) return true;
    window.alert('Choose your photo first so you can join Jahntella.');
    return false;
  };

  const dataUrl = () => {
    draw();
    return canvas.toDataURL('image/png');
  };

  document.getElementById('exp94Download')?.addEventListener('click', () => {
    if (!requirePhoto()) return;
    const link = document.createElement('a');
    link.download = `sweetville-photo-booth-${Date.now()}.png`;
    link.href = dataUrl();
    link.click();
    if (hostTitle) hostTitle.textContent = 'Our photo is ready!';
    if (hostText) hostText.textContent = 'Thanks for visiting the Sweetville Photo Booth with me.';
  });

  document.getElementById('exp94Print')?.addEventListener('click', () => {
    if (!requirePhoto()) return;
    const url = dataUrl();
    const win = window.open('','_blank');
    if (!win) {
      window.alert('Please allow pop-ups so the print window can open.');
      return;
    }
    win.document.write(`<html><head><title>Sweetville Photo Booth</title><style>body{margin:0;display:grid;place-items:center;background:#fff}img{max-width:100%;height:auto}@media print{img{width:100%}}</style></head><body><img src="${url}" onload="window.print()"></body></html>`);
    win.document.close();
  });

  document.getElementById('exp94SaveGallery')?.addEventListener('click', () => {
    if (!requirePhoto()) return;
    let gallery = [];
    try { gallery = JSON.parse(localStorage.getItem('sweetvilleExp90Gallery')) || []; } catch {}
    gallery.unshift({
      id:Date.now(),
      title:'Photo Booth with Jahntella',
      date:new Date().toLocaleDateString(),
      data:dataUrl()
    });
    gallery = gallery.slice(0,8);
    try { localStorage.setItem('sweetvilleExp90Gallery',JSON.stringify(gallery)); }
    catch {
      gallery = gallery.slice(0,3);
      try { localStorage.setItem('sweetvilleExp90Gallery',JSON.stringify(gallery)); } catch {}
    }
    window.dispatchEvent(new CustomEvent('sweetville:gallery-changed',{detail:gallery}));
    if (hostTitle) hostTitle.textContent = 'Saved to your gallery!';
    if (hostText) hostText.textContent = 'I framed our photo so you can visit it anytime.';
    window.sweetvilleLaunchFireworks?.(innerWidth*.5,innerHeight*.24,18);
  });

  draw();
})();
