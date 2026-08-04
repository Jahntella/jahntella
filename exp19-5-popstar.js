/* EXP 19.5 — Pop Star Badge Sparkles */
(() => {
  'use strict';

  const layer = document.getElementById('exp195Sparkles');
  if (!layer) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const amount = reduced ? 8 : 24;

  for (let i = 0; i < amount; i++) {
    const sparkle = document.createElement('i');
    sparkle.style.left = `${4 + Math.random() * 92}%`;
    sparkle.style.top = `${5 + Math.random() * 90}%`;
    sparkle.style.setProperty('--d', `${2.2 + Math.random() * 3.5}s`);
    sparkle.style.animationDelay = `${Math.random() * -5}s`;
    layer.appendChild(sparkle);
  }
})();
