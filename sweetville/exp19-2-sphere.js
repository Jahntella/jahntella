/* EXP 19.3 — Interactive Sweetville Sphere */
(() => {
  'use strict';

  const panel = document.getElementById('sweetvilleSphere');
  const lights = document.getElementById('exp192Lights');
  const crowd = document.getElementById('exp192Crowd');
  const finale = document.getElementById('exp192Finale');
  const slides = [...document.querySelectorAll('[data-sphere-slide]')];
  const dots = [...document.querySelectorAll('[data-sphere-dot]')];
  const prev = document.getElementById('exp193SpherePrev');
  const next = document.getElementById('exp193SphereNext');
  const confetti = document.getElementById('exp193Confetti');

  let lightsOn = false;
  let crowdOn = false;
  let currentSlide = 0;
  let audioContext = null;
  let crowdSource = null;
  let crowdGain = null;

  const showSlide = index => {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  };

  prev?.addEventListener('click', () => showSlide(currentSlide - 1));
  next?.addEventListener('click', () => showSlide(currentSlide + 1));
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.sphereDot))));

  const updateFinaleLock = () => {
    const unlocked = lightsOn && crowdOn;
    if (finale) finale.disabled = !unlocked;
    const status = document.getElementById('exp192FinaleStatus');
    if (status) status.textContent = unlocked ? 'Ready' : 'Locked';
  };

  const startCrowdSound = async () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    audioContext ??= new AudioCtx();
    if (audioContext.state === 'suspended') await audioContext.resume();
    if (crowdSource) return;

    const seconds = 3;
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * seconds, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const noise = Math.random() * 2 - 1;
      const wave = Math.sin(i / 65) * .2 + Math.sin(i / 19) * .08;
      data[i] = (noise * .28 + wave) * (0.65 + Math.sin(i / 9000) * .25);
    }

    crowdSource = audioContext.createBufferSource();
    crowdSource.buffer = buffer;
    crowdSource.loop = true;

    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1800;

    crowdGain = audioContext.createGain();
    crowdGain.gain.setValueAtTime(.0001, audioContext.currentTime);
    crowdGain.gain.exponentialRampToValueAtTime(.13, audioContext.currentTime + .45);

    crowdSource.connect(lowpass).connect(crowdGain).connect(audioContext.destination);
    crowdSource.start();
  };

  const stopCrowdSound = () => {
    if (!crowdSource || !audioContext) return;
    crowdGain?.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .3);
    setTimeout(() => {
      try { crowdSource?.stop(); } catch {}
      crowdSource = null;
      crowdGain = null;
    }, 350);
  };

  const burstConfetti = amount => {
    if (!confetti) return;
    confetti.innerHTML = '';
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement('i');
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * .65}s`;
      piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
      piece.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
      confetti.appendChild(piece);
    }
    setTimeout(() => confetti.innerHTML = '', 4300);
  };

  lights?.addEventListener('click', () => {
    lightsOn = !lightsOn;
    panel?.classList.toggle('lights-on', lightsOn);
    lights.textContent = lightsOn ? 'Dim the Sphere' : 'Light the Sphere';
    const status = document.getElementById('exp192LightStatus');
    if (status) status.textContent = lightsOn ? 'Glowing' : 'Ready';
    updateFinaleLock();
  });

  crowd?.addEventListener('click', async () => {
    crowdOn = !crowdOn;
    panel?.classList.toggle('crowd-on', crowdOn);
    crowd.textContent = crowdOn ? 'Quiet the Sweeties' : 'Hear the Sweeties';
    const status = document.getElementById('exp192CrowdStatus');
    if (status) status.textContent = crowdOn ? 'Cheering' : 'Waiting';

    if (crowdOn) {
      await startCrowdSound();
      burstConfetti(18);
    } else {
      stopCrowdSound();
    }
    updateFinaleLock();
  });

  finale?.addEventListener('click', () => {
    if (!lightsOn || !crowdOn) return;

    panel?.classList.add('finale-on');
    document.getElementById('exp192SphereTitle').textContent = 'The Sweetville Sphere is alive.';
    document.getElementById('exp192SphereText').textContent =
      'The stage changes through every performance while lights, cheers, and confetti fill the Sphere.';
    document.getElementById('exp192FinaleStatus').textContent = 'Launched';
    finale.textContent = 'Finale Launched ✨';

    let step = 0;
    const sequence = setInterval(() => {
      step += 1;
      showSlide(step);
      burstConfetti(24);
      window.sweetvilleLaunchFireworks?.(
        innerWidth * (.25 + Math.random() * .5),
        innerHeight * (.18 + Math.random() * .22),
        12
      );
      if (step >= 5) clearInterval(sequence);
    }, 850);

    window.dispatchEvent(new CustomEvent('sweetville:experience', {
      detail:{key:'sweetville-sphere-finale',label:'Sweetville Sphere Finale'}
    }));
  });

  document.querySelector('[data-destination="Sweetville Sphere"]')?.addEventListener('click', () => {
    document.getElementById('exp192GoSphere')?.classList.add('active');
  });

  updateFinaleLock();
  showSlide(0);
})();
