/* SWEETVILLE EXP 7.0 — ENGINE CORE */
(() => {
  'use strict';

  const registry = new Map();

  const register = (name, init) => {
    if (registry.has(name)) return;
    registry.set(name, { init, started:false });
  };

  const start = (name) => {
    const mod = registry.get(name);
    if (!mod || mod.started) return;
    mod.started = true;
    try {
      mod.init?.();
    } catch (error) {
      console.error(`[Sweetville Engine] ${name} failed`, error);
      window.dispatchEvent(new CustomEvent('sweetville:module-error', {
        detail:{ name, message:error?.message || String(error) }
      }));
    }
  };

  const startAll = () => registry.forEach((_, name) => start(name));

  window.SweetvilleEngine = { register, start, startAll, registry };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAll, { once:true });
  } else {
    startAll();
  }
})();
