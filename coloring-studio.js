(() => {
  'use strict';

  const canvas = document.getElementById('exp90Canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const wrap = document.getElementById('exp90CanvasWrap');
  const hint = document.getElementById('exp90CanvasHint');
  const progressBar = document.getElementById('exp90ProgressBar');
  const progressText = document.getElementById('exp90ProgressText');
  const hostTitle = document.getElementById('exp90HostTitle');
  const hostMessage = document.getElementById('exp90HostMessage');
  const savedCount = document.getElementById('exp90SavedCount');

  const STORAGE_KEY = 'sweetvilleExp90Gallery';
  let gallery = [];
  try { gallery = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch {}
  if (savedCount) savedCount.textContent = String(gallery.length);

  let color = '#ff4fa3';
  let size = 28;
  let erasing = false;
  let drawing = false;
  let last = null;
  let undoStack = [];
  let redoStack = [];
  let strokeCount = 0;

  const messages = [
    ['That color looks perfect here.','I love how your version is becoming completely yours.'],
    ['Ooooh, keep going!','Sweetville has never looked quite like this before.'],
    ['Lavender would be pretty too.','But trust your own eye—there are no wrong choices here.'],
    ['Mochi says this needs one more sparkle.','Honestly, he says that about everything.'],
    ['You are making this feel alive.','I hope you save it when you are finished.']
  ];

  const roundedRect = (x,y,w,h,r) => {
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

  const drawPage = () => {
    ctx.save();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#fffafc';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = '#31152d';
    ctx.fillStyle = '#fffafc';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    roundedRect(55,55,890,1090,45);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(500,980,330,85,0,0,Math.PI*2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(300,700);
    ctx.lineTo(700,700);
    ctx.lineTo(640,960);
    ctx.lineTo(360,960);
    ctx.closePath();
    ctx.stroke();

    for (let x=375;x<=625;x+=50) {
      ctx.beginPath();
      ctx.moveTo(x,720);
      ctx.lineTo(x-15,940);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(320,700);
    ctx.bezierCurveTo(300,640,350,600,400,600);
    ctx.bezierCurveTo(345,540,400,485,455,505);
    ctx.bezierCurveTo(430,420,535,400,555,485);
    ctx.bezierCurveTo(620,455,675,520,625,585);
    ctx.bezierCurveTo(720,590,735,675,680,700);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(500,355);
    ctx.bezierCurveTo(420,275,320,350,500,510);
    ctx.bezierCurveTo(680,350,580,275,500,355);
    ctx.closePath();
    ctx.stroke();

    [[245,430],[755,430],[220,610],[780,610],[190,815],[810,815]].forEach(([x,y],i)=>{
      ctx.beginPath();
      if (i%2===0) ctx.arc(x,y,38,0,Math.PI*2);
      else {
        ctx.moveTo(x,y-42);
        ctx.lineTo(x+42,y);
        ctx.lineTo(x,y+42);
        ctx.lineTo(x-42,y);
        ctx.closePath();
      }
      ctx.stroke();
    });

    const star = (cx,cy,r1,r2,n=5)=>{
      ctx.beginPath();
      for(let i=0;i<n*2;i++){
        const a=-Math.PI/2+i*Math.PI/n;
        const r=i%2===0?r1:r2;
        const x=cx+Math.cos(a)*r;
        const y=cy+Math.sin(a)*r;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    star(155,250,42,18);
    star(845,250,42,18);
    star(160,1040,34,14);
    star(840,1040,34,14);

    ctx.font = '700 56px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#31152d';
    ctx.fillText('SWEETVILLE',500,1100);
    ctx.font = '34px sans-serif';
    ctx.fillText('COLORING PARTY',500,1145);
    ctx.restore();
  };

  const saveState = () => {
    undoStack.push(canvas.toDataURL('image/png'));
    if (undoStack.length > 30) undoStack.shift();
    redoStack = [];
  };

  const restore = src => new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      resolve();
    };
    img.src = src;
  });

  drawPage();
  saveState();

  const point = event => {
    const rect = canvas.getBoundingClientRect();
    return {
      x:(event.clientX-rect.left)*canvas.width/rect.width,
      y:(event.clientY-rect.top)*canvas.height/rect.height
    };
  };

  const begin = event => {
    event.preventDefault();
    drawing = true;
    last = point(event);
    canvas.setPointerCapture?.(event.pointerId);
    hint?.classList.add('hidden');
  };

  const move = event => {
    if (!drawing) return;
    event.preventDefault();
    const current = point(event);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.strokeStyle = erasing ? '#fffafc' : color;
    ctx.beginPath();
    ctx.moveTo(last.x,last.y);
    ctx.lineTo(current.x,current.y);
    ctx.stroke();
    ctx.restore();
    last = current;
  };

  const end = event => {
    if (!drawing) return;
    drawing = false;
    strokeCount += 1;
    saveState();
    updateProgress();
    maybeEncourage();
    try { canvas.releasePointerCapture?.(event.pointerId); } catch {}
  };

  canvas.addEventListener('pointerdown', begin);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', event => {
    if (event.buttons === 0) end(event);
  });

  document.getElementById('exp90Palette')?.addEventListener('click', event => {
    const button = event.target.closest('button[data-color]');
    if (!button) return;
    color = button.dataset.color;
    erasing = false;
    document.querySelectorAll('#exp90Palette button').forEach(el => el.classList.toggle('active',el===button));
    document.getElementById('exp90Brush')?.classList.add('active');
    document.getElementById('exp90Eraser')?.classList.remove('active');
  });

  document.querySelector('#exp90Palette button')?.classList.add('active');
  document.getElementById('exp90Brush')?.classList.add('active');

  document.getElementById('exp90BrushSizes')?.addEventListener('click', event => {
    const button = event.target.closest('button[data-size]');
    if (!button) return;
    size = Number(button.dataset.size);
    document.querySelectorAll('#exp90BrushSizes button').forEach(el => el.classList.toggle('active',el===button));
  });

  document.getElementById('exp90Brush')?.addEventListener('click', () => {
    erasing = false;
    document.getElementById('exp90Brush')?.classList.add('active');
    document.getElementById('exp90Eraser')?.classList.remove('active');
  });

  document.getElementById('exp90Eraser')?.addEventListener('click', () => {
    erasing = true;
    document.getElementById('exp90Eraser')?.classList.add('active');
    document.getElementById('exp90Brush')?.classList.remove('active');
  });

  document.getElementById('exp90Undo')?.addEventListener('click', async () => {
    if (undoStack.length <= 1) return;
    redoStack.push(undoStack.pop());
    await restore(undoStack[undoStack.length-1]);
  });

  document.getElementById('exp90Redo')?.addEventListener('click', async () => {
    if (!redoStack.length) return;
    const next = redoStack.pop();
    undoStack.push(next);
    await restore(next);
  });

  document.getElementById('exp90Reset')?.addEventListener('click', () => {
    if (!window.confirm('Reset this coloring page and start fresh?')) return;
    drawPage();
    undoStack = [];
    redoStack = [];
    strokeCount = 0;
    saveState();
    updateProgress();
    if (hostTitle) hostTitle.textContent = 'Fresh page, fresh start.';
    if (hostMessage) hostMessage.textContent = 'Sometimes starting over is part of making something beautiful.';
  });

  document.getElementById('exp90Download')?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `sweetville-coloring-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    celebrate('Your artwork is ready!','It downloaded as a Sweetville keepsake.');
  });

  document.getElementById('exp90SaveBrowser')?.addEventListener('click', () => {
    const item = {
      id:Date.now(),
      title:'Sweetville Cupcake Party',
      date:new Date().toLocaleDateString(),
      data:canvas.toDataURL('image/png')
    };
    gallery.unshift(item);
    gallery = gallery.slice(0,8);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery)); }
    catch {
      gallery = gallery.slice(0,3);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery)); } catch {}
    }
    if (savedCount) savedCount.textContent = String(gallery.length);
    celebrate('Saved to My Gallery','Your Sweetville artwork is waiting for you.');
  });

  document.getElementById('exp90Fullscreen')?.addEventListener('click', () => {
    wrap?.classList.toggle('exp90-expanded');
    document.body.classList.toggle('exp90-lock', wrap?.classList.contains('exp90-expanded'));
  });

  const updateProgress = () => {
    const percent = Math.min(100, Math.round(strokeCount * 6.5));
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${percent}% colored`;
    if (percent >= 100) celebrate('Sweet Creation Complete','Created together by you and Jahntella 💋');
  };

  let messageIndex = 0;
  const maybeEncourage = () => {
    if (strokeCount % 4 !== 0) return;
    const [title,message] = messages[messageIndex % messages.length];
    messageIndex += 1;
    if (hostTitle) hostTitle.textContent = title;
    if (hostMessage) hostMessage.textContent = message;
  };

  const celebrate = (title,message) => {
    if (hostTitle) hostTitle.textContent = title;
    if (hostMessage) hostMessage.textContent = message;
    wrap?.classList.add('exp90-celebrate');
    setTimeout(() => wrap?.classList.remove('exp90-celebrate'),1200);
    window.sweetvilleLaunchFireworks?.(innerWidth*.5,innerHeight*.25,18);
    window.dispatchEvent(new CustomEvent('sweetville:experience',{
      detail:{key:'coloring-studio',label:title}
    }));
  };
})();
