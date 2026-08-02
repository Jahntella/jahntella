/* SWEETVILLE EXP 12.0 — A DAY WITH JAHNTELLA */
(() => {
  'use strict';

  const featureImage = document.getElementById('exp120FeatureImage');
  if (!featureImage) return;

  const title = document.getElementById('exp120FeatureTitle');
  const description = document.getElementById('exp120FeatureDescription');
  const quote = document.getElementById('exp120FeatureQuote');
  const period = document.getElementById('exp120PeriodLabel');
  const badge = document.getElementById('exp120TimeBadge');
  const localScene = document.getElementById('exp120LocalScene');
  const gallery = document.getElementById('exp120MomentGallery');
  const keepButton = document.getElementById('exp120KeepMoment');
  const nextButton = document.getElementById('exp120NextMoment');
  const keptCount = document.getElementById('exp120KeptCount');
  const memoryMessage = document.getElementById('exp120MemoryMessage');

  const STORAGE_KEY = 'sweetvilleExp120DayMoments';

  const moments = {
    yoga: {
      image:'assets/day-with-jahntella/yoga.jpg?v=12.0',
      alt:'Jahntella practicing yoga at sunrise',
      period:'MORNING IN SWEETVILLE',
      title:'Sunrise Yoga',
      description:'Jahntella begins the morning with movement, calm breathing, and a view of the castle waking up.',
      quote:'“A peaceful beginning can change the whole day.”',
      icon:'🌅'
    },
    running: {
      image:'assets/day-with-jahntella/running.jpg?v=12.0',
      alt:'Jahntella running through Donut District',
      period:'AFTERNOON IN SWEETVILLE',
      title:'Run Through Sweetville',
      description:'Jahntella is taking the long way through Donut District while the streets glow in the afternoon light.',
      quote:'“Sometimes the best ideas arrive while you’re moving.”',
      icon:'🏃‍♀️'
    },
    picnic: {
      image:'assets/day-with-jahntella/picnic.jpg?v=12.0',
      alt:'Jahntella enjoying a picnic by Sparkle Lake',
      period:'GOLDEN HOUR IN SWEETVILLE',
      title:'Picnic by Sparkle Lake',
      description:'Jahntella slows down beside the water with berries, sparkling drinks, and the castle lights nearby.',
      quote:'“You don’t need a special reason to make a moment feel special.”',
      icon:'🧺'
    },
    mirror: {
      image:'assets/day-with-jahntella/mirror.jpg?v=12.0',
      alt:'Jahntella choosing an outfit in her closet',
      period:'EVENING IN SWEETVILLE',
      title:'Getting Ready',
      description:'Jahntella is choosing the final details before stepping out into the neon evening.',
      quote:'“Wear the version of yourself that feels the most alive.”',
      icon:'✨'
    },
    paddle: {
      image:'assets/day-with-jahntella/paddle.jpg?v=12.0',
      alt:'Jahntella on a paddle boat beneath fireworks',
      period:'NIGHT IN SWEETVILLE',
      title:'Fireworks on Sparkle Lake',
      description:'Jahntella is ending the day beneath pink fireworks reflected across the water.',
      quote:'“Some nights deserve to be remembered slowly.”',
      icon:'🎆'
    }
  };

  const keys = Object.keys(moments);
  let currentKey = 'paddle';

  const readSaved = () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };

  const updateSavedStatus = () => {
    const saved = readSaved();
    if (keptCount) keptCount.textContent = String(saved.length);
    if (memoryMessage) {
      memoryMessage.textContent = saved.length
        ? `${saved.length} favorite moment${saved.length === 1 ? '' : 's'} remembered on this device.`
        : 'Save a favorite moment and it will be remembered on this device.';
    }
    gallery?.querySelectorAll('[data-moment]').forEach(card => {
      card.classList.toggle('kept', saved.includes(card.dataset.moment));
    });
  };

  const timeMoment = hour => {
    if (hour >= 5 && hour < 11) return 'yoga';
    if (hour >= 11 && hour < 17) return 'running';
    if (hour >= 17 && hour < 19) return 'picnic';
    if (hour >= 19 && hour < 22) return 'mirror';
    return 'paddle';
  };

  const show = (key, automatic=false) => {
    const moment = moments[key];
    if (!moment) return;
    currentKey = key;

    featureImage.classList.add('changing');
    window.setTimeout(() => {
      featureImage.src = moment.image;
      featureImage.alt = moment.alt;
      featureImage.classList.remove('changing');
    }, 180);

    if (period) period.textContent = moment.period;
    if (title) title.textContent = moment.title;
    if (description) description.textContent = moment.description;
    if (quote) quote.textContent = moment.quote;
    if (badge) badge.textContent = automatic ? 'RIGHT NOW' : 'SELECTED MOMENT';

    gallery?.querySelectorAll('[data-moment]').forEach(card => {
      card.classList.toggle('active', card.dataset.moment === key);
    });

    if (keepButton) {
      keepButton.textContent = readSaved().includes(key) ? 'Remove This Moment' : 'Keep This Moment';
    }

    if (automatic && localScene) {
      localScene.textContent = `${moment.icon} Matched to your local time`;
    }
  };

  gallery?.addEventListener('click', event => {
    const card = event.target.closest('[data-moment]');
    if (!card) return;
    show(card.dataset.moment, false);
  });

  keepButton?.addEventListener('click', () => {
    const saved = readSaved();
    const existingIndex = saved.indexOf(currentKey);
    const removing = existingIndex >= 0;

    if (removing) {
      saved.splice(existingIndex, 1);
    } else {
      saved.push(currentKey);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    updateSavedStatus();

    keepButton.textContent = removing ? 'Moment Removed' : 'Moment Kept 💖';
    window.setTimeout(() => {
      const latest = readSaved();
      keepButton.textContent = latest.includes(currentKey) ? 'Remove This Moment' : 'Keep This Moment';
    }, 1200);

    window.dispatchEvent(new CustomEvent('sweetville:memory-changed'));
    if (!removing) {
      window.dispatchEvent(new CustomEvent('sweetville:experience', {
        detail:{key:`day-moment:${currentKey}`,label:moments[currentKey].title}
      }));
      window.sweetvilleLaunchFireworks?.(innerWidth*.5,innerHeight*.28,12);
    }
  });

  nextButton?.addEventListener('click', () => {
    const index = keys.indexOf(currentKey);
    show(keys[(index + 1) % keys.length], false);
  });

  const now = new Date();
  const localKey = timeMoment(now.getHours());
  show(localKey, true);
  updateSavedStatus();

  // Refresh the featured scene when the local hour changes.
  let lastHour = now.getHours();
  window.setInterval(() => {
    const current = new Date();
    if (current.getHours() === lastHour) return;
    lastHour = current.getHours();
    show(timeMoment(lastHour), true);
  }, 60000);
})();
