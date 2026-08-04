/* EXP 21.5 — Keep card reveal on the current screen */
(() => {
  'use strict';

  const ready = fn => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, {once:true});
    } else {
      fn();
    }
  };

  ready(() => {
    const modal = document.getElementById('cardRevealModal');
    const pack = document.getElementById('openPackButton');
    const binder = document.getElementById('vaultBinder');
    if (!modal || !pack) return;

    // Remove the modal from every transformed/contained section.
    if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }

    let revealTop = window.scrollY;
    let restoreBinderScroll = null;

    const stopScheduledBinderJump = () => {
      if (!binder || restoreBinderScroll) return;

      const original = binder.scrollIntoView;
      binder.scrollIntoView = () => {};

      restoreBinderScroll = () => {
        binder.scrollIntoView = original;
        restoreBinderScroll = null;
      };

      setTimeout(() => restoreBinderScroll?.(), 2300);
    };

    const positionOverCurrentScreen = () => {
      const isOpen = modal.classList.contains('open') ||
                     modal.getAttribute('aria-hidden') === 'false';

      if (!isOpen) return;

      modal.style.setProperty('top', `${revealTop}px`, 'important');
      modal.style.setProperty('bottom', 'auto', 'important');
      modal.scrollTop = 0;
      modal.querySelector('.reveal-content')?.scrollTo({top:0, behavior:'auto'});
    };

    // Capture the exact screen position before the native 1.05-second opening animation.
    pack.addEventListener('click', () => {
      revealTop = window.scrollY;
      stopScheduledBinderJump();

      setTimeout(positionOverCurrentScreen, 1060);
      setTimeout(positionOverCurrentScreen, 1200);
      setTimeout(positionOverCurrentScreen, 1800);
    }, {capture:true});

    new MutationObserver(positionOverCurrentScreen).observe(modal, {
      attributes:true,
      attributeFilter:['class', 'aria-hidden']
    });

    const cleanup = () => {
      restoreBinderScroll?.();
      modal.style.removeProperty('top');
      modal.style.removeProperty('bottom');

      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('touch-action');
      document.documentElement.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('position');
      document.documentElement.style.removeProperty('touch-action');
    };

    ['closeRevealButton', 'revealDoneButton'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => {
        setTimeout(cleanup, 50);
        setTimeout(cleanup, 300);
      });
    });

    modal.querySelector('.reveal-backdrop')?.addEventListener('click', () => {
      setTimeout(cleanup, 80);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setTimeout(cleanup, 80);
    });

    window.addEventListener('pageshow', cleanup);
    cleanup();
  });
})();

/* EXP 21.7 — Safe cosmetic effects only */
(() => {
  'use strict';

  const pack = document.getElementById('openPackButton');
  const modal = document.getElementById('cardRevealModal');
  const rarity = document.getElementById('revealRarity');
  if (!pack || !modal || !rarity) return;

  let audioContext = null;

  const playRip = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    audioContext ??= new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume();

    const length = Math.floor(audioContext.sampleRate * .22);
    const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / length;
      data[i] = (Math.random() * 2 - 1) * (1 - t) * .42;
    }

    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();

    filter.type = 'highpass';
    filter.frequency.value = 700;
    gain.gain.setValueAtTime(.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.11, audioContext.currentTime + .018);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .22);

    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(audioContext.destination);
    source.start();
  };

  pack.addEventListener('click', () => {
    pack.classList.remove('exp217-opening');
    void pack.offsetWidth;
    pack.classList.add('exp217-opening');
    playRip();

    setTimeout(() => pack.classList.remove('exp217-opening'), 900);
  }, {capture:false});

  const decorateReveal = () => {
    if (!modal.classList.contains('open')) return;

    modal.classList.remove('exp217-rare','exp217-legendary','exp217-secret');

    const label = rarity.textContent.trim().toLowerCase();

    if (label.includes('secret')) {
      modal.classList.add('exp217-secret');
    } else if (label.includes('legendary') || label.includes('ultra')) {
      modal.classList.add('exp217-legendary');
    } else if (label.includes('epic') || label.includes('rare')) {
      modal.classList.add('exp217-rare');
    }

    setTimeout(() => {
      modal.classList.remove('exp217-rare','exp217-legendary','exp217-secret');
    }, 1100);
  };

  new MutationObserver(decorateReveal).observe(modal, {
    attributes:true,
    attributeFilter:['class']
  });

  ['closeRevealButton','revealDoneButton'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      pack.classList.remove('exp217-opening');
      modal.classList.remove('exp217-rare','exp217-legendary','exp217-secret');
    });
  });
})();
