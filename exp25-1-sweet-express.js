/* EXP 25.2 — Both Jahntella songs power the Sweet Express */
(() => {
  'use strict';

  const STORAGE_KEY = 'jahntellaSweetEnergyV25';
  const GOAL = 10;

  const countEl = document.getElementById('exp250PlayCount');
  const bar = document.getElementById('exp250ProgressBar');
  const status = document.getElementById('exp250Status');
  const listenButton = document.getElementById('exp250ListenButton');
  const boardButton = document.getElementById('exp250BoardButton');

  const funDippAudio = document.getElementById('audioFunDipp');
  const pinkLipsAudio = document.getElementById('audioPinkLips');
  const funDippButton = document.querySelector('[data-track="fun-dipp"]');

  if (!countEl || !bar || !status || !listenButton || !boardButton) return;

  let count = Math.max(
    0,
    Math.min(GOAL, Number(localStorage.getItem(STORAGE_KEY) || 0))
  );

  const render = () => {
    countEl.textContent = String(count);
    bar.style.width = `${Math.min(100, (count / GOAL) * 100)}%`;

    if (count >= GOAL) {
      status.textContent = 'The Sweet Express is fully powered. Your ticket is ready!';
      boardButton.disabled = false;
      boardButton.classList.add('is-unlocked');
      boardButton.textContent = '🚂 ALL ABOARD!';
    } else {
      const remaining = GOAL - count;
      status.textContent = `${remaining} completed listen${remaining === 1 ? '' : 's'} to either song until Bubblegum Bay unlocks.`;
      boardButton.disabled = true;
      boardButton.classList.remove('is-unlocked');
      boardButton.textContent = '🚂 All Aboard — Locked';
    }
  };

  const addSweetEnergy = trackName => {
    if (count >= GOAL) return;

    count += 1;
    localStorage.setItem(STORAGE_KEY, String(count));
    render();

    status.textContent = `${trackName} added +1 Sweet Energy! ${GOAL - count} remaining.`;

    setTimeout(() => {
      document.getElementById('sweet-express')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 350);
  };

  listenButton.addEventListener('click', () => {
    document.getElementById('music')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    setTimeout(() => funDippButton?.click(), 550);
  });

  funDippAudio?.addEventListener('ended', () => {
    addSweetEnergy('Fun Dipp');
  });

  pinkLipsAudio?.addEventListener('ended', () => {
    addSweetEnergy('Pink Lips Remix');
  });

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
