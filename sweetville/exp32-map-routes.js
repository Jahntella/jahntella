(() => {
  'use strict';

  const SPHERE_ROUTE = 'sphere.html';

  const forceSphereRoutes = () => {
    document.querySelectorAll(
      '.exp291-hotspot[data-district="Sweetville Sphere"]'
    ).forEach(link => {
      link.setAttribute('href', SPHERE_ROUTE);
      link.removeAttribute('data-target');
    });

    document.querySelectorAll('#svNav a').forEach(link => {
      const label = link.textContent.trim().toLowerCase();
      const href = link.getAttribute('href') || '';

      if (
        label === 'sphere' ||
        href === '#sweetvilleSphere' ||
        href.includes('sweetvilleSphere')
      ) {
        link.setAttribute('href', SPHERE_ROUTE);
      }
    });

    document.querySelectorAll(
      'a[href="#sweetvilleSphere"], a[href*="sweetvilleSphere"]'
    ).forEach(link => {
      link.setAttribute('href', SPHERE_ROUTE);
    });

    document.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link) return;

      const label = link.textContent.trim().toLowerCase();
      const href = link.getAttribute('href') || '';
      const district = link.dataset.district || '';

      const isSphereLink =
        district === 'Sweetville Sphere' ||
        label === 'sphere' ||
        href === '#sweetvilleSphere' ||
        href.includes('sweetvilleSphere');

      if (!isSphereLink) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      window.location.assign(SPHERE_ROUTE);
    }, true);
  };

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      forceSphereRoutes,
      { once: true }
    );
  } else {
    forceSphereRoutes();
  }
})();