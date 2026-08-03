/* EXP 19.2 — Sweetville Sphere */
(() => {
  'use strict';

  const panel = document.getElementById('sweetvilleSphere');
  const lights = document.getElementById('exp192Lights');
  const crowd = document.getElementById('exp192Crowd');
  const finale = document.getElementById('exp192Finale');

  let lightsOn = false;
  let crowdOn = false;

  const updateFinaleLock = () => {
    const unlocked = lightsOn && crowdOn;
    if (finale) finale.disabled = !unlocked;
    const status = document.getElementById('exp192FinaleStatus');
    if (status) status.textContent = unlocked ? 'Ready' : 'Locked';
  };

  lights?.addEventListener('click', () => {
    lightsOn = !lightsOn;
    panel?.classList.toggle('lights-on', lightsOn);
    lights.textContent = lightsOn ? 'Dim the Sphere' : 'Light the Sphere';
    const status = document.getElementById('exp192LightStatus');
    if (status) status.textContent = lightsOn ? 'Glowing' : 'Ready';
    updateFinaleLock();
  });

  crowd?.addEventListener('click', () => {
    crowdOn = !crowdOn;
    panel?.classList.toggle('crowd-on', crowdOn);
    crowd.textContent = crowdOn ? 'Quiet the Crowd' : 'Hear the Sweeties';
    const status = document.getElementById('exp192CrowdStatus');
    if (status) status.textContent = crowdOn ? 'Singing' : 'Waiting';
    updateFinaleLock();
  });

  finale?.addEventListener('click', () => {
    if (!lightsOn || !crowdOn) return;
    panel?.classList.add('finale-on');
    document.getElementById('exp192SphereTitle').textContent = 'The Sweetville Sphere is alive.';
    document.getElementById('exp192SphereText').textContent = 'Lights sweep across the crowd while the final chorus fills the entire Sphere.';
    document.getElementById('exp192FinaleStatus').textContent = 'Launched';
    finale.textContent = 'Finale Launched ✨';
    window.sweetvilleLaunchFireworks?.(innerWidth * .3, innerHeight * .28, 18);
    setTimeout(() => window.sweetvilleLaunchFireworks?.(innerWidth * .72, innerHeight * .24, 18), 450);

    window.dispatchEvent(new CustomEvent('sweetville:experience', {
      detail:{key:'sweetville-sphere-finale',label:'Sweetville Sphere Finale'}
    }));
  });

  document.querySelector('[data-destination="Sweetville Sphere"]')?.addEventListener('click', () => {
    document.getElementById('exp192GoSphere')?.classList.add('active');
  });

  updateFinaleLock();
})();
