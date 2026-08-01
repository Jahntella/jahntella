
/* SWEETVILLE 5.0 — Living World patch */
(() => {
  const apply = () => {
    const lake = document.querySelector('.live-lagoon .live-district-effects');
    if (lake) {
      lake.querySelectorAll('.lake-ripple,.lr1,.lr2').forEach(el => el.remove());
      if (!lake.querySelector('.lake-water-mask')) {
        const mask = document.createElement('span');
        mask.className = 'lake-water-mask';
        [...lake.children].forEach(child => mask.appendChild(child));
        lake.appendChild(mask);
      }
    }

    const hero = document.getElementById('cinematicHome');
    if (hero && !document.getElementById('mochiGuide')) {
      const mochi = document.createElement('div');
      mochi.className = 'mochi-guide';
      mochi.id = 'mochiGuide';
      mochi.setAttribute('aria-hidden', 'true');
      mochi.innerHTML = '<span class="mochi-face">🐶</span><i></i>';
      hero.appendChild(mochi);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
