/* EXP 42.0 — Shared music playback and Sweet Express energy */
(() => {
  'use strict';

  const STORAGE_KEY = 'jahntellaSweetEnergyV25';
  const LEGACY_KEY = 'jahntellaFunDippCompletedListensV25';
  const GOAL = 10;
  const CREDIT_THRESHOLD = 0.90;
  const players = [...document.querySelectorAll('[data-exp42-player]')];

  if (!players.length) return;

  const primaryRaw = localStorage.getItem(STORAGE_KEY);
  const primary = Number(primaryRaw);
  const legacy = Number(localStorage.getItem(LEGACY_KEY));
  let count = Math.max(
    0,
    Math.min(
      GOAL,
      primaryRaw !== null && Number.isFinite(primary) && primary > 0
        ? primary
        : (Number.isFinite(legacy) ? legacy : 0)
    )
  );

  const audios = players
    .map(player => player.querySelector('audio[data-exp42-audio]'))
    .filter(Boolean);
  const sessions = new WeakMap();
  let toastTimer;

  const getToast = () => {
    let toast = document.querySelector('.exp42-toast');
    if (toast) return toast;

    toast = document.createElement('div');
    toast.className = 'exp42-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    return toast;
  };

  const showToast = message => {
    const toast = getToast();
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, String(count));
  };

  const defaultStatus = () => {
    if (count >= GOAL) {
      return 'The Sweet Express is fully powered. Your ticket is ready!';
    }
    const remaining = GOAL - count;
    return `${remaining} completed listen${remaining === 1 ? '' : 's'} until the Sweet Express is fully powered.`;
  };

  const render = (message = '') => {
    document.querySelectorAll('[data-exp42-count]').forEach(node => {
      node.textContent = String(count);
    });

    document.querySelectorAll('[data-exp42-progress]').forEach(node => {
      node.style.width = `${Math.min(100, (count / GOAL) * 100)}%`;
    });

    document.querySelectorAll('[data-exp42-status]').forEach(node => {
      node.textContent = message || defaultStatus();
    });

    document.querySelectorAll('[data-exp42-express-link]').forEach(link => {
      link.classList.toggle('is-unlocked', count >= GOAL);
      link.textContent = count >= GOAL
        ? '🚂 Ride the Sweet Express — Ready!'
        : '🚂 Visit the Sweet Express';
    });
  };

  const awardCredit = title => {
    if (count >= GOAL) return;

    count += 1;
    save();

    const message = count >= GOAL
      ? `${title} added the final Sweet Energy! The Sweet Express is ready.`
      : `${title} added +1 Sweet Energy! ${GOAL - count} remaining.`;

    render(message);
    showToast(message);
    window.dispatchEvent(new CustomEvent('jahntella:sweet-energy', {
      detail: {count, goal: GOAL, title}
    }));
  };

  const setButtonState = (audio, playing) => {
    const player = audio.closest('[data-exp42-player]');
    if (!player) return;

    const title = audio.dataset.exp42Title || 'Jahntella';
    player.querySelectorAll('[data-exp42-play]').forEach(button => {
      button.dataset.exp42IdleLabel ||= button.textContent.trim();
      button.classList.toggle('is-playing', playing);
      button.setAttribute('aria-pressed', String(playing));
      button.textContent = playing
        ? `❚❚ Pause ${title}`
        : button.dataset.exp42IdleLabel;
    });

    player.querySelectorAll('[data-exp42-now]').forEach(node => {
      node.textContent = playing ? 'NOW PLAYING' : 'READY TO PLAY';
    });
  };

  audios.forEach(audio => {
    const title = audio.dataset.exp42Title || 'Jahntella';
    sessions.set(audio, {credited: false});

    audio.addEventListener('play', () => {
      audios.forEach(other => {
        if (other !== audio && !other.paused) other.pause();
      });

      const session = sessions.get(audio);
      if (audio.currentTime < 5 || audio.ended) session.credited = false;
      setButtonState(audio, true);
    });

    audio.addEventListener('pause', () => setButtonState(audio, false));

    audio.addEventListener('timeupdate', () => {
      const session = sessions.get(audio);
      if (
        session.credited ||
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0
      ) return;

      if ((audio.currentTime / audio.duration) >= CREDIT_THRESHOLD) {
        session.credited = true;
        awardCredit(title);
      }
    });

    audio.addEventListener('ended', () => {
      const session = sessions.get(audio);
      setButtonState(audio, false);
      if (!session.credited) {
        session.credited = true;
        awardCredit(title);
      }
    });

    audio.addEventListener('seeked', () => {
      if (audio.currentTime < 5) sessions.get(audio).credited = false;
    });
  });

  players.forEach(player => {
    const audio = player.querySelector('audio[data-exp42-audio]');
    if (!audio) return;

    player.querySelectorAll('[data-exp42-play]').forEach(button => {
      button.dataset.exp42IdleLabel ||= button.textContent.trim();
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', async () => {
        if (!audio.paused) {
          audio.pause();
          return;
        }

        try {
          await audio.play();
        } catch {
          showToast('Tap play once more to start the music.');
        }
      });
    });
  });

  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    const next = Number(event.newValue);
    if (!Number.isFinite(next)) return;
    count = Math.max(0, Math.min(GOAL, next));
    render();
  });

  save();
  render();
})();
