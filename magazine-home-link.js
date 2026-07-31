(() => {
  const MAGAZINE_URL = "sweeties-magazine/";
  const SWEETVILLE_URL = "sweetville/";

  function addMagazineExperience() {
    const nav = document.getElementById("siteNav");
    if (nav && !nav.querySelector('[data-magazine-link]')) {
      const navLink = document.createElement("a");
      navLink.href = MAGAZINE_URL;
      navLink.textContent = "Magazine";
      navLink.dataset.magazineLink = "true";
      nav.appendChild(navLink);
    }

    if (!document.getElementById("sweetiesMagazineFeature")) {
      const section = document.createElement("section");
      section.id = "sweetiesMagazineFeature";
      section.className = "sweeties-magazine-feature reveal";
      section.innerHTML = `
        <div class="sweeties-magazine-card">
          <div class="sweeties-magazine-cover-wrap">
            <img src="sweeties-magazine/images/cover.png" alt="Sweeties Magazine Issue 001 cover" loading="lazy">
            <span class="sweeties-magazine-sparkle" aria-hidden="true">♡</span>
          </div>
          <div class="sweeties-magazine-copy">
            <p class="eyebrow">SWEETIES MAGAZINE • ISSUE 001</p>
            <h2>Step inside the <em>world of Sweet.</em></h2>
            <p>Flip through Jahntella’s first digital magazine featuring her story, music, Sweetville, studio moments, stage memories, and a special letter to the Sweeties.</p>
            <a class="sweeties-magazine-button" href="${MAGAZINE_URL}">Read the Magazine <span aria-hidden="true">♡</span></a>
          </div>
        </div>`;

      const target = document.getElementById("registry") || document.getElementById("music");
      if (target?.parentNode) target.parentNode.insertBefore(section, target);
      else document.querySelector("main")?.appendChild(section);

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.14 });
        observer.observe(section);
      } else section.classList.add("in-view");
    }
  }

  function addSweetvilleEntry() {
    const nav = document.getElementById("siteNav");
    if (nav && !nav.querySelector('[data-sweetville-link]')) {
      const link = document.createElement("a");
      link.href = SWEETVILLE_URL;
      link.textContent = "Sweetville";
      link.dataset.sweetvilleLink = "true";
      nav.prepend(link);
    }

    const actions = document.querySelector(".hero-v5 .hero-actions");
    if (actions && !actions.querySelector(".sweetville-entry-button")) {
      const button = document.createElement("a");
      button.className = "secondary-button sweetville-entry-button";
      button.href = SWEETVILLE_URL;
      button.innerHTML = '<span>OPEN THE GATES</span><small>ENTER SWEETVILLE →</small>';
      actions.appendChild(button);
    }
  }

  function initializeBuild30() {
    addSweetvilleEntry();
    addMagazineExperience();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeBuild30);
  else initializeBuild30();
})();
