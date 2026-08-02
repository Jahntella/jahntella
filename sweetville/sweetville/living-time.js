/* SWEETVILLE EXP 11.0 — LIVING TIME */
(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);

  const elements = {
    worldTime: $('#worldTime'),
    worldPhase: $('#worldPhase'),
    localDate: $('#exp110LocalDate'),
    worldMood: $('#exp110WorldMood'),
    clock: $('#exp110Clock'),
    period: $('#exp110Period'),
    greeting: $('#exp110DayGreeting'),
    message: $('#exp110DayMessage'),
    seasonIcon: $('#exp110SeasonIcon'),
    seasonName: $('#exp110SeasonName'),
    seasonMessage: $('#exp110SeasonMessage'),
    nextReset: $('#exp110NextReset'),
    jahntella: $('#jahntellaMessage p')
  };

  const phases = [
    {
      key:'late-night', start:0, end:5,
      label:'Late Night',
      mood:'Dreamy & Quiet',
      greeting:'You’re up late, Sweetie.',
      message:'The streets are quiet, the neon is soft, and Sweetville is keeping you company.',
      jahntella:'“Couldn’t sleep either? I’m glad you stopped by.”'
    },
    {
      key:'dawn', start:5, end:7,
      label:'Dawn',
      mood:'Soft Sunrise',
      greeting:'A new day is beginning.',
      message:'The sky is turning pink, café lights are warming up, and the first birds are awake.',
      jahntella:'“Good morning. We get to begin again.”'
    },
    {
      key:'morning', start:7, end:12,
      label:'Morning',
      mood:'Bright & Hopeful',
      greeting:'Good morning, Sweetie!',
      message:'Sweetville is bright, the cafés are open, and the whole world feels ready to create.',
      jahntella:'“Good morning! Let’s make today feel sweet.”'
    },
    {
      key:'afternoon', start:12, end:17,
      label:'Afternoon',
      mood:'Playful Energy',
      greeting:'Welcome to a bright Sweetville afternoon.',
      message:'The districts are glowing, music is drifting through the streets, and there is plenty to explore.',
      jahntella:'“Perfect timing. I was hoping you’d visit.”'
    },
    {
      key:'golden-hour', start:17, end:19,
      label:'Golden Hour',
      mood:'Warm & Glowing',
      greeting:'Sweetville is turning golden.',
      message:'The lights are coming on, the sky is warming, and fireflies are beginning to appear.',
      jahntella:'“This is my favorite time of day. Stay a little while.”'
    },
    {
      key:'evening', start:19, end:22,
      label:'Evening',
      mood:'Cozy & Magical',
      greeting:'Good evening, Sweetie.',
      message:'The city is glowing, music feels softer, and every district has settled into nighttime magic.',
      jahntella:'“The world feels extra magical tonight.”'
    },
    {
      key:'night', start:22, end:24,
      label:'Night',
      mood:'Neon Dreams',
      greeting:'Welcome to Sweetville after dark.',
      message:'The moon is high, the neon is bright, and the quiet corners of Sweetville are waiting for you.',
      jahntella:'“Stay as long as you need. The real world can wait.”'
    }
  ];

  const getPhase = hour => phases.find(p => hour >= p.start && hour < p.end) || phases[0];

  const getSeason = date => {
    const m = date.getMonth() + 1;
    const d = date.getDate();

    if (m === 1 && d === 1) return ['🎆','New Year Glow','Sweetville is sparkling with brand-new beginnings.'];
    if (m === 2 && d >= 7 && d <= 14) return ['💖','Sweetheart Week','Hearts, ribbons, and extra pink light are appearing everywhere.'];
    if (m === 10 && d >= 20) return ['🎃','Sweetville Halloween','Candy lights, playful shadows, and spooky-sweet surprises have arrived.'];
    if (m === 11 && d >= 20) return ['🍂','Grateful Season','Warm lights and cozy autumn details are filling the streets.'];
    if (m === 12 && d >= 1 && d <= 26) return ['🎄','Holiday Sweetville','Snowy sparkle, glowing windows, and holiday magic are here.'];

    if (m >= 3 && m <= 5) return ['🌸','Blossom Season','Flowers, butterflies, and soft spring colors are waking up around Sweetville.'];
    if (m >= 6 && m <= 8) return ['☀️','Sweet Summer','Long bright days, sparkling water, and colorful summer energy fill the world.'];
    if (m >= 9 && m <= 11) return ['🍁','Cozy Season','Golden leaves, warm café lights, and cozy corners are appearing.'];
    return ['❄️','Winter Glow','Soft snowlight, warm windows, and peaceful winter magic surround Sweetville.'];
  };

  const formatClock = date => new Intl.DateTimeFormat(undefined, {
    hour:'numeric',
    minute:'2-digit'
  }).format(date);

  const formatDate = date => new Intl.DateTimeFormat(undefined, {
    weekday:'long',
    month:'long',
    day:'numeric'
  }).format(date);

  const timeUntilMidnight = date => {
    const midnight = new Date(date);
    midnight.setHours(24,0,0,0);
    const ms = midnight - date;
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  let lastDayKey = '';

  const update = () => {
    const now = new Date();
    const phase = getPhase(now.getHours());
    const [seasonIcon, seasonName, seasonMessage] = getSeason(now);
    const dayKey = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;

    document.documentElement.dataset.sweetvilleTime = phase.key;
    document.documentElement.dataset.sweetvilleSeason = seasonName.toLowerCase().replace(/\s+/g,'-');

    if (elements.worldTime) elements.worldTime.textContent = formatClock(now);
    if (elements.worldPhase) elements.worldPhase.textContent = phase.label;
    if (elements.localDate) elements.localDate.textContent = formatDate(now);
    if (elements.worldMood) elements.worldMood.textContent = phase.mood;
    if (elements.clock) elements.clock.textContent = formatClock(now);
    if (elements.period) elements.period.textContent = phase.label;
    if (elements.greeting) elements.greeting.textContent = phase.greeting;
    if (elements.message) elements.message.textContent = phase.message;
    if (elements.jahntella) elements.jahntella.textContent = phase.jahntella;
    if (elements.seasonIcon) elements.seasonIcon.textContent = seasonIcon;
    if (elements.seasonName) elements.seasonName.textContent = seasonName;
    if (elements.seasonMessage) elements.seasonMessage.textContent = seasonMessage;
    if (elements.nextReset) elements.nextReset.textContent = `${timeUntilMidnight(now)} until a new day`;

    if (dayKey !== lastDayKey) {
      lastDayKey = dayKey;
      window.dispatchEvent(new CustomEvent('sweetville:new-local-day', {
        detail:{dayKey,date:now.toISOString()}
      }));
    }
  };

  update();
  window.setInterval(update, 30000);
})();
