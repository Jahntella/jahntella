/* SWEETVILLE EXP 13/14 — BEHIND THE SCENES + FAN EXPERIENCE */
(() => {
  'use strict';

  const storage = {
    get(key, fallback) {
      try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const KEYS = {
    visits:'sweetvilleExp1314Visits',
    explored:'sweetvilleExp1314ExploredRooms',
    pass:'sweetvilleExp1314VipPass',
    messages:'sweetvilleExp1314FanMessages',
    postcards:'sweetvilleExp1314Postcards',
    surpriseDay:'sweetvilleExp1314SurpriseDay',
    gifts:'sweetvilleExp1314Gifts'
  };

  const glamDetails = {
    lipstick:['Sweet Rose','A glossy rose-pink shade chosen to catch the vanity lights.'],
    necklace:['Signature Heart','Jahntella’s heart necklace appears throughout the World of Sweet.'],
    lights:['Vanity Glow','The brighter the lights, the more the crystals sparkle.'],
    palette:['Pink-to-Purple Palette','Today’s eyeshadow blends soft rose into deep violet.']
  };

  const bouquetNotes = [
    ['From Buffalo 💖','“You made our night unforgettable.”'],
    ['Love from Toronto ✨','“Keep building this beautiful world.”'],
    ['From Brazil 🌹','“Your music crossed every mile.”'],
    ['Sweeties Everywhere 💐','“We’ll see you at the next show.”']
  ];

  const postcards = [
    'Keep being the reason someone believes in something sweet.',
    'You belong here exactly as you are.',
    'A little confidence can change the whole room.',
    'Thank you for spending part of your day with me.',
    'There is always more magic ahead.'
  ];

  const surprises = [
    {icon:'🧁',title:'Backstage Cupcake',text:'A pink-frosted cupcake appeared in the dressing room.',gift:'lollipop'},
    {icon:'🎈',title:'Heart Balloon',text:'A heart-shaped balloon followed you into Sweetville.',gift:'charm'},
    {icon:'💎',title:'Pink Crystal',text:'A glowing crystal was waiting beside the vanity mirror.',gift:'crystal'},
    {icon:'🌹',title:'Single Rose',text:'Jahntella saved one rose from tonight’s bouquets for you.',gift:'rose'},
    {icon:'🎟️',title:'Concert Ticket',text:'A first-row Sweetville ticket appeared in your collection.',gift:'ticket'}
  ];

  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  };

  // Sweetville memory
  const visits = Number(storage.get(KEYS.visits, 0)) + 1;
  storage.set(KEYS.visits, visits);
  const welcome = document.getElementById('exp1314WelcomeBack');
  const memoryText = document.getElementById('exp1314MemoryText');
  if (welcome) {
    welcome.textContent = visits > 1 ? `Welcome back, Sweetie — visit ${visits}.` : 'Welcome to your first backstage visit.';
  }
  if (memoryText) {
    memoryText.textContent = visits > 2
      ? 'Jahntella noticed you came back. Your private keepsakes and kind messages are still here.'
      : 'Sweetville will remember your backstage pass, messages, postcards, and gifts on this device.';
  }

  // Backstage interactions
  const explored = new Set(storage.get(KEYS.explored, []));
  const glamBox = document.getElementById('exp1314GlamDetail');
  const flowerBox = document.getElementById('exp1314FlowerDetail');
  const claimPass = document.getElementById('exp1314ClaimPass');
  const passStatus = document.getElementById('exp1314PassStatus');

  const markRoom = room => {
    explored.add(room);
    storage.set(KEYS.explored, [...explored]);
    updatePass();
  };

  const updatePass = () => {
    const count = ['glam','flowers'].filter(x => explored.has(x)).length;
    if (passStatus) passStatus.textContent = `${count} / 2 rooms explored`;
    if (claimPass) {
      const claimed = storage.get(KEYS.pass, false);
      claimPass.disabled = count < 2 || claimed;
      claimPass.textContent = claimed ? 'VIP Pass Collected ✓' : count < 2 ? 'Explore Both Rooms First' : 'Claim VIP Backstage Pass';
    }
  };

  document.querySelectorAll('[data-detail]').forEach(button => {
    button.addEventListener('click', () => {
      const [name,text] = glamDetails[button.dataset.detail];
      if (glamBox) glamBox.innerHTML = `<strong>${name}</strong><span>${text}</span>`;
      markRoom('glam');
      button.classList.add('active');
    });
  });

  document.querySelectorAll('[data-bouquet]').forEach(button => {
    button.addEventListener('click', () => {
      const [name,text] = bouquetNotes[Number(button.dataset.bouquet)] || bouquetNotes[0];
      if (flowerBox) flowerBox.innerHTML = `<strong>${name}</strong><span>${text}</span>`;
      markRoom('flowers');
      button.classList.add('active');
    });
  });

  claimPass?.addEventListener('click', () => {
    storage.set(KEYS.pass, true);
    updatePass();
    window.sweetvilleLaunchFireworks?.(innerWidth*.5, innerHeight*.28, 18);
    window.dispatchEvent(new CustomEvent('sweetville:experience', {
      detail:{key:'vip-backstage-pass',label:'VIP Backstage Pass'}
    }));
  });
  updatePass();

  // Fan wall
  const messageInput = document.getElementById('exp1314FanMessage');
  const messageWall = document.getElementById('exp1314MessageWall');

  const renderMessages = () => {
    const messages = storage.get(KEYS.messages, []);
    if (!messageWall) return;
    messageWall.innerHTML = messages.length
      ? messages.slice(-5).reverse().map(msg => `<p>“${String(msg).replace(/[<>]/g,'')}”</p>`).join('')
      : '<p class="empty">Your kind messages will appear here.</p>';
  };

  document.getElementById('exp1314AddMessage')?.addEventListener('click', () => {
    const value = messageInput?.value.trim();
    if (!value) return;
    const messages = storage.get(KEYS.messages, []);
    messages.push(value.slice(0,120));
    storage.set(KEYS.messages, messages.slice(-20));
    messageInput.value = '';
    renderMessages();
  });
  renderMessages();

  // Postcard
  document.getElementById('exp1314RevealPostcard')?.addEventListener('click', () => {
    const index = Math.floor(Math.random()*postcards.length);
    const message = postcards[index];
    const list = storage.get(KEYS.postcards, []);
    if (!list.includes(message)) list.push(message);
    storage.set(KEYS.postcards, list);
    const text = document.getElementById('exp1314PostcardText');
    if (text) text.textContent = message;
  });

  // Daily surprise + gifts
  const giftGrid = document.getElementById('exp1314GiftGrid');
  const giftCount = document.getElementById('exp1314GiftCount');

  const renderGifts = () => {
    const gifts = storage.get(KEYS.gifts, []);
    giftGrid?.querySelectorAll('[data-gift]').forEach(item => {
      item.classList.toggle('collected', gifts.includes(item.dataset.gift));
    });
    if (giftCount) giftCount.textContent = `${gifts.length} / 5 collected`;
  };

  document.getElementById('exp1314OpenSurprise')?.addEventListener('click', () => {
    const day = todayKey();
    const lastDay = storage.get(KEYS.surpriseDay, '');
    const seed = [...day].reduce((n,ch) => n + ch.charCodeAt(0), 0);
    const surprise = surprises[seed % surprises.length];

    document.getElementById('exp1314SurpriseIcon').textContent = surprise.icon;
    document.getElementById('exp1314SurpriseTitle').textContent = surprise.title;
    document.getElementById('exp1314SurpriseText').textContent =
      lastDay === day ? 'You already found today’s surprise. It is safely in your collection.' : surprise.text;

    if (lastDay !== day) {
      storage.set(KEYS.surpriseDay, day);
      const gifts = storage.get(KEYS.gifts, []);
      if (!gifts.includes(surprise.gift)) gifts.push(surprise.gift);
      storage.set(KEYS.gifts, gifts);
      renderGifts();
      window.sweetvilleLaunchFireworks?.(innerWidth*.5, innerHeight*.35, 12);
    }
  });
  renderGifts();
})();
