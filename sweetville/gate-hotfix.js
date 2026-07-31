(() => {
  'use strict';
  const gate = document.getElementById('gateScreen');
  const button = document.getElementById('openGates');
  if (!gate || !button) return;

  const openGate = () => {
    gate.classList.add('opening');
    try { sessionStorage.setItem('sweetvilleGatesOpened', 'yes'); } catch (_) {}
    window.setTimeout(() => gate.classList.add('opened'), 1700);
  };

  button.addEventListener('click', openGate);
  button.addEventListener('touchend', (event) => {
    event.preventDefault();
    openGate();
  }, { passive: false });
})();
