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


/* EXP 21.6 — Premium pack opening effects */
(() => {
  'use strict';

  const pack = document.getElementById('openPackButton');
  const modal = document.getElementById('cardRevealModal');
  const rarity = document.getElementById('revealRarity');
  if (!pack || !modal || !rarity) return;

  let audioContext = null;

  const getAudio = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioContext ??= new AudioCtx();
    return audioContext;
  };

  const foilRipSound = () => {
    const ctx = getAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const length = Math.floor(ctx.sampleRate * .34);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / length;
      const noise = (Math.random() * 2 - 1) * (1 - t);
      const crackle = Math.sin(i * .19) * .18 * (1 - t);
      data[i] = (noise * .62 + crackle) * Math.sin(Math.PI * Math.min(1, t * 5));
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    filter.type = 'highpass';
    filter.frequency.value = 600;
    gain.gain.setValueAtTime(.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.18, ctx.currentTime + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .34);

    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
  };

  const sparkleSound = () => {
    const ctx = getAudio();
    if (!ctx) return;

    [880, 1175, 1568].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(.0001, ctx.currentTime + index * .06);
      gain.gain.exponentialRampToValueAtTime(.06, ctx.currentTime + index * .06 + .02);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + index * .06 + .34);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + index * .06);
      osc.stop(ctx.currentTime + index * .06 + .38);
    });
  };

  pack.addEventListener('click', () => {
    pack.classList.remove('exp216-opening');
    void pack.offsetWidth;
    pack.classList.add('exp216-opening');

    foilRipSound();

    setTimeout(() => {
      sparkleSound();
      pack.classList.remove('exp216-opening');
    }, 1080);
  }, {capture:true});

  const applyRarityBurst = () => {
    if (!modal.classList.contains('open')) return;

    modal.classList.remove(
      'exp216-rare-burst',
      'exp216-legendary-burst',
      'exp216-secret-burst'
    );

    const label = rarity.textContent.trim().toLowerCase();

    if (label.includes('secret')) {
      modal.classList.add('exp216-secret-burst');
    } else if (label.includes('legendary') || label.includes('ultra')) {
      modal.classList.add('exp216-legendary-burst');
    } else if (label.includes('epic') || label.includes('rare')) {
      modal.classList.add('exp216-rare-burst');
    }

    setTimeout(() => {
      modal.classList.remove(
        'exp216-rare-burst',
        'exp216-legendary-burst',
        'exp216-secret-burst'
      );
    }, 1700);
  };

  new MutationObserver(applyRarityBurst).observe(modal, {
    attributes:true,
    attributeFilter:['class']
  });

  ['closeRevealButton', 'revealDoneButton'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      pack.classList.remove('exp216-opening');
      modal.classList.remove(
        'exp216-rare-burst',
        'exp216-legendary-burst',
        'exp216-secret-burst'
      );
    });
  });
})();
