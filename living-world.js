(() => {
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];
  const home = $('#cinematicHome');
  const stars = $('#cinematicStars');
  if (stars) {
    for (let i=0;i<80;i++) {
      const star=document.createElement('i');
      star.style.left=Math.random()*100+'%'; star.style.top=Math.random()*75+'%';
      star.style.setProperty('--d',(1.5+Math.random()*4)+'s'); star.style.animationDelay=(-Math.random()*5)+'s';
      stars.append(star);
    }
  }
  const readState=()=>{try{return JSON.parse(localStorage.getItem('jahntellaSweetvilleV4'))||{}}catch{return {}}};
  const syncStats=()=>{
    const s=readState();
    const set=(sel,val)=>{const el=$(sel);if(el)el.textContent=val};
    set('#cinematicCollectibles',`${(s.collectibles||[]).length} / 5`);
    set('#cinematicQuests',`${(s.badges||[]).length} / 10`);
    set('#cinematicHearts',`${(s.hearts||[]).length} / 5`);
    set('#cinematicVisits',(s.visited||[]).length);
  };
  syncStats(); window.addEventListener('storage',syncStats); setInterval(() => { if (document.visibilityState === 'visible') syncStats(); },5000);
  $$('.district-card').forEach(card=>card.addEventListener('click',()=>{
    const slug=card.dataset.openLocation;
    if(slug){
      const target=$(`.world-location[data-location="${slug}"]`);
      $('#livingMap')?.scrollIntoView({behavior:'smooth'});
      setTimeout(()=>target?.click(),650);
    } else if(card.dataset.scrollTarget) $('#'+card.dataset.scrollTarget)?.scrollIntoView({behavior:'smooth'});
  }));
  $('#watchSweetvilleIntro')?.addEventListener('click',()=>{
    home.classList.add('intro-active');
    setTimeout(()=>home.classList.remove('intro-active'),4200);
    launchBurst(innerWidth*.68,innerHeight*.22,42);
    launchBurst(innerWidth*.82,innerHeight*.28,34);
  });

  const canvas=$('#fireworksCanvas'), ctx=canvas?.getContext('2d'); let particles=[];
  const resize=()=>{if(!canvas)return;canvas.width=canvas.clientWidth*devicePixelRatio;canvas.height=canvas.clientHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};
  resize(); addEventListener('resize',resize);
  function launchBurst(x,y,count=28){for(let i=0;i<count;i++){const a=Math.PI*2*i/count+Math.random()*.2,s=1.2+Math.random()*3.5;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,h:310+Math.random()*50})}}
  function animate(){if(!ctx)return;ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);particles=particles.filter(p=>p.life>.02);for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.018;p.vx*=.992;p.life*=.974;ctx.beginPath();ctx.arc(p.x,p.y,1.2,0,Math.PI*2);ctx.fillStyle=`hsla(${p.h},100%,70%,${p.life})`;ctx.shadowBlur=12;ctx.shadowColor=`hsl(${p.h},100%,60%)`;ctx.fill()}requestAnimationFrame(animate)}animate();
  setInterval(()=>{if(document.visibilityState==='visible'&&innerWidth>700)launchBurst(innerWidth*(.58+Math.random()*.34),80+Math.random()*220,18+Math.random()*22)},3000);
})();

// v4.0.5: connect the clean hero sound button to the existing world sound control.
// Sweetville v4.0.6 — Living World polish
(()=>{const hero=document.getElementById('cinematicHome');if(!hero||hero.dataset.polishReady==='true')return;hero.dataset.polishReady='true';const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const layer=document.createElement('div');layer.className='sv-ambient-layer';layer.setAttribute('aria-hidden','true');hero.appendChild(layer);if(!reduced){const sc=innerWidth<700?16:34;for(let i=0;i<sc;i++){const e=document.createElement('i');e.className='sv-spark';e.style.left=Math.random()*100+'%';e.style.top=(18+Math.random()*75)+'%';e.style.setProperty('--spark-size',(2+Math.random()*3)+'px');e.style.setProperty('--spark-duration',(6+Math.random()*8)+'s');e.style.setProperty('--spark-delay',(-Math.random()*12)+'s');e.style.setProperty('--spark-drift',(-35+Math.random()*70)+'px');layer.appendChild(e)}const pc=innerWidth<700?5:10;for(let i=0;i<pc;i++){const e=document.createElement('span');e.className='sv-heart-petal';e.textContent=i%3===0?'♡':'✦';e.style.left=Math.random()*100+'%';e.style.setProperty('--petal-size',(9+Math.random()*10)+'px');e.style.setProperty('--petal-duration',(10+Math.random()*10)+'s');e.style.setProperty('--petal-delay',(-Math.random()*16)+'s');e.style.setProperty('--petal-drift',(-70+Math.random()*140)+'px');layer.appendChild(e)}let raf=0;hero.addEventListener('pointermove',ev=>{if(innerWidth<900)return;cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const r=hero.getBoundingClientRect(),x=((ev.clientX-r.left)/r.width-.5)*-14,y=((ev.clientY-r.top)/r.height-.5)*-8;hero.style.setProperty('--sv-parallax-x',x.toFixed(2)+'px');hero.style.setProperty('--sv-parallax-y',y.toFixed(2)+'px')})},{passive:true});hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--sv-parallax-x','0px');hero.style.setProperty('--sv-parallax-y','0px')},{passive:true})}document.querySelectorAll('.location-card img').forEach(img=>{img.loading='lazy';img.decoding='async'})})();

// Sweetville v4.0.8 — Playable Mini Piano
(() => {
  const initializePiano = () => {
    const modal = document.getElementById('miniPianoModal');
    const piano = document.getElementById('miniPiano');
    const close = document.getElementById('miniPianoClose');
    const display = document.getElementById('pianoNoteDisplay');
    const triggers = [
      document.getElementById('heroSoundButton'),
      document.getElementById('soundToggle')
    ].filter(Boolean);

    if (!modal || !piano || modal.dataset.pianoReady === 'true') return;
    modal.dataset.pianoReady = 'true';

    const frequencies = {
      C4: 261.63, 'C#4': 277.18, D4: 293.66, 'D#4': 311.13,
      E4: 329.63, F4: 349.23, 'F#4': 369.99, G4: 392,
      'G#4': 415.30, A4: 440, 'A#4': 466.16, B4: 493.88, C5: 523.25
    };

    let audioContext;

    const openPiano = () => {
      if (typeof modal.showModal === 'function') {
        if (!modal.open) modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    };

    const closePiano = () => {
      if (typeof modal.close === 'function' && modal.open) {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    };

    const playNote = (button) => {
      const note = button.dataset.note;
      if (!frequencies[note]) return;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        if (display) display.textContent = 'AUDIO UNAVAILABLE';
        return;
      }

      audioContext ||= new AudioContextClass();
      audioContext.resume();

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequencies[note], audioContext.currentTime);

      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.28, audioContext.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.72);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.75);

      button.classList.add('active');
      if (display) display.textContent = note.replace('4', '').replace('5', ' HIGH');
      window.setTimeout(() => button.classList.remove('active'), 150);
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        openPiano();
      });
    });

    piano.querySelectorAll('.piano-key').forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        playNote(button);
      });
    });

    close?.addEventListener('click', closePiano);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closePiano();
    });

    document.addEventListener('keydown', (event) => {
      if (!modal.hasAttribute('open') || event.repeat) return;

      if (event.key === 'Escape') {
        closePiano();
        return;
      }

      const key = event.key.toLowerCase();
      const button = piano.querySelector(`[data-key="${key}"]`);
      if (button) {
        event.preventDefault();
        playNote(button);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePiano, { once: true });
  } else {
    initializePiano();
  }
})();

