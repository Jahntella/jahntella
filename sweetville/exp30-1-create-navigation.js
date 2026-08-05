(() => {
  'use strict';

  const tools = {
    coloring: 'coloringStudio',
    creative: 'creativeStudio',
    gallery: 'sweetvilleGallery',
    photo: 'photoBooth'
  };

  const routes = {
    'Living World': 'living-world.html',
    'Sphere': 'sphere.html',
    'Summer': 'bubblegum-bay.html#summerFestival',
    'Bubblegum Bay': 'bubblegum-bay.html',
    'Garden Market': 'garden-market.html',
    'Sweeties Stage': 'sweeties-stage.html',
    'My Room': 'sweetie-room.html',
    'Story': 'story.html',
    'Passport': 'passport.html',
    'Sweet Studio': 'studio.html'
  };

  const cleanupStyle = document.createElement('style');
  cleanupStyle.textContent = `
    #world { display: none !important; }
    #svNav a[href="#world"] { display: none !important; }
  `;
  document.head.appendChild(cleanupStyle);

  const params = new URLSearchParams(location.search);
  const intentionalDestination =
    params.has('tool') ||
    params.has('district') ||
    params.has('section') ||
    params.has('destination');

  const creativeHashes = new Set([
    '#photoBooth',
    '#coloringStudio',
    '#creativeStudio',
    '#sweetvilleGallery',
    '#createHub'
  ]);

  const revealTarget = id => {
    const target = document.getElementById(id);
    if (!target) return false;

    document.body.classList.add('exp260-explore-mode');
    document.querySelectorAll('main > section').forEach(section => {
      section.style.removeProperty('display');
    });

    document.getElementById('svCinematicIntro')?.classList.add('finished');
    document.getElementById('svCinematicIntro')?.setAttribute('aria-hidden', 'true');
    document.getElementById('gateScreen')?.classList.add('opened');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');

    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    return true;
  };

  const resetToWelcome = ({ smooth = false } = {}) => {
    if (intentionalDestination) return;

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    if (creativeHashes.has(location.hash)) {
      history.replaceState(null, '', location.pathname + location.search);
    }

    document.body.classList.remove('exp260-explore-mode');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');

    const target =
      document.getElementById('cinematicHome') ||
      document.getElementById('exp260Hub') ||
      document.querySelector('main');

    requestAnimationFrame(() => {
      if (target) {
        target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
      }
    });
  };

  window.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('svNav');

    nav?.querySelectorAll('a').forEach(link => {
      const label = link.textContent.trim();
      if (label === 'World') {
        link.remove();
        return;
      }
      if (routes[label]) link.setAttribute('href', routes[label]);
      if (label === 'Map') link.setAttribute('href', '#exp260Hub');
    });

    document.querySelectorAll('a[href="#livingMap"]').forEach(link => link.setAttribute('href', '#exp260Hub'));
    document.querySelectorAll('a[href="#summerFestival"]').forEach(link => link.setAttribute('href', 'bubblegum-bay.html#summerFestival'));
    document.querySelectorAll('a[href="#sweetvilleSphere"]').forEach(link => link.setAttribute('href', 'sphere.html'));
    document.querySelectorAll('a[href="#bedroom"]').forEach(link => link.setAttribute('href', 'sweetie-room.html'));
    document.querySelectorAll('a[href="#passport"]').forEach(link => link.setAttribute('href', 'passport.html'));

    const openButton = document.getElementById('openGates');
    openButton?.addEventListener('click', () => {
      resetToWelcome();
      setTimeout(() => resetToWelcome({ smooth: true }), 80);
      setTimeout(resetToWelcome, 650);
      setTimeout(resetToWelcome, 1750);
    }, { capture: true });
  });

  window.addEventListener('pageshow', () => {
    if (!intentionalDestination) {
      setTimeout(resetToWelcome, 0);
      setTimeout(resetToWelcome, 180);
    }
  });

  const requestedTool = params.get('tool');
  if (requestedTool && tools[requestedTool]) {
    window.addEventListener('load', () => {
      revealTarget(tools[requestedTool]);
      const mode = params.get('mode');
      if (mode) {
        setTimeout(() => {
          document.querySelector(`[data-mode="${CSS.escape(mode)}"]`)?.click();
        }, 500);
      }
    });
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = (link.getAttribute('href') || '').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    history.replaceState(null, '', `#${id}`);
    revealTarget(id);
    document.getElementById('svNav')?.classList.remove('open');
  });

  window.addEventListener('load', () => {
    if (!intentionalDestination && !location.hash) {
      setTimeout(resetToWelcome, 50);
      setTimeout(resetToWelcome, 500);
    }
  });
})();
