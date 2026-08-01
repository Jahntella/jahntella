/* SWEETVILLE EXP 8.1 — TOUCH THE WORLD */
(() => {
  'use strict';

  const EXPERIENCE_KEY = 'sweetvilleExp81Experience';
  const state = (() => {
    try { return JSON.parse(localStorage.getItem(EXPERIENCE_KEY)) || {}; }
    catch { return {}; }
  })();

  state.touched = Array.isArray(state.touched) ? state.touched : [];
  state.memories = Array.isArray(state.memories) ? state.memories : [];
  state.actions = Number(state.actions || 0);

  const save = () => localStorage.setItem(EXPERIENCE_KEY, JSON.stringify(state));

  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

  const toastHost = (() => {
    let host = $('#exp81ToastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'exp81ToastHost';
      host.className = 'exp81-toast-host';
      host.setAttribute('aria-live','polite');
      document.body.appendChild(host);
    }
    return host;
  })();

  const toast = (title, text, icon='✨') => {
    const card = document.createElement('div');
    card.className = 'exp81-toast';
    card.innerHTML = `<span>${icon}</span><div><strong>${title}</strong><small>${text}</small></div>`;
    toastHost.appendChild(card);
    requestAnimationFrame(() => card.classList.add('show'));
    window.setTimeout(() => {
      card.classList.remove('show');
      window.setTimeout(() => card.remove(), 350);
    }, 2800);
  };

  const ripple = (event, element) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const dot = document.createElement('i');
    dot.className = 'exp81-ripple';
    const size = Math.max(rect.width, rect.height) * 1.15;
    dot.style.width = dot.style.height = `${size}px`;
    dot.style.left = `${(event.clientX || rect.left + rect.width/2) - rect.left - size/2}px`;
    dot.style.top = `${(event.clientY || rect.top + rect.height/2) - rect.top - size/2}px`;
    element.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove(), {once:true});
  };

  const confetti = (x=innerWidth/2, y=innerHeight/2, count=14) => {
    const host = document.createElement('div');
    host.className = 'exp81-confetti-host';
    host.style.left = `${x}px`;
    host.style.top = `${y}px`;
    document.body.appendChild(host);

    const chars = ['♡','✦','•','✧'];
    for (let i=0;i<count;i++) {
      const piece = document.createElement('span');
      piece.textContent = chars[i % chars.length];
      piece.style.setProperty('--x', `${(Math.random()-.5)*170}px`);
      piece.style.setProperty('--y', `${-40-Math.random()*120}px`);
      piece.style.setProperty('--r', `${(Math.random()-.5)*220}deg`);
      piece.style.setProperty('--d', `${Math.random()*.2}s`);
      host.appendChild(piece);
    }
    window.setTimeout(() => host.remove(), 1500);
  };

  const touch = (key, label) => {
    state.actions += 1;
    if (!state.touched.includes(key)) state.touched.push(key);
    save();
    window.dispatchEvent(new CustomEvent('sweetville:experience', {
      detail:{key,label,actions:state.actions,touched:state.touched.length}
    }));
  };

  const styleInteractiveControls = () => {
    $$('button, .sv-button, .world-location, .exp50-chapter, .passport-stamp, [role="button"]').forEach(el => {
      if (el.dataset.exp81Ready === 'true') return;
      el.dataset.exp81Ready = 'true';
      el.classList.add('exp81-touchable');
      el.addEventListener('pointerdown', event => ripple(event, el), {passive:true});
    });
  };

  styleInteractiveControls();
  new MutationObserver(styleInteractiveControls).observe(document.body, {childList:true,subtree:true});

  // Districts: entering should feel like the world responds.
  const districtMessages = {
    'pink-cafe': ['Pink Café','The windows glow warmer. Jahntella saved you the corner table.','☕','cafe'],
    'melody-studio': ['Melody Studio','The room hums softly. Four little notes are waiting for you.','🎹','studio'],
    'donut-district': ['Donut District','Neon signs flicker on and the street smells like strawberry sugar.','🍩','donut'],
    'sparkle-lake': ['Sparkle Lake','Fireflies wake over the water and the lake turns silver.','✨','lake'],
    'neon-sweetheart': ['Neon Sweetheart','The heart lights pulse once, as though Sweetville noticed you.','💖','heart']
  };

  $$('.world-location[data-location]').forEach(button => {
    button.addEventListener('click', event => {
      const id = button.dataset.location;
      const data = districtMessages[id];
      if (!data) return;
      document.documentElement.dataset.exp81District = data[3];
      button.classList.add('exp81-entered');
      window.setTimeout(() => button.classList.remove('exp81-entered'), 1100);
      toast(data[0], data[1], data[2]);
      confetti(event.clientX || innerWidth*.5, event.clientY || innerHeight*.35, 10);
      touch(`district:${id}`, data[0]);
      $('#jahntellaMessage p')?.replaceChildren(document.createTextNode(`“${data[1]}”`));
    });
  });

  // Little Moments: create a visible "memory tucked away" animation.
  $('#exp80BeginMoment')?.addEventListener('click', event => {
    const card = $('#exp80MomentCard');
    card?.classList.add('exp81-world-response');
    window.setTimeout(() => card?.classList.remove('exp81-world-response'), 1700);
    toast('A Little Moment Began','Sweetville softened the lights for you.','💋');
    confetti(event.clientX || innerWidth*.42, event.clientY || innerHeight*.45, 12);
    touch('little-moment','Little Moment');
  });

  $('#exp80SaveKeepsake')?.addEventListener('click', event => {
    const card = $('#exp80KeepsakeCard');
    card?.classList.add('exp81-tucked');
    const title = $('#exp80KeepsakeTitle')?.textContent?.trim() || 'Sweetville Memory';
    if (!state.memories.includes(title)) state.memories.push(title);
    save();
    toast('Memory Kept',`${title} was tucked into your Sweetville scrapbook.`,'🎀');
    confetti(event.clientX || innerWidth*.65, event.clientY || innerHeight*.48, 16);
    touch(`memory:${title}`, title);
  });

  $('#exp80NewSmile')?.addEventListener('click', event => {
    const card = $('#exp80SmileCard');
    card?.classList.add('exp81-smile-bounce');
    window.setTimeout(() => card?.classList.remove('exp81-smile-bounce'), 700);
    toast('Mochi Found Another One','He is extremely proud of this joke.','🐾');
    confetti(event.clientX || innerWidth*.72, event.clientY || innerHeight*.55, 8);
    touch('smile-card','Smile Card');
  });

  // Passport stamps: ink press, sparkle, message.
  $$('.passport-stamp, [data-passport], .passport-card button').forEach(stamp => {
    stamp.addEventListener('click', event => {
      stamp.classList.add('exp81-stamped');
      window.setTimeout(() => stamp.classList.remove('exp81-stamped'), 900);
      toast('Passport Stamped','Another place in Sweetville remembers your visit.','🛂');
      confetti(event.clientX || innerWidth*.5, event.clientY || innerHeight*.5, 12);
      touch('passport','Passport');
    });
  });

  // Story and chapter buttons: tactile page response.
  $$('.exp50-chapter, #exp50BeginChapter, #exp50StoryHint').forEach(control => {
    control.addEventListener('click', () => {
      $('.exp50-story-card')?.classList.add('exp81-page-turn');
      window.setTimeout(() => $('.exp50-story-card')?.classList.remove('exp81-page-turn'), 850);
      toast('The Story Moved','A new page opened in Jahntella’s world.','📖');
      touch('storybook','Storybook');
    });
  });

  // Collection / bedroom / achievement sections receive a visible section pulse.
  const pulseSection = (selector, label, icon) => {
    const section = $(selector);
    if (!section) return;
    section.addEventListener('click', event => {
      const control = event.target.closest('button,.sv-button,[role="button"]');
      if (!control) return;
      section.classList.add('exp81-section-awake');
      window.setTimeout(() => section.classList.remove('exp81-section-awake'), 900);
      toast(label, `${label} responded to your touch.`, icon);
      touch(`section:${label}`, label);
    });
  };

  pulseSection('#collection','Your Collection','🎁');
  pulseSection('#bedroom','My Sweetie Room','🛏️');
  pulseSection('#achievements','Your Memories','🏅');
  pulseSection('#letters','Jahntella’s Letters','💌');
  pulseSection('#gift','Today’s Gift','🎀');
  pulseSection('#passport','Your Passport','🛂');

  // Piano note visuals, without interfering with audio.
  const pianoObserver = new MutationObserver(() => {
    $$('#pianoModal button, #miniPiano button, .piano-key, [data-note]').forEach(key => {
      if (key.dataset.exp81Piano === 'true') return;
      key.dataset.exp81Piano = 'true';
      key.addEventListener('click', event => {
        const note = document.createElement('span');
        note.className = 'exp81-note';
        note.textContent = ['♪','♫','✦'][Math.floor(Math.random()*3)];
        note.style.left = `${event.clientX || innerWidth/2}px`;
        note.style.top = `${event.clientY || innerHeight/2}px`;
        document.body.appendChild(note);
        window.setTimeout(() => note.remove(), 1200);
        touch('piano-note','Mini Piano');
      });
    });
  });

  pianoObserver.observe(document.body, {childList:true,subtree:true});
  pianoObserver.takeRecords();

  // Show an experience counter badge after the first interaction.
  const badge = document.createElement('div');
  badge.className = 'exp81-experience-badge';
  badge.innerHTML = '<span>♡</span><div><small>WORLD RESPONSES</small><strong>0</strong></div>';
  document.body.appendChild(badge);

  const updateBadge = () => {
    $('strong', badge).textContent = String(state.actions);
    badge.classList.toggle('visible', state.actions > 0);
  };

  updateBadge();
  window.addEventListener('sweetville:experience', updateBadge);
})();
