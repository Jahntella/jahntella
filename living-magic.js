/* SWEETVILLE EXP 7.0 — LIVING MAGIC ENGINE */
(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const gateScreen = document.getElementById('gateScreen');
  const openGates = document.getElementById('openGates');
  const worldLife = document.getElementById('exp32WorldLife');
  const petals = document.getElementById('exp32Petals');
  const fireflies = document.getElementById('exp32Fireflies');
  const birds = document.getElementById('exp32Birds');
  const lanterns = document.getElementById('exp32Lanterns');
  const ambientLife = document.getElementById('ambientLife');
  const hero = document.getElementById('cinematicHome');

  let active = false;
  let fireworksTimer = 0;

  const ensureCanvas = () => {
    let canvas = document.getElementById('svLivingFireworks');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'svLivingFireworks';
      canvas.className = 'sv-living-fireworks';
      canvas.setAttribute('aria-hidden', 'true');
      body.appendChild(canvas);
    }
    return canvas;
  };

  const createMany = (container, count, className, content='') => {
    if (!container || container.dataset.engineReady === 'true') return;
    container.dataset.engineReady = 'true';
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const el = document.createElement('i');
      el.className = className;
      el.textContent = content;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.setProperty('--delay', `${-Math.random() * 18}s`);
      el.style.setProperty('--duration', `${7 + Math.random() * 14}s`);
      el.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
      frag.appendChild(el);
    }

    container.appendChild(frag);
  };

  const initAmbient = () => {
    if (active) return;
    active = true;

    root.classList.add('sv-world-awake');
    body.classList.add('sv-world-awake');
    worldLife?.classList.add('active');
    ambientLife?.classList.add('active');
    hero?.classList.add('world-awake');

    createMany(fireflies, innerWidth < 700 ? 22 : 46, 'exp70-firefly');
    createMany(petals, innerWidth < 700 ? 12 : 24, 'exp70-petal', '♡');
    createMany(birds, innerWidth < 700 ? 3 : 6, 'exp70-bird', '⌁');
    createMany(lanterns, innerWidth < 700 ? 5 : 10, 'exp70-lantern', '✦');

    const canvas = ensureCanvas();
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = innerWidth * ratio;
      canvas.height = innerHeight * ratio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(ratio,0,0,ratio,0,0);
    };

    const burst = (x = innerWidth * (.25 + Math.random() * .5), y = 90 + Math.random() * 220, count = 28) => {
      for (let i = 0; i < count; i += 1) {
        const angle = Math.PI * 2 * i / count + Math.random() * .2;
        const speed = 1.3 + Math.random() * 3.8;
        particles.push({
          x,y,
          vx:Math.cos(angle)*speed,
          vy:Math.sin(angle)*speed,
          life:1,
          size:1 + Math.random()*1.8,
          hue:300 + Math.random()*70
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0,0,innerWidth,innerHeight);
      particles = particles.filter(p => p.life > .03);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += .018;
        p.vx *= .992;
        p.life *= .974;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},100%,72%,${p.life})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `hsla(${p.hue},100%,60%,${p.life})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    resize();
    addEventListener('resize', resize);
    draw();

    burst(innerWidth*.28, innerHeight*.22, 38);
    burst(innerWidth*.72, innerHeight*.18, 34);

    const scheduleFireworks = () => {
      clearTimeout(fireworksTimer);
      fireworksTimer = setTimeout(() => {
        if (document.visibilityState === 'visible' && active) {
          burst(undefined, undefined, 24 + Math.floor(Math.random()*18));
          if (Math.random() > .45) {
            setTimeout(() => burst(undefined, undefined, 18 + Math.floor(Math.random()*16)), 700);
          }
        }
        scheduleFireworks();
      }, 15000 + Math.random()*10000);
    };

    scheduleFireworks();
    window.sweetvilleLaunchFireworks = burst;
  };

  const gateIsOpen = () => {
    return gateScreen?.classList.contains('open') ||
      gateScreen?.classList.contains('opened') ||
      gateScreen?.classList.contains('gone') ||
      gateScreen?.getAttribute('aria-hidden') === 'true' ||
      gateScreen?.style.display === 'none';
  };

  openGates?.addEventListener('click', () => {
    setTimeout(initAmbient, 850);
  }, { capture:true });

  if (gateScreen) {
    const observer = new MutationObserver(() => {
      if (gateIsOpen()) initAmbient();
    });
    observer.observe(gateScreen, { attributes:true, attributeFilter:['class','style','aria-hidden'] });
  }

  window.addEventListener('sweetville:gates-open', initAmbient);
  window.addEventListener('pageshow', () => {
    if (gateIsOpen()) initAmbient();
  });

  setTimeout(() => {
    if (gateIsOpen()) initAmbient();
  }, 1800);
})();
