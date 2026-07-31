
(() => {
  const locations = [
    {slug:"neon-sweetheart", id:"SV-005", title:"Neon Sweetheart", image:"assets/sv-005-neon-sweetheart.png", story:"At the center of Sweetville nightlife, Neon Sweetheart is where confidence meets the dancefloor. The lights glow brighter whenever someone chooses courage over doubt.", quote:"Neon lights. Sweet nights. A heart that shines brightest after dark.", reward:"Your heart was never too much. It was always your light."},
    {slug:"donut-district", id:"SV-006", title:"Donut District", image:"assets/sv-006-donut-district.png", story:"Donut District is Sweetville's candy-colored cruising lane, where every turn feels playful and no destination matters more than the friends beside you.", quote:"Leave a trail of sprinkles and make every ride an unforgettable adventure.", reward:"Joy does not have to be earned. Sometimes it is the whole point."},
    {slug:"melody-studio", id:"SV-007", title:"Melody Studio", image:"assets/sv-007-melody-studio.png", story:"This is where Jahntella turns tiny ideas into songs. Every notebook page, microphone glow, and unfinished melody holds the beginning of something bigger.", quote:"Every song starts with a tiny idea and a heart brave enough to sing it.", reward:"Your voice matters before the world applauds it."},
    {slug:"sparkle-lake", id:"SV-008", title:"Sparkle Lake", image:"assets/sv-008-sparkle-lake.png", story:"Sparkle Lake reflects more than stars. Sweeties visit when they need to remember their own worth and let the quiet make their dreams feel possible again.", quote:"The stars always seem brighter when you remember that you are your own fairytale.", reward:"Rest is not quitting. Quiet can be part of becoming."},
    {slug:"pink-cafe", id:"SV-009", title:"Pink Café", image:"assets/sv-009-pink-cafe.png", story:"Pink Café is Jahntella's favorite place to slow down, write a note of gratitude, and begin again with something warm, sweet, and hopeful.", quote:"Slow down, make yourself a priority, and start the day with gratitude.", reward:"You are allowed to begin again as many times as you need."}
  ];

  const badges = [
    {id:"first-step", icon:"👣", title:"First Step", test:s=>s.visited.length>=1, note:"Visit your first location"},
    {id:"sweet-explorer", icon:"🗺️", title:"Sweet Explorer", test:s=>s.visited.length>=3, note:"Visit three locations"},
    {id:"world-traveler", icon:"🌎", title:"World Traveler", test:s=>s.visited.length===5, note:"Visit every open location"},
    {id:"heart-finder", icon:"💖", title:"Heart Finder", test:s=>s.hearts.length>=1, note:"Find your first hidden heart"},
    {id:"heart-hunter", icon:"✨", title:"Heart Hunter", test:s=>s.hearts.length>=3, note:"Find three hidden hearts"},
    {id:"super-sweetie", icon:"👑", title:"Super Sweetie", test:s=>s.hearts.length===5 && s.visited.length===5, note:"Complete the full v1.1 journey"}
  ];

  const KEY = "jahntellaSweetvilleV1";
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {visited:[], hearts:[], badges:[]}; }
    catch { return {visited:[], hearts:[], badges:[]}; }
  };
  let state = read();
  state.visited = [...new Set(state.visited || [])];
  state.hearts = [...new Set(state.hearts || [])];
  state.badges = [...new Set(state.badges || [])];

  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const $ = id => document.getElementById(id);

  const modal = $("locationModal"), modalClose = $("modalClose"), modalImage = $("modalImage"),
    modalCardId = $("modalCardId"), modalTitle = $("modalTitle"), modalStory = $("modalStory"),
    modalQuote = $("modalQuote"), stampButton = $("stampButton"), hiddenHeart = $("hiddenHeart"),
    heartStatus = $("heartStatus"), stampGrid = $("stampGrid"), locationGrid = $("locationGrid"),
    badgeGrid = $("badgeGrid"), rewardGrid = $("rewardGrid"), visitedCount = $("visitedCount"),
    heartCount = $("heartCount"), badgeCount = $("badgeCount"), passportBar = $("passportBar"),
    secretEnding = $("secretEnding"), achievementToast = $("achievementToast"),
    toastIcon = $("toastIcon"), toastTitle = $("toastTitle"), menuButton = $("menuButton"), svNav = $("svNav");

  let active = null;
  let toastTimer = null;

  const showToast = badge => {
    toastIcon.textContent = badge.icon;
    toastTitle.textContent = badge.title;
    achievementToast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => achievementToast.classList.remove("show"), 3200);
  };

  const evaluateBadges = (announce = true) => {
    badges.forEach(badge => {
      if (badge.test(state) && !state.badges.includes(badge.id)) {
        state.badges.push(badge.id);
        if (announce) showToast(badge);
      }
    });
    save();
  };

  const render = () => {
    evaluateBadges(false);

    stampGrid.innerHTML = locations.map(loc => {
      const visited = state.visited.includes(loc.slug);
      return `<article class="stamp ${visited ? "visited" : ""}">
        <span class="seal">${visited ? "💖" : "♡"}</span>
        <strong>${loc.title}</strong>
        <small>${visited ? "PASSPORT STAMPED" : "NOT YET VISITED"}</small>
      </article>`;
    }).join("");

    badgeGrid.innerHTML = badges.map(badge => {
      const unlocked = state.badges.includes(badge.id);
      return `<article class="badge ${unlocked ? "unlocked" : "locked"}">
        <span class="badge-icon">${unlocked ? badge.icon : "?"}</span>
        <strong>${badge.title}</strong>
        <small>${unlocked ? "UNLOCKED" : badge.note}</small>
      </article>`;
    }).join("");

    rewardGrid.innerHTML = locations.map((loc, index) => {
      const unlocked = state.hearts.includes(loc.slug);
      return `<article class="reward ${unlocked ? "unlocked" : "locked"}">
        <span class="reward-icon">${unlocked ? "💌" : "♡"}</span>
        <strong>Heart ${index + 1}</strong>
        <small>${unlocked ? loc.reward : "Find this heart to reveal a message"}</small>
      </article>`;
    }).join("");

    locationGrid.innerHTML = locations.map(loc => `
      <article class="location-card" data-location="${loc.slug}" tabindex="0" role="button" aria-label="Enter ${loc.title}">
        <img src="${loc.image}" alt="${loc.title} Sweet Vault card">
        <div><small>${loc.id}</small><strong>${loc.title}</strong><small>${state.visited.includes(loc.slug) ? "Visited ✓" : "Enter location →"}</small></div>
      </article>`).join("");

    visitedCount.textContent = state.visited.length;
    heartCount.textContent = state.hearts.length;
    badgeCount.textContent = state.badges.length;
    passportBar.style.width = `${((state.visited.length + state.hearts.length) / 10) * 100}%`;
    secretEnding.hidden = !(state.visited.length === locations.length && state.hearts.length === locations.length);

    document.querySelectorAll(".map-node[data-location]").forEach(node => {
      node.classList.toggle("visited", state.visited.includes(node.dataset.location));
    });
  };

  const openLocation = slug => {
    active = locations.find(loc => loc.slug === slug);
    if (!active) return;
    modalImage.src = active.image;
    modalImage.alt = `${active.title} Sweet Vault card`;
    modalCardId.textContent = `${active.id} • LOCATION KEY`;
    modalTitle.textContent = active.title;
    modalStory.textContent = active.story;
    modalQuote.textContent = active.quote;
    stampButton.textContent = state.visited.includes(slug) ? "Passport Stamped ✓" : "Stamp My Passport";
    const found = state.hearts.includes(slug);
    hiddenHeart.classList.toggle("found", found);
    hiddenHeart.textContent = found ? "💖" : "♡";
    heartStatus.textContent = found ? active.reward : "Tap the glowing heart to collect it.";
    modal.showModal();
  };

  document.addEventListener("click", e => {
    const target = e.target.closest("[data-location]");
    if (target && !target.disabled) openLocation(target.dataset.location);
  });
  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".location-card")) {
      e.preventDefault();
      openLocation(e.target.dataset.location);
    }
  });

  modalClose.addEventListener("click", () => modal.close());
  modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

  stampButton.addEventListener("click", () => {
    if (!active || state.visited.includes(active.slug)) return;
    state.visited.push(active.slug);
    save();
    stampButton.textContent = "Passport Stamped ✓";
    evaluateBadges(true);
    render();
  });

  hiddenHeart.addEventListener("click", () => {
    if (!active || state.hearts.includes(active.slug)) return;
    state.hearts.push(active.slug);
    save();
    hiddenHeart.classList.add("found");
    hiddenHeart.textContent = "💖";
    heartStatus.textContent = active.reward;
    evaluateBadges(true);
    render();
  });

  menuButton.addEventListener("click", () => {
    const open = svNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  svNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    svNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));

  render();
})();
