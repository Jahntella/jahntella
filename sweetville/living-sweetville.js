/* SWEETVILLE EXP 15 — LIVING SWEETVILLE */
(() => {
  'use strict';

  const nav = document.getElementById('svNav');
  const menuButton = document.getElementById('menuButton');
  const navClose = document.getElementById('svNavClose');

  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded','false');
    document.body.classList.remove('sv-menu-open');
    document.documentElement.classList.remove('sv-menu-open');
  };

  const openMenu = () => {
    nav?.classList.add('open');
    menuButton?.setAttribute('aria-expanded','true');
    document.body.classList.add('sv-menu-open');
    document.documentElement.classList.add('sv-menu-open');
  };

  menuButton?.addEventListener('click', () => {
    nav?.classList.contains('open') ? closeMenu() : openMenu();
  }, {capture:true});

  navClose?.addEventListener('click', closeMenu);
  nav?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!nav?.classList.contains('open')) return;
    if (event.target.closest('#svNav') || event.target.closest('#menuButton')) return;
    closeMenu();
  });

  let touchStartY = null;
  nav?.addEventListener('touchstart', event => {
    touchStartY = event.touches?.[0]?.clientY ?? null;
  }, {passive:true});
  nav?.addEventListener('touchend', event => {
    if (touchStartY == null) return;
    const endY = event.changedTouches?.[0]?.clientY ?? touchStartY;
    if (endY - touchStartY > 70) closeMenu();
    touchStartY = null;
  }, {passive:true});

  const worldLayer = document.createElement('div');
  worldLayer.className = 'exp150-world-layer';
  worldLayer.innerHTML = `
    <div class="exp150-petals"></div>
    <div class="exp150-fireflies"></div>
    <div class="exp150-balloons"></div>
    <div class="exp150-mochi" id="exp150Mochi" aria-label="Mochi">🐶</div>
  `;
  document.body.appendChild(worldLayer);

  const petals = worldLayer.querySelector('.exp150-petals');
  const fireflies = worldLayer.querySelector('.exp150-fireflies');
  const balloons = worldLayer.querySelector('.exp150-balloons');
  const mochi = document.getElementById('exp150Mochi');

  const createParticles = (container, count, symbol='•') => {
    if (!container) return;
    container.innerHTML = '';
    for (let i=0;i<count;i++) {
      const span = document.createElement('span');
      span.textContent = symbol;
      span.style.setProperty('--x', `${Math.random()*100}%`);
      span.style.setProperty('--delay', `${Math.random()*8}s`);
      span.style.setProperty('--duration', `${7+Math.random()*10}s`);
      span.style.setProperty('--size', `${8+Math.random()*12}px`);
      container.appendChild(span);
    }
  };

  const now = new Date();
  const hour = now.getHours();
  const phase = hour < 6 ? 'late-night' : hour < 11 ? 'morning' : hour < 17 ? 'afternoon' : hour < 20 ? 'golden-hour' : 'night';
  document.documentElement.dataset.exp150Phase = phase;

  if (phase === 'morning' || phase === 'afternoon') {
    createParticles(petals, 10, '🌸');
    createParticles(balloons, 4, '🎈');
  } else {
    createParticles(fireflies, 16, '•');
  }

  const weatherMap = {
    'late-night':['Moonlit Quiet','The streets are calm and the stars are doing most of the talking.'],
    'morning':['Soft Morning Breeze','Petals are drifting through the bright streets of Sweetville.'],
    'afternoon':['Bright Sweetville Day','Clouds are moving slowly and the districts feel full of energy.'],
    'golden-hour':['Golden Hour Glow','The lights are warming up and every window looks softer.'],
    'night':['Neon Night','Lanterns, fireflies, and castle lights are glowing across the world.']
  };
  const [weatherTitle, weatherText] = weatherMap[phase];
  document.getElementById('exp150WeatherTitle').textContent = weatherTitle;
  document.getElementById('exp150WeatherText').textContent = weatherText;
  document.getElementById('exp150AmbienceTitle').textContent =
    phase === 'morning' ? 'Morning garden' :
    phase === 'afternoon' ? 'District energy' :
    phase === 'golden-hour' ? 'Golden piano' : 'Evening piano';

  const events = [
    ['The lanterns are glowing tonight.','Every path feels warmer after sunset.'],
    ['A balloon festival is drifting through Sweetville.','Look up — the sky is carrying something sweet.'],
    ['The castle windows are sparkling brighter today.','Someone inside is celebrating.'],
    ['Mochi found a flower and refuses to say where.','He looks very proud of himself.'],
    ['Pink fireworks are scheduled over Sparkle Lake.','The first burst begins after dark.'],
    ['The cafés are serving a surprise dessert today.','No one will tell Jahntella what it is yet.']
  ];
  const seed = [...`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`]
    .reduce((sum,ch)=>sum+ch.charCodeAt(0),0);
  const [todayTitle,todayText] = events[seed % events.length];
  document.getElementById('exp150TodayTitle').textContent = todayTitle;
  document.getElementById('exp150TodayText').textContent = todayText;

  const mochiMoments = [
    ['Mochi brought a flower','He dropped it near the path and is waiting for praise.'],
    ['Mochi is chasing butterflies','He is convinced he almost caught one.'],
    ['Mochi is napping','He found the warmest patch of light in Sweetville.'],
    ['Mochi wants attention','One tap should do it. Probably.'],
    ['Mochi is doing zoomies','No one knows what started it.']
  ];

  const showMochi = () => {
    const [title,text] = mochiMoments[Math.floor(Math.random()*mochiMoments.length)];
    document.getElementById('exp150MochiTitle').textContent = title;
    document.getElementById('exp150MochiText').textContent = text;
    mochi?.classList.remove('show');
    requestAnimationFrame(() => mochi?.classList.add('show'));
    setTimeout(() => mochi?.classList.remove('show'), 6500);
  };
  document.getElementById('exp150CallMochi')?.addEventListener('click', showMochi);

  const encounters = [
    ['Jahntella waved from across the street.','“You came at the perfect time.”'],
    ['A tiny parade passed by.','Three balloons, one cupcake cart, and absolutely no explanation.'],
    ['A rose appeared beside you.','Mochi may know more than he is saying.'],
    ['The castle bells rang once.','Sweetville says hello in its own way.'],
    ['Fireflies gathered around the path.','They stayed just long enough to be noticed.']
  ];
  document.getElementById('exp150EncounterButton')?.addEventListener('click', () => {
    const [title,text] = encounters[Math.floor(Math.random()*encounters.length)];
    document.getElementById('exp150EncounterTitle').textContent = title;
    document.getElementById('exp150EncounterText').textContent = text;
    window.sweetvilleLaunchFireworks?.(innerWidth*.5, innerHeight*.3, 10);
  });

  const doorButton = document.getElementById('exp150DoorButton');
  const choices = document.getElementById('exp150EveningChoices');
  doorButton?.addEventListener('click', () => {
    document.getElementById('exp150EveningTitle').textContent = 'I’m so glad you came.';
    document.getElementById('exp150EveningText').textContent = 'Come inside. We can visit the flowers, listen by the piano, or watch the fireworks from the balcony.';
    choices.hidden = false;
    doorButton.textContent = 'WELCOME IN ♡';
    document.querySelector('.exp150-welcome-card')?.classList.add('entered');
  });

  choices?.addEventListener('click', event => {
    const button = event.target.closest('[data-evening]');
    if (!button) return;
    const messages = {
      flowers:['The flowers are still fresh from tonight’s show.','Jahntella saved one rose for you.'],
      music:['The piano room is quiet and warm.','A soft melody begins as the lights dim.'],
      balcony:['The balcony doors open to Sparkle Lake.','Pink fireworks rise over the water.']
    };
    const [title,text] = messages[button.dataset.evening];
    document.getElementById('exp150EveningTitle').textContent = title;
    document.getElementById('exp150EveningText').textContent = text;
  });

  if (Math.random() > .45) setTimeout(showMochi, 4500);
})();
