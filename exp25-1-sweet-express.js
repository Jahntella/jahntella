/* EXP 25.6 — Reliable Sweet Energy song counter */
(() => {
  'use strict';

  const STORAGE_KEY = 'jahntellaSweetEnergyV25';
  const LEGACY_KEY = 'jahntellaFunDippCompletedListensV25';
  const GOAL = 10;
  const CREDIT_THRESHOLD = 0.90;

  const countEl = document.getElementById('exp250PlayCount');
  const bar = document.getElementById('exp250ProgressBar');
  const status = document.getElementById('exp250Status');
  const listenButton = document.getElementById('exp250ListenButton');
  const boardButton = document.getElementById('exp250BoardButton');

  const tracks = [
    {
      audio: document.getElementById('audioFunDipp'),
      title: 'Fun Dipp',
      button: document.querySelector('[data-track="fun-dipp"]')
    },
    {
      audio: document.getElementById('audioPinkLips'),
      title: 'Pink Lips Remix',
      button: document.querySelector('[data-track="pink-lips"]')
    },
    {
      audio: document.getElementById('audioBiteLip'),
      title: 'Bite Lip',
      button: document.querySelector('[data-track="bite-lip"]')
    },
    {
      audio: document.getElementById('audioGloss'),
      title: 'Gloss',
      button: document.querySelector('[data-track="gloss"]')
    },
    {
      audio: document.getElementById('audioYourGirl'),
      title: 'I Want To Be Your Girl',
      button: document.querySelector('[data-track="your-girl"]')
    },
    {
      audio: document.getElementById('audioEmbraceMe'),
      title: 'Embrace Me',
      button: document.querySelector('[data-track="embrace-me"]')
    },
    {
      audio: document.getElementById('audioWeComeTogether'),
      title: 'We Come Together',
      button: document.querySelector('[data-track="we-come-together"]')
    }
  ].filter(track => track.audio);

  if (!countEl || !bar || !status || !listenButton || !boardButton || !tracks.length) return;

  const stored = Number(localStorage.getItem(STORAGE_KEY));
  const legacy = Number(localStorage.getItem(LEGACY_KEY));
  let count = Math.max(
    0,
    Math.min(
      GOAL,
      Number.isFinite(stored) && stored > 0
        ? stored
        : (Number.isFinite(legacy) ? legacy : 0)
    )
  );

  // Track one credit per genuine playthrough.
  const sessions = new WeakMap();

  const save = () => {
    localStorage.setItem(STORAGE_KEY, String(count));
  };

  const render = (message = '') => {
    countEl.textContent = String(count);
    bar.style.width = `${Math.min(100, (count / GOAL) * 100)}%`;

    if (count >= GOAL) {
      status.textContent = message || 'The Sweet Express is fully powered. Your ticket is ready!';
      boardButton.disabled = false;
      boardButton.classList.add('is-unlocked');
      boardButton.textContent = '🚂 ALL ABOARD!';
      return;
    }

    const remaining = GOAL - count;
    status.textContent = message || `${remaining} completed song${remaining === 1 ? '' : 's'} until Bubblegum Bay unlocks.`;
    boardButton.disabled = true;
    boardButton.classList.remove('is-unlocked');
    boardButton.textContent = '🚂 All Aboard — Locked';
  };

  const awardCredit = title => {
    if (count >= GOAL) return;

    count += 1;
    save();

    const remaining = GOAL - count;
    render(
      count >= GOAL
        ? `${title} added the final Sweet Energy! The Sweet Express is ready.`
        : `${title} added +1 Sweet Energy! ${remaining} remaining.`
    );

    setTimeout(() => {
      document.getElementById('sweet-express')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 350);
  };

  tracks.forEach(({audio, title}) => {
    sessions.set(audio, {credited: false});

    audio.addEventListener('play', () => {
      const session = sessions.get(audio);

      // A new playthrough begins when the track starts near the beginning.
      if (audio.currentTime < 5 || audio.ended) {
        session.credited = false;
      }
    });

    audio.addEventListener('timeupdate', () => {
      const session = sessions.get(audio);
      if (
        session.credited ||
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0
      ) return;

      const completion = audio.currentTime / audio.duration;

      if (completion >= CREDIT_THRESHOLD) {
        session.credited = true;
        awardCredit(title);
      }
    });

    // Fallback for browsers that skip the final timeupdate.
    audio.addEventListener('ended', () => {
      const session = sessions.get(audio);
      if (!session.credited) {
        session.credited = true;
        awardCredit(title);
      }
    });

    audio.addEventListener('seeked', () => {
      const session = sessions.get(audio);

      // Rewinding to the start prepares a genuinely new listen.
      if (audio.currentTime < 5) {
        session.credited = false;
      }
    });
  });

  listenButton.addEventListener('click', () => {
    document.getElementById('music')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    const funDippButton = tracks.find(track => track.title === 'Fun Dipp')?.button;
    setTimeout(() => funDippButton?.click(), 550);
  });

  save();
  render();
})();


(() => {
  const board=document.getElementById('exp250BoardButton');
  const overlay=document.getElementById('exp251Departure');
  if(!board||!overlay)return;
  let timer;
  board.addEventListener('click',()=>{
    if(board.disabled)return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    timer=setTimeout(()=>{window.location.href='sweetville/#bubblegumBay';},3600);
  });
  window.addEventListener('pageshow',()=>{
    clearTimeout(timer);
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.removeProperty('overflow');
  });
})();