/* Sweetville v4.1.1 — custom district animations */
(() => {
  const cards = {
    "sparkle-lake": {
      title: "Sparkle Lake",
      image: "assets/lagoon-of-love.webp",
      classes: "live-lagoon",
      effect: '<span class="lake-moon-glow"></span><span class="lake-shimmer"></span><span class="lake-ripple lr1"></span><span class="lake-ripple lr2"></span><span class="lake-firefly lf1"></span><span class="lake-firefly lf2"></span><span class="lake-firefly lf3"></span>'
    },
    "donut-district": {
      title: "Donut District",
      image: "assets/dream-carnival.webp",
      classes: "live-donut",
      effect: '<span class="donut-sign"><i></i></span><span class="sprinkle sp1"></span><span class="sprinkle sp2"></span><span class="sprinkle sp3"></span><span class="sprinkle sp4"></span><span class="sprinkle sp5"></span><span class="sugar-glow"></span>'
    },
    "melody-studio": {
      title: "Starlight Stage",
      image: "assets/starlight-stage.webp",
      classes: "live-stage",
      effect: '<span class="live-spotlight s1"></span><span class="live-spotlight s2"></span><span class="stage-crowd-glow"></span><span class="live-confetti"></span>'
    },
    "neon-sweetheart": {
      title: "Neon Sweetheart",
      image: "assets/neon-city.webp",
      classes: "live-neon",
      effect: '<span class="neon-heart-pulse">♡</span><span class="neon-billboard"></span><span class="window-twinkle wt1"></span><span class="window-twinkle wt2"></span><span class="window-twinkle wt3"></span><span class="neon-reflection"></span>'
    },
    "pink-cafe": {
      title: "Candy Lane",
      image: "assets/candy-lane.webp",
      classes: "live-candy",
      effect: '<span class="live-candy-shimmer"></span><span class="live-candy candy1">●</span><span class="live-candy candy2">◆</span><span class="live-candy candy3">●</span><span class="candy-sign-glow"></span>'
    }
  };

  const enhance = () => {
    document.querySelectorAll('.living-map .world-location[data-location]').forEach((card) => {
      const cfg = cards[card.dataset.location];
      if (!cfg) return;
      if (card.dataset.liveReady !== 'true') {
        const text = card.innerHTML;
        card.innerHTML = `
          <span class="live-district-visual">
            <img src="${cfg.image}" alt="${cfg.title}" loading="lazy" decoding="async">
            <span class="live-district-effects" aria-hidden="true">${cfg.effect}</span>
          </span>
          <span class="live-district-copy">${text}</span>
        `;
        card.dataset.liveReady = 'true';
      } else {
        const effects = card.querySelector('.live-district-effects');
        if (effects) effects.innerHTML = cfg.effect;
      }
      card.classList.remove('live-lagoon','live-carnival','live-stage','live-neon','live-candy','live-donut');
      card.classList.add('live-district-card', cfg.classes);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance, { once: true });
  } else {
    enhance();
  }
})();



/* SWEETVILLE 5.0 — Living World patch */
(() => {
  const apply = () => {
    const lake = document.querySelector('.live-lagoon .live-district-effects');
    if (lake) {
      lake.querySelectorAll('.lake-ripple,.lr1,.lr2').forEach(el => el.remove());
      if (!lake.querySelector('.lake-water-mask')) {
        const mask = document.createElement('span');
        mask.className = 'lake-water-mask';
        [...lake.children].forEach(child => mask.appendChild(child));
        lake.appendChild(mask);
      }
    }

    const hero = document.getElementById('cinematicHome');
    if (hero && !document.getElementById('mochiGuide')) {
      const mochi = document.createElement('div');
      mochi.className = 'mochi-guide';
      mochi.id = 'mochiGuide';
      mochi.setAttribute('aria-hidden', 'true');
      mochi.innerHTML = '<span class="mochi-face">🐶</span><i></i>';
      hero.appendChild(mochi);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();




/* EXP 6.1.3: legacy cinematic controller removed; see intro-carousel.js */

/* SWEETVILLE EXP 3.1 — POLISH */
(() => {
  const removeLegacyLakeRipples = () => {
    document
      .querySelectorAll('.live-lagoon .lake-ripple,.live-lagoon .lr1,.live-lagoon .lr2,.live-lagoon [class*="ripple"]')
      .forEach((el) => el.remove());
  };

  const addSceneDrift = () => {
    document.querySelectorAll('.live-district-card').forEach((card, index) => {
      const img = card.querySelector('.live-district-visual img');
      if (!img || img.dataset.driftReady === 'true') return;
      img.dataset.driftReady = 'true';
      img.style.transformOrigin = index % 2 === 0 ? '48% 52%' : '52% 48%';
    });
  };

  const init = () => {
    removeLegacyLakeRipples();
    addSceneDrift();

    const observer = new MutationObserver(() => {
      removeLegacyLakeRipples();
      addSceneDrift();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* SWEETVILLE EXP 3.2 — LIVING WORLD */
(() => {
  const make = (parent, count, factory) => {
    if (!parent || parent.dataset.ready === 'true') return;
    parent.dataset.ready = 'true';
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement('span');
      factory(el, i);
      parent.appendChild(el);
    }
  };

  const init = () => {
    const petals = document.getElementById('exp32Petals');
    const fireflies = document.getElementById('exp32Fireflies');
    const birds = document.getElementById('exp32Birds');
    const lanterns = document.getElementById('exp32Lanterns');

    make(petals, 16, (el, i) => {
      el.textContent = i % 3 === 0 ? '✦' : '❀';
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${8 + Math.random() * 10}px`;
      el.style.animationDuration = `${10 + Math.random() * 10}s`;
      el.style.animationDelay = `${-Math.random() * 14}s`;
      el.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
    });

    make(fireflies, 12, (el) => {
      el.style.left = `${8 + Math.random() * 84}%`;
      el.style.top = `${22 + Math.random() * 68}%`;
      el.style.animationDuration = `${3.5 + Math.random() * 4}s`;
      el.style.animationDelay = `${-Math.random() * 6}s`;
    });

    make(birds, 4, (el, i) => {
      el.textContent = '⌁';
      el.style.top = `${8 + i * 5}%`;
      el.style.animationDuration = `${18 + i * 6}s`;
      el.style.animationDelay = `${-i * 7}s`;
    });

    make(lanterns, 6, (el) => {
      el.style.left = `${6 + Math.random() * 88}%`;
      el.style.animationDuration = `${18 + Math.random() * 12}s`;
      el.style.animationDelay = `${-Math.random() * 18}s`;
      el.style.setProperty('--drift', `${-40 + Math.random() * 80}px`);
    });

    // Subtle random sparkle pulse on district cards.
    const cards = [...document.querySelectorAll('.live-district-card')];
    window.setInterval(() => {
      if (!cards.length || document.visibilityState !== 'visible') return;
      const card = cards[Math.floor(Math.random() * cards.length)];
      card.animate(
        [
          { filter: 'brightness(1)' },
          { filter: 'brightness(1.08)' },
          { filter: 'brightness(1)' }
        ],
        { duration: 1600, easing: 'ease-in-out' }
      );
    }, 6500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* SWEETVILLE EXP 4.0 — JAHNTELLA LIVES HERE */
(() => {
  const districtMoments = {
    'pink-cafe': {
      place: 'Candy Lane',
      message: 'I was just picking out something sweet for Mochi.',
      hint: 'Look closely around the café. Sweet things sometimes hide little surprises.'
    },
    'melody-studio': {
      place: 'Starlight Stage',
      message: 'I come here when a new melody is trying to find me.',
      hint: 'The piano remembers every note you play.'
    },
    'donut-district': {
      place: 'Donut District',
      message: 'Mochi thinks every donut is his donut.',
      hint: 'Watch the bakery lights. One of them may sparkle differently.'
    },
    'sparkle-lake': {
      place: 'Sparkle Lake',
      message: 'This is where I slow down and listen to the water.',
      hint: 'Fireflies only reveal their secrets when the world is quiet.'
    },
    'neon-sweetheart': {
      place: 'Neon Sweetheart',
      message: 'At night, this whole city feels like one giant dream.',
      hint: 'Some neon hearts glow brighter after you visit more than once.'
    }
  };

  let toastTimer;
  let visitTimer;

  const showToast = (text) => {
    const toast = document.getElementById('exp40Toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = text;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 4200);
  };

  const showJahntella = (message) => {
    const character = document.getElementById('exp40Jahntella');
    const copy = document.getElementById('exp40JahntellaMessage');
    if (!character) return;
    if (copy && message) copy.textContent = message;
    character.classList.add('visible');
    window.setTimeout(() => character.classList.remove('visible'), 7200);
  };

  const showMochi = () => {
    const mochi = document.getElementById('exp40Mochi');
    if (!mochi) return;
    mochi.classList.add('visible');
    window.setTimeout(() => mochi.classList.remove('visible'), 6200);
  };

  const decorateCards = () => {
    document.querySelectorAll('.live-district-card[data-location]').forEach((card) => {
      if (card.dataset.exp40Ready === 'true') return;
      const moment = districtMoments[card.dataset.location];
      if (!moment) return;

      card.dataset.exp40Ready = 'true';
      const badge = document.createElement('span');
      badge.className = 'exp40-district-visit';
      badge.innerHTML = `<strong>Jahntella visits here</strong><span>Tap to discover</span>`;
      card.appendChild(badge);

      card.addEventListener('click', () => {
        showJahntella(moment.message);
        showToast(moment.hint);
        card.classList.add('exp40-active','exp40-presence-glow');
        window.setTimeout(() => card.classList.remove('exp40-presence-glow'), 3800);
      });
    });
  };

  const randomVisit = () => {
    const entries = Object.values(districtMoments);
    const moment = entries[Math.floor(Math.random() * entries.length)];
    showJahntella(`${moment.place}: ${moment.message}`);
    if (Math.random() > .55) {
      window.setTimeout(showMochi, 1200);
    }
  };

  const init = () => {
    decorateCards();

    const jahntella = document.getElementById('exp40Jahntella');
    const mochi = document.getElementById('exp40Mochi');

    jahntella?.addEventListener('click', () => {
      showToast('Jahntella left you a little sparkle. Keep exploring Sweetville.');
    });

    mochi?.addEventListener('click', () => {
      showToast('Mochi found something! Check the next district you visit for a surprise.');
      mochi.classList.remove('visible');
    });

    window.setTimeout(() => {
      showJahntella('Welcome home, Sweetie. I have been waiting for you.');
      window.setTimeout(showMochi, 1400);
    }, 2600);

    visitTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible' && !document.getElementById('svCinematicIntro')?.classList.contains('finished') === false) {
        randomVisit();
      }
    }, 28000);

    const observer = new MutationObserver(decorateCards);
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* SWEETVILLE EXP 4.1 — LIVING MAGIC */
(() => {
  const removeExp40Overlays = () => {
    document
      .querySelectorAll('.exp40-character-layer,.exp40-district-visit')
      .forEach((el) => el.remove());
  };

  const ensureAmbientUi = () => {
    if (!document.getElementById('exp41Whisper')) {
      const whisper = document.createElement('div');
      whisper.className = 'exp41-whisper';
      whisper.id = 'exp41Whisper';
      whisper.innerHTML = '<strong>Jahntella 💋</strong><span></span>';
      document.body.appendChild(whisper);
    }

    if (!document.getElementById('exp41MochiRunner')) {
      const mochi = document.createElement('div');
      mochi.className = 'exp41-mochi-runner';
      mochi.id = 'exp41MochiRunner';
      mochi.textContent = '🐶';
      document.body.appendChild(mochi);
    }

    if (!document.getElementById('exp41EventLayer')) {
      const layer = document.createElement('div');
      layer.className = 'exp41-event-layer';
      layer.id = 'exp41EventLayer';
      layer.innerHTML = '<div class="exp41-gust"></div><div class="exp41-heart-rise"></div><div class="exp41-firework"></div>';
      document.body.appendChild(layer);
    }
  };

  const whisperLines = [
    'Meet me at Sparkle Lake...',
    'I hid something sweet.',
    'Mochi found another adventure.',
    'The city glows differently when you follow your heart.',
    'Somewhere in Sweetville, a new memory is waiting.',
    'Listen closely. The next melody may already be here.'
  ];

  let whisperTimer;
  const showWhisper = () => {
    const box = document.getElementById('exp41Whisper');
    const text = box?.querySelector('span');
    if (!box || !text) return;
    text.textContent = whisperLines[Math.floor(Math.random() * whisperLines.length)];
    box.classList.add('show');
    clearTimeout(whisperTimer);
    whisperTimer = window.setTimeout(() => box.classList.remove('show'), 4200);
  };

  const runMochi = () => {
    const mochi = document.getElementById('exp41MochiRunner');
    if (!mochi || mochi.classList.contains('run')) return;
    mochi.classList.add('run');
    window.setTimeout(() => mochi.classList.remove('run'), 8200);
  };

  const blossomGust = () => {
    const host = document.querySelector('#exp41EventLayer .exp41-gust');
    if (!host) return;
    host.innerHTML = '';
    const count = innerWidth < 700 ? 12 : 24;
    for (let i = 0; i < count; i += 1) {
      const petal = document.createElement('span');
      petal.textContent = i % 3 === 0 ? '✦' : '❀';
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.fontSize = `${8 + Math.random() * 12}px`;
      petal.style.animationDuration = `${4.5 + Math.random() * 3.5}s`;
      petal.style.animationDelay = `${Math.random() * .9}s`;
      petal.style.setProperty('--drift', `${-160 + Math.random() * 320}px`);
      host.appendChild(petal);
    }
    window.setTimeout(() => { host.innerHTML = ''; }, 9000);
  };

  const floatHearts = () => {
    const host = document.querySelector('#exp41EventLayer .exp41-heart-rise');
    if (!host) return;
    host.innerHTML = '';
    for (let i = 0; i < 7; i += 1) {
      const heart = document.createElement('span');
      heart.textContent = '♡';
      heart.style.left = `${12 + Math.random() * 76}%`;
      heart.style.fontSize = `${13 + Math.random() * 12}px`;
      heart.style.animationDuration = `${4 + Math.random() * 2.5}s`;
      heart.style.animationDelay = `${Math.random() * 1.2}s`;
      heart.style.setProperty('--drift', `${-45 + Math.random() * 90}px`);
      host.appendChild(heart);
    }
    window.setTimeout(() => { host.innerHTML = ''; }, 8000);
  };

  const fireworkBurst = () => {
    const host = document.querySelector('#exp41EventLayer .exp41-firework');
    if (!host || document.documentElement.dataset.phase !== 'night') return;
    host.innerHTML = '';
    const x = innerWidth * (.58 + Math.random() * .28);
    const y = 80 + Math.random() * 180;
    const count = innerWidth < 700 ? 16 : 28;
    for (let i = 0; i < count; i += 1) {
      const spark = document.createElement('span');
      const angle = (Math.PI * 2 * i) / count;
      const distance = 45 + Math.random() * 85;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      spark.style.animationDelay = `${Math.random() * .12}s`;
      host.appendChild(spark);
    }
    window.setTimeout(() => { host.innerHTML = ''; }, 1900);
  };

  const init = () => {
    removeExp40Overlays();
    ensureAmbientUi();

    const observer = new MutationObserver(removeExp40Overlays);
    observer.observe(document.body, { childList: true, subtree: true });

    window.setTimeout(showWhisper, 9000);
    window.setTimeout(blossomGust, 15000);
    window.setTimeout(runMochi, 26000);

    window.setInterval(() => {
      if (document.visibilityState === 'visible') showWhisper();
    }, 58000);

    window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        Math.random() > .5 ? blossomGust() : floatHearts();
      }
    }, 76000);

    window.setInterval(() => {
      if (document.visibilityState === 'visible') runMochi();
    }, 125000);

    window.setInterval(() => {
      if (document.visibilityState === 'visible') fireworkBurst();
    }, 98000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* SWEETVILLE EXP 5.0 — STORY MODE */
(() => {
  const chapters = [
    {
      label:'CHAPTER ONE',
      title:'The Missing Sparkle',
      text:'A tiny light has disappeared from the Sweetville gates. Mochi thinks it left a trail.',
      objective:'Visit any open district and find the first clue.',
      hint:'Start with the district that feels brightest to you.',
      icon:'✨',
      image:'assets/exp3/01-opening-gates.webp'
    },
    {
      label:'CHAPTER TWO',
      title:'A Note by the Lake',
      text:'A folded pink note is drifting near Sparkle Lake. The words only appear beneath the moonlight.',
      objective:'Open Sparkle Lake and discover the hidden message.',
      hint:'The fireflies gather near important memories.',
      icon:'💌',
      image:'assets/exp3/04-sparkle-lake.webp'
    },
    {
      label:'CHAPTER THREE',
      title:'The Melody Key',
      text:'Jahntella left a melody unfinished. The missing note may unlock the next memory.',
      objective:'Open the Mini Piano and play any three notes.',
      hint:'There is no wrong melody. Begin with the note that feels happiest.',
      icon:'🎹',
      image:'assets/exp3/07-starlight-stage.webp'
    },
    {
      label:'CHAPTER FOUR',
      title:"Mochi's Sweet Trail",
      text:'Mochi raced through Candy Lane and left a sparkling trail behind him.',
      objective:'Visit Candy Lane and follow Mochi’s trail.',
      hint:'He always stops wherever something smells sweet.',
      icon:'🐾',
      image:'assets/exp3/06-candy-lane.webp'
    },
    {
      label:'FINAL CHAPTER',
      title:'Welcome Home',
      text:'Every clue points toward one final place—the cottage where Sweetville keeps its happiest memories.',
      objective:'Complete this chapter to restore the missing sparkle.',
      hint:'Home is not only a place. It is the feeling you carried through every chapter.',
      icon:'♡',
      image:'assets/exp3/10-welcome-home.webp'
    }
  ];

  const key = 'sweetvilleExp50Story';
  let state;
  try {
    state = JSON.parse(localStorage.getItem(key)) || { completed: [], active: 0 };
  } catch {
    state = { completed: [], active: 0 };
  }

  const save = () => localStorage.setItem(key, JSON.stringify(state));
  const $ = (id) => document.getElementById(id);

  const art = $('exp50StoryArt');
  const icon = $('exp50StoryIcon');
  const label = $('exp50StoryLabel');
  const title = $('exp50StoryTitle');
  const text = $('exp50StoryText');
  const objective = $('exp50Objective');
  const stars = $('exp50Stars');
  const bar = $('exp50ProgressBar');
  const finale = $('exp50Finale');
  const begin = $('exp50BeginChapter');

  const burst = () => {
    const host = document.createElement('div');
    host.className = 'exp50-story-burst';
    for (let i = 0; i < 30; i += 1) {
      const particle = document.createElement('span');
      particle.textContent = i % 3 === 0 ? '♡' : '✦';
      const angle = (Math.PI * 2 * i) / 30;
      const distance = 70 + Math.random() * 170;
      particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      particle.style.animationDelay = `${Math.random() * .15}s`;
      host.appendChild(particle);
    }
    document.body.appendChild(host);
    window.setTimeout(() => host.remove(), 1900);
  };

  const updateProgress = () => {
    const count = state.completed.length;
    if (stars) stars.textContent = count;
    if (bar) bar.style.width = `${(count / chapters.length) * 100}%`;

    document.querySelectorAll('.exp50-chapter').forEach((button, index) => {
      button.classList.toggle('active', index === state.active);
      button.classList.toggle('completed', state.completed.includes(index));
      const badge = button.querySelector('span');
      if (badge) badge.textContent = state.completed.includes(index) ? '✓' : String(index + 1);
    });

    if (finale) finale.hidden = count !== chapters.length;
  };

  const render = (index) => {
    state.active = index;
    save();
    const chapter = chapters[index];
    if (!chapter) return;

    if (label) label.textContent = chapter.label;
    if (title) title.textContent = chapter.title;
    if (text) text.textContent = chapter.text;
    if (objective) objective.textContent = chapter.objective;
    if (icon) icon.textContent = chapter.icon;
    if (art) art.style.backgroundImage = `linear-gradient(rgba(8,0,12,.2),rgba(8,0,12,.7)),url("${chapter.image}")`;
    if (begin) begin.textContent = state.completed.includes(index) ? 'Chapter Complete ✓' : 'Begin Chapter';

    updateProgress();
  };

  const completeActiveChapter = () => {
    const index = state.active;
    if (!state.completed.includes(index)) {
      state.completed.push(index);
      state.completed.sort((a,b) => a - b);
      burst();
    }

    save();
    updateProgress();

    if (state.completed.length < chapters.length) {
      const next = chapters.findIndex((_, i) => !state.completed.includes(i));
      window.setTimeout(() => render(next), 900);
    } else {
      if (finale) {
        finale.hidden = false;
        finale.scrollIntoView({ behavior:'smooth', block:'center' });
      }
    }
  };

  const storyStarted = () => {
    const chapter = chapters[state.active];
    const existing = document.querySelector('.exp41-whisper');
    if (existing) {
      const copy = existing.querySelector('span');
      if (copy) copy.textContent = `Story Mode: ${chapter.objective}`;
      existing.classList.add('show');
      window.setTimeout(() => existing.classList.remove('show'), 4200);
    }

    // This first version treats each chapter as a guided story moment.
    // Completion happens after the visitor starts the moment, preserving
    // all existing district interactions without changing their code.
    window.setTimeout(completeActiveChapter, 1100);
  };

  const init = () => {
    document.querySelectorAll('.exp50-chapter').forEach((button) => {
      button.addEventListener('click', () => render(Number(button.dataset.chapter)));
    });

    begin?.addEventListener('click', storyStarted);

    $('exp50StoryHint')?.addEventListener('click', () => {
      const chapter = chapters[state.active];
      const whisper = document.querySelector('.exp41-whisper');
      if (whisper) {
        const copy = whisper.querySelector('span');
        if (copy) copy.textContent = `Mochi's hint: ${chapter.hint}`;
        whisper.classList.add('show');
        window.setTimeout(() => whisper.classList.remove('show'), 4600);
      }
    });

    $('exp50ReplayStory')?.addEventListener('click', () => {
      state = { completed: [], active: 0 };
      save();
      if (finale) finale.hidden = true;
      render(0);
      $('exp50Story')?.scrollIntoView({ behavior:'smooth', block:'start' });
    });

    render(Math.min(Math.max(state.active || 0, 0), chapters.length - 1));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();

/* SWEETVILLE EXP 5.1 — GUARANTEED SCROLL UNLOCK */
(() => {
  const html = document.documentElement;
  const body = document.body;
  const intro = document.getElementById('svCinematicIntro');
  const skip = document.getElementById('svCinemaSkip');
  const gateButton = document.getElementById('openGates');
  let safetyTimer;

  const lockScroll = () => {
    html.classList.add('sv-scroll-locked');
    body.classList.add('sv-scroll-locked');
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    clearTimeout(safetyTimer);
    html.classList.remove('sv-scroll-locked');
    body.classList.remove('sv-scroll-locked');
    html.style.removeProperty('overflow');
    body.style.removeProperty('overflow');
    body.style.removeProperty('height');
    html.style.removeProperty('height');
  };

  const finishIntroNow = () => {
    if (intro) {
      intro.classList.add('finished');
      intro.setAttribute('aria-hidden', 'true');
    }
    unlockScroll();
  };

  // Replace the fragile transitionend-based behavior with a direct lock.
  if (intro && !intro.classList.contains('finished')) {
    lockScroll();
  } else {
    unlockScroll();
  }

  skip?.addEventListener('click', () => {
    window.setTimeout(finishIntroNow, 0);
  }, { capture:true });

  gateButton?.addEventListener('click', () => {
    window.setTimeout(unlockScroll, 1200);
  }, { capture:true });

  // Watch the intro's finished class and unlock immediately.
  if (intro) {
    const observer = new MutationObserver(() => {
      if (intro.classList.contains('finished')) {
        unlockScroll();
        observer.disconnect();
      }
    });
    observer.observe(intro, { attributes:true, attributeFilter:['class'] });
  }

  // Safety unlock in case any older script fails.
  safetyTimer = window.setTimeout(unlockScroll, 45000);

  // Browsers may restore the page from cache with old inline styles.
  window.addEventListener('pageshow', () => {
    if (!intro || intro.classList.contains('finished')) unlockScroll();
  });

  window.addEventListener('beforeunload', unlockScroll);

  // Expose a safe manual unlock for debugging.
  window.sweetvilleUnlockScroll = unlockScroll;
})();


/* SWEETVILLE EXP 5.5 — STORYBOOK EDITION */
(() => {
  const rewards=['Opening Gates Wallpaper','Letter from Sparkle Lake','Starlight Melody Memory','Mochi Sweet Trail Badge','Sweetville Founder Badge'];
  const dialogue=['Something is missing from the gates...','Mochi found a note near the water.','Listen carefully. The melody remembers the way.','He ran this way—follow the sparkle trail!','You made it. Sweetville remembers you now.'];
  const book=document.querySelector('.exp55-storybook');
  const dialogueText=document.getElementById('exp55DialogueText');
  const rewardCard=document.getElementById('exp55RewardCard');
  const rewardName=document.getElementById('exp55RewardName');
  const starDisplay=document.getElementById('exp55StarDisplay');
  const finale=document.getElementById('exp50Finale');
  const readState=()=>{try{return JSON.parse(localStorage.getItem('sweetvilleExp50Story'))||{completed:[],active:0}}catch{return{completed:[],active:0}}};
  const animateBook=()=>{if(!book)return;book.classList.remove('page-turn');void book.offsetWidth;book.classList.add('page-turn')};
  const sync=()=>{const state=readState(),active=Math.min(Math.max(state.active||0,0),4),completed=Array.isArray(state.completed)?state.completed:[];if(dialogueText)dialogueText.textContent=dialogue[active];if(starDisplay)starDisplay.textContent=Array.from({length:5},(_,i)=>completed.includes(i)?'★':'☆').join('');if(rewardName&&rewardCard){if(completed.includes(active)){rewardName.textContent=rewards[active];rewardCard.classList.add('unlocked')}else{rewardName.textContent='Complete this chapter to unlock';rewardCard.classList.remove('unlocked')}}};
  document.querySelectorAll('.exp50-chapter').forEach(button=>button.addEventListener('click',()=>{animateBook();setTimeout(sync,120)}));
  document.getElementById('exp50BeginChapter')?.addEventListener('click',()=>setTimeout(sync,1300));
  document.getElementById('exp50ReplayStory')?.addEventListener('click',()=>setTimeout(sync,200));
  if(finale)new MutationObserver(sync).observe(finale,{attributes:true,attributeFilter:['hidden']});
  addEventListener('storage',sync);setInterval(() => { if (document.visibilityState === 'visible') sync(); },4000);sync();
})();

/* SWEETVILLE EXP 6.0 — PASSPORT EDITION */
(() => {
  const storageKey = 'sweetvilleExp60Passport';
  const legacyKey = 'jahntellaSweetvilleV4';

  const districts = [
    { slug:'pink-cafe', name:'Candy Lane', icon:'🍬' },
    { slug:'melody-studio', name:'Starlight Stage', icon:'🎵' },
    { slug:'donut-district', name:'Donut District', icon:'🍩' },
    { slug:'sparkle-lake', name:'Sparkle Lake', icon:'✨' },
    { slug:'neon-sweetheart', name:'Neon Sweetheart', icon:'💖' }
  ];

  const stickers = [
    { id:'first-step', name:'First Step', icon:'👣', test:s => s.history.length >= 1 },
    { id:'three-districts', name:'World Wanderer', icon:'🗺️', test:s => s.visited.length >= 3 },
    { id:'all-districts', name:'Sweetville Explorer', icon:'🏆', test:s => s.visited.length >= 5 },
    { id:'story-memory', name:'Story Keeper', icon:'📖', test:() => {
      try {
        const story = JSON.parse(localStorage.getItem('sweetvilleExp50Story')) || {};
        return Array.isArray(story.completed) && story.completed.length >= 5;
      } catch {
        return false;
      }
    }},
    { id:'returning-sweetie', name:'Returning Sweetie', icon:'💌', test:s => s.totalVisits >= 2 }
  ];

  const nowDate = () => new Date().toISOString();

  const createDefault = () => ({
    passportNumber: String(Math.floor(100000 + Math.random() * 900000)),
    firstVisit: nowDate(),
    totalVisits: 1,
    sessionMarked: false,
    visited: [],
    history: []
  });

  const read = () => {
    try {
      return { ...createDefault(), ...(JSON.parse(localStorage.getItem(storageKey)) || {}) };
    } catch {
      return createDefault();
    }
  };

  let state = read();

  const save = () => localStorage.setItem(storageKey, JSON.stringify(state));

  const mergeLegacyState = () => {
    try {
      const legacy = JSON.parse(localStorage.getItem(legacyKey)) || {};
      const visited = Array.isArray(legacy.visited) ? legacy.visited : [];
      visited.forEach(slug => {
        if (districts.some(d => d.slug === slug) && !state.visited.includes(slug)) {
          state.visited.push(slug);
        }
      });
    } catch {}
  };

  const markSessionVisit = () => {
    const sessionKey = 'sweetvilleExp60Session';
    if (!sessionStorage.getItem(sessionKey)) {
      if (state.sessionMarked) {
        state.totalVisits = Math.max(1, Number(state.totalVisits || 1) + 1);
      }
      state.sessionMarked = true;
      sessionStorage.setItem(sessionKey, '1');
    }
  };

  const formatDate = (value, includeTime = false) => {
    try {
      const date = new Date(value);
      return date.toLocaleString(undefined, includeTime
        ? { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' }
        : { month:'short', day:'numeric', year:'numeric' });
    } catch {
      return 'Today';
    }
  };

  const rankFromCount = count => {
    if (count >= 5) return 'Sweetville Explorer';
    if (count >= 4) return 'World Wanderer';
    if (count >= 2) return 'Sweetie Traveler';
    if (count >= 1) return 'New Explorer';
    return 'New Arrival';
  };

  const celebration = (district) => {
    let box = document.getElementById('exp60StampCelebration');
    if (!box) {
      box = document.createElement('div');
      box.className = 'exp60-stamp-celebration';
      box.id = 'exp60StampCelebration';
      document.body.appendChild(box);
    }
    box.textContent = `${district.icon} ${district.name} stamp added!`;
    box.classList.remove('show');
    void box.offsetWidth;
    box.classList.add('show');
  };

  const addVisit = slug => {
    const district = districts.find(d => d.slug === slug);
    if (!district) return;

    const isNew = !state.visited.includes(slug);
    if (isNew) state.visited.push(slug);

    state.history.unshift({
      slug,
      name: district.name,
      icon: district.icon,
      visitedAt: nowDate()
    });

    state.history = state.history.slice(0, 12);
    save();
    render();

    if (isNew) celebration(district);
  };

  const render = () => {
    const count = state.visited.length;
    const percent = Math.round((count / districts.length) * 100);

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    set('exp60PassportNumber', state.passportNumber);
    set('exp60ExplorerRank', rankFromCount(count));
    set('exp60FirstVisit', formatDate(state.firstVisit));
    set('exp60TotalVisits', String(state.totalVisits || 1));
    set('exp60DistrictCount', `${count} / ${districts.length}`);
    set('exp60Exploration', `${percent}%`);
    set('exp60ProgressLabel', `${percent}%`);

    const progress = document.getElementById('exp60ProgressBar');
    if (progress) progress.style.width = `${percent}%`;

    const stampGrid = document.getElementById('exp60StampGrid');
    if (stampGrid) {
      stampGrid.innerHTML = '';
      districts.forEach((district, index) => {
        const unlocked = state.visited.includes(district.slug);
        const stamp = document.createElement('article');
        stamp.className = `exp60-stamp${unlocked ? ' unlocked' : ''}`;
        stamp.style.setProperty('--stamp-rotation', `${index % 2 ? 3 : -3}deg`);
        stamp.innerHTML = `
          <span>${unlocked ? district.icon : '♡'}</span>
          <strong>${district.name}</strong>
          <small>${unlocked ? 'STAMPED' : 'NOT VISITED'}</small>
        `;
        stampGrid.appendChild(stamp);
      });
    }

    const stickerGrid = document.getElementById('exp60StickerGrid');
    if (stickerGrid) {
      stickerGrid.innerHTML = '';
      stickers.forEach(sticker => {
        const unlocked = Boolean(sticker.test(state));
        const card = document.createElement('article');
        card.className = `exp60-sticker${unlocked ? '' : ' locked'}`;
        card.innerHTML = `
          <span>${unlocked ? sticker.icon : '🔒'}</span>
          <strong>${unlocked ? sticker.name : 'Locked Sticker'}</strong>
          <small>${unlocked ? 'UNLOCKED' : 'KEEP EXPLORING'}</small>
        `;
        stickerGrid.appendChild(card);
      });
    }

    const historyList = document.getElementById('exp60HistoryList');
    if (historyList) {
      historyList.innerHTML = '';
      if (!state.history.length) {
        historyList.innerHTML = '<div class="exp60-empty-history">Visit a district to begin your passport history.</div>';
      } else {
        state.history.slice(0, 8).forEach(item => {
          const row = document.createElement('article');
          row.className = 'exp60-history-item';
          row.innerHTML = `
            <span>${item.icon}</span>
            <div>
              <strong>${item.name}</strong>
              <small>District visit recorded</small>
            </div>
            <time>${formatDate(item.visitedAt, true)}</time>
          `;
          historyList.appendChild(row);
        });
      }
    }
  };

  const attachDistrictListeners = () => {
    document.querySelectorAll('[data-location]').forEach(card => {
      if (card.dataset.exp60PassportReady === 'true') return;
      const slug = card.dataset.location;
      if (!districts.some(d => d.slug === slug)) return;
      card.dataset.exp60PassportReady = 'true';
      card.addEventListener('click', () => addVisit(slug));
    });
  };

  const init = () => {
    mergeLegacyState();
    markSessionVisit();
    save();
    render();
    attachDistrictListeners();

    const observer = new MutationObserver(attachDistrictListeners);
    observer.observe(document.body, { childList:true, subtree:true });

    document.getElementById('exp60ResetPassport')?.addEventListener('click', () => {
      const confirmed = window.confirm('Reset all Sweetville Passport progress?');
      if (!confirmed) return;
      state = createDefault();
      save();
      render();
    });

    window.addEventListener('storage', render);
    window.setInterval(render, 2500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
\n/* SWEETVILLE EXP 6.1 — COLLECTION SYNC REPAIR */
(() => {
  const KEY='jahntellaSweetvilleV4';
  const locations=[
    {slug:'neon-sweetheart',title:'Neon Sweetheart',icon:'💄',name:'Pink Lipstick',letter:'The Night I Chose to Glow'},
    {slug:'donut-district',title:'Donut District',icon:'🍭',name:'Fun Dipp Candy',letter:'Permission to Choose Joy'},
    {slug:'melody-studio',title:'Melody Studio',icon:'🎵',name:'Sweetville Vinyl',letter:'Before the First Chorus'},
    {slug:'sparkle-lake',title:'Sparkle Lake',icon:'🎀',name:'Moonlight Bow',letter:'A Quiet Place to Begin Again'},
    {slug:'pink-cafe',title:'Pink Café',icon:'👑',name:'Café Crown',letter:'Your New Morning'}
  ];
  const blank=()=>({visited:[],hearts:[],letters:[],collectibles:[],badges:[]});
  const read=()=>{try{return {...blank(),...(JSON.parse(localStorage.getItem(KEY))||{})}}catch{return blank()}};
  let state=read(); let active=sessionStorage.getItem('sweetvilleActiveDistrict')||'';
  const norm=()=>['visited','hearts','letters','collectibles','badges'].forEach(k=>state[k]=[...new Set(Array.isArray(state[k])?state[k]:[])]);
  const save=()=>{norm();localStorage.setItem(KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('sweetville:statechange'))};
  const id=x=>document.getElementById(x);
  const set=(x,v)=>{const e=id(x);if(e)e.textContent=v};
  let tt; const toast=t=>{let e=id('svSyncToast');if(!e){e=document.createElement('div');e.id='svSyncToast';e.className='sv-sync-toast';document.body.appendChild(e)}clearTimeout(tt);e.textContent=t;e.classList.add('show');tt=setTimeout(()=>e.classList.remove('show'),2400)};
  const activeSlug=()=>{if(locations.some(l=>l.slug===active))return active;const t=id('modalTitle')?.textContent||'';return locations.find(l=>t.includes(l.title))?.slug||''};
  const badges=()=>{const r=[['first-visit',state.visited.length>=1],['three-districts',state.visited.length>=3],['all-districts',state.visited.length>=5],['first-heart',state.hearts.length>=1],['all-hearts',state.hearts.length>=5],['first-letter',state.letters.length>=1],['all-letters',state.letters.length>=5],['first-collectible',state.collectibles.length>=1],['all-collectibles',state.collectibles.length>=5],['super-sweetie',state.visited.length>=5&&state.hearts.length>=5&&state.letters.length>=5&&state.collectibles.length>=5]];r.forEach(([b,p])=>{if(p&&!state.badges.includes(b))state.badges.push(b)})};
  const render=()=>{
    norm(); badges(); save();
    set('cinematicCollectibles',`${state.collectibles.length} / 5`);set('cinematicHearts',`${state.hearts.length} / 5`);set('cinematicVisits',state.visited.length);set('cinematicQuests',`${state.badges.length} / 10`);
    set('letterCount',state.letters.length);set('collectibleCount',state.collectibles.length);set('heartCount',state.hearts.length);set('visitedCount',state.visited.length);set('badgeCount',state.badges.length);set('roomStampCount',`${state.visited.length} STAMP${state.visited.length===1?'':'S'}`);
    const cb=id('collectionBar');if(cb)cb.style.width=`${state.collectibles.length*20}%`;
    const pb=id('passportBar');if(pb)pb.style.width=`${state.visited.length*20}%`;
    const ep=id('exp60ProgressBar');if(ep)ep.style.width=`${state.visited.length*20}%`;set('exp60DistrictCount',`${state.visited.length} / 5`);set('exp60Exploration',`${state.visited.length*20}%`);set('exp60ProgressLabel',`${state.visited.length*20}%`);
    const lg=id('lettersGrid');if(lg)lg.innerHTML=locations.map(l=>{const f=state.letters.includes(l.slug);return `<article class="letter-card ${f?'':'locked'}"><button data-letter="${l.slug}" ${f?'':'disabled'}><span class="envelope">${f?'💌':'✉️'}</span><strong>${f?l.letter:'Hidden Letter'}</strong><small>${f?l.title:'Find this inside a district'}</small></button></article>`}).join('');
    const sh=id('collectibleShelf');if(sh)sh.innerHTML=locations.map(l=>{const f=state.collectibles.includes(l.slug);return `<article class="collectible-slot ${f?'':'locked'}"><div><span class="item">${f?l.icon:'?'}</span><strong>${f?l.name:'Mystery Treasure'}</strong><small>${f?l.title:'Still hidden'}</small></div></article>`}).join('');
    const rs=id('roomShelf');if(rs)rs.innerHTML=locations.filter(l=>state.collectibles.includes(l.slug)).map(l=>`<span class="room-item" title="${l.name}">${l.icon}</span>`).join('');
    const rn=id('roomNote');if(rn)rn.textContent=state.collectibles.length?`${state.collectibles.length} treasure${state.collectibles.length===1?'':'s'} now live in your room.`:'Keep exploring to make this room your own.';
  };
  document.addEventListener('click',e=>{const c=e.target.closest('[data-location]');if(!c)return;const s=c.dataset.location;if(!locations.some(l=>l.slug===s))return;active=s;sessionStorage.setItem('sweetvilleActiveDistrict',s);if(!state.visited.includes(s))state.visited.push(s);render()},true);
  document.addEventListener('click',e=>{const t=e.target.closest('#hiddenHeart,#hiddenLetter,#hiddenCollectible');if(!t)return;setTimeout(()=>{state=read();const s=activeSlug();if(!s)return;if(!state.visited.includes(s))state.visited.push(s);let k,msg;if(t.id==='hiddenHeart'){k='hearts';msg='Hidden heart added!'}else if(t.id==='hiddenLetter'){k='letters';msg='Letter added to your Pink Mailbox!'}else{k='collectibles';msg='Treasure added to your collection and Sweetie Room!'}const fresh=!state[k].includes(s);if(fresh)state[k].push(s);render();if(fresh)toast(msg)},60)},true);
  window.addEventListener('storage',()=>{state=read();render()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();

/* SWEETVILLE EXP 6.1.1 — INTRO RECOVERY */
(() => {
  const intro = document.getElementById('svCinematicIntro');
  const skip = document.getElementById('svCinemaSkip');

  const unlock = () => {
    document.documentElement.classList.remove('sv-scroll-locked');
    document.body.classList.remove('sv-scroll-locked');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('height');
    document.body.style.removeProperty('height');
  };

  const finish = () => {
    if (intro) {
      intro.classList.add('finished');
      intro.setAttribute('aria-hidden', 'true');
      intro.style.pointerEvents = 'none';
    }
    unlock();
  };

  skip?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    finish();
  }, { capture: true });

  if (intro) {
    const observer = new MutationObserver(() => {
      if (intro.classList.contains('finished')) {
        unlock();
        observer.disconnect();
      }
    });
    observer.observe(intro, { attributes: true, attributeFilter: ['class'] });
  }

  // Never allow a cinematic regression to trap a visitor.
  window.setTimeout(unlock, 42000);
  window.sweetvilleEmergencyIntroExit = finish;
})();
