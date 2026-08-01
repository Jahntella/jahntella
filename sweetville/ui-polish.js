/* SWEETVILLE EXP 8.0.1 — UI POLISH */
(() => {
  'use strict';

  const typeMessage = (element, text) => {
    if (!element || element.dataset.exp801Typed === 'true') return;
    element.dataset.exp801Typed = 'true';
    element.textContent = '';
    let index = 0;

    const write = () => {
      element.textContent += text[index] || '';
      index += 1;
      if (index < text.length) {
        window.setTimeout(write, 22);
      }
    };

    write();
  };

  const greetingText = document.getElementById('exp80GreetingText');
  if (greetingText) {
    const text = greetingText.textContent.trim();
    window.setTimeout(() => typeMessage(greetingText, text), 350);
  }

  const welcome = document.querySelector('.exp80-welcome-card');
  if (welcome && !welcome.querySelector('.exp801-signature')) {
    const signature = document.createElement('div');
    signature.className = 'exp801-signature';
    signature.innerHTML = '<span>Love,</span><strong>Jahntella 💋</strong>';
    welcome.appendChild(signature);
  }

  const keepsake = document.getElementById('exp80KeepsakeCard');
  if (keepsake && !keepsake.querySelector('.exp801-postmark')) {
    const mark = document.createElement('div');
    mark.className = 'exp801-postmark';
    mark.innerHTML = '<span>SWEETVILLE</span><small>WITH LOVE</small>';
    keepsake.appendChild(mark);
  }

  const smileCard = document.getElementById('exp80SmileCard');
  if (smileCard && !smileCard.querySelector('.exp801-paws')) {
    const paws = document.createElement('div');
    paws.className = 'exp801-paws';
    paws.setAttribute('aria-hidden', 'true');
    paws.textContent = '🐾  🐾';
    smileCard.appendChild(paws);
  }

  const decorateButtons = () => {
    document.querySelectorAll(
      '.exp80-moments-panel button,.exp80-moments-panel .sv-button'
    ).forEach(button => {
      if (button.dataset.exp801Ready === 'true') return;
      button.dataset.exp801Ready = 'true';
      button.classList.add('exp801-candy-button');

      const sparkle = document.createElement('span');
      sparkle.className = 'exp801-button-sparkle';
      sparkle.setAttribute('aria-hidden', 'true');
      sparkle.textContent = '✦';
      button.appendChild(sparkle);
    });
  };

  decorateButtons();

  new MutationObserver(decorateButtons).observe(
    document.getElementById('littleMoments') || document.body,
    { childList:true, subtree:true }
  );

  document.getElementById('exp80NewSmile')?.addEventListener('click', () => {
    const card = document.getElementById('exp80SmileCard');
    card?.classList.remove('exp801-card-flip');
    void card?.offsetWidth;
    card?.classList.add('exp801-card-flip');
  });

  document.getElementById('exp80SaveKeepsake')?.addEventListener('click', () => {
    const card = document.getElementById('exp80KeepsakeCard');
    card?.classList.add('exp801-saved');
  });

  document.getElementById('exp80BeginMoment')?.addEventListener('click', () => {
    document.querySelector('.exp80-welcome-card')?.classList.add('exp801-warm');
    window.setTimeout(() => {
      document.querySelector('.exp80-welcome-card')?.classList.remove('exp801-warm');
    }, 1800);
  });
})();
