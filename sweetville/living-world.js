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
  syncStats(); window.addEventListener('storage',syncStats); setInterval(syncStats,1800);
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



/* SWEETVILLE EXP 3.0 — Cinematic journey */
(() => {
  const intro = document.getElementById('svCinematicIntro');
  if (!intro) return;

  const scenes = [...intro.querySelectorAll('.sv-cinema-scene')];
  const skip = document.getElementById('svCinemaSkip');
  const progress = document.getElementById('svCinemaProgress');
  const finale = intro.querySelector('.sv-cinema-finale');
  const sparkles = document.getElementById('svCinemaSparkles');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 700 : 3600;
  let index = 0;
  let timer;

  if (sparkles) {
    for (let i = 0; i < 55; i += 1) {
      const star = document.createElement('i');
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${-Math.random() * 5}s`;
      star.style.animationDuration = `${2.5 + Math.random() * 4}s`;
      sparkles.appendChild(star);
    }
  }

  const finish = () => {
    clearTimeout(timer);
    finale?.classList.add('show');
    if (progress) progress.style.width = '100%';
    window.setTimeout(() => {
      intro.classList.add('finished');
      window.sessionStorage.setItem('sweetvilleExp3Seen', '1');
    }, reduced ? 300 : 1500);
  };

  const showScene = (next) => {
    scenes.forEach((scene, i) => scene.classList.toggle('active', i === next));
    if (progress) progress.style.width = `${((next + 1) / scenes.length) * 92}%`;
    index = next;
    timer = window.setTimeout(() => {
      if (index >= scenes.length - 1) finish();
      else showScene(index + 1);
    }, duration);
  };

  skip?.addEventListener('click', finish);

  if (window.sessionStorage.getItem('sweetvilleExp3Seen') === '1') {
    intro.classList.add('finished');
  } else {
    document.body.style.overflow = 'hidden';
    showScene(0);
    intro.addEventListener('transitionend', () => {
      if (intro.classList.contains('finished')) document.body.style.overflow = '';
    }, { once: true });
  }
})();

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
