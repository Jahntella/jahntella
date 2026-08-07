(() => {
  'use strict';

  const ROUTES = {
    'Bubblegum Bay': 'bubblegum-bay.html',
    'Garden Market': 'garden-market.html',
    "Mochi's Area": 'mochi.html',
    'Sweetville Sphere': 'sphere.html',
    'Sweeties Stage': 'sweeties-stage.html',
    'Sparkle Lake': 'sparkle-lake.html',
    'Pink Café': 'pink-cafe.html',
    'Story Book': 'story.html',
    'Carnival': 'carnival.html',
    'Candy Lane': 'candy-lane.html',
    'Donut District': 'donut-district.html',
    'Starlight Stage': 'starlight-stage.html',
    'Sweet Express Station': 'sweet-express.html'
  };

  const installRoutes = () => {
    document.querySelectorAll('.exp291-hotspot[data-district]').forEach(link => {
      const route = ROUTES[link.dataset.district];
      if (!route) return;

      link.setAttribute('href', route);
      link.removeAttribute('data-target');

      link.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        window.location.assign(route);
      }, true);
    });

    document.querySelectorAll('#svNav a').forEach(link => {
      const label = link.textContent.trim().toLowerCase();
      const href = link.getAttribute('href') || '';

      if (
        label === 'sphere' ||
        href === '#sweetvilleSphere' ||
        href.includes('sweetvilleSphere')
      ) {
        link.setAttribute('href', 'sphere.html');
      }
    });

    document.querySelectorAll(
      'a[href="#sweetvilleSphere"], a[href*="sweetvilleSphere"]'
    ).forEach(link => {
      link.setAttribute('href', 'sphere.html');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installRoutes, { once: true });
  } else {
    installRoutes();
  }
})();
