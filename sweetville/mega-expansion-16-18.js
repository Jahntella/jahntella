/* SWEETVILLE EXP 16/17/18 — MEGA EXPANSION */
(() => {
  'use strict';

  const get = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };
  const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const DAY_KEY = 'sweetvilleExp120DayMoments';
  const EXTRA_KEY = 'sweetvilleExp1618Memories';

  const memoryNames = {
    yoga:'Sunrise Yoga',
    running:'Run Through Sweetville',
    picnic:'Picnic by Sparkle Lake',
    mirror:'Getting Ready',
    paddle:'Fireworks on Sparkle Lake'
  };

  const memoryIcons = {
    yoga:'🌅', running:'🏃‍♀️', picnic:'🧺', mirror:'✨', paddle:'🎆'
  };

  const renderMemoryBook = () => {
    const dayMoments = get(DAY_KEY, []);
    const extras = get(EXTRA_KEY, []);
    const memories = [
      ...dayMoments.map(key => ({
        key:`day:${key}`,
        title:memoryNames[key] || key,
        icon:memoryIcons[key] || '💖',
        type:'A Day With Jahntella'
      })),
      ...extras
    ];

    const grid = document.getElementById('exp1618MemoryGrid');
    const total = document.getElementById('exp1618MemoryTotal');
    if (total) total.textContent = `${memories.length} memor${memories.length === 1 ? 'y' : 'ies'}`;
    if (!grid) return;

    grid.innerHTML = memories.length
      ? memories.map(memory => `
        <article class="exp1618-memory-card" data-memory="${memory.key}">
          <span>${memory.icon}</span>
          <small>${memory.type}</small>
          <strong>${memory.title}</strong>
          <button type="button" aria-label="Remove ${memory.title}">Remove</button>
        </article>
      `).join('')
      : '<p class="exp1618-empty-memory">Keep a moment from Jahntella’s day or collect a premiere card to begin your book.</p>';
  };

  document.getElementById('exp1618MemoryGrid')?.addEventListener('click', event => {
    const card = event.target.closest('[data-memory]');
    if (!card || !event.target.closest('button')) return;
    const key = card.dataset.memory;

    if (key.startsWith('day:')) {
      const moment = key.replace('day:', '');
      set(DAY_KEY, get(DAY_KEY, []).filter(item => item !== moment));
      window.dispatchEvent(new CustomEvent('sweetville:memory-changed'));
    } else {
      set(EXTRA_KEY, get(EXTRA_KEY, []).filter(item => item.key !== key));
    }
    renderMemoryBook();
  });

  window.addEventListener('sweetville:memory-changed', renderMemoryBook);

  const premiereDetails = {
    fans:['The Sweeties are cheering.','Jahntella pauses to thank the fans who helped build the World of Sweet.'],
    poster:['A signed premiere keepsake.','The pink pen sparkles as Jahntella signs the final poster of the night.'],
    marquee:['Sweetville Premiere lights up.','The theatre marquee glows brighter as the crowd gathers outside.']
  };

  document.querySelectorAll('[data-premiere]').forEach(button => {
    button.addEventListener('click', () => {
      const [title,text] = premiereDetails[button.dataset.premiere];
      document.getElementById('exp1618PremiereTitle').textContent = title;
      document.getElementById('exp1618PremiereText').textContent = text;
      button.classList.add('active');
    });
  });

  document.getElementById('exp1618CollectAutograph')?.addEventListener('click', event => {
    const memories = get(EXTRA_KEY, []);
    const key = 'premiere-autograph';
    if (!memories.some(item => item.key === key)) {
      memories.push({
        key,
        title:'Signed Sweetville Premiere Card',
        icon:'✍️',
        type:'Celebrity Life'
      });
      set(EXTRA_KEY, memories);
    }
    event.currentTarget.textContent = 'Signed Card Collected ✓';
    renderMemoryBook();
    window.sweetvilleLaunchFireworks?.(innerWidth*.5, innerHeight*.3, 14);
  });

  const radioMessages = {
    'Sweet FM':'“This is the station I play when I want the whole city to feel brighter.”',
    'Fun Dipp Radio':'“Okay, this one absolutely needs to be louder.”',
    'Late Night Pink':'“The city lights look softer after midnight.”'
  };

  document.querySelectorAll('[data-radio]').forEach(button => {
    button.addEventListener('click', () => {
      const station = button.dataset.radio;
      document.getElementById('exp1618RadioTitle').textContent = station;
      document.getElementById('exp1618CruiseMessage').textContent = radioMessages[station];
      document.querySelectorAll('[data-radio]').forEach(item => item.classList.toggle('active', item === button));
    });
  });

  document.querySelectorAll('[data-destination]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('exp1618CruiseBadge').textContent = `NEXT STOP: ${button.dataset.destination.toUpperCase()}`;
      document.querySelectorAll('[data-destination]').forEach(item => item.classList.toggle('active', item === button));
    });
  });

  const driveThoughts = [
    '“Let’s take the long way. The lights are better over the bridge.”',
    '“I always get new song ideas when the city is moving around me.”',
    '“Mochi would absolutely try to sit in the driver’s seat.”',
    '“Some nights are made for nowhere in particular.”'
  ];

  document.getElementById('exp1618TakeDrive')?.addEventListener('click', () => {
    document.getElementById('exp1618CruiseMessage').textContent =
      driveThoughts[Math.floor(Math.random()*driveThoughts.length)];
    document.querySelector('.exp1618-cruise-card')?.classList.remove('driving');
    requestAnimationFrame(() => document.querySelector('.exp1618-cruise-card')?.classList.add('driving'));
  });

  let volleyScore = Number(get('sweetvilleExp18VolleyScore', 0));
  const updateVolley = message => {
    document.getElementById('exp1618VolleyScore').textContent = `${volleyScore} point${volleyScore === 1 ? '' : 's'}`;
    if (message) document.getElementById('exp1618VolleyText').textContent = message;
  };
  updateVolley();

  document.getElementById('exp1618VolleyButton')?.addEventListener('click', () => {
    const success = Math.random() > .28;
    if (success) {
      volleyScore += 1;
      set('sweetvilleExp18VolleyScore', volleyScore);
      updateVolley(volleyScore >= 3 ? 'Festival challenge complete! The crowd is cheering.' : 'Perfect serve! Keep going.');
      window.sweetvilleLaunchFireworks?.(innerWidth*.45, innerHeight*.4, 7);
    } else {
      updateVolley('So close! The ball caught the edge of the net.');
    }
  });

  const looks = {
    walk:{
      image:'assets/exp16-18/sunset-dress.jpg?v=18.0',
      alt:'Jahntella in a summer dress at sunset',
      title:'Sunset Walk',
      text:'A soft sparkling dress for a quiet walk beside the water.'
    },
    finale:{
      image:'assets/exp16-18/fireworks-gown.jpg?v=18.0',
      alt:'Jahntella in a sparkling gown beneath beach fireworks',
      title:'Fireworks Gown',
      text:'A full-length pink and purple gown made for the festival finale.'
    }
  };

  document.querySelectorAll('[data-look]').forEach(button => {
    button.addEventListener('click', () => {
      const look = looks[button.dataset.look];
      const image = document.getElementById('exp1618SummerLook');
      image.src = look.image;
      image.alt = look.alt;
      document.getElementById('exp1618LookTitle').textContent = look.title;
      document.getElementById('exp1618LookText').textContent = look.text;
      document.querySelectorAll('[data-look]').forEach(item => item.classList.toggle('active', item === button));
    });
  });

  document.getElementById('exp1618LaunchFinale')?.addEventListener('click', event => {
    document.querySelector('[data-look="finale"]')?.click();
    document.getElementById('exp1618FinaleTitle').textContent = 'The Sweetville sky is glowing.';
    document.getElementById('exp1618FinaleText').textContent = 'Pink fireworks rise above the shoreline while the final song plays.';
    event.currentTarget.textContent = 'Finale Launched 🎆';
    window.sweetvilleLaunchFireworks?.(innerWidth*.25, innerHeight*.28, 18);
    setTimeout(() => window.sweetvilleLaunchFireworks?.(innerWidth*.72, innerHeight*.25, 18), 500);
  });

  renderMemoryBook();
})();
