(() => {
  const MAGAZINE_URL = "sweeties-magazine/";

  function addMagazineExperience() {
    const nav = document.getElementById("siteNav");
    if (nav && !nav.querySelector('[data-magazine-link]')) {
      const navLink = document.createElement("a");
      navLink.href = MAGAZINE_URL;
      navLink.textContent = "Magazine";
      navLink.dataset.magazineLink = "true";
      nav.appendChild(navLink);
    }

    if (document.getElementById("sweetiesMagazineFeature")) return;

    const section = document.createElement("section");
    section.id = "sweetiesMagazineFeature";
    section.className = "sweeties-magazine-feature reveal";
    section.innerHTML = `
      <div class="sweeties-magazine-card">
        <div class="sweeties-magazine-cover-wrap">
          <img
            src="sweeties-magazine/images/cover.png"
            alt="Sweeties Magazine Issue 001 cover"
            loading="lazy"
          >
          <span class="sweeties-magazine-sparkle" aria-hidden="true">♡</span>
        </div>

        <div class="sweeties-magazine-copy">
          <p class="eyebrow">SWEETIES MAGAZINE • ISSUE 001</p>
          <h2>Step inside the <em>world of Sweet.</em></h2>
          <p>
            Flip through Jahntella’s first digital magazine featuring her story,
            music, Sweetville, studio moments, stage memories, and a special
            letter to the Sweeties.
          </p>
          <a class="sweeties-magazine-button" href="${MAGAZINE_URL}">
            Read the Magazine <span aria-hidden="true">♡</span>
          </a>
        </div>
      </div>
    `;

    const registry = document.getElementById("registry");
    const music = document.getElementById("music");
    const target = registry || music;

    if (target?.parentNode) {
      target.parentNode.insertBefore(section, target);
    } else {
      document.querySelector("main")?.appendChild(section);
    }

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
    } else {
      section.classList.add("in-view");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addMagazineExperience);
  } else {
    addMagazineExperience();
  }
})();
