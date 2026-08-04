/* EXP 19.4 — Sphere Encore */
(() => {
  'use strict';

  const panel = document.getElementById('sweetvilleSphere');
  const stage = document.getElementById('exp193SphereStage');
  const lights = document.getElementById('exp192Lights');
  const crowd = document.getElementById('exp192Crowd');
  const finale = document.getElementById('exp192Finale');
  const slides = [...document.querySelectorAll('[data-sphere-slide]')];
  const dots = [...document.querySelectorAll('[data-sphere-dot]')];
  const prev = document.getElementById('exp193SpherePrev');
  const next = document.getElementById('exp193SphereNext');
  const confetti = document.getElementById('exp193Confetti');
  const sweetiesCount = document.getElementById('exp194SweetiesCount');

  let lightsOn = false;
  let crowdOn = false;
  let currentSlide = 0;
  let autoTimer = null;
  let resumeTimer = null;
  let finaleTimer = null;
  let finaleStepTimer = null;
  let audioContext = null;
  let crowdSource = null;
  let crowdGain = null;
  let sweeties = 0;

  const showSlide = index => {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  };

  const stopAuto = () => {
    clearInterval(autoTimer);
    autoTimer = null;
  };

  const startAuto = () => {
    stopAuto();
    if (document.hidden || panel?.classList.contains('finale-running')) return;
    autoTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
  };

  const pauseAndResume = () => {
    stopAuto();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAuto, 7000);
  };

  prev?.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    pauseAndResume();
  });

  next?.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    pauseAndResume();
  });

  dots.forEach(dot => dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.sphereDot));
    pauseAndResume();
  }));

  stage?.addEventListener('mouseenter', stopAuto);
  stage?.addEventListener('mouseleave', startAuto);
  stage?.addEventListener('touchstart', pauseAndResume, {passive:true});

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });

  const updateFinaleLock = () => {
    const unlocked = lightsOn && crowdOn;
    if (finale) finale.disabled = !unlocked;
    const status = document.getElementById('exp192FinaleStatus');
    if (status && !panel?.classList.contains('finale-running')) {
      status.textContent = unlocked ? 'Ready' : 'Locked';
    }
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

  const animateSweeties = target => {
    const start = sweeties;
    const duration = 1100;
    const started = performance.now();

    const tick = now => {
      const progress = Math.min(1, (now - started) / duration);
      sweeties = Math.round(start + (target - start) * progress);
      if (sweetiesCount) sweetiesCount.textContent = sweeties.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  lights?.addEventListener('click', () => {
    lightsOn = !lightsOn;
    panel?.classList.toggle('lights-on', lightsOn);
    panel?.classList.toggle('sphere-active', lightsOn || crowdOn);
    lights.textContent = lightsOn ? 'Dim the Sphere' : 'Light the Sphere';
    const status = document.getElementById('exp192LightStatus');
    if (status) status.textContent = lightsOn ? 'Glowing' : 'Ready';
    updateFinaleLock();
  });

  crowd?.addEventListener('click', async () => {
    crowdOn = !crowdOn;
    panel?.classList.toggle('crowd-on', crowdOn);
    panel?.classList.toggle('sphere-active', lightsOn || crowdOn);
    crowd.textContent = crowdOn ? 'Quiet the Sweeties' : 'Hear the Sweeties';

    const status = document.getElementById('exp192CrowdStatus');
    if (status) status.textContent = crowdOn ? 'Cheering' : 'Waiting';

    if (crowdOn) {
      await startCrowdSound();
      burstConfetti(18);
      animateSweeties(12500 + Math.floor(Math.random() * 7500));
    } else {
      stopCrowdSound();
      animateSweeties(0);
    }

    updateFinaleLock();
  });

  const stopFinale = () => {
    clearTimeout(finaleTimer);
    clearInterval(finaleStepTimer);
    finaleTimer = null;
    finaleStepTimer = null;
    panel?.classList.remove('finale-running');
    if (finale) finale.textContent = 'Launch the Finale';
    updateFinaleLock();
    startAuto();
  };

  const launchFinale = () => {
    if (!lightsOn || !crowdOn) return;

    stopFinale();
    stopAuto();

    panel?.classList.add('finale-on', 'finale-running');
    document.getElementById('exp192SphereTitle').textContent = 'The Sweetville Sphere is alive.';
    document.getElementById('exp192SphereText').textContent =
      'The stage changes through every performance while lights, cheers, fireworks, and confetti fill the Sphere.';
    document.getElementById('exp192FinaleStatus').textContent = 'Live';
    finale.textContent = 'Restart Finale ✨';

    animateSweeties(25000 + Math.floor(Math.random() * 25000));
    burstConfetti(30);

    let step = 0;
    finaleStepTimer = setInterval(() => {
      step += 1;
      showSlide(currentSlide + 1);
      burstConfetti(26);

      window.sweetvilleLaunchFireworks?.(
        innerWidth * (.22 + Math.random() * .56),
        innerHeight * (.15 + Math.random() * .28),
        14
      );
    }, 900);

    finaleTimer = setTimeout(() => {
      clearInterval(finaleStepTimer);
      finaleStepTimer = null;
      panel?.classList.remove('finale-running');
      document.getElementById('exp192FinaleStatus').textContent = 'Encore Ready';
      finale.textContent = 'Launch Finale Again';
      startAuto();
    }, 6500);

    window.dispatchEvent(new CustomEvent('sweetville:experience', {
      detail:{key:'sweetville-sphere-finale',label:'Sweetville Sphere Finale'}
    }));
  };

  finale?.addEventListener('click', launchFinale);

  document.querySelector('[data-destination="Sweetville Sphere"]')?.addEventListener('click', () => {
    document.getElementById('exp192GoSphere')?.classList.add('active');
  });

  updateFinaleLock();
  showSlide(0);
  startAuto();
})();
