/* SWEETVILLE EXP 7.2.1 — PIANO AUDIO & CLOSE HOTFIX */
(() => {
  'use strict';

  const init = () => {
    const modal = document.getElementById('miniPianoModal');
    const piano = document.getElementById('miniPiano');
    const closeButton = document.getElementById('miniPianoClose');
    const display = document.getElementById('pianoNoteDisplay');

    if (!modal || !piano || modal.dataset.piano721Ready === 'true') return;
    modal.dataset.piano721Ready = 'true';

    const frequencies = {
      C4:261.63, 'C#4':277.18, D4:293.66, 'D#4':311.13,
      E4:329.63, F4:349.23, 'F#4':369.99, G4:392,
      'G#4':415.30, A4:440, 'A#4':466.16, B4:493.88, C5:523.25
    };

    let audioContext = null;
    let masterGain = null;

    const setAudioFocus = active => {
      document.documentElement.dataset.sv72AudioDucked = active ? 'true' : 'false';
      window.dispatchEvent(new CustomEvent('sweetville:audio-duck', {
        detail:{ ducked:active }
      }));
    };

    const getAudio = async () => {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

      if (!audioContext || audioContext.state === 'closed') {
        audioContext = new AudioContextClass();
        masterGain = audioContext.createGain();
        masterGain.gain.value = .8;
        masterGain.connect(audioContext.destination);
      }

      if (audioContext.state === 'suspended') {
        try {
          await audioContext.resume();
        } catch {}
      }

      return audioContext.state === 'running' ? audioContext : null;
    };

    const openModal = async event => {
      event?.preventDefault();
      setAudioFocus(true);
      await getAudio();

      try {
        if (typeof modal.showModal === 'function') {
          if (!modal.open) modal.showModal();
        } else {
          modal.setAttribute('open', '');
        }
      } catch {
        modal.setAttribute('open', '');
      }

      modal.classList.add('sv721-piano-open');
      closeButton?.focus({ preventScroll:true });
    };

    const closeModal = event => {
      event?.preventDefault();
      event?.stopPropagation();

      try {
        if (typeof modal.close === 'function' && modal.open) {
          modal.close();
        } else {
          modal.removeAttribute('open');
        }
      } catch {
        modal.removeAttribute('open');
      }

      modal.classList.remove('sv721-piano-open');
      setAudioFocus(false);
    };

    const playNote = async button => {
      const note = button?.dataset.note;
      const frequency = frequencies[note];
      if (!frequency) return;

      const context = await getAudio();
      if (!context || !masterGain) {
        if (display) display.textContent = 'TAP AGAIN FOR AUDIO';
        return;
      }

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.36, now + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .72);

      oscillator.connect(gain);
      gain.connect(masterGain);
      oscillator.start(now);
      oscillator.stop(now + .75);

      button.classList.add('active');
      if (display) display.textContent = note.replace('4','').replace('5',' HIGH');
      window.setTimeout(() => button.classList.remove('active'), 170);
    };

    // Capture phase makes this hotfix reliable even if an older listener fails.
    ['heroSoundButton','soundToggle'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', openModal, {
        capture:true
      });
    });

    closeButton?.addEventListener('click', closeModal, {
      capture:true
    });

    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal(event);
    }, { capture:true });

    modal.addEventListener('cancel', event => {
      event.preventDefault();
      closeModal(event);
    });

    modal.addEventListener('close', () => {
      modal.classList.remove('sv721-piano-open');
      setAudioFocus(false);
    });

    piano.querySelectorAll('.piano-key').forEach(button => {
      const play = event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        playNote(button);
      };
      button.addEventListener('pointerdown', play, { capture:true });
    });

    document.addEventListener('keydown', event => {
      if (!modal.open && !modal.hasAttribute('open')) return;

      if (event.key === 'Escape') {
        closeModal(event);
        return;
      }

      if (event.repeat) return;
      const button = piano.querySelector(`[data-key="${event.key.toLowerCase()}"]`);
      if (button) {
        event.preventDefault();
        playNote(button);
      }
    }, { capture:true });

    // Public recovery method for testing/debugging.
    window.sweetvilleClosePiano = closeModal;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
