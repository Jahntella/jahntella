/* SWEETVILLE EXP 7.2 — MAGIC POLISH */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const body = document.body;
  const map = document.getElementById('livingMap');
  const hero = document.getElementById('cinematicHome');
  const gate = document.getElementById('gateScreen');
  const openGates = document.getElementById('openGates');
  const pianoModal = document.getElementById('miniPianoModal');
  const mochi = document.getElementById('mochiGuide');

  const once = (el, key) => {
    if (!el || el.dataset[key] === 'true') return false;
    el.dataset[key] = 'true';
    return true;
  };

  // Page reveal
  const revealPage = () => {
    root.classList.add('sv72-ready');
    body.classList.add('sv72-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealPage, { once:true });
  } else {
    revealPage();
  }

  // Refined cursor parallax for hero and world map.
  const attachParallax = (el, strength = 10) => {
    if (!el || reduced || !once(el, 'sv72Parallax')) return;

    let raf = 0;
    const move = event => {
      if (innerWidth < 900) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * strength;
        const y = ((event.clientY - rect.top) / rect.height - .5) * strength;
        el.style.setProperty('--sv72-x', `${x.toFixed(2)}px`);
        el.style.setProperty('--sv72-y', `${y.toFixed(2)}px`);
      });
    };

    const reset = () => {
      el.style.setProperty('--sv72-x', '0px');
      el.style.setProperty('--sv72-y', '0px');
    };

    el.addEventListener('pointermove', move, { passive:true });
    el.addEventListener('pointerleave', reset, { passive:true });
  };

  attachParallax(hero, 14);
  attachParallax(map, 8);

  // Polished district interaction: focus, glow, and subtle sound cue.
  let audioContext;
  const playChime = frequency => {
    if (reduced || document.documentElement.dataset.sv72Muted === 'true') return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioContext ||= new AC();
    if (audioContext.state === 'suspended') audioContext.resume();

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.045, audioContext.currentTime + .01);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .28);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + .3);
  };

  const districtFrequencies = {
    'pink-cafe': 392,
    'melody-studio': 523.25,
    'donut-district': 440,
    'sparkle-lake': 329.63,
    'neon-sweetheart': 659.25
  };

  const bindDistricts = () => {
    document.querySelectorAll('[data-location]').forEach(card => {
      if (!once(card, 'sv72Polish')) return;

      const slug = card.dataset.location;
      card.addEventListener('pointerenter', () => {
        card.classList.add('sv72-hover');
        playChime(districtFrequencies[slug] || 392);
      }, { passive:true });

      card.addEventListener('pointerleave', () => {
        card.classList.remove('sv72-hover');
      }, { passive:true });

      card.addEventListener('click', () => {
        card.classList.remove('sv72-activate');
        void card.offsetWidth;
        card.classList.add('sv72-activate');
        window.setTimeout(() => card.classList.remove('sv72-activate'), 700);
      });
    });
  };

  bindDistricts();
  new MutationObserver(bindDistricts).observe(document.body, {
    childList:true,
    subtree:true
  });

  // Gate transition polish.
  openGates?.addEventListener('click', () => {
    body.classList.add('sv72-opening');
    window.setTimeout(() => {
      body.classList.remove('sv72-opening');
      body.classList.add('sv72-open');
    }, 1100);
  }, { capture:true });

  if (gate) {
    new MutationObserver(() => {
      const open = gate.classList.contains('open') ||
        gate.classList.contains('opened') ||
        gate.classList.contains('gone') ||
        gate.getAttribute('aria-hidden') === 'true' ||
        gate.style.display === 'none';
      if (open) body.classList.add('sv72-open');
    }).observe(gate, { attributes:true, attributeFilter:['class','style','aria-hidden'] });
  }

  // Gentle Mochi reactions.
  const mochiReact = text => {
    if (!mochi) return;
    mochi.classList.remove('sv72-react');
    mochi.setAttribute('data-reaction', text);
    void mochi.offsetWidth;
    mochi.classList.add('sv72-react');
    window.setTimeout(() => mochi.classList.remove('sv72-react'), 1800);
  };

  document.querySelectorAll('[data-location]').forEach(card => {
    card.addEventListener('click', () => mochiReact('✨'));
  });

  document.getElementById('exp60ResetPassport')?.addEventListener('click', () => mochiReact('💌'));
  document.getElementById('exp50BeginChapter')?.addEventListener('click', () => mochiReact('🐾'));

  // EXP 7.2.1: audio focus is handled safely by piano-fix.js.

  // Smooth in-view section reveals.
  if (!reduced && 'IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sv72-in-view');
          reveal.unobserve(entry.target);
        }
      });
    }, { rootMargin:'0px 0px -8% 0px', threshold:.08 });

    document.querySelectorAll(
      '.sv-panel,.sv-hero,.cinematic-home,.story-ending'
    ).forEach(section => {
      section.classList.add('sv72-reveal');
      reveal.observe(section);
    });
  }

  // Small magic pulse after returning to a visible tab.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      body.classList.add('sv72-return');
      window.setTimeout(() => body.classList.remove('sv72-return'), 900);
    }
  });
})();
