(() => {
  'use strict';
  if (window.__jahntellaWorldTourExperience) return;
  window.__jahntellaWorldTourExperience = true;
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;

  const findSweetEraAlbumSection = () => {
    const label = Array.from(document.querySelectorAll('p,.eyebrow')).find(node =>
      node.textContent.trim().toUpperCase() === 'THE ALBUM'
    );
    return label?.closest('section') || Array.from(document.querySelectorAll('section')).find(section =>
      /THE ALBUM/i.test(section.textContent) && /Welcome to\s*The Sweet Era/i.test(section.textContent)
    );
  };

  const build = () => {
    if (document.getElementById('worldTourConcertExperience')) return;

    const section = document.createElement('section');
    section.id = 'worldTourConcertExperience';
    section.className = 'world-tour-concert-experience';
    section.setAttribute('aria-labelledby', 'worldTourConcertTitle');
    section.innerHTML = `
      <div class="world-tour-concert-shell">
        <header class="world-tour-concert-heading">
          <p>THE SWEET ERA <span aria-hidden="true">✦</span> THE SHINE ERA</p>
          <h2 id="worldTourConcertTitle">Enter the <em>Concert Experience.</em></h2>
          <span>Click the poster to begin the complete playlist with Fun Dipp.</span>
        </header>
        <button class="world-tour-concert-poster" type="button" aria-label="Start the Concert Experience playlist with Fun Dipp">
          <img src="assets/jahntella-imagine-world-tour.webp" alt="Jahntella Imagine World Tour poster featuring The Sweet Era and The Shine Era" width="1024" height="1536" decoding="async">
          <span class="world-tour-concert-play" aria-hidden="true"><b>▶</b><strong>START THE CONCERT EXPERIENCE</strong><small>PLAY FROM FUN DIPP</small></span>
        </button>
      </div>`;

    section.querySelector('button').addEventListener('click', () => {
      window.jahntellaStopShineEraTrack?.();
      window.setTimeout(() => {
        window.jahntellaSelectSiteTrack?.('fun-dipp', true, {fresh:true});
        document.getElementById('player')?.scrollIntoView({behavior:'smooth', block:'nearest'});
      }, 0);
    });

    const placeBeforeSweetEraAlbum = () => {
      const albumSection = findSweetEraAlbumSection();
      if (!albumSection?.parentNode) return false;
      if (albumSection.previousElementSibling !== section) albumSection.parentNode.insertBefore(section, albumSection);
      return true;
    };

    if (!placeBeforeSweetEraAlbum()) document.body.appendChild(section);
    [50, 250, 750, 1500, 3000].forEach(delay => window.setTimeout(placeBeforeSweetEraAlbum, delay));
    window.addEventListener('load', placeBeforeSweetEraAlbum, {once:true});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build, {once:true});
  else build();
})();
